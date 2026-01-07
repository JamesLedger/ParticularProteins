import stringToAtomSite from "./stringToAtomSite";
import atomSiteToCoordinate from "./atomSiteToCoordinate";

export async function fetchPDBData(pdbId: string): Promise<ProteinData> {
  const url = `https://files.rcsb.org/download/${pdbId.toUpperCase()}.cif`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDB data: ${response.statusText}`);
    }

    const cifText = await response.text();
    return parseCIFData(cifText);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch PDB ${pdbId}: ${error.message}`);
    }
    throw new Error(`Failed to fetch PDB ${pdbId}: Unknown error`);
  }
}

export function parseCIFData(cifContent: string): ProteinData {
  if (!cifContent) {
    throw new Error("CIF content is empty");
  }

  const lines = cifContent.split("\n");
  let inAtomSiteLoop = false;
  const atomSiteLines: string[] = [];
  const metadata: ProteinMetadata = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract the structure title
    if (line.startsWith("_struct.title")) {
      // Title can be on the same line or the next line
      // Format: _struct.title 'TITLE TEXT' or _struct.title\n'TITLE TEXT'
      const titleMatch = line.match(/^_struct\.title\s+(.+)$/);
      if (titleMatch) {
        metadata.title = cleanCIFString(titleMatch[1]);
      } else if (i + 1 < lines.length) {
        // Title is on the next line
        metadata.title = cleanCIFString(lines[i + 1].trim());
      }
    }

    // Check if we're entering the atom_site loop
    if (line.startsWith("_atom_site.")) {
      inAtomSiteLoop = true;
      continue;
    }

    // If we're in the atom_site loop and hit a line starting with ATOM or HETATM
    if (inAtomSiteLoop && (line.startsWith("ATOM") || line.startsWith("HETATM"))) {
      atomSiteLines.push(line);
      continue;
    }

    // If we were in the atom_site loop and hit a line that doesn't start with ATOM/HETATM
    // and isn't empty or a comment, we've left the loop
    if (inAtomSiteLoop && line && !line.startsWith("ATOM") && !line.startsWith("HETATM") && !line.startsWith("#") && !line.startsWith("_atom_site.")) {
      break;
    }
  }

  if (atomSiteLines.length === 0) {
    throw new Error("No atom data found in CIF file. Make sure this is a valid mmCIF format file.");
  }

  // Parse each line into an AtomSite object
  const atomSites: AtomSite[] = atomSiteLines.map(stringToAtomSite);

  // Convert to coordinate objects
  const coordinates = atomSites.map(atomSiteToCoordinate);

  return {
    coordinates,
    metadata,
  };
}

// Helper function to clean CIF string values (remove quotes and semicolons)
function cleanCIFString(value: string): string {
  let cleaned = value.trim();

  // Remove leading/trailing quotes or semicolons
  if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
      (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
    cleaned = cleaned.slice(1, -1);
  }

  // Handle multi-line strings that start/end with semicolon
  if (cleaned.startsWith(";")) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.endsWith(";")) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned.trim();
}

// Legacy function for backwards compatibility
export function parseCIFToCoordinates(cifContent: string): Coordinate[] {
  return parseCIFData(cifContent).coordinates;
}
