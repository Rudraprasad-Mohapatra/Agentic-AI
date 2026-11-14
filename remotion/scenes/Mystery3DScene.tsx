import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvasScene } from '../components/ThreeCanvasScene';
import { CameraRig } from '../components/CameraRig';
import * as THREE from 'three';

export interface Mystery3DSceneProps {
  dateLabel?: string;
  locationLabel?: string;
}

export const Mystery3DScene: React.FC<Mystery3DSceneProps> = ({
  dateLabel = 'NOV 24, 1971',
  locationLabel = 'UNSOLVED CASE · FILE #840',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Gentle light flicker / hum
  const flicker = 1.0 + Math.sin(t * 24) * 0.08 + Math.cos(t * 37) * 0.05;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ThreeCanvasScene
        backgroundColor="#05070E"
        fogColor="#05070E"
        fogNear={6}
        fogFar={28}
        shadows={true}
      >
        <CameraRig
          mode="orbit"
          distance={4.2}
          initialPos={[0, 1.6, 4]}
          target={[0, 1.2, 0]}
          fov={42}
        />

        {/* Dark Damp Floor */}
        <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color="#0A0C14" roughness={0.95} />
        </mesh>

        {/* Back Mystery Wall */}
        <mesh position={[0, 4, -4]}>
          <planeGeometry args={[24, 10]} />
          <meshStandardMaterial color="#080B12" roughness={0.9} />
        </mesh>

        {/* Single Intense Overhead Cone Spotlight (Investigation style) */}
        <spotLight
          position={[0, 5.5, 0.5]}
          target-position={[0, 0, 0]}
          intensity={5.5 * flicker}
          angle={0.65}
          penumbra={0.8}
          color="#FFF1D6"
          castShadow
        />

        {/* Visible Light Cone Cone Geometry */}
        <mesh position={[0, 2.8, 0.25]} rotation={[0, 0, 0]}>
          <coneGeometry args={[1.8, 5.2, 32, 1, true]} />
          <meshBasicMaterial
            color="#FFF1D6"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* The Mystery Subject: Glowing Crimson Red Silhouetted Humanoid */}
        <group position={[0, 0, 0]}>
          {/* Torso */}
          <mesh castShadow position={[0, 1.25, 0]}>
            <capsuleGeometry args={[0.26, 0.65, 8, 16]} />
            <meshStandardMaterial
              color="#DC2626"
              emissive="#991B1B"
              emissiveIntensity={1.8}
              roughness={0.4}
            />
          </mesh>

          {/* Faceless Head */}
          <mesh castShadow position={[0, 1.88, 0]}>
            <sphereGeometry args={[0.19, 20, 20]} />
            <meshStandardMaterial
              color="#DC2626"
              emissive="#991B1B"
              emissiveIntensity={2.0}
              roughness={0.4}
            />
          </mesh>

          {/* Legs */}
          <mesh castShadow position={[-0.15, 0.45, 0]}>
            <capsuleGeometry args={[0.08, 0.7, 6, 12]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0.15, 0.45, 0]}>
            <capsuleGeometry args={[0.08, 0.7, 6, 12]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
        </group>
      </ThreeCanvasScene>

      {/* Typewriter Evidence Date Card Overlay (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: '60px',
          fontFamily: 'Courier New, monospace',
          color: '#F1F5F9',
          letterSpacing: '2px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: '32px', fontWeight: 900, color: '#EF4444' }}>
          ● {dateLabel}
        </div>
        <div style={{ fontSize: '22px', color: '#94A3B8', marginTop: '6px' }}>
          {locationLabel}
        </div>
      </div>
    </div>
  );
};
