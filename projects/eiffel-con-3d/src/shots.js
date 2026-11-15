// HE SOLD THE EIFFEL TOWER... TWICE! - Tall Tale 3D (Night Noir Edition)
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob, rnd } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

// Extend PROPS with custom Eiffel heist props
Object.assign(PROPS, {
  suitcase: (g, x, y) => {
    g.save(); g.translate(x, y - 40); g.rotate(-0.1);
    g.fillStyle = '#3A2012'; g.strokeStyle = INK; g.lineWidth = 6;
    g.beginPath(); g.roundRect(-70, -50, 140, 100, 12); g.fill(); g.stroke();
    g.fillStyle = '#C9A13B';
    [[-58, -38], [58, -38], [-58, 38], [58, 38]].forEach(([cx, cy]) => {
      g.beginPath(); g.arc(cx, cy, 8, 0, 7); g.fill();
    });
    g.strokeStyle = '#221208'; g.lineWidth = 8;
    g.beginPath(); g.arc(0, -62, 24, Math.PI, 0); g.stroke();
    g.fillStyle = '#C9A13B'; g.fillRect(-12, -8, 24, 16);
    // Banknote stacks peeking out
    g.fillStyle = '#8FD08A'; g.fillRect(-45, -54, 30, 12); g.fillRect(15, -55, 35, 12);
    g.restore();
  },
  blueprint: (g, x, y) => {
    g.save(); g.translate(x, y - 60); g.rotate(0.18);
    g.fillStyle = '#1A4580'; g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.roundRect(-60, -80, 120, 160, 8); g.fill(); g.stroke();
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3;
    g.beginPath();
    g.moveTo(0, -65); g.lineTo(-42, 65);
    g.moveTo(0, -65); g.lineTo(42, 65);
    g.moveTo(-22, -10); g.lineTo(22, -10);
    g.moveTo(-34, 35); g.lineTo(34, 35);
    g.arc(0, 65, 24, Math.PI, 0);
    g.stroke();
    g.restore();
  },
  contract: (g, x, y) => {
    g.save(); g.translate(x, y - 60); g.rotate(-0.06);
    g.fillStyle = '#F2EAD8'; g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.roundRect(-60, -85, 120, 170, 6); g.fill(); g.stroke();
    g.fillStyle = '#21408F'; g.fillRect(-50, -75, 33, 14);
    g.fillStyle = '#FFFFFF'; g.fillRect(-17, -75, 34, 14);
    g.fillStyle = '#B5372E'; g.fillRect(17, -75, 33, 14);
    g.fillStyle = '#9C2424'; g.beginPath(); g.arc(32, 52, 18, 0, 7); g.fill();
    g.fillStyle = '#C9A13B'; g.beginPath(); g.arc(32, 52, 10, 0, 7); g.fill();
    g.fillStyle = '#5A544C';
    for (let i = 0; i < 5; i++) g.fillRect(-48, -45 + i * 16, 96, 5);
    g.restore();
  },
  goldCoin: (g, x, y) => {
    g.save(); g.translate(x, y - 40);
    g.fillStyle = '#F2C230'; g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.arc(0, 0, 32, 0, 7); g.fill(); g.stroke();
    g.strokeStyle = '#C99A2E'; g.lineWidth = 3;
    g.beginPath(); g.arc(0, 0, 24, 0, 7); g.stroke();
    g.fillStyle = '#8B6A1A'; g.font = '900 28px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('₣', 0, 2);
    g.restore();
  },
  figaroNews: (g, x, y) => {
    g.save(); g.translate(x, y - 65); g.rotate(-0.06);
    g.fillStyle = '#E8E2D2'; g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.rect(-75, -95, 150, 190); g.fill(); g.stroke();
    g.fillStyle = INK; g.font = '900 22px Georgia, serif'; g.textAlign = 'center';
    g.fillText('LE FIGARO', 0, -68);
    g.fillStyle = '#B5372E'; g.fillRect(-65, -55, 130, 4);
    g.fillStyle = '#221812'; g.font = '900 15px Inter';
    g.fillText('TEAR DOWN TOWER?', 0, -36);
    g.fillStyle = '#6E665A';
    for (let i = 0; i < 5; i++) g.fillRect(-62, -15 + i * 16, 124, 6);
    g.restore();
  }
});

// The Cast
const LOOK = {
  lustig: { body: '#1F2432', pattern: 'vest', patCol: '#141822', hat: 'bowler', hatCol: '#181C26', band: '#8C2B2B', neck: 'bowtie', neckCol: '#D4AF37', extra: ['mustache'], head: '#F7EDE2' },
  poisson: { body: '#4A3626', pattern: 'plain', hat: 'bowler', hatCol: '#2E2218', band: '#2E4E8A', neck: 'tie', neckCol: '#8B1E22', extra: ['glasses', 'mustache'], head: '#F9F1E8' },
  dealer2: { body: '#26342B', pattern: 'vest', patCol: '#18241D', hat: 'tophat', hatCol: '#141C16', band: '#9C3A2E', neck: 'bowtie', neckCol: '#B5372E', extra: ['monocle'] },
  dealer3: { body: '#342840', pattern: 'vest', patCol: '#221A2C', hat: 'tophat', hatCol: '#1B1424', neck: 'tie', neckCol: '#3E5FA8', extra: ['mustache'] },
  victim2: { body: '#4A3424', pattern: 'plain', hat: 'boater', hatCol: '#D8B76A', band: '#2E4E8A', neck: 'tie', neckCol: '#2E8A5A', extra: ['glasses'] },
  gendarme: { body: '#152C54', pattern: 'plain', hat: 'mailcap', hatCol: '#0F1E3A', neck: 'collar', extra: ['mustache'] }
};

