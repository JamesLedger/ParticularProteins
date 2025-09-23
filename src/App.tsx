import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import coordinates from "./lib/cifParsing/coordinates.json";
import Demo from "./components/3d/demo";

function App() {
  return (
    <div className="w-full flex justify-center">
      <Card className="w-xl">
        <CardHeader>
          <CardTitle>Particular Proteins</CardTitle>
          <CardDescription>
            Currently displaying the coordinates of the protein 1XPB.cif in 3D
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Demo />
          Raw coordinates data:
          <div className="max-h-96 overflow-y-auto bg-gray-100">
            <pre>{JSON.stringify(coordinates, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
