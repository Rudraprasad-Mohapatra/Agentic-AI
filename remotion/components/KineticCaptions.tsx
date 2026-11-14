import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { WordTiming } from '../types';

export interface KineticCaptionsProps {
  words: WordTiming[];
  activeColor?: string;
  textColor?: string;
  chunkSize?: number;
  bottomOffset?: number;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words = [],
  activeColor = '#FFD43B',
  textColor = '#FFFFFF',
  chunkSize = 4,
  bottomOffset = 340,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Group words into readable visual chunks (2-4 words per display beat)
  const chunks = useMemo(() => {
    if (!words || words.length === 0) return [];
    const list: WordTiming[][] = [];
    let currentChunk: WordTiming[] = [];
    let currentLine = words[0]?.line ?? 0;

    for (let i = 0; i < words.length; i++) {
      const item = words[i];
      // Break on line change or when chunk exceeds size
      if (item.line !== currentLine || currentChunk.length >= chunkSize) {
        if (currentChunk.length > 0) list.push(currentChunk);
        currentChunk = [];
        currentLine = item.line;
      }
      currentChunk.push(item);
    }
    if (currentChunk.length > 0) list.push(currentChunk);
    return list;
  }, [words, chunkSize]);

  // Find the active chunk corresponding to current playback time
  const activeChunk = useMemo(() => {
    return chunks.find((chk) => {
      const start = chk[0].s - 0.15;
      const end = chk[chk.length - 1].e + 0.35;
      return currentTime >= start && currentTime <= end;
    });
  }, [chunks, currentTime]);

  if (!activeChunk) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: `${bottomOffset}px`,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        padding: '0 40px',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '920px',
        }}
      >
        {activeChunk.map((item, idx) => {
          const isSpoken = currentTime >= item.s && currentTime <= item.e;
          const isPast = currentTime > item.e;
          const wordStartFrame = Math.round(item.s * fps);
          const localWordFrame = Math.max(0, frame - wordStartFrame);

          // Kinetic pop spring on word trigger
          const popSpring = spring({
            frame: localWordFrame,
            fps,
            config: { damping: 12, stiffness: 240, mass: 0.6 },
          });

          const scale = isSpoken
            ? interpolate(popSpring, [0, 1], [0.92, 1.14])
            : 1.0;

          const color = isSpoken ? activeColor : isPast ? '#E2E8F0' : textColor;

          return (
            <span
              key={`w-${idx}-${item.w}`}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                fontSize: '68px',
                lineHeight: 1.15,
                color,
                scale,
                display: 'inline-block',
                textTransform: 'uppercase',
                letterSpacing: '-1px',
                // Heavy outer black ink outline for maximum readability on 3D scenes
                textShadow: `
                  -4px -4px 0 #000,
                   4px -4px 0 #000,
                  -4px  4px 0 #000,
                   4px  4px 0 #000,
                   0px  6px 12px rgba(0,0,0,0.85)
                `,
                padding: '4px 8px',
                borderRadius: '8px',
                backgroundColor: isSpoken ? 'rgba(0, 0, 0, 0.45)' : 'transparent',
              }}
            >
              {item.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
