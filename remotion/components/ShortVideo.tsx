import React from 'react';
import { Audio, staticFile } from 'remotion';
import { ShortVideoProps } from '../types';
import { WalkingRoadScene } from '../scenes/WalkingRoadScene';
import { Explainer3DScene } from '../scenes/Explainer3DScene';
import { Mystery3DScene } from '../scenes/Mystery3DScene';
import { KineticCaptions } from './KineticCaptions';

export const ShortVideo: React.FC<ShortVideoProps> = ({
  title,
  words = [],
  audioSrc,
  musicSrc,
  sceneType = 'walking-road',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1920px',
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* 3D Visual Scene */}
      {sceneType === 'walking-road' && <WalkingRoadScene />}
      {sceneType === 'explainer-3d' && <Explainer3DScene />}
      {sceneType === 'mystery-3d' && <Mystery3DScene />}

      {/* Kinetic Word-Synced Captions Overlay */}
      <KineticCaptions words={words} />

      {/* Local Narration Audio (Kokoro TTS / Whisper) */}
      {audioSrc && <Audio src={audioSrc} />}

      {/* Optional Background Music Bed */}
      {musicSrc && <Audio src={musicSrc} volume={0.18} />}

      {/* Subtle Top Vignette for Film Quality */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
