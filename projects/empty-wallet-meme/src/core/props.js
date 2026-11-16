// 3D Props for the Empty Wallet Meme Short
// Procedural Three.js meshes: Bifold Wallet (with Hinge & Spiderweb), Winged Dollar Bill, Store Counter
import * as THREE from 'three';
import { T, mat, canvasTex } from './world.js';

const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  b.position.set(x, y, z);
  b.castShadow = b.receiveShadow = true;
  if (parent) parent.add(b);
  return b;
};

const cyl = (r1, r2, h, m, x, y, z, parent, seg = 16) => {
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m);
  c.position.set(x, y, z);
  c.castShadow = c.receiveShadow = true;
  if (parent) parent.add(c);
  return c;
};

/**
 * 1. REALISTIC LEATHER BIFOLD WALLET WITH FUNCTIONAL HINGE & PROCEDURAL SPIDERWEB
 * g.setOpen(k): 0.0 = completely folded closed, 1.0 = wide open (180 deg)
 */
export function bifoldWallet() {
  const g = new THREE.Group();
  const leatherMat = mat({ color: '#5C3317', roughness: 0.65, metalness: 0.1 });
  const innerMat = mat({ color: '#3A1E0C', roughness: 0.85 });
  const stitchMat = mat({ color: '#C9A13B', roughness: 0.4 });

  // Right flap (fixed base)
  const rightFlap = new THREE.Group();
  box(0.60, 0.03, 0.85, leatherMat, 0.30, 0, 0, rightFlap);
  box(0.56, 0.02, 0.81, innerMat, 0.30, 0.018, 0, rightFlap);
  // Gold card slot edges
  box(0.48, 0.015, 0.04, stitchMat, 0.30, 0.028, 0.15, rightFlap);
  box(0.48, 0.015, 0.04, stitchMat, 0.30, 0.028, -0.05, rightFlap);
  box(0.48, 0.015, 0.04, stitchMat, 0.30, 0.028, -0.25, rightFlap);
  g.add(rightFlap);

  // Left flap (hinges around x = 0)
  const leftHinge = new THREE.Group();
  const leftFlap = new THREE.Group();
  box(0.60, 0.03, 0.85, leatherMat, -0.30, 0, 0, leftFlap);
  box(0.56, 0.02, 0.81, innerMat, -0.30, 0.018, 0, leftFlap);
  // Left side card slots
  box(0.48, 0.015, 0.04, stitchMat, -0.30, 0.028, 0.15, leftFlap);
  box(0.48, 0.015, 0.04, stitchMat, -0.30, 0.028, -0.05, leftFlap);
  box(0.48, 0.015, 0.04, stitchMat, -0.30, 0.028, -0.25, leftFlap);
  leftHinge.add(leftFlap);
  g.add(leftHinge);

  // Procedural Spiderweb Texture inside the fold
  const webTex = canvasTex('spiderweb_tex', 512, 512, (c) => {
    c.clearRect(0, 0, 512, 512);
    c.strokeStyle = 'rgba(240, 245, 255, 0.9)';
    c.lineWidth = 3.5;
    // Radial anchor lines
    const cx = 256, cy = 256;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + Math.cos(a) * 230, cy + Math.sin(a) * 230);
      c.stroke();
    }
    // Spiral concentric web arcs
    [40, 85, 135, 185, 230].forEach((r) => {
      c.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += Math.PI / 8) {
        // slight inward sag for realistic web tension
        const sag = r * 0.92;
        const x = cx + Math.cos(a) * sag, y = cy + Math.sin(a) * sag;
        if (a === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath();
      c.stroke();
    });
    // Tiny little cartoon spider in center
    c.fillStyle = '#1A1A24';
    c.beginPath(); c.arc(cx, cy, 14, 0, 7); c.fill(); // body
    c.beginPath(); c.arc(cx + 8, cy - 8, 8, 0, 7); c.fill(); // head
    // legs
    c.strokeStyle = '#1A1A24'; c.lineWidth = 3;
    [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
      c.beginPath(); c.moveTo(cx + sx * 10, cy + sy * 6);
      c.lineTo(cx + sx * 26, cy + sy * 14 - 6);
      c.lineTo(cx + sx * 34, cy + sy * 20);
      c.stroke();
    });
  });

  const webMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.55),
    new THREE.MeshBasicMaterial({ map: webTex, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
  );
  webMesh.rotation.x = -Math.PI / 2;
  webMesh.position.set(0, 0.035, 0);
  g.add(webMesh);

  // Set opening animation
  g.setOpen = (k) => {
    // 0 = folded shut, 1 = opened flat
    const angle = (1 - k) * Math.PI * 0.95;
    leftHinge.rotation.z = angle;
    // Web only stretches and shows when opened
    webMesh.scale.set(Math.max(0.01, k), 1, 1);
    webMesh.material.opacity = Math.max(0, (k - 0.15) * 1.2);
  };
  g.setOpen(0);

  return g;
}

