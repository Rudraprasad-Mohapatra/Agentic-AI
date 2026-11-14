import React from 'react';
import { useCurrentFrame } from 'remotion';
import * as THREE from 'three';

export interface BarbarikWarrior3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  pose?: 'heroic' | 'holdingArrows' | 'aiming' | 'kneeling';
  glowIntensity?: number;
}

export const BarbarikWarrior3D: React.FC<BarbarikWarrior3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  pose = 'heroic',
  glowIntensity = 2.5,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // Realistic warrior kinematics
  const breathe = Math.sin(t * 2.2) * 0.025;
  const hairWind = Math.sin(t * 3.5) * 0.12;
  const runeSpin = t * 2.0;

  const isKneeling = pose === 'kneeling';
  const isAiming = pose === 'aiming';

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ══════════ 1. LOWER BODY: DHOTI & GREAVES ══════════ */}
      {isKneeling ? (
        // Respectful Kneeling Pose
        <group position={[0, 0.35, 0]}>
          {/* Folded Knees */}
          <mesh castShadow position={[-0.22, -0.12, 0.18]} rotation={[Math.PI / 2.2, 0, 0.12]}>
            <capsuleGeometry args={[0.13, 0.52, 6, 12]} />
            <meshStandardMaterial color="#B45309" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0.22, -0.12, 0.18]} rotation={[Math.PI / 2.2, 0, -0.12]}>
            <capsuleGeometry args={[0.13, 0.52, 6, 12]} />
            <meshStandardMaterial color="#B45309" roughness={0.7} />
          </mesh>
          {/* Golden Dhoti Folds on Ground */}
          <mesh position={[0, -0.1, 0.08]} castShadow>
            <boxGeometry args={[0.65, 0.32, 0.5]} />
            <meshStandardMaterial color="#D97706" roughness={0.6} metalness={0.25} />
          </mesh>
          {/* Prayer Mat Border */}
          <mesh position={[0, -0.26, 0.1]}>
            <boxGeometry args={[0.85, 0.05, 0.7]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
        </group>
      ) : isAiming ? (
        // Dynamic Archer Stance (feet spread, side profile)
        <group position={[0, 0, 0]}>
          {/* Front Left Leg leaning into shot */}
          <mesh castShadow position={[-0.32, 0.52, 0.15]} rotation={[0.1, 0, -0.18]}>
            <capsuleGeometry args={[0.12, 0.85, 6, 12]} />
            <meshStandardMaterial color="#B45309" roughness={0.65} />
          </mesh>
          {/* Back Right Leg planted firmly */}
          <mesh castShadow position={[0.35, 0.52, -0.18]} rotation={[-0.1, 0, 0.22]}>
            <capsuleGeometry args={[0.12, 0.85, 6, 12]} />
            <meshStandardMaterial color="#B45309" roughness={0.65} />
          </mesh>
          {/* Golden Shin Guards */}
          <mesh position={[-0.35, 0.32, 0.2]}>
            <cylinderGeometry args={[0.13, 0.11, 0.42, 8]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.38, 0.32, -0.22]}>
            <cylinderGeometry args={[0.13, 0.11, 0.42, 8]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Royal Saffron Dhoti Belt */}
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.3, 0.34, 0.32, 12]} />
            <meshStandardMaterial color="#D97706" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ) : (
        // Standard Majestic Warrior Stance
        <group position={[0, 0, 0]}>
          {/* Left & Right Legs */}
          <mesh castShadow position={[-0.22, 0.55, 0]} rotation={[0, 0, -0.05]}>
            <capsuleGeometry args={[0.12, 0.85, 6, 12]} />
            <meshStandardMaterial color="#B45309" roughness={0.65} />
          </mesh>
          <mesh castShadow position={[0.22, 0.55, 0]} rotation={[0, 0, 0.05]}>
            <capsuleGeometry args={[0.12, 0.85, 6, 12]} />
            <meshStandardMaterial color="#B45309" roughness={0.65} />
          </mesh>
          {/* Golden Greaves */}
          <mesh position={[-0.23, 0.35, 0.04]}>
            <cylinderGeometry args={[0.13, 0.11, 0.42, 8]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.23, 0.35, 0.04]}>
            <cylinderGeometry args={[0.13, 0.11, 0.42, 8]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Royal Pleated Gold Waistband */}
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.3, 0.34, 0.32, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Central Embroidered Sash */}
          <mesh position={[0, 0.78, 0.19]}>
            <boxGeometry args={[0.2, 0.5, 0.04]} />
            <meshStandardMaterial color="#DC2626" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* ══════════ 2. TORSO & GOLDEN KAVACH (ARMOR) ══════════ */}
      <group position={[0, isKneeling ? 0.95 : 1.45, 0]} scale={[1 + breathe, 1 + breathe, 1 + breathe]}>
        {/* Muscular Torso */}
        <mesh castShadow position={[0, 0.05, 0]}>
          <capsuleGeometry args={[0.28, 0.52, 8, 16]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.7} />
        </mesh>

        {/* Sculpted Golden Breastplate (Kavach) */}
        <group position={[0, 0.08, 0.06]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.29, 0.27, 0.48, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Embossed Golden Surya (Sun) Medallion */}
          <mesh position={[0, 0.06, 0.25]}>
            <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} />
            <meshStandardMaterial color="#FEF08A" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Red Gemstone in Medallion Center */}
          <mesh position={[0, 0.06, 0.28]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#DC2626" emissive="#991B1B" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* Royal Red Sash (Angavastram) draped over left shoulder */}
        <mesh position={[-0.08, 0.1, 0.14]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.16, 0.65, 0.05]} />
          <meshStandardMaterial color="#DC2626" roughness={0.8} />
        </mesh>

        {/* Tiered Golden Shoulder Pauldrons */}
        <group position={[-0.38, 0.26, 0]}>
          <mesh castShadow rotation={[0, 0, 0.25]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
        <group position={[0.38, 0.26, 0]}>
          <mesh castShadow rotation={[0, 0, -0.25]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* ══════════ 3. HEAD, MUKUT (CROWN) & HAIR ══════════ */}
        <group position={[0, 0.58, 0.02]}>
          {/* Neck */}
          <mesh castShadow position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 0.18, 12]} />
            <meshStandardMaterial color="#D97706" roughness={0.8} />
          </mesh>
          {/* Golden Necklace (Kanthi Haar) */}
          <mesh position={[0, -0.1, 0.02]}>
            <torusGeometry args={[0.13, 0.025, 8, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Heroic Face */}
          <mesh castShadow position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshStandardMaterial color="#E09F67" roughness={0.7} />
          </mesh>

          {/* Tilak on Forehead (Vermillion Red & White Chandan) */}
          <mesh position={[0, 0.14, 0.19]}>
            <boxGeometry args={[0.035, 0.09, 0.015]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>

          {/* Golden Warrior Mukut (Tiered Crown) */}
          <group position={[0, 0.22, 0]}>
            {/* Crown Base Ring */}
            <mesh castShadow>
              <cylinderGeometry args={[0.21, 0.23, 0.12, 16]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.92} roughness={0.15} />
            </mesh>
            {/* Pointed Central Crest */}
            <mesh position={[0, 0.18, 0.04]}>
              <coneGeometry args={[0.13, 0.32, 12]} />
              <meshStandardMaterial color="#FEF08A" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Glowing Ruby Gem in Mukut */}
            <mesh position={[0, 0.08, 0.21]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color="#EF4444" emissive="#B91C1C" emissiveIntensity={2.5} />
            </mesh>
          </group>

          {/* Flowing Black Warrior Hair with Wind Sway */}
          <group position={[0, 0.02, -0.1]} rotation={[0.1 + hairWind * 0.4, hairWind, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.19, 0.45, 6, 12]} />
              <meshStandardMaterial color="#171717" roughness={0.95} />
            </mesh>
          </group>
        </group>

        {/* ══════════ 4. ARMS, BOW & DIVINE ARROWS ══════════ */}
        {isKneeling ? (
          // Anjali Mudra (Folded Hands in Humble Devotion)
          <group position={[0, 0.12, 0.24]}>
            {/* Left Arm folded forward */}
            <mesh castShadow position={[-0.14, 0, -0.06]} rotation={[0.8, -0.4, 0.3]}>
              <capsuleGeometry args={[0.08, 0.35, 6, 10]} />
              <meshStandardMaterial color="#D97706" roughness={0.75} />
            </mesh>
            {/* Right Arm folded forward */}
            <mesh castShadow position={[0.14, 0, -0.06]} rotation={[0.8, 0.4, -0.3]}>
              <capsuleGeometry args={[0.08, 0.35, 6, 10]} />
              <meshStandardMaterial color="#D97706" roughness={0.75} />
            </mesh>
            {/* Two Joined Palms (Namaste) */}
            <mesh position={[0, 0.12, 0.08]}>
              <boxGeometry args={[0.09, 0.16, 0.05]} />
              <meshStandardMaterial color="#E09F67" roughness={0.7} />
            </mesh>
          </group>
        ) : isAiming ? (
          // Aiming Curved Bow
          <group position={[0, 0.1, 0]}>
            {/* Left Arm fully extended holding bow */}
            <mesh castShadow position={[-0.48, 0.12, 0.3]} rotation={[0.1, -0.8, 0]}>
              <capsuleGeometry args={[0.085, 0.5, 6, 12]} />
              <meshStandardMaterial color="#D97706" roughness={0.75} />
            </mesh>
            {/* Golden Recurve Bow */}
            <group position={[-0.75, 0.12, 0.5]} rotation={[0, 0.6, 0]}>
              {/* Bow Limbs */}
              <mesh>
                <torusGeometry args={[0.65, 0.035, 8, 24, Math.PI * 0.95]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Bow String */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 1.25, 4]} />
                <meshBasicMaterial color="#FEF08A" />
              </mesh>
            </group>
            {/* Right Arm bent pulling string back */}
            <mesh castShadow position={[0.26, 0.12, 0.08]} rotation={[0.4, 0.9, -0.4]}>
              <capsuleGeometry args={[0.085, 0.42, 6, 12]} />
              <meshStandardMaterial color="#D97706" roughness={0.75} />
            </mesh>
            {/* Nocked Glowing Divine Arrow */}
            <group position={[-0.32, 0.12, 0.3]} rotation={[0, -0.65, 0]}>
              <mesh>
                <cylinderGeometry args={[0.016, 0.016, 1.1, 8]} />
                <meshStandardMaterial color="#FEF08A" metalness={0.9} />
              </mesh>
              {/* Arrowhead */}
              <mesh position={[0, 0.58, 0]}>
                <coneGeometry args={[0.065, 0.22, 8]} />
                <meshStandardMaterial
                  color="#FBBF24"
                  emissive="#F59E0B"
                  emissiveIntensity={3.5}
                />
              </mesh>
              <pointLight position={[0, 0.58, 0]} intensity={3.5} distance={8} color="#FBBF24" />
            </group>
          </group>
        ) : (
          // Heroic Pose: Left hand on bow, Right hand holding the 3 Divine Arrows
          <group position={[0, 0.1, 0]}>
            {/* Left Arm resting on bow */}
            <group position={[-0.42, -0.05, 0]} rotation={[0, 0, 0.35]}>
              <mesh castShadow position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.085, 0.45, 6, 12]} />
                <meshStandardMaterial color="#D97706" roughness={0.75} />
              </mesh>
              {/* Golden Vambrace */}
              <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.095, 0.085, 0.22, 8]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>

            {/* Right Arm raised holding the 3 Divine Arrows */}
            <group position={[0.42, 0.08, 0.1]} rotation={[-0.4, 0.2, -0.45]}>
              <mesh castShadow position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.085, 0.45, 6, 12]} />
                <meshStandardMaterial color="#D97706" roughness={0.75} />
              </mesh>
              {/* Golden Vambrace */}
              <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.095, 0.085, 0.22, 8]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
              </mesh>

              {/* ══════════ THE THREE DIVINE ARROWS (TEEN BAAN) ══════════ */}
              <group position={[0, -0.48, 0.12]} rotation={[0.4, 0, 0]}>
                {/* Arrow 1: Golden Target Marking Arrow */}
                <group position={[-0.1, 0.4, 0]} rotation={[0, 0, -0.15]}>
                  <mesh>
                    <cylinderGeometry args={[0.016, 0.016, 0.95, 8]} />
                    <meshStandardMaterial color="#FDE047" metalness={0.9} />
                  </mesh>
                  <mesh position={[0, 0.52, 0]}>
                    <coneGeometry args={[0.065, 0.22, 8]} />
                    <meshStandardMaterial
                      color="#FEF08A"
                      emissive="#FBBF24"
                      emissiveIntensity={glowIntensity}
                    />
                  </mesh>
                  {/* Rotating Rune Ring */}
                  <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, runeSpin, 0]}>
                    <ringGeometry args={[0.12, 0.16, 16]} />
                    <meshBasicMaterial color="#FBBF24" side={THREE.DoubleSide} />
                  </mesh>
                </group>

                {/* Arrow 2: Piercing Arrow (Center) */}
                <group position={[0, 0.46, 0.04]} rotation={[0, 0, 0]}>
                  <mesh>
                    <cylinderGeometry args={[0.018, 0.018, 1.05, 8]} />
                    <meshStandardMaterial color="#FEF08A" metalness={0.95} />
                  </mesh>
                  <mesh position={[0, 0.58, 0]}>
                    <coneGeometry args={[0.075, 0.26, 8]} />
                    <meshStandardMaterial
                      color="#EF4444"
                      emissive="#DC2626"
                      emissiveIntensity={glowIntensity * 1.2}
                    />
                  </mesh>
                  <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, -runeSpin * 1.2, 0]}>
                    <ringGeometry args={[0.14, 0.19, 16]} />
                    <meshBasicMaterial color="#EF4444" side={THREE.DoubleSide} />
                  </mesh>
                </group>

                {/* Arrow 3: Retrieving Arrow (Right) */}
                <group position={[0.1, 0.4, 0]} rotation={[0, 0, 0.15]}>
                  <mesh>
                    <cylinderGeometry args={[0.016, 0.016, 0.95, 8]} />
                    <meshStandardMaterial color="#FDE047" metalness={0.9} />
                  </mesh>
                  <mesh position={[0, 0.52, 0]}>
                    <coneGeometry args={[0.065, 0.22, 8]} />
                    <meshStandardMaterial
                      color="#38BDF8"
                      emissive="#0284C7"
                      emissiveIntensity={glowIntensity}
                    />
                  </mesh>
                  <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, runeSpin * 1.5, 0]}>
                    <ringGeometry args={[0.12, 0.16, 16]} />
                    <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
                  </mesh>
                </group>

                {/* Core Divine Light Aura */}
                <pointLight
                  position={[0, 0.5, 0]}
                  intensity={glowIntensity * 1.6}
                  distance={7}
                  color="#FBBF24"
                />
              </group>
            </group>
          </group>
        )}
      </group>
    </group>
  );
};
