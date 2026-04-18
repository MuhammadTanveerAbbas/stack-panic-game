let audioCtx: AudioContext | null = null;

/** Lazily initializes the AudioContext on first use to comply with browser autoplay policies. */
function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/**
 * Plays a synthesized tone using the Web Audio API.
 * Errors are silently swallowed  sound is non-critical.
 */
function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
): void {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore  audio context may be suspended or unavailable
  }
}

export const sounds = {
  spawn: () => playTone(600, 0.1, "sine", 0.08),
  resolve: () => {
    playTone(800, 0.1);
    setTimeout(() => playTone(1200, 0.15), 80);
  },
  crash: () => playTone(200, 0.3, "sawtooth", 0.12),
  levelUp: () => {
    playTone(523, 0.1);
    setTimeout(() => playTone(659, 0.1), 100);
    setTimeout(() => playTone(784, 0.15), 200);
  },
  gameOver: () => {
    playTone(400, 0.2);
    setTimeout(() => playTone(300, 0.2), 150);
    setTimeout(() => playTone(200, 0.4), 300);
  },
};
