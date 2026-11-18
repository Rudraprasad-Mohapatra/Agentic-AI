// 3D Props for "Types of Salaries" Corporate Comedy Short
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
 * 1. EXECUTIVE OFFICE DESK & CHAIR
 */
export function executiveDesk() {
  const g = new THREE.Group();
  const mahogany = mat({ color: '#4A2810', roughness: 0.5 });
  const trimWood = mat({ color: '#2B1408', roughness: 0.7 });
  const brass = mat({ color: '#D4AF37', roughness: 0.3, metalness: 0.8 });

  // Main desktop
  box(3.2, 0.12, 1.6, mahogany, 0, 1.08, 0, g);
  box(3.24, 0.04, 1.64, trimWood, 0, 1.04, 0, g);

  // Modern angled solid executive legs
  box(0.18, 1.02, 1.4, mahogany, -1.35, 0.51, 0, g);
  box(0.18, 1.02, 1.4, mahogany, 1.35, 0.51, 0, g);
  box(2.5, 0.72, 0.08, mahogany, 0, 0.66, -0.3, g);

  // Leather writing pad
  const padMat = mat({ color: '#1A1816', roughness: 0.85 });
  box(1.2, 0.015, 0.7, padMat, 0.0, 1.145, 0.05, g);

  // Brass Nameplate: "MR. ARTHUR / SENIOR PARTNER"
  const npBase = box(0.42, 0.05, 0.09, mahogany, -0.95, 1.15, 0.45, g);
  const npMat = mat({ color: '#E2B842', roughness: 0.2, metalness: 0.9 });
  const npFace = box(0.38, 0.06, 0.015, npMat, -0.95, 1.17, 0.49, g);
  npFace.rotation.x = -0.25;

  return g;
}

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

export function breakroomTable() {
  return executiveDesk();
}

/**
 * 2. COFFEE MUG
 */
export function coffeeMug(col = '#2563EB') {
  const g = new THREE.Group();
  const ceramic = mat({ color: col, roughness: 0.25 });
  cyl(0.065, 0.055, 0.14, ceramic, 0, 0.07, 0, g, 20);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.012, 8, 16, Math.PI), ceramic);
  h.position.set(0.065, 0.07, 0);
  h.rotation.z = -Math.PI / 2;
  g.add(h);
  return g;
}

/**
 * 3. DYNAMIC SALARY TYPE VISUAL INFOGRAPHIC CARD
 */
