import React from 'react';
import { Composition } from 'remotion';
import { ShortVideo } from './components/ShortVideo';
import { WalkingRoadScene } from './scenes/WalkingRoadScene';
import { Explainer3DScene } from './scenes/Explainer3DScene';
import { Mystery3DScene } from './scenes/Mystery3DScene';
import { WordTiming } from './types';

const defaultWords: WordTiming[] = [
  { w: 'In', line: 0, s: 0.2, e: 0.5 },
  { w: 'a', line: 0, s: 0.5, e: 0.7 },
  { w: 'world', line: 0, s: 0.7, e: 1.1 },
  { w: 'full', line: 0, s: 1.1, e: 1.4 },
  { w: 'of', line: 0, s: 1.4, e: 1.6 },
  { w: 'noise,', line: 0, s: 1.6, e: 2.1 },
  { w: 'one', line: 1, s: 2.3, e: 2.6 },
  { w: 'man', line: 1, s: 2.6, e: 2.9 },
  { w: 'decided', line: 1, s: 2.9, e: 3.5 },
  { w: 'to', line: 1, s: 3.5, e: 3.7 },
  { w: 'walk', line: 1, s: 3.7, e: 4.2 },
  { w: 'away.', line: 1, s: 4.2, e: 4.8 },
  { w: 'Every', line: 2, s: 5.0, e: 5.4 },
  { w: 'single', line: 2, s: 5.4, e: 5.9 },
  { w: 'step', line: 2, s: 5.9, e: 6.4 },
  { w: 'brought', line: 2, s: 6.4, e: 6.8 },
  { w: 'him', line: 2, s: 6.8, e: 7.1 },
  { w: 'closer', line: 2, s: 7.1, e: 7.6 },
  { w: 'to', line: 2, s: 7.6, e: 7.8 },
  { w: 'the', line: 2, s: 7.8, e: 8.0 },
  { w: 'truth.', line: 2, s: 8.0, e: 8.7 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. Master Composition: 3D Walking Short with Kinetic Captions */}
      <Composition
        id="Short3D"
        component={ShortVideo}
        durationInFrames={300} // 10 seconds @ 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'The Long Walk',
          words: defaultWords,
          sceneType: 'walking-road' as const,
        }}
      />

      {/* 2. Standalone True 3D Road Walking Scene (As requested by user) */}
      <Composition
        id="WalkingRoadScene"
        component={WalkingRoadScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          speed: 2.4,
          cameraMode: 'dolly' as const,
        }}
      />

      {/* 3. Standalone Deep Dive 3D Body/Science Scene */}
      <Composition
        id="Explainer3DScene"
        component={Explainer3DScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          xrayMode: true,
        }}
      />

      {/* 4. Standalone Night File 3D Mystery/True Crime Scene */}
      <Composition
        id="Mystery3DScene"
        component={Mystery3DScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          dateLabel: 'NOV 24, 1971',
          locationLabel: 'UNSOLVED CASE · FILE #840',
        }}
      />
    </>
  );
};
