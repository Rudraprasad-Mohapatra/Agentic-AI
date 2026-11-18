// THE RED CORVETTE JOB INTERVIEW - Dual Character Corporate Comedy Short (Viral Gags Edition)
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 14)) * (0.6 + 0.4 * Math.sin(t * 5.5)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.4) < 0.12 ? 1 : 0);

const holdBusPass = (g, x, y, ang, side) => {
  g.save();
  g.translate(x + 16, y + 10);
  g.scale(2.2, 2.2);
  g.rotate(0.05);
  g.fillStyle = '#F97316';
  g.beginPath(); g.roundRect(-32, -22, 64, 44, 5); g.fill();
  g.fillStyle = '#0F172A';
  g.fillRect(-32, -22, 64, 15);
  g.fillStyle = '#FFFFFF';
  g.font = '900 10px sans-serif';
  g.textAlign = 'center';
  g.fillText('BUS PASS', 0, -11);
  g.fillStyle = '#FFFFFF';
  g.font = '900 14px sans-serif';
  g.fillText('$1.50', 0, 10);
  g.strokeStyle = '#FFFFFF';
  g.lineWidth = 2;
  g.strokeRect(-30, -20, 60, 40);
  g.restore();
};

const LOOK = {
  manager: {
    body: '#1C2735', // Charcoal tailored suit jacket
    pattern: 'suit',
    patCol: '#141E2B', // Deep navy lapels
    shirtCol: '#E2E5EC', // Crisp off-white executive shirt (prevents bloom blowout)
    neckCol: '#B52824', // Crimson executive power tie
    hair: 'executive', // Distinguished combed side-part
    hairCol: '#26242B',
    silver: true, // Silver temple highlights
    hat: 'none',
    extra: ['glasses'], // Thin gold-rimmed executive glasses
    head: '#F7EDE2'
  },
  candidate: {
    body: '#1E3A5F', // Modern slim-fit navy suit
    pattern: 'suit',
    patCol: '#172E4B',
    shirtCol: '#DFE3EB', // Off-white modern dress shirt
    neckCol: '#2563EB', // Sleek cobalt blue tie
    hair: 'quiff', // Modern graduate fade & textured quiff
    hairCol: '#201A15',
    hat: 'none',
    extra: [], // Expressive, relatable human face
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

  // Subtle, photographic bloom and tone curve - zero white glare or light bleeding
  const LOOKS = {
    executive: { fov: is16x9 ? 34 : 38, bloom: 0.03, aperture: 0, maxblur: 0, vignette: 0.20, sat: 1.12, warm: 0.02 },
    closeUp: { fov: is16x9 ? 34 : 38, bloom: 0.03, aperture: 0.008, maxblur: 0.004, vignette: 0.22, sat: 1.14, warm: 0.02 },
    wideTwo: { fov: is16x9 ? 42 : 54, bloom: 0.03, aperture: 0, maxblur: 0, vignette: 0.20, sat: 1.12, warm: 0.02 },
    heroCar: { fov: is16x9 ? 38 : 50, bloom: 0.04, aperture: 0.012, maxblur: 0.006, vignette: 0.24, sat: 1.18, warm: 0.03 }
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

  // 1. Build Modern Corporate Executive Suite
  const suite = WD.corporateSuite(E, {
    w: 9.5,
    depth: 8.0,
    h: 4.2
  });

  // 2. Build 3D Furniture & Executive Props
  const desk = PR.executiveDesk();
  desk.position.set(0, 0, 0.15);
  suite.scene.add(desk);

  // Modern Executive Chairs
  const chairManager = PR.executiveChair();
  chairManager.position.set(0, 0, -0.85);
  suite.scene.add(chairManager);

  const chairCandidate = PR.executiveChair();
  chairCandidate.position.set(-0.30, 0, 1.15);
  chairCandidate.rotation.y = Math.PI;
  suite.scene.add(chairCandidate);

  // Executive Laptop on Desk
  const laptop = PR.executiveLaptop();
  laptop.position.set(0.40, 1.14, 0.05);
  laptop.rotation.y = -0.25;
  suite.scene.add(laptop);

  // Coffee Mug on Desk
  const mug = PR.coffeeMug();
  mug.position.set(-0.55, 1.14, -0.25);
  suite.scene.add(mug);

  // Shiny Red Corvette Model (Centerpiece)
  const corvette = PR.redCorvette();
  corvette.position.set(0.55, 1.15, 0.15);
  suite.scene.add(corvette);

  // Visual Gags: Giant Rubber Stamp, Smoke Poof, and $1.50 Bus Pass
  const stamp = PR.rubberStamp();
  suite.scene.add(stamp);

  const poof = PR.poofCloud();
  suite.scene.add(poof);

  const busPass = PR.busPass();
  suite.scene.add(busPass);

  const perkIcons = PR.perkThoughts();
  suite.scene.add(perkIcons);

  // 3. Characters
  const manager = person('manager', { height: 1.95 });
  manager.at(0, 0, -0.75);
  suite.scene.add(manager.group);

  const candidate = person('candidate', { height: 1.95 });
  candidate.at(-0.30, 0, 0.95);
  suite.scene.add(candidate.group);

  const lineActive = (i, t) => t >= L(i) && t <= Le(i);

  // Audio Cues
  cue(2.0, 'slam'); // Rubber stamp hits paper
  cue(11.2, 'ding'); // $125,000 cash chime
  cue(26.65, 'slide'); // Corvette drift sound
  cue(28.35, 'pop'); // $125k cash badge pops up
  cue(28.60, 'pop'); // Company car badge pops up
  cue(28.85, 'pop'); // Medical expense badge pops up
  cue(29.10, 'pop'); // Dental expense badge pops up
  cue(29.35, 'ding'); // Corvette badge pops up
  cue(29.65, 'sparkle'); // Calculation jackpot banner
  cue(31.10, 'whoosh'); // Pixel sunglasses slide down
  cue(33.24, 'music_cut', { dur: 4.8 }); // Hard silence drop right on "Yeah. But you started it."!
  cue(34.60, 'pop'); // Corvette vanishes into smoke
  cue(34.65, 'tock'); // Bus pass lands on desk
  cue(34.70, 'shatter'); // Sunglasses shatter
  cue(35.90, 'snap'); // Interviewer snaps laptop shut
  cue(36.60, 'slide'); // Resume folder slides away
  cue(37.50, 'plop'); // Sweat / tear drop

  // ---------------------------------------------------------------------------------
  // SHOT 0: Line 0 (Narrator: Never demand a six-figure salary with zero experience.)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_0_hook',
    at: cut(0),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      corvette.visible = false;
      perkIcons.visible = false;
      mug.visible = true;
      busPass.visible = false;
      manager.group.visible = true;
      candidate.group.visible = true;

      // Animate rubber stamp slamming down right on "zero experience" (t >= 1.85)
      const stampK = eob(clamp((t - 1.85) / 0.35));
      stamp.slam(stampK);

      manager.set({
        mood: 'neutral',
        blink: blink(t),
        armR: [25, 20],
        armL: [25, 20]
      });
      manager.pivot.rotation.y = 0.45;

      // Candidate sits smug and proud next to his zero-experience resume
      candidate.set({
        mood: 'proud',
        blink: blink(t, 0.5),
        armR: [35, 25],
        armL: [25, 20]
      });
      candidate.pivot.rotation.y = Math.PI - 0.45;

      // Wide establishing two-shot: starts close on desk resume, pulls back to reveal both characters
      shoot(suite.scene, [manager, candidate],
        V3(2.50, 1.64, 0.25), V3(3.85, 1.80, 0.10),
        V3(0.25, 1.25, 0.15), V3(-0.15, 1.35, 0.10),
        k, LOOKS.wideTwo,
        false
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 1: Line 1 (Manager: So... fresh out of college, what starting salary are you looking for?)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_1_salary_question',
    at: cut(1),
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      corvette.visible = false;
      perkIcons.visible = false;
      stamp.visible = false;
      mug.visible = true;
      busPass.visible = false;
      manager.group.visible = true;
      candidate.group.visible = false; // clean single coverage

      // HR Director leans forward, steepled hands, corporate appraisal
      manager.set({
        mood: 'neutral',
        blink: blink(t),
        talk: talk(t, lineActive(1, t)),
        armR: [35, 25],
        armL: [35, 25]
      });

      // Clean Medium Shot looking straight at HR Director with generous headroom
      shoot(suite.scene, [manager],
        V3(0.10, 1.54, 1.55), V3(0.06, 1.50, 1.35),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 2: Line 2 (Candidate: Well, in the region of a hundred and twenty-five thousand a year... depending on benefits.)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_2_candidate_ask',
    at: cut(2),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      corvette.visible = false;
      perkIcons.visible = false;
      stamp.visible = false;
      mug.visible = false;
      busPass.visible = false;
      manager.group.visible = false;
      candidate.group.visible = true;

      // Candidate leans back confidently, delivers audacious $125k ask with smug grin
      candidate.set({
        mood: 'smug',
        blink: blink(t),
        talk: talk(t, lineActive(2, t)),
        armR: [55, 30],
        armL: [25, 20]
      });

      // Clean Medium Shot on Candidate with comfortable headroom and slat wall backdrop
      shoot(suite.scene, [candidate],
        V3(-0.30, 1.54, -0.95), V3(-0.30, 1.50, -0.75),
        V3(-0.30, 1.48, 0.95), null,
        k, LOOKS.closeUp
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 3: Line 3 (Manager: I see. And what would you say to five weeks paid vacation, full medical and dental,)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_3_counter_vacation',
    at: cut(3),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      corvette.visible = false;
      perkIcons.visible = false;
      stamp.visible = false;
      mug.visible = true;
      busPass.visible = false;
      manager.group.visible = true;
      candidate.group.visible = false;

      // Manager starts counter-escalation with subtle sly smile
      manager.set({
        mood: 'sly',
        blink: blink(t),
        talk: talk(t, lineActive(3, t)),
        armR: [45, 30],
        armL: [25, 20]
      });

      // Medium Shot on Manager from across desk with generous headroom
      shoot(suite.scene, [manager],
        V3(0.12, 1.54, 1.55), V3(0.06, 1.50, 1.35),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.executive
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 4: Line 4 (Manager: a fifty percent retirement match, and a brand new company car every two years?)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_4_counter_perks',
    at: cut(4),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      corvette.visible = false;
      perkIcons.visible = false;
      stamp.visible = false;
      mug.visible = true;
      busPass.visible = false;
      manager.group.visible = true;
      candidate.group.visible = false;

      // Manager gestures with both hands, baiting the hook
      manager.set({
        mood: 'sly',
        blink: blink(t),
        talk: talk(t, lineActive(4, t)),
        armR: [60, 35],
        armL: [35, 25]
      });

      // Subtle dramatic push-in on Manager with generous headroom
      shoot(suite.scene, [manager],
        V3(0.10, 1.52, 1.40), V3(0.04, 1.48, 1.15),
        V3(0.0, 1.48, -0.75), null,
        k, LOOKS.executive
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 5: Line 5 (Manager: Say... a shiny red Corvette?) - THE BAIT
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_5_corvette_reveal',
    at: cut(5),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      corvette.visible = true;
      corvette.scale.set(1, 1, 1);
      stamp.visible = false;
      mug.visible = false;
      busPass.visible = false;
      perkIcons.visible = false;
      manager.group.visible = true;
      candidate.group.visible = true;

      // The Red Corvette drifts smoothly onto the tabletop!
      const driftK = eo(clamp((t - 26.68) / 1.35));
      corvette.drift(t, driftK);

      manager.set({
        mood: 'sly',
        talk: talk(t, lineActive(5, t)),
        armR: [65, 35]
      });
      manager.pivot.rotation.y = 0.45;

      // Candidate stares in astonishment as sports car drifts onto desk
      candidate.set({
        mood: driftK > 0.4 ? 'shock' : 'neutral',
        look: [0.35, -0.3],
        armR: [45, 25],
        armL: [25, 20]
      });
      candidate.pivot.rotation.y = Math.PI - 0.45;

      // 3/4 Side Two-Shot: captures Candidate on left, Corvette drifting in center, Manager on right
      shoot(suite.scene, [manager, candidate],
        V3(3.40, 1.95, 0.10), V3(3.10, 1.85, 0.10),
        V3(0.10, 1.30, 0.10), null,
        driftK, LOOKS.heroCar,
        false
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 6: Line 6 (Candidate 1.35s Calculation Beat + "Wait... Wow...")
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_6_candidate_wait_wow',
    at: 28.30,
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      corvette.visible = true;
      corvette.scale.set(1, 1, 1);
      corvette.drift(t, 1.0);
      stamp.visible = false;
      mug.visible = false;
      busPass.visible = false;
      manager.group.visible = false;
      candidate.group.visible = true;

      // Animate the 5 floating perk badges + calculation banner in 3D around Candidate!
      perkIcons.animate(t, cam);

      // Calculation pause (28.30 to 29.68) vs Speaking Line 6 ("Wait... Wow...", 29.68 to 31.06)
      const isCalculating = t < 29.68;
      if (isCalculating) {
        // Candidate eyes dart across each perk badge popping up!
        let lookDir = [-0.85, 0.75]; // looking at $125k
        if (t >= 28.60 && t < 28.85) lookDir = [0.85, 0.75]; // looking at car
        else if (t >= 28.85 && t < 29.10) lookDir = [-0.90, 0.15]; // looking at medical
        else if (t >= 29.10 && t < 29.35) lookDir = [0.90, 0.15]; // looking at dental
        else if (t >= 29.35) lookDir = [0.0, 1.0]; // looking straight up at Corvette!

        candidate.set({
          mood: t >= 29.35 ? 'shock' : 'neutral',
          look: lookDir,
          talk: 0,
          armR: [35 + Math.sin(t * 8) * 5, 25],
          armL: [25, 20]
        });
      } else {
        // Candidate speaks Line 6: "Wait... Wow..." slowly, unhurried, breathless awe!
        // Mouth moving, eyes wide open in sheer astonishment
        const shadesSlide = clamp((t - 31.08) / 0.18);
        candidate.set({
          shades: shadesSlide > 0 ? shadesSlide : null,
          mood: 'shock',
          talk: talk(t, lineActive(6, t)),
          armR: [45 + Math.sin(t * 6) * 8, 30],
          armL: [45 + Math.cos(t * 6) * 8, 30]
        });
      }

      // Medium reaction shot on Candidate with perk badges framing him
      shoot(suite.scene, [candidate],
        V3(-0.30, 1.58, -1.35), V3(-0.30, 1.54, -1.15),
        V3(-0.30, 1.48, 0.95), null,
        k, { ...LOOKS.closeUp, fov: is16x9 ? 34 : 48 }
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 7: Line 7 (Candidate: "Are you kidding me?!") - CELEBRATION!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_7_candidate_celebrate',
    at: cut(7),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      corvette.visible = true;
      corvette.scale.set(1, 1, 1);
      corvette.drift(t, 1.0);
      stamp.visible = false;
      mug.visible = false;
      busPass.visible = false;
      manager.group.visible = false;
      candidate.group.visible = true;

      // Badges still visible and floating during celebration
      perkIcons.animate(t, cam);

      // Ecstatic arms-up victory celebration with 8-bit meme sunglasses on!
      candidate.set({
        shades: 1.0,
        mood: 'shock',
        talk: talk(t, lineActive(7, t)),
        armR: [140, -20],
        armL: [140, -20]
      });

      // Celebratory angle on Candidate showing arms raised in triumph
      shoot(suite.scene, [candidate],
        V3(-0.30, 1.58, -1.40), V3(-0.30, 1.54, -1.20),
        V3(-0.30, 1.48, 0.95), null,
        k, { ...LOOKS.closeUp, fov: is16x9 ? 34 : 48 }
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 8: Line 8 (Manager: "Yeah. But you started it.") - THE DEADPAN KILL SHOT & SHATTER!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_8_punchline',
    at: cut(8),
    draw(lt, d, t, blit) {
      const isReax = t >= 34.55;
      mug.visible = true;
      stamp.visible = false;
      perkIcons.visible = false;

      if (!isReax) {
        // Part 1: HR Director delivers the deadpan punchline calmly with coffee mug
        manager.group.visible = true;
        candidate.group.visible = false;
        corvette.visible = true;
        corvette.scale.set(1, 1, 1);
        corvette.drift(t, 1.0);
        poof.visible = false;
        busPass.visible = false;

        manager.set({
          mood: 'sly',
          armR: [45, 30],
          talk: talk(t, lineActive(8, t))
        });
        manager.pivot.rotation.y = 0;

        shoot(suite.scene, [manager],
          V3(0.10, 1.54, 1.55), V3(0.04, 1.50, 1.35),
          V3(0.0, 1.48, -0.75), null,
          clamp((t - 33.24) / 1.3), LOOKS.closeUp
        );
      } else {
        // Part 2: Reality Crashes! Wide 2-shot:
        // 1. Red Corvette poofs into cartoon smoke! (t >= 34.55)
        // 2. An unpaid $1.50 City Bus Pass appears on desk!
        // 3. Candidate's meme sunglasses shatter into flying fragments!
        // 4. Candidate's delusion collapses into blushing, sweating humiliation!
        manager.group.visible = true;
        candidate.group.visible = true;

        const poofK = clamp((t - 34.55) / 0.55);
        poof.position.set(0.55, 1.15, 0.15);
        poof.animate(poofK);

        corvette.scale.setScalar(Math.max(0, 1 - poofK * 2));
        corvette.visible = poofK < 0.6;

        busPass.position.set(0.50, 1.155, 0.15);
        busPass.visible = poofK >= 0.35;

        // Manager sips coffee calmly with troll smile
        manager.set({
          mood: 'sly',
          armR: [35, 20]
        });
        manager.pivot.rotation.y = 0.45;

        // Candidate's delusion shatters into defeat!
        candidate.set({
          shades: 1.0,
          shadesShatter: (t - 34.65) * 4.0,
          mood: 'shock',
          blush: true,
          sweat: true,
          lean: 0.10,
          armR: [15, 15],
          armL: [15, 15]
        });
        candidate.pivot.rotation.y = Math.PI - 0.45;

        shoot(suite.scene, [manager, candidate],
          V3(3.60, 1.75, 0.10), V3(3.40, 1.70, 0.10),
          V3(-0.15, 1.35, 0.10), null,
          clamp((t - 34.55) / 0.85), LOOKS.wideTwo,
          false
        );
      }
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 9: Line 9 (Manager: "Anyway... thank you for coming in. We'll keep your resume on file.")
  // Ashamed exit & corporate dismissal!
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_9_dismissal_and_shame',
    at: cut(9),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      stamp.visible = false;
      mug.visible = true;
      corvette.visible = false;
      poof.visible = false;
      perkIcons.visible = false;
      manager.group.visible = true;
      candidate.group.visible = true;

      // Desk actions:
      // Manager snaps laptop shut at t >= 35.85
      const closeK = clamp((t - 35.85) / 0.28);
      laptop.close(closeK);

      // Manager slides Candidate's resume away at t >= 36.50
      if (desk.resume) {
        const slideK = clamp((t - 36.50) / 0.60);
        desk.resume.position.x = 0.45 + slideK * 0.45;
        desk.resume.position.z = 0.15 - slideK * 0.25;
      }

      // Candidate takes the $1.50 bus pass in hand at t >= 36.20
      const hasPass = t >= 36.20;
      busPass.visible = !hasPass;

      // Manager speaks line 9 with polite dismissive smile
      manager.set({
        mood: 'sly',
        talk: talk(t, lineActive(9, t)),
        armR: closeK > 0 && closeK < 1 ? [45, 45] : [35, 20]
      });
      manager.pivot.rotation.y = 0.35;

      // Candidate's walk of shame:
      // Slumps in chair, picks up bus pass, stands up, and walks out with head down in defeat
      const isWalking = t >= 36.80;
      if (!isWalking) {
        // Slumped in seat, blushing with shame and sweat, holding $1.50 bus pass in right hand
        candidate.at(-0.30, 0, 0.95);
        candidate.set({
          mood: 'sad',
          blush: true,
          sweat: true,
          tears: true,
          lean: 0.22,
          armR: hasPass ? [85, 55] : [10, 10],
          armL: [15, 15],
          holdR: hasPass ? holdBusPass : null
        });
        candidate.pivot.rotation.y = Math.PI - 0.45;
      } else {
        // Standing up and walking towards the door in shame with bus pass clearly visible
        const walkK = clamp((t - 36.80) / 3.8);
        const curX = -0.30 - walkK * 2.4;
        const curZ = 0.95 + walkK * 0.9;
        candidate.at(curX, 0, curZ);
        candidate.set({
          legs: 'walk',
          phase: (t - 36.80) * 6.5,
          mood: 'sad',
          blush: true,
          sweat: true,
          tears: true,
          lean: 0.25, // deep slump of defeat
          armR: [85, 55],
          armL: [15 + Math.sin(t * 6) * 10, 20],
          holdR: holdBusPass
        });
        candidate.pivot.rotation.y = Math.PI - 0.65;
      }

      // Wide shot framing the corporate office, tracking the candidate's humiliated exit
      shoot(suite.scene, [manager, candidate],
        V3(3.60, 1.78, 0.15), V3(3.30, 1.70, 0.15),
        V3(-0.25, 1.35, 0.35), null,
        k, LOOKS.wideTwo,
        false
      );
      blit();
    }
  });

  return { shots: S, cues };
}