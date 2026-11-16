// Tiny synthesized sound effects (Web Audio). The context is created on the first key press
// to satisfy browser autoplay rules.
import { save } from '../core/storage.js';

let ac = null;
let master = null;

function ready() {
  return ac && master && !save.settings.muted && ac.state === 'running';
}

function tone(freq, dur, { type = 'square', vol = 0.25, at = 0, slide = null } = {}) {
  if (!ready()) return;
  const t0 = ac.currentTime + at;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(dur, { vol = 0.3, at = 0, cutoff = 600 } = {}) {
  if (!ready()) return;
  const t0 = ac.currentTime + at;
  const len = Math.floor(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filt = ac.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = cutoff;
  const g = ac.createGain();
  g.gain.value = vol;
  src.connect(filt).connect(g).connect(master);
  src.start(t0);
}

export const sfx = {
  unlock() {
    try {
      if (!ac) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        ac = new Ctx();
        master = ac.createGain();
        master.gain.value = 0.35;
        master.connect(ac.destination);
      }
      if (ac.state === 'suspended') ac.resume();
    } catch {
      ac = null;
    }
  },
  /** Dialogue voice blip; each speaker has their own pitch. */
  blip(pitch = 440) {
    tone(pitch * (0.97 + Math.random() * 0.06), 0.045, { type: 'square', vol: 0.12 });
  },
  key(wrong = false) {
    if (wrong) tone(180, 0.05, { type: 'square', vol: 0.08 });
    else tone(900 + Math.random() * 200, 0.018, { type: 'triangle', vol: 0.1 });
  },
  move() {
    tone(520, 0.04, { type: 'square', vol: 0.1 });
  },
  confirm() {
    tone(660, 0.05, { type: 'square', vol: 0.14 });
    tone(990, 0.07, { type: 'square', vol: 0.14, at: 0.05 });
  },
  back() {
    tone(440, 0.06, { type: 'square', vol: 0.12, slide: 300 });
  },
  error() {
    tone(150, 0.12, { type: 'square', vol: 0.16 });
  },
  sent() {
    [523, 659, 784].forEach((f, i) => tone(f, 0.07, { type: 'triangle', vol: 0.18, at: i * 0.05 }));
  },
  befriend() {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((f, i) => tone(f, i === notes.length - 1 ? 0.4 : 0.1, { type: 'square', vol: 0.13, at: i * 0.1 }));
  },
  fail() {
    [392, 330, 262].forEach((f, i) => tone(f, 0.14, { type: 'triangle', vol: 0.18, at: i * 0.12 }));
  },
  gate() {
    noise(0.7, { vol: 0.5, cutoff: 400 });
    tone(80, 0.6, { type: 'sawtooth', vol: 0.08, slide: 50 });
  },
  /** Soft wing-beat while the owl flies. */
  step() {
    noise(0.08, { vol: 0.06, cutoff: 500 });
  },
};
