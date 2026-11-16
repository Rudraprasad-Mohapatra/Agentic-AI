// WHERE DOES YOUR MONEY ACTUALLY GO? - Cinematic Comedy Short
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.2) < 0.12 ? 1 : 0);

const LOOK = {
  hero: {
    body: '#2B5EAA',
    pattern: 'vest',
    patCol: '#1E3F75',
    hat: 'cap',
    hatCol: '#2E2E3A',
    neck: 'tie',
    neckCol: '#D4AF37',
    head: '#F7EDE2',
    extra: []
  },
  heroShades: {
    body: '#2B5EAA',
    pattern: 'vest',
    patCol: '#1E3F75',
    hat: 'cap',
    hatCol: '#2E2E3A',
    neck: 'tie',
    neckCol: '#D4AF37',
    head: '#F7EDE2',
    extra: ['glasses']
  }
};

const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

export function buildShots(E, { is16x9 = false, W: vw = 1080, H: vh = 1920 } = {}) {
  const S = [], cues = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => cues.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(is16x9 ? 34 : 40);
  cam.aspect = vw / vh;
  cam.updateProjectionMatrix();

  const LOOKS = {
    street: { bloom: 0.26, aperture: 0, maxblur: 0, vignette: 0.22, sat: 1.22 },
    store: { bloom: 0.32, aperture: 0, maxblur: 0, vignette: 0.28, sat: 1.18, warm: 0.05 },
    macro: { bloom: 0.40, aperture: 0.08, maxblur: 0.04, vignette: 0.34, sat: 1.25, warm: 0.08 },
    dramatic: { bloom: 0.45, aperture: 0, maxblur: 0, vignette: 0.42, sat: 1.10 }
  };

  const shoot = (scene, people, from, to, at, at2, k, look) => {
    const fov = (look.fov || (is16x9 ? 34 : 40));
    if (cam.fov !== fov || cam.aspect !== vw / vh) {
      cam.fov = fov; cam.aspect = vw / vh; cam.updateProjectionMatrix();
    }
    cam.position.copy(mix(from, to, k));
    cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: 2.5 });
  };

  // 1. Build 3D Sets
  const streetSet = WD.mainStreet(E, { shops: ['LUXURY OUTLET', 'COFFEE & CO', 'SAVINGS BANK'] });
  const shopSet = WD.interior(E, { wall: '#B85545', motif: '#8E2835', signText: 'LUXURY OUTLET' });

  // 2. Build 3D Cinematic Props
  const counter = PR.storeCounter();
  counter.position.set(0, 0, 0);
  shopSet.scene.add(counter);

  const wallet = PR.bifoldWallet();
  wallet.position.set(0, 1.24, 0.35);
  shopSet.scene.add(wallet);

  const moneyFly = PR.wingedDollar();
  moneyFly.position.set(0, 1.30, 0.35);
  shopSet.scene.add(moneyFly);

  // 3. Characters
  const heroStreet = person('hero', { height: 1.95 });
  streetSet.scene.add(heroStreet.group);
  heroStreet.at(0, 0, 0);

  const heroStore = person('hero', { height: 1.95 });
  shopSet.scene.add(heroStore.group);
  heroStore.at(-0.85, 0, 0.3);

  const lineActive = (i, t) => t >= L(i) && t <= Le(i);

  // -------------------------------------------------------------
  // SHOT 0: Line 0 (Ever wonder where your money actually goes?)
  // -------------------------------------------------------------
  add({
    id: 'shot_0_hook',
    at: cut(0),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      heroStreet.set({
        mood: 'smug',
        blink: blink(t),
        talk: talk(t, lineActive(0, t)),
        armR: [35, 20],
        armL: [10, 15]
      });
      // Cinematic dolly push-in
      shoot(streetSet.scene, [heroStreet],
        V3(0.0, 1.6, 4.2), V3(0.0, 1.5, 2.9),
        V3(0.0, 1.25, 0), null,
        k, LOOKS.street
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 1: Line 1 (You work forty hours feeling like an absolute boss,)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_1_boss',
    at: cut(1),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      heroStreet.restyle({ extra: ['glasses'] });
      heroStreet.set({
        mood: 'proud',
        legs: 'walk',
        phase: t * 3.5,
        lean: Math.sin(t * 7) * 0.05,
        armR: [45 + Math.sin(t * 7) * 20, 20],
        armL: [45 - Math.sin(t * 7) * 20, 20],
        talk: talk(t, lineActive(1, t))
      });
      // Low-angle hero tracking shot
      shoot(streetSet.scene, [heroStreet],
        V3(-0.4, 0.9, 2.8), V3(0.4, 1.1, 2.2),
        V3(0.0, 1.2, 0), null,
        k, { ...LOOKS.street, sat: 1.35 }
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 2: Line 2 (and you strut into the store ready to spend.)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_2_enter_store',
    at: cut(2),
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      wallet.visible = false;
      moneyFly.visible = false;
      heroStore.restyle({ extra: [] });
      heroStore.set({
        mood: 'happy',
        legs: 'walk',
        phase: t * 2.8,
        armR: [30, 20],
        talk: talk(t, lineActive(2, t))
      });
      // Pan from counter to walking hero
      shoot(shopSet.scene, [heroStore],
        V3(1.2, 1.6, 3.2), V3(0.2, 1.5, 2.5),
        V3(-0.4, 1.2, 0), null,
        k, LOOKS.store
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 3: Line 3 (You reach into your pocket, pull out your leather wallet,)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_3_reach_wallet',
    at: cut(3),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      wallet.visible = true;
      wallet.setOpen(0); // completely closed
      moneyFly.visible = false;

      // Character pulls out wallet
      heroStore.at(-0.45, 0, 0.2);
      heroStore.set({
        mood: 'smug',
        armR: [65 - k * 20, 45],
        armL: [15, 20],
        talk: talk(t, lineActive(3, t))
      });

      // Medium push to the hand placing wallet on counter
      shoot(shopSet.scene, [heroStore],
        V3(0.6, 1.6, 2.4), V3(0.2, 1.42, 1.6),
        V3(0.0, 1.2, 0.2), null,
        k, LOOKS.store
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 4: Line 4 (flip it wide open,)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_4_flip_open',
    at: cut(4),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      const openK = eo(clamp(k * 1.5));
      wallet.visible = true;
      wallet.setOpen(openK); // Hinge creaks open
      moneyFly.visible = false;

      heroStore.set({
        mood: openK > 0.6 ? 'shock' : 'smug',
        sweat: openK > 0.7,
        blink: 0,
        talk: talk(t, lineActive(4, t))
      });

      // Cinematic SNAP ZOOM directly over the bifold hinge!
      shoot(shopSet.scene, [heroStore],
        V3(0.35, 1.60, 1.25), V3(0.05, 1.42, 0.78),
        V3(0.0, 1.23, 0.35), null,
        openK, { ...LOOKS.macro, focus: 0.75 }
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 5: Line 5 (and there is nothing inside except a solitary spiderweb.)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_5_spiderweb',
    at: cut(5),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      wallet.visible = true;
      wallet.setOpen(1.0); // wide open flat
      moneyFly.visible = false;

      // Hero in the background is frozen in utter shock
      heroStore.set({
        mood: 'shock',
        sweat: true,
        mouth: 1.0,
        talk: talk(t, lineActive(5, t))
      });

      // Macro Top-Down / High-Angle Close Up on the Spiderweb
      const wobble = Math.sin(t * 2) * 0.02;
      shoot(shopSet.scene, [heroStore],
        V3(0.0 + wobble, 1.75, 0.85), V3(0.0 - wobble, 1.65, 0.75),
        V3(0.0, 1.24, 0.35), null,
        k, { ...LOOKS.macro, focus: 0.65 }
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 6: Line 6 (And before you can even blink,)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_6_blink_suspense',
    at: cut(6),
    draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d));
      wallet.visible = true;
      wallet.setOpen(1.0);
      moneyFly.visible = false;

      // Close-up on the hero's face blinking in disbelief
      heroStore.at(0, 0, 0);
      heroStore.set({
        mood: 'worried',
        blink: blink(t * 3), // rapid nervous blinking
        sweat: true,
        talk: talk(t, lineActive(6, t))
      });

      // Push right into character's eyes
      shoot(shopSet.scene, [heroStore],
        V3(0.0, 1.70, 1.8), V3(0.0, 1.62, 1.2),
        V3(0.0, 1.55, 0), null,
        k, LOOKS.dramatic
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 7: Line 7 (your last dollar bill sprouts wings and flies away forever.)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_7_winged_dollar_fly',
    at: cut(7),
    draw(lt, d, t, blit) {
      const k = clamp(lt / d);
      wallet.visible = true;
      wallet.setOpen(1.0);
      moneyFly.visible = true;

      // Upward flight progress
      const flightK = eo(k);
      moneyFly.update(t, flightK);

      // Hero reaches hands helplessly upward in background
      heroStore.at(0, 0, 0);
      heroStore.set({
        mood: 'sad',
        tears: true,
        armR: [120, 25],
        armL: [120, 25],
        talk: talk(t, lineActive(7, t))
      });

      // Dramatic macro tracking shot centered right on the winged dollar with wings in full view!
      const dollarY = moneyFly.position.y;
      shoot(shopSet.scene, [heroStore],
        V3(0.0, dollarY + 0.1, 2.3), V3(0.0, dollarY + 0.25, 2.1),
        V3(moneyFly.position.x, dollarY, moneyFly.position.z), null,
        flightK, { ...LOOKS.macro, focus: 1.8, bloom: 0.45 }
      );
      blit();
    }
  });

  // ---------------------------------------------------------------------------------
  // SHOT 8: Line 8 (Leaving you broke until next payday.)
  // ---------------------------------------------------------------------------------
  add({
    id: 'shot_8_payday_ending',
    at: cut(8),
    draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      wallet.visible = true;
      wallet.setOpen(1.0);
      moneyFly.visible = false; // already flew away!

      // Wide comedic isolation: character slumped over
      heroStore.at(0, 0, 0);
      heroStore.set({
        mood: 'sad',
        tears: true,
        lean: 0.12,
        armR: [10, 10],
        armL: [10, 10],
        talk: talk(t, lineActive(8, t))
      });

      // Wide pull-out leaving character alone in frame
      shoot(shopSet.scene, [heroStore],
        V3(0.0, 1.5, 2.2), V3(0.0, 1.7, 4.4),
        V3(0.0, 1.15, 0), null,
        k, { ...LOOKS.dramatic, vignette: 0.55 }
      );
      blit();
    }
  });

  return { shots: S, cues };
}
