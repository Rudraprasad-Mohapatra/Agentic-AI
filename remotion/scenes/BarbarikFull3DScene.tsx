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
import { CinematicParallaxCard } from '../components/CinematicParallaxCard';
import { SudarshanChakra3D } from '../components/SudarshanChakra3D';
import { TeenBaan3D } from '../components/TeenBaan3D';
import { FloatingEmbers3D } from '../components/FloatingEmbers3D';
import { WordTiming } from '../types';
import * as THREE from 'three';

export interface BarbarikFull3DSceneProps {
  words?: WordTiming[];
  audioSrc?: string;
}

// ══════════════════════════════════════════════════════════════════════
// MASTER COMPOSITION: 3D PARALLAX & DEPTH PROJECTION BARBARIK
// ══════════════════════════════════════════════════════════════════════
export const BarbarikFull3DScene: React.FC<BarbarikFull3DSceneProps> = ({
  words = [],
  audioSrc = staticFile('barbarik/narration.wav'),
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isLandscape = width > height;
  const currentTime = frame / fps;

  // Active Spoken Word Highlight from Whisper
  const activeWord = useMemo(() => {
    if (!words || words.length === 0) return null;
    return words.find((w) => currentTime >= w.s - 0.15 && currentTime <= w.e + 0.25) || null;
  }, [words, currentTime]);

  // Current Story Beat Titles & Subtitles
  let badge = 'कुरुक्षेत्र का महायुद्ध';
  let heroTitle = 'तीन बाणों वाला योद्धा';
  let englishSub = 'Imagine a warrior who needed only three arrows to defeat an entire army!';

  if (currentTime < 8.32) {
    badge = 'कुरुक्षेत्र का महायुद्ध';
    heroTitle = 'तीन बाणों वाला योद्धा';
    englishSub = 'Imagine a warrior who needed only three arrows to defeat an entire army!';
  } else if (currentTime < 13.15) {
    badge = 'भीम का पौत्र';
    heroTitle = 'घटोत्कच-पुत्र बर्बरीक';
    englishSub = 'His name was Barbarik, grandson of Bhima and son of Ghatotkacha.';
  } else if (currentTime < 23.42) {
    badge = 'माँ को दिया वचन';
    heroTitle = 'हारने वाले का साथ';
    englishSub = 'He held three divine arrows and vowed to his mother to always support the losing side.';
  } else if (currentTime < 30.07) {
    badge = 'श्रीकृष्ण की परीक्षा';
    heroTitle = 'पीपल के वृक्ष की चुनौती';
    englishSub = 'When he reached Kurukshetra, Lord Krishna tested him in the disguise of a Brahmin.';
  } else if (currentTime < 35.58) {
    badge = 'असंभव चुनौती';
    heroTitle = 'एक तीर से सारे पत्ते!';
    englishSub = 'Krishna challenged him to pierce every single leaf of the Peepal tree with a single arrow.';
  } else if (currentTime < 41.15) {
    badge = 'दिव्य तीर का प्रहार';
    heroTitle = 'हर पत्ता छिद गया!';
    englishSub = 'Barbarik released the arrow — and it pierced every single leaf across the entire tree!';
  } else if (currentTime < 44.85) {
    badge = 'श्रीकृष्ण का पैर';
    heroTitle = 'पैर के नीचे छिपा पत्ता!';
    englishSub = 'Even the leaf hidden secretly beneath Krishna’s foot was tracked down!';
  } else if (currentTime < 53.62) {
    badge = 'श्रीकृष्ण का निर्णय';
    heroTitle = 'धर्म की रक्षा';
    englishSub = 'Krishna realized Barbarik’s vow would cause an endless loop of destruction.';
  } else if (currentTime < 63.68) {
    badge = 'महाभारत का महात्याग';
    heroTitle = 'शीश दान – महादानी बर्बरीक';
    englishSub = 'Barbarik joyfully offered his own head, asking only to witness the entire Mahabharata war.';
  } else if (currentTime < 70.09) {
    badge = 'कलियुग के देवता';
    heroTitle = 'जय श्री खाटू श्याम जी';
    englishSub = 'For this supreme sacrifice, Lord Krishna blessed him to be revered in Kaliyuga as Khatu Shyam.';
  } else {
    badge = 'NEXORA PRESENTS';
    heroTitle = 'Follow For More Untold Stories';
    englishSub = 'Follow NEXORA for more epic stories of Indian History & Mythology!';
  }

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
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3D PARALLAX SHOT SEQUENCES (FRAME ACCURATE) */}
      {/* ══════════════════════════════════════════════════════════════════════ */}

      {/* SHOT 1: THE IMPOSSIBLE WARRIOR (0 – 8.32s, 250f) */}
      <Sequence from={0} durationInFrames={250}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/barbarik_heroic.jpg')}
          durationInFrames={250}
          cameraMotion="pushIn"
          isLandscape={isLandscape}
          focusPoint={{ x: 50, y: 35 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            {/* Real 3D Teen Baan glowing above Barbarik's open palm */}
            <TeenBaan3D
              position={[isLandscape ? -0.85 : -0.72, 0.42, 0]}
              scale={isLandscape ? 0.72 : 0.85}
              glowIntensity={4.2}
            />
            {/* Drifting golden embers in true 3D space */}
            <FloatingEmbers3D count={35} color="#FBBF24" />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 2: GRANDSON OF BHIMA & GHATOTKACHA (8.32 – 13.15s, 145f) */}
      <Sequence from={250} durationInFrames={145}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/barbarik_heroic.jpg')}
          durationInFrames={145}
          cameraMotion="heroZoom"
          isLandscape={isLandscape}
          focusPoint={{ x: 48, y: 28 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            <FloatingEmbers3D count={30} color="#FDE047" speedMultiplier={1.2} />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 3: THE THREE DIVINE ARROWS & VOW TO MOTHER (13.15 – 23.42s, 308f) */}
      <Sequence from={395} durationInFrames={308}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/scene2_three_arrows.jpg')}
          durationInFrames={308}
          cameraMotion="craneUp"
          isLandscape={isLandscape}
          focusPoint={{ x: 50, y: 40 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            <TeenBaan3D position={[0, 0.15, 0]} scale={1.05} glowIntensity={4.5} />
            <FloatingEmbers3D count={40} color="#FBBF24" />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 4: KRISHNA IN BRAHMIN DISGUISE AT PEEPAL TREE (23.42 – 30.07s, 200f) */}
      <Sequence from={703} durationInFrames={200}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/peepal_tree_shot.jpg')}
          durationInFrames={200}
          cameraMotion="panRight"
          isLandscape={isLandscape}
          focusPoint={{ x: 28, y: 55 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            <FloatingEmbers3D count={25} color="#FEF08A" speedMultiplier={0.8} />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 5: BARBARIK DRAWS HIS GOLDEN BOW (30.07 – 35.58s, 165f) */}
      <Sequence from={903} durationInFrames={165}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/barbarik_aiming.jpg')}
          durationInFrames={165}
          cameraMotion="pushIn"
          isLandscape={isLandscape}
          focusPoint={{ x: 52, y: 35 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            <FloatingEmbers3D count={30} color="#FBBF24" />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 6: ARROW PIERCES EVERY SINGLE LEAF (35.58 – 41.15s, 167f) */}
      <Sequence from={1068} durationInFrames={167}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/peepal_tree_shot.jpg')}
          durationInFrames={167}
          cameraMotion="craneUp"
          isLandscape={isLandscape}
          focusPoint={{ x: 55, y: 30 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            {/* Divine Arrow streak particles */}
            <FloatingEmbers3D count={55} color="#FEF08A" speedMultiplier={2.2} />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 7: THE HIDDEN LEAF BENEATH KRISHNA'S FOOT (41.15 – 44.85s, 111f) */}
      <Sequence from={1235} durationInFrames={111}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ThreeCanvasScene
            backgroundColor="#0B0D18"
            fogColor="#0B0D18"
            fogNear={4}
            fogFar={18}
            shadows={true}
          >
            {/* Ground earth */}
            <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#2B1E13" roughness={0.9} />
            </mesh>

            {/* Krishna's Lotus Foot on Ground */}
            <group position={[0, 0.08, 0]}>
              <mesh castShadow position={[0, 0.06, 0]}>
                <boxGeometry args={[0.26, 0.16, 0.52]} />
                <meshStandardMaterial color="#38BDF8" roughness={0.5} />
              </mesh>
              {/* Golden Anklet */}
              <mesh position={[0, 0.14, -0.1]}>
                <torusGeometry args={[0.14, 0.022, 8, 16]} />
                <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>

            {/* The Single Green Peepal Leaf Under Foot */}
            <mesh position={[0, 0.02, 0.18]} rotation={[-Math.PI / 2, 0, 0.15]}>
              <planeGeometry args={[0.25, 0.36]} />
              <meshStandardMaterial color="#16A34A" roughness={0.5} />
            </mesh>

            {/* Divine Golden Arrow Hovering & Vibrating Directly Above Foot */}
            <group position={[0, 0.68 + Math.sin(frame * 1.5) * 0.025, 0.18]}>
              <mesh>
                <cylinderGeometry args={[0.016, 0.016, 0.85, 8]} />
                <meshStandardMaterial color="#FDE047" metalness={0.9} />
              </mesh>
              <mesh position={[0, -0.44, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.06, 0.2, 8]} />
                <meshStandardMaterial
                  color="#FEF08A"
                  emissive="#FBBF24"
                  emissiveIntensity={5.5}
                />
              </mesh>
              {/* Pulsing Shockwave Light Ring */}
              <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.16, 0.22, 24]} />
                <meshBasicMaterial color="#FBBF24" side={THREE.DoubleSide} />
              </mesh>
              <pointLight position={[0, -0.44, 0]} intensity={4.5} distance={7} color="#FBBF24" />
            </group>

            <FloatingEmbers3D count={25} color="#FBBF24" />
          </ThreeCanvasScene>
        </div>
      </Sequence>

      {/* SHOT 8: KRISHNA'S SUDARSHAN CHAKRA & DIVINE DIALOGUE (44.85 – 53.62s, 263f) */}
      <Sequence from={1346} durationInFrames={263}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/krishna_talk_perfect_clean.png')}
          durationInFrames={263}
          cameraMotion="pushIn"
          isLandscape={isLandscape}
          focusPoint={{ x: 42, y: 40 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            {/* 🪓 SUDARSHAN CHAKRA SPINS RIGHT ABOVE KRISHNA'S RAISED HAND (NO TRISHUL!) 🪓 */}
            <SudarshanChakra3D
              position={[isLandscape ? -0.84 : -0.66, 0.44, 0]}
              scale={isLandscape ? 0.65 : 0.78}
              rotationSpeed={0.16}
            />
            <FloatingEmbers3D count={40} color="#FBBF24" />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 9: THE SUPREME SACRIFICE - SHEESH DAAN (53.62 – 63.68s, 302f) */}
      <Sequence from={1608} durationInFrames={302}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/sheesh_daan_perfect_clean.png')}
          durationInFrames={302}
          cameraMotion="pullBack"
          isLandscape={isLandscape}
          focusPoint={{ x: 52, y: 45 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            <FloatingEmbers3D count={45} color="#FBBF24" speedMultiplier={0.9} />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 10: KHATU SHYAM DIVINE BOON (63.68 – 70.09s, 193f) */}
      <Sequence from={1910} durationInFrames={193}>
        <CinematicParallaxCard
          imageSrc={staticFile('barbarik/khatu_shyam_divine.png')}
          durationInFrames={193}
          cameraMotion="craneUp"
          isLandscape={isLandscape}
          focusPoint={{ x: 50, y: 35 }}
        >
          <ThreeCanvasScene backgroundColor="transparent" fogColor="" shadows={false}>
            <FloatingEmbers3D count={50} color="#FEF08A" speedMultiplier={1.1} />
          </ThreeCanvasScene>
        </CinematicParallaxCard>
      </Sequence>

      {/* SHOT 11: OFFICIAL 3D NEXORA OUTRO CARD (70.09 – 74.65s, 137f) */}
      <Sequence from={2103} durationInFrames={137}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#04060C',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: isLandscape ? 220 : 260,
              height: isLandscape ? 220 : 260,
              borderRadius: '50%',
              padding: 8,
              background: `conic-gradient(from ${(frame / 30) * 1.8}rad, #00F2FE, #4FACFE, #9B51E0, #FF007A, #00F2FE)`,
              boxShadow: '0 0 60px rgba(0, 242, 254, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Img
              src={staticFile('barbarik/nexora_logo.jpg')}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: isLandscape ? 40 : 48,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 3,
              textShadow: '0 0 24px rgba(79, 172, 254, 0.8)',
            }}
          >
            NEXORA
          </div>

          <div
            style={{
              marginTop: 12,
              padding: '8px 26px',
              borderRadius: 9999,
              background: 'linear-gradient(90deg, #FF007A, #9B51E0)',
              color: '#FFFFFF',
              fontSize: isLandscape ? 20 : 24,
              fontWeight: 800,
              letterSpacing: 1.5,
              boxShadow: '0 0 25px rgba(255, 0, 122, 0.6)',
            }}
          >
            SUBSCRIBE FOR MORE
          </div>
        </div>
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CHAPTER BADGE & HERO TITLE (TOP OVERLAY) */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTime < 70.09 && (
        <div
          style={{
            position: 'absolute',
            top: isLandscape ? 40 : 80,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 30,
            pointerEvents: 'none',
            padding: '0 24px',
          }}
        >
          {/* Chapter Badge */}
          <div
            style={{
              padding: '6px 18px',
              borderRadius: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(251, 191, 36, 0.65)',
              color: '#FDE047',
              fontSize: isLandscape ? 16 : 22,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              boxShadow: '0 0 16px rgba(251, 191, 36, 0.3)',
              marginBottom: 8,
            }}
          >
            • {badge} •
          </div>

          {/* Hero Devanagari Chapter Title */}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: isLandscape ? 32 : 44,
              fontWeight: 900,
              textAlign: 'center',
              textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 16px rgba(251, 191, 36, 0.4)',
              letterSpacing: 1,
            }}
          >
            {heroTitle}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* WATERMARK LOGO (TOP LEFT) */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: isLandscape ? 24 : 45,
          left: isLandscape ? 30 : 35,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 30,
          opacity: 0.85,
        }}
      >
        <Img
          src={staticFile('barbarik/nexora_logo.jpg')}
          style={{
            width: isLandscape ? 34 : 42,
            height: isLandscape ? 34 : 42,
            borderRadius: '50%',
            border: '2px solid #00F2FE',
          }}
        />
        <span
          style={{
            color: '#FFFFFF',
            fontSize: isLandscape ? 16 : 20,
            fontWeight: 800,
            letterSpacing: 1.5,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          NEXORA
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SPOKEN WORD & ENGLISH TRANSLATION (BOTTOM OVERLAY) */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {currentTime < 70.09 && (
        <div
          style={{
            position: 'absolute',
            bottom: isLandscape ? 36 : 90,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 30,
            padding: '0 28px',
            pointerEvents: 'none',
          }}
        >
          {/* Active Spoken Word Highlight */}
          {activeWord && (
            <div
              style={{
                fontSize: isLandscape ? 36 : 50,
                fontWeight: 900,
                color: '#FACC15',
                textTransform: 'uppercase',
                letterSpacing: 2,
                textShadow: '0 4px 18px rgba(0,0,0,0.95), 0 0 24px rgba(250, 204, 21, 0.65)',
                marginBottom: 14,
                padding: '4px 18px',
                borderRadius: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
              }}
            >
              {activeWord.w}
            </div>
          )}

          {/* English Translation Subtitle Card */}
          <div
            style={{
              maxWidth: isLandscape ? 820 : 960,
              padding: isLandscape ? '12px 28px' : '16px 32px',
              borderRadius: 16,
              backgroundColor: 'rgba(8, 12, 22, 0.82)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              color: '#F1F5F9',
              fontSize: isLandscape ? 20 : 25,
              fontWeight: 600,
              lineHeight: 1.35,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            }}
          >
            {englishSub}
          </div>
        </div>
      )}

      {/* Continuous Audio Master Track */}
      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};
