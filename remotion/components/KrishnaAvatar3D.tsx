import React from 'react';
import { useCurrentFrame } from 'remotion';
import * as THREE from 'three';

export interface KrishnaAvatar3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isBrahmin?: boolean;
  divineAuraProgress?: number;
}

export const KrishnaAvatar3D: React.FC<KrishnaAvatar3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  isBrahmin = false,
  divineAuraProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // Divine float and halo rotation
  const floatY = Math.sin(t * 1.8) * 0.035;
  const haloRotate = t * 1.2;

  // Brahmin disguise vs Divine Form
  const isDivine = !isBrahmin || divineAuraProgress > 0.5;
  const skinColor = isDivine ? '#38BDF8' : '#D97706';
  const dhotiColor = isDivine ? '#FACC15' : '#FEF3C7';

  return (
    <group position={[position[0], position[1] + floatY, position[2]]} rotation={rotation} scale={scale}>
      {/* ══════════ 1. LOWER BODY: DHOTI ══════════ */}
      <group position={[0, 0, 0]}>
        {/* Left & Right Legs */}
        <mesh castShadow position={[-0.2, 0.55, 0]} rotation={[0, 0, -0.04]}>
          <capsuleGeometry args={[0.11, 0.85, 6, 12]} />
          <meshStandardMaterial color={dhotiColor} roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0.2, 0.55, 0]} rotation={[0, 0, 0.04]}>
          <capsuleGeometry args={[0.11, 0.85, 6, 12]} />
          <meshStandardMaterial color={dhotiColor} roughness={0.65} />
        </mesh>

        {/* Pleated Silk Waistband & Sash */}
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.28, 0.32, 0.28, 12]} />
          <meshStandardMaterial color={isDivine ? '#F59E0B' : '#B45309'} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.08, 0.75, 0.16]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.18, 0.52, 0.04]} />
          <meshStandardMaterial color={isDivine ? '#FBBF24' : '#E5E7EB'} roughness={0.5} />
        </mesh>
      </group>

      {/* ══════════ 2. TORSO: CELESTIAL SKIN & SASH ══════════ */}
      <group position={[0, 1.45, 0]}>
        {/* Torso */}
        <mesh castShadow position={[0, 0.05, 0]}>
          <capsuleGeometry args={[0.26, 0.52, 8, 16]} />
          <meshStandardMaterial
            color={skinColor}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {isBrahmin ? (
          // Humble Brahmin Shawl (Uttariya) & Sacred Thread (Yajnopavita)
          <group>
            <mesh position={[-0.05, 0.06, 0.13]} rotation={[0.2, 0, -0.35]}>
              <boxGeometry args={[0.36, 0.58, 0.1]} />
              <meshStandardMaterial color="#FFFBEB" roughness={0.9} />
            </mesh>
            {/* White Sacred Thread diagonally across chest */}
            <mesh position={[0.02, 0.04, 0.14]} rotation={[0, 0, 0.6]}>
              <cylinderGeometry args={[0.008, 0.008, 0.65, 4]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        ) : (
          // Radiant Golden Ornaments: Kaustubha Gem & Pearl Garland
          <group position={[0, 0.06, 0.16]}>
            {/* Pearl Necklace */}
            <mesh position={[0, 0.12, 0]}>
              <torusGeometry args={[0.16, 0.022, 8, 16]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Kaustubha Gem */}
            <mesh position={[0, 0, 0.08]}>
              <octahedronGeometry args={[0.08]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#0891B2"
                emissiveIntensity={3.0}
                roughness={0.1}
              />
            </mesh>
            {/* Gold Garland */}
            <mesh position={[0, -0.12, 0]}>
              <torusGeometry args={[0.2, 0.02, 8, 16]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.8} />
            </mesh>
          </group>
        )}

        {/* ══════════ 3. ARMS: ABHAYA MUDRA (BLESSING) & STAFF ══════════ */}
        {isBrahmin ? (
          // Brahmin holding sacred wooden staff (Danda)
          <group position={[0, 0, 0]}>
            {/* Left Arm holding staff */}
            <group position={[-0.34, 0, 0.1]} rotation={[0.3, 0, 0.2]}>
              <mesh castShadow position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.08, 0.42, 6, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.7} />
              </mesh>
              {/* Wooden Pilgrim Staff */}
              <mesh position={[-0.08, 0.2, 0.05]}>
                <cylinderGeometry args={[0.025, 0.03, 1.9, 8]} />
                <meshStandardMaterial color="#78350F" roughness={0.85} />
              </mesh>
            </group>

            {/* Right Arm relaxed at side */}
            <group position={[0.34, 0, 0]} rotation={[0, 0, -0.15]}>
              <mesh castShadow position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.08, 0.42, 6, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.7} />
              </mesh>
            </group>
          </group>
        ) : (
          // Divine Avatar: Right Hand in Abhaya Mudra, Left hand with Bansuri
          <group position={[0, 0, 0]}>
            {/* Right Arm: Raised in Abhaya Mudra (Blessing) */}
            <group position={[0.35, 0.08, 0.12]} rotation={[-0.4, 0, -0.25]}>
              {/* Upper Arm */}
              <mesh castShadow position={[0, 0.12, 0]}>
                <capsuleGeometry args={[0.08, 0.35, 6, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} />
              </mesh>
              {/* Forearm pointing upward */}
              <mesh castShadow position={[0.08, 0.35, 0.08]} rotation={[0.6, 0, 0.2]}>
                <capsuleGeometry args={[0.075, 0.32, 6, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} />
              </mesh>
              {/* Raised Blessing Palm facing viewer */}
              <mesh position={[0.1, 0.52, 0.18]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[0.12, 0.16, 0.03]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} />
              </mesh>
              {/* Blessing Lotus Glow */}
              <pointLight position={[0.1, 0.52, 0.22]} intensity={2.5} distance={5} color="#FEF08A" />
            </group>

            {/* Left Arm holding Golden Flute (Bansuri) */}
            <group position={[-0.35, 0, 0.1]} rotation={[0.4, 0, 0.3]}>
              <mesh castShadow position={[0, -0.2, 0]}>
                <capsuleGeometry args={[0.08, 0.42, 6, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} />
              </mesh>
              {/* Golden Flute */}
              <mesh position={[0.06, -0.32, 0.08]} rotation={[0.2, 0.4, 0.8]}>
                <cylinderGeometry args={[0.018, 0.018, 0.65, 8]} />
                <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          </group>
        )}

        {/* ══════════ 4. HEAD, MUKUT, PEACOCK FEATHER & HALO ══════════ */}
        <group position={[0, 0.58, 0.02]}>
          {/* Neck */}
          <mesh castShadow position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.09, 0.11, 0.18, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>

          {/* Serene Divine Face */}
          <mesh castShadow position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.19, 20, 20]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.08} />
          </mesh>

          {/* Chandan Urdhva Pundra Tilak on Forehead */}
          <mesh position={[0, 0.15, 0.18]}>
            <boxGeometry args={[0.03, 0.08, 0.015]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>

          {/* Brahmin Headwrap OR Divine Golden Mukut */}
          {isBrahmin ? (
            <mesh position={[0, 0.22, 0]}>
              <sphereGeometry args={[0.21, 16, 16]} />
              <meshStandardMaterial color="#FEF3C7" roughness={0.9} />
            </mesh>
          ) : (
            <group position={[0, 0.22, 0]}>
              {/* Golden Mukut */}
              <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.22, 0.16, 16]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.92} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0.16, 0.02]}>
                <coneGeometry args={[0.12, 0.28, 12]} />
                <meshStandardMaterial color="#FEF08A" metalness={0.95} roughness={0.1} />
              </mesh>

              {/* 🦚 ICONIC PEACOCK FEATHER (MAYUR PANKH) 🦚 */}
              <group position={[0, 0.38, -0.05]} rotation={[0.2, 0, 0.25]}>
                {/* Feather Stem */}
                <mesh position={[0, 0.15, 0]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.45, 6]} />
                  <meshStandardMaterial color="#047857" />
                </mesh>
                {/* Concentric Peacock Eye Circles */}
                <mesh position={[0, 0.32, 0.02]} rotation={[-0.2, 0, 0]}>
                  <circleGeometry args={[0.11, 16]} />
                  <meshBasicMaterial color="#065F46" side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 0.32, 0.03]} rotation={[-0.2, 0, 0]}>
                  <circleGeometry args={[0.075, 16]} />
                  <meshBasicMaterial color="#0284C7" side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 0.32, 0.04]} rotation={[-0.2, 0, 0]}>
                  <circleGeometry args={[0.04, 16]} />
                  <meshBasicMaterial color="#1E1B4B" side={THREE.DoubleSide} />
                </mesh>
              </group>
            </group>
          )}

          {/* ══════════ 5. ROTATING SUDARSHANA CHAKRA / GOLDEN HALO ══════════ */}
          {isDivine && (
            <group position={[0, 0.12, -0.22]} rotation={[0, 0, haloRotate]}>
              {/* Outer Golden Ring */}
              <mesh>
                <ringGeometry args={[0.48, 0.54, 32]} />
                <meshStandardMaterial
                  color="#FEF08A"
                  emissive="#FACC15"
                  emissiveIntensity={3.5}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* 16 Radiant Golden Sun Rays / Spokes */}
              {Array.from({ length: 16 }).map((_, idx) => {
                const spokeAngle = (idx / 16) * Math.PI * 2;
                return (
                  <mesh
                    key={`spoke-${idx}`}
                    position={[Math.cos(spokeAngle) * 0.27, Math.sin(spokeAngle) * 0.27, 0]}
                    rotation={[0, 0, spokeAngle + Math.PI / 2]}
                  >
                    <planeGeometry args={[0.025, 0.42]} />
                    <meshBasicMaterial color="#FDE047" side={THREE.DoubleSide} />
                  </mesh>
                );
              })}
              {/* Celestial Light Aura */}
              <pointLight intensity={6.0} distance={14} color="#38BDF8" />
              <pointLight intensity={4.5} distance={10} color="#FBBF24" />
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
