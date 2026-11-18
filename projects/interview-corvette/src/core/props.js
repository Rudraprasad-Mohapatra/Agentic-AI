// 3D Props for the Red Corvette Job Interview Short
// Procedural Three.js: Shiny Red Corvette Sports Car, Executive Desk with Resume & Nameplate, Coffee Mug
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
 * 1. SHINY CHERRY-RED CORVETTE SPORTS CAR
 * Aerodynamic sports car body, tinted cockpit, rear spoiler, chrome wheels, glowing headlights
 * g.drift(t, driftK): zooms across desk and drifts to a stop!
 */
export function redCorvette() {
  const g = new THREE.Group();

  const carPaint = mat({ color: '#E51922', roughness: 0.15, metalness: 0.4 });
  const darkPaint = mat({ color: '#160305', roughness: 0.4 });
  const glassMat = mat({ color: '#152030', roughness: 0.08, metalness: 0.8 });
  const chromeMat = mat({ color: '#E8E8E8', roughness: 0.15, metalness: 0.95 });
  const tireMat = mat({ color: '#181818', roughness: 0.9 });
  const lightMat = new THREE.MeshBasicMaterial({ color: '#FFF8C0' });

  // Main lower chassis (scaled to tabletop luxury concept showpiece)
  box(0.44, 0.08, 0.88, carPaint, 0, 0.05, 0, g);
  // Hood slope
  box(0.42, 0.05, 0.34, carPaint, 0, 0.09, 0.24, g);
  // Rear deck / trunk
  box(0.42, 0.06, 0.28, carPaint, 0, 0.10, -0.28, g);

  // Cabin / Windshield
  box(0.35, 0.09, 0.32, glassMat, 0, 0.14, -0.04, g);
  // Roof
  box(0.33, 0.02, 0.24, carPaint, 0, 0.19, -0.05, g);

  // Rear Spoiler
  const spoiler = new THREE.Group();
  box(0.42, 0.02, 0.08, carPaint, 0, 0.17, -0.40, spoiler);
  cyl(0.012, 0.012, 0.08, darkPaint, -0.15, 0.13, -0.40, spoiler);
  cyl(0.012, 0.012, 0.08, darkPaint, 0.15, 0.13, -0.40, spoiler);
  g.add(spoiler);

  // Glowing Headlights
  const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.015), lightMat);
  hlL.position.set(-0.15, 0.07, 0.44);
  const hlR = hlL.clone();
  hlR.position.x = 0.15;
  g.add(hlL, hlR);

  // Wheels
  const wheel = (x, z) => {
    const wg = new THREE.Group();
    wg.position.set(x, 0.06, z);
    const t = cyl(0.06, 0.06, 0.045, tireMat, 0, 0, 0, wg, 16);
    t.rotation.z = Math.PI / 2;
    const rim = cyl(0.035, 0.035, 0.046, chromeMat, 0, 0, 0, wg, 8);
    rim.rotation.z = Math.PI / 2;
    g.add(wg);
    return wg;
  };
  wheel(-0.22, 0.27); wheel(0.22, 0.27);
  wheel(-0.22, -0.27); wheel(0.22, -0.27);

  // Drift animation
  g.drift = (t, k) => {
    const startX = 2.8, endX = 0.50;
    const curX = startX + (endX - startX) * k;
    g.position.x = curX;
    g.position.z = 0.12 + Math.sin(k * Math.PI) * 0.15;
    const targetRot = -Math.PI / 2 - 0.35;
    g.rotation.y = targetRot + (1 - k) * 0.75;
    g.position.y = 1.15 + Math.abs(Math.sin(k * 18)) * 0.012 * (1 - k);
  };

  return g;
}

/**
 * 2. EXECUTIVE INTERVIEW DESK WITH RESUME & NAMEPLATE
 */
