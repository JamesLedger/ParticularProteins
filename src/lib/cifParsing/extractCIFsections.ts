import { readFile } from "fs/promises";

export default async function extractCIFsections(
  filepath: string
): Promise<string[]> {
  try {
    const content = await readFile(filepath, "utf8");

    if (!content) {
      throw new Error("File is empty");
    }

    // The different sections of the file are separated by "#"
    const sections = content.split("#");

    if (sections.length < 71) {
      throw new Error("File does not contain expected number of sections");
    }

    return sections;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract CIF sections: ${error.message}`);
    }
    throw new Error("Failed to extract CIF sections: Unknown error");
  }
}
