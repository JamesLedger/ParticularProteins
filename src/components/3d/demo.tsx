import { Canvas } from "@react-three/fiber";
import { CameraControls, Outlines, Stage } from "@react-three/drei";
import coordinates from "../../lib/cifParsing/coordinates.json";
import { useState, useRef, useEffect, useCallback } from "react";

function Demo({
  onSelect,
  onCameraReady,
}: Readonly<{
  onSelect?: (coord: Coordinate) => void;
  onCameraReady?: (resetFn: () => void) => void;
}>) {
  const cameraControlsRef = useRef<CameraControls>(null);

  const resetCamera = useCallback(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.reset(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cameraControlsRef.current && onCameraReady) {
        onCameraReady(resetCamera);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [onCameraReady, resetCamera]);

  return (
    <Canvas
      style={{ background: "white", width: "100%", height: "100%" }}
      camera={{ position: [-5, 0, 50] }}
    >
      <CameraControls ref={cameraControlsRef} makeDefault />
      <Stage adjustCamera={false}>
        {coordinates.map((coord, idx) => (
          <Element
            key={`${coord.element}-${idx}`}
            coords={coord}
            onSelect={onSelect}
          />
        ))}
      </Stage>
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