export function executiveDesk() {
  const g = new THREE.Group();
  const mahogany = mat({ color: '#4A2810', roughness: 0.5 });
  const trimWood = mat({ color: '#2B1408', roughness: 0.7 });
  const brass = mat({ color: '#D4AF37', roughness: 0.3, metalness: 0.8 });

  // Main desk body
  box(2.6, 1.05, 1.1, mahogany, 0, 0.525, 0, g);
  // Polished desk top slab
  box(2.8, 0.08, 1.25, mat({ color: '#5C3317', roughness: 0.35 }), 0, 1.10, 0, g);
  // Side modesty panel
  box(2.4, 0.8, 0.05, trimWood, 0, 0.48, 0.48, g);

  // Gold Executive Nameplate: "HR DIRECTOR"
  const npTex = canvasTex('nameplate_tex', 256, 64, (c) => {
    c.fillStyle = '#1C1C24'; c.fillRect(0, 0, 256, 64);
    c.strokeStyle = '#D4AF37'; c.lineWidth = 4; c.strokeRect(4, 4, 248, 56);
    c.fillStyle = '#D4AF37'; c.font = '900 24px Inter'; c.textAlign = 'center';
    c.textBaseline = 'middle'; c.fillText('HR DIRECTOR', 128, 32);
  });
  const nameplate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.08), brass);
  nameplate.position.set(-0.65, 1.18, 0.38);
  const npFace = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.1), new THREE.MeshBasicMaterial({ map: npTex }));
  npFace.position.set(0, 0, 0.042);
  nameplate.add(npFace);
  g.add(nameplate);

  // Candidate Resume Sheet
  const resTex = canvasTex('resume_tex', 256, 320, (c) => {
    c.fillStyle = '#FFFDF7'; c.fillRect(0, 0, 256, 320);
    c.strokeStyle = '#2B1408'; c.lineWidth = 4; c.strokeRect(8, 8, 240, 304);
    c.fillStyle = '#1A1A24'; c.font = '900 22px Inter'; c.fillText('RESUME: RAHUL', 20, 42);
    c.fillStyle = '#2B5EAA'; c.font = '800 16px Inter'; c.fillText('TOP ENGINEERING COLLEGE', 20, 68);
    // Fake text lines
    c.fillStyle = '#A0A0A0';
    for (let i = 0; i < 7; i++) c.fillRect(20, 95 + i * 22, 216, 6);
    // Huge RED Stamp: "EXPERIENCE: 0"
    c.strokeStyle = '#D8343F'; c.lineWidth = 5;
    c.strokeRect(16, 230, 224, 60);
    c.fillStyle = '#D8343F'; c.font = '900 20px Inter'; c.textAlign = 'center';
    c.fillText('EXPERIENCE: 0 YEARS', 128, 268);
  });
  const resume = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), new THREE.MeshStandardMaterial({ map: resTex, roughness: 0.8 }));
  resume.rotation.x = -Math.PI / 2;
  resume.rotation.z = 0.12;
  resume.position.set(0.45, 1.15, 0.15);
  g.add(resume);
  g.resume = resume;

  return g;
}

/**
 * 3. COFFEE MUG
 */
export function coffeeMug() {
  const g = new THREE.Group();
  const ceramic = mat({ color: '#2B5EAA', roughness: 0.4 });
  cyl(0.12, 0.09, 0.32, ceramic, 0, 0.16, 0, g, 16);
  // Mug handle
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 16), ceramic);
  handle.position.set(0.12, 0.16, 0);
  g.add(handle);
  return g;
}

/**
 * 4. EXECUTIVE LEATHER SWIVEL CHAIR
 */
export function executiveChair() {
  const g = new THREE.Group();
  const leather = mat({ color: '#1A1B22', roughness: 0.35 });
  const chrome = mat({ color: '#E0E0E0', roughness: 0.2, metalness: 0.9 });
  // Base: 5-star chrome legs
  cyl(0.04, 0.04, 0.45, chrome, 0, 0.225, 0, g, 12);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = box(0.35, 0.03, 0.04, chrome, Math.cos(a) * 0.18, 0.04, Math.sin(a) * 0.18, g);
    leg.rotation.y = -a;
    cyl(0.03, 0.03, 0.02, mat({ color: '#111' }), Math.cos(a) * 0.34, 0.03, Math.sin(a) * 0.34, g, 8);
  }
  // Seat cushion
  box(0.58, 0.09, 0.56, leather, 0, 0.48, 0, g);
  // High backrest
  const back = box(0.54, 0.68, 0.08, leather, 0, 0.84, -0.24, g);
  back.rotation.x = 0.08;
  // Headrest
  box(0.38, 0.18, 0.08, leather, 0, 1.22, -0.29, g);
  // Chrome & leather armrests
  [-1, 1].forEach((s) => {
    cyl(0.02, 0.02, 0.22, chrome, s * 0.31, 0.60, 0, g, 8);
    box(0.08, 0.03, 0.32, leather, s * 0.31, 0.71, 0, g);
  });
  return g;
}

