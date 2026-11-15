import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';

export interface FloatingEmbers3DProps {
  count?: number;
  color?: string;
  speedMultiplier?: number;
}

export const FloatingEmbers3D: React.FC<FloatingEmbers3DProps> = ({
  count = 45,
  color = '#FBBF24',
  speedMultiplier = 1.0,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const list: { x: number; y: number; z: number; speed: number; phase: number; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.sin(i * 9.7) * 4.5,
        y: Math.abs(Math.sin(i * 3.3)) * 4.0,
        z: (Math.cos(i * 6.1) * 3.5) + 0.5,
        speed: (0.012 + Math.abs(Math.sin(i * 1.5)) * 0.018) * speedMultiplier,
        phase: i * 0.45,
        size: 0.02 + Math.abs(Math.cos(i)) * 0.035,
      });
    }
    return list;
  }, [count, speedMultiplier]);

  return (
    <group>
      {particles.map((p, idx) => {
        const currentY = ((p.y + (frame * p.speed) + p.phase) % 5.0) - 0.5;
        const currentX = p.x + Math.sin(frame * 0.04 + idx) * 0.25;
        const currentZ = p.z + Math.cos(frame * 0.03 + idx) * 0.25;
        const opacity = Math.sin(((currentY + 0.5) / 5.0) * Math.PI);

        return (
          <mesh key={`ember-${idx}`} position={[currentX, currentY, currentZ]}>
            <sphereGeometry args={[p.size, 6, 6]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={Math.max(0.15, opacity * 0.9)}
            />
          </mesh>
        );
      })}
    </group>
  );
};
