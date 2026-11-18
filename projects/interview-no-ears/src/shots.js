// THE NO-EARS JOB INTERVIEW - Corporate Comedy Short (Director's Cut)
import * as THREE from 'three';
import { clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Le } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 14)) * (0.6 + 0.4 * Math.sin(t * 5.5)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.4) < 0.12 ? 1 : 0);

const LOOK = {
  sterling: {
    body: '#1A2332',
    pattern: 'suit',
    patCol: '#121924',
    shirtCol: '#E2E8F0',
    neckCol: '#B91C1C', // Power tie
    hair: 'executive',
    hairCol: '#242129',
    silver: true,
    noEars: true, // Smooth earless silhouette!
    extra: [],
    head: '#F7EDE2'
  },
  candidate1: {
    body: '#334155',
    pattern: 'suit',
    patCol: '#1E293B',
    shirtCol: '#FFFFFF',
    neckCol: '#0EA5E9',
    hair: 'quiff',
    hairCol: '#1E1B18',
    extra: [],
    head: '#F5E6D8'
  },
  candidate2: {
    body: '#1E3A5F',
    pattern: 'suit',
    patCol: '#142842',
    shirtCol: '#F1F5F9',
    neckCol: '#EAB308',
    hair: 'sidepart',
    hairCol: '#2D1F17',
    extra: [],
    head: '#EED8C5'
  },
  candidate3: {
    body: '#1E293B',
    pattern: 'suit',
    patCol: '#0F172A',
    shirtCol: '#FFFFFF',
    neckCol: '#2563EB',
    hair: 'quiff',
    hairCol: '#1A1614',
    extra: [],
    head: '#F5E6D8'
  }
};

const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

