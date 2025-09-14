import axios from "axios";

export const getFastaContent = async (pdbId: string): Promise<string> => {
  const url = `https://www.rcsb.org/fasta/entry/${pdbId}/display`;
  try {
    const response = await axios.get(url, {
      headers: { Accept: "text/plain" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to get FASTA file for ${pdbId}: ${error.response?.status}`
      );
    }
    throw error;
  }
};