/**
 * 5. ULTRA-SLIM EXECUTIVE LAPTOP
 */
export function executiveLaptop() {
  const g = new THREE.Group();
  const aluminum = mat({ color: '#88929A', roughness: 0.25, metalness: 0.75 });
  const screenLit = new THREE.MeshBasicMaterial({ color: '#EBF4FA' });
  // Base chassis
  box(0.38, 0.015, 0.26, aluminum, 0, 0.008, 0, g);
  // Keyboard indent
  box(0.32, 0.005, 0.14, mat({ color: '#1C1E22' }), 0, 0.016, -0.02, g);
  // Trackpad
  box(0.12, 0.002, 0.08, mat({ color: '#77828A' }), 0, 0.016, 0.08, g);
  // Display lid tilted back
  const lid = new THREE.Group();
  lid.position.set(0, 0.015, -0.13);
  box(0.38, 0.25, 0.012, aluminum, 0, 0.125, 0, lid);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.22), screenLit);
  screen.position.set(0, 0.125, 0.007);
  lid.add(screen);
  lid.rotation.x = 0.32;
  g.add(lid);
  g.close = (k) => {
    // k: 0 (open) to 1 (shut)
    lid.rotation.x = 0.32 + k * (Math.PI / 2 + 0.02 - 0.32);
    screen.visible = k < 0.95;
  };
  return g;
}

/**
 * 6. CARTOON SMOKE POOF CLOUD (for Corvette vanishing gag)
 */
export function poofCloud() {
  const g = new THREE.Group();
  const matP = mat({ color: '#E8E8F0', roughness: 0.9, transparent: true, opacity: 0.9 });
  const puffs = [];
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), matP);
    const a = (i / 8) * Math.PI * 2;
    p.userData = { vx: Math.cos(a) * 0.45, vy: 0.15 + (i % 3) * 0.12, vz: Math.sin(a) * 0.45 };
    g.add(p);
    puffs.push(p);
  }
  g.animate = (k) => {
    g.visible = k > 0.01 && k < 0.99;
    const s = 0.3 + k * 1.6;
    g.scale.set(s, s * 0.8, s);
    matP.opacity = Math.max(0, 1 - k * 1.15);
    puffs.forEach((p) => {
      p.position.set(p.userData.vx * k, p.userData.vy * k, p.userData.vz * k);
    });
  };
  g.visible = false;
  return g;
}

/**
 * 7. $1.50 CITY BUS PASS (comic replacement for $100k Corvette)
 */
export function busPass() {
  const g = new THREE.Group();
  const tex = canvasTex('bus_pass_tex', 256, 160, (c) => {
    c.fillStyle = '#E58A2B'; c.fillRect(0, 0, 256, 160);
    c.fillStyle = '#111827'; c.fillRect(0, 0, 256, 42);
    c.fillStyle = '#FFFFFF'; c.font = '900 20px Inter'; c.fillText('CITY BUS PASS', 16, 28);
    c.fillStyle = '#FFFFFF'; c.font = '800 15px Inter'; c.fillText('FARE: $1.50 (UNPAID)', 16, 80);
    c.fillStyle = '#111827'; c.font = '700 13px Inter'; c.fillText('TRANSIT AUTHORITY', 16, 115);
    c.strokeStyle = '#FFFFFF'; c.lineWidth = 3; c.strokeRect(8, 8, 240, 144);
  });
  const card = new THREE.Mesh(new THREE.PlaneGeometry(0.40, 0.24), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 }));
  card.rotation.x = -Math.PI / 2;
  card.rotation.z = -0.25;
  card.position.y = 0.005;
  g.add(card);
  g.visible = false;
  return g;
}

/**
 * 8. DYNAMIC RUBBER STAMP: "EXPERIENCE: 0 DAYS"
 */
