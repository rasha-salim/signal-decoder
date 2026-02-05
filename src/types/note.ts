export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export interface Note {
  id: string;           // "C4", "D4", etc.
  name: NoteName;
  octave: 4 | 5;
  staffPosition: number; // Position on staff (0 = C4 on ledger line below staff)
  isLineNote: boolean;   // true if on a line, false if in a space
  needsLedgerLine: boolean; // true for C4 (middle C) and notes above the staff
  frequency: number;     // Frequency in Hz for audio playback
}

export interface NotePerformance {
  noteId: string;
  totalAttempts: number;
  correctAttempts: number;
  averageResponseTime: number; // in milliseconds
  consecutiveCorrect: number;
  lastSeen: number; // timestamp
  masteryLevel: MasteryLevel;
}

export type MasteryLevel = 'new' | 'learning' | 'practicing' | 'familiar' | 'mastered';

export interface NoteWithWeight extends Note {
  weight: number; // Selection weight for adaptive algorithm
}

// Alien character for collectibles
export interface AlienCharacter {
  id: string;
  name: string;
  note: NoteName;
  color: string;
  description: string;
  unlockedAt: LevelNumber;
}

export type LevelNumber = 1 | 2 | 3 | 4 | 5;
