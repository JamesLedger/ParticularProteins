'use client';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Stage } from '@react-three/drei';
import { useState, useRef, useEffect, useCallback } from 'react';
import InstancedAtoms from './InstancedAtoms';

type Coordinate = {
  element: string;
  x: number;
  y: number;
  z: number;
};

interface ProteinViewerProps {
  coordinates?: Coordinate[];
  coordinatesUrl?: string;
  width?: number | string;
  height?: number | string;
  showControls?: boolean;
}

function ProteinCanvas({
  coordinates,
  onSelect,
  onCameraReady,
}: {
  coordinates: Coordinate[];
  onSelect?: (coord: Coordinate) => void;
  onCameraReady?: (resetFn: () => void) => void;
}) {
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
      style={{ background: 'var(--flexoki-950)', width: '100%', height: '100%' }}
      camera={{
        position: [-5, 0, 50],
        near: 0.01,
        far: 1000
      }}
    >
      <CameraControls ref={cameraControlsRef} makeDefault />
      <Stage adjustCamera={false}>
        <InstancedAtoms coordinates={coordinates} onSelect={onSelect} />
      </Stage>
    </Canvas>
  );
}

export default function ProteinViewer({
  coordinates: coordinatesProp,
  coordinatesUrl,
  width = 600,
  height = 400,
  showControls = true,
}: ProteinViewerProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>(coordinatesProp || []);
  const [isLoading, setIsLoading] = useState(!coordinatesProp && !!coordinatesUrl);
  const [error, setError] = useState<string | null>(null);
  const [selectedAtom, setSelectedAtom] = useState<Coordinate | null>(null);
  const [resetCameraFn, setResetCameraFn] = useState<(() => void) | null>(null);

  // If coordinates are provided as prop, use them directly
  useEffect(() => {
    if (coordinatesProp) {
      setCoordinates(coordinatesProp);
      setIsLoading(false);
      setError(null);
    }
  }, [coordinatesProp]);

  // If coordinatesUrl is provided, fetch from URL
  useEffect(() => {
    if (!coordinatesProp && coordinatesUrl) {
      const loadCoordinates = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(coordinatesUrl);
          if (!response.ok) {
            throw new Error('Failed to load protein data');
          }
          const data = await response.json();
          setCoordinates(data);
          setIsLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load protein data');
          setIsLoading(false);
        }
      };

      loadCoordinates();
    }
  }, [coordinatesUrl, coordinatesProp]);

  const handleCameraReady = useCallback((resetFn: () => void) => {
    setResetCameraFn(() => resetFn);
  }, []);

  const getElementName = (symbol: string) => {
    const names: Record<string, string> = {
      N: 'Nitrogen',
      C: 'Carbon',
      O: 'Oxygen',
      S: 'Sulfur',
      H: 'Hydrogen',
      P: 'Phosphorus',
    };
    return names[symbol] || symbol;
  };

  return (
    <div className='space-y-4'>
      <div
        className='relative border border-border rounded-lg overflow-hidden'
        style={{ width, height }}
      >
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10'>
            <div className='text-foreground text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
              <p>Loading protein structure...</p>
            </div>
          </div>
        )}

        {error && (
          <div className='absolute inset-0 flex items-center justify-center bg-destructive/50 backdrop-blur-sm z-10'>
            <div className='text-destructive-foreground text-center'>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <ProteinCanvas
            coordinates={coordinates}
            onSelect={setSelectedAtom}
            onCameraReady={handleCameraReady}
          />
        )}
      </div>

      <div className='text-sm text-muted-foreground text-center space-y-2'>
        <p>Drag to rotate • Scroll to zoom • Right-click to pan • Click atoms to select</p>

        {selectedAtom && (
          <div className='text-foreground bg-muted p-3 rounded-md'>
            <p className='font-semibold'>Selected Atom:</p>
            <p>
              Element: {getElementName(selectedAtom.element)} ({selectedAtom.element})
            </p>
            <p className='text-xs'>
              Position: ({selectedAtom.x.toFixed(2)}, {selectedAtom.y.toFixed(2)},{' '}
              {selectedAtom.z.toFixed(2)})
            </p>
          </div>
        )}

        {showControls && resetCameraFn && (
          <div className='flex justify-center'>
            <button
              onClick={resetCameraFn}
              className='px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors'
            >
              Reset View
            </button>
          </div>
        )}
      </div>

      <div className='text-xs text-muted-foreground text-center'>
        <p className='font-semibold mb-1'>Color Guide:</p>
        <div className='flex justify-center gap-3 flex-wrap'>
          <span>
            <span className='inline-block w-3 h-3 bg-blue-500 rounded-full mr-1'></span>Nitrogen
          </span>
          <span>
            <span className='inline-block w-3 h-3 bg-green-500 rounded-full mr-1'></span>Carbon
          </span>
          <span>
            <span className='inline-block w-3 h-3 bg-red-500 rounded-full mr-1'></span>Oxygen
          </span>
          <span>
            <span className='inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1'></span>Sulfur
          </span>
        </div>
      </div>
    </div>
  );
}
