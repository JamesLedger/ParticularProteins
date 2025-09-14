import "./App.css";
import { useState } from "react";
import { getFastaContent } from "@/lib/getFasta";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

function App() {
  const [pdbId, setPdbId] = useState("");
  const [fasta, setFasta] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFasta("");
    if (!pdbId.trim()) return;
    setLoading(true);
    try {
      const text = await getFastaContent(pdbId.trim());
      setFasta(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="w-xl">
        <CardHeader>
          <CardTitle>Particular Proteins</CardTitle>
          <CardDescription>
            This is where the proteins will live{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-2 pb-4" onSubmit={onSubmit}>
            <Input
              placeholder="Enter protein ID (e.g., 1CBS)"
              value={pdbId}
              onChange={(e) => setPdbId(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </form>
          {error && (
            <div className="text-red-600 text-sm pb-2" role="alert">
              {error}
            </div>
          )}
          {fasta && (
            <div className="w-full pb-4">
              <AspectRatio ratio={1}>
                <pre className="w-full h-full overflow-auto whitespace-pre-wrap break-words p-3 bg-muted rounded-md">
                  {fasta}
                </pre>
              </AspectRatio>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
