import { LevelConfig, ChallengeDuration } from '../types';
import { LevelNumber } from '../types/note';

export const LEVEL_CONFIGS: Record<LevelNumber, LevelConfig> = {
  1: {
    level: 1,
    name: 'Line Notes',
    subtitle: 'The First Signal',
    description: 'Learn the 5 line notes: E-G-B-D-F',
    mnemonic: 'Every Good Boy Does Fine',
    availableNotes: ['E4', 'G4', 'B4', 'D5', 'F5'],
    unlockThreshold: 0, // Always unlocked
    color: 'var(--level-1)',
    icon: 'satellite',
  },
  2: {
    level: 2,
    name: 'Space Notes',
    subtitle: 'Hidden Frequencies',
    description: 'Learn the 4 space notes: F-A-C-E',
    mnemonic: 'FACE',
    availableNotes: ['F4', 'A4', 'C5', 'E5'],
    unlockThreshold: 70, // 70% mastery of Level 1
    color: 'var(--level-2)',
    icon: 'stars',
  },
  3: {
    level: 3,
    name: 'Full Staff',
    subtitle: 'Complete Transmission',
    description: 'Mix all 9 staff notes together',
    mnemonic: null,
    availableNotes: ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'],
    unlockThreshold: 70, // 70% mastery of Level 2
    color: 'var(--level-3)',
    icon: 'radio',
  },
  4: {
    level: 4,
    name: 'Below the Staff',
    subtitle: 'Deep Space Signal',
    description: 'Add Middle C and D below the staff',
    mnemonic: null,
    availableNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'],
    unlockThreshold: 70,
    color: 'var(--level-4)',
    icon: 'planet',
  },
  5: {
    level: 5,
    name: 'Full Range',
    subtitle: 'Master Decoder',
    description: 'Complete mastery: C4 to A5',
    mnemonic: null,
    availableNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'],
    unlockThreshold: 70,
    color: 'var(--level-5)',
    icon: 'galaxy',
  },
};

// Challenge mode durations
export const CHALLENGE_DURATIONS: ChallengeDuration[] = [30, 60, 90];

// Star thresholds for challenge mode (based on correct answers)
interface StarThresholds {
  oneStar: number;
  twoStar: number;
  threeStar: number;
}

export const CHALLENGE_STAR_THRESHOLDS: Record<ChallengeDuration, StarThresholds> = {
  30: { oneStar: 8, twoStar: 12, threeStar: 18 },
  60: { oneStar: 15, twoStar: 25, threeStar: 35 },
  90: { oneStar: 25, twoStar: 40, threeStar: 55 },
};

// Mastery thresholds
export const MASTERY_THRESHOLDS = {
  // Number of consecutive correct answers to consider a note "mastered"
  consecutiveCorrectForMastery: 5,
  // Minimum accuracy percentage to progress
  minimumAccuracyForProgress: 70,
  // Points per correct answer
  pointsPerCorrect: 10,
  // Streak bonus multiplier (streak * this value added to points)
  streakBonusMultiplier: 2,
};

// Practice mode settings
export const PRACTICE_SETTINGS = {
  // Show hint after this many wrong attempts on same note
  showHintAfterWrongAttempts: 2,
  // Delay before showing next note (ms)
  nextNoteDelay: 800,
  // Delay after wrong answer (ms) - shows correct answer
  wrongAnswerDelay: 1500,
};

// Challenge mode settings
export const CHALLENGE_SETTINGS = {
  // Countdown before challenge starts (seconds)
  countdownDuration: 3,
  // Delay between notes in challenge mode (ms)
  nextNoteDelay: 300,
};

// Spaced repetition weights
export const SPACED_REPETITION = {
  // Weight multiplier for notes answered wrong recently
  wrongAnswerWeight: 3.0,
  // Weight multiplier for notes not seen recently
  notSeenWeight: 2.0,
  // Weight for new notes (not yet attempted)
  newNoteWeight: 1.5,
  // Base weight for mastered notes
  masteredNoteWeight: 0.5,
};

export const getLevelConfig = (level: LevelNumber): LevelConfig => {
  return LEVEL_CONFIGS[level];
};

export const getNextLevel = (currentLevel: LevelNumber): LevelNumber | null => {
  if (currentLevel >= 5) return null;
  return (currentLevel + 1) as LevelNumber;
};

export const isLevelUnlocked = (
  level: LevelNumber,
  previousLevelMastery: number
): boolean => {
  if (level === 1) return true;
  const config = LEVEL_CONFIGS[level];
  return previousLevelMastery >= config.unlockThreshold;
};
