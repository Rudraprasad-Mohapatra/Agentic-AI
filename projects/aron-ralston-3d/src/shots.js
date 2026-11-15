// HE WAS TRAPPED UNDER A BOULDER - Tall Tale 3D Survival Story
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

// Extend 2D billboard props for Aron's hands
Object.assign(PROPS, {
  backpackProp: (g, x, y) => {
    g.save(); g.translate(x, y - 20); g.rotate(0.1);
    g.fillStyle = '#2D5922'; g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.roundRect(-40, -50, 80, 100, 10); g.fill(); g.stroke();
    g.fillStyle = '#4A80D4'; g.beginPath(); g.roundRect(-35, -65, 70, 20, 6); g.fill(); g.stroke();
    g.restore();
  },
  knifeProp: (g, x, y) => {
    g.save(); g.translate(x, y - 20); g.rotate(-0.3);
    g.fillStyle = '#9C2424'; g.strokeStyle = INK; g.lineWidth = 4;
    g.fillRect(-10, 0, 20, 40); g.strokeRect(-10, 0, 20, 40);
    g.fillStyle = '#C0C0C0'; g.beginPath();
    g.moveTo(-6, 0); g.lineTo(-2, -45); g.lineTo(6, -40); g.lineTo(6, 0); g.closePath();
    g.fill(); g.stroke();
    g.restore();
  },
  waterBottleProp: (g, x, y) => {
    g.save(); g.translate(x, y - 30);
    g.fillStyle = '#3A7EC8'; g.strokeStyle = INK; g.lineWidth = 4;
    g.beginPath(); g.roundRect(-16, -35, 32, 70, 8); g.fill(); g.stroke();
    g.fillStyle = '#222'; g.fillRect(-8, -45, 16, 10);
    g.restore();
  },
  carvingTextProp: (g, x, y) => {
    g.save(); g.translate(x, y - 40);
    g.fillStyle = '#1F140E'; g.strokeStyle = '#D4A373'; g.lineWidth = 3;
    g.strokeRect(-80, -35, 160, 70); g.fillRect(-80, -35, 160, 70);
    g.fillStyle = '#E8C5A0'; g.font = '900 16px Inter'; g.textAlign = 'center';
    g.fillText('ARON RALSTON', 0, -12);
    g.fillText('OCT 75 - APR 03', 0, 10);
    g.fillText('R.I.P.', 0, 26);
    g.restore();
  }
});

