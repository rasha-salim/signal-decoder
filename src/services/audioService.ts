// Audio Service for playing piano notes using Web Audio API

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

// Frequencies for piano notes (C4 to A5)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C4': 261.63,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88,
  'C5': 523.25,
  'D5': 587.33,
  'E5': 659.25,
  'F5': 698.46,
  'G5': 783.99,
  'A5': 880.00,
};

export interface PlayNoteOptions {
  duration?: number; // in seconds
  volume?: number; // 0 to 1
  type?: OscillatorType;
}

export const playNote = (
  noteId: string,
  options: PlayNoteOptions = {}
): void => {
  const {
    duration = 0.5,
    volume = 0.3,
    type = 'triangle'
  } = options;

  const frequency = NOTE_FREQUENCIES[noteId];
  if (!frequency) {
    console.warn(`Unknown note: ${noteId}`);
    return;
  }

  const ctx = getAudioContext();

  // Resume context if suspended (needed for browsers that require user interaction)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const currentTime = ctx.currentTime;

  // Create oscillator for main tone
  const oscillator = ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, currentTime);

  // Create gain node for volume envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, currentTime);

  // ADSR envelope for more natural piano sound
  // Attack
  gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.02);
  // Decay
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, currentTime + 0.1);
  // Sustain and Release
  gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

  // Add a second oscillator for richer sound (slight detune)
  const oscillator2 = ctx.createOscillator();
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(frequency * 2, currentTime); // One octave higher

  const gainNode2 = ctx.createGain();
  gainNode2.gain.setValueAtTime(0, currentTime);
  gainNode2.gain.linearRampToValueAtTime(volume * 0.15, currentTime + 0.02);
  gainNode2.gain.exponentialRampToValueAtTime(0.001, currentTime + duration * 0.5);

  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator2.connect(gainNode2);
  gainNode2.connect(ctx.destination);

  // Start and stop
  oscillator.start(currentTime);
  oscillator.stop(currentTime + duration);

  oscillator2.start(currentTime);
  oscillator2.stop(currentTime + duration * 0.5);
};

export const playCorrectSound = (): void => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const currentTime = ctx.currentTime;

  // Play a pleasant ascending chord
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, currentTime);

    gain.gain.setValueAtTime(0, currentTime + index * 0.05);
    gain.gain.linearRampToValueAtTime(0.15, currentTime + index * 0.05 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(currentTime + index * 0.05);
    osc.stop(currentTime + 0.5);
  });
};

export const playWrongSound = (): void => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const currentTime = ctx.currentTime;

  // Play a dissonant buzz
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, currentTime);
  osc.frequency.linearRampToValueAtTime(100, currentTime + 0.2);

  gain.gain.setValueAtTime(0.15, currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(currentTime);
  osc.stop(currentTime + 0.3);
};

export const playCountdownBeep = (isLast: boolean = false): void => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const currentTime = ctx.currentTime;
  const frequency = isLast ? 880 : 440; // Higher pitch for the last beep

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, currentTime);

  gain.gain.setValueAtTime(0.2, currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(currentTime);
  osc.stop(currentTime + 0.15);
};

export const initAudio = (): void => {
  // Initialize audio context on first user interaction
  getAudioContext();
};

export const resumeAudio = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
};
