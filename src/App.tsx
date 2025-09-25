import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Demo from "./components/3d/demo";
import { useState } from "react";

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

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">
        Particular Proteins
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>1XPB.cif</CardTitle>
          <CardDescription>
            Red is oxygen, blue is nitrogen, green is carbon
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full h-[500px] mb-2">
          <Demo onSelect={setSelected} />

          {selected && (
            <div className="mb-2 pb-2 text-sm text-gray-600 ">
              <span className="font-medium">Selected:</span>
              {symbolToName(selected.element)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
