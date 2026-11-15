// The Tall Tale world for Aron Ralston: 3D sets with painted canvas textures, canyon, desert, dream, and summit environments.
import * as THREE from 'three';
import { lightRig } from './engine.js';
import { Toon } from './toon.js';
import { boulder as createBoulder, canyonWall, butte, summitFlag, backpack, waterBottle, pocketKnife, ropeCoil, helicopter } from './props.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const TEX = {};
export function canvasTex(key, w, h, draw, rep = [1, 1]) {
  let t = TEX[key];
  if (!t) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; TEX[key] = t;
  }
  const u = t.clone(); u.repeat.set(rep[0], rep[1]); u.needsUpdate = true; return u;
}
const shade = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); };
export const mat = (o = {}) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...o });
const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (parent) parent.add(b); return b; };
const cyl = (r1, r2, h, m, x, y, z, parent, seg = 12) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); c.position.set(x, y, z); c.castShadow = c.receiveShadow = true; if (parent) parent.add(c); return c; };

// ---------- painted textures ----------
export const T = {
  dirt: (col = '#C8763F', rep = [1, 1], tracks = false) => canvasTex('dirt' + col + tracks, 512, 512, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = shade(col, 0.75 + rnd(i) * 0.5); g.globalAlpha = 0.5; g.beginPath(); g.arc(rnd(i * 2.1) * w, rnd(i * 3.7) * h, 1 + rnd(i * 5.3) * 2.5, 0, 7); g.fill(); }
    g.globalAlpha = 0.18; g.fillStyle = shade(col, 0.6);
    if (tracks) [0.3, 0.38, 0.62, 0.7].forEach((x) => g.fillRect(x * w, 0, 14, h));
    g.globalAlpha = 1;
  }, rep),
  rock: (col = '#A65B32', rep = [1, 1]) => canvasTex('rock' + col, 512, 512, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1500; i++) {
      g.fillStyle = shade(col, 0.7 + rnd(i * 3) * 0.6);
      g.fillRect(rnd(i * 1.7) * w, rnd(i * 4.1) * h, 4 + rnd(i) * 16, 2 + rnd(i * 2) * 8);
    }
  }, rep),
  grass: (col = '#6DBB4A', rep = [1, 1]) => canvasTex('grass' + col, 512, 512, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) { const x = rnd(i * 1.3) * w, y = rnd(i * 2.9) * h; g.strokeStyle = shade(col, 0.7 + rnd(i * 7.7) * 0.6); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd(i) - 0.5) * 6, y - 6 - rnd(i * 9) * 8); g.stroke(); }
  }, rep),
};

export function sky(scene, { top = '#1A6EE8', horizon = '#87CEEB', ground = '#C47E48', r = 400, stars = false } = {}) {
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: { top: { value: new THREE.Color(top) }, hor: { value: new THREE.Color(horizon) }, gnd: { value: new THREE.Color(ground) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top, hor, gnd; varying vec3 vP; void main(){ float y = vP.y; vec3 c = y > 0.0 ? mix(hor, top, pow(clamp(y * 1.6, 0.0, 1.0), 0.7)) : gnd; gl_FragColor = vec4(c, 1.0); }' });
  const s = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), m); s.renderOrder = -10; scene.add(s);
  if (stars) {
    const geo = new THREE.BufferGeometry();
    const count = 300, pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = rnd(i * 7), v = rnd(i * 13);
      const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
      pos[i * 3] = (r * 0.95) * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs((r * 0.95) * Math.cos(phi));
      pos[i * 3 + 2] = (r * 0.95) * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({ color: '#FFF4D0', size: 2.0, transparent: true, opacity: 0.85 });
    const pts = new THREE.Points(geo, starMat); scene.add(pts);
  }
  return s;
}

export function sunlight(scene, E, { col = '#FFF5E0', i = 2.4, pos = [8, 14, 8], target = [0, 0, 0], box = 16, sky = '#87CEEB', ground = '#C47E48', hemi = 1.1, env = 0.25 } = {}) {
  scene.environment = E.envMap; scene.environmentIntensity = env;
  const r = lightRig(scene, { key: col, keyI: i, keyPos: pos, target, shadowBox: box, rimCol: '#FFFFFF', rimI: 0.4, sky, ground, hemiI: hemi });
  r.key.shadow.camera.far = 120; r.key.shadow.bias = -0.0006; r.key.shadow.camera.updateProjectionMatrix();
  return r;
}

