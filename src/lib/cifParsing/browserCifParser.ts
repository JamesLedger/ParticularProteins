import stringToAtomSite from "./stringToAtomSite";
import atomSiteToCoordinate from "./atomSiteToCoordinate";

export type ProteinData = {
  coordinates: Coordinate[];
  metadata: ProteinMetadata;
};

export async function fetchPDBData(pdbId: string): Promise<ProteinData> {
  const url = `https://files.rcsb.org/download/${pdbId.toUpperCase()}.cif`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDB data: ${response.statusText}`);
    }

    const cifText = await response.text();
    const coordinates = parseCIFToCoordinates(cifText);
    const metadata = extractProteinMetadata(cifText);
    return { coordinates, metadata };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch PDB ${pdbId}: ${error.message}`);
    }
    throw new Error(`Failed to fetch PDB ${pdbId}: Unknown error`);
  }
}

export function parseCIFToCoordinates(cifContent: string): Coordinate[] {
  if (!cifContent) {
    throw new Error("CIF content is empty");
  }

  // Look for the _atom_site loop section
  // CIF files have a structure like:
  // loop_
  // _atom_site.group_PDB
  // _atom_site.id
  // ...
  // ATOM   1 N ...
  // ATOM   2 C ...

  const lines = cifContent.split("\n");
  let inAtomSiteLoop = false;
  const atomSiteLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

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

  return coordinates;
}

export function extractProteinMetadata(cifContent: string): ProteinMetadata {
  const metadata: ProteinMetadata = {};
  const lines = cifContent.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract common name from _entity_name_com.name
    if (line.startsWith("_entity_name_com.name")) {
      // The name can be on the same line or the next line
      const parts = line.split(/\s+/);
      if (parts.length > 1) {
        // Name is on the same line
        metadata.name = parts.slice(1).join(" ").replace(/['"]/g, "");
      } else if (i + 1 < lines.length) {
        // Name is on the next line
        metadata.name = lines[i + 1].trim().replace(/['"]/g, "");
      }
    }

    // Extract description from _entity.pdbx_description in loop
    if (line.startsWith("_entity.pdbx_description")) {
      // Look for the data lines after the loop_ header
      let j = i + 1;
      // Skip other _entity. headers
      while (j < lines.length && lines[j].trim().startsWith("_entity.")) {
        j++;
      }
      // Now we're at the data line
      if (j < lines.length) {
        const dataLine = lines[j].trim();
        // Parse the data line - description is typically the 4th field
        const fields = dataLine.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
        if (fields && fields.length >= 4) {
          metadata.description = fields[3].replace(/['"]/g, "");
        }
      }
    }
  }

  return metadata;
}
