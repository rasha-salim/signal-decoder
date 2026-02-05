import { Note, NoteName, AlienCharacter, LevelNumber } from '../types';

// Staff positions: C4=0, D4=1, E4=2, F4=3, G4=4, A4=5, B4=6, C5=7, D5=8, E5=9, F5=10, G5=11, A5=12
// Line notes (on lines): E4, G4, B4, D5, F5
// Space notes (in spaces): D4, F4, A4, C5, E5, G5
// C4 needs a ledger line below, A5 needs ledger line above

export const NOTES: Note[] = [
  {
    id: 'C4',
    name: 'C',
    octave: 4,
    staffPosition: 0,
    isLineNote: true, // On ledger line
    needsLedgerLine: true,
    frequency: 261.63,
  },
  {
    id: 'D4',
    name: 'D',
    octave: 4,
    staffPosition: 1,
    isLineNote: false, // Below bottom line (in space below staff)
    needsLedgerLine: false,
    frequency: 293.66,
  },
  {
    id: 'E4',
    name: 'E',
    octave: 4,
    staffPosition: 2,
    isLineNote: true, // On bottom line (Line 1)
    needsLedgerLine: false,
    frequency: 329.63,
  },
  {
    id: 'F4',
    name: 'F',
    octave: 4,
    staffPosition: 3,
    isLineNote: false, // First space
    needsLedgerLine: false,
    frequency: 349.23,
  },
  {
    id: 'G4',
    name: 'G',
    octave: 4,
    staffPosition: 4,
    isLineNote: true, // Second line (Line 2)
    needsLedgerLine: false,
    frequency: 392.00,
  },
  {
    id: 'A4',
    name: 'A',
    octave: 4,
    staffPosition: 5,
    isLineNote: false, // Second space
    needsLedgerLine: false,
    frequency: 440.00,
  },
  {
    id: 'B4',
    name: 'B',
    octave: 4,
    staffPosition: 6,
    isLineNote: true, // Third line (Line 3 - middle line)
    needsLedgerLine: false,
    frequency: 493.88,
  },
  {
    id: 'C5',
    name: 'C',
    octave: 5,
    staffPosition: 7,
    isLineNote: false, // Third space
    needsLedgerLine: false,
    frequency: 523.25,
  },
  {
    id: 'D5',
    name: 'D',
    octave: 5,
    staffPosition: 8,
    isLineNote: true, // Fourth line (Line 4)
    needsLedgerLine: false,
    frequency: 587.33,
  },
  {
    id: 'E5',
    name: 'E',
    octave: 5,
    staffPosition: 9,
    isLineNote: false, // Fourth space
    needsLedgerLine: false,
    frequency: 659.25,
  },
  {
    id: 'F5',
    name: 'F',
    octave: 5,
    staffPosition: 10,
    isLineNote: true, // Top line (Line 5)
    needsLedgerLine: false,
    frequency: 698.46,
  },
  {
    id: 'G5',
    name: 'G',
    octave: 5,
    staffPosition: 11,
    isLineNote: false, // Space above staff
    needsLedgerLine: false,
    frequency: 783.99,
  },
  {
    id: 'A5',
    name: 'A',
    octave: 5,
    staffPosition: 12,
    isLineNote: true, // On ledger line above
    needsLedgerLine: true,
    frequency: 880.00,
  },
];

export const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const getNoteById = (id: string): Note | undefined => {
  return NOTES.find((note) => note.id === id);
};

export const getNotesByIds = (ids: string[]): Note[] => {
  return NOTES.filter((note) => ids.includes(note.id));
};

// Line notes mnemonic: "Every Good Boy Does Fine" (E, G, B, D, F)
// Mapped to alien names for the sci-fi theme
export const LINE_NOTES_MNEMONIC = {
  phrase: 'Every Good Boy Does Fine',
  aliens: 'Echo, Grix, Blip, Dex, Flux',
};

// Space notes spell "FACE"
export const SPACE_NOTES_MNEMONIC = {
  phrase: 'FACE',
  aliens: 'Flux, Ace, Cosmo, Echo',
};

// Helper to get the display name for a note
export const getNoteDisplayName = (note: Note): string => {
  return `${note.name}${note.octave}`;
};

// Alien characters - one for each note letter
export const ALIEN_CHARACTERS: AlienCharacter[] = [
  {
    id: 'cosmo',
    name: 'Cosmo the Captain',
    note: 'C',
    color: 'var(--alien-cosmo)',
    description: 'Commander of the Space Station. Wise and calm.',
    unlockedAt: 2,
  },
  {
    id: 'dex',
    name: 'Dex the Decoder',
    note: 'D',
    color: 'var(--alien-dex)',
    description: 'Expert at decoding alien signals. Quick thinker.',
    unlockedAt: 4,
  },
  {
    id: 'echo',
    name: 'Echo the Explorer',
    note: 'E',
    color: 'var(--alien-echo)',
    description: 'First alien you meet. Friendly and curious.',
    unlockedAt: 1,
  },
  {
    id: 'flux',
    name: 'Flux the Finder',
    note: 'F',
    color: 'var(--alien-flux)',
    description: 'Can find anything in the galaxy. Energetic.',
    unlockedAt: 2,
  },
  {
    id: 'grix',
    name: 'Grix the Guide',
    note: 'G',
    color: 'var(--alien-grix)',
    description: 'Knows every star system. Patient teacher.',
    unlockedAt: 1,
  },
  {
    id: 'ace',
    name: 'Ace the Adventurer',
    note: 'A',
    color: 'var(--alien-ace)',
    description: 'Brave explorer of unknown worlds. Bold.',
    unlockedAt: 2,
  },
  {
    id: 'blip',
    name: 'Blip the Brave',
    note: 'B',
    color: 'var(--alien-blip)',
    description: 'Small but mighty. Never gives up.',
    unlockedAt: 1,
  },
];

export const getAlienByNote = (noteName: NoteName): AlienCharacter | undefined => {
  return ALIEN_CHARACTERS.find((alien) => alien.note === noteName);
};

export const getAliensForLevel = (level: LevelNumber): AlienCharacter[] => {
  return ALIEN_CHARACTERS.filter((alien) => alien.unlockedAt <= level);
};
