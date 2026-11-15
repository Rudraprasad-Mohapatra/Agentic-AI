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

export interface EiffelConSceneProps {
  words?: WordTiming[];
  audioSrc?: string;
}

interface StoryBeat {
  start: number;
  end: number;
  asset: string;
  badge: string;
  headline: string;
  subtext: string;
  zoomFrom: number;
  zoomTo: number;
  panX: number;
  panY: number;
}

const BEATS: StoryBeat[] = [
  {
    start: 0.0,
    end: 7.2,
    asset: 'eiffel-con/scene1_victor_lustig_hero.jpg',
    badge: 'PARIS, 1925',
    headline: 'THE EIFFEL TOWER FOR SALE',
    subtext: 'In 1925, a charming con artist named Mr. Victor Lustig sold the Eiffel Tower for scrap metal.',
    zoomFrom: 1.04,
    zoomTo: 1.15,
    panX: 0,
    panY: -10,
  },
  {
    start: 7.2,
    end: 9.7,
    asset: 'eiffel-con/scene1_victor_lustig_hero.jpg',
    badge: 'THE IMPOSSIBLE HEIST',
    headline: 'SOLD IT A SECOND TIME',
    subtext: 'And then... he sold it a second time.',
    zoomFrom: 1.15,
    zoomTo: 1.25,
    panX: 5,
    panY: -15,
  },
  {
    start: 9.7,
    end: 15.8,
    asset: 'eiffel-con/scene2_newspaper_demolition.jpg',
    badge: 'THE RUSTING MONUMENT',
    headline: '7,000 TONS OF RUST',
    subtext: 'Back then, the Eiffel Tower was rusting, peeling, and costing Paris a fortune just to maintain.',
    zoomFrom: 1.03,
    zoomTo: 1.14,
    panX: 10,
    panY: 5,
  },
  {
    start: 15.8,
    end: 22.7,
    asset: 'eiffel-con/scene3_forged_credentials.jpg',
    badge: 'THE MASTER FORGERY',
    headline: 'FAKE MINISTRY SEALS',
    subtext: 'Newspapers wrote that it might be torn down. So Mr. Lustig forged official French government credentials,',
    zoomFrom: 1.04,
    zoomTo: 1.15,
    panX: -8,
    panY: 10,
  },
  {
    start: 22.7,
    end: 28.7,
    asset: 'eiffel-con/scene4_crillon_secret_meeting.jpg',
    badge: 'THE SECRET AUCTION',
    headline: 'HÔTEL DE CRILLON',
    subtext: 'rented a luxury suite at the Hôtel de Crillon, and secretly summoned Paris\'s top scrap-metal dealers.',
    zoomFrom: 1.04,
    zoomTo: 1.16,
    panX: -12,
    panY: 0,
  },
  {
    start: 28.7,
    end: 35.6,
    asset: 'eiffel-con/scene4_crillon_secret_meeting.jpg',
    badge: 'TOP-SECRET BIDDING',
    headline: '7,000 TONS OF SCRAP',
    subtext: 'He claimed the demolition was a state secret to prevent public rioting—and opened bids for 7,000 tons of iron.',
    zoomFrom: 1.14,
    zoomTo: 1.25,
    panX: 10,
    panY: -5,
  },
  {
    start: 35.6,
    end: 42.4,
    asset: 'eiffel-con/scene6_the_bribe_demand.jpg',
    badge: 'THE SUSPICIOUS MARK',
    headline: 'MR. ANDRÉ POISSON',
    subtext: 'One wealthy dealer, Mr. André Poisson, desperately wanted the prestige—until he started getting suspicious.',
    zoomFrom: 1.04,
    zoomTo: 1.15,
    panX: -15,
    panY: 0,
  },
  {
    start: 42.4,
    end: 48.9,
    asset: 'eiffel-con/scene6_the_bribe_demand.jpg',
    badge: 'THE MASTERSTROKE',
    headline: 'DEMANDING A BRIBE',
    subtext: 'Seeing him hesitate, Mr. Lustig played his masterstroke: he leaned in and quietly demanded a massive bribe.',
    zoomFrom: 1.12,
    zoomTo: 1.24,
    panX: 0,
    panY: -10,
  },
  {
    start: 48.9,
    end: 57.2,
    asset: 'eiffel-con/scene6_the_bribe_demand.jpg',
    badge: 'THE PSYCHOLOGY',
    headline: 'A CORRUPT BUREAUCRAT',
    subtext: 'That sealed the deal. Mr. Poisson thought: \'A corrupt bureaucrat taking a bribe? This must be the real government!\'',
    zoomFrom: 1.18,
    zoomTo: 1.28,
    panX: 10,
    panY: -15,
  },
  {
    start: 57.2,
    end: 64.4,
    asset: 'eiffel-con/scene1_victor_lustig_hero.jpg',
    badge: 'THE ESCAPE',
    headline: 'ORIENT EXPRESS TO VIENNA',
    subtext: 'Mr. Poisson handed over a fortune in cash, and Mr. Lustig caught the first train to Vienna with a suitcase full of francs.',
    zoomFrom: 1.05,
    zoomTo: 1.18,
    panX: 12,
    panY: 5,
  },
  {
    start: 64.4,
    end: 71.8,
    asset: 'eiffel-con/scene8_poisson_silent_shame.jpg',
    badge: 'THE HUMILIATION',
    headline: 'PARALYZED BY SHAME',
    subtext: 'Now here’s the insane part: Mr. Poisson was so paralyzed by shame, terrified of becoming the laughingstock of France,',
    zoomFrom: 1.04,
    zoomTo: 1.16,
    panX: -10,
    panY: 5,
  },
  {
    start: 71.8,
    end: 74.6,
    asset: 'eiffel-con/scene8_poisson_silent_shame.jpg',
    badge: 'TOTAL SILENCE',
    headline: 'NEVER TOLD THE POLICE',
    subtext: 'that he never uttered a single word to the police!',
    zoomFrom: 1.16,
    zoomTo: 1.26,
    panX: 0,
    panY: 10,
  },
  {
    start: 74.6,
    end: 80.0,
    asset: 'eiffel-con/scene2_newspaper_demolition.jpg',
    badge: 'ZERO HEADLINES',
    headline: 'SCOT-FREE IN VIENNA',
    subtext: 'When Mr. Lustig saw zero headlines in the papers, he realized he got away scot-free.',
    zoomFrom: 1.03,
    zoomTo: 1.15,
    panX: -8,
    panY: 0,
  },
  {
    start: 80.0,
    end: 87.5,
    asset: 'eiffel-con/scene10_sold_second_time.jpg',
    badge: 'THE SECOND HEIST',
    headline: 'SOLD IT A SECOND TIME!',
    subtext: 'So he marched right back into Paris, booked another luxury suite, and sold the Eiffel Tower all over again to another victim!',
    zoomFrom: 1.05,
    zoomTo: 1.18,
    panX: 0,
    panY: -5,
  },
  {
    start: 87.5,
    end: 93.1,
    asset: 'eiffel-con/scene11_lustig_legacy_lesson.jpg',
    badge: 'THE LESSON',
    headline: 'SELLING HUMAN GREED',
    subtext: 'Because in the end, Mr. Lustig wasn\'t selling an iron tower... he was selling human greed.',
    zoomFrom: 1.04,
    zoomTo: 1.16,
    panX: 0,
    panY: 0,
  },
  {
    start: 93.1,
    end: 98.2,
    asset: 'eiffel-con/scene11_lustig_legacy_lesson.jpg',
    badge: 'NEXORA ORIGINALS',
    headline: 'FOLLOW FOR MORE',
    subtext: 'For more unbelievable true stories, follow NEXORA!',
    zoomFrom: 1.10,
    zoomTo: 1.22,
    panX: 0,
    panY: 0,
  },
];

