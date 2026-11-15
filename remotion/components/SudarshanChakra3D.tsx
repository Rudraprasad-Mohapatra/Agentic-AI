import React from 'react';
import { useCurrentFrame } from 'remotion';
import * as THREE from 'three';

export interface SudarshanChakra3DProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

export const SudarshanChakra3D: React.FC<SudarshanChakra3DProps> = ({
  position = [0, 0, 0],
  scale = 1.0,
  rotationSpeed = 0.14,
}) => {
  const frame = useCurrentFrame();
  const spin = frame * rotationSpeed;

  return (
    <group position={position} scale={scale}>
      {/* ══════════ ROTATING SACRED CHAKRA DISC ══════════ */}
      <group rotation={[0, 0, spin]}>
        {/* Outer Golden Serrated Flame Blades (16 Flame Teeth) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const bladeX = Math.cos(angle) * 0.65;
          const bladeY = Math.sin(angle) * 0.65;
          return (
            <mesh
              key={`blade-${i}`}
              position={[bladeX, bladeY, 0]}
              rotation={[0, 0, angle - Math.PI / 4]}
            >
              <coneGeometry args={[0.09, 0.28, 4]} />
              <meshStandardMaterial
                color="#FBBF24"
                emissive="#F59E0B"
                emissiveIntensity={3.2}
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
          );
        })}

        {/* Outer Heavy Gold Rim */}
        <mesh>
          <ringGeometry args={[0.54, 0.64, 32]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#EAB308"
            emissiveIntensity={2.5}
            metalness={0.95}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner Gold Ring */}
        <mesh>
          <ringGeometry args={[0.38, 0.44, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 16 Sacred Radial Gold Spokes */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh
              key={`spoke-${i}`}
              position={[Math.cos(angle) * 0.26, Math.sin(angle) * 0.26, 0]}
              rotation={[0, 0, angle + Math.PI / 2]}
            >
              <planeGeometry args={[0.035, 0.45]} />
              <meshStandardMaterial
                color="#FEF08A"
                emissive="#FDE047"
                emissiveIntensity={1.8}
                metalness={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Central Celestial Lotus Core (Cyan / Sapphire Gem) */}
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[0.18, 24]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#0891B2"
            emissiveIntensity={4.0}
            metalness={0.7}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.09, 16]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
      </group>

      {/* Dynamic Golden Divine Light Radiating on Characters */}
      <pointLight intensity={6.5} distance={12} color="#FBBF24" />
      <pointLight intensity={4.0} distance={8} color="#06B6D4" />
    </group>
  );
};
