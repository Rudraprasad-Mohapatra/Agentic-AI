// The Tall Tale world: 3D sets with painted canvas textures, day/dusk/night moods.
import * as THREE from 'three';
import { lightRig } from './engine.js';
import { Toon } from './toon.js';

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
  planks: (col = '#A8693E', rep = [1, 1]) => canvasTex('planks' + col, 512, 512, (g, w, h) => {
    const n = 8, ph = h / n;
    for (let i = 0; i < n; i++) {
      g.fillStyle = shade(col, 0.86 + rnd(i * 3) * 0.24); g.fillRect(0, i * ph, w, ph);
      g.strokeStyle = shade(col, 0.7); g.globalAlpha = 0.35; g.lineWidth = 2;
      for (let k = 0; k < 4; k++) { g.beginPath(); const y = i * ph + 8 + rnd(i * 7 + k) * (ph - 16); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 6, w * 0.6, y - 6, w, y + 2); g.stroke(); }
      g.globalAlpha = 1; g.fillStyle = shade(col, 0.45); g.fillRect(0, i * ph, w, 4);
      const jx = rnd(i * 11) * w; g.fillRect(jx, i * ph, 4, ph);
      g.fillStyle = shade(col, 0.5); [jx - 14, jx + 18].forEach((x) => { g.beginPath(); g.arc(x, i * ph + ph / 2, 3, 0, 7); g.fill(); });
    }
  }, rep),
  wallpaper: (col = '#9E2E3A', motif = '#B8414C', rep = [1, 1]) => canvasTex('wp' + col + motif, 256, 256, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h); g.fillStyle = motif; g.strokeStyle = motif; g.lineWidth = 5;
    const fleur = (x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(0, -40); g.bezierCurveTo(18, -20, 18, 0, 0, 14); g.bezierCurveTo(-18, 0, -18, -20, 0, -40); g.fill(); g.beginPath(); g.arc(-22, 4, 12, 0, 7); g.arc(22, 4, 12, 0, 7); g.fill(); g.fillRect(-3, 10, 6, 26); g.restore(); };
    [[64, 64], [192, 192], [192, 64 - 256], [64, 192]].forEach(([x, y], i) => i < 2 && fleur(x, y, 0.9));
    g.globalAlpha = 0.5; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(i % 2 ? 192 : 64, i < 2 ? 192 : 64, 6, 0, 7); g.fill(); } g.globalAlpha = 1;
  }, rep),
  brick: (col = '#B5553C', rep = [1, 1]) => canvasTex('brick' + col, 512, 512, (g, w, h) => {
    g.fillStyle = shade(col, 0.6); g.fillRect(0, 0, w, h); const bh = 32, bw = 85;
    for (let r = 0; r < h / bh; r++) for (let c = -1; c < w / bw + 1; c++) { const x = c * bw + (r % 2) * bw / 2; g.fillStyle = shade(col, 0.85 + rnd(r * 31 + c) * 0.3); g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6); }
  }, rep),
  siding: (col = '#6FA3B8', rep = [1, 1]) => canvasTex('siding' + col, 256, 256, (g, w, h) => {
    for (let i = 0; i < 8; i++) { const y = i * 32; const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, shade(col, 1.06)); gr.addColorStop(1, shade(col, 0.86)); g.fillStyle = gr; g.fillRect(0, y, w, 32); g.fillStyle = shade(col, 0.6); g.fillRect(0, y + 30, w, 2); }
  }, rep),
  dirt: (col = '#C8763F', rep = [1, 1], tracks = true) => canvasTex('dirt' + col + tracks, 512, 512, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = shade(col, 0.75 + rnd(i) * 0.5); g.globalAlpha = 0.5; g.beginPath(); g.arc(rnd(i * 2.1) * w, rnd(i * 3.7) * h, 1 + rnd(i * 5.3) * 2.5, 0, 7); g.fill(); }
    g.globalAlpha = 0.18; g.fillStyle = shade(col, 0.6);
    if (tracks) [0.3, 0.38, 0.62, 0.7].forEach((x) => g.fillRect(x * w, 0, 14, h));
    g.globalAlpha = 1;
  }, rep),
  cobblestone: (col = '#2A2E3D', rep = [1, 1]) => canvasTex('cobble' + col, 512, 512, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    const rw = 40, rh = 24;
    for (let y = 0; y < h; y += rh) {
      const off = ((y / rh) % 2) * (rw / 2);
      for (let x = -rw; x < w + rw; x += rw) {
        g.fillStyle = shade(col, 0.8 + rnd((x + 100) * 11 + y) * 0.4);
        g.strokeStyle = shade(col, 0.4); g.lineWidth = 3;
        g.beginPath(); g.roundRect(x + off + 2, y + 2, rw - 4, rh - 4, 6); g.fill(); g.stroke();
      }
    }
  }, rep),
  grass: (col = '#6DBB4A', rep = [1, 1]) => canvasTex('grass' + col, 512, 512, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) { const x = rnd(i * 1.3) * w, y = rnd(i * 2.9) * h; g.strokeStyle = shade(col, 0.7 + rnd(i * 7.7) * 0.6); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd(i) - 0.5) * 6, y - 6 - rnd(i * 9) * 8); g.stroke(); }
  }, rep),
  felt: (col = '#1F5A45') => canvasTex('felt' + col, 256, 256, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { g.fillStyle = shade(col, 0.85 + rnd(i) * 0.3); g.fillRect(rnd(i * 3) * w, rnd(i * 7) * h, 2, 2); } }),
};

