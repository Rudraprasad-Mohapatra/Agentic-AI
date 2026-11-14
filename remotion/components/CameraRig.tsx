import React, { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import * as THREE from 'three';

export interface CameraRigProps {
  mode?: 'dolly' | 'orbit' | 'heroZoom' | 'sideTrack' | 'static';
  target?: [number, number, number];
  initialPos?: [number, number, number];
  distance?: number;
  fov?: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  mode = 'dolly',
  target = [0, 1.2, 0],
  initialPos = [0, 1.6, 5],
  distance = 5,
  fov = 42,
}) => {
  const { camera } = useThree();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  useLayoutEffect(() => {
    const t = frame / fps;
    const progress = frame / Math.max(1, durationInFrames);

    // Dynamic spring-smoothed camera behaviors
    if (mode === 'dolly') {
      // Smooth tracking forward along a road, following subject
      const zSpeed = 2.4; // meters per second
      const camZ = initialPos[2] - t * zSpeed;
      const targetZ = target[2] - t * zSpeed;
      
      // Gentle natural handheld bobbing
      const bobY = Math.sin(frame * 0.12) * 0.04;
      const bobX = Math.cos(frame * 0.08) * 0.03;

      camera.position.set(initialPos[0] + bobX, initialPos[1] + bobY, camZ);
      camera.lookAt(target[0], target[1], targetZ);
    } else if (mode === 'orbit') {
      // Cinematic 360/180 degree orbit around target
      const angle = progress * Math.PI * 0.75 - Math.PI * 0.35;
      const camX = target[0] + Math.sin(angle) * distance;
      const camZ = target[2] + Math.cos(angle) * distance;
      const camY = initialPos[1] + Math.sin(progress * Math.PI) * 0.4;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(target[0], target[1], target[2]);
    } else if (mode === 'heroZoom') {
      // High-impact spring push-in for dramatic beats
      const zoomProgress = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.8 },
      });
      const camZ = interpolate(zoomProgress, [0, 1], [initialPos[2], initialPos[2] - 2.2]);
      const camY = interpolate(zoomProgress, [0, 1], [initialPos[1], target[1] + 0.1]);

      camera.position.set(initialPos[0], camY, camZ);
      camera.lookAt(target[0], target[1], target[2]);
    } else if (mode === 'sideTrack') {
      // Side tracking shot showing character walking in profile with parallax
      const zSpeed = 2.4;
      const camZ = target[2] - t * zSpeed;
      camera.position.set(distance, initialPos[1], camZ);
      camera.lookAt(0, target[1], camZ);
    } else {
      camera.position.set(initialPos[0], initialPos[1], initialPos[2]);
      camera.lookAt(target[0], target[1], target[2]);
    }

    camera.updateProjectionMatrix();
  }, [camera, frame, fps, durationInFrames, mode, target, initialPos, distance]);

  return null;
};
