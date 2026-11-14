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
import { useThree } from '@react-three/fiber';
import { ThreeCanvasScene } from '../components/ThreeCanvasScene';
import { BarbarikWarrior3D } from '../components/BarbarikWarrior3D';
import { KrishnaAvatar3D } from '../components/KrishnaAvatar3D';
import { PeepalTree3D } from '../components/PeepalTree3D';
import { BattlefieldEnv3D } from '../components/BattlefieldEnv3D';
import { WordTiming } from '../types';
import * as THREE from 'three';

export interface BarbarikFull3DSceneProps {
  words?: WordTiming[];
  audioSrc?: string;
}

// ══════════════════════════════════════════════════════════════════════
// SMOOTH SHOT CAMERA CONTROLLER (LOCAL FRAME BOUND)
// ══════════════════════════════════════════════════════════════════════
const ShotCamera: React.FC<{
  startPos: [number, number, number];
  endPos: [number, number, number];
  lookAt: [number, number, number];
  duration: number;
  fov?: number;
}> = ({ startPos, endPos, lookAt, duration, fov = 40 }) => {
  const { camera } = useThree();
  const frame = useCurrentFrame();

  React.useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
    }
    const p = Math.min(1, Math.max(0, frame / Math.max(1, duration)));
    // Smooth quadratic ease-in-out
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    const x = startPos[0] + (endPos[0] - startPos[0]) * ease;
    const y = startPos[1] + (endPos[1] - startPos[1]) * ease;
    const z = startPos[2] + (endPos[2] - startPos[2]) * ease;

    camera.position.set(x, y, z);
    camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    camera.updateProjectionMatrix();
  }, [camera, frame, duration, startPos, endPos, lookAt, fov]);

  return null;
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 1: KURUKSHETRA BATTLEFIELD INTRODUCTION (0 – 13.15s, 395f)
// ══════════════════════════════════════════════════════════════════════
const Shot1Battlefield: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  return (
    <ThreeCanvasScene
      backgroundColor="#090E1D"
      fogColor="#090E1D"
      fogNear={12}
      fogFar={45}
      shadows={true}
    >
      <ShotCamera
        startPos={[0, 1.8, isLandscape ? 4.4 : 4.8]}
        endPos={[0, 1.5, isLandscape ? 3.0 : 3.4]}
        lookAt={[0, 1.35, 0]}
        duration={395}
        fov={isLandscape ? 36 : 42}
      />
      <BattlefieldEnv3D />
      <BarbarikWarrior3D position={[0, 0, 0]} pose="heroic" glowIntensity={3.2} />
    </ThreeCanvasScene>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 2: THE THREE DIVINE ARROWS & VOW TO MOTHER (13.15 – 23.42s, 308f)
// ══════════════════════════════════════════════════════════════════════
const Shot2ArrowsCloseUp: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  return (
    <ThreeCanvasScene
      backgroundColor="#0A0B14"
      fogColor="#0A0B14"
      fogNear={6}
      fogFar={22}
      shadows={true}
    >
      <ShotCamera
        startPos={[0.8, 1.5, isLandscape ? 2.2 : 2.5]}
        endPos={[-0.7, 1.6, isLandscape ? 2.0 : 2.3]}
        lookAt={[0, 1.45, 0.2]}
        duration={308}
        fov={isLandscape ? 35 : 40}
      />
      <BattlefieldEnv3D showTorches={true} showDistantArmy={false} />
      <BarbarikWarrior3D position={[0, 0, 0]} pose="holdingArrows" glowIntensity={4.2} />
    </ThreeCanvasScene>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 3: MEETING KRISHNA UNDER THE PEEPAL TREE (23.42 – 30.07s, 200f)
// ══════════════════════════════════════════════════════════════════════
const Shot3PeepalMeeting: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  return (
    <ThreeCanvasScene
      backgroundColor="#080F1E"
      fogColor="#080F1E"
      fogNear={12}
      fogFar={45}
      shadows={true}
    >
      <ShotCamera
        startPos={[-0.4, 1.7, isLandscape ? 4.4 : 5.0]}
        endPos={[0.3, 1.7, isLandscape ? 4.0 : 4.6]}
        lookAt={[0, 1.35, 0]}
        duration={200}
        fov={isLandscape ? 38 : 44}
      />
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>
      {/* Peepal Tree situated deeper in background with sprawling canopy */}
      <PeepalTree3D position={[0, 0, -5.5]} scale={1.6} />
      {/* Barbarik on left */}
      <BarbarikWarrior3D
        position={[isLandscape ? -1.2 : -0.75, 0, 0]}
        rotation={[0, 0.45, 0]}
        pose="heroic"
      />
      {/* Krishna as Brahmin on right */}
      <KrishnaAvatar3D
        position={[isLandscape ? 1.2 : 0.75, 0, 0]}
        rotation={[0, -0.45, 0]}
        isBrahmin={true}
      />
    </ThreeCanvasScene>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 4: ARROW SPIRALING THROUGH TREE CANOPY (30.07 – 41.15s, 332f)
// ══════════════════════════════════════════════════════════════════════
const Shot4ArrowFlight: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // Golden arrow spiraling through the 3D foliage
  const arrowAngle = t * 4.5;
  const arrowRadius = 2.4 - t * 0.12;
  const arrowX = Math.cos(arrowAngle) * Math.max(1.1, arrowRadius);
  const arrowZ = -2.6 + Math.sin(arrowAngle) * Math.max(1.1, arrowRadius);
  const arrowY = 3.4 + Math.sin(arrowAngle * 1.5) * 0.9;

  return (
    <ThreeCanvasScene
      backgroundColor="#060C18"
      fogColor="#060C18"
      fogNear={8}
      fogFar={38}
      shadows={true}
    >
      <ShotCamera
        startPos={[2.0, 2.6, isLandscape ? 4.2 : 4.8]}
        endPos={[-1.6, 3.2, isLandscape ? 4.4 : 5.0]}
        lookAt={[0, 3.0, -1.5]}
        duration={332}
        fov={isLandscape ? 40 : 46}
      />
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>
      {/* Barbarik aiming from left */}
      <BarbarikWarrior3D position={[-1.6, 0, 0.4]} rotation={[0, 0.7, 0]} pose="aiming" />
      {/* Ancient Peepal Tree */}
      <PeepalTree3D position={[0, 0, -2.6]} scale={1.2} />
      {/* Krishna standing beside the tree watching */}
      <KrishnaAvatar3D position={[1.4, 0, -0.5]} rotation={[0, -0.6, 0]} isBrahmin={true} />

      {/* Spiraling Divine Arrow in 3D Flight */}
      <group position={[arrowX, arrowY, arrowZ]} rotation={[0, -arrowAngle - Math.PI / 2, 0.35]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 1.2, 8]} />
          <meshStandardMaterial color="#FEF08A" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <coneGeometry args={[0.08, 0.26, 8]} />
          <meshStandardMaterial
            color="#FDE047"
            emissive="#EAB308"
            emissiveIntensity={4.8}
          />
        </mesh>
        <pointLight intensity={5.0} distance={10} color="#FBBF24" />
      </group>
    </ThreeCanvasScene>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 5: THE HIDDEN LEAF BENEATH KRISHNA'S FOOT (41.15 – 44.85s, 111f)
// ══════════════════════════════════════════════════════════════════════
const Shot5HiddenLeaf: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  const frame = useCurrentFrame();
  const vibrate = Math.sin(frame * 1.6) * 0.025;

  return (
    <ThreeCanvasScene
      backgroundColor="#0A0B14"
      fogColor="#0A0B14"
      fogNear={4}
      fogFar={18}
      shadows={true}
    >
      <ShotCamera
        startPos={[0.6, 0.8, isLandscape ? 1.4 : 1.7]}
        endPos={[0.35, 0.65, isLandscape ? 1.15 : 1.35]}
        lookAt={[0, 0.22, 0.05]}
        duration={111}
        fov={isLandscape ? 36 : 42}
      />
      {/* Sandy Earth Ground */}
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
      <group position={[0, 0.72 + vibrate, 0.18]} rotation={[0, 0, 0]}>
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
    </ThreeCanvasScene>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 6: SHEESH DAAN & DIVINE REVELATION (44.85 – 63.64s, 564f)
// ══════════════════════════════════════════════════════════════════════
const Shot6DivineSacrifice: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  return (
    <ThreeCanvasScene
      backgroundColor="#070A18"
      fogColor="#070A18"
      fogNear={8}
      fogFar={36}
      shadows={true}
    >
      <ShotCamera
        startPos={[0, 1.8, isLandscape ? 3.8 : 4.4]}
        endPos={[0, 1.5, isLandscape ? 2.8 : 3.4]}
        lookAt={[0, 1.25, 0]}
        duration={564}
        fov={isLandscape ? 36 : 42}
      />
      <BattlefieldEnv3D showTorches={true} showDistantArmy={true} />
      {/* Front key light to illuminate devotion faces */}
      <pointLight position={[0, 2.0, 2.4]} intensity={3.0} color="#FFFBEB" />
      {/* Krishna in full Divine Form on Right */}
      <KrishnaAvatar3D
        position={[isLandscape ? 0.7 : 0.45, 0, 0]}
        rotation={[0, -0.35, 0]}
        isBrahmin={false}
        divineAuraProgress={1.0}
      />
      {/* Barbarik Kneeling in Complete Devotion on Left */}
      <BarbarikWarrior3D
        position={[isLandscape ? -0.7 : -0.45, 0, 0.2]}
        rotation={[0, 0.4, 0]}
        pose="kneeling"
      />
    </ThreeCanvasScene>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 7: SACRED SHRINE OF KHATU SHYAM (63.64 – 70.09s, 193f)
// ══════════════════════════════════════════════════════════════════════
const Shot7KhatuShyam: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  return (
    <ThreeCanvasScene
      backgroundColor="#1A0E08"
      fogColor="#1A0E08"
      fogNear={6}
      fogFar={30}
      shadows={true}
    >
      <ShotCamera
        startPos={[0, 1.5, isLandscape ? 3.2 : 3.8]}
        endPos={[0, 1.8, isLandscape ? 2.4 : 2.8]}
        lookAt={[0, 1.45, 0]}
        duration={193}
        fov={isLandscape ? 36 : 42}
      />
      {/* Front warm key light illuminating the sacred golden face */}
      <pointLight position={[0, 1.8, 2.2]} intensity={4.5} color="#FEF08A" />

      {/* Sacred Hill Altar */}
      <mesh receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.5, 2.0, 1.0, 16]} />
        <meshStandardMaterial color="#9A3412" roughness={0.85} />
      </mesh>

      {/* Divine Crowned Head of Khatu Shyam */}
      <group position={[0, 1.55, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.32, 20, 20]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Golden Mukut */}
        <group position={[0, 0.28, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.34, 0.3, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.92} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <coneGeometry args={[0.22, 0.35, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
        {/* Rotating Sunburst Halo */}
        <mesh position={[0, 0.1, -0.15]} rotation={[0, 0, t * 1.5]}>
          <ringGeometry args={[0.55, 0.68, 32]} />
          <meshBasicMaterial color="#FEF08A" side={THREE.DoubleSide} />
        </mesh>
        <pointLight intensity={6.0} distance={14} color="#FBBF24" />
      </group>

      {/* Rising Golden Sun in Background */}
      <mesh position={[0, 2.6, -7]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      <pointLight position={[0, 2.6, -6]} intensity={7.0} distance={25} color="#FBBF24" />
    </ThreeCanvasScene>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SHOT 8: OFFICIAL NEXORA OUTRO CARD (70.09 – 74.65s, 138f)
// ══════════════════════════════════════════════════════════════════════
const Shot8NexoraOutro: React.FC<{ isLandscape: boolean }> = ({ isLandscape }) => {
  const frame = useCurrentFrame();
  const rotation = (frame / 30) * 1.8;

  return (
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
      {/* 3D Glowing Orbit Ring */}
      <div
        style={{
          position: 'relative',
          width: isLandscape ? 220 : 260,
          height: isLandscape ? 220 : 260,
          borderRadius: '50%',
          padding: 8,
          background: `conic-gradient(from ${rotation}rad, #00F2FE, #4FACFE, #9B51E0, #FF007A, #00F2FE)`,
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
  );
};

// ══════════════════════════════════════════════════════════════════════
// MASTER COMPOSITION: DUAL-FORMAT 3D BARBARIK VIDEO
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
  let englishSub = 'Barbarik, grandson of Bhima, possessed three divine arrows that never missed.';

  if (currentTime < 13.15) {
    badge = 'कुरुक्षेत्र का महायुद्ध';
    heroTitle = 'तीन बाणों वाला योद्धा';
    englishSub = 'Barbarik, grandson of Bhima, possessed three divine arrows that never missed.';
  } else if (currentTime < 23.42) {
    badge = 'माँ को दिया वचन';
    heroTitle = 'हारने वाले का साथ';
    englishSub = 'He vowed to his mother to always fight for whichever side was losing.';
  } else if (currentTime < 30.07) {
    badge = 'श्रीकृष्ण की परीक्षा';
    heroTitle = 'पीपल के पत्तों की चुनौती';
    englishSub = 'Lord Krishna disguised as a humble Brahmin tested his extraordinary claim.';
  } else if (currentTime < 41.15) {
    badge = 'दिव्य तीर का प्रहार';
    heroTitle = 'एक तीर से हर पत्ता बेध दिया!';
    englishSub = 'Barbarik fired one arrow — piercing every single leaf of the giant tree in seconds!';
  } else if (currentTime < 44.85) {
    badge = 'श्रीकृष्ण का पैर';
    heroTitle = 'पैर के नीचे छिपा पत्ता!';
    englishSub = 'The divine arrow hovered right above Krishna’s foot to pierce the leaf hidden beneath it!';
  } else if (currentTime < 63.64) {
    badge = 'महाभारत का महात्याग';
    heroTitle = 'शीश दान – महादानी बर्बरीक';
    englishSub = 'Barbarik gave his own head to Krishna, asking only to witness the entire war.';
  } else if (currentTime < 70.09) {
    badge = 'कलियुग के देवता';
    heroTitle = 'जय श्री खाटू श्याम जी';
    englishSub = 'For this supreme sacrifice, he is revered across India as the beloved Khatu Shyam.';
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
      {/* ══════════ 3D SHOT SEQUENCES (FRAME ACCURATE) ══════════ */}
      <Sequence from={0} durationInFrames={395}>
        <Shot1Battlefield isLandscape={isLandscape} />
      </Sequence>
      <Sequence from={395} durationInFrames={308}>
        <Shot2ArrowsCloseUp isLandscape={isLandscape} />
      </Sequence>
      <Sequence from={703} durationInFrames={200}>
        <Shot3PeepalMeeting isLandscape={isLandscape} />
      </Sequence>
      <Sequence from={903} durationInFrames={332}>
        <Shot4ArrowFlight isLandscape={isLandscape} />
      </Sequence>
      <Sequence from={1235} durationInFrames={111}>
        <Shot5HiddenLeaf isLandscape={isLandscape} />
      </Sequence>
      <Sequence from={1346} durationInFrames={564}>
        <Shot6DivineSacrifice isLandscape={isLandscape} />
      </Sequence>
      <Sequence from={1910} durationInFrames={193}>
        <Shot7KhatuShyam isLandscape={isLandscape} />
      </Sequence>
      <Sequence from={2103} durationInFrames={137}>
        <Shot8NexoraOutro isLandscape={isLandscape} />
      </Sequence>

      {/* ══════════ CHAPTER BADGE & HERO TITLE (TOP OVERLAY) ══════════ */}
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

      {/* ══════════ WATERMARK LOGO (TOP LEFT) ══════════ */}
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

      {/* ══════════ SPOKEN WORD & ENGLISH TRANSLATION (BOTTOM OVERLAY) ══════════ */}
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
