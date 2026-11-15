// Renderer + cartoon-film look: tone curve, soft shadows, environment light, bloom, depth of field, vignette + grain.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const W = 1080, H = 1920;
const Q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
export const RES = +(Q.get('res') || 1), AA = +(Q.get('aa') ?? 4), SHADOW = +(Q.get('shadow') || 2048);

const GRADE = {
  uniforms: {
    tDiffuse: { value: null },
    uVig: { value: 0.35 },
    uGrain: { value: 0.025 },
    uTime: { value: 0 },
    uWarm: { value: 0.04 },
    uSat: { value: 1.12 },
    uAspect: { value: 0.5625 }
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uVig, uGrain, uTime, uWarm, uSat, uAspect; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime * 7.13) * 43758.5453); }
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; d.x *= uAspect;
      c.rgb *= 1.0 - uVig * smoothstep(0.25, 0.75, length(d) * 1.4);
      c.rgb += (h(vUv * 1000.0) - 0.5) * uGrain; c.r += uWarm * 0.5; c.b -= uWarm * 0.5; float l = dot(c.rgb, vec3(0.299, 0.587, 0.114)); c.rgb = mix(vec3(l), c.rgb, uSat); gl_FragColor = c; }`,
};

export function makeEngine(canvas, { w = W, h = H, samples = 4, shadowSize = 2048, is16x9 = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(w, h, false); renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer), envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples });
  renderer.userData = { shadowSize };
  const composer = new EffectComposer(renderer, rt); composer.setSize(w, h);
  const rp = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera()); composer.addPass(rp);
  const bokeh = new BokehPass(rp.scene, rp.camera, { focus: 3, aperture: 0.002, maxblur: 0.008 }); composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.35, 0.6, 0.85); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GRADE);
  grade.uniforms.uAspect.value = w / h;
  composer.addPass(grade);

  return {
    renderer, envMap, composer, w, h, is16x9,
    render(scene, camera, look = {}) {
      if (camera.aspect !== w / h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      rp.scene = scene; rp.camera = camera; bokeh.scene = scene; bokeh.camera = camera;
      bokeh.enabled = (look.aperture ?? 0.0015) > 0;
      bokeh.uniforms.focus.value = look.focus ?? 3; bokeh.uniforms.aperture.value = look.aperture ?? 0.0015; bokeh.uniforms.maxblur.value = look.maxblur ?? 0.006;
      bloom.strength = look.bloom ?? 0.35; bloom.threshold = look.bloomThreshold ?? 0.85; bloom.radius = 0.6;
      renderer.toneMappingExposure = look.exposure ?? 1.0;
      grade.uniforms.uVig.value = look.vignette ?? 0.22; grade.uniforms.uGrain.value = look.grain ?? 0.008; grade.uniforms.uSat.value = look.sat ?? 1.14; grade.uniforms.uWarm.value = look.warm ?? 0.02; grade.uniforms.uTime.value = look.t ?? 0;
      composer.render();
    },
  };
}

export function lightRig(scene, { key = '#FFE2C2', keyI = 3.2, keyPos = [2.5, 4, 3], rimCol = '#BFD8FF', rimI = 2.2, sky = '#FFF4E6', ground = '#8C6E55', hemiI = 0.9, shadowBox = 3, target = [0, 1, 0] } = {}) {
  const g = new THREE.Group(); scene.add(g);
  const k = new THREE.DirectionalLight(key, keyI); k.position.set(...keyPos); k.target.position.set(...target); k.castShadow = true;
  k.shadow.mapSize.set(SHADOW, SHADOW); k.shadow.bias = -0.0004; k.shadow.normalBias = 0.02; k.shadow.radius = 6;
  Object.assign(k.shadow.camera, { left: -shadowBox, right: shadowBox, top: shadowBox, bottom: -shadowBox, near: 0.1, far: 30 }); k.shadow.camera.updateProjectionMatrix();
  g.add(k, k.target);
  const r = new THREE.DirectionalLight(rimCol, rimI); r.position.set(-3, 3, -3); g.add(r);
  g.add(new THREE.HemisphereLight(sky, ground, hemiI));
  return { key: k, rim: r, group: g };
}

export function camera(fov = 30) { return new THREE.PerspectiveCamera(fov, W / H, 0.05, 800); }
