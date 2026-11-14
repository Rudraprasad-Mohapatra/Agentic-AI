import React from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig } from 'remotion';

export interface ThreeCanvasSceneProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  shadows?: boolean;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}

export const ThreeCanvasScene: React.FC<ThreeCanvasSceneProps> = ({
  children,
  backgroundColor = '#0F172A',
  shadows = true,
  fogColor = '#0F172A',
  fogNear = 12,
  fogFar = 55,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      orthographic={false}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor,
      }}
      shadows={shadows}
    >
      {/* Cinematic Fog for atmospheric 3D depth */}
      {fogColor && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}

      {/* Lighting Rig: Key, Fill, Rim & Ambient */}
      <ambientLight intensity={0.65} color="#CBD5E1" />
      
      {/* Main Key Sun Light with real shadow casting */}
      <directionalLight
        castShadow={shadows}
        position={[6, 14, 8]}
        intensity={2.4}
        color="#FFF6E5"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />

      {/* Warm Golden/Orange Rim Light for crisp character silhouette separation */}
      <directionalLight
        position={[-8, 6, -6]}
        intensity={1.8}
        color="#F59E0B"
      />

      {/* Cool Sky/Ground Hemisphere Fill */}
      <hemisphereLight
        args={['#93C5FD', '#1E293B', 0.9]}
      />

      {children}
    </ThreeCanvas>
  );
};
