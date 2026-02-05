// 80s-inspired 8-bit procedural music generator
// Creates epic synthwave chiptune background music

let audioContext: AudioContext | null = null;
let isPlaying = false;
let masterGain: GainNode | null = null;
let schedulerInterval: number | null = null;

// Musical constants
const BPM = 140;
const BEAT_TIME = 60 / BPM;

// Synthwave scale (A minor pentatonic + some chromatic notes for that 80s feel)
const SCALE = [
  220.00,  // A3
  261.63,  // C4
  293.66,  // D4
  329.63,  // E4
  392.00,  // G4
  440.00,  // A4
  523.25,  // C5
  587.33,  // D5
  659.25,  // E5
  783.99,  // G5
  880.00,  // A5
];

// Bass notes (lower octave)
const BASS_NOTES = [
  110.00,  // A2
  130.81,  // C3
  146.83,  // D3
  164.81,  // E3
  196.00,  // G3
];

// Epic chord progressions (Am - F - C - G style)
const CHORD_PROGRESSION = [
  [0, 2, 4],     // Am
  [1, 3, 5],     // F/C
  [2, 4, 6],     // C/E
  [1, 4, 6],     // G/B
];

// Melody patterns (index into scale)
const MELODY_PATTERNS = [
  [5, 7, 8, 7, 5, 4, 5, -1],
  [8, 10, 8, 7, 5, 7, 8, -1],
  [5, 5, 7, 8, 10, 8, 7, 5],
  [10, 8, 7, 5, 7, 8, 10, -1],
];

// Arpeggio patterns
const ARP_PATTERNS = [
  [0, 1, 2, 1],
  [0, 2, 1, 2],
  [2, 1, 0, 1],
  [0, 1, 2, 0],
];

let currentBeat = 0;
let currentBar = 0;
let currentPattern = 0;

const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Create a square wave oscillator (classic 8-bit sound)
const createSquareOsc = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number = 0.1
): void => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, startTime);

  // 8-bit style envelope
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.setValueAtTime(volume * 0.7, startTime + duration * 0.3);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(masterGain!);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
};

// Create a triangle wave for bass (warmer sound)
const createBassNote = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number
): void => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
  gain.gain.setValueAtTime(0.12, startTime + duration * 0.5);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(masterGain!);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
};

// Create noise percussion (hi-hat style)
const createNoise = (
  ctx: AudioContext,
  startTime: number,
  duration: number,
  volume: number = 0.05
): void => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  noise.buffer = buffer;
  filter.type = 'highpass';
  filter.frequency.value = 8000;

  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain!);

  noise.start(startTime);
  noise.stop(startTime + duration);
};

// Create kick drum
const createKick = (
  ctx: AudioContext,
  startTime: number
): void => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, startTime);
  osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.1);

  gain.gain.setValueAtTime(0.3, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

  osc.connect(gain);
  gain.connect(masterGain!);

  osc.start(startTime);
  osc.stop(startTime + 0.2);
};

// Schedule one bar of music
const scheduleBar = (ctx: AudioContext, barStartTime: number): void => {
  const chord = CHORD_PROGRESSION[currentBar % CHORD_PROGRESSION.length];
  const melodyPattern = MELODY_PATTERNS[currentPattern % MELODY_PATTERNS.length];
  const arpPattern = ARP_PATTERNS[currentBar % ARP_PATTERNS.length];

  for (let beat = 0; beat < 8; beat++) {
    const beatTime = barStartTime + (beat * BEAT_TIME / 2);

    // Kick on beats 0, 4
    if (beat % 4 === 0) {
      createKick(ctx, beatTime);
    }

    // Hi-hat on off-beats
    if (beat % 2 === 1) {
      createNoise(ctx, beatTime, 0.05, 0.04);
    }

    // Snare-like noise on beats 2, 6
    if (beat === 2 || beat === 6) {
      createNoise(ctx, beatTime, 0.1, 0.08);
    }

    // Bass on beats 0, 2, 4, 6
    if (beat % 2 === 0) {
      const bassNote = BASS_NOTES[chord[0] % BASS_NOTES.length];
      createBassNote(ctx, bassNote, beatTime, BEAT_TIME);
    }

    // Arpeggios (fast 8-bit style)
    const arpIndex = arpPattern[beat % arpPattern.length];
    const arpNote = SCALE[chord[arpIndex % chord.length]];
    if (arpNote) {
      createSquareOsc(ctx, arpNote, beatTime, BEAT_TIME / 2 * 0.8, 0.06);
    }

    // Melody
    const melodyIndex = melodyPattern[beat];
    if (melodyIndex >= 0 && melodyIndex < SCALE.length) {
      createSquareOsc(ctx, SCALE[melodyIndex], beatTime, BEAT_TIME * 0.9, 0.08);
    }
  }
};

// Main scheduler loop
const scheduler = (): void => {
  if (!audioContext || !isPlaying) return;

  const ctx = audioContext;
  const currentTime = ctx.currentTime;
  const barDuration = BEAT_TIME * 4;

  // Schedule ahead by 2 bars
  const scheduleAhead = barDuration * 2;

  while (currentBeat * barDuration < currentTime + scheduleAhead) {
    const barStartTime = currentBeat * barDuration;

    if (barStartTime >= currentTime) {
      scheduleBar(ctx, barStartTime);
    }

    currentBeat++;
    currentBar++;

    // Change pattern every 4 bars
    if (currentBar % 4 === 0) {
      currentPattern = Math.floor(Math.random() * MELODY_PATTERNS.length);
    }
  }
};

export const startMusic = (): void => {
  if (isPlaying) return;

  const ctx = initAudioContext();

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // Create master gain
  masterGain = ctx.createGain();
  masterGain.gain.value = 0.5;
  masterGain.connect(ctx.destination);

  isPlaying = true;
  currentBeat = 0;
  currentBar = 0;
  currentPattern = 0;

  // Start scheduler
  scheduler();
  schedulerInterval = window.setInterval(scheduler, 100);
};

export const stopMusic = (): void => {
  isPlaying = false;

  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }

  if (masterGain) {
    masterGain.gain.linearRampToValueAtTime(0, audioContext!.currentTime + 0.1);
  }
};

export const toggleMusic = (): boolean => {
  if (isPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
  return isPlaying;
};

export const setMusicVolume = (volume: number): void => {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
};

export const isMusicPlaying = (): boolean => isPlaying;
