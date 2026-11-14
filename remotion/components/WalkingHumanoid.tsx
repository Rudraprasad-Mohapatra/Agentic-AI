import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';

export interface WalkingHumanoidProps {
  startPos?: [number, number, number];
  speed?: number; // meters per second
  strideRate?: number; // steps frequency
  skinColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  shoesColor?: string;
  hairColor?: string;
  scale?: number;
}

export const WalkingHumanoid: React.FC<WalkingHumanoidProps> = ({
  startPos = [0, 0, 0],
  speed = 2.4,
  strideRate = 5.8,
  skinColor = '#FAD2B8',
  shirtColor = '#2563EB',
  pantsColor = '#1E293B',
  shoesColor = '#0F172A',
  hairColor = '#3E2723',
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;
  const phase = t * strideRate;

  // Forward translation down the road (Z-axis)
  const zPos = startPos[2] - t * speed;

  // Realistic human walking kinematics:
  // 1. Vertical hip bob (2 drops per stride cycle)
  const hipBob = Math.sin(phase * 2) * 0.055;
  
  // 2. Lateral hip sway & torso counter-rotation
  const hipSwayX = Math.sin(phase) * 0.03;
  const torsoYaw = Math.sin(phase) * 0.09;
  const headYaw = -torsoYaw * 0.45;

  // 3. Legs alternating stride angles
  const legLAngle = Math.sin(phase) * 0.52;
  const legRAngle = -Math.sin(phase) * 0.52;

  // 4. Knees bend during the lift/recovery phase (never backwards)
  const kneeLAngle = Math.max(0, -Math.cos(phase)) * 0.85;
  const kneeRAngle = Math.max(0, Math.cos(phase)) * 0.85;

  // 5. Arms counter-swing opposite to legs
  const armLAngle = -Math.sin(phase) * 0.48;
  const armRAngle = Math.sin(phase) * 0.48;

  return (
    <group position={[startPos[0] + hipSwayX, startPos[1] + hipBob, zPos]} scale={scale}>
      {/* Dynamic contact blob shadow directly below character */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color="#000000" opacity={0.35} transparent depthWrite={false} />
      </mesh>

      {/* Main Body Root (Hips at ~0.95m height) */}
      <group position={[0, 0.95, 0]}>
        {/* Torso & Jacket */}
        <group rotation={[0.04, torsoYaw, 0]}>
          {/* Torso core */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <capsuleGeometry args={[0.22, 0.42, 8, 16]} />
            <meshStandardMaterial color={shirtColor} roughness={0.65} metalness={0.1} />
          </mesh>

          {/* Neck */}
          <mesh castShadow position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.14, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>

          {/* Head */}
          <group position={[0, 0.82, 0.02]} rotation={[0.02, headYaw, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.18, 24, 24]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>

            {/* Hair / Cap */}
            <mesh castShadow position={[0, 0.06, -0.02]}>
              <sphereGeometry args={[0.19, 20, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>

            {/* Stylized Face Features (Eyes) */}
            <mesh position={[-0.06, 0.02, 0.16]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshBasicMaterial color="#1E293B" />
            </mesh>
            <mesh position={[0.06, 0.02, 0.16]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshBasicMaterial color="#1E293B" />
            </mesh>
          </group>

          {/* Left Arm (Shoulder -> Forearm -> Hand) */}
          <group position={[-0.28, 0.50, 0]} rotation={[armLAngle, 0, 0.12]}>
            <mesh castShadow position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.065, 0.22, 6, 12]} />
              <meshStandardMaterial color={shirtColor} roughness={0.7} />
            </mesh>
            {/* Forearm & Hand */}
            <group position={[0, -0.30, 0]} rotation={[0.35, 0, 0]}>
              <mesh castShadow position={[0, -0.14, 0]}>
                <capsuleGeometry args={[0.055, 0.20, 6, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.8} />
              </mesh>
            </group>
          </group>

          {/* Right Arm (Shoulder -> Forearm -> Hand) */}
          <group position={[0.28, 0.50, 0]} rotation={[armRAngle, 0, -0.12]}>
            <mesh castShadow position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.065, 0.22, 6, 12]} />
              <meshStandardMaterial color={shirtColor} roughness={0.7} />
            </mesh>
            {/* Forearm & Hand */}
            <group position={[0, -0.30, 0]} rotation={[0.35, 0, 0]}>
              <mesh castShadow position={[0, -0.14, 0]}>
                <capsuleGeometry args={[0.055, 0.20, 6, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Left Leg (Hip -> Thigh -> Knee -> Shin -> Shoe) */}
        <group position={[-0.14, 0, 0]} rotation={[legLAngle, 0, 0]}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.09, 0.32, 6, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.75} />
          </mesh>
          <group position={[0, -0.42, 0]} rotation={[kneeLAngle, 0, 0]}>
            <mesh castShadow position={[0, -0.20, 0]}>
              <capsuleGeometry args={[0.075, 0.30, 6, 12]} />
              <meshStandardMaterial color={pantsColor} roughness={0.75} />
            </mesh>
            {/* Shoe */}
            <mesh castShadow position={[0, -0.42, 0.08]} rotation={[-legLAngle * 0.5, 0, 0]}>
              <boxGeometry args={[0.13, 0.10, 0.26]} />
              <meshStandardMaterial color={shoesColor} roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* Right Leg (Hip -> Thigh -> Knee -> Shin -> Shoe) */}
        <group position={[0.14, 0, 0]} rotation={[legRAngle, 0, 0]}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.09, 0.32, 6, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.75} />
          </mesh>
          <group position={[0, -0.42, 0]} rotation={[kneeRAngle, 0, 0]}>
            <mesh castShadow position={[0, -0.20, 0]}>
              <capsuleGeometry args={[0.075, 0.30, 6, 12]} />
              <meshStandardMaterial color={pantsColor} roughness={0.75} />
            </mesh>
            {/* Shoe */}
            <mesh castShadow position={[0, -0.42, 0.08]} rotation={[-legRAngle * 0.5, 0, 0]}>
              <boxGeometry args={[0.13, 0.10, 0.26]} />
              <meshStandardMaterial color={shoesColor} roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
