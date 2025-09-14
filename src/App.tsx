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
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

function App() {
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
          <form className="flex flex-col gap-2 pb-4">
            <Input placeholder="Enter protein ID" />
            <Button type="submit">Submit</Button>
          </form>
          <div className="w-full pb-4">
            <AspectRatio ratio={1 / 1}>
              <div className="w-full h-full bg-red-500">ATCG ect</div>
            </AspectRatio>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
