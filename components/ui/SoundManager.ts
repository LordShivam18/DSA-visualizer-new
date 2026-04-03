// Minimal sound manager using Web Audio API
// Generates synth tones — no external audio files needed

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio not available
  }
}

export const sounds = {
  /** Soft positive blip — for push, match, step forward */
  push: () => playTone(880, 0.12, "sine", 0.06),

  /** Lower blip — for pop */
  pop: () => playTone(440, 0.15, "triangle", 0.06),

  /** Quick ascending duo — success / valid */
  success: () => {
    playTone(660, 0.15, "sine", 0.06);
    setTimeout(() => playTone(990, 0.2, "sine", 0.07), 100);
  },

  /** Descending buzz — error / mismatch / invalid */
  error: () => {
    playTone(300, 0.2, "sawtooth", 0.04);
    setTimeout(() => playTone(200, 0.25, "sawtooth", 0.03), 120);
  },

  /** Tiny tick — pointer movement, regular step */
  tick: () => playTone(1200, 0.06, "sine", 0.04),

  /** Soft click — button / UI interaction */
  click: () => playTone(600, 0.08, "triangle", 0.04),

  /** Reset swoosh */
  reset: () => {
    playTone(800, 0.1, "sine", 0.04);
    setTimeout(() => playTone(400, 0.15, "sine", 0.03), 60);
  },
};
