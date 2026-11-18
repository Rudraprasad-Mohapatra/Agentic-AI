// 3D Props for the Earless Job Interview Short
// Procedural Three.js: Executive Desk with Nameplate, Rubber Stamp, Laptop, Coffee Mug, Deduction Thought Bubble
import * as THREE from 'three';
import { mat, canvasTex } from './world.js';

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
 * 1. EXECUTIVE INTERVIEW DESK WITH RESUME & NAMEPLATE
 */
export function executiveDesk() {
  const g = new THREE.Group();
  const mahogany = mat({ color: '#4A2810', roughness: 0.5 });
  const trimWood = mat({ color: '#2B1408', roughness: 0.7 });
  const brass = mat({ color: '#D4AF37', roughness: 0.3, metalness: 0.8 });

  // Main desktop
  const top = box(3.2, 0.12, 1.6, mahogany, 0, 1.08, 0, g);
  box(3.24, 0.04, 1.64, trimWood, 0, 1.04, 0, g);

  // Modern angled solid executive legs
  box(0.18, 1.02, 1.4, mahogany, -1.35, 0.51, 0, g);
  box(0.18, 1.02, 1.4, mahogany, 1.35, 0.51, 0, g);
  box(2.5, 0.72, 0.08, mahogany, 0, 0.66, -0.3, g);

  // Leather writing pad
  const padMat = mat({ color: '#1A1816', roughness: 0.85 });
  box(1.2, 0.015, 0.7, padMat, 0.0, 1.145, 0.05, g);

  // Brass Nameplate: "MR. STERLING / SENIOR PARTNER"
  const npBase = box(0.42, 0.05, 0.09, mahogany, -0.95, 1.15, 0.45, g);
  const npMat = mat({ color: '#E2B842', roughness: 0.2, metalness: 0.9 });
  const npFace = box(0.38, 0.06, 0.015, npMat, -0.95, 1.17, 0.49, g);
  npFace.rotation.x = -0.25;

  // Candidate Resumes with Red REJECTED Stamp imprint
  const resumeTex = canvasTex('resume_paper_tex', 512, 680, (c, cw, ch) => {
    c.fillStyle = '#FDFDFD'; c.fillRect(0, 0, cw, ch);
    c.strokeStyle = '#CBD5E1'; c.lineWidth = 4; c.strokeRect(10, 10, cw - 20, ch - 20);
    c.fillStyle = '#0F172A'; c.font = '900 32px Inter'; c.fillText('EXECUTIVE RESUME', 40, 70);
    c.fillStyle = '#2563EB'; c.font = '800 22px Inter'; c.fillText('TOP CANDIDATE', 40, 110);
    c.fillStyle = '#64748B';
    for (let i = 0; i < 12; i++) c.fillRect(40, 150 + i * 36, cw - 80, 10);
    // Red Stamp imprint
    c.save();
    c.translate(cw / 2, ch / 2 + 50);
    c.rotate(-0.25);
    c.strokeStyle = '#DC2626';
    c.lineWidth = 10;
    c.strokeRect(-180, -50, 360, 100);
    c.fillStyle = 'rgba(220, 38, 38, 0.15)';
    c.fillRect(-180, -50, 360, 100);
    c.fillStyle = '#DC2626';
    c.font = '900 52px Inter';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('REJECTED!', 0, 0);
    c.restore();
  });
  const resumeMat = new THREE.MeshBasicMaterial({ map: resumeTex });
  const resume = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.58), resumeMat);
  resume.rotation.x = -Math.PI / 2;
  resume.rotation.z = 0.05;
  resume.position.set(0.25, 1.155, 0.15);
  g.add(resume);
  g.resume = resume;

  return g;
}

/**
 * 2. MODERN ERGONOMIC EXECUTIVE CHAIR
 */
export function executiveChair() {
  const g = new THREE.Group();
  const leather = mat({ color: '#1B1C22', roughness: 0.55 });
  const chrome = mat({ color: '#DCE0E6', roughness: 0.2, metalness: 0.85 });

  // Padded Seat
  box(0.72, 0.12, 0.68, leather, 0, 0.58, 0, g);
  // High Ergonomic Backrest
  const back = box(0.68, 0.95, 0.12, leather, 0, 1.12, -0.32, g);
  back.rotation.x = 0.08;
  // Headrest
  box(0.48, 0.24, 0.10, leather, 0, 1.65, -0.38, g);
  // Padded Armrests
  box(0.10, 0.05, 0.44, leather, -0.38, 0.82, -0.05, g);
  box(0.10, 0.05, 0.44, leather, 0.38, 0.82, -0.05, g);
  // Chrome arms
  cyl(0.02, 0.02, 0.24, chrome, -0.38, 0.70, -0.05, g);
  cyl(0.02, 0.02, 0.24, chrome, 0.38, 0.70, -0.05, g);
  // Heavy Chrome 5-star base & gas lift cylinder
  cyl(0.045, 0.045, 0.50, chrome, 0, 0.26, 0, g);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = box(0.04, 0.04, 0.42, chrome, 0, 0.08, 0.21, g);
    leg.position.set(0, 0.08, 0);
    leg.rotation.y = a;
    leg.translateZ(0.20);
  }
  return g;
}