const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

// Procedural 3D Eiffel Tower Model
function makeEiffelTower({ scale = 1, rust = false, lit = true } = {}) {
  const g = new THREE.Group();
  
  // Eiffel Tower Architectural Colors
  // At night: illuminated warm golden bronze lattice ironwork
  const ironCol = rust ? '#7D4A2A' : '#C28E46'; // warm architectural bronze-gold
  const ironMat = new THREE.MeshStandardMaterial({
    color: ironCol,
    roughness: 0.55,
    metalness: 0.35,
    emissive: lit ? (rust ? '#2E1508' : '#3D2408') : '#000000',
    emissiveIntensity: lit ? 0.35 : 0
  });
  const darkIronMat = new THREE.MeshStandardMaterial({
    color: '#281D14',
    roughness: 0.7,
    metalness: 0.2
  });
  const rustMat = new THREE.MeshStandardMaterial({
    color: '#8A3C1B',
    roughness: 0.9,
    metalness: 0.1,
    emissive: '#200A04',
    emissiveIntensity: 0.2
  });
  const mainMat = rust ? rustMat : ironMat;

  const baseW = 10 * scale;
  const h1 = 7.5 * scale;
  const h2 = 7.0 * scale; // platform 2 at h1 + h2 = 14.5 * scale
  const h3 = 13.5 * scale; // spire top at 28.0 * scale

  // 1. Four Massive Pedestal Bases at corners
  const cornerDist = baseW * 0.44;
  const pylonAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  
  // Masonry pedestals on the ground
  pylonAngles.forEach((ang) => {
    const px = Math.cos(ang) * cornerDist;
    const pz = Math.sin(ang) * cornerDist;
    const ped = new THREE.Mesh(new THREE.BoxGeometry(1.6 * scale, 0.6 * scale, 1.6 * scale), darkIronMat);
    ped.position.set(px, 0.3 * scale, pz);
    ped.rotation.y = -ang;
    g.add(ped);
  });

  // 2. Four Lower Sloping Pylons (Ground to Platform 1)
  const plat1W = baseW * 0.55;
  const plat1Corner = plat1W * 0.44;
  pylonAngles.forEach((ang) => {
    const bX = Math.cos(ang) * cornerDist;
    const bZ = Math.sin(ang) * cornerDist;
    const tX = Math.cos(ang) * plat1Corner;
    const tZ = Math.sin(ang) * plat1Corner;
    const dir = new THREE.Vector3(tX - bX, h1, tZ - bZ);
    const len = dir.length();
    const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * scale, 0.85 * scale, len, 6), mainMat);
    pylon.position.set((bX + tX) / 2, h1 / 2, (bZ + tZ) / 2);
    pylon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    pylon.castShadow = true;
    g.add(pylon);

    // Diagonal lattice strut on each leg
    const midX = (bX + tX) * 0.5;
    const midZ = (bZ + tZ) * 0.5;
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.25 * scale, 0.25 * scale, len * 0.8), mainMat);
    brace.position.set(midX, h1 * 0.5, midZ);
    brace.rotation.y = ang;
    g.add(brace);
  });

  // 3. Four Iconic Monumental Semicircular Base Arches
  for (let s = 0; s < 4; s++) {
    const a = (s * Math.PI) / 2;
    const archRadius = baseW * 0.32;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(archRadius, 0.22 * scale, 8, 24, Math.PI), mainMat);
    arch.rotation.y = a;
    arch.position.set(0, 0, 0);
    g.add(arch);

    // Arch frieze spandrels (lattice fill above arch)
    const spandrel = new THREE.Mesh(new THREE.BoxGeometry(archRadius * 1.5, 0.18 * scale, 0.2 * scale), mainMat);
    spandrel.rotation.y = a;
    spandrel.position.set(0, archRadius + 0.3 * scale, 0);
    g.add(spandrel);
  }

  // 4. Platform 1 (First Observation Deck)
  const plat1 = new THREE.Mesh(new THREE.BoxGeometry(plat1W, 0.6 * scale, plat1W), mainMat);
  plat1.position.set(0, h1, 0);
  g.add(plat1);

  // Platform 1 illuminated railing & gallery
  const rail1 = new THREE.Mesh(
    new THREE.BoxGeometry(plat1W * 0.98, 0.3 * scale, plat1W * 0.98),
    lit ? new THREE.MeshStandardMaterial({ color: '#FFE082', roughness: 0.3, emissive: '#FFB830', emissiveIntensity: 0.6 }) : mainMat
  );
  rail1.position.set(0, h1 + 0.4 * scale, 0);
  g.add(rail1);

  // 5. Tier 2 Pylons (Platform 1 to Platform 2)
  const plat2W = baseW * 0.32;
  const plat2Corner = plat2W * 0.44;
  pylonAngles.forEach((ang) => {
    const bX = Math.cos(ang) * plat1Corner;
    const bZ = Math.sin(ang) * plat1Corner;
    const tX = Math.cos(ang) * plat2Corner;
    const tZ = Math.sin(ang) * plat2Corner;
    const dir = new THREE.Vector3(tX - bX, h2, tZ - bZ);
    const len = dir.length();
    const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * scale, 0.5 * scale, len, 6), mainMat);
    pylon.position.set((bX + tX) / 2, h1 + h2 / 2, (bZ + tZ) / 2);
    pylon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    pylon.castShadow = true;
    g.add(pylon);
  });

  // Cross-bracing (X lattice) on Tier 2
  for (let s = 0; s < 4; s++) {
    const a = (s * Math.PI) / 2;
    const midY = h1 + h2 / 2;
    const crossSpan = (plat1W + plat2W) * 0.38;
    const crossLen = Math.sqrt(crossSpan * crossSpan + h2 * h2);
    const x1 = new THREE.Mesh(new THREE.BoxGeometry(0.12 * scale, crossLen, 0.12 * scale), mainMat);
    x1.rotation.y = a;
    x1.rotation.z = 0.28;
    x1.position.set(0, midY, (plat1W + plat2W) * 0.22);
    g.add(x1);
  }

  // 6. Platform 2 (Second Observation Deck)
  const plat2 = new THREE.Mesh(new THREE.BoxGeometry(plat2W, 0.5 * scale, plat2W), mainMat);
  plat2.position.set(0, h1 + h2, 0);
  g.add(plat2);

  // 7. Spire (Platform 2 to Dome Summit)
  const spireH = h3;
  const spireBase = plat2W * 0.7;
  const spireTop = 0.3 * scale;
  const spire = new THREE.Mesh(
    new THREE.CylinderGeometry(spireTop, spireBase * 0.5, spireH, 8),
    mainMat
  );
  spire.position.set(0, h1 + h2 + spireH / 2, 0);
  spire.castShadow = true;
  g.add(spire);

  // Spire intermediate ring
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(spireBase * 0.35, spireBase * 0.35, 0.3 * scale, 8), mainMat);
  ring.position.set(0, h1 + h2 + spireH * 0.55, 0);
  g.add(ring);

  // 8. Lantern Dome & Glowing Golden Beacon Summit
  const summitY = h1 + h2 + spireH;
  const domeMat = lit
    ? new THREE.MeshStandardMaterial({ color: '#FFF2A8', roughness: 0.2, emissive: '#FFAA20', emissiveIntensity: 0.9 })
    : darkIronMat;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.55 * scale, 12, 10), domeMat);
  dome.position.set(0, summitY, 0);
  g.add(dome);

  // Tall Needle Spire / Lightning Rod
  const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.08 * scale, 3.0 * scale, 6), darkIronMat);
  needle.position.set(0, summitY + 1.5 * scale, 0);
  g.add(needle);

  // Glowing beacon light & spotlight
  if (lit) {
    const beacon = new THREE.PointLight('#FFAA20', 3.5, 35 * scale);
    beacon.position.set(0, summitY, 0);
    g.add(beacon);

    // Glowing golden beacon crown
    const glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.0 * scale, 12, 8),
      new THREE.MeshBasicMaterial({ color: '#FFE57F', transparent: true, opacity: 0.45 })
    );
    glowSphere.position.set(0, summitY, 0);
    g.add(glowSphere);
  }

  // Rust patches for closeup shots
  if (rust) {
    for (let i = 0; i < 16; i++) {
      const rp = new THREE.Mesh(new THREE.BoxGeometry(0.6 * scale, 1.2 * scale, 0.15 * scale), rustMat);
      rp.position.set((rnd(i) - 0.5) * baseW * 0.5, 1.0 + rnd(i * 3) * (h1 + h2), (rnd(i * 5) - 0.5) * baseW * 0.5);
      g.add(rp);
    }
  }

  return g;
}