export function buildShots(E, { is16x9 = false, W: vw = 1080, H: vh = 1920 } = {}) {
  const S = [], cues = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => cues.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(is16x9 ? 34 : 38);
  cam.aspect = vw / vh;
  cam.updateProjectionMatrix();

  const LOOKS = {
    executive: { fov: is16x9 ? 34 : 38, bloom: 0.03, aperture: 0, maxblur: 0, vignette: 0.20, sat: 1.12, warm: 0.02 },
    closeUp: { fov: is16x9 ? 34 : 38, bloom: 0.03, aperture: 0.008, maxblur: 0.004, vignette: 0.22, sat: 1.14, warm: 0.02 },
    wideTwo: { fov: is16x9 ? 42 : 54, bloom: 0.03, aperture: 0, maxblur: 0, vignette: 0.20, sat: 1.12, warm: 0.02 }
  };

  const shoot = (scene, people, from, to, at, at2, k, look, autoFace = true) => {
    const fov = (look.fov || (is16x9 ? 34 : 38));
    if (cam.fov !== fov || cam.aspect !== vw / vh) {
      cam.fov = fov; cam.aspect = vw / vh; cam.updateProjectionMatrix();
    }
    cam.position.copy(mix(from, to, k));
    cam.lookAt(at2 ? mix(at, at2, k) : at);
    if (autoFace) people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: 2.2 });
  };

  // 1. Executive Suite Set
  const suite = WD.corporateSuite(E, { w: 9.5, depth: 8.0, h: 4.2 });
  const desk = PR.executiveDesk();
  desk.position.set(0, 0, 0.15);
  suite.scene.add(desk);

  const chairSterling = PR.executiveChair();
  chairSterling.position.set(0, 0, -0.85);
  suite.scene.add(chairSterling);

  const chairGuest = PR.executiveChair();
  chairGuest.position.set(-0.30, 0, 1.15);
  chairGuest.rotation.y = Math.PI;
  suite.scene.add(chairGuest);

  const laptop = PR.executiveLaptop();
  laptop.position.set(0.40, 1.14, 0.05);
  laptop.rotation.y = -0.25;
  suite.scene.add(laptop);

  const mug = PR.coffeeMug();
  mug.position.set(-0.55, 1.14, -0.25);
  suite.scene.add(mug);

  const stamp = PR.rubberStamp();
  suite.scene.add(stamp);

  const deductionGag = PR.thoughtGlassesDeduction();
  deductionGag.position.set(-0.30, 2.05, 0.88);
  suite.scene.add(deductionGag);

  const outroBoard = PR.nexoraOutroBoard();
  outroBoard.position.set(0, 1.55, 0.10);
  suite.scene.add(outroBoard);

  // 2. Waiting Lobby Set
  const lobby = WD.waitingLobby(E, { w: 8.0, depth: 6.0, h: 3.8 });

  // Characters in Suite
  const sterling = person('sterling', { height: 1.95 });
  sterling.at(0, 0, -0.75);
  suite.scene.add(sterling.group);

  const c1 = person('candidate1', { height: 1.95 });
  c1.at(-0.30, 0, 0.95);
  suite.scene.add(c1.group);

  const c2 = person('candidate2', { height: 1.95 });
  c2.at(-0.30, 0, 0.95);
  suite.scene.add(c2.group);

  const c3 = person('candidate3', { height: 1.95 });
  c3.at(-0.30, 0, 0.95);
  suite.scene.add(c3.group);

  // Characters in Lobby
  const lobbyC1 = person('candidate1', { height: 1.95 });
  lobby.scene.add(lobbyC1.group);
  const lobbyC2 = person('candidate2', { height: 1.95 });
  lobby.scene.add(lobbyC2.group);
  const lobbyC3 = person('candidate3', { height: 1.95 });
  lobby.scene.add(lobbyC3.group);

  const lineActive = (i, t) => t >= L(i) && t <= Le(i);

  // Audio Cues
  cue(8.45, 'slam'); // Stamp slam Candidate 1
  cue(8.50, 'alarm'); // Rejection alarm
  cue(21.45, 'slam'); // Stamp slam Candidate 2
  cue(21.50, 'alarm'); // Rejection alarm 2
  cue(22.68, 'whoosh'); // Cut to Waiting Lobby
  cue(33.95, 'ding'); // Focus chime on deduction
  cue(34.90, 'slide'); // Glasses slide sound
  cue(35.80, 'sparkle'); // Eureka lightbulb chime!
  cue(38.80, 'ding'); // Breathless WOW chime
  cue(45.05, 'music_cut', { dur: 6.0 }); // Hard music silence drop on punchline!
  cue(46.85, 'plop'); // Awkward realization sweat drop
  cue(47.65, 'gulp'); // Candidate 3 nervous swallow
  cue(49.50, 'slam'); // Security stamp slam
  cue(51.25, 'sparkle'); // Outro board bloom

  // ---------------------------------------------------------------------------------
  // SHOT 0: Line 0 (0.35s - 5.88s)
  // Mr. Sterling: Welcome! Your resume is phenomenal. But tell me... do you notice anything unusual about me?
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_0_welcome_c1',
    at: cut(0),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      sterling.group.visible = true;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = false;
      stamp.visible = false;
      deductionGag.visible = false;
      outroBoard.visible = false;
      chairGuest.visible = true;
      chairSterling.visible = true;

      sterling.set({
        mood: t < 3.2 ? 'happy' : 'sly',
        blink: blink(t),
        talk: talk(t, lineActive(0, t)),
        armR: [35, 25],
        armL: [35, 25]
      });

      shoot(suite.scene, [sterling],
        V3(0.08, 1.54, 1.55), V3(0.04, 1.50, 1.35),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 1: Line 1 (6.18s - 8.17s)
  // Candidate 1: Uh... yeah man... you don't have any EARS!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_1_c1_blurt',
    at: cut(1),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      sterling.group.visible = false;
      c1.group.visible = true;
      c2.group.visible = false;
      c3.group.visible = false;
      deductionGag.visible = false;

      c1.set({
        mood: 'smug',
        blink: blink(t),
        talk: talk(t, lineActive(1, t)),
        armR: [75, 45], // pointing straight at boss's head
        armL: [25, 20]
      });

      shoot(suite.scene, [c1],
        V3(-0.30, 1.54, -0.95), V3(-0.30, 1.50, -0.75),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 2: Line 2 (8.47s - 12.38s)
  // Mr. Sterling: I am VERY sensitive about my ears! Get the hell out of my office!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_2_c1_kicked',
    at: cut(2),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = true;
      c1.group.visible = true;
      c2.group.visible = false;
      c3.group.visible = false;
      deductionGag.visible = false;

      // Stamp slams down at t >= 8.45
      const stampK = eob(clamp((t - 8.45) / 0.35));
      stamp.slam(stampK);

      sterling.set({
        mood: 'furious',
        rageRed: true, // Turns fiery red with outrage!
        talk: talk(t, lineActive(2, t)),
        missingEars: true, // Red dashed question marks highlighting missing ears!
        armR: [95, 45],
        armL: [35, 20]
      });
      sterling.pivot.rotation.y = 0.45;

      c1.set({
        mood: 'shock',
        sweat: true,
        blush: true,
        lean: 0.18,
        armR: [15, 15],
        armL: [15, 15]
      });
      c1.pivot.rotation.y = Math.PI - 0.45;

      shoot(suite.scene, [sterling, c1],
        V3(3.50, 1.75, 0.15), V3(3.20, 1.68, 0.15),
        V3(0.10, 1.35, 0.10), null,
        k, LOOKS.wideTwo,
        false
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 3: Line 3 (12.88s - 15.23s)
  // Candidate 2: So we agree on the twenty thousand dollar bonus?
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_3_c2_negotiate',
    at: cut(3),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = true;
      c3.group.visible = false;
      stamp.visible = false;

      c2.set({
        mood: 'smug',
        blink: blink(t),
        talk: talk(t, lineActive(3, t)),
        armR: [45, 30],
        armL: [35, 20]
      });

      shoot(suite.scene, [c2],
        V3(-0.30, 1.54, -0.95), V3(-0.30, 1.50, -0.75),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 4: Line 4 (15.48s - 19.78s)
  // Mr. Sterling: Deal! One last question... do you notice anything strange about my face?
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_4_sterling_q_c2',
    at: cut(4),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = true;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = false;
      stamp.visible = false;
      deductionGag.visible = false;

      sterling.set({
        mood: 'sly',
        blink: blink(t),
        talk: talk(t, lineActive(4, t)),
        armR: [35, 25],
        armL: [35, 25]
      });

      shoot(suite.scene, [sterling],
        V3(0.08, 1.54, 1.50), V3(0.04, 1.50, 1.30),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 5: Line 5 (20.08s - 21.22s)
  // Candidate 2: Dude... where are your EARS?!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_5_c2_blurt',
    at: cut(5),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = true;
      c3.group.visible = false;

      c2.set({
        mood: 'shock',
        talk: talk(t, lineActive(5, t)),
        armR: [80, 45],
        armL: [80, 45]
      });

      shoot(suite.scene, [c2],
        V3(-0.30, 1.54, -0.95), V3(-0.30, 1.50, -0.75),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 6: Line 6 (21.47s - 22.20s)
  // Mr. Sterling: OUT! GET OUT!!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_6_c2_kicked',
    at: cut(6),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = true;
      c1.group.visible = false;
      c2.group.visible = true;
      c3.group.visible = false;

      const stampK = eob(clamp((t - 21.45) / 0.30));
      stamp.slam(stampK);

      sterling.set({
        mood: 'furious',
        rageRed: true,
        talk: talk(t, lineActive(6, t)),
        missingEars: true,
        armR: [100, 50],
        armL: [100, 50]
      });

      c2.set({
        mood: 'shock',
        sweat: true,
        lean: 0.20,
        armR: [15, 15],
        armL: [15, 15]
      });

      shoot(suite.scene, [sterling, c2],
        V3(3.50, 1.75, 0.15), V3(3.20, 1.68, 0.15),
        V3(0.10, 1.35, 0.10), null,
        k, LOOKS.wideTwo,
        false
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 7: Line 7 (22.70s - 26.27s)
  // Lobby Warning: Candidate 2 grabs Candidate 3: Bro! Whatever you do, DO NOT mention his ears! He'll throw you right out!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_7_lobby_warning',
    at: cut(7),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);

      lobbyC1.at(-0.65, 0, 0.40);
      lobbyC2.at(-0.15, 0, 0.40);
      lobbyC3.at(0.45, 0, 0.40);

      lobbyC1.set({
        mood: 'shock',
        sweat: true,
        armR: [25, 20],
        armL: [25, 20]
      });
      lobbyC1.pivot.rotation.y = 0.35;

      lobbyC2.set({
        mood: 'worried',
        sweat: true,
        talk: talk(t, lineActive(7, t)),
        lean: 0.12,
        armR: [80, 50], // reaching out urgently
        armL: [75, 45]
      });
      lobbyC2.pivot.rotation.y = 0.45;

      lobbyC3.set({
        mood: 'neutral',
        armR: [25, 20],
        armL: [25, 20]
      });
      lobbyC3.pivot.rotation.y = -0.35;

      shoot(lobby.scene, [lobbyC1, lobbyC2, lobbyC3],
        V3(0.0, 1.65, 3.4), V3(0.0, 1.60, 3.0),
        V3(0.0, 1.38, 0.4), null,
        k, { ...LOOKS.executive, fov: is16x9 ? 38 : 52 },
        false
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 8: Line 8 (26.57s - 28.51s)
  // Candidate 3: Relax guys. Watch a master at work.
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_8_c3_confidence',
    at: cut(8),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));

      lobbyC1.group.visible = false;
      lobbyC2.group.visible = false;
      lobbyC3.group.visible = true;

      lobbyC3.at(0, 0, 0.40);
      lobbyC3.set({
        mood: 'proud',
        talk: talk(t, lineActive(8, t)),
        armR: [55, 35], // adjusting suit tie
        armL: [25, 20]
      });
      lobbyC3.pivot.rotation.y = 0;

      shoot(lobby.scene, [lobbyC3],
        V3(0.0, 1.55, 2.1), V3(0.0, 1.50, 1.8),
        V3(0.0, 1.48, 0.4), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 9: Line 9 (28.96s - 33.58s)
  // Mr. Sterling: Flawless interview! Now tell me... do you notice anything unusual about me?
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_9_sterling_q_c3',
    at: cut(9),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = true;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = false;
      stamp.visible = false;
      deductionGag.visible = false;

      sterling.set({
        mood: 'sly',
        blink: blink(t),
        talk: talk(t, lineActive(9, t)),
        missingEars: false,
        armR: [35, 25],
        armL: [35, 25]
      });
      sterling.pivot.rotation.y = 0.45;

      shoot(suite.scene, [sterling],
        V3(0.08, 1.54, 1.50), V3(0.04, 1.50, 1.30),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 10: Line 10 (33.98s - 36.58s)
  // Candidate 3: "Hmm... let me see..." + THE HIGH-IQ DEDUCTION THINKING BEAT!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_10_c3_thinking',
    at: cut(10),
    draw(lt, d, t, blit) {
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = true;
      stamp.visible = false;

      // 3D animated thought deduction diagram
      deductionGag.animate(t);
      deductionGag.position.set(-0.30, 2.05, 0.88);
      deductionGag.rotation.set(0, Math.PI, 0);

      // Candidate 3 brings hand up to chin (thinking pose 🤔) and squints intensely!
      c3.set({
        mood: 'squint',
        talk: talk(t, lineActive(10, t)),
        look: [0.0, 0.5],
        lean: 0.12,
        armR: [115, 90], // Hand under chin
        armL: [25, 20]
      });
      c3.pivot.rotation.y = Math.PI;

      shoot(suite.scene, [c3],
        V3(-0.30, 1.62, -1.25), V3(-0.30, 1.56, -1.05),
        V3(-0.30, 1.52, 0.95), null,
        clamp(lt / d), { ...LOOKS.closeUp, fov: is16x9 ? 34 : 46 }
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 11: Line 11 (36.58s - 38.46s)
  // Candidate 3: Yeah... You wear contact lenses, don't you?
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_11_c3_deduction',
    at: cut(11),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = true;
      deductionGag.animate(t); // Fades out

      c3.set({
        mood: 'smug',
        talk: talk(t, lineActive(11, t)),
        armR: [45, 30],
        armL: [25, 20]
      });

      shoot(suite.scene, [c3],
        V3(-0.30, 1.56, -1.05), V3(-0.30, 1.52, -0.85),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 12: Line 12 (38.81s - 42.36s)
  // Mr. Sterling: WAIT... WHAT?! WOW!! That is brilliant! How on earth did you know?!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_12_sterling_amazed',
    at: cut(12),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = true;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = false;
      deductionGag.visible = false;

      sterling.set({
        mood: 'awe', // Sparkling wide amazed eyes!
        talk: talk(t, lineActive(12, t)),
        lean: -0.15,
        armR: [75, 45],
        armL: [75, 45]
      });

      shoot(suite.scene, [sterling],
        V3(0.04, 1.52, 1.25), V3(0.0, 1.48, 1.05),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 13: Line 13 (42.76s - 44.72s)
  // Candidate 3: Well... that's simple Mr. Sterling...
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_13_c3_setup',
    at: cut(13),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = true;

      c3.set({
        mood: 'proud',
        talk: talk(t, lineActive(13, t)),
        armR: [35, 25],
        armL: [35, 25]
      });

      shoot(suite.scene, [c3],
        V3(-0.30, 1.54, -0.95), V3(-0.30, 1.50, -0.75),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 14: Line 14 (45.07s - 46.79s)
  // Candidate 3: You sure as hell couldn't wear glasses! (Hard music stop, comedic deadpan)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_14_punchline',
    at: cut(14),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = true;

      c3.set({
        mood: 'smug',
        talk: talk(t, lineActive(14, t)),
        armR: [45, 30],
        armL: [25, 20]
      });

      shoot(suite.scene, [c3],
        V3(-0.30, 1.54, -0.85), V3(-0.30, 1.50, -0.65),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 15: Line 15 (47.64s - 49.12s)
  // Candidate 3: So... do I still get the job? (PURE PANIC REALIZATION BEAT!)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_15_panic_realization',
    at: cut(15),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = true;

      // Pin-prick eyes, trembling wavy mouth, nervous sweat drops!
      c3.set({
        mood: 'panic',
        sweat: true,
        talk: talk(t, lineActive(15, t)),
        look: [Math.sin(t * 12) * 0.4, 0.1], // eyes darting nervously
        armR: [15, 15],
        armL: [15, 15]
      });

      shoot(suite.scene, [c3],
        V3(-0.30, 1.54, -0.75), V3(-0.30, 1.50, -0.65),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 16: Line 16 (49.52s - 50.46s)
  // Mr. Sterling: SECURITYYYYY!! (Raging red stamp slam!)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_16_security_rage',
    at: cut(16),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      sterling.group.visible = true;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = true;

      const stampK = eob(clamp((t - 49.50) / 0.35));
      stamp.slam(stampK);

      sterling.set({
        mood: 'furious',
        rageRed: true,
        missingEars: true,
        talk: talk(t, lineActive(16, t)),
        armR: [105, 55],
        armL: [105, 55]
      });

      c3.set({
        mood: 'panic',
        sweat: true,
        lean: 0.22,
        armR: [15, 15],
        armL: [15, 15]
      });

      shoot(suite.scene, [sterling, c3],
        V3(3.50, 1.75, 0.15), V3(3.20, 1.68, 0.15),
        V3(0.10, 1.35, 0.10), null,
        k, LOOKS.wideTwo,
        false
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 17: Line 17 (51.26s - 56.06s)
  // OUTRO EXTENSION: Follow Nexora for more hilarious comedy!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_17_nexora_outro',
    at: cut(17),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      sterling.group.visible = false;
      c1.group.visible = false;
      c2.group.visible = false;
      c3.group.visible = false;
      stamp.visible = false;
      deductionGag.visible = false;
      chairGuest.visible = false;
      chairSterling.visible = false;

      // Animate the 3D glowing Nexora subscribe board
      outroBoard.position.set(0.0, 1.55, 0.15);
      outroBoard.animate(t, 51.26);

      shoot(suite.scene, [],
        V3(0.0, 1.56, 1.85), V3(0.0, 1.54, 1.65),
        V3(0.0, 1.52, 0.15), null,
        k, { ...LOOKS.executive, fov: is16x9 ? 34 : 48 },
        false
      );
      blit();
    }
  });

  return { shots: S, cues, duration: 56.059 };
}