export function signBoard(text, { w = 2.4, h = 0.45, bg = '#2A4E38', fg = '#F2D37A' } = {}) {
  const t = canvasTex('sb' + text + bg + fg, 512, 128, (c) => {
    c.fillStyle = bg; c.fillRect(0, 0, 512, 128); c.strokeStyle = fg; c.lineWidth = 6; c.strokeRect(8, 8, 496, 112);
    c.fillStyle = fg; c.font = '700 52px Caladea, Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, 256, 66);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat({ map: t })); m.castShadow = true; return m;
}

export function facade(name, { wall = '#2C3240', kind = 'brick', trim = '#D8D0C0', sign = '#1C2E24', signText = '#F2C240', awning = null, w = 5, h = 7, seed = 1, night = true } = {}) {
  const px = 110, cw = Math.round(w * px), ch = Math.round(h * px);
  return canvasTex('fac' + name + wall + w + h + seed + night, cw, ch, (g) => {
    if (kind === 'brick') { const b = T.brick(wall).image; for (let y = 0; y < ch; y += 512) for (let x = 0; x < cw; x += 512) g.drawImage(b, x, y); }
    else { const b = T.siding(wall).image; for (let y = 0; y < ch; y += 256) for (let x = 0; x < cw; x += 256) g.drawImage(b, x, y); }
    // cornice
    g.fillStyle = trim; g.fillRect(0, 0, cw, 40); g.fillStyle = shade(trim, 0.7); g.fillRect(0, 40, cw, 10);
    for (let x = 10; x < cw; x += 34) { g.fillStyle = trim; g.fillRect(x, 50, 16, 16); }
    // upper windows (at night: warm cozy interior glow)
    const nw = Math.max(2, Math.round(w / 1.6)), ww = cw / nw;
    for (let i = 0; i < nw; i++) {
      const x = i * ww + ww * 0.22, y = ch * 0.16, wd = ww * 0.56, ht = ch * 0.22;
      g.fillStyle = trim; g.fillRect(x - 10, y - 14, wd + 20, ht + 28);
      const gr = g.createLinearGradient(x, y, x + wd, y + ht);
      if (night) { gr.addColorStop(0, '#FFE89E'); gr.addColorStop(0.5, '#F5BA42'); gr.addColorStop(1, '#8A5818'); }
      else { gr.addColorStop(0, '#7FB3D8'); gr.addColorStop(0.5, '#3F6E9A'); gr.addColorStop(1, '#2B4A70'); }
      g.fillStyle = gr; g.fillRect(x, y, wd, ht);
      g.fillStyle = trim; g.fillRect(x + wd / 2 - 4, y, 8, ht); g.fillRect(x, y + ht / 2 - 4, wd, 8);
    }
    // sign board
    const sy = ch * 0.47, sh = ch * 0.1;
    g.fillStyle = sign; g.fillRect(cw * 0.06, sy, cw * 0.88, sh); g.strokeStyle = signText; g.lineWidth = 5; g.strokeRect(cw * 0.06 + 8, sy + 8, cw * 0.88 - 16, sh - 16);
    g.fillStyle = signText; g.textAlign = 'center'; g.textBaseline = 'middle'; let fs = sh * 0.56; g.font = `700 ${fs}px Caladea, Georgia, serif`;
    while (g.measureText(name).width > cw * 0.78 && fs > 10) { fs -= 2; g.font = `700 ${fs}px Caladea, Georgia, serif`; }
    g.fillText(name, cw / 2, sy + sh / 2 + 2);
    // shop window + door
    const by = sy + sh + 16, bh = ch - by;
    g.fillStyle = shade(trim, 0.8); g.fillRect(0, by, cw, bh);
    const dw = cw * 0.2, dx = rnd(seed) > 0.5 ? cw * 0.08 : cw * 0.72;
    g.fillStyle = '#3A2416'; g.fillRect(dx, by + 14, dw, bh - 14);
    const wx = dx < cw / 2 ? dx + dw + 20 : cw * 0.06, wwid = cw * 0.66 - 20;
    const sgr = g.createLinearGradient(wx, by, wx + wwid, by + bh);
    if (night) { sgr.addColorStop(0, '#FFF2C0'); sgr.addColorStop(0.4, '#F7C948'); sgr.addColorStop(1, '#4A3210'); }
    else { sgr.addColorStop(0, '#9CC7E4'); sgr.addColorStop(0.45, '#4C7FA8'); sgr.addColorStop(1, '#2A4565'); }
    g.fillStyle = '#3A2214'; g.fillRect(wx - 8, by + 14, wwid + 16, bh * 0.7 + 16); g.fillStyle = sgr; g.fillRect(wx, by + 22, wwid, bh * 0.7);
  });
}

export function sky(scene, { top = '#060A18', horizon = '#121A33', ground = '#05070D', r = 400, stars = true } = {}) {
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
    const starMat = new THREE.PointsMaterial({ color: '#E8ECFF', size: 1.8, transparent: true, opacity: 0.85 });
    const pts = new THREE.Points(geo, starMat); scene.add(pts);
  }
  return s;
}

export function sunlight(scene, E, { col = '#FFF0D6', i = 2.6, pos = [6, 10, 6], target = [0, 0, 0], box = 12, sky = '#CFE6FF', ground = '#C48A5A', hemi = 1.25, env = 0.25 } = {}) {
  scene.environment = E.envMap; scene.environmentIntensity = env;
  const r = lightRig(scene, { key: col, keyI: i, keyPos: pos, target, shadowBox: box, rimCol: '#FFFFFF', rimI: 0.4, sky, ground, hemiI: hemi });
  r.key.shadow.camera.far = 80; r.key.shadow.bias = -0.0006; r.key.shadow.camera.updateProjectionMatrix();
  return r;
}

export function lamp(light = true) {
  const g = new THREE.Group(), m = mat({ color: '#1B2420', metalness: 0.4, roughness: 0.4 });
  cyl(0.06, 0.09, 3.4, m, 0, 1.7, 0, g, 8);
  cyl(0.2, 0.12, 0.35, m, 0, 3.5, 0, g, 8);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), new THREE.MeshBasicMaterial({ color: '#FFE082' }));
  glass.position.y = 3.35; g.add(glass);
  if (light) {
    const pl = new THREE.PointLight('#FFAA33', 2.8, 14, 1.3); pl.position.y = 3.3; g.add(pl);
  }
  return g;
}