/**
 * 3. EXECUTIVE ULTRABOOK LAPTOP
 */
export function executiveLaptop() {
  const g = new THREE.Group();
  const alu = mat({ color: '#A0A4AC', roughness: 0.3, metalness: 0.7 });
  // Base / Keyboard half
  box(0.38, 0.015, 0.26, alu, 0, 0.008, 0, g);
  // Screen lid (pivots closed)
  const lid = new THREE.Group();
  lid.position.set(0, 0.015, -0.13);
  box(0.38, 0.012, 0.26, alu, 0, 0.13, 0.12, lid);
  lid.rotation.x = -1.85; // open at ~105 deg
  g.add(lid);
  g.lid = lid;

  g.close = (k) => {
    // k: 0 (open) to 1 (snapped shut)
    lid.rotation.x = -1.85 + k * 1.85;
  };
  return g;
}

/**
 * 4. COFFEE MUG
 */
export function coffeeMug() {
  const g = new THREE.Group();
  const ceramic = mat({ color: '#1E40AF', roughness: 0.25 });
  cyl(0.065, 0.055, 0.14, ceramic, 0, 0.07, 0, g, 20);
  // Handle
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.012, 8, 16, Math.PI), ceramic);
  h.position.set(0.065, 0.07, 0);
  h.rotation.y = Math.PI / 2;
  h.rotation.z = Math.PI / 2;
  g.add(h);
  return g;
}

/**
 * 5. GIANT RUBBER STAMP GAG (FOR KICKOUT BEATS)
 */
export function rubberStamp() {
  const g = new THREE.Group();
  const wood = mat({ color: '#5C3A21', roughness: 0.7 });
  const redMat = mat({ color: '#DC2626', roughness: 0.3 });

  // Handle
  cyl(0.02, 0.035, 0.24, wood, 0, 0.18, 0, g, 16);
  cyl(0.05, 0.05, 0.06, wood, 0, 0.30, 0, g, 16);
  // Mount base
  box(0.24, 0.04, 0.14, wood, 0, 0.05, 0, g);
  // Rubber pad
  box(0.22, 0.02, 0.12, redMat, 0, 0.02, 0, g);

  g.slam = (k) => {
    // k goes 0 -> 1 on slam
    g.visible = k > 0 && k < 1.0;
    if (!g.visible) return;
    const h = 1.15 + (1 - k) * 0.9;
    g.position.set(0.25, h, 0.15);
    g.rotation.z = (1 - k) * -0.4;
  };

  g.visible = false;
  return g;
}

/**
 * 6. CANDIDATE 3 DEDUCTION THOUGHT BUBBLE GAG
 * Shows cartoon diagram of Mr. Sterling's head profile with glasses trying to hook,
 * finding NO EARS, sliding off, and the eureka CONTACT LENSES lightbulb!
 */
