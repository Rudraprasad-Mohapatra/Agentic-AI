import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import * as THREE from 'three';

export interface BattlefieldEnv3DProps {
  showTorches?: boolean;
  showFlags?: boolean;
  showEmbers?: boolean;
  showDistantArmy?: boolean;
  groundColor?: string;
}

export const BattlefieldEnv3D: React.FC<BattlefieldEnv3DProps> = ({
  showTorches = true,
  showFlags = true,
  showEmbers = true,
  showDistantArmy = true,
  groundColor = '#1F140E',
}) => {
  const frame = useCurrentFrame();

  // Floating glowing ember particles
  const embers = useMemo(() => {
    const list: { x: number; y: number; z: number; speed: number; phase: number; size: number }[] = [];
    for (let i = 0; i < 35; i++) {
      list.push({
        x: (Math.sin(i * 12.3) * 6),
        y: (Math.abs(Math.sin(i * 3.7)) * 4),
        z: (Math.cos(i * 7.1) * 6) - 1,
        speed: 0.015 + (Math.abs(Math.sin(i)) * 0.02),
        phase: i * 0.4,
        size: 0.03 + (Math.abs(Math.cos(i)) * 0.04),
      });
    }
    return list;
  }, []);

  // Torch positions
  const torchPositions: [number, number, number][] = [
    [-4.5, 0, 1.5],
    [4.5, 0, 1.5],
    [-6.0, 0, -4.0],
    [6.0, 0, -4.0],
  ];

  // War banners
  const flagPositions: [number, number, number, string][] = [
    [-5.2, 0, -6.0, '#DC2626'],
    [-2.8, 0, -8.5, '#F59E0B'],
    [2.8, 0, -8.5, '#DC2626'],
    [5.2, 0, -6.0, '#F59E0B'],
  ];

  return (
    <group>
      {/* ══════════ 1. KURUKSHETRA EARTH GROUND ══════════ */}
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120, 32, 32]} />
        <meshStandardMaterial color={groundColor} roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Decorative Ground Rocks & Mounds */}
      {[-3, -1.5, 2, 3.5].map((rx, idx) => (
        <mesh
          key={`rock-${idx}`}
          position={[rx * 1.4, 0.08, -2 - idx * 1.2]}
          rotation={[0.2, idx * 1.1, 0.1]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.25 + (idx % 2) * 0.12]} />
          <meshStandardMaterial color="#372418" roughness={0.95} />
        </mesh>
      ))}

      {/* ══════════ 2. WAR TORCHES (MASHAALS) WITH FLICKERING FLAMES ══════════ */}
      {showTorches &&
        torchPositions.map(([tx, ty, tz], i) => {
          const flameFlicker = Math.sin(frame * 0.35 + i * 2.1) * 0.15;
          const lightFlicker = Math.sin(frame * 0.45 + i * 1.7) * 0.6;
          return (
            <group key={`torch-${i}`} position={[tx, ty, tz]}>
              {/* Wooden Pole */}
              <mesh castShadow position={[0, 1.1, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 2.2, 8]} />
                <meshStandardMaterial color="#3E2723" roughness={0.9} />
              </mesh>
              {/* Iron Cauldron */}
              <mesh position={[0, 2.18, 0]}>
                <cylinderGeometry args={[0.16, 0.08, 0.22, 10]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.4} />
              </mesh>
              {/* Animated Fire Flame Mesh */}
              <mesh position={[0, 2.38 + flameFlicker * 0.3, 0]} scale={[1 + flameFlicker, 1.2 + flameFlicker * 1.5, 1 + flameFlicker]}>
                <coneGeometry args={[0.14, 0.38, 8]} />
                <meshBasicMaterial color="#FF7A00" />
              </mesh>
              <mesh position={[0, 2.34, 0]} scale={[0.8, 1.0, 0.8]}>
                <coneGeometry args={[0.09, 0.28, 8]} />
                <meshBasicMaterial color="#FFEB3B" />
              </mesh>
              {/* Dynamic Flickering Warm Point Light */}
              <pointLight
                position={[0, 2.45, 0]}
                intensity={2.8 + lightFlicker}
                distance={10}
                color="#F59E0B"
                castShadow
              />
            </group>
          );
        })}

      {/* ══════════ 3. BILLOWING WAR BANNERS ══════════ */}
      {showFlags &&
        flagPositions.map(([fx, fy, fz, color], i) => {
          const windSway = Math.sin(frame * 0.12 + i * 1.5) * 0.18;
          return (
            <group key={`flag-${i}`} position={[fx, fy, fz]}>
              {/* Tall Banner Spear Pole */}
              <mesh castShadow position={[0, 2.6, 0]}>
                <cylinderGeometry args={[0.035, 0.045, 5.2, 8]} />
                <meshStandardMaterial color="#78350F" metalness={0.4} />
              </mesh>
              {/* Golden Spearhead */}
              <mesh position={[0, 5.25, 0]}>
                <coneGeometry args={[0.08, 0.3, 8]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Fluttering Flag Cloth */}
              <group position={[0.5, 4.4, 0]} rotation={[0, windSway, 0]}>
                <mesh castShadow position={[0, 0, 0]}>
                  <boxGeometry args={[1.0, 0.65, 0.02]} />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.7}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Gold Fringe Trim */}
                <mesh position={[0, -0.34, 0]}>
                  <boxGeometry args={[1.02, 0.04, 0.03]} />
                  <meshStandardMaterial color="#FBBF24" metalness={0.8} />
                </mesh>
              </group>
            </group>
          );
        })}

      {/* ══════════ 4. RISING GLOWING EMBERS ══════════ */}
      {showEmbers &&
        embers.map((emb, idx) => {
          const currentY = ((emb.y + (frame * emb.speed) + emb.phase) % 5.5);
          const currentX = emb.x + Math.sin(frame * 0.05 + idx) * 0.35;
          const currentZ = emb.z + Math.cos(frame * 0.04 + idx) * 0.35;
          const opacity = Math.sin((currentY / 5.5) * Math.PI);
          return (
            <mesh key={`emb-${idx}`} position={[currentX, currentY, currentZ]}>
              <sphereGeometry args={[emb.size, 6, 6]} />
              <meshBasicMaterial
                color="#FBBF24"
                transparent
                opacity={Math.max(0.2, opacity * 0.85)}
              />
            </mesh>
          );
        })}

      {/* ══════════ 5. DISTANT ARMY SILHOUETTES (ATMOSPHERIC DEPTH) ══════════ */}
      {showDistantArmy && (
        <group position={[0, 0, -14]}>
          {/* Layer of Spears & Chariot silhouettes at the horizon */}
          {[-12, -8, -4, 0, 4, 8, 12].map((ax, idx) => (
            <group key={`army-${idx}`} position={[ax, 0, (idx % 2) * -1.5]}>
              {/* Soldier silhouette cluster */}
              <mesh position={[0, 1.2, 0]}>
                <capsuleGeometry args={[0.25, 1.1, 4, 8]} />
                <meshBasicMaterial color="#0F0C0A" />
              </mesh>
              {/* Cluster of spears pointing up */}
              {[-0.3, 0.1, 0.35].map((spx, sidx) => (
                <mesh key={`sp-${sidx}`} position={[spx, 2.2, 0]} rotation={[0, 0, (sidx - 1) * 0.08]}>
                  <cylinderGeometry args={[0.015, 0.015, 2.4, 4]} />
                  <meshBasicMaterial color="#1A1410" />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
