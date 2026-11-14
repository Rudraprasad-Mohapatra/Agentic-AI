// THE MAN WHO BOUGHT A BANK FOR $1: Tall Tale 3D video.
// Paced cuts every ~2.4s, character expression acting on every beat, camera moving in every shot.
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

// Custom prop: carved marble slab "IN ART WE TRUST"
const marbleSlab = (g, x, y) => {
  g.save(); g.translate(x, y - 50); g.rotate(-0.08);
  g.fillStyle = '#E8E4DC'; g.strokeStyle = INK; g.lineWidth = 5;
  g.beginPath(); g.roundRect(-60, -40, 120, 80, 6); g.fill(); g.stroke();
  g.strokeStyle = '#B8B0A0'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-40, -30); g.bezierCurveTo(-20, -10, -30, 10, -10, 30); g.stroke();
  g.fillStyle = '#B8860B'; g.font = '900 15px Inter'; g.textAlign = 'center';
  g.fillText('IN ART', 0, -6); g.fillText('WE TRUST', 0, 14);
  g.restore();
};

// The cast
const LOOK = {
  theaster: { body: '#3A5A80', pattern: 'vest', patCol: '#1E2D40', hat: 'cap', hatCol: '#2E3E52', neck: 'bowtie', neckCol: '#D8343F', extra: ['mustache'] },
  mayor: { body: '#504030', pattern: 'plain', hat: 'tophat', hatCol: '#2A2018', neck: 'tie', neckCol: '#C9A13B', extra: ['glasses', 'mustache'] },
  banker: { body: '#2E3548', pattern: 'vest', patCol: '#1A2030', hat: 'bowler', hatCol: '#181E2C', neck: 'tie', neckCol: '#8A2020', extra: ['monocle', 'mustache'] },
  collector: { body: '#8A4A5E', pattern: 'check', patCol: '#5A2A3E', hat: 'boater', hatCol: '#E8C77A', band: '#B5372E', neck: 'bowtie', neckCol: '#E2B33C', extra: ['glasses'] },
};
const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LOOKS = {
    street: { bloom: 0.15, aperture: 0.0012, maxblur: 0.008 },
    room: { bloom: 0.25, aperture: 0.001, maxblur: 0.008 },
    gallery: { bloom: 0.35, aperture: 0.0008, maxblur: 0.006 }
  };
  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };

  // ── sets ─────────────────────────────────────────────────────────────
  const SHOP_ORDER = [
    ['BAKERY', '#C9603F', 'brick', '#D8343F'],
    ['GENERAL STORE', '#6FA3B8', 'wood', null],
    ['BARBER', '#E3C16F', 'wood', '#3C6FB6'],
    ['GRAND HOTEL', '#9E4A3A', 'brick', null],
    ['TAILOR', '#B98ACF', 'wood', '#2E4E3F'],
    ['BANK', '#C7B79A', 'brick', '#2E4E8A'],
    ['HARDWARE', '#B5553C', 'brick', '#F2C230'],
    ['CAFE', '#E58A6A', 'wood', '#2E4E3F'],
    ['POST OFFICE', '#7FA36A', 'brick', null],
    ['PHARMACY', '#5FA39A', 'wood', '#D8343F'],
    ['SHOES', '#D9A34A', 'wood', null],
    ['THEATER', '#A3485A', 'brick', '#F2C230']
  ];
  const ST = WD.mainStreet(E, { shops: SHOP_ORDER });
  ST.sun.key.target.position.set(-4, 0, 0); ST.sun.key.position.set(5, 13, 6);
  const BK = ST.buildings.find((b) => b.name === 'BANK');

  const stTheaster = person('theaster');
  const stMayor = person('mayor');
  const stBanker = person('banker');
  const stCollector = person('collector');
  [stTheaster, stMayor, stBanker, stCollector].forEach((p) => ST.scene.add(p.group));
  const streetPeople = () => [...ST.people, stTheaster, stMayor, stBanker, stCollector];

  const view = (scene, from, look, people = []) => {
    const c = new THREE.PerspectiveCamera(42, 4 / 3, 0.1, 800);
    c.position.copy(from); c.lookAt(look);
    people.forEach((p) => p.face(c));
    const t = WD.snapshot(E, scene, c);
    t.wrapS = THREE.RepeatWrapping;
    return t;
  };

  // City Hall Interior (Mayor's Office)
  const CH = WD.interior(E, {
    wall: '#4A3225', motif: '#5A3E2F', floor: '#2A1C14', ceiling: '#201610',
    signText: 'CITY HALL', counterOn: false,
    view: view(ST.scene, V3(2, 1.8, -12), V3(-3, 2.2, 10), ST.people)
  });
  const chDesk = PR.desk(2.4); chDesk.position.set(0.4, 0, -3.2); CH.scene.add(chDesk);
  const chNotice = PR.poster(['DEMOLISH', '$1,000,000', 'CITY OF CHICAGO'], { w: 1.3, h: 1.7 });
  chNotice.position.set(-2.4, 2.1, -5.87); CH.scene.add(chNotice);
  const chMayor = person('mayor'); chMayor.at(0.4, 0, -3.95); CH.scene.add(chMayor.group);
  const chTheaster = person('theaster'); chTheaster.at(-1.2, 0, -2.4); CH.scene.add(chTheaster.group);
  const chPeople = [chMayor, chTheaster];

  // Commercial Bank Interior (Loan Department)
  const BK_IN = WD.interior(E, {
    wall: '#2F4F4F', motif: '#3D6363', floor: '#253535', ceiling: '#182424',
    signText: 'LOAN DEPARTMENT', counterOn: true,
    view: view(ST.scene, V3(0, 2, -10), V3(0, 2, 10), ST.people)
  });
  const bkBanker = person('banker'); bkBanker.at(3.1, 0, -2.3); BK_IN.scene.add(bkBanker.group);
  const bkTheaster = person('theaster'); bkTheaster.at(1.6, 0, -2.0); BK_IN.scene.add(bkTheaster.group);
  const bkPeople = [bkBanker, bkTheaster];

  // Ruined Bathroom Interior
  const RM = WD.interior(E, {
    wall: '#5E635B', motif: '#6B7068', floor: '#3D423B', ceiling: '#2C302A',
    signText: null, counterOn: false, picture: false, litter: true,
    view: view(ST.scene, V3(-2, 2, -15), V3(-2, 2, 10), ST.people)
  });
  const rmTheaster = person('theaster'); rmTheaster.at(0.2, 0, -2.0); RM.scene.add(rmTheaster.group);
  const rmPeople = [rmTheaster];

  // Art Gallery / Studio
  const GL = WD.interior(E, {
    wall: '#F2EFEB', motif: '#E5E0D8', floor: '#8A5A36', ceiling: '#DDD8CE',
    signText: 'ART BASEL', counterOn: false,
    view: view(ST.scene, V3(0, 2, -8), V3(0, 2, 8), ST.people)
  });
  const glTheaster = person('theaster'); glTheaster.at(-0.6, 0, -1.8); GL.scene.add(glTheaster.group);
  const glCollector = person('collector'); glCollector.at(0.8, 0, -1.8); GL.scene.add(glCollector.group);
  const glPeople = [glTheaster, glCollector];

  // ── 1 · HOOK: "In twenty twelve, a man bought an entire bank" ──
  { const st = cut(0), z = BK.z;
    add({ id: 'S01', at: st, note: 'main street outside bank: Theaster stands proud holding $1 bill', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      stTheaster.group.visible = true; stMayor.group.visible = stBanker.group.visible = stCollector.group.visible = false;
      stTheaster.at(-4.8, 0.18, z - 1.2);
      stTheaster.set({ mood: 'smug', armR: [35, -85], holdR: PROPS.bill, armL: [15, 10], blink: blink(t), v: 'b1' });
      shoot(ST.scene, streetPeople(), V3(-1.2, 2.4, z - 8.0), V3(-2.8, 1.8, z - 4.5), V3(-4.8, 1.4, z - 1.2), null, k, LOOKS.street);
      blit();
    } });
    cue(st + 0.05, 'whoosh', { gain: 0.6 });
    cue(Wd('bank', 0), 'ding', { gain: 0.7 });
  }

  // ── 2 · "for one single dollar." (Punch-in close on dollar bill) ──
  { const st = cut(1), z = BK.z;
    add({ id: 'S02', at: st, note: 'punch-in close on Theaster holding $1 bill, proud wink', draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      stTheaster.group.visible = true;
      stTheaster.at(-4.8, 0.18, z - 1.2);
      stTheaster.set({ mood: 'sly', armR: [45, -95], holdR: PROPS.bill, look: [0.3, -0.2], blink: blink(t), v: 'b2' });
      shoot(ST.scene, streetPeople(), V3(-3.2, 1.9, z - 3.8), V3(-3.8, 1.75, z - 2.8), V3(-4.8, 1.5, z - 1.2), null, k, LOOKS.street, 1.6);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('dollar', 1), 'pop', { gain: 0.8 });
  }

  // ── 3 · "Chicago was going to pay a million bucks" (Mayor stressed with demo bill) ──
  { const st = cut(2);
    add({ id: 'S03', at: st, note: 'city hall: Mayor stressed behind desk with demolition notice', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      chTheaster.group.visible = false; chMayor.group.visible = true;
      chMayor.set({ mood: 'worried', sweat: 1, armL: [30, -90], holdL: PROPS.paper('DEMOLISH'), look: [0.4, 0.5], talk: talk(t), v: 'dm' });
      shoot(CH.scene, chPeople, V3(-0.6, 2.2, -1.2), V3(0.1, 1.9, -1.8), V3(0.4, 1.45, -3.95), null, k, LOOKS.room);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('million', 2), 'slam', { gain: 0.7 });
  }

  // ── 4 · "just to tear the decaying building down," (The decaying building) ──
  { const st = cut(3), z = BK.z;
    add({ id: 'S04', at: st, note: 'wide shot: decaying bank facade, dust puffs', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      stTheaster.group.visible = false;
      shoot(ST.scene, streetPeople(), V3(2.5, 4.0, z - 12.0), V3(0.5, 2.5, z - 9.0), V3(-5.5, 2.5, z - 1.0), null, k, LOOKS.street);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('down', 3), 'thud', { gain: 0.8 });
  }

  // ── 5 · "so an artist named Theaster offered them a single dollar instead." ──
  { const st = cut(4);
    add({ id: 'S05', at: st, note: 'City Hall: Theaster slides in offering $1, Mayor in shock', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      chTheaster.group.visible = chMayor.group.visible = true;
      chTheaster.at(-0.8 + k * 0.4, 0, -2.6);
      chTheaster.set({ mood: 'smug', armR: [60, -90], holdR: PROPS.bill, legs: 'walk', phase: t * 6, v: 'off1' });
      chMayor.set({ mood: lt > 0.4 ? 'shock' : 'worried', armL: [35, -30], armR: [35, -30], look: [-0.6, 0.2] });
      shoot(CH.scene, chPeople, V3(-2.4, 2.1, -0.6), V3(-1.8, 1.85, -1.2), V3(0.0, 1.4, -3.4), null, k, LOOKS.room);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('offered', 4), 'slide', { gain: 0.6 });
    cue(Wd('dollar', 4), 'pop', { gain: 0.7 });
  }

  // ── 6 · "The city handed him the keys," (Mayor hands keys) ──
  { const st = cut(5);
    add({ id: 'S06', at: st, note: 'close: Mayor passes giant keys to Theaster, who smiles', draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      chTheaster.group.visible = chMayor.group.visible = true;
      chTheaster.at(-0.4, 0, -2.6);
      chMayor.at(0.4, 0, -3.95);
      chMayor.set({ mood: 'neutral', armL: [50, -80], holdL: PROPS.key, v: 'k1' });
      chTheaster.set({ mood: 'happy', armR: [45, -70], look: [0.5, 0.2], blink: blink(t) });
      shoot(CH.scene, chPeople, V3(-0.2, 1.9, -1.4), V3(0.0, 1.75, -2.0), V3(0.0, 1.4, -3.3), null, k, LOOKS.room, 1.4);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('keys', 5), 'ding', { gain: 0.8 });
  }

  // ── 7 · "but every banker refused to give him a renovation loan." (Banker angry) ──
  { const st = cut(6);
    add({ id: 'S07', at: st, note: 'commercial bank: haughty banker crosses arms, refuses loan', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      bkBanker.set({ mood: 'angry', armL: [35, -45], armR: [35, -45], look: [-0.6, 0.2] });
      bkTheaster.set({ mood: 'worried', sweat: 1, armL: [30, -90], look: [0.6, 0.3], blink: blink(t) });
      shoot(BK_IN.scene, bkPeople, V3(0.5, 1.85, 0.6), V3(0.8, 1.75, 0.1), V3(2.4, 1.5, -2.1), null, k, LOOKS.room);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('refused', 6), 'whoosh', { gain: 0.7 });
  }

  // ── 8 · "So Theaster walked into the ruined bathrooms," (Theaster inspects) ──
  { const st = cut(7);
    add({ id: 'S08', at: st, note: 'ruined bathroom: Theaster walks in, looking around thoughtfully', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      rmTheaster.at(-0.4 + k * 0.8, 0, -2.0);
      rmTheaster.set({ legs: 'walk', phase: t * 6, mood: 'neutral', armL: [25, 10], armR: [25, 10], look: [0.5, -0.4], blink: blink(t) });
      shoot(RM.scene, rmPeople, V3(0.0, 1.8, 0.8), V3(0.0, 1.7, -0.2), V3(0.0, 1.35, -2.0), null, k, LOOKS.room);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('bathrooms', 7), 'slide', { gain: 0.5 });
  }

  // ── 9 · "ripped the marble slabs off the walls," (Theaster pries marble) ──
  { const st = cut(8);
    add({ id: 'S09', at: st, note: 'Theaster pries ornate marble slab off the wall, pops free', draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      rmTheaster.at(0.2, 0, -2.8);
      rmTheaster.set({ mood: 'proud', armR: [45, -75], holdR: marbleSlab, armL: [30, -40], look: [0.3, 0.1], v: 'mb1' });
      shoot(RM.scene, rmPeople, V3(-0.6, 1.85, -1.2), V3(-0.3, 1.7, -1.8), V3(0.2, 1.4, -2.8), null, k, LOOKS.room, 1.3);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('ripped', 8), 'pop', { gain: 0.8 });
  }

  // ── 10 · "and carved them into luxury art pieces." (Finished art slab) ──
  { const st = cut(9);
    add({ id: 'S10', at: st, note: 'close-up on carved luxury marble slab "IN ART WE TRUST"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      glTheaster.group.visible = true; glCollector.group.visible = false;
      glTheaster.at(-0.1, 0, -2.4);
      glTheaster.set({ mood: 'smug', armR: [55, -85], holdR: marbleSlab, look: [0.2, -0.1], v: 'mb2' });
      shoot(GL.scene, glPeople, V3(-0.6, 1.65, -0.4), V3(-0.3, 1.55, -0.9), V3(-0.1, 1.15, -2.4), null, k, { ...LOOKS.gallery, fov: 40 }, 1.8);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('luxury', 9), 'sparkle', { gain: 0.7 });
  }

  // ── 11 · "He sold each piece to collectors for five grand," (Collector pays) ──
  { const st = cut(10);
    add({ id: 'S11', at: st, note: 'art collector throws stacks of money at Theaster, laughing', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      glTheaster.group.visible = glCollector.group.visible = true;
      glCollector.at(0.75, 0, -3.2);
      glCollector.set({ mood: 'laugh', armL: [60, -90], holdL: PROPS.stack, look: [-0.6, 0.2], v: 'stk' });
      glTheaster.at(-0.75, 0, -3.2);
      glTheaster.set({ mood: 'happy', armR: [45, -75], holdR: marbleSlab, look: [0.5, 0.2], blink: blink(t), v: 'mb3' });
      shoot(GL.scene, glPeople, V3(0.0, 1.6, 0.4), V3(0.0, 1.5, -0.2), V3(0.0, 1.1, -3.2), null, k, { ...LOOKS.gallery, fov: 42 });
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('grand', 10), 'ding', { gain: 0.8 });
  }

  // ── 12 · "raising millions to rebuild the entire palace" (Restored palace) ──
  { const st = cut(11), z = BK.z;
    add({ id: 'S12', at: st, note: 'wide street view: restored bank building gleaming in the sun', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      stTheaster.group.visible = true;
      stTheaster.at(-4.8, 0.18, z - 1.2);
      stTheaster.set({ mood: 'proud', armL: [140, 20], armR: [140, 20], blink: blink(t) });
      shoot(ST.scene, streetPeople(), V3(3.0, 5.0, z - 16.0), V3(0.5, 3.2, z - 10.0), V3(-5.0, 2.6, z - 1.0), null, k, LOOKS.street);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('palace', 11), 'ding', { gain: 0.7 });
  }

  // ── 13 · "using the building's own trash." (Theaster holding bill and marble) ──
  { const st = cut(12), z = BK.z;
    add({ id: 'S13', at: st, note: 'Theaster holds up the original $1 bill and marble piece', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      stTheaster.group.visible = true;
      stTheaster.at(-4.8, 0.18, z - 1.2);
      stTheaster.set({ mood: 'proud', armL: [45, -75], holdL: PROPS.bill, armR: [45, -75], holdR: marbleSlab, blink: blink(t), v: 'tr1' });
      shoot(ST.scene, streetPeople(), V3(-2.8, 2.0, z - 4.8), V3(-3.5, 1.8, z - 3.4), V3(-4.8, 1.45, z - 1.2), null, k, LOOKS.street, 1.8);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('trash', 12), 'sparkle', { gain: 0.7 });
  }

  // ── 14 · "Which is why nobody can believe that" (Punch-in smirk, loops to S01) ──
  { const st = cut(13), z = BK.z;
    add({ id: 'S14', at: st, note: 'tight punch-in to Theaster face, knowing smirk, seamless loop', draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      stTheaster.group.visible = true;
      stTheaster.at(-4.8, 0.18, z - 1.2);
      stTheaster.set({ mood: 'smug', look: [0.0, 0.0], armL: [20, 10], armR: [20, 10], blink: 0 });
      shoot(ST.scene, streetPeople(), V3(-3.8, 1.75, z - 2.8), V3(-4.2, 1.7, z - 2.2), V3(-4.8, 1.55, z - 1.2), null, k, LOOKS.street, 1.2);
      blit();
    } });
    cue(st, 'whoosh');
    cue(Wd('believe', 13), 'ding', { gain: 0.8 });
  }

  return { shots: S, cues: CUES };
}
