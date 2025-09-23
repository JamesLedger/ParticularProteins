import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import coordinates from "../../lib/cifParsing/coordinates.json";

function Demo() {
  return (
    <div>
      <Canvas style={{ background: "white", width: "500px", height: "500px" }}>
        <CameraControls makeDefault />
        <ambientLight />

        {coordinates.map((coord) => (
          <Element key={coord.element} coords={coord} />
        ))}
      </Canvas>
    </div>
  );
}

function Element({ coords }: { coords: Coordinate }) {
  const colour = (element: string) => {
    switch (element) {
      case "N":
        return "blue";
      case "C":
        return "green";
      case "O":
        return "red";
      case "S":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <mesh scale={0.1} position={[coords.x, coords.y, coords.z]}>
      <sphereGeometry />

      {/* The colour of the sphere is based on the element */}
      <meshBasicMaterial color={colour(coords.element)} />
    </mesh>
  );
}

export default Demo;