export function salaryCardGag() {
  const g = new THREE.Group();
  const cv = document.createElement('canvas');
  cv.width = 720;
  cv.height = 420;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  const matPlane = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.51), matPlane);
  g.add(mesh);

  g.animate = (salaryType, t) => {
    // salaryType: 1 to 6
    if (!salaryType) {
      g.visible = false;
      return;
    }
    g.visible = true;

    ctx.clearRect(0, 0, 720, 420);

    // Dark sleek card with glowing colored borders
    const colors = {
      1: { border: '#EAB308', grad1: '#261B0B', grad2: '#0F172A', title: '🧅 THE ONION SALARY' },
      2: { border: '#EF4444', grad1: '#2B0E0E', grad2: '#0F172A', title: '🔥 THE DAMNED SALARY' },
      3: { border: '#38BDF8', grad1: '#0B233A', grad2: '#0F172A', title: '🕵️‍♂️ THE AGNOSTIC SALARY' },
      4: { border: '#A855F7', grad1: '#2A0B3D', grad2: '#0F172A', title: '🎩✨ THE MAGIC SALARY' },
      5: { border: '#F43F5E', grad1: '#330B1C', grad2: '#0F172A', title: '📅 THE PERIOD SALARY' },
      6: { border: '#64748B', grad1: '#1E293B', grad2: '#0F172A', title: '📉 THE IMPOTENT SALARY' }
    }[salaryType] || { border: '#3B82F6', grad1: '#1E1B4B', grad2: '#0F172A', title: 'TYPES OF SALARIES' };

    const grad = ctx.createLinearGradient(0, 0, 720, 420);
    grad.addColorStop(0, colors.grad1);
    grad.addColorStop(1, colors.grad2);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(14, 14, 692, 392, 32);
    ctx.fill();

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 7;
    ctx.stroke();

    // Title banner
    ctx.fillStyle = colors.border;
    ctx.font = '900 36px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(colors.title, 360, 72);

    // Punchline Subtitle & Visual Gag Art per Salary Type
    if (salaryType === 1) {
      // THE ONION SALARY
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 32px Inter, sans-serif';
      ctx.fillText('"TOUCH IT... AND YOU CRY!" 😭', 360, 135);

      // Cartoon Onion with crying face
      ctx.save();
      ctx.translate(360, 260);
      // Onion body
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(0, 10, 65, 75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 5;
      ctx.stroke();
      // Green sprout
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.moveTo(-15, -60);
      ctx.quadraticCurveTo(0, -110, 20, -120);
      ctx.quadraticCurveTo(5, -80, 15, -60);
      ctx.fill();
      // Tears streaming
      ctx.fillStyle = '#38BDF8';
      [-35, 35].forEach((tx) => {
        const tearDrop = (t * 8) % 40;
        ctx.beginPath();
        ctx.arc(tx, 15 + tearDrop, 9, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      ctx.fillStyle = '#FBBF24';
      ctx.font = '800 24px Inter, sans-serif';
      ctx.fillText('WARNING: 100% TEAR GAS INVOICE', 360, 380);

    } else if (salaryType === 2) {
      // THE DAMNED SALARY
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px Inter, sans-serif';
      ctx.fillText("IT TORTURES YOU... BUT YOU CAN'T LEAVE! 💀", 360, 135);

      // Dollar bill on fire + chains
      ctx.save();
      ctx.translate(360, 250);
      // Green bill
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.roundRect(-100, -45, 200, 90, 8);
      ctx.fill();
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#065F46';
      ctx.font = '900 44px Inter';
      ctx.fillText('$', 0, 15);
      // Fire flames licking bill
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(-90, 45);
      ctx.quadraticCurveTo(-70, -70 + Math.sin(t * 15) * 10, -50, 45);
      ctx.quadraticCurveTo(-30, -85 + Math.cos(t * 18) * 10, -10, 45);
      ctx.quadraticCurveTo(20, -75 + Math.sin(t * 14) * 12, 50, 45);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#F87171';
      ctx.font = '800 24px Inter, sans-serif';
      ctx.fillText('STATUS: ETERNAL CORPORATE SUFFERING', 360, 380);

    } else if (salaryType === 3) {
      // THE AGNOSTIC SALARY
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 32px Inter, sans-serif';
      ctx.fillText('"DOES IT ACTUALLY EXIST?!" 🕵️‍♂️', 360, 135);

      // Bank app screen with $0.00 and magnifying glass
      ctx.save();
      ctx.translate(360, 250);
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.roundRect(-120, -50, 240, 100, 12);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 28px Inter';
      ctx.fillText('BANK BALANCE:', 0, -15);
      ctx.fillStyle = '#E0F2FE';
      ctx.font = '900 38px Inter';
      ctx.fillText('$0.00 ❓', 0, 30);
      // Magnifying glass hovering
      const mx = Math.sin(t * 4) * 50;
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(mx, 10, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx + 32, 42);
      ctx.lineTo(mx + 75, 85);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#38BDF8';
      ctx.font = '800 24px Inter, sans-serif';
      ctx.fillText('SEARCH RESULT: 404 SALARY NOT FOUND', 360, 380);

    } else if (salaryType === 4) {
      // THE MAGIC SALARY
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 32px Inter, sans-serif';
      ctx.fillText('NOW YOU SEE IT... POOF! 💨 GONE!', 360, 135);

      // Magician top hat with sparkle & smoke
      ctx.save();
      ctx.translate(360, 250);
      ctx.fillStyle = '#1E1B4B';
      // Hat brim
      ctx.beginPath();
      ctx.ellipse(0, 45, 90, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // Hat crown
      ctx.fillRect(-60, -55, 120, 100);
      // Red band
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-60, 25, 120, 18);
      // Smoke puff & vanish text
      ctx.fillStyle = '#E9D5FF';
      ctx.font = '900 28px Inter';
      ctx.fillText('💸 RENT & BILLS', 0, -85);
      ctx.restore();

      ctx.fillStyle = '#C084FC';
      ctx.font = '800 24px Inter, sans-serif';
      ctx.fillText('DISAPPEARS IN 0.3 SECONDS FLAT', 360, 380);

    } else if (salaryType === 5) {
      // THE PERIOD SALARY
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px Inter, sans-serif';
      ctx.fillText('COMES ONCE A MONTH... LASTS 4 DAYS! 📅', 360, 135);

      // Calendar card with Days 1-4 circled, days 5-30 blank
      ctx.save();
      ctx.translate(360, 245);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(-120, -55, 240, 115, 12);
      ctx.fill();
      // Red header
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.roundRect(-120, -55, 240, 35, [12, 12, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 20px Inter';
      ctx.fillText('PAYDAY CALENDAR', 0, -32);
      // Days grid
      ctx.fillStyle = '#16A34A';
      ctx.font = '900 24px Inter';
      ctx.fillText('DAY 1 - 4: 🥳 RICH!', 0, 5);
      ctx.fillStyle = '#E11D48';
      ctx.font = '900 24px Inter';
      ctx.fillText('DAY 5 - 30: 💀 BROKE!', 0, 38);
      ctx.restore();

      ctx.fillStyle = '#FB7185';
      ctx.font = '800 24px Inter, sans-serif';
      ctx.fillText('REMAINING 26 DAYS: RAMEN NOODLE DIET', 360, 380);

    } else if (salaryType === 6) {
      // THE IMPOTENT SALARY
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px Inter, sans-serif';
      ctx.fillText('WHEN YOU NEED IT MOST... TOTAL LETDOWN! 📉', 360, 135);

      // Emergency expense invoice + dead wallet
      ctx.save();
      ctx.translate(360, 245);
      // Red emergency alert box
      ctx.fillStyle = '#7F1D1D';
      ctx.beginPath();
      ctx.roundRect(-140, -55, 280, 115, 12);
      ctx.fill();
      ctx.fillStyle = '#FCA5A5';
      ctx.font = '900 24px Inter';
      ctx.fillText('🚨 EMERGENCY BILL: $5,000', 0, -20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 36px Inter';
      ctx.fillText('WALLET: $1.42 🪰', 0, 28);
      ctx.restore();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '800 24px Inter, sans-serif';
      ctx.fillText('CANNOT FUNCTION UNDER PRESSURE', 360, 380);
    }

    tex.needsUpdate = true;
  };

  g.visible = false;
  return g;
}

/**
 * 4. NEXORA ANIMATED OUTRO EXTENSION BOARD
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

  g.animate = (t, startT = 47.0) => {
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

    const grad = ctx.createLinearGradient(0, 0, 720, 420);
    grad.addColorStop(0, '#1E1B4B');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(15, 15, 690, 390, 36);
    ctx.fill();

    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 8;
    ctx.stroke();

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
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.arc(0, 32, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 56, -0.4, 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 72, -0.3, 0.3);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 50px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('NEXORA', 240, 130);

    ctx.fillStyle = '#A5B4FC';
    ctx.font = '700 24px Inter, sans-serif';
    ctx.fillText('Daily 3D Animated Comedy', 240, 168);

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

    ctx.fillStyle = '#94A3B8';
    ctx.font = '800 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LIKE · SHARE · SUBSCRIBE DAILY', 360, 368);

    tex.needsUpdate = true;
  };

  g.visible = false;
  return g;
}
