import { Canvas } from "@react-three/fiber";
import { CameraControls, Outlines } from "@react-three/drei";
import coordinates from "../../lib/cifParsing/coordinates.json";
import { useState } from "react";

function Demo({
  onSelect,
}: Readonly<{ onSelect?: (coord: Coordinate) => void }>) {
  return (
    <Canvas
      style={{ background: "white", width: "100%", height: "100%" }}
      camera={{ position: [-10, 0, 50] }}
    >
      <CameraControls />
      <ambientLight />

      {coordinates.map((coord, idx) => (
        <Element
          key={`${coord.element}-${idx}`}
          coords={coord}
          onSelect={onSelect}
        />
      ))}
    </Canvas>
  );
}

function Element({
  coords,
  onSelect,
}: Readonly<{
  coords: Coordinate;
  onSelect?: (coord: Coordinate) => void;
}>) {
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

  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      scale={0.2}
      position={[coords.x, coords.y, coords.z]}
      onClick={() => onSelect?.(coords)}
      onPointerEnter={() => {
        setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
      }}
    >
      <sphereGeometry />

      {/* The colour of the sphere is based on the element */}
      <meshBasicMaterial color={colour(coords.element)} />
      {hovered && (
        <Outlines screenspace={true} thickness={0.5} color="orange" />
      )}
    </mesh>
  );
}

export default Demo;