/**
 * 2. WINGED DOLLAR BILL (FLUTTERS & FLIES AWAY)
 * g.update(t, flightK): animates wing flapping, bank wobbles, and upward flight
 */
export function wingedDollar() {
  const g = new THREE.Group();

  // Green Dollar Bill
  const dollarTex = canvasTex('dollar_bill_tex', 512, 256, (c) => {
    c.fillStyle = '#78A86B'; c.fillRect(0, 0, 512, 256);
    c.strokeStyle = '#1B3D1B'; c.lineWidth = 10; c.strokeRect(12, 12, 488, 232);
    // Ornamental oval
    c.strokeStyle = '#2B5E28'; c.lineWidth = 6;
    c.beginPath(); c.ellipse(256, 128, 110, 80, 0, 0, 7); c.stroke();
    // Currency symbol
    c.fillStyle = '#1B3D1B'; c.font = '900 84px Inter, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('$', 256, 128);
    // Corner numerals
    c.font = '900 48px Inter, sans-serif';
    c.fillText('1', 48, 52); c.fillText('1', 464, 52);
    c.fillText('1', 48, 204); c.fillText('1', 464, 204);
  });

  const bill = new THREE.Mesh(
    new THREE.PlaneGeometry(0.44, 0.22),
    new THREE.MeshStandardMaterial({ map: dollarTex, side: THREE.DoubleSide, roughness: 0.7 })
  );
  bill.rotation.x = -0.3;
  g.add(bill);

  // Feathered Angelic Wings (scaled to fit 9:16 vertical mobile frame)
  const wingMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.35, side: THREE.DoubleSide });
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.quadraticCurveTo(0.1, 0.22, 0.22, 0.25);
  wingShape.quadraticCurveTo(0.16, 0.10, 0.20, 0.0);
  wingShape.quadraticCurveTo(0.12, -0.04, 0, 0);

  const wingGeo = new THREE.ShapeGeometry(wingShape);
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-0.22, 0.02, 0);
  leftWing.rotation.y = Math.PI;

  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.set(0.22, 0.02, 0);

  g.add(leftWing, rightWing);

  // Flight update
  g.update = (t, flightK = 0) => {
    // Rapid wing flap (approx 18 Hz)
    const flap = Math.sin(t * 22) * 0.85;
    leftWing.rotation.z = -flap;
    rightWing.rotation.z = flap;

    // Gentle aerodynamic wobble
    bill.rotation.z = Math.sin(t * 8) * 0.18;

    // Starts at wallet level y = 1.35 and ascends smoothly
    g.position.y = 1.32 + flightK * 1.6;
    g.position.x = Math.sin(flightK * Math.PI * 1.5) * 0.25;
    g.position.z = 0.35 - flightK * 0.25;
    g.rotation.y = Math.sin(t * 3) * 0.3;
  };

  return g;
}

/**
 * 3. STORE CHECKOUT COUNTER WITH CASH REGISTER
 */
export function storeCounter() {
  const g = new THREE.Group();
  const wood = mat({ color: '#8B5A2B', roughness: 0.6 });
  const metal = mat({ color: '#4A5568', metalness: 0.5, roughness: 0.3 });
  const gold = mat({ color: '#D4AF37', metalness: 0.7, roughness: 0.25 });

  // Main counter desk
  box(2.4, 1.1, 0.9, wood, 0, 0.55, 0, g);
  // Counter top slab
  box(2.6, 0.08, 1.0, mat({ color: '#D2B48C', roughness: 0.4 }), 0, 1.14, 0, g);

  // Vintage Cash Register
  const reg = new THREE.Group();
  reg.position.set(0.65, 1.18, 0);
  box(0.55, 0.18, 0.55, metal, 0, 0.09, 0, reg); // base drawer
  box(0.48, 0.35, 0.42, gold, 0, 0.35, -0.05, reg); // register body
  cyl(0.04, 0.04, 0.12, metal, 0.28, 0.35, 0, reg); // side crank handle
  // pop-up price tab
  box(0.24, 0.12, 0.02, mat({ color: '#FFF' }), 0, 0.6, -0.05, reg);
  g.add(reg);

  return g;
}