// The Cast
const LOOK = {
  aron: {
    body: '#D4752A',
    pattern: 'vest',
    patCol: '#9E4E1C',
    hat: 'cap',
    hatCol: '#254E30',
    band: '#1A3320',
    neck: 'none',
    extra: [],
    head: '#F7EDE2'
  },
  aronOneArm: {
    body: '#D4752A',
    pattern: 'vest',
    patCol: '#9E4E1C',
    hat: 'cap',
    hatCol: '#254E30',
    band: '#1A3320',
    neck: 'none',
    extra: [],
    head: '#F7EDE2'
  },
  son: {
    body: '#3A8FD4',
    pattern: 'plain',
    hat: 'none',
    neck: 'none',
    extra: ['freckles', 'blush'],
    head: '#F9F1E8',
    kid: true
  },
  pilot: {
    body: '#B8461A',
    pattern: 'plain',
    hat: 'visor',
    hatCol: '#1E2530',
    neck: 'collar',
    extra: ['glasses'],
    head: '#F7EDE2'
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
    canyon: { bloom: 0.28, aperture: 0, maxblur: 0, vignette: 0.25, sat: 1.18 },
    trap: { bloom: 0.22, aperture: 0, maxblur: 0, vignette: 0.32, sat: 1.15 },
    night: { bloom: 0.32, aperture: 0, maxblur: 0, vignette: 0.35, sat: 1.05 },
    dream: { bloom: 0.55, aperture: 0, maxblur: 0, vignette: 0.18, sat: 1.25, warm: 0.08 },
    desert: { bloom: 0.35, aperture: 0, maxblur: 0, vignette: 0.22, sat: 1.22, warm: 0.04 },
    summit: { bloom: 0.42, aperture: 0, maxblur: 0, vignette: 0.24, sat: 1.28, warm: 0.06 }
  };

  const shoot = (scene, people, from, to, at, at2, k, look) => {
    const fov = (look.fov || (is16x9 ? 34 : 38));
    if (cam.fov !== fov || cam.aspect !== vw / vh) {
      cam.fov = fov; cam.aspect = vw / vh; cam.updateProjectionMatrix();
    }
    cam.position.copy(mix(from, to, k));
    cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: 4 });
  };

  // 1. Build world scenes
  const mesaSet = WD.canyonRim(E);
  const slotDay = WD.slotCanyon(E, { mode: 'day' });
  const slotNight = WD.slotCanyon(E, { mode: 'night' });
  const slotDawn = WD.slotCanyon(E, { mode: 'dawn' });
  const dreamSet = WD.dreamMeadow(E);
  const desertSet = WD.desertFloor(E);
  const summitSet = WD.mountainSummit(E);

  // 2. Character actors
  const aronMesa = person('aron', { height: 2.1 });
  mesaSet.scene.add(aronMesa.group);

  const aronSlot = person('aron', { height: 2.1 });
  slotDay.scene.add(aronSlot.group);

  const aronNight = person('aron', { height: 2.1 });
  slotNight.scene.add(aronNight.group);

  const aronDawn = person('aron', { height: 2.1 });
  slotDawn.scene.add(aronDawn.group);

  const sonDream = person('son', { height: 1.5 });
  dreamSet.scene.add(sonDream.group);

  const aronDesert = person('aronOneArm', { height: 2.1 });
  desertSet.scene.add(aronDesert.group);

  const aronSummit = person('aronOneArm', { height: 2.1 });
  summitSet.scene.add(aronSummit.group);

  const lineActive = (i, t) => t >= L(i) && t <= Le(i);
  const zScale = is16x9 ? 0.78 : 1.0;

  // Shot 0: Line 0 (0.40 - 10.31) - Intro, Utah Canyon Rim, Aron sets out
  add({
    id: 'shot00_intro',
    at: cut(0),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronMesa.group.position.set(0, 0, 0);
      aronMesa.set({
        mood: 'happy',
        legs: 'walk',
        phase: t * 5.5,
        armL: [15 + Math.sin(t * 5.5) * 20, 20],
        armR: [-15 - Math.sin(t * 5.5) * 20, 20],
        holdR: PROPS.backpackProp,
        talk: talk(t, lineActive(0, t)),
        blink: blink(t)
      });
      shoot(mesaSet.scene, [aronMesa], V3(-1.5, 1.7, 5.5 * zScale), V3(0.5, 1.7, 5.0 * zScale), V3(0, 1.2, 0), null, p, LOOKS.canyon);
      blit();
    }
  });

  // Shot 1: Line 1 (10.56 - 13.35) - He didn't tell a single person
  add({
    id: 'shot01_alone_hint',
    at: cut(1),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronMesa.set({
        mood: 'smug',
        legs: 'stand',
        lean: 5,
        armL: [25, 40],
        armR: [-20, 15],
        talk: talk(t, lineActive(1, t)),
        blink: blink(t)
      });
      shoot(mesaSet.scene, [aronMesa], V3(0, 1.9, 3.8 * zScale), V3(1.2, 1.9, 3.5 * zScale), V3(0, 1.2, 0), null, p, LOOKS.canyon);
      blit();
    }
  });

  // Shot 2: Line 2 (13.70 - 18.26) - Blue John Canyon, narrow slot entrance
  add({
    id: 'shot02_slot_entry',
    at: cut(2),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronSlot.group.position.set(0, 0, lerp(1.5, -0.2, p));
      aronSlot.set({
        mood: 'neutral',
        legs: 'walk',
        phase: t * 4,
        armL: [30, 25],
        armR: [-30, 25],
        talk: talk(t, lineActive(2, t)),
        blink: blink(t)
      });
      shoot(slotDay.scene, [aronSlot], V3(0, 2.0, 7.0 * zScale), V3(0, 2.0, 4.0 * zScale), V3(0, 1.3, -1.0), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 3: Line 3 (18.51 - 24.58) - 800-pound boulder drops, crushes hand!
  add({
    id: 'shot03_boulder_trap',
    at: cut(3),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      const shake = lt < 1.2 ? Math.sin(lt * 40) * 0.08 * (1 - lt / 1.2) : 0;
      slotDay.boulder.position.set(0.3, lerp(3.2, 1.5, Math.min(1, lt * 2.5)), -1.2);

      aronSlot.group.position.set(-0.4, 0, -1.0);
      aronSlot.set({
        mood: 'shock',
        legs: 'stand',
        lean: -12,
        armL: [45, 60],
        armR: [-65, 80],
        sweat: 1,
        talk: talk(t, lineActive(3, t)),
        blink: blink(t)
      });
      shoot(slotDay.scene, [aronSlot], V3(shake, 1.7 + shake, 3.5 * zScale), V3(shake, 1.7 + shake, 3.2 * zScale), V3(0.2, 1.3, -1.2), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 4: Line 4 (24.98 - 29.37) - Completely alone, no signal, dread
  add({
    id: 'shot04_isolation',
    at: cut(4),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronSlot.set({
        mood: 'worried',
        legs: 'stand',
        armL: [20, 70],
        armR: [-60, 85],
        sweat: 0.8,
        talk: talk(t, lineActive(4, t)),
        blink: blink(t)
      });
      shoot(slotDay.scene, [aronSlot], V3(-0.2, 1.6, 3.2 * zScale), V3(-0.2, 2.4, 4.8 * zScale), V3(0, 1.4, -1.2), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 5: Line 5 (29.72 - 34.16) - Pushed, pulled, chipping with knife
  add({
    id: 'shot05_chipping',
    at: cut(5),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      const chipCycle = Math.sin(t * 12);
      aronSlot.set({
        mood: 'angry',
        legs: 'stand',
        lean: 8,
        armL: [35 + chipCycle * 25, 40],
        armR: [-65, 80],
        holdL: PROPS.knifeProp,
        talk: talk(t, lineActive(5, t)),
        blink: blink(t)
      });
      shoot(slotDay.scene, [aronSlot], V3(0.8, 1.5, 2.8 * zScale), V3(0.3, 1.5, 2.6 * zScale), V3(0.1, 1.4, -1.2), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 6: Line 6 (34.41 - 35.36) - Nothing worked.
  add({
    id: 'shot06_nothing',
    at: cut(6),
    draw: (lt, d, t, blit) => {
      aronSlot.set({
        mood: 'tired',
        legs: 'stand',
        lean: -5,
        armL: [10, 20],
        armR: [-60, 80],
        talk: talk(t, lineActive(6, t)),
        blink: 0
      });
      shoot(slotDay.scene, [aronSlot], V3(0, 1.5, 2.6 * zScale), V3(0, 1.5, 2.6 * zScale), V3(0, 1.3, -1.2), null, 0, LOOKS.trap);
      blit();
    }
  });

  // Shot 7: Line 7 (35.86 - 38.09) - Water ran out
  add({
    id: 'shot07_no_water',
    at: cut(7),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronSlot.set({
        mood: 'sad',
        legs: 'stand',
        armL: [30, 90],
        armR: [-60, 80],
        holdL: PROPS.waterBottleProp,
        talk: talk(t, lineActive(7, t)),
        blink: blink(t)
      });
      shoot(slotDay.scene, [aronSlot], V3(-0.3, 1.6, 3.2 * zScale), V3(-0.3, 1.6, 2.6 * zScale), V3(0, 1.3, -1.2), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 8: Line 8 (38.39 - 42.24) - Night in canyon, drinking urine
  add({
    id: 'shot08_night_despair',
    at: cut(8),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronNight.group.position.set(-0.4, 0, -1.0);
      aronNight.set({
        mood: 'dizzy',
        legs: 'stand',
        lean: -8,
        armL: [45, 95],
        armR: [-60, 80],
        talk: talk(t, lineActive(8, t)),
        blink: blink(t)
      });
      shoot(slotNight.scene, [aronNight], V3(-0.5, 1.6, 3.0 * zScale), V3(0.2, 1.6, 2.8 * zScale), V3(0, 1.3, -1.2), null, p, LOOKS.night);
      blit();
    }
  });

  // Shot 9: Line 9 (42.59 - 47.30) - Carving death date on canyon wall
  add({
    id: 'shot09_carving_wall',
    at: cut(9),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronNight.set({
        mood: 'sad',
        legs: 'stand',
        armL: [30, 50],
        armR: [-60, 80],
        holdL: PROPS.carvingTextProp,
        talk: talk(t, lineActive(9, t)),
        blink: blink(t)
      });
      shoot(slotNight.scene, [aronNight], V3(0.8, 1.5, 2.5 * zScale), V3(0.2, 1.5, 2.4 * zScale), V3(0, 1.3, -1.2), null, p, LOOKS.night);
      blit();
    }
  });

  // Shot 10: Line 10 (47.70 - 49.82) - Fifth morning, something changed
  add({
    id: 'shot10_fifth_morning',
    at: cut(10),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronDawn.group.position.set(-0.4, 0, -1.0);
      aronDawn.set({
        mood: 'shock',
        legs: 'stand',
        armL: [15, 30],
        armR: [-60, 80],
        talk: talk(t, lineActive(10, t)),
        blink: 0
      });
      shoot(slotDawn.scene, [aronDawn], V3(0, 1.3, 2.8 * zScale), V3(0, 1.8, 2.6 * zScale), V3(0, 1.4, -1.2), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 11: Line 11 (50.32 - 54.65) - Vision of the little boy
  add({
    id: 'shot11_dream_vision',
    at: cut(11),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      sonDream.group.position.set(0, 0, lerp(-1.0, 0.8, p));
      sonDream.set({
        mood: 'happy',
        legs: 'run',
        phase: t * 8,
        armL: [30, 40],
        armR: [-30, 40],
        talk: 0,
        blink: blink(t)
      });
      shoot(dreamSet.scene, [sonDream], V3(0, 1.4, 5.0 * zScale), V3(0, 1.4, 3.2 * zScale), V3(0, 0.9, 0), null, p, LOOKS.dream);
      blit();
    }
  });

  // Shot 12: Line 12 (55.00 - 60.40) - Aron decides: NOT going to die here!
  add({
    id: 'shot12_fierce_resolve',
    at: cut(12),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronDawn.set({
        mood: 'angry',
        legs: 'stand',
        lean: 6,
        armL: [40, 70],
        armR: [-65, 80],
        talk: talk(t, lineActive(12, t)),
        blink: 0
      });
      shoot(slotDawn.scene, [aronDawn], V3(0, 1.6, 3.2 * zScale), V3(0, 1.6, 2.3 * zScale), V3(-0.2, 1.5, -1.0), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 13: Line 13 (60.80 - 64.02) - What he did next is almost impossible
  add({
    id: 'shot13_impossible',
    at: cut(13),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronDawn.set({
        mood: 'worried',
        legs: 'stand',
        armL: [25, 45],
        armR: [-60, 80],
        talk: talk(t, lineActive(13, t)),
        blink: blink(t)
      });
      shoot(slotDawn.scene, [aronDawn], V3(0.5, 1.6, 2.8 * zScale), V3(-0.3, 1.6, 2.6 * zScale), V3(-0.2, 1.4, -1.0), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 14: Line 14 (64.52 - 68.72) - Snapped forearm bones against boulder
  add({
    id: 'shot14_break_bones',
    at: cut(14),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      const shake = Math.sin(t * 30) * 0.05;
      aronDawn.set({
        mood: 'angry',
        legs: 'stand',
        lean: -15,
        armL: [60, 90],
        armR: [-80, 100],
        squash: 0.15,
        talk: talk(t, lineActive(14, t)),
        blink: 0
      });
      shoot(slotDawn.scene, [aronDawn], V3(shake, 1.5 + shake, 2.2 * zScale), V3(shake, 1.5 + shake, 2.0 * zScale), V3(0, 1.3, -1.2), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 15: Line 15 (69.02 - 73.82) - Cut through arm with dull pocket knife
  add({
    id: 'shot15_cut_free',
    at: cut(15),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronDawn.set({
        mood: 'shock',
        legs: 'stand',
        lean: -8,
        armL: [45 + Math.sin(t * 10) * 15, 75],
        armR: [-70, 85],
        holdL: PROPS.knifeProp,
        talk: talk(t, lineActive(15, t)),
        blink: 0
      });
      shoot(slotDawn.scene, [aronDawn], V3(0.2, 1.4, 2.4 * zScale), V3(0.2, 1.4, 2.0 * zScale), V3(-0.1, 1.3, -1.1), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 16: Line 16 (74.32 - 75.54) - It took over an hour.
  add({
    id: 'shot16_an_hour',
    at: cut(16),
    draw: (lt, d, t, blit) => {
      aronDawn.set({
        mood: 'tired',
        legs: 'stand',
        armL: [10, 10],
        armR: [-10, 10],
        talk: talk(t, lineActive(16, t)),
        blink: 0
      });
      shoot(slotDawn.scene, [aronDawn], V3(0, 1.7, 3.2 * zScale), V3(0, 1.7, 3.2 * zScale), V3(0, 1.3, -1.0), null, 0, LOOKS.trap);
      blit();
    }
  });

  // Shot 17: Line 17 (76.04 - 81.28) - Rappelled down 65-foot cliff
  add({
    id: 'shot17_rappel',
    at: cut(17),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronDawn.group.position.set(0, lerp(5.0, 1.0, p), 0);
      aronDawn.set({
        mood: 'worried',
        legs: 'sit',
        armL: [75, 40],
        armR: [0, 0],
        talk: talk(t, lineActive(17, t)),
        blink: blink(t)
      });
      shoot(slotDawn.scene, [aronDawn], V3(0, lerp(6.0, 2.0, p), 5.5 * zScale), V3(0, lerp(5.0, 1.5, p), 5.0 * zScale), V3(0, lerp(5.0, 1.5, p), -1.0), null, p, LOOKS.trap);
      blit();
    }
  });

  // Shot 18: Line 18 (81.53 - 84.46) - Walked 8 miles through blazing sun
  add({
    id: 'shot18_desert_walk',
    at: cut(18),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronDesert.group.position.set(lerp(-2.0, 1.5, p), 0, 0);
      aronDesert.set({
        mood: 'tired',
        legs: 'walk',
        phase: t * 3.5,
        lean: 8,
        armL: [15, 20],
        armR: [0, 0],
        talk: talk(t, lineActive(18, t)),
        blink: blink(t)
      });
      desertSet.heli.position.set(0, 20, -100);
      shoot(desertSet.scene, [aronDesert], V3(-3.0, 1.6, 4.5 * zScale), V3(2.0, 1.6, 4.0 * zScale), V3(0, 1.1, 0), null, p, LOOKS.desert);
      blit();
    }
  });

  // Shot 19: Line 19 (84.76 - 89.21) - Rescue helicopter spots him!
  add({
    id: 'shot19_rescue_heli',
    at: cut(19),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      desertSet.heli.position.set(lerp(12, 0, Math.min(1, p * 1.5)), lerp(14, 5.5, p), -10);
      desertSet.heli.update(t);

      aronDesert.group.position.set(0, 0, 0);
      aronDesert.set({
        mood: 'happy',
        legs: 'jump',
        armL: [140, 20],
        armR: [0, 0],
        talk: talk(t, lineActive(19, t)),
        blink: blink(t)
      });
      shoot(desertSet.scene, [aronDesert], V3(0, 2.2, 8.0 * zScale), V3(0, 2.2, 5.0 * zScale), V3(0, 1.5, -4.0), null, p, LOOKS.desert);
      blit();
    }
  });

  // Shot 20: Line 20 (89.56 - 92.88) - Against every odd, Aron survived!
  add({
    id: 'shot20_survived',
    at: cut(20),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronDesert.set({
        mood: 'laugh',
        legs: 'stand',
        armL: [120, 30],
        armR: [0, 0],
        talk: talk(t, lineActive(20, t)),
        blink: blink(t)
      });
      shoot(desertSet.scene, [aronDesert], V3(0, 1.7, 3.8 * zScale), V3(0, 1.7, 2.6 * zScale), V3(0, 1.2, 0), null, p, LOOKS.desert);
      blit();
    }
  });

  // Shot 21: Line 21 (93.38 - 96.80) - Went back to climbing mountains
  add({
    id: 'shot21_back_to_climbing',
    at: cut(21),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronSummit.group.position.set(0, 0, -2.0);
      aronSummit.set({
        mood: 'proud',
        legs: 'walk',
        phase: t * 4,
        armL: [30, 45],
        armR: [0, 0],
        talk: talk(t, lineActive(21, t)),
        blink: blink(t)
      });
      shoot(summitSet.scene, [aronSummit], V3(-1.5, 1.9, 5.0 * zScale), V3(0.8, 1.9, 4.5 * zScale), V3(0, 1.4, -2.0), null, p, LOOKS.summit);
      blit();
    }
  });

  // Shot 22: Line 22 (97.15 - 102.23) - Climbed all 59 tallest peaks with one arm
  add({
    id: 'shot22_59_peaks',
    at: cut(22),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronSummit.set({
        mood: 'laugh',
        legs: 'stand',
        armL: [140, 20],
        armR: [0, 0],
        talk: talk(t, lineActive(22, t)),
        blink: blink(t)
      });
      shoot(summitSet.scene, [aronSummit], V3(0, 1.8, 4.5 * zScale), V3(0, 1.8, 3.0 * zScale), V3(0, 1.3, -2.0), null, p, LOOKS.summit);
      blit();
    }
  });

  // Shot 23: Line 23 (102.63 - 107.06) - The Lesson: what you are made of
  add({
    id: 'shot23_lesson',
    at: cut(23),
    draw: (lt, d, t, blit) => {
      const p = clamp(lt / d);
      aronSummit.set({
        mood: 'happy',
        legs: 'stand',
        armL: [40, 30],
        armR: [0, 0],
        talk: talk(t, lineActive(23, t)),
        blink: blink(t)
      });
      shoot(summitSet.scene, [aronSummit], V3(0, 1.6, 3.2 * zScale), V3(0, 1.6, 2.4 * zScale), V3(0, 1.2, -2.0), null, p, LOOKS.summit);
      blit();
    }
  });

  // Shot 24: Line 24 (107.56 - 110.83) - Outro CTA: follow NEXORA!
  add({
    id: 'shot24_outro',
    at: cut(24),
    draw: (lt, d, t, blit) => {
      aronSummit.set({
        mood: 'laugh',
        legs: 'jump',
        armL: [150, 10],
        armR: [0, 0],
        talk: talk(t, lineActive(24, t)),
        blink: blink(t)
      });
      shoot(summitSet.scene, [aronSummit], V3(0, 1.8, 3.4 * zScale), V3(0, 1.8, 3.4 * zScale), V3(0, 1.3, -2.0), null, 0, LOOKS.summit);
      blit();
    }
  });

  // Sound cues across the emotional journey
  cue(0.5, 'whoosh', { gain: 0.8 });
  cue(L(2) + 1.0, 'slide', { gain: 0.6 });
  cue(L(3) + 1.2, 'thud', { gain: 1.6 });
  cue(L(3) + 1.4, 'slam', { gain: 1.8 });
  cue(L(5) + 0.5, 'pop', { gain: 0.7 });
  cue(L(5) + 1.5, 'tock', { gain: 0.8 });
  cue(L(5) + 2.5, 'tock', { gain: 0.8 });
  cue(L(6) + 0.3, 'thud', { gain: 0.9 });
  cue(L(8) + 0.8, 'gulp', { gain: 0.9 });
  cue(L(9) + 1.2, 'tock', { gain: 0.6 });
  cue(L(10) + 0.4, 'sparkle', { gain: 1.0 });
  cue(L(11) + 0.5, 'sparkle', { gain: 1.2 });
  cue(L(14) + 1.0, 'slam', { gain: 1.6 });
  cue(L(15) + 1.2, 'zip', { gain: 1.4 });
  cue(L(17) + 0.5, 'whoosh', { gain: 1.0 });
  cue(L(19) + 0.8, 'whoosh', { gain: 1.5 });
  cue(L(20) + 0.4, 'boing', { gain: 1.0 });
  cue(L(22) + 0.5, 'sparkle', { gain: 1.3 });
  cue(L(23) + 0.5, 'pop', { gain: 0.8 });

  return { shots: S, cues };
}
