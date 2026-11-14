import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvasScene } from '../components/ThreeCanvasScene';
import { CameraRig } from '../components/CameraRig';
import * as THREE from 'three';

export interface Explainer3DSceneProps {
  xrayMode?: boolean;
}

export const Explainer3DScene: React.FC<Explainer3DSceneProps> = ({
  xrayMode = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Breathing expansion and heart pulsation
  const breathe = Math.sin(t * 2.8) * 0.08 + 1.0;
  const heartbeat = Math.sin(t * 8.0) > 0.6 ? 1.25 : 1.0;

  return (
    <ThreeCanvasScene
      backgroundColor="#020617"
      fogColor="#020617"
      fogNear={8}
      fogFar={30}
      shadows={true}
    >
      <CameraRig
        mode="heroZoom"
        initialPos={[0, 1.45, 3.2]}
        target={[0, 1.35, 0]}
        fov={36}
      />

      {/* Laboratory / Exam Room Studio Floor */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0B1222" roughness={0.8} />
      </mesh>

      {/* 3D Human Figure with Cyan Glass X-Ray Cutaway */}
      <group position={[0, 0, 0]}>
        {/* Legs */}
        <mesh position={[-0.18, 0.45, 0]}>
          <capsuleGeometry args={[0.08, 0.7, 6, 12]} />
          <meshPhysicalMaterial
            color={xrayMode ? '#38BDF8' : '#334155'}
            transparent
            opacity={xrayMode ? 0.4 : 0.9}
            roughness={0.2}
            transmission={xrayMode ? 0.6 : 0}
          />
        </mesh>
        <mesh position={[0.18, 0.45, 0]}>
          <capsuleGeometry args={[0.08, 0.7, 6, 12]} />
          <meshPhysicalMaterial
            color={xrayMode ? '#38BDF8' : '#334155'}
            transparent
            opacity={xrayMode ? 0.4 : 0.9}
            roughness={0.2}
            transmission={xrayMode ? 0.6 : 0}
          />
        </mesh>

        {/* Torso (Glass/X-ray Shell breathing) */}
        <group position={[0, 1.25, 0]} scale={[breathe, breathe, breathe]}>
          <mesh>
            <capsuleGeometry args={[0.26, 0.55, 8, 16]} />
            <meshPhysicalMaterial
              color="#0284C7"
              transparent
              opacity={0.35}
              roughness={0.1}
              transmission={0.8}
              ior={1.4}
            />
          </mesh>

          {/* Internal Organs: Glowing Cyan Lungs */}
          <group position={[0, 0.05, 0]}>
            <mesh position={[-0.10, 0, 0.02]}>
              <capsuleGeometry args={[0.07, 0.22, 6, 12]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#0284C7"
                emissiveIntensity={1.8}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0.10, 0, 0.02]}>
              <capsuleGeometry args={[0.07, 0.22, 6, 12]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#0284C7"
                emissiveIntensity={1.8}
                roughness={0.3}
              />
            </mesh>

            {/* Beating Heart in Crimson Red */}
            <mesh position={[-0.02, 0.02, 0.06]} scale={heartbeat}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial
                color="#EF4444"
                emissive="#DC2626"
                emissiveIntensity={2.5}
                roughness={0.2}
              />
            </mesh>
          </group>

          {/* Spine Column */}
          {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
            <mesh key={`vert-${i}`} position={[0, y, -0.08]}>
              <cylinderGeometry args={[0.035, 0.04, 0.06, 8]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* Head */}
        <mesh position={[0, 1.82, 0]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshPhysicalMaterial
            color="#38BDF8"
            transparent
            opacity={0.45}
            roughness={0.2}
            transmission={0.5}
          />
        </mesh>
      </group>
    </ThreeCanvasScene>
  );
};