export function rubberStamp() {
  const g = new THREE.Group();
  const stampTex = canvasTex('stamp_0_days_tex', 384, 160, (c) => {
    c.clearRect(0, 0, 384, 160);
    c.save();
    c.translate(192, 80);
    c.rotate(-0.14);
    c.strokeStyle = '#D81E28';
    c.lineWidth = 8;
    c.strokeRect(-180, -65, 360, 130);
    c.lineWidth = 3;
    c.strokeRect(-172, -57, 344, 114);
    c.fillStyle = '#D81E28';
    c.font = '900 34px Inter';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('EXPERIENCE: 0 DAYS', 0, -12);
    c.font = '900 24px Inter';
    c.fillText('SALARY: $125,000 (?)', 0, 30);
    c.restore();
  });
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.24),
    new THREE.MeshBasicMaterial({ map: stampTex, transparent: true, alphaTest: 0.05, opacity: 0.95 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.rotation.z = 0.05;
  plane.position.set(0.40, 1.155, 0.15);
  g.add(plane);
  g.visible = false;
  g.slam = (k) => {
    g.visible = k > 0;
    const s = 1.0 + (1 - k) * 3.0;
    plane.scale.set(s, s, s);
    plane.position.y = 1.155 + (1 - k) * 0.7;
  };
  return g;
}

/**
 * 9. CANDIDATE DELUSION PERK VISUALIZATION
 * 5 comic badges ($125,000 Cash, Company Car, Medical Expense, Dental Expense, Red Corvette)
 * + 1 Brain Calculation / Jackpot badge
 * Animated during candidate's astonishment / 1-second calculation pause!
 */
export function perkThoughts() {
  const g = new THREE.Group();

  const createBadge = (id, w, h, drawFn) => {
    const tex = canvasTex(id, 512, 280, drawFn);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), badgeMat);
    return mesh;
  };

  // 1. $125,000 Cash Salary Badge (top-left of screen -> +X)
  const bMoney = createBadge('badge_money_tex', 0.36, 0.19, (c) => {
    c.clearRect(0, 0, 512, 280);
    c.fillStyle = '#064E3B';
    c.beginPath(); c.roundRect(8, 8, 496, 264, 28); c.fill();
    c.strokeStyle = '#10B981'; c.lineWidth = 10; c.stroke();
    c.strokeStyle = '#FBBF24'; c.lineWidth = 4;
    c.beginPath(); c.roundRect(20, 20, 472, 240, 20); c.stroke();
    c.fillStyle = '#FBBF24'; c.font = '900 28px Inter'; c.textAlign = 'center';
    c.fillText('💰 STARTING CASH', 256, 62);
    c.fillStyle = '#FFFFFF'; c.font = '900 56px Inter';
    c.fillText('$125,000', 256, 138);
    c.fillStyle = '#6EE7B7'; c.font = '800 24px Inter';
    c.fillText('PER YEAR • COCKY ASK', 256, 208);
  });
  bMoney.userData = { targetPos: new THREE.Vector3(-0.04, 1.76, 0.90), startTime: 28.35 };
  g.add(bMoney);

  // 2. Brand New Company Car Badge (top-right of screen -> -X)
  const bCar = createBadge('badge_car_tex', 0.36, 0.19, (c) => {
    c.clearRect(0, 0, 512, 280);
    c.fillStyle = '#1E3A8A';
    c.beginPath(); c.roundRect(8, 8, 496, 264, 28); c.fill();
    c.strokeStyle = '#3B82F6'; c.lineWidth = 10; c.stroke();
    c.strokeStyle = '#93C5FD'; c.lineWidth = 4;
    c.beginPath(); c.roundRect(20, 20, 472, 240, 20); c.stroke();
    c.fillStyle = '#93C5FD'; c.font = '900 28px Inter'; c.textAlign = 'center';
    c.fillText('🚗 COMPANY VEHICLE', 256, 62);
    c.fillStyle = '#FFFFFF'; c.font = '900 50px Inter';
    c.fillText('BRAND NEW CAR', 256, 138);
    c.fillStyle = '#BFDBFE'; c.font = '800 24px Inter';
    c.fillText('LEASED EVERY 2 YRS', 256, 208);
  });
  bCar.userData = { targetPos: new THREE.Vector3(-0.56, 1.76, 0.90), startTime: 28.60 };
  g.add(bCar);

  // 3. Full Medical Expense Badge (mid-left of screen -> +X)
  const bMed = createBadge('badge_med_tex', 0.36, 0.19, (c) => {
    c.clearRect(0, 0, 512, 280);
    c.fillStyle = '#881337';
    c.beginPath(); c.roundRect(8, 8, 496, 264, 28); c.fill();
    c.strokeStyle = '#F43F5E'; c.lineWidth = 10; c.stroke();
    c.strokeStyle = '#FDA4AF'; c.lineWidth = 4;
    c.beginPath(); c.roundRect(20, 20, 472, 240, 20); c.stroke();
    c.fillStyle = '#FDA4AF'; c.font = '900 28px Inter'; c.textAlign = 'center';
    c.fillText('🏥 MEDICAL EXPENSE', 256, 62);
    c.fillStyle = '#FFFFFF'; c.font = '900 52px Inter';
    c.fillText('100% COVERED', 256, 138);
    c.fillStyle = '#FECDD3'; c.font = '800 24px Inter';
    c.fillText('EXPENSE: $0', 256, 208);
  });
  bMed.userData = { targetPos: new THREE.Vector3(-0.04, 1.48, 0.90), startTime: 28.85 };
  g.add(bMed);

  // 4. Full Dental Expense Badge (mid-right of screen -> -X)
  const bDental = createBadge('badge_dental_tex', 0.36, 0.19, (c) => {
    c.clearRect(0, 0, 512, 280);
    c.fillStyle = '#0E7490';
    c.beginPath(); c.roundRect(8, 8, 496, 264, 28); c.fill();
    c.strokeStyle = '#06B6D4'; c.lineWidth = 10; c.stroke();
    c.strokeStyle = '#67E8F9'; c.lineWidth = 4;
    c.beginPath(); c.roundRect(20, 20, 472, 240, 20); c.stroke();
    c.fillStyle = '#67E8F9'; c.font = '900 28px Inter'; c.textAlign = 'center';
    c.fillText('🦷 DENTAL EXPENSE', 256, 62);
    c.fillStyle = '#FFFFFF'; c.font = '900 52px Inter';
    c.fillText('FULL COVERAGE', 256, 138);
    c.fillStyle = '#A5F3FC'; c.font = '800 24px Inter';
    c.fillText('EXPENSE: $0', 256, 208);
  });
  bDental.userData = { targetPos: new THREE.Vector3(-0.56, 1.48, 0.90), startTime: 29.10 };
  g.add(bDental);

  // 5. Shiny Red Corvette Badge (top-center)
  const bCorvette = createBadge('badge_corvette_tex', 0.44, 0.22, (c) => {
    c.clearRect(0, 0, 512, 280);
    const grad = c.createLinearGradient(0, 0, 512, 280);
    grad.addColorStop(0, '#991B1B'); grad.addColorStop(1, '#DC2626');
    c.fillStyle = grad;
    c.beginPath(); c.roundRect(8, 8, 496, 264, 32); c.fill();
    c.strokeStyle = '#F59E0B'; c.lineWidth = 12; c.stroke();
    c.strokeStyle = '#FEF08A'; c.lineWidth = 4;
    c.beginPath(); c.roundRect(22, 22, 468, 236, 22); c.stroke();
    c.fillStyle = '#FEF08A'; c.font = '900 30px Inter'; c.textAlign = 'center';
    c.fillText('🏎️ RED CORVETTE!! 🔥', 256, 64);
    c.fillStyle = '#FFFFFF'; c.font = '900 56px Inter';
    c.fillText('FREE LEASE!', 256, 140);
    c.fillStyle = '#FDE68A'; c.font = '800 24px Inter';
    c.fillText('THE ULTIMATE FLEX', 256, 212);
  });
  bCorvette.userData = { targetPos: new THREE.Vector3(-0.30, 2.02, 0.88), startTime: 29.35 };
  g.add(bCorvette);

  const badges = [bMoney, bCar, bMed, bDental, bCorvette];

  g.animate = (t) => {
    if (t < 28.30 || t > 33.20) {
      g.visible = false;
      return;
    }
    g.visible = true;
    const outK = t > 32.90 ? Math.max(0, 1 - (t - 32.90) / 0.28) : 1;

    badges.forEach((b, idx) => {
      const st = b.userData.startTime;
      if (t < st) {
        b.visible = false;
        b.scale.set(0, 0, 0);
        return;
      }
      b.visible = true;
      const elapsed = t - st;
      const p = Math.min(1, elapsed / 0.22);
      const spring = Math.sin(p * Math.PI * 0.5) + 0.22 * Math.sin(p * Math.PI);
      const s = spring * outK;
      b.scale.set(s, s, s);

      const bob = Math.sin(t * 3.5 + idx * 1.1) * 0.012;
      b.position.copy(b.userData.targetPos);
      b.position.y += bob;
      b.rotation.set(0, Math.PI, 0);
    });
  };

  g.visible = false;
  return g;
}
