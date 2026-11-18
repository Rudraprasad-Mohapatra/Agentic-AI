// TYPES OF SALARIES - Corporate Comedy Short (Relaxed Director's Cut)
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
  arthur: {
    body: '#1E293B',
    pattern: 'suit',
    patCol: '#0F172A',
    shirtCol: '#F8FAFC',
    neckCol: '#991B1B', // Dark red executive tie
    hair: 'executive',
    hairCol: '#332E38',
    silver: true,
    extra: [],
    head: '#F7EDE2'
  },
  leo: {
    body: '#2563EB',
    pattern: 'suit',
    patCol: '#1D4ED8',
    shirtCol: '#FFFFFF',
    neckCol: '#06B6D4', // Cyan rookie tie
    hair: 'quiff',
    hairCol: '#1E1B18',
    extra: [],
    head: '#F5E6D8'
  }
};

const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

export function buildShots(E, { is16x9 = false, W: vw = 1080, H: vh = 1920 } = {}) {
  const S = [], cues = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => cues.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.05);
  const cam = camera(is16x9 ? 34 : 38);
  cam.aspect = vw / vh;
  cam.updateProjectionMatrix();

  const LOOKS = {
    standard: { fov: is16x9 ? 36 : 40, bloom: 0.03, aperture: 0, maxblur: 0, vignette: 0.20, sat: 1.12, warm: 0.02 },
    closeUp: { fov: is16x9 ? 34 : 38, bloom: 0.03, aperture: 0.008, maxblur: 0.004, vignette: 0.22, sat: 1.14, warm: 0.02 },
    gagShot: { fov: is16x9 ? 44 : 46, bloom: 0.03, aperture: 0, maxblur: 0, vignette: 0.20, sat: 1.12, warm: 0.02 }
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

  // 1. Scene & Environment
  const office = WD.corporateSuite(E, { w: 9.5, depth: 8.0, h: 4.2 });
  const desk = PR.executiveDesk();
  desk.position.set(0, 0, 0.15);
  office.scene.add(desk);

  const chairArthur = PR.executiveChair();
  chairArthur.position.set(0, 0, -0.85);
  office.scene.add(chairArthur);

  const chairGuest = PR.executiveChair();
  chairGuest.position.set(0, 0, 1.15);
  chairGuest.rotation.y = Math.PI;
  office.scene.add(chairGuest);

  const mugArthur = PR.coffeeMug('#1E293B');
  mugArthur.position.set(0.40, 1.14, -0.15);
  office.scene.add(mugArthur);

  const mugLeo = PR.coffeeMug('#2563EB');
  mugLeo.position.set(-0.40, 1.14, 0.45);
  office.scene.add(mugLeo);

  // 2. Characters
  const arthur = person('arthur', { height: 1.95 });
  arthur.at(0, 0, -0.75);
  office.scene.add(arthur.group);

  const leo = person('leo', { height: 1.95 });
  leo.at(0, 0, 0.95);
  office.scene.add(leo.group);

  // 3. 3D Holographic Salary Card Gag
  const salaryCard = PR.salaryCardGag();
  salaryCard.position.set(0, 2.05, 0.90);
  salaryCard.rotation.set(0, Math.PI, 0);
  office.scene.add(salaryCard);

  // 4. Nexora Outro Board
  const outroBoard = PR.nexoraOutroBoard();
  outroBoard.position.set(0, 1.52, 0.0);
  office.scene.add(outroBoard);

  const lineActive = (i, t) => t >= L(i) && t <= Le(i);

  // Audio Cues with unhurried comedic timing
  cue(3.15, 'whoosh');
  cue(7.50, 'ding');
  cue(10.20, 'plop'); // Tear drop
  cue(12.55, 'alarm'); // Damned fire alarm
  cue(19.15, 'ding'); // Magnifying glass search
  cue(25.40, 'pop'); // Magic smoke poof
  cue(30.10, 'slide'); // Calendar flip
  cue(35.85, 'slam'); // Emergency invoice slam
  cue(42.15, 'gulp'); // Rookie nervous swallow
  cue(44.00, 'music_cut', { dur: 3.0 }); // Hard deadpan silence on punchline!
  cue(46.10, 'thud'); // Leo shock / faceplant
  cue(47.00, 'sparkle'); // Visual Nexora outro bloom

  // ---------------------------------------------------------------------------------
  // SHOT 0: Line 0 (0.35s - 2.84s)
  // Leo (The Rookie): Hey Arthur! What kind of salary can I expect here?
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_0_leo_ask',
    at: cut(0),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      desk.visible = true;
      mugArthur.visible = true;
      mugLeo.visible = true;
      salaryCard.visible = false;
      outroBoard.visible = false;

      leo.at(0, 0, 0.95);
      leo.set({
        mood: 'happy',
        talk: talk(t, lineActive(0, t)),
        blink: blink(t),
        armR: [35, 25],
        armL: [25, 20]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.62, -1.25), V3(0.0, 1.56, -1.05),
        V3(0.0, 1.52, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 1: Line 1 (3.24s - 7.02s)
  // Arthur (The Veteran): Ah rookie... in corporate life, there are six types of salaries.
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_1_arthur_intro',
    at: cut(1),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = true;
      leo.group.visible = false;
      chairArthur.visible = true;
      chairGuest.visible = false;
      salaryCard.visible = false;
      outroBoard.visible = false;

      arthur.at(0, 0, -0.75);
      arthur.set({
        mood: 'sly',
        talk: talk(t, lineActive(1, t)),
        blink: blink(t),
        armR: [45, 30], // Holding coffee
        armL: [25, 20]
      });

      shoot(office.scene, [arthur],
        V3(0.08, 1.54, 1.55), V3(0.04, 1.50, 1.35),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 2: Line 2 (7.52s - 12.60s)
  // 1. THE ONION SALARY: The moment you touch it, you start crying! (+ 0.8s reaction gap)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_2_onion_salary',
    at: cut(2),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      outroBoard.visible = false;

      // Animate Onion Card above Leo's head
      salaryCard.position.set(0, 2.05, 0.90);
      salaryCard.rotation.set(0, Math.PI, 0);
      salaryCard.animate(1, t);

      // Leo is seated comfortably behind the desk
      leo.at(0, 0, 0.95);
      leo.set({
        mood: 'sad',
        tears: true, // Weeping tears
        talk: talk(t, false),
        armR: [70, 45], // clutching head in weeping grief
        armL: [70, 45]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.62, -1.25), V3(0.0, 1.56, -1.05),
        V3(0.0, 1.52, 0.95), null,
        k, LOOKS.gagShot
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 3: Line 3 (12.60s - 19.19s)
  // 2. THE DAMNED SALARY: It doesn't help you, it makes you suffer... but you can't live without it! (+ 0.8s reaction gap)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_3_damned_salary',
    at: cut(3),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      outroBoard.visible = false;

      salaryCard.position.set(0, 2.05, 0.90);
      salaryCard.rotation.set(0, Math.PI, 0);
      salaryCard.animate(2, t);

      leo.at(0, 0, 0.95);
      leo.set({
        mood: 'shock',
        sweat: true,
        lean: 0.12,
        armR: [80, 50],
        armL: [80, 50]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.62, -1.25), V3(0.0, 1.56, -1.05),
        V3(0.0, 1.52, 0.95), null,
        k, LOOKS.gagShot
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 4: Line 4 (19.19s - 25.48s)
  // 3. THE AGNOSTIC SALARY: You constantly doubt whether it actually exists. (+ 0.8s reaction gap)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_4_agnostic_salary',
    at: cut(4),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      outroBoard.visible = false;

      salaryCard.position.set(0, 2.05, 0.90);
      salaryCard.rotation.set(0, Math.PI, 0);
      salaryCard.animate(3, t);

      leo.at(0, 0, 0.95);
      leo.set({
        mood: 'squint',
        look: [Math.sin(t * 5) * 0.5, 0.1], // searching for money
        armR: [55, 35],
        armL: [25, 20]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.62, -1.25), V3(0.0, 1.56, -1.05),
        V3(0.0, 1.52, 0.95), null,
        k, LOOKS.gagShot
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 5: Line 5 (25.48s - 30.14s)
  // 4. THE MAGIC SALARY: Now you see it... and now you don't! (+ 0.8s reaction gap)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_5_magic_salary',
    at: cut(5),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      outroBoard.visible = false;

      salaryCard.position.set(0, 2.05, 0.90);
      salaryCard.rotation.set(0, Math.PI, 0);
      salaryCard.animate(4, t);

      leo.at(0, 0, 0.95);
      leo.set({
        mood: 'shock',
        armR: [45, 30],
        armL: [45, 30]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.62, -1.25), V3(0.0, 1.56, -1.05),
        V3(0.0, 1.52, 0.95), null,
        k, LOOKS.gagShot
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 6: Line 6 (30.14s - 35.89s)
  // 5. THE PERIOD SALARY: Comes once a month... and lasts for four days! (+ 0.8s reaction gap)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_6_period_salary',
    at: cut(6),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      outroBoard.visible = false;

      salaryCard.position.set(0, 2.05, 0.90);
      salaryCard.rotation.set(0, Math.PI, 0);
      salaryCard.animate(5, t);

      // Transitions from dancing happy on payday to broke panic on day 5!
      const isBroke = t > 33.2;
      leo.at(0, 0, 0.95);
      leo.set({
        mood: isBroke ? 'panic' : 'proud',
        sweat: isBroke,
        armR: isBroke ? [15, 15] : [70, 45],
        armL: isBroke ? [15, 15] : [70, 45]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.62, -1.25), V3(0.0, 1.56, -1.05),
        V3(0.0, 1.52, 0.95), null,
        k, LOOKS.gagShot
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 7: Line 7 (35.89s - 42.20s)
  // 6. THE IMPOTENT SALARY: When you need it the most... it completely lets you down! (+ 0.85s gap)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_7_impotent_salary',
    at: cut(7),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      outroBoard.visible = false;

      salaryCard.position.set(0, 2.05, 0.90);
      salaryCard.rotation.set(0, Math.PI, 0);
      salaryCard.animate(6, t);

      leo.at(0, 0, 0.95);
      leo.set({
        mood: 'panic',
        sweat: true,
        lean: 0.18,
        armR: [15, 15],
        armL: [15, 15]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.62, -1.25), V3(0.0, 1.56, -1.05),
        V3(0.0, 1.52, 0.95), null,
        k, LOOKS.gagShot
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 8: Line 8 (42.20s - 44.05s)
  // Leo: Wait... which one do we get?!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_8_leo_panic',
    at: cut(8),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      arthur.group.visible = false;
      leo.group.visible = true;
      chairArthur.visible = false;
      chairGuest.visible = true;
      desk.visible = true;
      mugArthur.visible = true;
      mugLeo.visible = true;
      salaryCard.visible = false;
      outroBoard.visible = false;

      leo.at(0, 0, 0.95);
      leo.set({
        mood: 'panic',
        sweat: true,
        talk: talk(t, lineActive(8, t)),
        look: [Math.sin(t * 14) * 0.4, 0.1], // Eyes darting frantically
        armR: [75, 45],
        armL: [75, 45]
      });

      shoot(office.scene, [leo],
        V3(0.0, 1.60, -0.90), V3(0.0, 1.54, -0.65),
        V3(0.0, 1.50, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 9: Line 9 (44.05s - 47.00s)
  // Arthur (The Punchline): All six, buddy. All six.
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_9_arthur_punchline',
    at: cut(9),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      arthur.group.visible = true;
      leo.group.visible = false;
      chairArthur.visible = true;
      chairGuest.visible = false;
      salaryCard.visible = false;
      outroBoard.visible = false;

      arthur.at(0, 0, -0.75);
      arthur.set({
        mood: 'smug', // Deadpan, knowing smile
        talk: talk(t, lineActive(9, t)),
        armR: [45, 30], // Sips coffee
        armL: [25, 20]
      });

      shoot(office.scene, [arthur],
        V3(0.08, 1.54, 1.55), V3(0.04, 1.50, 1.35),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 10: (47.00s - 50.44s)
  // VISUAL ONLY NEXORA OUTRO BOARD (No spoken VO, ringing gold bell + music beat)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_10_nexora_outro',
    at: 47.00,
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      arthur.group.visible = false;
      leo.group.visible = false;
      chairArthur.visible = false;
      chairGuest.visible = false;
      desk.visible = false;
      mugArthur.visible = false;
      mugLeo.visible = false;
      salaryCard.visible = false;
      outroBoard.visible = true;

      // Animate the 3D glowing Nexora subscribe board with gold bell
      outroBoard.position.set(0.0, 1.52, 0.0);
      outroBoard.animate(t, 47.00);

      shoot(office.scene, [],
        V3(0.0, 1.56, 1.85), V3(0.0, 1.54, 1.65),
        V3(0.0, 1.50, 0.0), null,
        k, { ...LOOKS.standard, fov: is16x9 ? 34 : 48 },
        false
      );
      blit();
    }
  });

  return { shots: S, cues, duration: 50.44 };
}
