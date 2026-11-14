import React, { useMemo } from 'react';
import {
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { WordTiming } from '../types';

export interface YuyutsuStorySceneProps {
  words?: WordTiming[];
  audioSrc?: string;
}

interface StoryBeat {
  start: number;
  end: number;
  asset: string;
  badge: string;
  heroText: string;
  capsEn: string;
  zoomFrom: number;
  zoomTo: number;
  panX: number;
}

// Scene timeline beats derived from lines.json narration timestamps
const BEATS: StoryBeat[] = [
  {
    start: 0.0,
    end: 7.1,
    asset: 'yuyutsu/scene1_kurukshetra_hook.jpg',
    badge: 'कुरुक्षेत्र का महायुद्ध',
    heroText: '100 भाइयों के खिलाफ एक कौरव!',
    capsEn: 'In the Mahabharata, one lone Kaurava fought against his own 100 brothers!',
    zoomFrom: 1.05,
    zoomTo: 1.18,
    panX: 0,
  },
  {
    start: 7.1,
    end: 13.4,
    asset: 'yuyutsu/scene2_meet_yuyutsu.jpg',
    badge: 'हस्तिनापुर का राजकुमार',
    heroText: 'धृतराष्ट्र का पुत्र – युयुत्सु',
    capsEn: 'His name was Yuyutsu — son of Dhritarashtra and half-brother to Duryodhana.',
    zoomFrom: 1.02,
    zoomTo: 1.15,
    panX: 0,
  },
  {
    start: 13.4,
    end: 18.8,
    asset: 'yuyutsu/scene3_duryodhana_kauravas.jpg',
    badge: 'कौरव सभा',
    heroText: 'अन्याय का विरोध',
    capsEn: 'Yet unlike his brothers, Yuyutsu refused to side with injustice.',
    zoomFrom: 1.04,
    zoomTo: 1.16,
    panX: -20,
  },
  {
    start: 18.8,
    end: 30.3,
    asset: 'yuyutsu/scene4_yudhishthira_announcement.jpg',
    badge: 'कुरुक्षेत्र शंखनाद',
    heroText: 'युधिष्ठिर की ऐतिहासिक घोषणा',
    capsEn: 'Yudhishthira declared: "Whoever wishes to stand with Dharma is welcome!"',
    zoomFrom: 1.05,
    zoomTo: 1.18,
    panX: 15,
  },
  {
    start: 30.3,
    end: 44.6,
    asset: 'yuyutsu/scene5_battle_pandavas.jpg',
    badge: 'ऐतिहासिक निर्णय',
    heroText: 'अभूतपूर्व फैसला – युयुत्सु',
    capsEn: 'Leaving his 100 brothers, he crossed the battlefield to join the Pandavas.',
    zoomFrom: 1.03,
    zoomTo: 1.17,
    panX: 0,
  },
  {
    start: 44.6,
    end: 65.6,
    asset: 'yuyutsu/scene6_yuyutsu_sunset.jpg',
    badge: 'महाभारत का उपदेश',
    heroText: 'धर्म रिश्तों से बड़ा होता है',
    capsEn: 'Righteousness is defined by actions and Dharma, never by bloodlines.',
    zoomFrom: 1.04,
    zoomTo: 1.18,
    panX: 0,
  },
  {
    start: 65.6,
    end: 71.0,
    asset: 'yuyutsu/nexora_logo.jpg',
    badge: 'NEXORA PRESENTS',
    heroText: 'Follow For More Untold Stories',
    capsEn: 'Follow NEXORA for more epic stories of Indian History & Mythology!',
    zoomFrom: 1.0,
    zoomTo: 1.08,
    panX: 0,
  },
];

export const YuyutsuStoryScene: React.FC<YuyutsuStorySceneProps> = ({
  words = [],
  audioSrc = staticFile('yuyutsu/narration.wav'),
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isLandscape = width > height;
  const currentTime = frame / fps;

  // Active story beat
  const activeBeat = useMemo(() => {
    const found = BEATS.find(
      (b) => currentTime >= b.start && currentTime < b.end
    );
    return found || BEATS[BEATS.length - 1];
  }, [currentTime]);

  const beatStartFrame = Math.round(activeBeat.start * fps);
  const beatDurationFrames = Math.max(1, Math.round((activeBeat.end - activeBeat.start) * fps));
  const localBeatFrame = Math.max(0, frame - beatStartFrame);
  const beatProgress = Math.min(1, localBeatFrame / beatDurationFrames);

  // Ken Burns zoom & slight drift
  const scale = interpolate(
    beatProgress,
    [0, 1],
    [activeBeat.zoomFrom, activeBeat.zoomTo]
  );
  const translateX = interpolate(
    beatProgress,
    [0, 1],
    [0, activeBeat.panX]
  );

  // Embers / Fire sparks floating across Kurukshetra
  const embers = useMemo(() => {
    const list: { id: number; left: number; speed: number; size: number; delay: number }[] = [];
    for (let i = 0; i < 28; i++) {
      list.push({
        id: i,
        left: (i * 3.65) % 100,
        speed: 0.8 + (i % 5) * 0.25,
        size: 3 + (i % 4) * 2,
        delay: (i * 0.45) % 8,
      });
    }
    return list;
  }, []);

  // Find active words chunk for kinetic subtitle display
  const activeWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    return words.filter((w) => {
      return currentTime >= w.s - 0.2 && currentTime <= w.e + 0.35;
    });
  }, [words, currentTime]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#05070E',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', Roboto, 'Noto Sans Devanagari', sans-serif",
      }}
    >
      {/* ══════════ 1. BACKGROUND ARTWORK WITH KEN BURNS ══════════ */}
      {/* Ambient Blurred Background (fills 16:9 widescreen naturally) */}
      {isLandscape && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            filter: 'blur(35px) brightness(0.4)',
            transform: 'scale(1.2)',
          }}
        >
          <Img
            src={staticFile(activeBeat.asset)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Main Artwork Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Img
          src={staticFile(activeBeat.asset)}
          style={{
            width: isLandscape ? 'auto' : '100%',
            height: isLandscape ? '100%' : '100%',
            maxWidth: isLandscape ? '100%' : 'none',
            objectFit: activeBeat.asset.includes('nexora') ? 'contain' : 'cover',
            transform: `scale(${scale}) translateX(${translateX}px)`,
            filter: activeBeat.asset.includes('nexora')
              ? 'drop-shadow(0 0 40px rgba(56,189,248,0.45))'
              : 'contrast(1.08) saturate(1.12) brightness(0.96)',
            transition: 'opacity 0.3s ease-out',
          }}
        />
      </div>

      {/* ══════════ 2. CINEMATIC LIGHTING & VIGNETTES ══════════ */}
      {/* Top & Bottom Cinematic Shadow Gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLandscape
            ? 'linear-gradient(to bottom, rgba(5,7,14,0.75) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 65%, rgba(5,7,14,0.92) 100%)'
            : 'linear-gradient(to bottom, rgba(5,7,14,0.85) 0%, rgba(0,0,0,0.15) 28%, rgba(0,0,0,0.2) 62%, rgba(5,7,14,0.95) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Golden Sunset Horizon Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: isLandscape ? '300px' : '450px',
          background: 'radial-gradient(ellipse at bottom, rgba(234,88,12,0.22) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════ 3. FLOATING KURUKSHETRA FIRE EMBERS ══════════ */}
      {embers.map((emb) => {
        const emberY = ((currentTime * emb.speed * 60 + emb.delay * 80) % (height + 100)) - 50;
        const sway = Math.sin(frame * 0.05 + emb.id) * 18;
        const opacity = interpolate(
          emberY,
          [0, height * 0.4, height * 0.85, height],
          [0, 0.85, 0.7, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={`ember-${emb.id}`}
            style={{
              position: 'absolute',
              bottom: `${emberY}px`,
              left: `calc(${emb.left}% + ${sway}px)`,
              width: `${emb.size}px`,
              height: `${emb.size}px`,
              borderRadius: '50%',
              backgroundColor: '#F59E0B',
              boxShadow: '0 0 10px #F97316, 0 0 20px #EF4444',
              opacity,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        );
      })}

      {/* ══════════ 4. TOP HERO BADGES & LABELS ══════════ */}
      <div
        style={{
          position: 'absolute',
          top: isLandscape ? '45px' : '90px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 30,
          padding: '0 30px',
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '999px',
            backgroundColor: 'rgba(239, 68, 68, 0.28)',
            border: '1.5px solid rgba(239, 68, 68, 0.75)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ color: '#EF4444', fontSize: '14px' }}>●</span>
          <span
            style={{
              color: '#FEE2E2',
              fontSize: isLandscape ? '16px' : '22px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            {activeBeat.badge}
          </span>
        </div>

        {/* Hero Title Headline */}
        <div
          style={{
            marginTop: isLandscape ? '12px' : '16px',
            fontSize: isLandscape ? '38px' : '52px',
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: '-0.5px',
            textShadow: '0 4px 18px rgba(0,0,0,0.95), 0 0 30px rgba(245,158,11,0.4)',
            maxWidth: isLandscape ? '1200px' : '940px',
          }}
        >
          {activeBeat.heroText}
        </div>
      </div>

      {/* ══════════ 5. KINETIC SPOKEN WORDS + ENGLISH SUBTITLES ══════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: isLandscape ? '65px' : '240px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 40px',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      >
        {/* Primary Hindi Kinetic Spoken Words */}
        {activeWords.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isLandscape ? '12px' : '16px',
              maxWidth: isLandscape ? '1350px' : '960px',
              marginBottom: '16px',
            }}
          >
            {activeWords.map((item, idx) => {
              const isSpoken = currentTime >= item.s && currentTime <= item.e;
              const wordStartFrame = Math.round(item.s * fps);
              const localFrame = Math.max(0, frame - wordStartFrame);

              const popSpring = spring({
                frame: localFrame,
                fps,
                config: { damping: 12, stiffness: 260, mass: 0.5 },
              });

              const wordScale = isSpoken ? interpolate(popSpring, [0, 1], [0.92, 1.15]) : 1.0;

              return (
                <span
                  key={`spk-${idx}-${item.w}`}
                  style={{
                    fontFamily: "'Segoe UI', Roboto, 'Noto Sans Devanagari', sans-serif",
                    fontWeight: 900,
                    fontSize: isLandscape ? '46px' : '58px',
                    lineHeight: 1.15,
                    color: isSpoken ? '#FBBF24' : '#F8FAFC',
                    scale: wordScale,
                    display: 'inline-block',
                    textTransform: 'uppercase',
                    textShadow: `
                      -3px -3px 0 #000,
                       3px -3px 0 #000,
                      -3px  3px 0 #000,
                       3px  3px 0 #000,
                       0 6px 14px rgba(0,0,0,0.95)
                    `,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    backgroundColor: isSpoken ? 'rgba(0, 0, 0, 0.55)' : 'transparent',
                  }}
                >
                  {item.w}
                </span>
              );
            })}
          </div>
        )}

        {/* Secondary English Translation Subtitle Bar */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.85)',
            borderRadius: '12px',
            padding: isLandscape ? '8px 26px' : '10px 22px',
            maxWidth: isLandscape ? '1100px' : '920px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#FEF3C7',
              fontSize: isLandscape ? '22px' : '28px',
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.3,
              letterSpacing: '0.2px',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {activeBeat.capsEn}
          </p>
        </div>
      </div>

      {/* ══════════ 6. AUDIO ══════════ */}
      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};
