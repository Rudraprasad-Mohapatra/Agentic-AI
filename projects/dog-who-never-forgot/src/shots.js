// THE DOG WHO NEVER FORGOT: Shot list (Tall Tale 3D style).
// Emotional Hindi storytelling short with English subtitles.
// Camera moves on every cut, expressive cartoon characters and animated 3D dog cut-out.
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon } from './core/toon.js';
import { Dog } from './core/dog.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.4) < 0.12 ? 1 : 0);

// Characters
const LOOK = {
  poorMan: {
    body: '#7A583E',
    pattern: 'overalls',
    patCol: '#533C29',
    hairCol: '#3D302A',
    head: '#F4D8C4',
    neck: 'scarf',
    neckCol: '#C48A54',
    extra: ['mustache']
  },
  villager1: {
    body: '#3A5C70',
    pattern: 'vest',
    patCol: '#253B47',
    hat: 'cap',
    hatCol: '#E0A842',
    neck: 'scarf',
    neckCol: '#E0A842'
  },
  villager2: {
    body: '#8C4836',
    pattern: 'plain',
    hat: 'beanie',
    hatCol: '#2B3842'
  }
};

const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

// Custom Props
function makeRoti(r = 0.22) {
  const g = new THREE.Group();
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const c = cv.getContext('2d');
  c.fillStyle = '#E8C782';
  c.beginPath();
  c.arc(128, 128, 120, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(130, 65, 18, 0.45)';
  for (let i = 0; i < 28; i++) {
    const a = i * 2.39, rad = (i * 17) % 95;
    c.beginPath();
    c.arc(128 + Math.cos(a) * rad, 128 + Math.sin(a) * rad, 3 + (i % 5) * 2, 0, Math.PI * 2);
    c.fill();
  }
  const tex = new THREE.CanvasTexture(cv);
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, 0.02, 24),
    [
      WD.mat({ color: '#D4AA64' }),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })
    ]
  );
  m.castShadow = true;
  g.add(m);
  return g;
}

function makeTorch(len = 1.3) {
  const g = new THREE.Group();
  const staff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.05, len, 8),
    WD.mat({ color: '#3A271B' })
  );
  staff.position.y = len / 2;
  staff.castShadow = true;
  g.add(staff);

  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 10),
    new THREE.MeshStandardMaterial({
      color: '#FFAA33',
      emissive: '#FF6600',
      emissiveIntensity: 2.8,
      roughness: 0.3
    })
  );
  flame.position.set(0, len + 0.16, 0);
  flame.scale.set(0.9, 1.6, 0.9);
  g.add(flame);

  const light = new THREE.PointLight('#FFAA44', 3.5, 12);
  light.position.set(0, len + 0.2, 0);
  g.add(light);

  g.update = (t) => {
    light.intensity = 3.0 + Math.sin(t * 19) * 0.6 + Math.cos(t * 31) * 0.4;
    flame.scale.y = 1.5 + Math.sin(t * 23) * 0.25;
  };
  return g;
}

