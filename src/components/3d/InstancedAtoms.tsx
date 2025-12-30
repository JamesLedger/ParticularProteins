import { useRef, useMemo, useState, useEffect } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { useFrame } from '@react-three/fiber';

type Coordinate = {
  element: string;
  x: number;
  y: number;
  z: number;
};

interface InstancedAtomsProps {
  coordinates: Coordinate[];
  onSelect?: (coord: Coordinate) => void;
}

interface AtomGroup {
  element: string;
  color: string;
  atoms: Array<{ coord: Coordinate; index: number }>;
}

function getElementColor(element: string): string {
  switch (element) {
    case 'N':
      return 'blue';
    case 'C':
      return 'green';
    case 'O':
      return 'red';
    case 'S':
      return 'yellow';
    default:
      return 'gray';
  }
}

function InstancedAtomGroup({
  group,
  onAtomHover,
  onAtomClick,
}: {
  group: AtomGroup;
  onAtomHover: (atom: { coord: Coordinate; index: number } | null) => void;
  onAtomClick: (atom: { coord: Coordinate; index: number }) => void;
}) {
  const meshRef = useRef<InstancedMesh>(null);

  // Set up instance matrices
  useEffect(() => {
    if (!meshRef.current) return;

    const tempObject = new Object3D();
    group.atoms.forEach((atom, i) => {
      tempObject.position.set(atom.coord.x, atom.coord.y, atom.coord.z);
      tempObject.scale.set(0.2, 0.2, 0.2);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [group.atoms]);

  const handlePointerMove = (event: any) => {
    event.stopPropagation();
    if (event.instanceId !== undefined && event.instanceId < group.atoms.length) {
      onAtomHover(group.atoms[event.instanceId]);
    }
  };

  const handlePointerOut = () => {
    onAtomHover(null);
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (event.instanceId !== undefined && event.instanceId < group.atoms.length) {
      onAtomClick(group.atoms[event.instanceId]);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, group.atoms.length]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, 16, 12]} />
      <meshBasicMaterial color={group.color} />
    </instancedMesh>
  );
}

export default function InstancedAtoms({ coordinates, onSelect }: InstancedAtomsProps) {
  const [hoveredAtom, setHoveredAtom] = useState<{ coord: Coordinate; index: number } | null>(null);
  const outlineMeshRef = useRef<InstancedMesh>(null);
  const tempOutlineObject = useMemo(() => new Object3D(), []);

  // Group coordinates by element type
  const atomGroups = useMemo(() => {
    const groups: { [key: string]: AtomGroup } = {};

    coordinates.forEach((coord, index) => {
      const element = coord.element;
      if (!groups[element]) {
        groups[element] = {
          element,
          color: getElementColor(element),
          atoms: [],
        };
      }
      groups[element].atoms.push({ coord, index });
    });

    return Object.values(groups);
  }, [coordinates]);

  // Update outline mesh for hovered atom
  useFrame(() => {
    if (!outlineMeshRef.current) return;

    if (hoveredAtom) {
      tempOutlineObject.position.set(hoveredAtom.coord.x, hoveredAtom.coord.y, hoveredAtom.coord.z);
      tempOutlineObject.scale.set(0.25, 0.25, 0.25);
      tempOutlineObject.updateMatrix();
      outlineMeshRef.current.setMatrixAt(0, tempOutlineObject.matrix);
      outlineMeshRef.current.instanceMatrix.needsUpdate = true;
      outlineMeshRef.current.visible = true;
    } else {
      outlineMeshRef.current.visible = false;
    }
  });

  const handleAtomClick = (atom: { coord: Coordinate; index: number }) => {
    if (onSelect) {
      onSelect(atom.coord);
    }
  };

  return (
    <>
      {atomGroups.map((group) => (
        <InstancedAtomGroup
          key={group.element}
          group={group}
          onAtomHover={setHoveredAtom}
          onAtomClick={handleAtomClick}
        />
      ))}

      {/* Shared outline mesh for all hovered atoms */}
      <instancedMesh
        ref={outlineMeshRef}
        args={[undefined, undefined, 1]}
        renderOrder={999}
        raycast={() => null}
      >
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial
          color="orange"
          wireframe
          wireframeLinewidth={2}
          depthTest={false}
        />
      </instancedMesh>
    </>
  );
}
