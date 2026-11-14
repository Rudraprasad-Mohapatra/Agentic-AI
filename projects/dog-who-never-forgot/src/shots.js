// THE DOG WHO NEVER FORGOT: Complete Shot List (Tall Tale 3D).
// Emotional Hindi storytelling with English translation subtitles.
// Flawless 9:16 vertical composition, centered rescue framing, real Nexora logo outro.
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
const blink = (t, off = 0) => (((t + off) % 3.2) < 0.12 ? 1 : 0);

// Preload the real Nexora logo
const logoImg = new Image();
logoImg.src = 'assets/logo.jpg';

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

// Hand-held Roti prop (clearly visible Indian flatbread)
const drawRotiInHand = (g, x, y) => {
  g.save();
  g.translate(x, y);
  g.fillStyle = '#E8C782';
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 6;
  g.beginPath();
  g.ellipse(0, -6, 50, 30, 0.15, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = 'rgba(130, 60, 20, 0.55)';
  for (let i = -24; i <= 24; i += 12) {
    g.beginPath();
    g.arc(i, -6 + Math.sin(i * 1.5) * 6, 5.0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
};

// Torch with dynamic warm point light
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
    new THREE.SphereGeometry(0.14, 12, 10),
    new THREE.MeshStandardMaterial({
      color: '#FFAA33',
      emissive: '#FF6600',
      emissiveIntensity: 3.5,
      roughness: 0.2
    })
  );
  flame.position.set(0, len + 0.16, 0);
  flame.scale.set(0.9, 1.6, 0.9);
  g.add(flame);

  const light = new THREE.PointLight('#FFAA44', 4.5, 18);
  light.position.set(0, len + 0.22, 0);
  g.add(light);

  g.update = (t) => {
    light.intensity = 4.0 + Math.sin(t * 19) * 0.8 + Math.cos(t * 31) * 0.5;
    flame.scale.y = 1.5 + Math.sin(t * 23) * 0.3;
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
    day: { bloom: 0.15, aperture: 0.0012, maxblur: 0.008, fov: 36 },
    night: { bloom: 0.30, aperture: 0.0015, maxblur: 0.010, fov: 36 },
    close: { bloom: 0.22, aperture: 0.0016, maxblur: 0.010, fov: 34 }
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
  // SCENE 1: DAYTIME VILLAGE STREET
  // ══════════════════════════════════════════════════════════════════════════
  const ST = WD.mainStreet(E, {
    len: 60,
    shops: [
      ['TEA STALL', '#C9603F', 'brick', '#D8343F'],
      ['GROCERY', '#6FA3B8', 'wood', null],
      ['POTTERY', '#E3C16F', 'wood', '#3C6FB6'],
      ['TEMPLE', '#9E4A3A', 'brick', null]
    ]
  });
  ST.sun.key.position.set(5, 14, 7);
  ST.sun.key.target.position.set(0, 0, 0);

  const manDay = person('poorMan');
  const dogDay = new Dog({}, { height: 0.82 });
  ST.scene.add(manDay.group, dogDay.group);

  // ══════════════════════════════════════════════════════════════════════════
  // SCENE 2: MOONLIT FOREST & ILLUMINATED RAVINE
  // ══════════════════════════════════════════════════════════════════════════
  const NF = new THREE.Scene();
  WD.sky(NF, { top: '#081024', horizon: '#121E38', ground: '#081024' });

  // Strong moon & ambient lighting
  const moonLight = new THREE.DirectionalLight('#A8C6F2', 2.6);
  moonLight.position.set(-12, 24, -2);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048);
  moonLight.shadow.camera.near = 1;
  moonLight.shadow.camera.far = 80;
  moonLight.shadow.camera.left = -30;
  moonLight.shadow.camera.right = 30;
  moonLight.shadow.camera.top = 30;
  moonLight.shadow.camera.bottom = -30;
  NF.add(moonLight);

  const hemiNight = new THREE.HemisphereLight('#4A6696', '#222E42', 1.4);
  NF.add(hemiNight);

  // Ravine ambient fill light so floor & boulders are clearly visible
  const ravineFill = new THREE.PointLight('#6888BC', 3.2, 40);
  ravineFill.position.set(0, -2.0, -8);
  NF.add(ravineFill);

  // Bright moon in the sky
  const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(3.0, 24, 16),
    new THREE.MeshBasicMaterial({ color: '#EEF4FF' })
  );
  moonMesh.position.set(-25, 36, -65);
  NF.add(moonMesh);

  // Expansive forest ground on cliff top (y = 0)
  const cliffTop = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 100),
    WD.mat({ color: '#253835', roughness: 0.85 })
  );
  cliffTop.rotation.x = -Math.PI / 2;
  cliffTop.position.set(0, 0, 10);
  cliffTop.receiveShadow = true;
  NF.add(cliffTop);

  // Ravine Floor (y = -4.5)
  const ravineFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 80),
    WD.mat({ color: '#222C38', roughness: 0.9 })
  );
  ravineFloor.rotation.x = -Math.PI / 2;
  ravineFloor.position.set(0, -4.5, -20);
  ravineFloor.receiveShadow = true;
  NF.add(ravineFloor);

  // Cliff Rock Face (from y = 0 down to y = -4.5)
  const cliffWall = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 5),
    WD.mat({ color: '#2C3645', roughness: 0.85 })
  );
  cliffWall.position.set(0, -2.25, -4.5);
  cliffWall.receiveShadow = true;
  NF.add(cliffWall);

  // Boulders and rocks in the ravine
  for (let r = 0; r < 20; r++) {
    const rx = -20 + r * 2.1 + Math.sin(r * 2.5) * 1.5;
    const rz = -8 + (r % 5) * 2.8;
    const b = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.75 + (r % 3) * 0.4),
      WD.mat({ color: '#3A485C', roughness: 0.85 })
    );
    b.position.set(rx, -4.0, rz);
    b.rotation.set(r * 0.5, r * 1.2, r * 0.3);
    b.castShadow = b.receiveShadow = true;
    NF.add(b);
  }

  // Pine trees on BOTH SIDES of trail
  for (let t = 0; t < 10; t++) {
    const tl = WD.tree(1.3 + (t % 3) * 0.3, '#14221E', 'cypress');
    tl.position.set(-6 - (t % 3) * 2.5, 0, -2 + t * 4.5);
    NF.add(tl);
    const tr = WD.tree(1.3 + (t % 3) * 0.3, '#14221E', 'cypress');
    tr.position.set(6 + (t % 3) * 2.5, 0, -2 + t * 4.5);
    NF.add(tr);
  }

  // Wooden fence posts along trail
  const trailFenceL = WD.fence(30, '#425566');
  trailFenceL.position.set(-4.5, 0, -2);
  trailFenceL.rotation.y = Math.PI / 2;
  const trailFenceR = WD.fence(30, '#425566');
  trailFenceR.position.set(4.5, 0, -2);
  trailFenceR.rotation.y = Math.PI / 2;
  NF.add(trailFenceL, trailFenceR);

  // Village Lantern Pole for Shot 7 (Placed safely on the right)
  const villageLamp = WD.lamp();
  villageLamp.position.set(2.4, 0, -1.8);
  const lampLight = new THREE.PointLight('#FFB844', 5.5, 20);
  lampLight.position.set(2.4, 3.2, -1.8);
  NF.add(villageLamp, lampLight);

  const manNight = person('poorMan');
  const dogNight = new Dog({}, { height: 0.82 });
  const villagerA = person('villager1');
  const villagerB = person('villager2');
  const torchA = makeTorch();
  const torchB = makeTorch();
  torchA.position.set(-1.2, 0, -3.2);
  torchB.position.set(1.2, 0, -3.2);

  // Rescue rope running from top cliff edge into ravine
  const ropePts = [
    new THREE.Vector3(0, 0.2, -4.3),
    new THREE.Vector3(0, -1.8, -4.6),
    new THREE.Vector3(0, -3.8, -6.5)
  ];
  const ropeCurve = new THREE.CatmullRomCurve3(ropePts);
  const ropeMesh = new THREE.Mesh(
    new THREE.TubeGeometry(ropeCurve, 20, 0.05, 6),
    WD.mat({ color: '#D4AA64', roughness: 0.9 })
  );
  ropeMesh.castShadow = true;

  NF.add(
    manNight.group,
    dogNight.group,
    villagerA.group,
    villagerB.group,
    torchA,
    torchB,
    ropeMesh
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 0: THE HOOK - SITTING & HOLDING THE ROTI (0.00s - 4.48s)
  // "Ek gareeb aadmi ke paas, khud khane ke paise nahi the..."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot0_hook',
    at: cut(0),
    note: 'Poor man sitting visibly on pavement holding roti, hungry street dog looking up',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      // Man sitting directly on ground/walkway (NO crate blocking his body!)
      manDay.at(-0.18, 0, -1.6);
      dogDay.at(0.42, 0, -1.4);
      dogDay.group.rotation.y = -Math.PI * 0.75;

      manDay.set({
        mood: 'sad',
        legs: 'sit',
        armL: [25, 35],
        armR: [45, 60],
        holdR: drawRotiInHand,
        blink: blink(t),
        look: [0.4, -0.4]
      });

      dogDay.set({
        pose: 'sit',
        sad: 0.3,
        wag: Math.sin(t * 8) * 0.25,
        look: [-0.5, 0.5]
      });

      // Flawless framing: man and dog centered with ample headroom
      shoot(
        ST.scene,
        [manDay, dogDay],
        V3(0.12, 1.25, 2.0),
        V3(0.12, 1.15, 1.5),
        V3(0.1, 0.65, -1.5),
        null,
        k,
        LOOKS.day
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 1: THE FEEDING - BREAD GIVEN DIRECTLY TO DOG (4.48s - 8.76s)
  // "...phir bhi woh roz ek bhookhe kutte ko apni roti khilata."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot1_share',
    at: cut(1),
    note: 'Clear feeding: Man extends roti to the dog, dog takes it with open mouth, full headroom',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      const reach = clamp(lt / 1.5);
      manDay.at(-0.15, 0, -1.6);
      dogDay.at(0.38, 0, -1.4);

      manDay.set({
        mood: 'happy',
        legs: 'sit',
        armL: [20, 20],
        armR: [lerp(45, 80, eo(reach)), lerp(60, 20, eo(reach))],
        holdR: drawRotiInHand,
        blink: blink(t)
      });

      dogDay.set({
        pose: 'sit',
        happy: 1,
        bark: lt > 0.8 ? 0.4 : 0,
        t,
        wag: Math.sin(t * 18) * 0.7,
        look: [-0.6, 0.3]
      });

      // Camera positioned with complete headroom so man's head is never cut off
      shoot(
        ST.scene,
        [manDay, dogDay],
        V3(0.12, 1.25, 1.8),
        V3(0.15, 1.12, 1.3),
        V3(0.12, 0.62, -1.5),
        null,
        k,
        LOOKS.close
      );
      blit();
    }
  });
  cue(cut(1) + 0.4, 'pop', { gain: 0.6 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 2: THE BOND - DEVOTED COMPANIONS (8.76s - 14.15s)
  // "Dheere-dheere, woh laachar kutta us aadmi ka sabse sachha dost ban gaya."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot2_bond',
    at: cut(2),
    note: 'Side tracking: man walking along village street, loyal dog right beside him',
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      const walkZ = lerp(4, -10, k);

      manDay.at(0.25, 0, walkZ);
      dogDay.at(-0.35, 0, walkZ + 0.25);

      manDay.set({
        mood: 'happy',
        legs: 'walk',
        phase: lt * 7,
        blink: blink(t)
      });

      dogDay.set({
        pose: 'walk',
        phase: lt * 9,
        happy: 1,
        t,
        look: [0.5, 0.3]
      });

      shoot(
        ST.scene,
        [manDay, dogDay],
        V3(-0.05, 1.45, walkZ + 4.4),
        V3(-0.05, 1.35, walkZ + 3.6),
        V3(-0.05, 0.82, walkZ),
        null,
        k,
        LOOKS.day
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 3: FAITHFUL SHADOW (14.15s - 19.74s)
  // "Aadmi jahan bhi jaata... kutta hamesha uske peeche-peeche chalta."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot3_faithful',
    at: cut(3),
    note: 'Wide tracking shot: dog following him like a devoted shadow',
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      const posX = lerp(-3.0, 4.0, k);

      manDay.at(posX + 0.25, 0, 0);
      dogDay.at(posX - 0.45, 0, 0.1);

      manDay.set({
        mood: 'happy',
        legs: 'walk',
        phase: lt * 6.5,
        blink: blink(t, 0.4)
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
        V3(posX - 0.1, 1.45, 4.4),
        V3(posX + 0.1, 1.4, 4.0),
        V3(posX - 0.1, 0.8, 0),
        null,
        k,
        LOOKS.day
      );
      blit();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 4: STORMY NIGHT FOREST - SUDDEN SLIP (19.74s - 26.74s)
  // "Phir ek toofani raat, jungle ke raaste ghar lautte hue... achanak uska pair phisla!"
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot4_forest_slip',
    at: cut(4),
    note: 'Moonlit forest trail: man walking weary, foot suddenly slips near cliff edge',
    draw(lt, d, t, blit) {
      const slipMoment = lt > 4.2;
      const k = clamp(lt / d);
      const posZ = lerp(6, -1.5, k);

      villageLamp.visible = false;
      lampLight.visible = false;
      ropeMesh.visible = false;
      villagerA.group.visible = false;
      villagerB.group.visible = false;
      torchA.visible = false;
      torchB.visible = false;

      manNight.at(0.2, slipMoment ? -0.35 : 0, posZ);
      dogNight.at(-0.55, 0, posZ + 0.8);

      manNight.set({
        mood: slipMoment ? 'shock' : 'worried',
        legs: slipMoment ? 'jump' : 'walk',
        phase: lt * 5.5,
        lean: slipMoment ? 22 : 8,
        armL: slipMoment ? [120, -30] : [20, 30],
        armR: slipMoment ? [140, 50] : [45, 60],
        blink: blink(t)
      });

      dogNight.set({
        pose: slipMoment ? 'stand' : 'walk',
        phase: lt * 7.5,
        sad: slipMoment ? 0.8 : 0.2,
        t
      });

      shoot(
        NF,
        [manNight, dogNight],
        V3(0.0, 1.5, posZ + 4.6),
        V3(0.0, 1.4, posZ + 3.8),
        V3(0.0, 0.78, posZ),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(4), 'whoosh', { gain: 0.4 });
  cue(cut(4) + 4.2, 'slide', { gain: 0.8 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 5: FALL INTO DEEP RAVINE - TRAPPED (26.74s - 33.93s)
  // "Woh ek gehri khaai mein ja gira! Ghayal hokar chillaya, par sunne wala koi nahi tha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot5_ravine_trapped',
    at: cut(5),
    note: 'Man injured among moonlit boulders at bottom of ravine, dog looking down from edge',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));

      // Man sitting against boulders on illuminated ravine floor
      manNight.at(0.2, -4.0, -10.0);
      dogNight.at(0.0, 0, -4.4);

      dogNight.set({
        pose: 'stand',
        sad: 1,
        t,
        look: [0.1, -0.8]
      });

      manNight.set({
        mood: 'sad',
        legs: 'sit',
        armL: [40, 90],
        armR: [30, 20],
        blink: blink(t),
        tears: true,
        talk: Math.sin(t * 7) > 0 ? 0.75 : 0
      });

      // Well-lit camera view showing the rocky ravine floor and walls
      shoot(
        NF,
        [manNight],
        V3(-0.8, -2.5, -6.5),
        V3(-0.4, -2.8, -7.2),
        V3(0.2, -3.6, -10.0),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(5) + 0.3, 'thud', { gain: 0.9 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 6: SPRINTING THROUGH THE MOONLIT FOREST (33.93s - 39.05s)
  // "Lekin woh wafadaar kutta bhaaga, aur raat ke sannate mein gaon pahuncha."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot6_dog_sprint',
    at: cut(6),
    note: 'Dog sprinting at full speed along moonlit trail with fence and trees',
    draw(lt, d, t, blit) {
      const sprintX = lerp(-10, 10, clamp(lt / d));
      dogNight.at(sprintX, 0, 4);
      dogNight.set({
        pose: 'run',
        phase: lt * 26,
        flip: true,
        t
      });

      shoot(
        NF,
        [dogNight],
        V3(sprintX + 1.6, 1.25, 8.5),
        V3(sprintX - 0.3, 1.1, 8.0),
        V3(sprintX, 0.45, 4),
        null,
        clamp(lt / d),
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(6), 'whoosh', { gain: 0.7 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 7: ALERTING THE VILLAGERS UNDER WARM LANTERN (39.05s - 43.80s)
  // "Woh zor-zor se bhonk-kar, gaon walon ko apne peeche kheench laaya!"
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot7_village_alert',
    at: cut(7),
    note: 'Dog barking frantically under bright village lantern, tugging clothes, leading villagers',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      villageLamp.visible = true;
      lampLight.visible = true;
      villagerA.group.visible = true;
      villagerB.group.visible = true;
      torchA.visible = true;
      torchB.visible = true;
      torchA.position.set(-1.1, 0, -1.6);
      torchB.position.set(1.1, 0, -1.6);
      torchA.update(t);
      torchB.update(t);

      villagerA.at(-0.55, 0, -1.7);
      villagerB.at(0.55, 0, -1.7);
      dogNight.at(0.0, 0, -1.1);

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
        V3(0.0, 1.45, 2.2),
        V3(0.0, 1.3, 1.6),
        V3(0.0, 0.72, -1.5),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(7) + 0.1, 'alarm', { gain: 0.7 });
  cue(cut(7) + 0.8, 'pop', { gain: 0.6 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 8: CLIFF RESCUE - CENTERED VERTICAL COMPOSITION (43.80s - 48.52s)
  // "Gaon walon ne rassi daalkar us aadmi ko sahi-salamat bacha liya."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot8_cliff_rescue',
    at: cut(8),
    note: 'Villagers at cliff edge holding torches, hauling rope, man rising safely right in the vertical center',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      villageLamp.visible = false;
      lampLight.visible = false;
      ropeMesh.visible = true;
      torchA.visible = true;
      torchB.visible = true;
      torchA.position.set(-1.1, 0, -3.3);
      torchB.position.set(1.1, 0, -3.3);
      torchA.update(t);
      torchB.update(t);

      // Man rising from -2.8 to -0.3
      const pullY = lerp(-2.8, -0.3, eo(clamp(lt / 3.4)));
      manNight.at(0.0, pullY, -4.2);

      villagerA.at(-0.55, 0, -3.3);
      villagerB.at(0.55, 0, -3.3);
      dogNight.at(-1.0, 0, -3.1);

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

      // Vertically centered camera: looking directly at (0, 0.1, -3.5)
      // Villagers appear in upper center, man appears in middle/lower center, zero top clipping!
      shoot(
        NF,
        [villagerA, villagerB, manNight],
        V3(0.0, 0.6, 1.8),
        V3(0.0, 0.45, 0.8),
        V3(0.0, 0.1, -3.5),
        null,
        k,
        LOOKS.night
      );
      blit();
    }
  });
  cue(cut(8) + 0.3, 'whoosh', { gain: 0.5 });
  cue(cut(8) + 2.5, 'sparkle', { gain: 0.8 });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 9: THE EMOTIONAL REUNION & QUOTE (48.52s - 56.64s)
  // "Aadmi ne kutte ko seene se lagakar rote hue kaha: Maine tujhe roti di thi, tune mujhe meri zindagi lauta di."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot9_emotional_reunion',
    at: cut(9),
    note: 'Safe at cliff top: man sits with dog in his arms, crying tears of gratitude, full headroom',
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      villageLamp.visible = false;
      lampLight.visible = false;
      ropeMesh.visible = false;
      torchA.position.set(-1.8, 0, -2.4);
      torchB.position.set(1.8, 0, -2.4);
      torchA.update(t);
      torchB.update(t);

      // Centered framing: man sitting on grass, dog in lap
      manNight.at(-0.15, 0, -1.6);
      dogNight.at(0.38, 0, -1.5);

      manNight.set({
        mood: 'happy',
        legs: 'sit',
        tears: true,
        armL: [55, 45],
        armR: [60, 40],
        blink: blink(t),
        lean: -4
      });

      dogNight.set({
        pose: 'sit',
        happy: 1,
        wag: Math.sin(t * 14) * 0.45,
        t,
        look: [-0.6, 0.4]
      });

      villagerA.at(-2.2, 0, -2.1);
      villagerB.at(2.2, 0, -2.1);
      villagerA.set({ mood: 'happy', armL: [20, 10], armR: [20, 10] });
      villagerB.set({ mood: 'happy', armL: [20, 10], armR: [20, 10] });

      // Generous headroom, neither man nor dog is clipped!
      shoot(
        NF,
        [manNight, dogNight],
        V3(0.08, 1.35, 2.2),
        V3(0.1, 1.15, 1.2),
        V3(0.1, 0.72, -1.55),
        null,
        k,
        LOOKS.close
      );
      blit();

      // Soft emotional vignette
      ctx.save();
      const vg = ctx.createRadialGradient(540, 960, 320, 540, 960, 920);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(8,6,14,0.65)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, 1080, 1920);
      ctx.restore();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHOT 10: OFFICIAL NEXORA LOGO OUTRO CARD (56.64s - 63.20s)
  // "Insaaniyat aur neki... kabhi bhulayi nahi jaati."
  // ══════════════════════════════════════════════════════════════════════════
  add({
    id: 'shot10_nexora_outro',
    at: cut(10),
    note: 'Official Nexora circular neon logo, animated glow, and follow CTA',
    draw(lt, d, t, blit) {
      // Clear with deep space cinematic gradient
      ctx.save();
      const bg = ctx.createLinearGradient(0, 0, 0, 1920);
      bg.addColorStop(0, '#060812');
      bg.addColorStop(0.5, '#0E1222');
      bg.addColorStop(1, '#050710');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1080, 1920);

      // Ambient bokeh circles
      for (let i = 0; i < 18; i++) {
        const bx = 160 + ((i * 173) % 760);
        const by = 180 + ((i * 257) % 1550) + Math.sin(t * 0.8 + i) * 20;
        const br = 40 + (i % 5) * 30;
        const bgr = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        bgr.addColorStop(0, 'rgba(0, 229, 255, 0.1)');
        bgr.addColorStop(1, 'rgba(213, 0, 249, 0)');
        ctx.fillStyle = bgr;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      const fadeIn = clamp(lt / 0.5);
      ctx.globalAlpha = fadeIn;

      // Draw Official Nexora Circular Logo
      const logoRadius = 230;
      const logoCX = 540;
      const logoCY = 680;

      // Outer neon orbital glow
      const glow = ctx.createRadialGradient(logoCX, logoCY, logoRadius * 0.8, logoCX, logoCY, logoRadius * 1.35);
      glow.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
      glow.addColorStop(0.5, 'rgba(213, 0, 249, 0.25)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(logoCX, logoCY, logoRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Circular clipped logo image
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoCX, logoCY, logoRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, logoCX - logoRadius, logoCY - logoRadius, logoRadius * 2, logoRadius * 2);
        ctx.restore();

        // Neon ring around logo
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#D500F9';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(logoCX, logoCY, logoRadius + 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Channel Follow CTA
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(240, 1020, 600, 92, 46);
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 38px Inter';
      ctx.letterSpacing = '1px';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Follow for more stories ❤️', 540, 1066);

      ctx.restore();
    }
  });
  cue(cut(10) + 0.1, 'sparkle', { gain: 0.9 });

  return { shots: S, cues: CUES };
}