export function pole(h = 7) {
  const g = new THREE.Group(), w = mat({ color: '#3A2E26' });
  cyl(0.09, 0.12, h, w, 0, h / 2, 0, g, 8); box(1.8, 0.1, 0.1, w, 0, h - 0.6, 0, g); box(1.2, 0.08, 0.08, w, 0, h - 1.1, 0, g);
  [-0.8, -0.3, 0.3, 0.8].forEach((x) => cyl(0.03, 0.03, 0.12, mat({ color: '#8A9CA8' }), x, h - 0.5, 0, g, 6));
  return g;
}

export function wire(a, b, sag = 0.6, col = '#15151D') {
  const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20; const p = new THREE.Vector3().lerpVectors(a, b, t); p.y -= Math.sin(t * Math.PI) * sag; pts.push(p); }
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.015, 4), new THREE.MeshBasicMaterial({ color: col })); return m;
}

export function car(col = '#1E2530') {
  const g = new THREE.Group(), m = mat({ color: col, roughness: 0.4, metalness: 0.3 }), dark = mat({ color: '#111216', roughness: 0.6 });
  box(1.5, 0.5, 3.2, m, 0, 0.75, 0, g); box(1.3, 0.8, 1.4, m, 0, 1.4, -0.3, g);
  box(1.2, 0.5, 0.05, mat({ color: '#FFEAA0', roughness: 0.1 }), 0, 1.5, 0.41, g);
  [[-0.78, 1.1], [0.78, 1.1], [-0.78, -1.1], [0.78, -1.1]].forEach(([x, z]) => { const w = cyl(0.36, 0.36, 0.22, dark, x, 0.36, z, g, 16); w.rotation.z = Math.PI / 2; const hub = cyl(0.12, 0.12, 0.24, mat({ color: '#D9D2C2' }), x, 0.36, z, g, 10); hub.rotation.z = Math.PI / 2; });
  [-0.5, 0.5].forEach((x) => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: '#FFF3A8' })); l.position.set(x, 0.95, 1.62); g.add(l); });
  return g;
}

