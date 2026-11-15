import React, { useMemo } from 'react';
import {
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ThreeCanvasScene } from '../components/ThreeCanvasScene';
import { FloatingEmbers3D } from '../components/FloatingEmbers3D';
import { WordTiming } from '../types';

export interface AbhimanyuStorySceneProps {
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
  panY: number;
}

const BEATS: StoryBeat[] = [
  {
    start: 0.0,
    end: 9.6,
    asset: 'abhimanyu/scene1_young_abhimanyu.jpg',
    badge: 'कुरुक्षेत्र का महायुद्ध',
    heroText: '16 साल का महायोद्धा',
    capsEn: 'In the Mahabharata war, a 16-year-old hero challenged the deadliest enemy army!',
    zoomFrom: 1.04,
    zoomTo: 1.16,
    panX: 0,
    panY: -10,
  },
  {
    start: 9.6,
    end: 13.8,
    asset: 'abhimanyu/scene1_young_abhimanyu.jpg',
    badge: 'अर्जुन-पुत्र',
    heroText: 'वीर अभिमन्यु',
    capsEn: 'His name was Abhimanyu — son of the great archer Arjuna and Subhadra.',
    zoomFrom: 1.10,
    zoomTo: 1.22,
    panX: 0,
    panY: -15,
  },
  {
    start: 13.8,
    end: 21.1,
    asset: 'abhimanyu/scene3_chakravyuha_formation.jpg',
    badge: 'युद्ध का 13वाँ दिन',
    heroText: 'अभेद्य चक्रव्यूह रचना',
    capsEn: 'On the 13th day, Guru Drona formed the terrifying Chakravyuha. Breaching it was nearly impossible.',
    zoomFrom: 1.03,
    zoomTo: 1.16,
    panX: 15,
    panY: 5,
  },
  {
    start: 21.1,
    end: 27.2,
    asset: 'abhimanyu/scene3_chakravyuha_formation.jpg',
    badge: 'संकट की घड़ी',
    heroText: 'अभिमन्यु का साहस',
    capsEn: 'Arjuna was lured away far across the battlefield. That is when young Abhimanyu stepped forward.',
    zoomFrom: 1.12,
    zoomTo: 1.25,
    panX: -10,
    panY: 0,
  },
  {
    start: 27.2,
    end: 36.7,
    asset: 'abhimanyu/scene5_charge_into_maze.jpg',
    badge: 'प्रवेश का रहस्य',
    heroText: 'चक्रव्यूह में महाप्रवेश',
    capsEn: 'He knew how to penetrate the maze, but not how to escape. Yet he fearlessly charged inside.',
    zoomFrom: 1.04,
    zoomTo: 1.17,
    panX: -15,
    panY: 5,
  },
  {
    start: 36.7,
    end: 43.3,
    asset: 'abhimanyu/scene5_charge_into_maze.jpg',
    badge: 'जयद्रथ का वरदान',
    heroText: 'अकेला पड़ गया अभिमन्यु',
    capsEn: 'Jayadratha blocked the remaining Pandavas from entering. Young Abhimanyu was trapped completely alone.',
    zoomFrom: 1.16,
    zoomTo: 1.05,
    panX: 10,
    panY: 0,
  },
  {
    start: 43.3,
    end: 53.7,
    asset: 'abhimanyu/scene8_chariot_wheel_fight.jpg',
    badge: 'महाभारत का सबसे क्रूर युद्ध',
    heroText: 'रथ का पहिया बना ढाल!',
    capsEn: 'Multiple Kaurava Maharathis attacked him together! His chariot broke, his bow broke... but his courage never broke!',
    zoomFrom: 1.04,
    zoomTo: 1.18,
    panX: 0,
    panY: -5,
  },
  {
    start: 53.7,
    end: 56.6,
    asset: 'abhimanyu/scene8_chariot_wheel_fight.jpg',
    badge: 'सर्वोच्च बलिदान',
    heroText: 'वीरगति को प्राप्त',
    capsEn: 'Fighting unconquered to his very last breath, the young prince achieved supreme martyrdom.',
    zoomFrom: 1.14,
    zoomTo: 1.24,
    panX: 0,
    panY: 0,
  },
  {
    start: 56.6,
    end: 65.4,
    asset: 'abhimanyu/scene10_arjuna_furious_vow.jpg',
    badge: 'गांडीवधारी का क्रोध',
    heroText: 'अर्जुन की महाप्रतिज्ञा',
    capsEn: 'When Arjuna learned of his son’s fall, he swore a fiery oath to slay Jayadratha before the next sunset!',
    zoomFrom: 1.04,
    zoomTo: 1.17,
    panX: 10,
    panY: 0,
  },
  {
    start: 65.4,
    end: 69.0,
    asset: 'abhimanyu/scene11_abhimanyu_immortal.jpg',
    badge: 'अमर बलिदान',
    heroText: 'इतिहास में अमर',
    capsEn: 'Though fallen in battle, young Abhimanyu became immortal in history for all eternity.',
    zoomFrom: 1.05,
    zoomTo: 1.18,
    panX: 0,
    panY: -15,
  },
  {
    start: 69.0,
    end: 74.67,
    asset: 'abhimanyu/scene11_abhimanyu_immortal.jpg',
    badge: 'NEXORA PRESENTS',
    heroText: 'Follow For More Untold Epics',
    capsEn: 'Follow NEXORA for more epic stories of Indian History & Mythology!',
    zoomFrom: 1.05,
    zoomTo: 1.12,
    panX: 0,
    panY: 0,
  },
];

