// Dog cut-out character for Tall Tale 3D style.
// Expressive cartoon dog with real shadow, dynamic poses (stand, walk, run, sit, bark, cuddle),
// wagging tail, floppy ears, and emotive eyes.
import * as THREE from 'three';

export const DOG_INK = '#1F1C33';

let dogShadowTex = null;
function getDogShadow() {
  if (dogShadowTex) return dogShadowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(25, 18, 30, 0.7)');
  gr.addColorStop(0.6, 'rgba(25, 18, 30, 0.22)');
  gr.addColorStop(1, 'rgba(25, 18, 30, 0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  dogShadowTex = new THREE.CanvasTexture(c);
  return dogShadowTex;
}

export function drawDog(g, look = {}, st = {}) {
  const fur = look.fur || '#D89047';
  const furDark = look.furDark || '#B56E28';
  const belly = look.belly || '#F4D4A4';
  const noseCol = '#1E1B2E';

  const pose = st.pose || 'stand'; // 'stand' | 'sit' | 'run' | 'walk' | 'bark' | 'cuddle'
  const phase = st.phase || 0;
  const wag = st.wag != null ? st.wag : Math.sin(phase * 2) * 0.4;
  const bark = st.bark || 0;
  const happy = st.happy || 0;
  const sad = st.sad || 0;
  const flip = st.flip || false;

  g.save();
  g.lineCap = 'round';
  g.lineJoin = 'round';

  if (flip) {
    g.translate(512, 0);
    g.scale(-1, 1);
  }

  // Pivot at ground level (y = 480)
  const groundY = 480;
  const cx = 256;

  // Tail (behind body)
  g.save();
  g.strokeStyle = DOG_INK;
  g.lineWidth = 14;
  g.beginPath();
  const tailBaseX = cx + 80;
  const tailBaseY = groundY - 150;
  const tailAngle = (st.tailAngle || -0.6) + Math.sin((st.t || 0) * 16 + wag) * (pose === 'bark' ? 0.6 : 0.35);
  const tailMidX = tailBaseX + Math.cos(tailAngle) * 70;
  const tailMidY = tailBaseY + Math.sin(tailAngle) * 70;
  const tailTipX = tailBaseX + Math.cos(tailAngle + 0.3) * 110;
  const tailTipY = tailBaseY + Math.sin(tailAngle + 0.3) * 110;

  g.moveTo(tailBaseX, tailBaseY);
  g.quadraticCurveTo(tailMidX, tailMidY, tailTipX, tailTipY);
  g.stroke();

  g.strokeStyle = furDark;
  g.lineWidth = 9;
  g.beginPath();
  g.moveTo(tailBaseX, tailBaseY);
  g.quadraticCurveTo(tailMidX, tailMidY, tailTipX, tailTipY);
  g.stroke();
  g.restore();

  // Back legs (far side)
  g.strokeStyle = DOG_INK;
  g.fillStyle = furDark;
  g.lineWidth = 12;

  // Far back leg
  if (pose === 'sit') {
    // sitting haunches
    g.beginPath();
    g.ellipse(cx + 65, groundY - 50, 36, 26, 0.2, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    // foot
    g.beginPath();
    g.ellipse(cx + 85, groundY - 14, 22, 12, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  } else if (pose === 'run') {
    const rBack = Math.sin(phase) * 60;
    g.beginPath();
    g.moveTo(cx + 50, groundY - 130);
    g.lineTo(cx + 100 + rBack, groundY - 50);
    g.lineTo(cx + 130 + rBack, groundY - 20);
    g.stroke();
  } else {
    // standing / walking
    const wBack = Math.sin(phase) * 25;
    g.beginPath();
    g.moveTo(cx + 55, groundY - 120);
    g.lineTo(cx + 65 + wBack, groundY - 60);
    g.lineTo(cx + 70 + wBack, groundY - 12);
    g.stroke();
    g.beginPath();
    g.ellipse(cx + 70 + wBack, groundY - 10, 16, 9, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }

  // Far front leg
  if (pose === 'run') {
    const rFront = -Math.sin(phase) * 70;
    g.beginPath();
    g.moveTo(cx - 30, groundY - 120);
    g.lineTo(cx - 80 + rFront, groundY - 50);
    g.lineTo(cx - 110 + rFront, groundY - 20);
    g.stroke();
  } else if (pose === 'sit') {
    g.beginPath();
    g.moveTo(cx - 40, groundY - 110);
    g.lineTo(cx - 45, groundY - 12);
    g.stroke();
    g.beginPath();
    g.ellipse(cx - 45, groundY - 10, 16, 9, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  } else {
    const wFront = -Math.sin(phase) * 25;
    g.beginPath();
    g.moveTo(cx - 30, groundY - 110);
    g.lineTo(cx - 35 + wFront, groundY - 12);
    g.stroke();
    g.beginPath();
    g.ellipse(cx - 35 + wFront, groundY - 10, 16, 9, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }

  // Main Torso / Body
  const bodyBob = pose === 'run' ? Math.abs(Math.sin(phase)) * 20 : 0;
  const by = groundY - 110 - bodyBob;

  g.save();
  g.fillStyle = fur;
  g.strokeStyle = DOG_INK;
  g.lineWidth = 14;

  g.beginPath();
  if (pose === 'sit') {
    // Slanted body sitting back
    g.moveTo(cx - 50, by - 50);
    g.bezierCurveTo(cx - 20, by - 80, cx + 50, by - 30, cx + 65, by + 40);
    g.bezierCurveTo(cx + 60, by + 80, cx - 10, by + 80, cx - 45, by + 30);
  } else {
    // Horizontal bean body
    g.moveTo(cx - 65, by - 40);
    g.bezierCurveTo(cx - 20, by - 65, cx + 55, by - 55, cx + 80, by - 10);
    g.bezierCurveTo(cx + 90, by + 35, cx + 45, by + 45, cx - 10, by + 35);
    g.bezierCurveTo(cx - 50, by + 30, cx - 85, by + 10, cx - 65, by - 40);
  }
  g.closePath();
  g.fill();
  g.stroke();

  // Belly patch
  g.fillStyle = belly;
  g.beginPath();
  g.ellipse(cx + 10, by + 15, 38, 18, -0.1, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // Near front leg
  g.strokeStyle = DOG_INK;
  g.fillStyle = fur;
  g.lineWidth = 14;

  if (pose === 'run') {
    const rFront2 = -Math.sin(phase + Math.PI) * 70;
    g.beginPath();
    g.moveTo(cx - 50, groundY - 120);
    g.lineTo(cx - 95 + rFront2, groundY - 50);
    g.lineTo(cx - 125 + rFront2, groundY - 20);
    g.stroke();
  } else if (pose === 'bark') {
    // Front legs braced / stomping
    const stomp = Math.abs(Math.sin((st.t || 0) * 12)) * 15;
    g.beginPath();
    g.moveTo(cx - 50, groundY - 110);
    g.lineTo(cx - 65, groundY - 14 - stomp);
    g.stroke();
    g.beginPath();
    g.ellipse(cx - 65, groundY - 10 - stomp, 18, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  } else if (pose === 'sit') {
    g.beginPath();
    g.moveTo(cx - 25, groundY - 110);
    g.lineTo(cx - 20, groundY - 14);
    g.stroke();
    g.beginPath();
    g.ellipse(cx - 20, groundY - 10, 18, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  } else {
    const wFront2 = -Math.sin(phase + Math.PI) * 25;
    g.beginPath();
    g.moveTo(cx - 50, groundY - 110);
    g.lineTo(cx - 55 + wFront2, groundY - 14);
    g.stroke();
    g.beginPath();
    g.ellipse(cx - 55 + wFront2, groundY - 10, 18, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }

  // Near back leg
  if (pose === 'run') {
    const rBack2 = Math.sin(phase + Math.PI) * 60;
    g.beginPath();
    g.moveTo(cx + 40, groundY - 130);
    g.lineTo(cx + 85 + rBack2, groundY - 50);
    g.lineTo(cx + 115 + rBack2, groundY - 20);
    g.stroke();
  } else if (pose === 'sit') {
    // Big sitting thigh
    g.beginPath();
    g.ellipse(cx + 45, groundY - 45, 34, 24, -0.2, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.beginPath();
    g.ellipse(cx + 65, groundY - 12, 20, 11, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  } else {
    const wBack2 = Math.sin(phase + Math.PI) * 25;
    g.beginPath();
    g.moveTo(cx + 40, groundY - 120);
    g.lineTo(cx + 45 + wBack2, groundY - 60);
    g.lineTo(cx + 50 + wBack2, groundY - 12);
    g.stroke();
    g.beginPath();
    g.ellipse(cx + 50 + wBack2, groundY - 10, 18, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }

  // Head and Muzzle
  g.save();
  const headBob = (pose === 'run' ? Math.sin(phase * 2) * 10 : 0) - (pose === 'bark' ? 25 : 0);
  const headTilt = (pose === 'bark' ? -0.45 : pose === 'sit' ? 0.12 : 0) + (st.headTilt || 0);

  const headX = cx - 75;
  const headY = by - 65 + headBob;

  g.translate(headX, headY);
  g.rotate(headTilt);

  // Far Ear
  g.fillStyle = furDark;
  g.strokeStyle = DOG_INK;
  g.lineWidth = 10;
  g.beginPath();
  if (pose === 'run') {
    // Ear flying back
    g.ellipse(45, -25, 35, 14, -0.3, 0, Math.PI * 2);
  } else {
    // Drooping ear
    g.ellipse(25, 10, 18, 38, 0.4, 0, Math.PI * 2);
  }
  g.fill();
  g.stroke();

  // Head circle
  g.fillStyle = fur;
  g.strokeStyle = DOG_INK;
  g.lineWidth = 14;
  g.beginPath();
  g.arc(0, 0, 52, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Snout / Muzzle
  g.fillStyle = belly;
  g.beginPath();
  g.ellipse(-38, 14, 30, 24, 0.05, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Nose
  g.fillStyle = noseCol;
  g.beginPath();
  g.ellipse(-58, 6, 12, 9, 0, 0, Math.PI * 2);
  g.fill();
  // Catchlight
  g.fillStyle = '#FFFFFF';
  g.beginPath();
  g.arc(-62, 3, 3.5, 0, Math.PI * 2);
  g.fill();

  // Mouth
  if (bark > 0.3 || pose === 'bark') {
    // Open barking mouth
    g.fillStyle = '#8B2635';
    g.strokeStyle = DOG_INK;
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(-50, 18);
    g.quadraticCurveTo(-35, 48, -15, 26);
    g.closePath();
    g.fill();
    g.stroke();
    // Tongue
    g.fillStyle = '#E85D75';
    g.beginPath();
    g.ellipse(-30, 36, 12, 8, 0.3, 0, Math.PI * 2);
    g.fill();
  } else if (happy > 0.5) {
    // Cute smile
    g.strokeStyle = DOG_INK;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(-34, 20, 12, 0.2, Math.PI * 0.9);
    g.stroke();
  } else {
    // Gentle closed mouth
    g.strokeStyle = DOG_INK;
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(-54, 16);
    g.quadraticCurveTo(-38, 25, -24, 20);
    g.stroke();
  }

  // Eye (big expressive cartoon eye)
  const eyeX = -14;
  const eyeY = -12;

  if (happy > 0.6) {
    // ^ shape happy eye
    g.strokeStyle = DOG_INK;
    g.lineWidth = 8;
    g.beginPath();
    g.arc(eyeX, eyeY + 4, 14, Math.PI * 1.1, Math.PI * 1.9);
    g.stroke();
  } else {
    // Round white eye with pupil
    g.fillStyle = '#FFFFFF';
    g.strokeStyle = DOG_INK;
    g.lineWidth = 8;
    g.beginPath();
    g.arc(eyeX, eyeY, 16, 0, Math.PI * 2);
    g.fill();
    g.stroke();

    // Pupil
    const lookX = st.look ? st.look[0] * 5 : -3;
    const lookY = st.look ? st.look[1] * 5 : 0;
    g.fillStyle = DOG_INK;
    g.beginPath();
    g.arc(eyeX + lookX, eyeY + lookY, 9, 0, Math.PI * 2);
    g.fill();

    // Catchlight
    g.fillStyle = '#FFFFFF';
    g.beginPath();
    g.arc(eyeX + lookX - 3, eyeY + lookY - 3, 3.5, 0, Math.PI * 2);
    g.fill();

    // Eyebrow
    g.strokeStyle = furDark;
    g.lineWidth = 5;
    g.beginPath();
    if (sad > 0.5) {
      // Slanted sad/worried brow
      g.moveTo(eyeX - 14, eyeY - 22);
      g.lineTo(eyeX + 12, eyeY - 28);
    } else {
      g.arc(eyeX, eyeY - 18, 12, Math.PI * 1.1, Math.PI * 1.9);
    }
    g.stroke();
  }

  // Near Ear (floppy over head)
  g.fillStyle = fur;
  g.strokeStyle = DOG_INK;
  g.lineWidth = 12;
  g.beginPath();
  if (pose === 'run') {
    // Streamlined ear
    g.ellipse(28, -15, 38, 16, -0.2, 0, Math.PI * 2);
  } else if (pose === 'bark') {
    // Perked ear
    g.ellipse(15, -35, 18, 38, 0.2, 0, Math.PI * 2);
  } else {
    // Drooping friendly ear
    g.ellipse(5, 5, 20, 42, 0.25, 0, Math.PI * 2);
  }
  g.fill();
  g.stroke();

  g.restore(); // end head

  // Collar
  const collarCol = look.collar || '#E24E42';
  g.strokeStyle = collarCol;
  g.lineWidth = 9;
  g.beginPath();
  g.arc(cx - 50, by - 40, 24, 0.4, Math.PI * 0.9);
  g.stroke();

  // Little collar tag
  g.fillStyle = '#F2C230';
  g.beginPath();
  g.arc(cx - 62, by - 20, 6, 0, Math.PI * 2);
  g.fill();

  g.restore();
}

export class Dog {
  constructor(look = {}, { height = 0.85, res = 2, castShadow = true } = {}) {
    this.look = look;
    this.res = res;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512 * res;
    this.canvas.height = 512 * res;
    this.g = this.canvas.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 4;

    const H = height;
    const Wd = height * 1.15;
    const geo = new THREE.PlaneGeometry(Wd, H);
    geo.translate(0, H / 2, 0);

    this.mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      transparent: true,
      alphaTest: 0.04,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.castShadow = castShadow;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: this.tex,
      alphaTest: 0.5
    });

    this.blob = new THREE.Mesh(
      new THREE.PlaneGeometry(Wd * 0.8, Wd * 0.4),
      new THREE.MeshBasicMaterial({
        map: getDogShadow(),
        transparent: true,
        depthWrite: false,
        opacity: 0.5
      })
    );
    this.blob.rotation.x = -Math.PI / 2;
    this.blob.position.y = 0.01;

    this.group = new THREE.Group();
    this.pivot = new THREE.Group();
    this.pivot.add(this.mesh);
    this.group.add(this.pivot, this.blob);

    this.key = '';
    this.H = H;
    this.set({});
  }

  set(st = {}) {
    const key = JSON.stringify(st, (k, v) =>
      typeof v === 'number' ? Math.round(v * 100) / 100 : v
    );
    if (key === this.key) return this;
    this.key = key;
    this.st = st;

    const g = this.g;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, this.canvas.width, this.canvas.height);
    g.scale(this.res, this.res);
    drawDog(g, this.look, st);
    this.tex.needsUpdate = true;
    return this;
  }

  face(cam) {
    const p = new THREE.Vector3();
    this.group.getWorldPosition(p);
    this.pivot.rotation.y =
      Math.atan2(cam.position.x - p.x, cam.position.z - p.z) - this.group.rotation.y;
    return this;
  }

  tint(col) {
    this.mat.color.set(col);
    return this;
  }

  at(x, y, z) {
    this.group.position.set(x, y, z);
    return this;
  }
}