const SHOPS = [
  ['CAFÉ DE PARIS', '#1E3224', 'wood', '#F2C240'],
  ['HÔTEL DE CRILLON', '#3A2024', 'brick', '#8A2020'],
  ['FERRAILLE INDUSTRIELLE', '#302824', 'brick', '#E8C060'],
  ['BOULANGERIE', '#3E2A20', 'wood', '#FFFFFF'],
  ['LE FIGARO', '#202E44', 'wood', '#F2E6CF'],
  ['BANQUE DE PARIS', '#2A2632', 'brick', '#F2C240']
];

/** Parisian Night Avenue */
export function mainStreet(E, { len = 80, night = true, shops = SHOPS } = {}) {
  const buildings = [];
  const scene = new THREE.Scene();

  // Midnight Paris Sky
  sky(scene, { top: '#060914', horizon: '#121A30', ground: '#05070D', stars: true });

  // Glowing Moon in the Paris Night Sky
  const moon = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 16), new THREE.MeshBasicMaterial({ color: '#FFF6D8' }));
  moon.position.set(-60, 85, -160);
  scene.add(moon);
  const moonHalo = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), new THREE.MeshBasicMaterial({ color: '#FFEFA0', transparent: true, opacity: 0.18 }));
  moonHalo.position.copy(moon.position);
  scene.add(moonHalo);

  // Silvery Moonlight
  const sun = sunlight(scene, E, {
    col: '#A2C4F5', i: 1.3, pos: [-15, 26, -25], sky: '#182440', ground: '#0D121F', hemi: 0.65, env: 0.25
  });

  // Wet Parisian Night Cobblestone Road
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(8.5, len + 40),
    mat({ map: T.cobblestone('#222634', [2, (len + 40) / 4]), roughness: 0.45, metalness: 0.25 })
  );
  road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -len / 2 + 10); road.receiveShadow = true; scene.add(road);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(350, 350),
    mat({ color: '#0A0E18' })
  );
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; scene.add(ground);

  // Sidewalks & Period French Buildings
  [-1, 1].forEach((s) => {
    const walk = box(2.4, 0.18, len + 20, mat({ map: T.planks('#2B303D', [(len + 20) / 3, 1]), roughness: 0.6 }), s * 5.2, 0.09, -len / 2 + 5, scene);
    walk.material.map.rotation = Math.PI / 2;
    let z = 8, k = s > 0 ? 0 : 5;
    while (z > -len) {
      const [name, wall, kind, aw] = shops[k % shops.length];
      const w = 5.5 + rnd(k) * 2.0, h = 7.0 + rnd(k * 3) * 3.0; k++;
      const front = mat({ map: facade(name, { wall, kind, awning: aw, w, h, seed: k, night: true }) });
      const side = mat({ color: shade(wall, 0.7) });
      const b = new THREE.Mesh(new THREE.BoxGeometry(6, h, w), s < 0 ? [front, side, side, side, side, side] : [side, front, side, side, side, side]);
      b.position.set(s * 9.4, h / 2, z - w / 2); b.castShadow = b.receiveShadow = true; scene.add(b);
      buildings.push({ name, side: s, z: z - w / 2, w, h, x: s * 6.4 });
      z -= w + 0.15;
    }
    // Period Cast-Iron Street Lanterns along the walkway
    for (let zz = 0; zz > -len; zz -= 16) {
      const l = lamp(true); l.position.set(s * 4.3, 0.18, zz); scene.add(l);
    }
  });

  // NO crates or barrels blocking the sidewalk! Walkway is clean and spacious.
  const carsList = [];
  [[-2.2, -18, '#1A222D'], [2.2, -38, '#3A1E1E']].forEach(([x, z, c]) => {
    const v = car(c); v.position.set(x, 0, z); if (x < 0) v.rotation.y = Math.PI; scene.add(v); carsList.push(v);
  });

  return { scene, sun, people: [], cars: carsList, buildings };
}