export function buildShots(E) {
  const S = [];
  const CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.05);

  const cam = camera(36);
  const LOOKS = {
    day: { bloom: 0.18, aperture: 0.0012, maxblur: 0.008 },
    night: { bloom: 0.35, aperture: 0.0015, maxblur: 0.010, fov: 38 },
    close: { bloom: 0.25, aperture: 0.0018, maxblur: 0.012, fov: 32 }
  };

  const shoot = (scene, items, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) {
      cam.fov = look.fov || 36;
      cam.updateProjectionMatrix();
    }
    cam.position.copy(mix(from, to, k));
    cam.lookAt(at2 ? mix(at, at2, k) : at);
    items.forEach((p) => p && p.face && p.face(cam));
    E.render(scene, cam, {
      ...look,
      focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at)
    });
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SCENE 1: DAYTIME VILLAGE STREET (The Bond)
  // ══════════════════════════════════════════════════════════════════════════
  const ST = WD.mainStreet(E, {
    shops: [
      ['TEA STALL', '#C9603F', 'brick', '#D8343F'],
      ['GROCERY', '#6FA3B8', 'wood', null],
      ['POTTERY', '#E3C16F', 'wood', '#3C6FB6'],
      ['TEMPLE VIEW', '#9E4A3A', 'brick', null]
    ]
  });
  ST.sun.key.position.set(6, 14, 8);
  ST.sun.key.target.position.set(0, 0, 0);

  const manDay = person('poorMan');
  const dogDay = new Dog({}, { height: 0.82 });
  const roti = makeRoti(0.2);
  const crateSeat = WD.crate(0.65);
  crateSeat.position.set(-2.8, 0, -2);
  roti.position.set(-2.4, 0.45, -1.6);
  ST.scene.add(manDay.group, dogDay.group, crateSeat, roti);

  // ══════════════════════════════════════════════════════════════════════════
  // SCENE 2: DARK FOREST & RAVINE AT NIGHT (The Accident & The Fall)
  // ══════════════════════════════════════════════════════════════════════════
  const NF = new THREE.Scene();
  WD.sky(NF, { top: '#060A18', horizon: '#0D1526', ground: '#050712' });

  // Moon & cold blue night light
  const moonLight = new THREE.DirectionalLight('#9DB8E8', 2.2);
  moonLight.position.set(-10, 20, -5);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048);
  moonLight.shadow.camera.near = 1;
  moonLight.shadow.camera.far = 70;
  moonLight.shadow.camera.left = -25;
  moonLight.shadow.camera.right = 25;
  moonLight.shadow.camera.top = 25;
  moonLight.shadow.camera.bottom = -25;
  NF.add(moonLight);

  const hemiNight = new THREE.HemisphereLight('#3A4E75', '#141824', 1.0);
  NF.add(hemiNight);

  // Soft ravine fill light so bottom is never pitch black
  const ravineFill = new THREE.PointLight('#4A6290', 2.0, 30);
  ravineFill.position.set(0, -3.5, -8);
  NF.add(ravineFill);

  // Moon in the sky
  const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 24, 16),
    new THREE.MeshBasicMaterial({ color: '#E8EFFF' })
  );
  moonMesh.position.set(-35, 42, -70);
  NF.add(moonMesh);

  // Rocky Cliff / Ravine
  const cliffTop = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 50),
    WD.mat({ color: '#1B2418', map: WD.T.grass('#1B2418', [16, 10]) })
  );
  cliffTop.rotation.x = -Math.PI / 2;
  cliffTop.position.set(0, 0, 15);
  cliffTop.receiveShadow = true;
  NF.add(cliffTop);

  // Ravine Floor (6 metres down)
  const ravineFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 50),
    WD.mat({ color: '#181C26', roughness: 0.95 })
  );
  ravineFloor.rotation.x = -Math.PI / 2;
  ravineFloor.position.set(0, -6, -20);
  ravineFloor.receiveShadow = true;
  NF.add(ravineFloor);

  // Cliff Wall (steep rock face)
  const cliffWall = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 7),
    WD.mat({ color: '#1E232B', roughness: 0.9 })
  );
  cliffWall.position.set(0, -3, -5);
  cliffWall.receiveShadow = true;
  NF.add(cliffWall);

  // Rocks & Boulders at bottom
  for (let r = 0; r < 14; r++) {
    const rx = -18 + r * 2.8 + Math.sin(r * 3) * 1.5;
    const rz = -12 + (r % 4) * 3.5;
    const b = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.7 + (r % 3) * 0.4),
      WD.mat({ color: '#252C38', roughness: 0.9 })
    );
    b.position.set(rx, -5.5, rz);
    b.rotation.set(r * 0.5, r * 1.2, r * 0.3);
    b.castShadow = b.receiveShadow = true;
    NF.add(b);
  }

  // Dark pine/gnarly trees on top of the cliff
  for (let t = 0; t < 12; t++) {
    const tr = WD.tree(1.2 + (t % 3) * 0.3, '#101C14', 'cypress');
    tr.position.set(-22 + t * 4, 0, 5 + (t % 3) * 4);
    NF.add(tr);
  }

  const manNight = person('poorMan');
  const dogNight = new Dog({}, { height: 0.82 });
  const torchNight = makeTorch();
  torchNight.position.set(1.5, 0, 0);
  NF.add(manNight.group, dogNight.group, torchNight);

  // ══════════════════════════════════════════════════════════════════════════
  // SCENE 3: RESCUE & VILLAGERS WITH TORCHES
  // ══════════════════════════════════════════════════════════════════════════
  const villagerA = person('villager1');
  const villagerB = person('villager2');
  const torchA = makeTorch();
  const torchB = makeTorch();
  torchA.position.set(-2.5, 0, -3.8);
  torchB.position.set(2.8, 0, -3.8);
  NF.add(villagerA.group, villagerB.group, torchA, torchB);

  // Rescue rope
  const ropePts = [
    new THREE.Vector3(0, 0.2, -4.8),
    new THREE.Vector3(0, -2.5, -5.2),
    new THREE.Vector3(0, -5.2, -7.5)
  ];
  const ropeCurve = new THREE.CatmullRomCurve3(ropePts);
  const ropeMesh = new THREE.Mesh(
    new THREE.TubeGeometry(ropeCurve, 20, 0.05, 6),
    WD.mat({ color: '#D4AA64', roughness: 0.9 })
  );
  ropeMesh.castShadow = true;
  NF.add(ropeMesh);

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 0: THE HOOK (0:00 - ~3.93s)
  // "Ek gareeb aadmi ke paas khud khane ke paise nahi the..."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot0_hook',
    at: cut(0),
    note: 'Poor man sitting humbly outside with his simple roti, dog looking up',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      manDay.at(-2.8, 0, -1.9);
      dogDay.at(-1.8, 0, -1.6);
      dogDay.group.rotation.y = -Math.PI * 0.7;

      manDay.set({
        mood: 'sad',
        legs: 'sit',
        armL: [25, 45],
        armR: [40, 60],
        blink: blink(t),
        look: [0.3, -0.4]
      });

      dogDay.set({
        pose: 'sit',
        sad: 0.3,
        wag: Math.sin(t * 8) * 0.2,
        look: [-0.4, 0.4]
      });

      shoot(
        ST.scene,
        [manDay, dogDay],
        V3(-2.0, 1.4, 1.5),
        V3(-2.2, 1.25, 0.8),
        V3(-2.3, 0.6, -1.8),
        null,
        k,
        LOOKS.day
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 1: SHARING THE ROTI (3.93s - ~8.22s)
  // "...phir bhi woh roz ek bhookhe kutte ko apni roti khilata tha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot1_share',
    at: cut(1),
    note: 'Man gently shares half his bread, dog wags tail happily',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      const reach = clamp(lt / 1.5);
      manDay.at(-2.8, 0, -1.9);
      dogDay.at(-1.6, 0, -1.6);
      roti.position.set(lerp(-2.4, -1.95, eo(reach)), 0.45, -1.6);

      manDay.set({
        mood: 'happy',
        legs: 'sit',
        armL: [20, 20],
        armR: [lerp(30, 65, eo(reach)), lerp(30, 15, eo(reach))],
        blink: blink(t)
      });

      dogDay.set({
        pose: 'sit',
        happy: 1,
        t,
        wag: Math.sin(t * 18) * 0.6,
        look: [-0.6, 0.2]
      });

      shoot(
        ST.scene,
        [manDay, dogDay],
        V3(-1.4, 1.15, 0.5),
        V3(-1.7, 0.95, -0.2),
        V3(-2.1, 0.5, -1.7),
        null,
        k,
        LOOKS.close
      );
      blit();
    }
  });
  cue(cut(1) + 0.4, 'pop', { gain: 0.6 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 2: THE BOND (8.22s - ~12.87s)
  // "Dheere-dheere, woh kutta us aadmi ka sabse sachha dost ban gaya."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot2_bond',
    at: cut(2),
    note: 'Man walks down the village street, dog trotting right beside him',
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      const walkZ = lerp(3, -11, k);

      manDay.at(0.25, 0, walkZ);
      dogDay.at(-0.45, 0, walkZ + 0.3);

      manDay.set({
        mood: 'happy',
        legs: 'walk',
        phase: lt * 7,
        blink: blink(t)
      });

      dogDay.set({
        pose: 'walk',
        phase: lt * 9,
        happy: 0.9,
        t,
        look: [0.5, 0.3]
      });

      shoot(
        ST.scene,
        [manDay, dogDay],
        V3(-0.1, 1.45, walkZ + 3.8),
        V3(-0.1, 1.35, walkZ + 3.0),
        V3(-0.05, 0.85, walkZ),
        null,
        k,
        LOOKS.day
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 3: ALWAYS TOGETHER (12.87s - ~17.09s)
  // "Aadmi jahan bhi jaata, kutta uske peeche-peeche jaata tha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot3_faithful',
    at: cut(3),
    note: 'Side tracking profile: loyal dog keeping pace like a faithful shadow',
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      const posX = lerp(-3.5, 5.5, k);

      manDay.at(posX + 0.3, 0, 0);
      dogDay.at(posX - 0.7, 0, 0.1);

      manDay.set({
        mood: 'happy',
        legs: 'walk',
        phase: lt * 6.5,
        blink: blink(t, 0.5)
      });

      dogDay.set({
        pose: 'walk',
        phase: lt * 9.5,
        happy: 1,
        t
      });

      shoot(
        ST.scene,
        [manDay, dogDay],
        V3(posX - 0.2, 1.35, 4.2),
        V3(posX + 0.2, 1.3, 3.8),
        V3(posX - 0.2, 0.8, 0),
        null,
        k,
        LOOKS.day
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 4: NIGHT IN THE FOREST (17.09s - ~21.87s)
  // "Lekin ek andheri raat, aadmi jungle ke raaste ghar laut raha tha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot4_forest_night',
    at: cut(4),
    note: 'Cold dark stormy forest path at night, man walking weary, dog alert',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      const posZ = lerp(8, 0, k);

      manNight.at(0.3, 0, posZ);
      dogNight.at(-0.8, 0, posZ + 0.9);
      torchNight.visible = false;
      ropeMesh.visible = false;
      villagerA.group.visible = false;
      villagerB.group.visible = false;
      torchA.visible = false;
      torchB.visible = false;

      manNight.set({
        mood: 'worried',
        legs: 'walk',
        phase: lt * 5,
        lean: 8,
        armL: [15, 30],
        armR: [45, 70],
        blink: blink(t)
      });

      dogNight.set({
        pose: 'walk',
        phase: lt * 7,
        sad: 0.2,
        t
      });

      shoot(
        NF,
        [manNight, dogNight],
        V3(1.2, 1.6, posZ + 5.0),
        V3(0.8, 1.45, posZ + 3.8),
        V3(0.0, 0.9, posZ),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(4), 'whoosh', { gain: 0.4 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 5: THE ACCIDENT - SLIPPING INTO THE RAVINE (21.87s - ~26.25s)
  // "Achanak uska pair phisla, aur woh ek gehri khaai mein gir gaya!"
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot5_slip_fall',
    at: cut(5),
    note: 'Dramatic camera: foot slips at cliff edge, man tumbles down into the abyss',
    draw(lt, d, t, blit) {
      const slipT = clamp(lt / 2.0);
      const fallY = lt < 0.5 ? 0 : -eo((lt - 0.5) / 1.5) * 4.8;
      const fallZ = lt < 0.5 ? -3.8 : lerp(-3.8, -7.5, eo((lt - 0.5) / 1.5));
      const tumble = lt < 0.5 ? 0 : (lt - 0.5) * 3.8;

      manNight.at(0, fallY, fallZ);
      manNight.mesh.rotation.z = tumble;

      dogNight.at(-1.0, 0, -4.0);
      dogNight.set({
        pose: 'stand',
        sad: 1,
        t,
        look: [0.3, -0.6]
      });

      manNight.set({
        mood: 'shock',
        legs: 'jump',
        armL: [130, -30],
        armR: [140, 50]
      });

      shoot(
        NF,
        [dogNight, manNight],
        V3(2.5, 1.2, -1.5),
        V3(1.8, 0.2, -3.8),
        V3(0.0, fallY + 0.5, fallZ),
        null,
        slipT,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(5) + 0.1, 'slide', { gain: 0.8 });
  cue(cut(5) + 0.65, 'whoosh', { gain: 1.0 });
  cue(cut(5) + 1.8, 'thud', { gain: 0.9 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 6: TRAPPED AT THE BOTTOM (26.25s - ~31.84s)
  // "Woh dard se chillaya, lekin jungle mein uski awaaz sunne wala koi nahi tha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot6_trapped',
    at: cut(6),
    note: 'Man injured among rocks at bottom of ravine, dog looking down from edge',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      manNight.mesh.rotation.z = 0;
      manNight.at(0.5, -5.5, -10);

      dogNight.at(0.2, 0, -4.8);
      dogNight.set({
        pose: 'stand',
        sad: 1,
        t,
        look: [0.1, -0.8]
      });

      manNight.set({
        mood: 'sad',
        legs: 'sit',
        armL: [45, 90],
        armR: [30, 20],
        blink: blink(t),
        talk: Math.sin(t * 6) > 0 ? 0.7 : 0
      });

      shoot(
        NF,
        [manNight],
        V3(-1.5, -4.2, -6.5),
        V3(-1.0, -4.5, -7.5),
        V3(0.5, -4.8, -10),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 7: THE DOG TURNS TO HELP (31.84s - ~35.71s)
  // "Lekin uska wafadaar kutta himmat haarne wala nahi tha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot7_dog_decision',
    at: cut(7),
    note: 'Close-up on loyal dog at the cliff edge, turning with determination',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      const turn = lt > 1.2;

      dogNight.at(0, 0, -4.5);
      dogNight.set({
        pose: turn ? 'stand' : 'stand',
        flip: turn,
        sad: 0.2,
        t,
        tailAngle: turn ? -0.1 : -0.7
      });

      shoot(
        NF,
        [dogNight],
        V3(0.0, 0.8, -2.5),
        V3(0.3, 0.75, -2.8),
        V3(0.0, 0.45, -4.5),
        null,
        k,
        LOOKS.close
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 8: SPRINTING TO THE VILLAGE (35.71s - ~39.31s)
  // "Kutta poori taaqat se bhaagkar paas ke gaon pahucha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot8_dog_sprint',
    at: cut(8),
    note: 'Dynamic tracking shot: dog sprinting at full speed through moonlit path',
    draw(lt, d, t, blit) {
      const sprintX = lerp(-14, 12, clamp(lt / d));
      dogNight.at(sprintX, 0, 8);
      dogNight.set({
        pose: 'run',
        phase: lt * 26,
        flip: true,
        t
      });

      shoot(
        NF,
        [dogNight],
        V3(sprintX + 2.0, 1.1, 12.0),
        V3(sprintX - 0.5, 0.95, 11.5),
        V3(sprintX, 0.4, 8),
        null,
        clamp(lt / d),
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(8), 'whoosh', { gain: 0.6 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 9: ALERTING THE VILLAGERS (39.31s - ~44.55s)
  // "Woh zor-zor se bhonkne laga, aur logon ko kheenchkar jungle ki taraf le gaya."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot9_village_alert',
    at: cut(9),
    note: 'Dog barking frantically in village square, tugging clothes, leading villagers',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      villagerA.group.visible = true;
      villagerB.group.visible = true;
      torchA.visible = true;
      torchB.visible = true;
      torchA.position.set(-1.0, 0, -1.6);
      torchB.position.set(1.0, 0, -1.6);
      torchA.update(t);
      torchB.update(t);

      villagerA.at(-0.9, 0, -1.8);
      villagerB.at(0.9, 0, -1.8);
      dogNight.at(0.0, 0, -1.2);

      const barkCycle = Math.sin(t * 16) > 0;
      dogNight.set({
        pose: 'bark',
        bark: 1,
        t,
        headTilt: barkCycle ? -0.4 : -0.2
      });

      villagerA.set({
        mood: 'shock',
        armL: [60, -30],
        armR: [30, 80],
        blink: blink(t)
      });

      villagerB.set({
        mood: 'worried',
        armL: [40, 60],
        armR: [70, -20],
        blink: blink(t, 0.3)
      });

      shoot(
        NF,
        [dogNight, villagerA, villagerB],
        V3(0.0, 1.4, 2.0),
        V3(0.0, 1.25, 1.2),
        V3(0.0, 0.7, -1.5),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(9) + 0.1, 'alarm', { gain: 0.7 });
  cue(cut(9) + 0.8, 'pop', { gain: 0.6 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 10: THE RESCUE AT THE CLIFF (44.55s - ~49.17s)
  // "Gaon walon ne rassi daalkar us aadmi ko sahi salamat bacha liya."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot10_cliff_rescue',
    at: cut(10),
    note: 'Villagers at cliff edge holding torches and hauling the rope up',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      ropeMesh.visible = true;
      torchA.visible = true;
      torchB.visible = true;
      torchA.position.set(-1.4, 0, -3.2);
      torchB.position.set(1.4, 0, -3.2);
      torchA.update(t);
      torchB.update(t);

      const pullY = lerp(-3.8, -0.4, eo(clamp(lt / 3.0)));
      manNight.at(0.0, pullY, -4.6);

      villagerA.at(-1.0, 0, -3.4);
      villagerB.at(1.0, 0, -3.4);
      dogNight.at(-1.8, 0, -3.2);

      villagerA.set({
        mood: 'proud',
        armL: [80, 20],
        armR: [75, 30]
      });

      villagerB.set({
        mood: 'proud',
        armL: [75, 30],
        armR: [80, 20]
      });

      manNight.set({
        mood: 'happy',
        legs: 'jump',
        armL: [140, 40],
        armR: [140, 40]
      });

      dogNight.set({
        pose: 'stand',
        happy: 1,
        wag: Math.sin(t * 18) * 0.5,
        t
      });

      shoot(
        NF,
        [villagerA, villagerB, manNight],
        V3(0.0, 1.8, 1.8),
        V3(0.0, 1.3, 0.2),
        V3(0.0, -0.6, -4.0),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(10) + 0.3, 'whoosh', { gain: 0.5 });
  cue(cut(10) + 2.5, 'sparkle', { gain: 0.8 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 11: TEARS OF JOY (49.17s - ~53.22s)
  // "Aadmi ne rote hue kutte ko seene se laga liya aur kaha..."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot11_emotional_hug',
    at: cut(11),
    note: 'Safe on top of cliff, man sits and embraces dog with tears of joy',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      ropeMesh.visible = false;
      torchA.position.set(-2.0, 0, -2.5);
      torchB.position.set(2.0, 0, -2.5);
      torchA.update(t);
      torchB.update(t);

      manNight.at(-0.3, 0, -1.5);
      dogNight.at(0.4, 0, -1.4);

      manNight.set({
        mood: 'happy',
        legs: 'sit',
        tears: true,
        armL: [50, 40],
        armR: [55, 35],
        lean: -6
      });

      dogNight.set({
        pose: 'sit',
        happy: 1,
        wag: Math.sin(t * 14) * 0.4,
        t,
        look: [-0.6, 0.4]
      });

      villagerA.at(-2.5, 0, -2.0);
      villagerB.at(2.5, 0, -2.0);
      villagerA.set({ mood: 'happy', armL: [20, 10], armR: [20, 10] });
      villagerB.set({ mood: 'happy', armL: [20, 10], armR: [20, 10] });

      shoot(
        NF,
        [manNight, dogNight],
        V3(0.0, 1.35, 1.8),
        V3(0.0, 1.1, 0.9),
        V3(0.05, 0.55, -1.5),
        null,
        k,
        LOOKS.close
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 12: THE QUOTE (53.22s - ~58.55s)
  // "'Maine tujhe ek roti di thi, aur tune mujhe meri zindagi lauta di.'"
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot12_the_quote',
    at: cut(12),
    note: 'Deep cinematic close-up: "I gave you bread, you gave me my life"',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      manNight.at(-0.25, 0, -1.5);
      dogNight.at(0.35, 0, -1.4);

      manNight.set({
        mood: 'happy',
        legs: 'sit',
        tears: true,
        armL: [55, 45],
        armR: [60, 40],
        blink: blink(t)
      });

      dogNight.set({
        pose: 'sit',
        happy: 1,
        wag: Math.sin(t * 12) * 0.3,
        t
      });

      shoot(
        NF,
        [manNight, dogNight],
        V3(0.0, 1.05, 0.6),
        V3(0.05, 0.95, 0.1),
        V3(0.05, 0.52, -1.45),
        null,
        k,
        LOOKS.close
      );
      blit();

      // Soft vignette on emotional quote
      ctx.save();
      const vg = ctx.createRadialGradient(540, 960, 300, 540, 960, 900);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(10,8,16,0.65)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, 1080, 1920);
      ctx.restore();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 13: BRAND OUTRO - NEXORA (58.55s - 64.39s)
  // "NEXORA. Neki kabhi bhulayi nahi jaati."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot13_nexora_outro',
    at: cut(13),
    note: 'Nexora outro card: Kindness is never forgotten, follow CTA',
    draw(lt, d, t, blit) {
      // Clear with elegant dark cinematic gradient
      ctx.save();
      const bg = ctx.createLinearGradient(0, 0, 0, 1920);
      bg.addColorStop(0, '#0A0C16');
      bg.addColorStop(0.5, '#121829');
      bg.addColorStop(1, '#080A12');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1080, 1920);

      // Ambient bokeh circles
      for (let i = 0; i < 18; i++) {
        const bx = 180 + ((i * 163) % 720);
        const by = 200 + ((i * 247) % 1500) + Math.sin(t * 0.8 + i) * 20;
        const br = 40 + (i % 5) * 30;
        const bgr = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        bgr.addColorStop(0, 'rgba(230, 180, 100, 0.12)');
        bgr.addColorStop(1, 'rgba(230, 180, 100, 0)');
        ctx.fillStyle = bgr;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      const fadeIn = clamp(lt / 0.6);
      ctx.globalAlpha = fadeIn;

      // Brand Title
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Golden Brand Accent bar
      ctx.fillStyle = '#E8B868';
      ctx.fillRect(490, 520, 100, 4);

      // NEXORA Logo
      ctx.font = '900 108px Inter';
      ctx.letterSpacing = '12px';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('NEXORA', 540, 610);

      // Core Message
      ctx.font = '800 46px Inter';
      ctx.letterSpacing = '2px';
      ctx.fillStyle = '#E8C58C';
      ctx.fillText('Kindness is never forgotten.', 540, 720);

      // Animated Heart Pulse
      const heartPulse = 1.0 + Math.sin(t * 5.5) * 0.12;
      ctx.save();
      ctx.translate(540, 850);
      ctx.scale(heartPulse, heartPulse);
      ctx.font = '900 76px Inter';
      ctx.fillStyle = '#E83E58';
      ctx.fillText('❤️', 0, 0);
      ctx.restore();

      // CTA Box
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(240, 960, 600, 92, 46);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();

      ctx.font = '800 36px Inter';
      ctx.letterSpacing = '1px';
      ctx.fillStyle = '#F4EDE0';
      ctx.fillText('Follow for more stories', 540, 1006);

      ctx.restore();
    }
  });
  cue(cut(13) + 0.1, 'sparkle', { gain: 0.9 });

  return { shots: S, cues: CUES };
}