export const AbhimanyuStoryScene: React.FC<AbhimanyuStorySceneProps> = ({
  words = [],
  audioSrc = staticFile('abhimanyu/narration.wav'),
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isLandscape = width > height;
  const currentTime = frame / fps;

  // Active beat
  const activeBeat = useMemo(() => {
    return (
      BEATS.find((b) => currentTime >= b.start && currentTime < b.end) ||
      BEATS[BEATS.length - 1]
    );
  }, [currentTime]);

  // Active word from Whisper
  const activeWord = useMemo(() => {
    if (!words || words.length === 0) return null;
    return words.find((w) => currentTime >= w.s - 0.15 && currentTime <= w.e + 0.25) || null;
  }, [words, currentTime]);

  // Beat progress for camera animation
  const beatProgress = Math.min(
    1,
    Math.max(0, (currentTime - activeBeat.start) / Math.max(0.1, activeBeat.end - activeBeat.start))
  );
  const ease = 0.5 - 0.5 * Math.cos(beatProgress * Math.PI);

  // Smooth camera zoom and pan
  const currentZoom = activeBeat.zoomFrom + (activeBeat.zoomTo - activeBeat.zoomFrom) * ease;
  const currentPanX = activeBeat.panX * ease;
  const currentPanY = activeBeat.panY * ease;

  // Handheld breathing motion
  const breatheY = Math.sin(frame * 0.08) * 2.5;
  const breatheX = Math.cos(frame * 0.06) * 2.0;

  const isOutro = currentTime >= 69.0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#04060C',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', Roboto, 'Noto Sans Devanagari', sans-serif",
      }}
    >
      {/* ══════════ 1. AUDIO TRACK ══════════ */}
      {audioSrc && <Audio src={audioSrc} />}

      {/* ══════════ 2. MASTER VISUAL LAYER (9:16 DUAL-LAYER / 16:9 FULL) ══════════ */}
      {!isOutro && (
        <>
          {/* Blurred Atmospheric Background Layer for 9:16 */}
          {!isLandscape && (
            <div
              style={{
                position: 'absolute',
                inset: -50,
                transform: `scale(${currentZoom * 1.08}) translate3d(${currentPanX * 0.3}px, ${currentPanY * 0.3}px, 0)`,
                filter: 'blur(36px) brightness(0.36) saturate(1.25)',
                pointerEvents: 'none',
              }}
            >
              <Img
                src={staticFile(activeBeat.asset)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* Crisp Main Visual Layer */}
          <div
            style={{
              position: 'absolute',
              inset: isLandscape ? -30 : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translate3d(${currentPanX + breatheX}px, ${currentPanY + breatheY}px, 0px) scale(${currentZoom})`,
              transformOrigin: '50% 50%',
              transition: 'transform 0.05s linear',
            }}
          >
            <Img
              src={staticFile(activeBeat.asset)}
              style={{
                width: '100%',
                height: isLandscape ? '100%' : 'auto',
                maxHeight: isLandscape ? '100%' : '74%',
                objectFit: 'contain',
                filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
                maskImage: !isLandscape
                  ? 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)'
                  : undefined,
                WebkitMaskImage: !isLandscape
                  ? 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)'
                  : undefined,
              }}
            />
          </div>

          {/* Vignette & Golden Rim Lighting */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0, 4, 12, 0.5) 100%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '24%',
              background:
                'linear-gradient(to bottom, rgba(245, 158, 11, 0.12), rgba(0,0,0,0))',
              pointerEvents: 'none',
            }}
          />

          {/* Floating 3D Embers / Kurukshetra Dust */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
              <FloatingEmbers3D count={35} color="#FBBF24" speedMultiplier={0.9} />
            </ThreeCanvasScene>
          </div>
        </>
      )}

      {/* ══════════ 3. OUTRO CARD (LAST 5 SECONDS) ══════════ */}
      {isOutro && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#04060C',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
          }}
        >
          {/* Subtle rotating glow ring */}
          <div
            style={{
              position: 'relative',
              width: isLandscape ? 240 : 300,
              height: isLandscape ? 240 : 300,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 80px rgba(56, 189, 248, 0.4), 0 0 140px rgba(217, 70, 239, 0.3)',
            }}
          >
            <Img
              src={staticFile('barbarik/nexora_logo.jpg')}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid rgba(255,255,255,0.2)',
              }}
            />
          </div>

          <div
            style={{
              marginTop: 36,
              fontSize: isLandscape ? 44 : 54,
              fontWeight: 900,
              letterSpacing: 4,
              color: '#FFFFFF',
              textAlign: 'center',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}
          >
            FOLLOW <span style={{ color: '#06B6D4' }}>NEXORA</span>
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: isLandscape ? 22 : 28,
              fontWeight: 600,
              letterSpacing: 2,
              color: '#FBBF24',
              textAlign: 'center',
            }}
          >
            ऐसी ही अनसुनी कथाओं के लिए जुड़े रहें
          </div>
        </div>
      )}

      {/* ══════════ 4. CINEMATIC OVERLAYS (STORY CHAPTER BADGE & TITLES) ══════════ */}
      {!isOutro && (
        <div
          style={{
            position: 'absolute',
            top: isLandscape ? 36 : 90,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: isLandscape ? '6px 18px' : '8px 24px',
              borderRadius: 999,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                boxShadow: '0 0 10px #F59E0B',
              }}
            />
            <span
              style={{
                fontSize: isLandscape ? 15 : 20,
                fontWeight: 700,
                color: '#FEF08A',
                letterSpacing: 1.5,
              }}
            >
              {activeBeat.badge}
            </span>
          </div>

          {/* Dramatic Story Headline */}
          <div
            style={{
              marginTop: 12,
              fontSize: isLandscape ? 34 : 46,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 1.2,
              textAlign: 'center',
              padding: '0 24px',
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.4)',
            }}
          >
            {activeBeat.heroText}
          </div>
        </div>
      )}

      {/* ══════════ 5. KINETIC SPOKEN CAPTIONS & ENGLISH SUBTITLE BAR ══════════ */}
      {!isOutro && (
        <div
          style={{
            position: 'absolute',
            bottom: isLandscape ? 32 : 110,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 25,
            pointerEvents: 'none',
            padding: '0 32px',
          }}
        >
          {/* Active Spoken Hindi Word Highlight */}
          {activeWord && (
            <div
              style={{
                marginBottom: 16,
                padding: isLandscape ? '8px 26px' : '10px 32px',
                borderRadius: 16,
                background: 'rgba(5, 7, 14, 0.88)',
                border: '1.5px solid rgba(251, 191, 36, 0.5)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 25px rgba(245, 158, 11, 0.3)',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: isLandscape ? 38 : 50,
                  fontWeight: 900,
                  color: '#FDE047',
                  letterSpacing: 1.2,
                  textShadow: '0 0 20px rgba(253, 224, 71, 0.7)',
                }}
              >
                {activeWord.w}
              </span>
            </div>
          )}

          {/* English Narrative Translation Subtitle Bar */}
          <div
            style={{
              maxWidth: isLandscape ? 900 : '90%',
              padding: isLandscape ? '10px 24px' : '12px 28px',
              borderRadius: 14,
              background: 'rgba(10, 15, 29, 0.82)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: isLandscape ? 18 : 24,
                fontWeight: 600,
                color: '#E2E8F0',
                letterSpacing: 0.5,
                lineHeight: 1.4,
              }}
            >
              {activeBeat.capsEn}
            </span>
          </div>
        </div>
      )}

      {/* ══════════ 6. NEXORA TOP-LEFT CHANNEL WATERMARK ══════════ */}
      <div
        style={{
          position: 'absolute',
          top: isLandscape ? 24 : 48,
          left: isLandscape ? 32 : 44,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 30,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: isLandscape ? 32 : 40,
            height: isLandscape ? 32 : 40,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(56, 189, 248, 0.6)',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
          }}
        >
          <Img
            src={staticFile('barbarik/nexora_logo.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <span
          style={{
            fontSize: isLandscape ? 16 : 22,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: 2,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          NEXORA
        </span>
      </div>
    </div>
  );
};
