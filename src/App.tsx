import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProteinViewer from "./components/3d/protein-viewer-export";

function App() {
  return (
    <div className="w-full h-screen flex flex-col gap-4 p-4">
      <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">
        Particular Proteins
      </h1>
      <Card className="min-h-0">
        <CardHeader>
          <CardTitle>1XPB.cif</CardTitle>
          <CardDescription>
            Interactive 3D protein structure visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProteinViewer
            coordinatesUrl="/1XPB-coordinates.json"
            width="100%"
            height="50vh"
            showControls={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
