import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Demo from "./components/3d/demo";
import { useState, useCallback } from "react";
import { CanvasControls } from "./components/3d/controls";

function symbolToName(id: string): string {
  switch (id) {
    case "N":
      return "Nitrogen";
    case "C":
      return "Carbon";
    case "O":
      return "Oxygen";
    case "S":
      return "Sulfur";
    case "H":
      return "Hydrogen";
    case "P":
      return "Phosphorus";
  }
  return id;
}

function App() {
  const [selected, setSelected] = useState<Coordinate | null>(null);
  const [resetCamera, setResetCamera] = useState<(() => void) | null>(null);

  const handleCameraReady = useCallback((resetFn: () => void) => {
    setResetCamera(() => resetFn);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-4">
      <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">
        Particular Proteins
      </h1>
      <Card className="min-h-0">
        <CardHeader>
          <CardTitle>1XPB.cif</CardTitle>
          <CardDescription>
            Red is oxygen, blue is nitrogen, green is carbon
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-2 flex flex-col">
          <div className="h-[50vh] min-h-0">
            <Demo onSelect={setSelected} onCameraReady={handleCameraReady} />
          </div>

          {selected && (
            <div className="mb-2 pb-2 text-sm text-gray-600">
              <span className="font-medium">Selected:</span>
              {symbolToName(selected.element)}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <CanvasControls resetCamera={resetCamera || undefined} />
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
