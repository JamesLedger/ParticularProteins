import { writeFileSync } from "fs";
import atomSiteToCoordinate from "./atomSiteToCoordinate";
import extractCIFsections from "./extractCIFsections";
import stringToAtomSite from "./stringToAtomSite";

async function main() {
  const filepath = "1XPB.cif";

  const sections = await extractCIFsections(filepath);

  // The 69th section gives headers for the atom sites section
  const atomSitesHeaders = sections[68];
  console.log(atomSitesHeaders);

  // The 70th section is the atom sites section with all the coords info in it
  const atomSiteLines = sections[69]
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) => line && (line.startsWith("ATOM") || line.startsWith("HETATM"))
    );

  const atomSites: AtomSite[] = atomSiteLines.map(stringToAtomSite);
  console.log(`Found ${atomSites.length} atom sites`);

  const coordinates = atomSites.map(atomSiteToCoordinate);

  console.log("coords:\n", coordinates);

  writeFileSync("coordinates.json", JSON.stringify(coordinates, null, 2));
}

main();
