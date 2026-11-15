import React from 'react';
import { useCurrentFrame } from 'remotion';
import * as THREE from 'three';

export interface TeenBaan3DProps {
  position?: [number, number, number];
  scale?: number;
  glowIntensity?: number;
}

export const TeenBaan3D: React.FC<TeenBaan3DProps> = ({
  position = [0, 0, 0],
  scale = 1.0,
  glowIntensity = 3.5,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // Gentle levitation float
  const floatY = Math.sin(t * 2.2) * 0.04;
  const runeSpin = t * 1.8;

  return (
    <group position={[position[0], position[1] + floatY, position[2]]} scale={scale}>
      {/* ══════════ 1. GOLDEN TARGET MARKING ARROW (LEFT) ══════════ */}
      <group position={[-0.24, 0, 0]} rotation={[0, 0, -0.15]}>
        <mesh>
          <cylinderGeometry args={[0.016, 0.016, 1.1, 8]} />
          <meshStandardMaterial color="#FDE047" metalness={0.92} roughness={0.15} />
        </mesh>
        {/* Crystal Arrowhead */}
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.07, 0.24, 8]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#FBBF24"
            emissiveIntensity={glowIntensity}
          />
        </mesh>
        {/* Sacred Rune Ring */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, runeSpin, 0]}>
          <ringGeometry args={[0.13, 0.17, 16]} />
          <meshBasicMaterial color="#FBBF24" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ══════════ 2. PIERCING DIVINE ARROW (CENTER - RUBY) ══════════ */}
      <group position={[0, 0.08, 0.04]} rotation={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 1.25, 8]} />
          <meshStandardMaterial color="#FEF08A" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Ruby Arrowhead */}
        <mesh position={[0, 0.68, 0]}>
          <coneGeometry args={[0.08, 0.28, 8]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#DC2626"
            emissiveIntensity={glowIntensity * 1.3}
          />
        </mesh>
        {/* Sacred Crimson Rune Ring */}
        <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, -runeSpin * 1.2, 0]}>
          <ringGeometry args={[0.15, 0.2, 16]} />
          <meshBasicMaterial color="#EF4444" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ══════════ 3. RETRIEVING DIVINE ARROW (RIGHT - SAPPHIRE) ══════════ */}
      <group position={[0.24, 0, 0]} rotation={[0, 0, 0.15]}>
        <mesh>
          <cylinderGeometry args={[0.016, 0.016, 1.1, 8]} />
          <meshStandardMaterial color="#FDE047" metalness={0.92} roughness={0.15} />
        </mesh>
        {/* Sapphire Arrowhead */}
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.07, 0.24, 8]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={glowIntensity}
          />
        </mesh>
        {/* Sacred Cyan Rune Ring */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, runeSpin * 1.4, 0]}>
          <ringGeometry args={[0.13, 0.17, 16]} />
          <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Radiant Golden Light Aura */}
      <pointLight position={[0, 0.5, 0]} intensity={5.0} distance={10} color="#FBBF24" />
    </group>
  );
};