export const EiffelConScene: React.FC<EiffelConSceneProps> = ({
  words = [],
  audioSrc = 'eiffel-con/narration.wav',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const currentTime = frame / fps;

  // Determine current active beat
  const activeBeat = useMemo(() => {
    for (let i = 0; i < BEATS.length; i++) {
      if (currentTime >= BEATS[i].start && currentTime < BEATS[i].end) {
        return { beat: BEATS[i], index: i };
      }
    }
    return { beat: BEATS[BEATS.length - 1], index: BEATS.length - 1 };
  }, [currentTime]);

  const { beat } = activeBeat;
  const beatDuration = Math.max(0.5, beat.end - beat.start);
  const beatProgress = Math.min(1, Math.max(0, (currentTime - beat.start) / beatDuration));

  // Dynamic Camera Motion
  const scale = interpolate(beatProgress, [0, 1], [beat.zoomFrom, beat.zoomTo], {
    extrapolateRight: 'clamp',
  });
  const panX = interpolate(beatProgress, [0, 1], [0, beat.panX], {
    extrapolateRight: 'clamp',
  });
  const panY = interpolate(beatProgress, [0, 1], [0, beat.panY], {
    extrapolateRight: 'clamp',
  });

  // Active Spoken Word Highlighting
  const activeWord = useMemo(() => {
    return words.find((w) => currentTime >= w.s && currentTime <= w.e);
  }, [words, currentTime]);

  // Current Subtitle Window
  const visibleWords = useMemo(() => {
    const activeIdx = words.findIndex((w) => currentTime >= w.s && currentTime <= w.e);
    if (activeIdx === -1) {
      // Find nearest upcoming or recent word
      const nextIdx = words.findIndex((w) => w.s > currentTime);
      const start = Math.max(0, (nextIdx === -1 ? words.length : nextIdx) - 3);
      return words.slice(start, start + 7);
    }
    const start = Math.max(0, activeIdx - 3);
    return words.slice(start, start + 7);
  }, [words, currentTime]);

  // Outro transition trigger in final 4 seconds
  const isOutro = currentTime >= 94.0;
  const outroProgress = isOutro ? Math.min(1, (currentTime - 94.0) / 2.0) : 0;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#0c0d12',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 1. NARRATION AUDIO */}
      <Audio src={staticFile(audioSrc)} />

      {/* 2. BACKGROUND & STAGING */}
      {isVertical ? (
        // DUAL-LAYER STAGE PRESENTATION FOR 9:16 VERTICAL
        <>
          {/* Ambient Blurred Cinematic Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              filter: 'blur(32px) brightness(0.40) saturate(1.2)',
              transform: `scale(${scale * 1.08}) translate(${panX * 0.4}px, ${panY * 0.4}px)`,
              transition: 'transform 0.1s linear',
            }}
          >
            <Img
              src={staticFile(beat.asset)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Vignette Overlay on Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at center, rgba(12,14,20,0.2) 20%, rgba(8,10,14,0.85) 85%)',
            }}
          />

          {/* Centered Sharp Character Stage (Full 16:9 widescreen uncropped) */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: width * (9 / 16),
              overflow: 'hidden',
              borderRadius: 0,
              boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 1px 1px rgba(220,180,80,0.25)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
                transformOrigin: 'center center',
              }}
            >
              <Img
                src={staticFile(beat.asset)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            {/* Stage edge subtle gold accent lines */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  'linear-gradient(90deg, transparent, rgba(230,190,70,0.8) 50%, transparent)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  'linear-gradient(90deg, transparent, rgba(230,190,70,0.8) 50%, transparent)',
              }}
            />
          </div>
        </>
      ) : (
        // 16:9 WIDESCREEN CINEMATIC FULL-BLEED
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={staticFile(beat.asset)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          {/* Subtle cinematic widescreen vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at center, transparent 55%, rgba(6,8,12,0.65) 100%)',
            }}
          />
        </div>
      )}

      {/* 3. ATMOSPHERIC 3D PARTICLES */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.75,
        }}
      >
        <ThreeCanvasScene>
          <FloatingEmbers3D />
        </ThreeCanvasScene>
      </div>

      {/* 4. TOP WATERMARK & CHAPTER BADGE */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? 65 : 36,
          left: isVertical ? 35 : 45,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 40,
        }}
      >
        {/* Nexora Brand Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(12, 14, 20, 0.85)',
            border: '1px solid rgba(220, 180, 70, 0.45)',
            borderRadius: 20,
            padding: '6px 14px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#FFD700',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '1.5px',
            }}
          >
            NEXORA
          </span>
        </div>

        {/* Dynamic Story Chapter Badge */}
        <div
          style={{
            backgroundColor: 'rgba(180, 30, 30, 0.85)',
            border: '1px solid rgba(255, 120, 120, 0.5)',
            borderRadius: 20,
            padding: '6px 16px',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(180,30,30,0.35)',
          }}
        >
          {beat.badge}
        </div>
      </div>

      {/* 5. TOP-CENTER CHAPTER HEADLINE (Bold Punchy Hook) */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? 135 : 85,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 40,
          pointerEvents: 'none',
          padding: '0 20px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(10, 12, 18, 0.82)',
            border: '1px solid rgba(220, 180, 60, 0.35)',
            borderRadius: 14,
            padding: '8px 24px',
            color: '#FFDE59',
            fontSize: isVertical ? 22 : 24,
            fontWeight: 900,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {beat.headline}
        </span>
      </div>

      {/* 6. BOTTOM KINETIC SUBTITLE & WORD HIGHLIGHT */}
      <div
        style={{
          position: 'absolute',
          bottom: isVertical ? 110 : 45,
          left: '5%',
          right: '5%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        {/* Subtitle Frosted Container */}
        <div
          style={{
            backgroundColor: 'rgba(8, 10, 16, 0.92)',
            border: '1px solid rgba(220, 180, 70, 0.35)',
            borderRadius: 20,
            padding: isVertical ? '18px 22px' : '14px 28px',
            maxWidth: isVertical ? '95%' : '80%',
            textAlign: 'center',
            boxShadow: '0 15px 45px rgba(0,0,0,0.85), inset 0 0 20px rgba(220,180,70,0.06)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Spoken Words with Kinetic Highlighting */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isVertical ? '6px 8px' : '8px 12px',
              fontSize: isVertical ? 24 : 26,
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            {visibleWords.map((w, idx) => {
              const isCurrent = activeWord && activeWord.w === w.w && activeWord.s === w.s;
              return (
                <span
                  key={`${w.s}-${idx}`}
                  style={{
                    color: isCurrent ? '#FFD700' : '#E8E8EC',
                    textShadow: isCurrent
                      ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 180, 0, 0.5)'
                      : '0 2px 6px rgba(0,0,0,0.9)',
                    transform: isCurrent ? 'scale(1.15)' : 'scale(1.0)',
                    transition: 'color 0.08s ease, transform 0.08s ease',
                    display: 'inline-block',
                  }}
                >
                  {w.w}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. CINEMATIC OUTRO CARD (Last 4 seconds) */}
      {isOutro && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(6, 8, 12, ${outroProgress * 0.92})`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            opacity: outroProgress,
            transform: `scale(${interpolate(outroProgress, [0, 1], [0.92, 1.0])})`,
          }}
        >
          {/* Glowing 3D Emblem */}
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: '#141824',
              border: '3px solid #FFD700',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.3)',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                color: '#FFD700',
                fontSize: 44,
                fontWeight: 900,
              }}
            >
              N
            </span>
          </div>

          <h2
            style={{
              color: '#FFFFFF',
              fontSize: isVertical ? 36 : 42,
              fontWeight: 900,
              letterSpacing: '4px',
              margin: '0 0 8px 0',
              textShadow: '0 0 25px rgba(255,255,255,0.4)',
            }}
          >
            NEXORA
          </h2>

          <p
            style={{
              color: '#FFD700',
              fontSize: isVertical ? 18 : 22,
              fontWeight: 700,
              letterSpacing: '1.5px',
              margin: '0 0 24px 0',
              textAlign: 'center',
            }}
          >
            UNBELIEVABLE TRUE STORIES
          </p>

          <div
            style={{
              backgroundColor: '#FFD700',
              color: '#0A0D14',
              padding: '12px 32px',
              borderRadius: 30,
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: '1.5px',
              boxShadow: '0 8px 30px rgba(255,215,0,0.45)',
            }}
          >
            FOLLOW FOR MORE
          </div>
        </div>
      )}
    </div>
  );
};
