import { Button } from "../ui/button";

// Buttons to control canvas view
export function CanvasControls({ resetCamera }: { resetCamera?: () => void }) {
  return (
    <div className="mt-2">
      <Button onClick={resetCamera}>Reset View</Button>
    </div>
  );
}
