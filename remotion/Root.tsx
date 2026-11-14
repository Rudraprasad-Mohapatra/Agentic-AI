import React from 'react';
import { Composition, CalculateMetadataFunction } from 'remotion';
import { ShortVideo } from './components/ShortVideo';
import { WalkingRoadScene } from './scenes/WalkingRoadScene';
import { Explainer3DScene } from './scenes/Explainer3DScene';
import { Mystery3DScene } from './scenes/Mystery3DScene';
import { YuyutsuStoryScene } from './scenes/YuyutsuStoryScene';
import { ShortVideoProps, WordTiming } from './types';
import yuyutsuWords from '../projects/yuyutsu-kaurava/data/words.json';

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

const defaultShortProps: ShortVideoProps = {
  title: 'The Long Walk',
  words: defaultWords,
  sceneType: 'walking-road' as const,
};

// Dynamically compute duration from audio or word timings
const calculateVideoMetadata: CalculateMetadataFunction<ShortVideoProps> = async ({
  props,
}) => {
  const fps = 30;
  let durationInSeconds = 10;
  if (props.words && props.words.length > 0) {
    const lastWord = props.words[props.words.length - 1];
    durationInSeconds = Math.max(5, lastWord.e + 1.2);
  }
  return {
    durationInFrames: Math.ceil(durationInSeconds * fps),
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          1. MASTER FULL VIDEOS (BOTH 9:16 SHORTS & 16:9 LONG)
          ══════════════════════════════════════════════════════ */}

      {/* 9:16 Vertical Short (1080 x 1920) for YouTube Shorts, TikTok, Reels */}
      <Composition
        id="Short-9x16"
        component={ShortVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultShortProps}
        calculateMetadata={calculateVideoMetadata}
      />

      {/* 16:9 Horizontal Video (1920 x 1080) for Standard YouTube / Long-form */}
      <Composition
        id="Video-16x9"
        component={ShortVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultShortProps}
        calculateMetadata={calculateVideoMetadata}
      />

      {/* Backward-compatible aliases */}
      <Composition
        id="Short3D"
        component={ShortVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultShortProps}
        calculateMetadata={calculateVideoMetadata}
      />

      <Composition
        id="Long3D"
        component={ShortVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultShortProps}
        calculateMetadata={calculateVideoMetadata}
      />

      {/* ══════════════════════════════════════════════════════
          YUYUTSU: THE KAURAVA WHO BETRAYED 100 BROTHERS
          (DUAL FORMAT: 9:16 SHORTS & 16:9 LONG-FORM)
          ══════════════════════════════════════════════════════ */}
      <Composition
        id="Yuyutsu-9x16"
        component={YuyutsuStoryScene}
        durationInFrames={2120} // 70.66s @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          words: yuyutsuWords as WordTiming[],
        }}
      />

      <Composition
        id="Yuyutsu-16x9"
        component={YuyutsuStoryScene}
        durationInFrames={2120} // 70.66s @ 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          words: yuyutsuWords as WordTiming[],
        }}
      />

      {/* ══════════════════════════════════════════════════════
          2. STANDALONE SCENES IN BOTH 9:16 AND 16:9
          ══════════════════════════════════════════════════════ */}

      {/* Walking Road: 9:16 & 16:9 */}
      <Composition
        id="WalkingRoad-9x16"
        component={WalkingRoadScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ speed: 2.4, cameraMode: 'dolly' as const }}
      />
      <Composition
        id="WalkingRoad-16x9"
        component={WalkingRoadScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ speed: 2.4, cameraMode: 'dolly' as const }}
      />
      <Composition
        id="WalkingRoadScene"
        component={WalkingRoadScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ speed: 2.4, cameraMode: 'dolly' as const }}
      />

      {/* Deep Dive 3D Explainer: 9:16 & 16:9 */}
      <Composition
        id="Explainer3D-9x16"
        component={Explainer3DScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ xrayMode: true }}
      />
      <Composition
        id="Explainer3D-16x9"
        component={Explainer3DScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ xrayMode: true }}
      />
      <Composition
        id="Explainer3DScene"
        component={Explainer3DScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ xrayMode: true }}
      />

      {/* Night File 3D Mystery: 9:16 & 16:9 */}
      <Composition
        id="Mystery3D-9x16"
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
      <Composition
        id="Mystery3D-16x9"
        component={Mystery3DScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          dateLabel: 'NOV 24, 1971',
          locationLabel: 'UNSOLVED CASE · FILE #840',
        }}
      />
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