export function thoughtGlassesDeduction() {
  const g = new THREE.Group();
  const canvas = document.createElement('canvas');
  canvas.width = 640; canvas.height = 360;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const matPlane = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.48), matPlane);
  g.add(mesh);

  g.animate = (t) => {
    if (t < 34.0 || t > 38.0) {
      g.visible = false;
      return;
    }
    g.visible = true;
    const progress = Math.min(1, (t - 34.0) / 0.25);
    const scale = progress < 1 ? Math.sin(progress * Math.PI * 0.5) : (t > 37.6 ? Math.max(0, 1 - (t - 37.6) / 0.3) : 1);
    g.scale.set(scale, scale, scale);

    // Render 2D animated comic thought
    ctx.clearRect(0, 0, 640, 360);
    // Cloud thought bubble background
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(10, 10, 620, 340, 32);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Title header
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤔 BRAIN: FACIAL ANALYSIS...', 320, 50);

    // Draw Head silhouette with smooth earless side
    const hx = 180, hy = 190;
    ctx.fillStyle = '#F7EDE2';
    ctx.beginPath();
    ctx.ellipse(hx, hy, 70, 85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Executive combed hair
    ctx.fillStyle = '#26242B';
    ctx.beginPath();
    ctx.moveTo(hx - 50, hy - 40);
    ctx.quadraticCurveTo(hx, hy - 100, hx + 60, hy - 50);
    ctx.quadraticCurveTo(hx + 70, hy - 10, hx + 40, hy - 20);
    ctx.quadraticCurveTo(hx, hy - 70, hx - 50, hy - 40);
    ctx.fill();

    // Eye and nose profile
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(hx + 35, hy - 10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hx + 65, hy - 10);
    ctx.lineTo(hx + 80, hy + 15);
    ctx.lineTo(hx + 60, hy + 20);
    ctx.stroke();

    // Red dashed missing ear highlight
    const earX = hx - 45, earY = hy + 5;
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 4;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.ellipse(earX, earY, 18, 28, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Eyeglasses animation
    const glassesT = Math.min(1, Math.max(0, (t - 34.2) / 0.5));
    // Glasses position
    const slipT = Math.max(0, (t - 34.8) / 0.5);
    const gx = hx + 30 - glassesT * 10;
    const gy = hy - 10 + (slipT > 0 ? slipT * slipT * 120 : 0);
    const gRot = slipT * 0.45;

    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(gRot);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 5;
    // Rim
    ctx.strokeRect(-18, -12, 36, 24);
    // Bridge & temple
    ctx.beginPath();
    ctx.moveTo(-18, -4);
    ctx.lineTo(-75, -8);
    ctx.stroke();
    ctx.restore();

    // Callout text on right side
    if (t < 35.8) {
      ctx.fillStyle = '#DC2626';
      ctx.font = '900 28px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('❌ NO EARS DETECTED!', 280, 140);
      ctx.fillStyle = '#64748B';
      ctx.font = '800 22px Inter, sans-serif';
      ctx.fillText('GLASSES CANNOT STAY ON!', 280, 185);
      if (slipT > 0) {
        ctx.fillStyle = '#EA580C';
        ctx.font = '900 32px Inter, sans-serif';
        ctx.fillText('⬇️ SLIDING OFF!!', 280, 245);
      }
    } else {
      // Eureka lightbulb!
      ctx.fillStyle = '#16A34A';
      ctx.font = '900 32px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('💡 EUREKA!', 280, 140);
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 30px Inter, sans-serif';
      ctx.fillText('MUST BE CONTACTS!!', 280, 195);
      ctx.fillStyle = '#2563EB';
      ctx.font = '800 22px Inter, sans-serif';
      ctx.fillText('GENIUS LEVEL: 1000% 🎯', 280, 245);
    }

    tex.needsUpdate = true;
    g.rotation.set(0, Math.PI, 0);
  };

  g.visible = false;
  return g;
}

/**
 * 6. NEXORA ANIMATED OUTRO EXTENSION BOARD
 */
export function nexoraOutroBoard() {
  const g = new THREE.Group();
  const cv = document.createElement('canvas');
  cv.width = 720;
  cv.height = 420;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  const matPlane = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.56), matPlane);
  g.add(mesh);

  g.animate = (t, startT = 51.26) => {
    if (t < startT) {
      g.visible = false;
      return;
    }
    g.visible = true;
    const progress = Math.min(1, (t - startT) / 0.35);
    const bounce = 1 + Math.sin(progress * Math.PI) * 0.12;
    const s = progress * bounce;
    g.scale.set(s, s, s);

    ctx.clearRect(0, 0, 720, 420);

    // Modern curved dark card with gradient border
    const grad = ctx.createLinearGradient(0, 0, 720, 420);
    grad.addColorStop(0, '#1E1B4B');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(15, 15, 690, 390, 36);
    ctx.fill();

    // Vibrant neon stroke
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Gold bell animation: swinging bell
    const bellAngle = Math.sin((t - startT) * 12) * 0.22;
    ctx.save();
    ctx.translate(140, 150);
    ctx.rotate(bellAngle);
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, -20, 32, Math.PI, 0);
    ctx.lineTo(38, 25);
    ctx.lineTo(-38, 25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 5;
    ctx.stroke();
    // Clapper
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.arc(0, 32, 12, 0, Math.PI * 2);
    ctx.fill();
    // Sound wave arcs
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 56, -0.4, 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 72, -0.3, 0.3);
    ctx.stroke();
    ctx.restore();

    // Channel Brand Name: NEXORA
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 50px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('NEXORA', 240, 130);

    ctx.fillStyle = '#A5B4FC';
    ctx.font = '700 24px Inter, sans-serif';
    ctx.fillText('Daily 3D Animated Comedy', 240, 168);

    // Big Red "SUBSCRIBE / FOLLOW" button with pulse
    const btnPulse = 1 + Math.sin((t - startT) * 6) * 0.04;
    ctx.save();
    ctx.translate(360, 275);
    ctx.scale(btnPulse, btnPulse);
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(-180, -32, 360, 64, 32);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 26px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔔 FOLLOW FOR MORE', 0, 0);
    ctx.restore();

    // Bottom tagline
    ctx.fillStyle = '#94A3B8';
    ctx.font = '800 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LIKE · SHARE · SUBSCRIBE DAILY', 360, 368);

    tex.needsUpdate = true;
    g.rotation.set(0, 0, 0);
  };

  g.visible = false;
  return g;
}