/** Set 1: Canyon Rim / Utah Desert Mesa (Daytime Adventure) */
export function canyonRim(E) {
  const scene = new THREE.Scene();
  sky(scene, { top: '#1D78F2', horizon: '#9EE0FF', ground: '#914E29', stars: false });
  const sun = sunlight(scene, E, { col: '#FFF4D6', i: 2.5, pos: [12, 20, 10], hemi: 1.2 });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(350, 350),
    mat({ map: T.dirt('#C96E3A', [20, 20]), roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; scene.add(ground);

  // Distant Red Buttes & Mesas
  [[-40, -80, 24, 16], [35, -95, 30, 20], [-85, -60, 20, 14], [70, -70, 18, 12]].forEach(([x, z, w, h]) => {
    const b = butte({ w, h, d: w * 0.8, col: '#9E4E2C' });
    b.position.set(x, 0, z); scene.add(b);
  });

  // Canyon ledge opening
  const ledge = box(28, 4, 16, mat({ map: T.rock('#A8542B', [4, 1]) }), 0, -2, -10, scene);

  return { scene, sun };
}

/** Set 2: Slot Canyon (Claustrophobic Sandstone Chasm) */
export function slotCanyon(E, { mode = 'day', width = 3.2 } = {}) {
  const scene = new THREE.Scene();
  const isNight = mode === 'night';
  const isDawn = mode === 'dawn';

  if (isNight) {
    sky(scene, { top: '#060A18', horizon: '#121A33', ground: '#05070D', stars: true });
  } else if (isDawn) {
    sky(scene, { top: '#4A3B66', horizon: '#D97A53', ground: '#3A2018', stars: false });
  } else {
    sky(scene, { top: '#2574D8', horizon: '#89C2F5', ground: '#783A1E', stars: false });
  }

  const sunCol = isNight ? '#7A9EE5' : (isDawn ? '#FFAA77' : '#FFE8C2');
  const sunI = isNight ? 0.7 : (isDawn ? 1.6 : 2.2);
  const sun = sunlight(scene, E, {
    col: sunCol, i: sunI, pos: [1, 24, 2], hemi: isNight ? 0.4 : 0.85, env: isNight ? 0.1 : 0.25
  });

  // Narrow canyon floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 2, 80),
    mat({ map: T.dirt('#A8572A', [2, 20]), roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -10); floor.receiveShadow = true; scene.add(floor);

  // Towering canyon walls left and right
  const hw = width / 2;
  const wallL = canyonWall({ w: 4, h: 26, d: 80, col: isNight ? '#5A2A1A' : '#B85828', seed: 1 });
  wallL.position.set(-hw - 2, 0, -10); scene.add(wallL);

  const wallR = canyonWall({ w: 4, h: 26, d: 80, col: isNight ? '#502416' : '#AD4E20', seed: 2 });
  wallR.position.set(hw + 2, 0, -10); scene.add(wallR);

  // Pinned Boulder
  const rock = createBoulder(2.2);
  rock.position.set(0.2, 1.6, -1.2);
  rock.rotation.set(0.3, 0.4, 0.1);
  scene.add(rock);

  return { scene, sun, boulder: rock, wallL, wallR };
}

/** Set 3: Vision / Dream Sequence (Warm Golden Ethereal Meadow) */
export function dreamMeadow(E) {
  const scene = new THREE.Scene();
  sky(scene, { top: '#FFF0BA', horizon: '#FFE082', ground: '#D6E87A', stars: false });
  const sun = sunlight(scene, E, {
    col: '#FFF8E0', i: 3.0, pos: [4, 12, 6], sky: '#FFE599', ground: '#CBE88B', hemi: 1.6, env: 0.4
  });

  const fl = new THREE.Mesh(
    new THREE.PlaneGeometry(350, 350),
    mat({ map: T.grass('#75C94B', [30, 30]), roughness: 0.7 })
  );
  fl.rotation.x = -Math.PI / 2; fl.position.y = -0.02; fl.receiveShadow = true; scene.add(fl);

  return { scene, sun };
}

/** Set 4: Blazing Desert Sun / Escape Walk */
export function desertFloor(E) {
  const scene = new THREE.Scene();
  sky(scene, { top: '#1460D4', horizon: '#89D2F8', ground: '#C97D45', stars: false });
  const sun = sunlight(scene, E, {
    col: '#FFFFE8', i: 3.2, pos: [0, 26, 4], sky: '#C2E5FC', ground: '#C97D45', hemi: 1.3
  });

  const fl = new THREE.Mesh(
    new THREE.PlaneGeometry(350, 350),
    mat({ map: T.dirt('#D98544', [25, 25]), roughness: 0.95 })
  );
  fl.rotation.x = -Math.PI / 2; fl.position.y = -0.02; fl.receiveShadow = true; scene.add(fl);

  // Distant cliffs behind
  const cliff = canyonWall({ w: 90, h: 22, d: 8, col: '#9E4E2C', seed: 5 });
  cliff.position.set(0, 0, -45); scene.add(cliff);

  // Rescue Helicopter
  const heli = helicopter();
  heli.position.set(0, 7.5, -12);
  scene.add(heli);

  return { scene, sun, heli };
}

/** Set 5: Mountain Summit (Triumph & 59 Peaks) */
export function mountainSummit(E) {
  const scene = new THREE.Scene();
  // Glorious Sunset Sky
  sky(scene, { top: '#23184E', horizon: '#E86A38', ground: '#5C3322', stars: false });
  const sun = sunlight(scene, E, {
    col: '#FFAE63', i: 2.6, pos: [-14, 10, -10], sky: '#F48E58', ground: '#4A2A1E', hemi: 1.1
  });

  // Rocky Mountain Peak
  const peakGeo = new THREE.ConeGeometry(16, 12, 10);
  const peakMesh = new THREE.Mesh(peakGeo, mat({ map: T.rock('#5E5550', [6, 4]), roughness: 0.95 }));
  peakMesh.position.set(0, -5, -4); peakMesh.receiveShadow = true; scene.add(peakMesh);

  // Cloud layer below
  const cloudMat = new THREE.MeshBasicMaterial({ color: '#E8DED1', transparent: true, opacity: 0.65 });
  const clouds = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), cloudMat);
  clouds.rotation.x = -Math.PI / 2; clouds.position.y = -4.5; scene.add(clouds);

  // Summit Flag
  const flag = summitFlag();
  flag.position.set(1.4, 1.0, -3.5);
  scene.add(flag);

  return { scene, sun, flag };
}
