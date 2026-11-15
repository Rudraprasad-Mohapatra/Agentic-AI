// 3D props for the Aron Ralston Survival story. Each returns a THREE.Group (base at y = 0).
import * as THREE from 'three';
import { T, mat, canvasTex } from './world.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (parent) parent.add(b); return b; };
const cyl = (r1, r2, h, m, x, y, z, parent, seg = 12) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); c.position.set(x, y, z); c.castShadow = c.receiveShadow = true; if (parent) parent.add(c); return c; };
const INK = '#1F1C33';

/** A hiking backpack with straps and a sleeping pad on top */
export function backpack() {
  const g = new THREE.Group(), m = mat({ color: '#3A6E2E' }), strap = mat({ color: '#2A4E1E' });
  box(1.0, 1.4, 0.7, m, 0, 0.7, 0, g);
  box(0.3, 0.06, 0.5, strap, -0.35, 1.2, 0.36, g);
  box(0.3, 0.06, 0.5, strap, 0.35, 1.2, 0.36, g);
  // sleeping pad roll on top
  cyl(0.18, 0.18, 1.0, mat({ color: '#5A8FD4' }), 0, 1.55, 0, g, 12);
  // buckles
  box(0.12, 0.12, 0.05, mat({ color: '#C9A13B' }), -0.35, 0.3, 0.38, g);
  box(0.12, 0.12, 0.05, mat({ color: '#C9A13B' }), 0.35, 0.3, 0.38, g);
  return g;
}

/** Water bottle - cylindrical sport bottle */
export function waterBottle(full = true) {
  const g = new THREE.Group();
  const bodyCol = full ? '#3A7EC8' : '#6A6A6A';
  cyl(0.12, 0.12, 0.6, mat({ color: bodyCol, roughness: 0.3 }), 0, 0.3, 0, g, 16);
  cyl(0.08, 0.08, 0.1, mat({ color: '#222' }), 0, 0.65, 0, g, 16);
  if (full) {
    // water level visible
    cyl(0.11, 0.11, 0.35, mat({ color: '#1A5EA8', transparent: true, opacity: 0.5 }), 0, 0.22, 0, g, 16);
  }
  return g;
}

/** Pocket knife - open blade style */
export function pocketKnife() {
  const g = new THREE.Group(), iron = mat({ color: '#8A8A8A', metalness: 0.5, roughness: 0.3 }), handle = mat({ color: '#8B2020' });
  box(0.08, 0.5, 0.15, handle, 0, 0.25, 0, g);
  // blade
  const blade = new THREE.Shape();
  blade.moveTo(0, 0); blade.lineTo(0.04, 0.55); blade.lineTo(0, 0.6); blade.lineTo(-0.04, 0.55); blade.lineTo(0, 0);
  const bladeM = new THREE.Mesh(new THREE.ExtrudeGeometry(blade, { depth: 0.02, bevelEnabled: false }), iron);
  bladeM.position.set(-0.01, 0.5, -0.01); bladeM.castShadow = true; g.add(bladeM);
  return g;
}

/** Large boulder - rough rock */
export function boulder(size = 2.0) {
  const g = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(size, 1);
  // Displace vertices for rough look
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const s = 0.85 + rnd(i) * 0.3;
    pos.setXYZ(i, pos.getX(i) * s, pos.getY(i) * s, pos.getZ(i) * s);
  }
  geo.computeVertexNormals();
  const rock = new THREE.Mesh(geo, mat({ color: '#6A5A48', roughness: 0.95 }));
  rock.castShadow = rock.receiveShadow = true;
  g.add(rock);
  return g;
}

/** Rope coil */
export function ropeCoil() {
  const g = new THREE.Group();
  const ropeMat = mat({ color: '#D4822A', roughness: 0.8 });
  // Torus for coiled rope
  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 24), ropeMat);
  torus.rotation.x = Math.PI / 2; torus.position.y = 0.3; torus.castShadow = true; g.add(torus);
  const torus2 = torus.clone(); torus2.position.y = 0.35; g.add(torus2);
  const torus3 = torus.clone(); torus3.position.y = 0.4; g.add(torus3);
  return g;
}

