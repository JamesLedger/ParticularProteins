import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchPDBData } from "./lib/cifParsing/browserCifParser";
import ProteinViewer from "./components/3d/protein-viewer-export";

// Curated list of PDB IDs from RCSB PDB Molecule of the Month
const MOLECULE_OF_MONTH_PDBS = [
  "9mee", "7dtw", "3jrs", "6tap", "7vcf", "2x0b", "6tz4", "8eiq", "8g02", "2pe4",
  "7qv7", "7enc", "3fpz", "6j5t", "4jhw", "1t64", "5np0", "1opk", "8f76", "7qpd",
  "5a31", "5xh3", "1q83", "7tpt", "5hzg", "5xth", "3chn", "7lsy", "4fxf", "6pv7",
  "5t89", "6s7o", "5yh2", "7kj2", "6vz8", "4uv3", "6ahu", "1fdh", "1ckt", "6wlb",
  "6x9q", "1mro", "6crz", "3jb9", "5xnl", "6j8j", "6lu7", "6j4y", "2dhb", "1mbn"
];

function App() {
  // Check URL params for initial protein
  const urlParams = new URLSearchParams(window.location.search);
  const urlProtein = urlParams.get('protein') || '1XPB';

  const [pdbId, setPdbId] = useState(urlProtein);
  const [inputValue, setInputValue] = useState(urlProtein);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [metadata, setMetadata] = useState<ProteinMetadata>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load default protein on mount
  useEffect(() => {
    handleLoadProtein();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRandomProtein();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadProtein = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a PDB ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPDBData(inputValue.trim());
      setCoordinates(data.coordinates);
      setMetadata(data.metadata);
      const proteinId = inputValue.trim().toUpperCase();
      setPdbId(proteinId);
      setError(null);

      // Update URL for sharing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('protein', proteinId);
      window.history.replaceState({}, '', newUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load protein";
      const helpfulError = errorMessage.includes('404') || errorMessage.includes('not found')
        ? `Protein "${inputValue.trim()}" not found. Check the PDB ID or try a random protein.`
        : errorMessage.includes('network') || errorMessage.includes('fetch')
        ? 'Network error. Check your internet connection and try again.'
        : `Failed to load protein: ${errorMessage}`;
      setError(helpfulError);
      setCoordinates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoadProtein();
    }
  };

  const handleRandomProtein = async () => {
    const randomId = MOLECULE_OF_MONTH_PDBS[Math.floor(Math.random() * MOLECULE_OF_MONTH_PDBS.length)];
    setInputValue(randomId);
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPDBData(randomId);
      setCoordinates(data.coordinates);
      setMetadata(data.metadata);
      const proteinId = randomId.toUpperCase();
      setPdbId(proteinId);
      setError(null);

      // Update URL for sharing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('protein', proteinId);
      window.history.replaceState({}, '', newUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load protein";
      setError(`Failed to load random protein: ${errorMessage}. Try again!`);
      setCoordinates([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 p-4 pb-8">
      <h1 className="mb-0 text-balance font-medium text-3xl sm:text-5xl tracking-tighter!">
        Particular Proteins
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Protein Structure Viewer</CardTitle>
          <CardDescription>
            Enter a PDB ID to visualize protein structures in 3D
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <Input
              type="text"
              placeholder="Enter PDB ID (e.g., 1XPB)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full sm:w-48"
            />
            <div className="flex gap-2 items-center">
              <Button onClick={handleLoadProtein} disabled={isLoading}>
                {isLoading ? "Loading..." : "Load Protein"}
              </Button>
              <Button
                onClick={handleRandomProtein}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 via-green-500 via-red-500 to-yellow-500 hover:from-blue-600 hover:via-green-600 hover:via-red-600 hover:to-yellow-600 text-white"
              >
                Random
              </Button>
              <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">
                (press <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-foreground font-mono text-xs">R</kbd>)
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Loading protein structure...</p>
              </div>
            </div>
          )}

          {!isLoading && coordinates.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <p>
                  Viewing: <span className="font-semibold">{pdbId}</span> ({coordinates.length} atoms)
                </p>
                {metadata.title && (
                  <p className="text-xs mt-1 italic">{metadata.title}</p>
                )}
              </div>
              <ProteinViewer
                coordinates={coordinates}
                metadata={metadata}
                width="100%"
                height="min(50vh, 400px)"
                showControls={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
