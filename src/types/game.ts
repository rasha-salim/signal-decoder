import { Note, LevelNumber } from './note';

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'finished';

export type GameMode = 'practice' | 'challenge';

export type ChallengeDuration = 30 | 60 | 90;

export interface GameState {
  status: GameStatus;
  mode: GameMode;
  currentNote: Note | null;
  score: number;
  streak: number;
  maxStreak: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswers: number;
  timeRemaining: number; // in seconds (for challenge mode)
  timeElapsed: number; // in seconds
  level: LevelNumber;
  showHint: boolean; // Show note letter hint (for practice mode)
  lastAnswerCorrect: boolean | null;
  highScore: number; // For current level/mode
}

export interface LevelConfig {
  level: LevelNumber;
  name: string;
  subtitle: string;
  description: string;
  mnemonic: string | null;
  availableNotes: string[]; // Note IDs
  unlockThreshold: number; // Percentage mastery needed to unlock
  color: string; // CSS variable name
  icon: string; // Emoji or icon identifier
}

export interface GameRound {
  noteId: string;
  isCorrect: boolean;
  responseTime: number; // milliseconds
  selectedAnswer: string;
  timestamp: number;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  level: LevelNumber;
  challengeDuration?: ChallengeDuration;
  startTime: number;
  endTime: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  maxStreak: number;
  rounds: GameRound[];
}

export interface LevelProgress {
  level: LevelNumber;
  isUnlocked: boolean;
  masteryPercentage: number;
  practiceHighScore: number;
  challengeHighScores: Record<ChallengeDuration, number>;
  totalPracticeTime: number; // seconds
  noteMastery: Record<string, number>; // noteId -> mastery percentage
}

export interface AnswerFeedback {
  isCorrect: boolean;
  correctNote: Note;
  pointsEarned: number;
  newStreak: number;
  isNewHighScore: boolean;
}

// Star thresholds for challenge mode (notes correct in time limit)
export interface StarThresholds {
  oneStar: number;
  twoStar: number;
  threeStar: number;
}

export const CHALLENGE_STAR_THRESHOLDS: Record<ChallengeDuration, StarThresholds> = {
  30: { oneStar: 8, twoStar: 12, threeStar: 18 },
  60: { oneStar: 15, twoStar: 25, threeStar: 35 },
  90: { oneStar: 25, twoStar: 40, threeStar: 55 },
};
