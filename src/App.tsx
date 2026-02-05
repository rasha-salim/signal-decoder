import { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './components/screens/HomeScreen';
import { MusicToggle } from './components/common';
import { GameScreen, GameResults } from './components/screens/GameScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { GameMode, ChallengeDuration, LevelProgress } from './types';
import { LevelNumber } from './types/note';
import { createInitialLevelProgress } from './types/progress';
import { initAudio } from './services/audioService';
import './styles/global.css';

type Screen = 'home' | 'game' | 'results';

interface GameConfig {
  mode: GameMode;
  level: LevelNumber;
  duration?: ChallengeDuration;
}

// Storage key for level progress
const STORAGE_KEY = 'signal-decoder-progress';

// Load progress from localStorage
const loadProgress = (): Record<LevelNumber, LevelProgress> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }

  // Default progress - only level 1 unlocked
  return {
    1: createInitialLevelProgress(1, true),
    2: createInitialLevelProgress(2, false),
    3: createInitialLevelProgress(3, false),
    4: createInitialLevelProgress(4, false),
    5: createInitialLevelProgress(5, false),
  };
};

// Save progress to localStorage
const saveProgress = (progress: Record<LevelNumber, LevelProgress>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: 'practice',
    level: 1,
  });
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const [levelProgress, setLevelProgress] = useState<Record<LevelNumber, LevelProgress>>(loadProgress);

  // Initialize audio on mount
  useEffect(() => {
    initAudio();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(levelProgress);
  }, [levelProgress]);

  const handleStartGame = useCallback(
    (mode: GameMode, level: LevelNumber, duration?: ChallengeDuration) => {
      setGameConfig({ mode, level, duration });
      setCurrentScreen('game');
    },
    []
  );

  const handleGameEnd = useCallback(
    (results: GameResults) => {
      setGameResults(results);

      // Update level progress
      setLevelProgress((prev) => {
        const updated = { ...prev };
        const levelData = { ...updated[results.level] };

        // Update mastery percentage based on accuracy
        if (results.accuracy > levelData.masteryPercentage) {
          levelData.masteryPercentage = Math.min(100, results.accuracy);
        }

        // Update high scores
        if (results.mode === 'practice') {
          if (results.score > levelData.practiceHighScore) {
            levelData.practiceHighScore = results.score;
          }
        } else if (results.mode === 'challenge' && results.duration) {
          if (results.correctAnswers > levelData.challengeHighScores[results.duration]) {
            levelData.challengeHighScores[results.duration] = results.correctAnswers;
          }
        }

        updated[results.level] = levelData;

        // Check if next level should be unlocked
        if (results.level < 5 && levelData.masteryPercentage >= 70) {
          const nextLevel = (results.level + 1) as LevelNumber;
          if (!updated[nextLevel].isUnlocked) {
            updated[nextLevel] = { ...updated[nextLevel], isUnlocked: true };
          }
        }

        return updated;
      });

      setCurrentScreen('results');
    },
    []
  );

  const handlePlayAgain = useCallback(() => {
    setCurrentScreen('game');
  }, []);

  const handleHome = useCallback(() => {
    setCurrentScreen('home');
    setGameResults(null);
  }, []);

  const handleNextLevel = useCallback(() => {
    if (gameConfig.level < 5) {
      setGameConfig((prev) => ({
        ...prev,
        level: (prev.level + 1) as LevelNumber,
      }));
      setCurrentScreen('game');
    }
  }, [gameConfig.level]);

  const handleExitGame = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  // Check if next level was just unlocked
  const canUnlockNextLevel = gameResults
    ? gameResults.level < 5 &&
      gameResults.accuracy >= 70 &&
      levelProgress[(gameResults.level + 1) as LevelNumber]?.isUnlocked
    : false;

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={handleStartGame}
          levelProgress={levelProgress}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          mode={gameConfig.mode}
          level={gameConfig.level}
          duration={gameConfig.duration}
          onGameEnd={handleGameEnd}
          onExit={handleExitGame}
        />
      )}

      {currentScreen === 'results' && gameResults && (
        <ResultsScreen
          results={gameResults}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
          onNextLevel={handleNextLevel}
          canUnlockNextLevel={canUnlockNextLevel}
        />
      )}

      {/* Global music toggle */}
      <MusicToggle />
    </div>
  );
}

export default App;