/** Simple helicopter */
export function helicopter() {
  const g = new THREE.Group();
  const body = mat({ color: '#B8461A', roughness: 0.5 });
  const dark = mat({ color: '#2A2A2A' });
  // fuselage
  box(1.2, 1.0, 3.0, body, 0, 0, 0, g);
  // cockpit glass
  box(1.1, 0.6, 0.8, mat({ color: '#88C8E8', roughness: 0.1, metalness: 0.3 }), 0, 0.3, 1.5, g);
  // tail boom
  box(0.3, 0.3, 2.5, body, 0, 0.2, -2.5, g);
  // tail rotor fin
  box(0.05, 0.8, 0.5, dark, 0, 0.5, -3.7, g);
  // skids
  [-0.6, 0.6].forEach(x => {
    box(0.06, 0.06, 2.0, dark, x, -0.7, 0, g);
    cyl(0.04, 0.04, 0.5, dark, x, -0.45, 0.6, g);
    cyl(0.04, 0.04, 0.5, dark, x, -0.45, -0.6, g);
  });
  // main rotor
  const rotor = new THREE.Group(); rotor.position.set(0, 0.7, 0);
  cyl(0.08, 0.08, 0.3, dark, 0, 0.15, 0, rotor);
  [-1, 1].forEach(s => box(4.0, 0.04, 0.2, dark, s * 2.0, 0.3, 0, rotor));
  g.add(rotor);
  g.rotor = rotor;
  g.update = (t) => { rotor.rotation.y = t * 25; };
  return g;
}

/** Canyon wall section - tall red sandstone slab */
export function canyonWall({ w = 3, h = 15, d = 1.5, col = '#B86B3A', seed = 0 } = {}) {
  const g = new THREE.Group();
  const wallTex = canvasTex('cwall' + col + seed + w + h, 512, 512, (c) => {
    c.fillStyle = col; c.fillRect(0, 0, 512, 512);
    // Sandstone layers
    for (let y = 0; y < 512; y += 28 + rnd(seed + y) * 20) {
      const shade = rnd(seed * 3 + y * 7);
      c.fillStyle = `rgba(${shade > 0.5 ? '180,100,50' : '140,80,40'}, ${0.3 + shade * 0.3})`;
      c.fillRect(0, y, 512, 14 + rnd(seed + y * 3) * 18);
    }
    // Erosion marks
    for (let i = 0; i < 40; i++) {
      c.strokeStyle = `rgba(90,60,30, ${0.15 + rnd(i * 11) * 0.15})`;
      c.lineWidth = 2 + rnd(i) * 4;
      c.beginPath();
      c.moveTo(rnd(i * 2) * 512, rnd(i * 3) * 512);
      c.lineTo(rnd(i * 5) * 512, rnd(i * 7) * 512);
      c.stroke();
    }
  }, [w / 3, h / 3]);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat({ map: wallTex, roughness: 0.95 }));
  wall.position.y = h / 2; wall.castShadow = wall.receiveShadow = true;
  g.add(wall);
  return g;
}

/** Desert butte silhouette - distant mesa */
export function butte({ w = 8, h = 6, d = 5, col = '#8B5E3C' } = {}) {
  const g = new THREE.Group();
  // Flat-topped mesa shape
  box(w, h * 0.7, d, mat({ color: col, roughness: 0.9 }), 0, h * 0.35, 0, g);
  // Stepped top
  box(w * 0.8, h * 0.15, d * 0.9, mat({ color: '#9A6B45', roughness: 0.9 }), 0, h * 0.78, 0, g);
  box(w * 0.6, h * 0.15, d * 0.7, mat({ color: '#A87A52', roughness: 0.9 }), 0, h * 0.93, 0, g);
  return g;
}

/** Summit flag / marker */
export function summitFlag() {
  const g = new THREE.Group();
  cyl(0.05, 0.05, 2.5, mat({ color: '#5A4030' }), 0, 1.25, 0, g, 6);
  // Flag
  const flagTex = canvasTex('sflag', 256, 128, (c) => {
    const gr = c.createLinearGradient(0, 0, 256, 0);
    gr.addColorStop(0, '#E84040'); gr.addColorStop(1, '#C83030');
    c.fillStyle = gr; c.fillRect(0, 0, 256, 128);
    c.fillStyle = '#FFFFFF'; c.font = '900 48px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('59', 128, 64);
  });
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), mat({ map: flagTex, side: THREE.DoubleSide }));
  flag.position.set(0.4, 2.2, 0); flag.castShadow = true; g.add(flag);
  return g;
}
