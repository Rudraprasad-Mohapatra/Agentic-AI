import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvasScene } from '../components/ThreeCanvasScene';
import { CameraRig } from '../components/CameraRig';
import { WalkingHumanoid } from '../components/WalkingHumanoid';
import * as THREE from 'three';

export interface WalkingRoadSceneProps {
  speed?: number; // meters per second
  cameraMode?: 'dolly' | 'orbit' | 'heroZoom' | 'sideTrack';
}

export const WalkingRoadScene: React.FC<WalkingRoadSceneProps> = ({
  speed = 2.4,
  cameraMode = 'dolly',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;
  const currentZ = -t * speed;

  // Road generation parameters
  const roadLength = 160;
  const roadWidth = 6.8;
  const sidewalkWidth = 3.6;

  // Generate repeating center dashes
  const dashes = useMemo(() => {
    const list: number[] = [];
    for (let z = 20; z > -roadLength; z -= 5.5) {
      list.push(z);
    }
    return list;
  }, [roadLength]);

  // Generate street lamps along sidewalks
  const lamps = useMemo(() => {
    const list: { x: number; z: number }[] = [];
    for (let z = 15; z > -roadLength; z -= 14) {
      list.push({ x: -(roadWidth / 2 + 1.2), z });
      list.push({ x: roadWidth / 2 + 1.2, z });
    }
    return list;
  }, [roadLength, roadWidth]);

  // Generate roadside trees for rich depth parallax
  const trees = useMemo(() => {
    const list: { x: number; z: number; scale: number; col: string }[] = [];
    const colors = ['#15803D', '#166534', '#14532D', '#1E3A8A'];
    for (let z = 18; z > -roadLength; z -= 8) {
      const scaleL = 0.85 + (Math.sin(z * 1.3) + 1) * 0.25;
      const scaleR = 0.85 + (Math.cos(z * 1.7) + 1) * 0.25;
      list.push({
        x: -(roadWidth / 2 + sidewalkWidth + 1.2 + Math.abs(Math.sin(z)) * 1.5),
        z,
        scale: scaleL,
        col: colors[Math.abs(Math.round(z)) % colors.length],
      });
      list.push({
        x: roadWidth / 2 + sidewalkWidth + 1.2 + Math.abs(Math.cos(z)) * 1.5,
        z: z - 3.5,
        scale: scaleR,
        col: colors[Math.abs(Math.round(z + 1)) % colors.length],
      });
    }
    return list;
  }, [roadLength, roadWidth, sidewalkWidth]);

  return (
    <ThreeCanvasScene
      backgroundColor="#0B1329"
      fogColor="#0B1329"
      fogNear={16}
      fogFar={70}
      shadows={true}
    >
      {/* Dynamic Camera tracking character down the 3D road */}
      <CameraRig
        mode={cameraMode}
        initialPos={[0, 1.85, 4.4]}
        target={[0, 1.15, 0]}
        distance={4.4}
        fov={40}
      />

      {/* The Walking 3D Character */}
      <WalkingHumanoid
        startPos={[0, 0, 0]}
        speed={speed}
        shirtColor="#3B82F6"
        pantsColor="#1E293B"
        skinColor="#FAD2B8"
        scale={1.05}
      />

      {/* ══════════ 3D ROAD & ENVIRONMENT ══════════ */}
      
      {/* 1. Asphalt Road Surface */}
      <mesh
        receiveShadow
        position={[0, 0, -roadLength / 2 + 10]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[roadWidth, roadLength + 40]} />
        <meshStandardMaterial
          color="#1E2430"
          roughness={0.88}
          metalness={0.12}
        />
      </mesh>

      {/* 2. Painted Center Road Dashes (Yellow) */}
      {dashes.map((z, i) => (
        <mesh
          key={`dash-${i}`}
          position={[0, 0.005, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.22, 2.6]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      ))}

      {/* 3. Solid Edge Lines (White) */}
      <mesh
        position={[-roadWidth / 2 + 0.35, 0.004, -roadLength / 2 + 10]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.16, roadLength + 40]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>
      <mesh
        position={[roadWidth / 2 - 0.35, 0.004, -roadLength / 2 + 10]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.16, roadLength + 40]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>

      {/* 4. Left & Right Raised Concrete Curbs */}
      <mesh
        receiveShadow
        castShadow
        position={[-(roadWidth / 2 + 0.15), 0.08, -roadLength / 2 + 10]}
      >
        <boxGeometry args={[0.3, 0.16, roadLength + 40]} />
        <meshStandardMaterial color="#64748B" roughness={0.7} />
      </mesh>
      <mesh
        receiveShadow
        castShadow
        position={[roadWidth / 2 + 0.15, 0.08, -roadLength / 2 + 10]}
      >
        <boxGeometry args={[0.3, 0.16, roadLength + 40]} />
        <meshStandardMaterial color="#64748B" roughness={0.7} />
      </mesh>

      {/* 5. Sidewalks (Left & Right) */}
      <mesh
        receiveShadow
        position={[-(roadWidth / 2 + sidewalkWidth / 2 + 0.3), 0.15, -roadLength / 2 + 10]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[sidewalkWidth, roadLength + 40]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh
        receiveShadow
        position={[roadWidth / 2 + sidewalkWidth / 2 + 0.3, 0.15, -roadLength / 2 + 10]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[sidewalkWidth, roadLength + 40]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* 6. Street Lamps with Emissive Glow and Downward Point Light */}
      {lamps.map((lamp, i) => (
        <group key={`lamp-${i}`} position={[lamp.x, 0.15, lamp.z]}>
          {/* Post base */}
          <mesh castShadow position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.14, 0.18, 0.5, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Main post */}
          <mesh castShadow position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 3.8, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Arm extending toward road */}
          <mesh
            castShadow
            position={[lamp.x < 0 ? 0.35 : -0.35, 4.15, 0]}
            rotation={[0, 0, lamp.x < 0 ? -0.4 : 0.4]}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Lantern Head */}
          <mesh position={[lamp.x < 0 ? 0.65 : -0.65, 4.0, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color="#FEF08A"
              emissive="#FBBF24"
              emissiveIntensity={2.5}
              roughness={0.2}
            />
          </mesh>
          {/* Downward Warm Point Light Pool */}
          <pointLight
            position={[lamp.x < 0 ? 0.65 : -0.65, 3.8, 0]}
            intensity={2.8}
            distance={16}
            color="#FDE047"
          />
        </group>
      ))}

      {/* 7. Stylized Roadside Trees (Parallax Scenery) */}
      {trees.map((tree, i) => (
        <group key={`tree-${i}`} position={[tree.x, 0.15, tree.z]} scale={tree.scale}>
          {/* Tree Trunk */}
          <mesh castShadow position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.18, 0.26, 2.4, 8]} />
            <meshStandardMaterial color="#3E2723" roughness={0.9} />
          </mesh>
          {/* Lower Foliage */}
          <mesh castShadow position={[0, 2.5, 0]}>
            <sphereGeometry args={[1.2, 12, 10]} />
            <meshStandardMaterial color={tree.col} roughness={0.85} />
          </mesh>
          {/* Upper Foliage */}
          <mesh castShadow position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.9, 10, 8]} />
            <meshStandardMaterial color={tree.col} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* 8. Distant City Skyline Silhouettes */}
      <group position={[0, 0, -roadLength + 15]}>
        {[-35, -24, -14, -4, 6, 16, 26, 38].map((x, i) => {
          const h = 14 + (Math.sin(i * 2.3) + 1) * 8;
          const w = 6 + (Math.cos(i * 1.7) + 1) * 3;
          return (
            <mesh key={`bldg-${i}`} position={[x, h / 2, 0]}>
              <boxGeometry args={[w, h, 8]} />
              <meshStandardMaterial color="#0A0F1E" roughness={0.9} />
            </mesh>
          );
        })}
      </group>
    </ThreeCanvasScene>
  );
};