export function buildShots(E, { is16x9 = false, W: vw = 1080, H: vh = 1920 } = {}) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(is16x9 ? 34 : 38);
  cam.aspect = vw / vh;
  cam.updateProjectionMatrix();

  const LOOKS = {
    street: { bloom: 0.28, aperture: 0, maxblur: 0, vignette: 0.28, sat: 1.15 },
    showcase: { bloom: 0.42, aperture: 0, maxblur: 0, vignette: 0.22, sat: 1.2 },
    room: { bloom: 0.35, aperture: 0, maxblur: 0, vignette: 0.3, sat: 1.18 },
    field: { bloom: 0.24, aperture: 0, maxblur: 0, vignette: 0.26, sat: 1.12 }
  };

  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    const fov = (look.fov || (is16x9 ? 34 : 38));
    if (cam.fov !== fov || cam.aspect !== vw / vh) {
      cam.fov = fov; cam.aspect = vw / vh; cam.updateProjectionMatrix();
    }
    cam.position.copy(mix(from, to, k));
    cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };

  // ── SET 1: RUE DE PARIS (Night Avenue) ───────────────────────────────
  const ST = WD.mainStreet(E, { len: 80, night: true });
  // Add distant Eiffel Tower standing behind Parisian skyline
  const horizonTower = makeEiffelTower({ scale: 1.2, lit: true });
  horizonTower.position.set(-8, 0, -48);
  ST.scene.add(horizonTower);

  const stLustig = person('lustig');
  const stPoisson = person('poisson');
  const stGendarme = person('gendarme');
  const stVictim2 = person('victim2');
  [stLustig, stPoisson, stGendarme, stVictim2].forEach((p) => ST.scene.add(p.group));

  // ── SET 2: EIFFEL TOWER SHOWCASE (Dramatic Night Monument) ───────────
  const SC = WD.meadow(E, { night: true });
  const monument = makeEiffelTower({ scale: 0.55, lit: true });
  monument.position.set(0, 0, -18);
  SC.scene.add(monument);

  // Golden ground spotlights lighting up the tower
  const spotL = new THREE.SpotLight('#FFAA33', 12, 45, Math.PI / 4, 0.4);
  spotL.position.set(-4, 0.5, -8); spotL.target = monument; SC.scene.add(spotL);
  const spotR = new THREE.SpotLight('#FFAA33', 12, 45, Math.PI / 4, 0.4);
  spotR.position.set(4, 0.5, -8); spotR.target = monument; SC.scene.add(spotR);

  // Seine river bridge balustrade in foreground
  const bridgeWall = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 0.8), WD.mat({ color: '#2B303D' }));
  bridgeWall.position.set(0, 0.6, -1.0); SC.scene.add(bridgeWall);
  const bridgeLantern = WD.lamp(true);
  bridgeLantern.position.set(-2.2, 0.18, -0.6); SC.scene.add(bridgeLantern);

  const scLustig = person('lustig');
  SC.scene.add(scLustig.group);

  // ── SET 3: EIFFEL TOWER RUST CLOSEUP ─────────────────────────────────
  const RC = WD.meadow(E, { night: true });
  const rustTower = makeEiffelTower({ scale: 0.9, rust: true, lit: true });
  rustTower.position.set(2.5, 0, -16);
  RC.scene.add(rustTower);
  const rustNotice = PR.poster(['AVIS OFFICIEL', '!DÉMOLITION', 'TOUR EIFFEL', 'PARIS 1925'], { w: 1.6, h: 2.2, bg: '#E8DFC8' });
  rustNotice.position.set(0.6, 1.8, -6.5);
  RC.scene.add(rustNotice);
  const rcLustig = person('lustig');
  RC.scene.add(rcLustig.group);

  // ── SET 4: HÔTEL DE CRILLON (Conspiratorial Midnight Suite) ──────────
  const IN = WD.interior(E, { wall: '#4A151C', motif: '#6B202A', floor: '#2A1812' });
  const table = PR.desk(3.4);
  table.position.set(0.2, 0, -2.8);
  IN.scene.add(table);

  const inLustig = person('lustig');
  const inPoisson = person('poisson');
  const inDealer2 = person('dealer2');
  const inDealer3 = person('dealer3');
  const inVictim2 = person('victim2');
  [inLustig, inPoisson, inDealer2, inDealer3, inVictim2].forEach((p) => IN.scene.add(p.group));

  // ── SET 5: GARE DE L'EST (Midnight Steam Train) ──────────────────────
  const TR = WD.meadow(E, { night: true });
  const rl = PR.rails(350); rl.position.set(0, 0, -12); TR.scene.add(rl);
  const tr = PR.train(); tr.position.set(0, 0, -12); TR.scene.add(tr);
  const trainSign = PR.signpost([['VIENNE  EXPRESS', 'r'], ['PARIS', 'l']]);
  trainSign.position.set(-4.5, 0, -6.5);
  TR.scene.add(trainSign);
  const trLustig = person('lustig');
  TR.scene.add(trLustig.group);

  // =====================================================================
  // SHOT 0 · "In 1925, a con artist named Mr. Victor Lustig..."
  // =====================================================================
  {
    const st = cut(0);
    add({
      id: 'S00',
      at: st,
      note: 'Midnight Paris: Mr. Victor Lustig walks with swagger along clear cobblestone street',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        stLustig.group.visible = true; stPoisson.group.visible = stGendarme.group.visible = stVictim2.group.visible = false;
        // Walking in clear street center - zero obstacles or crates!
        stLustig.at(-2.8, 0.18, -4.5 + k * 3.0);
        stLustig.set({
          legs: 'walk', phase: t * 7, mood: 'smug',
          armL: [25, 10], armR: [45 + Math.sin(t * 6) * 15, -40],
          talk: talk(t), blink: blink(t)
        });
        shoot(ST.scene, [stLustig], V3(-0.8, 2.1, -11.0), V3(-1.8, 1.85, -5.5), V3(-2.8, 1.4, -3.0), V3(-2.8, 1.4, 0), k, LOOKS.street);
        blit();
      }
    });
    cue(st + 0.05, 'whoosh', { gain: 0.6 });
    cue(Wd('1925', 0), 'ding', { gain: 0.7 });
    cue(Wd('craziest', 0), 'sparkle', { gain: 0.6 });
  }

  // =====================================================================
  // SHOT 1 · "He sold the entire Eiffel Tower... not once, but twice!"
  // SHOWCASE: Tower front & center, illuminated against midnight sky
  // =====================================================================
  {
    const st = cut(1);
    add({
      id: 'S1 = Eiffel Showcase',
      at: st,
      note: 'Grand showcase: Dramatic sweep up to the illuminated Eiffel Tower at night',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        scLustig.group.visible = true;
        scLustig.at(is16x9 ? -3.2 : -0.85, is16x9 ? 0.4 : 0.6, is16x9 ? 5.5 : 3.5);
        scLustig.set({
          mood: t > Wd('twice', 1) ? 'laugh' : 'smug',
          armR: [120, 20], armL: [25, 10],
          talk: talk(t), blink: blink(t)
        });
        // Dramatic framing of the towering illuminated Eiffel monument
        const fromPos = is16x9 ? V3(-0.6, 2.4, 14.0) : V3(-0.1, 2.0, 7.5);
        const toPos = is16x9 ? V3(0, 3.0, 16.0) : V3(0, 2.6, 8.5);
        const lookAt1 = is16x9 ? V3(0, 7.5, -18.0) : V3(0, 6.0, -18.0);
        const lookAt2 = is16x9 ? V3(0, 8.5, -18.0) : V3(0, 8.5, -18.0);
        shoot(SC.scene, [scLustig], fromPos, toPos, lookAt1, lookAt2, k, LOOKS.showcase);
        blit();
      }
    });
    cue(st, 'whoosh', { gain: 0.7 });
    cue(Wd('entire', 1), 'ding', { gain: 0.6 });
    cue(Wd('Eiffel', 1), 'sparkle', { gain: 0.9 });
    cue(Wd('twice', 1), 'boing', { gain: 0.8 });
  }

  // =====================================================================
  // SHOT 2 · "Back then, the Eiffel Tower was rusting badly in the dark Paris skies."
  // CLOSEUP: Colossal iron arch, rivets, flaking rust
  // =====================================================================
  {
    const st = cut(2);
    add({
      id: 'S02',
      at: st,
      note: 'Close-up of rusting iron tower base, lanterns, peeling paint',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        rcLustig.at(-0.5, 0, -5.8);
        rcLustig.set({ mood: 'neutral', armR: [45, -45], look: [0.3, 0.2], blink: blink(t) });
        shoot(RC.scene, [rcLustig], V3(0.05, 1.7, -2.2), V3(0.05, 1.65, -2.8), V3(0.1, 1.7, -6.0), null, k, LOOKS.street);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('rusting', 2), 'slide', { dur: 1.0, gain: 0.6 });
  }

  // =====================================================================
  // SHOT 3 · "Newspapers reported that the city was thinking about tearing it down."
  // =====================================================================
  {
    const st = cut(3);
    add({
      id: 'S03',
      at: st,
      note: 'Lustig holds up Le Figaro newspaper under midnight streetlamp',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        stLustig.group.visible = true; stPoisson.group.visible = stGendarme.group.visible = false;
        stLustig.at(-3.2, 0.18, -3.0);
        stLustig.set({
          mood: 'happy', armR: [35, -80], holdR: PROPS.figaroNews,
          armL: [20, 10], talk: talk(t), blink: blink(t)
        });
        shoot(ST.scene, [stLustig], V3(-2.2, 1.85, -0.6), V3(-2.6, 1.8, -1.2), V3(-3.2, 1.5, -3.0), null, k, LOOKS.street, 1.8);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('Newspapers', 3), 'pop', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 4 · "So under the cover of night, Mr. Lustig forged official French government credentials."
  // =====================================================================
  {
    const st = cut(4);
    add({
      id: 'S04',
      at: st,
      note: 'Midnight study: Lustig stamps forged French credentials',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inPoisson, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inLustig.group.visible = true;
        inLustig.at(0.2, 0, -3.7);
        inLustig.set({
          mood: 'smug', armR: [50, -70], holdR: PROPS.rubberStamp,
          armL: [40, -60], holdL: PROPS.contract, talk: talk(t), blink: blink(t)
        });
        shoot(IN.scene, [inLustig], V3(0.2, 1.95, -1.0), V3(0.2, 1.75, -1.6), V3(0.2, 1.4, -3.7), null, k, LOOKS.room);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('credentials', 4), 'stamp', { gain: 1.0 });
  }

  // =====================================================================
  // SHOT 5 · "He called Paris's top scrap-metal dealers to a secret midnight meeting at the Hotel de Crillon."
  // =====================================================================
  {
    const st = cut(5);
    add({
      id: 'S05',
      at: st,
      note: 'Grand Crillon suite at midnight: dealers gathered around table',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inPoisson, inDealer2, inDealer3].forEach((p) => (p.group.visible = true));
        inVictim2.group.visible = false;
        inLustig.at(0.2, 0, -3.7);
        inPoisson.at(-1.4, 0, -2.6);
        inDealer2.at(1.6, 0, -2.6);
        inDealer3.at(1.1, 0, -3.4);
        inLustig.set({ mood: 'smug', armL: [40, -40], armR: [40, -40], talk: talk(t), blink: blink(t) });
        inPoisson.set({ mood: 'neutral', armR: [20, 10], blink: blink(t, 1) });
        inDealer2.set({ mood: 'smug', armL: [30, -30] });
        inDealer3.set({ mood: 'neutral', armR: [20, 20] });
        shoot(IN.scene, [inLustig, inPoisson, inDealer2, inDealer3], V3(-0.4, 2.3, 1.8), V3(0.2, 2.0, 0.6), V3(0.2, 1.4, -2.8), null, k, LOOKS.room);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('Crillon', 5), 'ding', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 6 · "In a dim, private suite, he whispered that the demolition was a top-secret state project."
  // =====================================================================
  {
    const st = cut(6);
    add({
      id: 'S06',
      at: st,
      note: 'Lustig leans forward confidential finger-to-lips: state secret',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inPoisson, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inLustig.group.visible = true; inLustig.at(0.2, 0, -3.4);
        inLustig.set({
          mood: 'sly', armR: [70, -110], armL: [30, 20],
          look: [-0.4, 0.2], talk: talk(t), blink: blink(t)
        });
        shoot(IN.scene, [inLustig], V3(0.8, 1.85, -1.5), V3(0.4, 1.75, -2.1), V3(0.2, 1.5, -3.4), null, k, LOOKS.room, 1.4);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('whispered', 6), 'tock', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 7 · "And he opened private bids for seven thousand tons of scrap iron."
  // =====================================================================
  {
    const st = cut(7);
    add({
      id: 'S07',
      at: st,
      note: 'Lustig unrolls Eiffel Tower blueprints, dealers eyeing competitively',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inPoisson, inDealer2].forEach((p) => (p.group.visible = true));
        inDealer3.group.visible = inVictim2.group.visible = false;
        inLustig.at(0.2, 0, -3.7); inLustig.set({ mood: 'smug', armR: [40, -40], holdR: PROPS.blueprint });
        inPoisson.at(-1.2, 0, -2.6); inPoisson.set({ mood: 'happy', armR: [40, -60], blink: blink(t) });
        inDealer2.at(1.4, 0, -2.6); inDealer2.set({ mood: 'neutral', armL: [30, -30] });
        shoot(IN.scene, [inLustig, inPoisson, inDealer2], V3(-1.8, 2.1, -0.4), V3(-1.0, 1.9, -1.0), V3(0.2, 1.3, -2.8), null, k, LOOKS.room);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('bids', 7), 'ding', { gain: 0.6 });
  }

  // =====================================================================
  // SHOT 8 · "One wealthy dealer, Mr. André Poisson, was desperate to win the contract."
  // =====================================================================
  {
    const st = cut(8);
    add({
      id: 'S08',
      at: st,
      note: 'Mr. André Poisson sweating eagerly, clutching his lapels',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inPoisson.group.visible = true; inPoisson.at(-0.2, 0, -2.8);
        inPoisson.set({
          mood: 'happy', armL: [50, -60], armR: [50, -60],
          look: [0.3, -0.3], sweat: 0.6, talk: talk(t), blink: blink(t)
        });
        shoot(IN.scene, [inPoisson], V3(0.5, 1.85, -1.2), V3(0.1, 1.75, -1.6), V3(-0.2, 1.45, -2.8), null, k, LOOKS.room, 1.3);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('desperate', 8), 'boing', { gain: 0.5 });
  }

  // =====================================================================
  // SHOT 9 · "Until he suddenly grew suspicious: why was this meeting so secretive?"
  // =====================================================================
  {
    const st = cut(9);
    add({
      id: 'S09',
      at: st,
      note: 'Poisson crosses arms, brow furrowed: why so secret?',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inPoisson.group.visible = true; inPoisson.at(-0.2, 0, -2.8);
        inPoisson.set({
          mood: 'worried', armL: [50, -90], armR: [50, -90],
          look: [-0.6, 0.4], sweat: 1.0, blink: blink(t)
        });
        shoot(IN.scene, [inPoisson], V3(-0.2, 1.85, -1.0), V3(-0.2, 1.7, -1.5), V3(-0.2, 1.45, -2.8), null, k, LOOKS.room, 1.3);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('suspicious', 9), 'slide', { dur: 0.8, gain: 0.6 });
  }

  // =====================================================================
  // SHOT 10 · "Sensing his hesitation, Mr. Lustig played his masterstroke:"
  // =====================================================================
  {
    const st = cut(10);
    add({
      id: 'S10',
      at: st,
      note: 'Lustig detects the hesitation and smiles slyly',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inPoisson, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inLustig.group.visible = true; inLustig.at(0.2, 0, -3.0);
        inLustig.set({
          mood: 'sly', armL: [20, 10], armR: [40, -40],
          look: [-0.5, 0.1], talk: talk(t), blink: blink(t)
        });
        shoot(IN.scene, [inLustig], V3(0.6, 1.85, -1.4), V3(0.3, 1.75, -1.9), V3(0.2, 1.5, -3.0), null, k, LOOKS.room, 1.3);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('masterstroke', 10), 'sparkle', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 11 · "he leaned in close... and quietly demanded a massive bribe."
  // =====================================================================
  {
    const st = cut(11);
    add({
      id: 'S11',
      at: st,
      note: 'Lustig leans right next to Poisson, whispering and asking for a bribe',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inLustig.group.visible = inPoisson.group.visible = true;
        inLustig.at(0.3, 0, -2.8); inPoisson.at(-0.4, 0, -2.8);
        inLustig.set({
          mood: 'sly', armR: [45, -70], holdR: PROPS.goldCoin,
          lean: -8, talk: talk(t), blink: blink(t)
        });
        inPoisson.set({ mood: 'shock', armL: [30, -30], armR: [30, -30], blink: blink(t, 1) });
        shoot(IN.scene, [inLustig, inPoisson], V3(-0.05, 1.9, -0.8), V3(-0.05, 1.75, -1.3), V3(-0.05, 1.45, -2.8), null, k, LOOKS.room, 1.5);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('bribe', 11), 'ding', { gain: 0.8 });
  }

  // =====================================================================
  // SHOT 12 · "Instantly, Mr. Poisson's doubts vanished."
  // =====================================================================
  {
    const st = cut(12);
    add({
      id: 'S12',
      at: st,
      note: 'Poisson lights up with joy and sudden relief',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inPoisson.group.visible = true; inPoisson.at(-0.2, 0, -2.8);
        inPoisson.set({
          mood: 'happy', armL: [120, 20], armR: [120, 20],
          look: [0, -0.3], talk: talk(t), blink: blink(t)
        });
        shoot(IN.scene, [inPoisson], V3(-0.2, 1.85, -1.0), V3(-0.2, 1.75, -1.5), V3(-0.2, 1.45, -2.8), null, k, LOOKS.room, 1.3);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('vanished', 12), 'sparkle', { gain: 0.8 });
  }

  // =====================================================================
  // SHOT 13 · "He thought: a corrupt bureaucrat? This must be the real government!"
  // =====================================================================
  {
    const st = cut(13);
    add({
      id: 'S13',
      at: st,
      note: 'Poisson laughs warmly, patting himself: a corrupt official is the real government!',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inPoisson.group.visible = true; inPoisson.at(-0.2, 0, -2.8);
        inPoisson.set({
          mood: 'laugh', armL: [70, -60], armR: [70, -60],
          talk: talk(t), blink: blink(t)
        });
        shoot(IN.scene, [inPoisson], V3(-0.2, 1.9, -0.9), V3(-0.2, 1.75, -1.4), V3(-0.2, 1.45, -2.8), null, k, LOOKS.room, 1.4);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('government', 13), 'pop', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 14 · "So Mr. Poisson handed over a suitcase stuffed with cash..."
  // =====================================================================
  {
    const st = cut(14);
    add({
      id: 'S14',
      at: st,
      note: 'Poisson hands the money suitcase across the table to Lustig',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inLustig.group.visible = inPoisson.group.visible = true;
        inPoisson.at(-0.8, 0, -2.8); inLustig.at(0.6, 0, -2.8);
        inPoisson.set({ mood: 'proud', armR: [70, -70], holdR: PROPS.suitcase, blink: blink(t) });
        inLustig.set({ mood: 'happy', armL: [60, -60], talk: talk(t), blink: blink(t, 1) });
        shoot(IN.scene, [inPoisson, inLustig], V3(-0.1, 2.0, -0.6), V3(-0.1, 1.8, -1.2), V3(-0.1, 1.4, -2.8), null, k, LOOKS.room);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('suitcase', 14), 'thud', { gain: 0.8 });
    cue(Wd('cash', 14), 'sparkle', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 15 · "and Mr. Lustig escaped on the midnight train to Vienna."
  // =====================================================================
  {
    const st = cut(15);
    add({
      id: 'S15',
      at: st,
      note: 'Paris Gare de l\'Est midnight: steam train rolls, Lustig escapes',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        tr.update(t, 5);
        trLustig.at(-2.8, 0, -8.0);
        trLustig.set({ mood: 'smug', armR: [35, -80], holdR: PROPS.suitcase, armL: [120, 20], talk: talk(t) });
        shoot(TR.scene, [trLustig], V3(-4.0, 2.2, 0), V3(0, 2.2, -2.0), V3(-2.0, 1.8, -10.0), V3(4.0, 1.8, -12.0), k, LOOKS.field);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('train', 15), 'slide', { dur: 1.5, gain: 0.6 });
    cue(Wd('Vienna', 15), 'ding', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 16 · "Now here's the craziest twist:"
  // =====================================================================
  {
    const st = cut(16);
    add({
      id: 'S16',
      at: st,
      note: 'Dramatic crash zoom on Poisson standing alone in the Crillon suite',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        [inLustig, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inPoisson.group.visible = true; inPoisson.at(0.2, 0, -2.8);
        inPoisson.set({
          mood: 'shock', armL: [40, -40], holdL: PROPS.contract,
          armR: [40, -40], sweat: 1.0, blink: blink(t)
        });
        shoot(IN.scene, [inPoisson], V3(0.2, 2.2, 1.0), V3(0.2, 1.7, -1.2), V3(0.2, 1.45, -2.8), null, k, LOOKS.room, 1.5);
        blit();
      }
    });
    cue(st, 'whoosh', { gain: 0.8 });
    cue(Wd('craziest', 16), 'boing', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 17 · "Mr. Poisson was so humiliated that he bought the Eiffel Tower..."
  // =====================================================================
  {
    const st = cut(17);
    add({
      id: 'S17',
      at: st,
      note: 'Poisson clutching his head in utter embarrassment and horror',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inLustig, inDealer2, inDealer3, inVictim2].forEach((p) => (p.group.visible = false));
        inPoisson.group.visible = true; inPoisson.at(0.2, 0, -2.8);
        inPoisson.set({
          mood: 'sad', armL: [140, 20], armR: [140, 20],
          sweat: 1.0, tears: 1, talk: talk(t), blink: blink(t)
        });
        shoot(IN.scene, [inPoisson], V3(0.2, 1.85, -1.2), V3(0.2, 1.75, -1.7), V3(0.2, 1.45, -2.8), null, k, LOOKS.room, 1.2);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('humiliated', 17), 'gulp', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 18 · "he never said a single word to the police!"
  // =====================================================================
  {
    const st = cut(18);
    add({
      id: 'S18',
      at: st,
      note: 'Paris Police Gendarme whistling calmly on the street, zero reports filed',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        stLustig.group.visible = stPoisson.group.visible = stVictim2.group.visible = false;
        stGendarme.group.visible = true;
        stGendarme.at(-3.5, 0.18, -3.2);
        stGendarme.set({ mood: 'happy', armL: [20, 10], armR: [20, 10], blink: blink(t) });
        shoot(ST.scene, [stGendarme], V3(-2.6, 1.9, -0.8), V3(-3.0, 1.8, -1.4), V3(-3.5, 1.45, -3.2), null, k, LOOKS.street, 1.8);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('police', 18), 'tock', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 19 · "When Mr. Lustig saw zero headlines in the morning news,"
  // =====================================================================
  {
    const st = cut(19);
    add({
      id: 'S19',
      at: st,
      note: 'Lustig relaxed with newspaper, seeing no police hunt at all',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        stGendarme.group.visible = false;
        stLustig.group.visible = true; stLustig.at(-3.2, 0.18, -2.8);
        stLustig.set({ mood: 'laugh', armR: [35, -80], holdR: PROPS.figaroNews, talk: talk(t), blink: blink(t) });
        shoot(ST.scene, [stLustig], V3(-2.4, 1.85, -0.6), V3(-2.8, 1.8, -1.2), V3(-3.2, 1.45, -2.8), null, k, LOOKS.street, 1.8);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('headlines', 19), 'pop', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 20 · "he slipped right back into Paris under the moonlight,"
  // =====================================================================
  {
    const st = cut(20);
    add({
      id: 'S20',
      at: st,
      note: 'Lustig strolls back into Paris under the moonlit Eiffel Tower skyline',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        stGendarme.group.visible = false;
        stLustig.group.visible = true;
        // Walking in clear street center - zero clipping
        stLustig.at(-3.0, 0.18, -4.5 + k * 2.8);
        stLustig.set({
          legs: 'walk', phase: t * 7, mood: 'smug',
          armL: [30, 10], armR: [35, -80], holdR: PROPS.suitcase,
          talk: talk(t), blink: blink(t)
        });
        shoot(ST.scene, [stLustig], V3(-1.0, 2.2, -9.0), V3(-2.0, 1.8, -4.5), V3(-3.0, 1.4, -2.5), V3(-3.0, 1.4, 0), k, LOOKS.street);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('moonlight', 20), 'sparkle', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 21 · "and sold the Eiffel Tower all over again to another victim!"
  // =====================================================================
  {
    const st = cut(21);
    add({
      id: 'S21',
      at: st,
      note: 'Back in the luxury suite: shaking hands with victim #2 over the blueprints',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        [inPoisson, inDealer2, inDealer3].forEach((p) => (p.group.visible = false));
        inLustig.group.visible = inVictim2.group.visible = true;
        inLustig.at(0.4, 0, -2.8);
        inVictim2.at(-0.6, 0, -2.8);
        inLustig.set({ mood: 'smug', armL: [70, -70], holdL: PROPS.contract, armR: [60, -60], talk: talk(t), blink: blink(t) });
        inVictim2.set({ mood: 'happy', armR: [60, -60], blink: blink(t, 1) });
        shoot(IN.scene, [inLustig, inVictim2], V3(-0.1, 2.1, -0.6), V3(-0.1, 1.8, -1.2), V3(-0.1, 1.4, -2.8), null, k, LOOKS.room);
        blit();
      }
    });
    cue(st, 'whoosh', { gain: 0.8 });
    cue(Wd('again', 21), 'boing', { gain: 0.8 });
    cue(Wd('victim', 21), 'sparkle', { gain: 0.7 });
  }

  // =====================================================================
  // SHOT 22 · "Because in the end, he was never selling iron..."
  // =====================================================================
  {
    const st = cut(22);
    add({
      id: 'S22',
      at: st,
      note: 'Grand moonlit silhouette of the Eiffel Tower',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        scLustig.group.visible = false;
        const fromPos = is16x9 ? V3(0, 3.2, 14.0) : V3(0, 2.4, 8.5);
        const toPos = is16x9 ? V3(0, 4.0, 18.0) : V3(0, 3.2, 12.0);
        shoot(SC.scene, [], fromPos, toPos, V3(0, 7.5, -18.0), null, k, { ...LOOKS.showcase, fov: is16x9 ? 34 : 44 });
        blit();
      }
    });
    cue(st, 'whoosh', { gain: 0.7 });
    cue(Wd('iron', 22), 'thud', { gain: 0.6 });
  }

  // =====================================================================
  // SHOT 23 · "he was selling human greed."
  // =====================================================================
  {
    const st = cut(23);
    add({
      id: 'S23',
      at: st,
      note: 'Close-up of Lustig in golden streetlight, holding glittering gold coin',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        stLustig.group.visible = true; stPoisson.group.visible = stGendarme.group.visible = stVictim2.group.visible = false;
        stLustig.at(-2.8, 0.18, -2.2);
        stLustig.set({ mood: 'smug', armR: [45, -70], holdR: PROPS.goldCoin, armL: [15, 10], look: [0.1, -0.1], talk: talk(t), blink: blink(t) });
        shoot(ST.scene, [stLustig], V3(-2.8, 1.85, 0.6), V3(-2.8, 1.8, 0.0), V3(-2.8, 1.55, -2.2), null, k, LOOKS.street, 2.0);
        blit();
      }
    });
    cue(st, 'whoosh');
    cue(Wd('greed', 23), 'sparkle', { gain: 1.0 });
    cue(Wd('greed', 23) + 0.2, 'ding', { gain: 0.8 });
  }

  // =====================================================================
  // SHOT 24 · "For more unbelievable true stories, follow NEXORA!"
  // =====================================================================
  {
    const st = cut(24);
    add({
      id: 'S24',
      at: st,
      note: 'Outro: Lustig bows and tips bowler hat, NEXORA badge appears',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        stLustig.group.visible = true; stPoisson.group.visible = stGendarme.group.visible = stVictim2.group.visible = false;
        stLustig.at(-2.8, 0.18, -2.2);
        stLustig.set({ mood: 'happy', armR: [140, 10], armL: [140, 10], lean: Math.sin(t * 4) * 6, talk: talk(t), blink: blink(t) });
        shoot(ST.scene, [stLustig], V3(-2.8, 1.8, 0.2), V3(-2.8, 2.1, 2.4), V3(-2.8, 1.5, -2.2), null, k, LOOKS.street);
        blit();

        // Nexora Card Overlay
        const badgePop = clamp((lt - 0.4) / 0.35);
        if (badgePop > 0) {
          ctx.save();
          const cardX = vw / 2, cardY = is16x9 ? vh / 2 - 40 : 480;
          ctx.translate(cardX, cardY);
          const sc = lerp(0.8, 1.0, eob(badgePop));
          ctx.scale(sc, sc);
          ctx.globalAlpha = Math.min(1, badgePop * 1.4);

          ctx.fillStyle = 'rgba(10, 12, 22, 0.92)';
          ctx.beginPath();
          ctx.roundRect(-380, -110, 760, 220, 28);
          ctx.fill();
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 6;
          ctx.stroke();

          ctx.fillStyle = '#D4AF37';
          ctx.fillRect(-320, -90, 640, 4);
          ctx.fillRect(-320, 86, 640, 4);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 76px Inter';
          ctx.fillText('NEXORA', 0, -20);

          ctx.fillStyle = '#D4AF37';
          ctx.font = '800 32px Inter';
          ctx.fillText('UNBELIEVABLE TRUE STORIES', 0, 42);

          ctx.restore();
        }
      }
    });
    cue(st, 'whoosh');
    cue(Wd('unbelievable', 24), 'pop', { gain: 0.7 });
    cue(Wd('NEXORA', 24), 'ding', { gain: 0.9 });
  }

  return { shots: S, cues: CUES };
}
