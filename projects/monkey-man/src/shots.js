// THE DELHI MONKEY MAN (2001) : Night File 3D video.
// Faceless people: witnesses are dark with a red rim, the Monkey Man glows solid red.
import * as THREE from 'three';
import { ctx, setCtx, W, H, clamp, lerp, seg, eo, eio, eob, rr } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import { Human } from './core/human.js';
import * as SETS from './core/sets3d.js';
import * as K from './core/kit.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z), lerpV = (a, b, k) => a.clone().lerp(b, k);
const NIGHT = { exposure: 1.25, bloom: 0.85, bloomThreshold: 0.55, vignette: 0.6, grain: 0.05, warm: 0 };

/** paper insert (newspaper / evidence log / sketch) drawn in 2D */
function paper(x, y, w, h, rot, lines, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 40;
  rr(-w / 2, -h / 2, w, h, 6); ctx.fillStyle = K.P.paper; ctx.fill(); ctx.shadowBlur = 0;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  lines.forEach(([txt, size, col, dy]) => {
    ctx.font = `700 ${size}px FreeMono`;
    ctx.fillStyle = col || K.P.ink;
    ctx.fillText(txt, -w / 2 + 40, -h / 2 + dy);
  });
  ctx.restore();
}

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.1);
  const cam = camera(34);

  // 3D Sets
  const HN = SETS.houseNight();
  const CR = SETS.corridor();
  const CW = SETS.caseWall([0, 1, 2].map((k) => {
    const c = document.createElement('canvas'); c.width = 360; c.height = 420;
    const g = c.getContext('2d'), prev = ctx; setCtx(g);
    g.fillStyle = '#D8CFBA'; g.fillRect(0, 0, 360, 420);
    g.save(); g.translate(180, 210); g.scale(1.5, 1.5);
    K.polaroid(0, 0, 1, 0, ['glow', 'house', 'dark'][k]);
    g.restore(); setCtx(prev); return c;
  }));

  const person = (kind, scale = 1.0) => {
    const h = new Human({ face: false });
    h.setAllMaterial(kind === 'subject' ? SETS.subjectMat(3.0) : SETS.witnessMat());
    if (scale !== 1.0) h.group.scale.setScalar(scale);
    return h;
  };

  // The Monkey Man (4-foot beast, glowing red)
  const monkey = person('subject', 0.72);
  HN.scene.add(monkey.group);

  // Crowd of witnesses huddled under streetlight
  const crowd = [];
  [[-0.3, 0.2], [0.3, -0.2], [-0.1, -0.3], [0.4, 0.3], [0.0, 0.4]].forEach(([dx, dz]) => {
    const w = person('witness', 0.95);
    w.group.position.set(3.1 + dx, 0, -1.5 + dz);
    w.pose({ spine: [-10, 0, 0], head: [-15, 0, 0], shL: [25, 0, 10], shR: [25, 0, -10] });
    HN.scene.add(w.group);
    crowd.push(w);
  });

  // Rooftop charpai cots
  const cots = new THREE.Group();
  const cotMat = new THREE.MeshStandardMaterial({ color: '#5A3E28', roughness: 0.9 });
  const cot = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 1.0), cotMat);
  cot.position.set(0, 3.2, -6);
  cots.add(cot);
  HN.scene.add(cots);

  const render = (scene, focusP, extra = {}) => {
    if (cam.fov !== (extra.fov || 34)) { cam.fov = extra.fov || 34; cam.updateProjectionMatrix(); }
    E.render(scene, cam, { ...NIGHT, focus: cam.position.distanceTo(focusP), aperture: 0.0012, ...extra });
  };

  const hideAll = () => {
    monkey.group.visible = false;
    crowd.forEach((w) => (w.group.visible = false));
    cots.visible = true;
  };

  // ── S01 · Hook: "In two thousand and one, Delhi was gripped..." ──
  add({ id: 'S01', at: 0, note: 'night skyline of Delhi, date types on', draw(lt, d, t, blit) {
    hideAll();
    cam.position.copy(lerpV(V3(-2.0, 3.2, 5.0), V3(-1.0, 2.8, 3.0), eio(lt / d)));
    cam.lookAt(0, 2.0, -6);
    render(HN.scene, V3(0, 2, -6), { fov: 44 });
    blit();
    K.dateStamp('MAY 2001', 'NEW DELHI · INDIA', clamp(lt / 1.6), 80, 300);
  } });
  cue(0.3, 'tock', { gain: 0.4 });
  cue(Wd('Delhi', 0), 'whoosh', { gain: 0.5 });

  // ── S02 · "...where people were terrified to sleep on their own rooftops." ──
  { const st = cut(1);
    add({ id: 'S02', at: st, note: 'empty rooftop cots under moonlight, camera tilts down', draw(lt, d, t, blit) {
      hideAll();
      cam.position.copy(lerpV(V3(1.2, 4.2, -3.0), V3(0.5, 3.8, -4.2), eio(lt / d)));
      cam.lookAt(0, 3.2, -6);
      render(HN.scene, V3(0, 3.2, -6), { fov: 38 });
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 });
    cue(Wd('rooftops', 1), 'slide', { dur: 1.2, gain: 0.4 });
  }

  // ── S03 · "It was a sweltering May, and everyone was whispering about the Monkey Man." ──
  { const st = cut(2), mm = Wd('Monkey', 2) - st;
    add({ id: 'S03', at: st, note: 'dark corridor with flickering light, newspaper clipping appears', draw(lt, d, t, blit) {
      hideAll();
      CR.update(t);
      cam.position.copy(lerpV(V3(0.0, 1.6, 1.2), V3(0.0, 1.5, -0.6), eio(lt / d)));
      cam.lookAt(0, 1.4, -8);
      render(CR.scene, V3(0, 1.4, -4), { fov: 48, aperture: 0.008 });
      blit();
      const k = eo(clamp(lt / 0.5));
      paper(540, lerp(1200, 860, k), 820, 480, -0.03, [
        ['THE HINDUSTAN TIMES', 32, K.P.redDeep, 70],
        ['"MONKEY MAN" TERRORIZES CAPITAL', 36, null, 140],
        ['NIGHT PANIC ON EAST DELHI ROOFTOPS', 26, '#6A6458', 210],
        ['OVER 50 INJURED IN RECENT SIGHTINGS', 26, '#6A6458', 265],
        ['POLICE OFFER RS 50,000 REWARD', 30, K.P.redDeep, 340]
      ], k);
      if (lt > mm) K.redCircle(540, 860 - 240 + 135, 380, 50, seg(lt, mm, mm + 0.4));
    } });
    cue(st, 'whoosh', { gain: 0.5 });
    cue(st + mm, 'pop', { gain: 0.4 });
  }

  // ── S04 · "Witnesses described a four foot beast with glowing red eyes," ──
  { const st = cut(3);
    add({ id: 'S04', at: st, note: 'in the pitch dark, glowing red subject emerges with ember eyes', draw(lt, d, t, blit) {
      hideAll();
      monkey.group.visible = true;
      monkey.group.position.set(0, 0, -3.5);
      monkey.pose({
        spine: [25, 0, 0], head: [-20, 0, 0],
        shL: [40, 0, 25], shR: [40, 0, -25], elL: 75, elR: 75,
        hipL: [45, 0, 10], hipR: [45, 0, -10], knL: 50, knR: 50
      });
      cam.position.copy(lerpV(V3(0.0, 1.2, 0.5), V3(0.0, 1.1, -1.0), eio(lt / d)));
      cam.lookAt(0, 0.9, -3.5);
      render(HN.scene, V3(0, 0.9, -3.5), { fov: 32, exposure: 1.4 });
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.6 });
    cue(Wd('eyes', 3), 'slide', { dur: 1.0, gain: 0.5 });
  }

  // ── S05 · "and razor sharp metal claws," ──
  { const st = cut(4), cl = Wd('claws', 4) - st;
    add({ id: 'S05', at: st, note: 'police forensic sketch of claws, circled in red', draw(lt, d, t, blit) {
      hideAll();
      cam.position.set(0, 1.5, -2); cam.lookAt(0, 1.2, -6);
      render(HN.scene, V3(0, 1.2, -6), { aperture: 0.015, maxblur: 0.02, exposure: 0.8 });
      blit();
      const k = eo(clamp(lt / 0.45));
      paper(540, lerp(1200, 860, k), 800, 480, 0.04, [
        ['FORENSIC EVIDENCE · CASE 104', 32, K.P.redDeep, 70],
        ['SCRATCH PATTERN: 3 PARALLEL MARKS', 32, null, 140],
        ['MATERIAL: METALLIC / CHROME EDGES', 30, '#8A2020', 210],
        ['VICTIMS REPORT METAL CLAWS', 32, null, 280],
        ['NO BIOLOGICAL TISSUE FOUND', 28, '#6A6458', 350]
      ], k);
      if (lt > cl) K.redCircle(540, 860 - 240 + 205, 340, 50, seg(lt, cl, cl + 0.4));
    } });
    cue(st, 'whoosh', { gain: 0.5 });
    cue(st + cl, 'slide', { dur: 0.4, gain: 0.5 });
  }

  // ── S06 · "leaping between buildings in the pitch dark." ──
  { const st = cut(5), lp = Wd('leaping', 5) - st;
    add({ id: 'S06', at: st, note: 'glowing red creature leaps across rooftop against the moon', draw(lt, d, t, blit) {
      hideAll();
      monkey.group.visible = true;
      const j = eio(clamp(lt / d));
      const jumpY = Math.sin(j * Math.PI) * 2.2;
      monkey.group.position.set(lerp(-4.0, 3.5, j), 2.8 + jumpY, -6.0);
      monkey.pose({
        spine: [35, 0, 0], head: [-15, 0, 0],
        shL: [80, 0, 40], shR: [80, 0, -40], elL: 40, elR: 40,
        hipL: [60, 0, 20], hipR: [60, 0, -20], knL: 70, knR: 70
      });
      cam.position.copy(lerpV(V3(-1.5, 3.4, 2.0), V3(1.0, 3.6, 1.2), eio(lt / d)));
      cam.lookAt(0, 3.2, -6.0);
      render(HN.scene, V3(0, 3.2, -6.0), { fov: 42, exposure: 1.35 });
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.6 });
    cue(st + lp, 'thud', { gain: 0.6 });
  }

  // ── S07 · "Police switchboards exploded with hundreds of frantic emergency calls," ──
  { const st = cut(6), pc = Wd('calls', 6) - st;
    add({ id: 'S07', at: st, note: 'police call log: emergency lines overwhelmed', draw(lt, d, t, blit) {
      hideAll();
      cam.position.set(0, 1.5, -2); cam.lookAt(0, 1.1, -12);
      render(HN.scene, V3(0, 1, 0), { aperture: 0.012, maxblur: 0.016, exposure: 0.9 });
      blit();
      K.caseFile(540, 840, 1.25, 'DELHI POLICE · PCR LOG', 0, -0.03);
      K.dateStamp('EMERGENCY 100', 'CALL OVERLOAD · MAY 15', lt > pc ? 1 : clamp(lt / 1.2) * 0.7, 240, 980);
    } });
    cue(st, 'whoosh', { gain: 0.5 });
    cue(st + 0.2, 'tock', { gain: 0.4 });
    cue(st + pc, 'tock', { gain: 0.4 });
  }

  // ── S08 · "as terrified families huddled together under streetlights." ──
  { const st = cut(7);
    add({ id: 'S08', at: st, note: 'faceless witnesses huddled tightly under single streetlamp', draw(lt, d, t, blit) {
      hideAll();
      crowd.forEach((w) => (w.group.visible = true));
      cam.position.copy(lerpV(V3(1.6, 1.8, 2.5), V3(2.4, 1.6, 1.0), eio(lt / d)));
      cam.lookAt(3.1, 1.2, -1.5);
      render(HN.scene, V3(3.1, 1.2, -1.5), { fov: 36, exposure: 1.3 });
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 });
    cue(st + 0.3, 'slide', { dur: 1.5, gain: 0.4 });
  }

  // ── S09 · "Dozens were injured, and two people tragically died in the panic." ──
  { const st = cut(8), dd = Wd('died', 8) - st;
    add({ id: 'S09', at: st, note: 'casualty report: 2 fatalities from stampedes', draw(lt, d, t, blit) {
      hideAll();
      cam.position.set(0, 1.6, -1); cam.lookAt(0, 1.2, -6);
      render(HN.scene, V3(0, 1.2, -6), { aperture: 0.012, maxblur: 0.016, exposure: 0.85 });
      blit();
      const k = eo(clamp(lt / 0.45));
      paper(540, lerp(1200, 860, k), 800, 460, -0.02, [
        ['CASUALTY REPORT · HOSPITAL LOG', 32, K.P.redDeep, 70],
        ['TREATED FOR SCRATCHES: 60+', 32, null, 140],
        ['FATALITIES: 2 CONFIRMED', 36, '#8A2020', 220],
        ['CAUSE: FALL FROM HEIGHTS / PANIC', 30, '#6A6458', 300],
        ['NO CLAW DAMAGE TO VITAL ORGANS', 28, '#6A6458', 360]
      ], k);
      if (lt > dd) K.redCircle(540, 860 - 230 + 215, 340, 55, seg(lt, dd, dd + 0.4));
    } });
    cue(st, 'whoosh', { gain: 0.6 });
    cue(st + dd, 'slam', { gain: 0.7 });
  }

  // ── S10 · "Yet the mysterious creature was never captured," ──
  { const st = cut(9);
    add({ id: 'S10', at: st, note: 'dark empty rooftop under the moon, empty cots', draw(lt, d, t, blit) {
      hideAll();
      cam.position.copy(lerpV(V3(0.0, 3.4, -2.5), V3(0.0, 3.8, 1.0), eio(lt / d)));
      cam.lookAt(0, 2.5, -6);
      render(HN.scene, V3(0, 2.5, -6), { fov: 46 });
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 });
    cue(st + 0.4, 'slide', { dur: 2.0, gain: 0.4 });
  }

  // ── S11 · "and police concluded the sightings were driven entirely by mass hysteria." ──
  { const st = cut(10), mh = Wd('hysteria', 10) - st;
    add({ id: 'S11', at: st, note: 'investigation case wall: MASS HYSTERIA stamp', draw(lt, d, t, blit) {
      cam.position.copy(lerpV(V3(0.4, 0.3, 9.5), V3(0.2, 0.2, 7.2), eio(lt / d)));
      cam.lookAt(0, 0.2, 0);
      render(CW.scene, V3(0, 0.2, 0), { bloom: 0.4 });
      blit();
      K.dateStamp('AIIMS MEDICAL TEAM', 'DIAGNOSIS: MASS HYSTERIA', clamp(lt / 1.6), 80, 300);
      if (lt > mh) K.redCircle(540, 1000, 320, 220, seg(lt, mh, mh + 0.6));
    } });
    cue(st, 'whoosh', { gain: 0.5 });
    cue(st + mh, 'slam', { gain: 0.7 });
  }

  // ── S12 · "Was it a real attacker, an urban myth, or India's biggest mass panic?" ──
  { const st = cut(11), un = Wd('panic', 11) - st;
    add({ id: 'S12', at: st, note: 'classified file slams down, UNSOLVED stamp', draw(lt, d, t, blit) {
      cam.position.set(0.1, 0.1, 6.5); cam.lookAt(0, 0.1, 0);
      render(CW.scene, V3(0, 0, 0), { bloom: 0.4, aperture: 0.01, maxblur: 0.014, exposure: 0.9 });
      blit();
      K.caseFile(540, lerp(1500, 860, eob(seg(lt, 0, 0.45))), 1.3, 'DELHI POLICE · 2001', lt > un ? seg(lt, un, un + 0.25) : 0, -0.04);
    } });
    cue(st, 'whoosh', { gain: 0.6 });
    cue(st + 0.4, 'thud', { gain: 0.5 });
    cue(st + un, 'slam', { gain: 0.8 });
  }

  return { shots: S, cues: CUES };
}