/** Luxury Hotel de Crillon Suite - Mysterious Conspiratorial Night Meeting */
export function interior(E, { w = 8.5, depth = 7.5, h = 4.4, wall = '#4A151C', motif = '#6B202A', floor = '#2A1812', ceiling = '#150A0E' } = {}) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#08060A');
  scene.environment = E.envMap; scene.environmentIntensity = 0.25;

  // Dark Polished Parquet Floor
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, depth + 2), mat({ map: T.planks(floor, [w / 2.5, (depth + 2) / 2.5]), roughness: 0.35, metalness: 0.1 }));
  fl.rotation.x = -Math.PI / 2; fl.position.z = -depth / 2 + 1; fl.receiveShadow = true; scene.add(fl);

  const wp = (len) => mat({ map: T.wallpaper(wall, motif, [len / 1.4, h / 1.4]) });
  const wain = (len) => mat({ map: T.planks('#1C0E0A', [len / 2, 0.5]) });

  // Back wall with large arched window overlooking Paris at night
  const ww = 3.4, wh = 2.2, wy = 1.0;
  const back = new THREE.Group(); back.position.z = -depth; scene.add(back);
  box((w - ww) / 2, h, 0.2, wp((w - ww) / 2), -(w + ww) / 4, h / 2, 0, back);
  box((w - ww) / 2, h, 0.2, wp((w - ww) / 2), (w + ww) / 4, h / 2, 0, back);
  box(ww, wy, 0.2, wain(ww), 0, wy / 2, 0, back);
  box(ww, h - wy - wh, 0.2, wp(ww), 0, h - (h - wy - wh) / 2, 0, back);

  // Window view: dark night Paris sky with stars
  const viewPlane = new THREE.Mesh(new THREE.PlaneGeometry(ww * 2.2, wh * 2.2), new THREE.MeshBasicMaterial({ color: '#090E1F', toneMapped: false }));
  viewPlane.position.set(0, wy + wh / 2, -2.0); back.add(viewPlane);

  // Side walls
  [-1, 1].forEach((s) => {
    const sw = box(0.2, h, depth + 2, wp(depth + 2), s * w / 2, h / 2, -depth / 2 + 1, scene);
    sw.material.map.repeat.set((depth + 2) / 1.4, h / 1.4);
    box(0.24, 1.0, depth + 2, wain(depth + 2), s * (w / 2 - 0.02), 0.5, -depth / 2 + 1, scene);
  });

  // Ceiling
  box(w, 0.2, depth + 2, mat({ color: ceiling }), 0, h + 0.1, -depth / 2 + 1, scene);

  // Lighting: Conspiratorial Night Suite
  // Warm glowing chandelier and desk lamp
  const chandelier = new THREE.PointLight('#FFAA44', 3.8, 14, 1.2);
  chandelier.position.set(0.2, 3.4, -2.8); scene.add(chandelier);
  const chanGlow = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), new THREE.MeshBasicMaterial({ color: '#FFE082' }));
  chanGlow.position.copy(chandelier.position); scene.add(chanGlow);

  // Soft cool fill from the window
  const moonFill = new THREE.DirectionalLight('#7A9CE8', 1.0);
  moonFill.position.set(-1, 4, -depth - 4); moonFill.target.position.set(0, 1, -2);
  scene.add(moonFill, moonFill.target);
  scene.add(new THREE.HemisphereLight('#251E1C', '#100C0E', 0.6));

  return { scene, sun: { key: moonFill }, window: viewPlane, w, depth, h };
}

/** Meadow / Countryside Set - Night / Evening Option */
export function meadow(E, { night = true } = {}) {
  const scene = new THREE.Scene();
  sky(scene, { top: '#060914', horizon: '#121A30', ground: '#05070D', stars: true });
  const sun = sunlight(scene, E, {
    col: '#96B8E8', i: 1.4, pos: [-12, 22, -18], sky: '#182440', ground: '#0C101A', hemi: 0.65, box: 16
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(350, 350), mat({ color: '#0F1612', roughness: 0.8 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; scene.add(ground);
  return { scene, sun };
}
