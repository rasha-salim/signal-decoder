import { NotePerformance, LevelNumber } from './note';
import { GameSession, LevelProgress, ChallengeDuration } from './game';

export interface PlayerProgress {
  currentLevel: LevelNumber;
  totalScore: number;
  totalPlayTime: number; // in seconds
  notePerformance: Record<string, NotePerformance>; // keyed by noteId
  sessions: GameSession[];
  achievements: Achievement[];
  levelProgress: Record<LevelNumber, LevelProgress>;
  lastPlayedAt: number; // timestamp
  createdAt: number; // timestamp
  unlockedAliens: string[]; // alien IDs
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number | null; // timestamp, null if locked
  condition: AchievementCondition;
}

export type AchievementCondition =
  | { type: 'streak'; value: number }
  | { type: 'accuracy'; value: number }
  | { type: 'totalCorrect'; value: number }
  | { type: 'speed'; value: number } // avg response time in ms
  | { type: 'levelComplete'; level: LevelNumber }
  | { type: 'notesMastered'; value: number }
  | { type: 'perfectRun' } // Complete a session with 100% accuracy
  | { type: 'totalSessions'; value: number }
  | { type: 'challengeScore'; duration: ChallengeDuration; score: number }
  | { type: 'allLevelsComplete' };

export interface ProgressStats {
  overallAccuracy: number;
  averageResponseTime: number;
  totalNotesAnswered: number;
  totalCorrectAnswers: number;
  notesMastered: number;
  currentStreak: number;
  bestStreak: number;
  hoursPlayed: number;
  levelsCompleted: number;
  aliensUnlocked: number;
}

export interface SessionStats {
  date: string; // ISO date string
  sessionsPlayed: number;
  notesAnswered: number;
  accuracy: number;
  averageTime: number;
  highestStreak: number;
}

// Initial progress state factory
export const createInitialProgress = (): PlayerProgress => ({
  currentLevel: 1,
  totalScore: 0,
  totalPlayTime: 0,
  notePerformance: {},
  sessions: [],
  achievements: [],
  levelProgress: {
    1: createInitialLevelProgress(1, true),
    2: createInitialLevelProgress(2, false),
    3: createInitialLevelProgress(3, false),
    4: createInitialLevelProgress(4, false),
    5: createInitialLevelProgress(5, false),
  },
  lastPlayedAt: Date.now(),
  createdAt: Date.now(),
  unlockedAliens: [],
});

export const createInitialLevelProgress = (
  level: LevelNumber,
  isUnlocked: boolean
): LevelProgress => ({
  level,
  isUnlocked,
  masteryPercentage: 0,
  practiceHighScore: 0,
  challengeHighScores: {
    30: 0,
    60: 0,
    90: 0,
  },
  totalPracticeTime: 0,
  noteMastery: {},
});

export const createInitialNotePerformance = (noteId: string): NotePerformance => ({
  noteId,
  totalAttempts: 0,
  correctAttempts: 0,
  averageResponseTime: 0,
  consecutiveCorrect: 0,
  lastSeen: 0,
  masteryLevel: 'new',
});
