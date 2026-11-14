import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface PeepalTree3DProps {
  position?: [number, number, number];
  scale?: number;
}

export const PeepalTree3D: React.FC<PeepalTree3DProps> = ({
  position = [0, 0, 0],
  scale = 1.0,
}) => {
  // Generate sprawling leafy branch clusters
  const clusters = useMemo(() => {
    return [
      { pos: [0, 5.2, 0], s: 2.4, col: '#166534' },
      { pos: [-1.8, 4.4, 0.8], s: 1.8, col: '#15803D' },
      { pos: [1.8, 4.5, -0.6], s: 1.9, col: '#15803D' },
      { pos: [0.6, 5.8, 1.2], s: 1.7, col: '#22C55E' },
      { pos: [-1.2, 5.6, -1.0], s: 1.6, col: '#166534' },
      { pos: [2.2, 3.8, 1.4], s: 1.5, col: '#14532D' },
      { pos: [-2.4, 3.6, -1.2], s: 1.6, col: '#14532D' },
    ];
  }, []);

  // Hanging aerial roots
  const roots = useMemo(() => {
    return [
      { x: -1.2, z: 0.6, h: 3.8 },
      { x: 1.1, z: -0.8, h: 4.0 },
      { x: -0.8, z: -1.0, h: 3.5 },
      { x: 1.4, z: 0.7, h: 3.6 },
    ];
  }, []);

  return (
    <group position={position} scale={scale}>
      {/* ══════════ 1. MAIN TRUNK & ROOTS ══════════ */}
      {/* Base flared trunk */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.75, 1.25, 2.4, 12]} />
        <meshStandardMaterial color="#3E2723" roughness={0.92} />
      </mesh>
      {/* Upper twisted trunk */}
      <mesh castShadow position={[0, 3.0, 0]} rotation={[0.08, 0.1, -0.05]}>
        <cylinderGeometry args={[0.5, 0.75, 2.2, 10]} />
        <meshStandardMaterial color="#3E2723" roughness={0.92} />
      </mesh>

      {/* Hanging Aerial Roots */}
      {roots.map((r, i) => (
        <mesh key={`root-${i}`} position={[r.x, r.h / 2, r.z]} rotation={[0.05, 0, -0.04]}>
          <cylinderGeometry args={[0.04, 0.06, r.h, 6]} />
          <meshStandardMaterial color="#4E342E" roughness={0.95} />
        </mesh>
      ))}

      {/* ══════════ 2. SPRAWLING BARK BRANCHES ══════════ */}
      <mesh castShadow position={[-1.1, 3.8, 0.4]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.22, 0.35, 2.2, 8]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[1.1, 3.9, -0.3]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.22, 0.35, 2.2, 8]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>

      {/* ══════════ 3. LUSH SACRED FOLIAGE CLUSTERS ══════════ */}
      {clusters.map((c, i) => (
        <group key={`foliage-${i}`} position={c.pos as [number, number, number]}>
          {/* Main green leaf dome */}
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[c.s, 1]} />
            <meshStandardMaterial color={c.col} roughness={0.82} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
