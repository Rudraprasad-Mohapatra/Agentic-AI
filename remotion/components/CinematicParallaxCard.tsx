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
  fitMode?: 'cover' | 'contain-scene';
}

export const CinematicParallaxCard: React.FC<CinematicParallaxCardProps> = ({
  imageSrc,
  durationInFrames,
  cameraMotion = 'pushIn',
  isLandscape = false,
  children,
  vignetteIntensity = 0.45,
  focusPoint = { x: 50, y: 50 },
  fitMode,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames)));

  // Smooth cinematic ease-in-out S-curve
  const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);

  // Natural human handheld breathing motion (subtle eye-level float)
  const breatheY = Math.sin(frame * 0.08) * 3;
  const breatheX = Math.cos(frame * 0.06) * 2.5;

  // Determine whether this shot in 9:16 portrait should use dual-layer staging
  // so wide scene characters are fully visible inside the frame.
  const useDualLayer = !isLandscape && fitMode === 'contain-scene';

  // Dynamic 3D Camera Pan & Zoom Calculations
  let startScale = 1.05;
  let endScale = 1.16;
  let startX = 0;
  let endX = 0;
  let startY = 0;
  let endY = 0;
  let rotateX = 0;
  let rotateY = 0;

  if (cameraMotion === 'pushIn') {
    startScale = 1.04;
    endScale = 1.16;
    startX = (focusPoint.x - 50) * -0.15;
    endX = (focusPoint.x - 50) * -0.3;
    startY = (focusPoint.y - 50) * -0.1;
    endY = (focusPoint.y - 50) * -0.22;
    rotateX = interpolate(ease, [0, 1], [-1.0, 1.0]);
  } else if (cameraMotion === 'pullBack') {
    startScale = 1.16;
    endScale = 1.04;
    startX = 10;
    endX = -8;
    startY = 6;
    endY = 0;
    rotateX = interpolate(ease, [0, 1], [0.8, -0.6]);
  } else if (cameraMotion === 'panRight') {
    startScale = 1.08;
    endScale = 1.08;
    startX = -25;
    endX = 25;
    startY = 0;
    endY = -4;
    rotateY = interpolate(ease, [0, 1], [-1.5, 1.5]);
  } else if (cameraMotion === 'panLeft') {
    startScale = 1.08;
    endScale = 1.08;
    startX = 25;
    endX = -25;
    startY = 0;
    endY = 4;
    rotateY = interpolate(ease, [0, 1], [1.5, -1.5]);
  } else if (cameraMotion === 'craneUp') {
    startScale = 1.06;
    endScale = 1.16;
    startX = 0;
    endX = 0;
    startY = 25;
    endY = -20;
    rotateX = interpolate(ease, [0, 1], [-1.8, 1.0]);
  } else if (cameraMotion === 'heroZoom') {
    startScale = 1.05;
    endScale = 1.20;
    startX = (focusPoint.x - 50) * -0.2;
    endX = (focusPoint.x - 50) * -0.4;
    startY = (focusPoint.y - 50) * -0.15;
    endY = (focusPoint.y - 50) * -0.3;
    rotateX = interpolate(ease, [0, 1], [-1.2, 0.8]);
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
      {/* ══════════ 1. ATMOSPHERIC BACKDROP LAYER (FOR DUAL-LAYER 9:16) ══════════ */}
      {useDualLayer && (
        <div
          style={{
            position: 'absolute',
            inset: -40,
            transform: `scale(${currentScale * 1.08}) translate3d(${currentX * 0.3}px, ${currentY * 0.3}px, 0)`,
            filter: 'blur(36px) brightness(0.36) saturate(1.2)',
            pointerEvents: 'none',
          }}
        >
          <Img
            src={imageSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* ══════════ 2. MULTI-PLANE 3D PARALLAX IMAGE ══════════ */}
      <div
        style={{
          position: 'absolute',
          inset: useDualLayer ? 0 : -30,
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
            height: useDualLayer ? 'auto' : '100%',
            maxHeight: useDualLayer ? '72%' : '100%',
            objectFit: isLandscape ? 'contain' : useDualLayer ? 'contain' : 'cover',
            objectPosition: `${focusPoint.x}% ${focusPoint.y}%`,
            filter: 'contrast(1.06) saturate(1.1) brightness(1.02)',
            maskImage: useDualLayer
              ? 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)'
              : undefined,
            WebkitMaskImage: useDualLayer
              ? 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)'
              : undefined,
          }}
        />
      </div>

      {/* ══════════ 3. CINEMATIC LIGHTING & VIGNETTE ══════════ */}
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

      {/* ══════════ 4. INTERACTIVE 3D WEBGL OVERLAYS ══════════ */}
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
