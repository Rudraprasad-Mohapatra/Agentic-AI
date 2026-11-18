// Captions: ONE word at a time, white heavy sans with a black outline and soft drop shadow.
import { ctx, clamp, lerp, seg, eob } from './lib.js';
import { T, lineWords } from './timing.js';

export const CAP = { y: 1340, size: 84, maxW: 960 };
let caps = [];
const SHORT = /^(a|an|the|to|of|in|on|at|by|and|but|or|so|is|it|he|she|we|i|his|her|my|no|up|for|was)$/i;

function autoChunks(ws) {
  const out = [];
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i], n = ws[i + 1], bare = w.replace(/[^A-Za-z']/g, '');
    if (n && SHORT.test(bare) && !/[,.!?;:]$/.test(w) && (w + n).length <= 11) { out.push([i, i + 1]); i++; } else out.push([i, i]);
  }
  return out;
}

export function buildCaptions(script) {
  caps = [];
  script.lines.forEach((ln, i) => {
    const ws = lineWords(i); if (!ws.length) return;
    const textWords = ln.text.split(/\s+/).filter(Boolean);
    const spoken = ws.length === textWords.length ? textWords : ws.map((w) => w.w);
    if (ln.caps) {
      const nm = (w) => String(w).toLowerCase().replace(/[^a-z0-9']+/g, '');
      let from = 0;
      ln.caps.split('|').map((c) => c.trim()).filter(Boolean).forEach((c, j) => {
        const first = nm(c.split(/\s+/)[0]);
        let idx = j === 0 ? 0 : ws.findIndex((w, k) => k > from && nm(w.w) === first);
        if (idx < 0) idx = Math.min(ws.length - 1, from + 1);
        from = idx; caps.push({ line: i, s: ws[idx].s - 0.03, text: c.replace(/\*/g, '') });
      });
    } else autoChunks(spoken).forEach(([a, b]) => caps.push({ line: i, s: ws[a].s - 0.03, text: spoken.slice(a, b + 1).join(' ') }));
  });
  caps.forEach((c, k) => {
    const next = caps[k + 1];
    const lineEnd = T.lines[c.line].end;
    c.e = next ? (next.s - lineEnd > 0.6 && next.line !== c.line ? lineEnd + 0.25 : next.s) : Math.min(lineEnd + 0.8, T.dur);
  });
  return caps;
}
export const captionList = () => caps.map((c) => ({ ...c, words: [{ txt: c.text }] }));

/** draw one caption text at x, y */
export function captionText(text, x = 540, y = CAP.y, sc = 1, maxW = CAP.maxW) {
  const size = CAP.size;
  ctx.save(); ctx.font = `900 ${size}px Inter`; ctx.letterSpacing = '0px';
  const fit = Math.min(1, maxW / (ctx.measureText(text).width || 1));
  ctx.translate(x, y); ctx.scale(sc * fit, sc * fit); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillText(text, 3, 9);
  ctx.lineWidth = 16; ctx.strokeStyle = '#0B0B12'; ctx.strokeText(text, 0, 0);
  ctx.fillStyle = '#FFFFFF'; ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function drawCaption(t, w = 1080, h = 1920) {
  const c = caps.find((c) => t >= c.s && t < c.e); if (!c) return;
  const lt = t - c.s;
  const is16x9 = w > h;
  const cx = w / 2;
  const cy = is16x9 ? h - 130 : 1340;
  const maxW = is16x9 ? 1400 : 960;
  captionText(c.text, cx, cy, lt < 0.1 ? lerp(0.86, 1, eob(seg(lt, 0, 0.1))) : 1, maxW);
}
