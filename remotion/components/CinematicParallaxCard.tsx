import React from 'react';
import { Img, interpolate, useCurrentFrame } from 'remotion';

export interface CinematicParallaxCardProps {
  imageSrc: string;
  durationInFrames: number;
  cameraMotion?: 'pushIn' | 'pullBack' | 'panRight' | 'panLeft' | 'craneUp' | 'heroZoom';
  isLandscape?: boolean;
  children?: React.ReactNode;
  vignetteIntensity?: number;
  focusPoint?: { x: number; y: number }; // 0..100 %
}

export const CinematicParallaxCard: React.FC<CinematicParallaxCardProps> = ({
  imageSrc,
  durationInFrames,
  cameraMotion = 'pushIn',
  isLandscape = false,
  children,
  vignetteIntensity = 0.45,
  focusPoint = { x: 50, y: 50 },
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames)));

  // Smooth cinematic ease-in-out S-curve
  const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);

  // Natural human handheld breathing motion (subtle eye-level float)
  const breatheY = Math.sin(frame * 0.08) * 4;
  const breatheX = Math.cos(frame * 0.06) * 3;

  // Dynamic 3D Camera Pan & Zoom Calculations
  let startScale = 1.08;
  let endScale = 1.22;
  let startX = 0;
  let endX = 0;
  let startY = 0;
  let endY = 0;
  let rotateX = 0;
  let rotateY = 0;

  if (cameraMotion === 'pushIn') {
    startScale = 1.08;
    endScale = 1.25;
    startX = (focusPoint.x - 50) * -0.2;
    endX = (focusPoint.x - 50) * -0.45;
    startY = (focusPoint.y - 50) * -0.15;
    endY = (focusPoint.y - 50) * -0.35;
    rotateX = interpolate(ease, [0, 1], [-1.2, 1.2]);
  } else if (cameraMotion === 'pullBack') {
    startScale = 1.24;
    endScale = 1.08;
    startX = 15;
    endX = -10;
    startY = 8;
    endY = 0;
    rotateX = interpolate(ease, [0, 1], [1.0, -0.8]);
  } else if (cameraMotion === 'panRight') {
    startScale = 1.18;
    endScale = 1.18;
    startX = -45;
    endX = 40;
    startY = 0;
    endY = -6;
    rotateY = interpolate(ease, [0, 1], [-2.0, 2.0]);
  } else if (cameraMotion === 'panLeft') {
    startScale = 1.18;
    endScale = 1.18;
    startX = 45;
    endX = -40;
    startY = 0;
    endY = 6;
    rotateY = interpolate(ease, [0, 1], [2.0, -2.0]);
  } else if (cameraMotion === 'craneUp') {
    startScale = 1.12;
    endScale = 1.24;
    startX = 0;
    endX = 0;
    startY = 40;
    endY = -35;
    rotateX = interpolate(ease, [0, 1], [-2.5, 1.5]);
  } else if (cameraMotion === 'heroZoom') {
    startScale = 1.10;
    endScale = 1.30;
    startX = (focusPoint.x - 50) * -0.3;
    endX = (focusPoint.x - 50) * -0.6;
    startY = (focusPoint.y - 50) * -0.2;
    endY = (focusPoint.y - 50) * -0.45;
    rotateX = interpolate(ease, [0, 1], [-1.8, 1.0]);
  }

  const currentScale = startScale + (endScale - startScale) * ease;
  const currentX = startX + (endX - startX) * ease + breatheX;
  const currentY = startY + (endY - startY) * ease + breatheY;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#05070E',
        perspective: '1200px',
      }}
    >
      {/* ══════════ 1. MULTI-PLANE 3D PARALLAX IMAGE ══════════ */}
      <div
        style={{
          position: 'absolute',
          inset: -40, // Bleed margins to prevent edge clipping during camera pans
          transform: `translate3d(${currentX}px, ${currentY}px, 0px) scale(${currentScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformOrigin: `${focusPoint.x}% ${focusPoint.y}%`,
          transition: 'transform 0.05s linear',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Img
          src={imageSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: isLandscape ? 'contain' : 'cover',
            objectPosition: `${focusPoint.x}% ${focusPoint.y}%`,
            filter: 'contrast(1.06) saturate(1.1) brightness(1.02)',
          }}
        />
      </div>

      {/* ══════════ 2. CINEMATIC LIGHTING & VIGNETTE ══════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0, 4, 12, ${vignetteIntensity}) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top subtle golden light leak */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.12), rgba(0,0,0,0))',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════ 3. INTERACTIVE 3D WEBGL OVERLAYS ══════════ */}
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
