import React from 'react';
import { GameResults } from './GameScreen';
import { LEVEL_CONFIGS, CHALLENGE_STAR_THRESHOLDS } from '../../constants';
import { ChallengeDuration } from '../../types';
import './ResultsScreen.css';

interface ResultsScreenProps {
  results: GameResults;
  onPlayAgain: () => void;
  onHome: () => void;
  onNextLevel?: () => void;
  canUnlockNextLevel?: boolean;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  onPlayAgain,
  onHome,
  onNextLevel,
  canUnlockNextLevel = false,
}) => {
  const levelConfig = LEVEL_CONFIGS[results.level];

  // Calculate stars for challenge mode
  const getStars = (): number => {
    if (results.mode !== 'challenge' || !results.duration) return 0;

    const thresholds = CHALLENGE_STAR_THRESHOLDS[results.duration as ChallengeDuration];
    if (results.correctAnswers >= thresholds.threeStar) return 3;
    if (results.correctAnswers >= thresholds.twoStar) return 2;
    if (results.correctAnswers >= thresholds.oneStar) return 1;
    return 0;
  };

  const stars = getStars();
  const accuracyGrade = getAccuracyGrade(results.accuracy);

  return (
    <div className="results-screen">
      {/* Animated stars background */}
      <div className="results-stars">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="result-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="results-header">
        <h1 className="results-title">{getResultTitle(results.accuracy)}</h1>
        <p className="results-subtitle">
          {results.mode === 'practice' ? 'Practice' : `${results.duration}s Challenge`} - {levelConfig.name}
        </p>
      </header>

      {/* Score display */}
      <section className="score-section">
        <div className="final-score">
          <span className="score-value">{results.score.toLocaleString()}</span>
          <span className="score-label">Points</span>
        </div>

        {/* Stars for challenge mode */}
        {results.mode === 'challenge' && (
          <div className="stars-display">
            {[1, 2, 3].map((starNum) => (
              <span
                key={starNum}
                className={`star ${starNum <= stars ? 'earned' : 'empty'}`}
              >
                *
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Stats grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <span className={`stat-value grade-${accuracyGrade}`}>
            {Math.round(results.accuracy)}%
          </span>
          <span className="stat-label">Accuracy</span>
        </div>
        <div className="stat-card">
          <span className="stat-value correct">
            {results.correctAnswers}
          </span>
          <span className="stat-label">Correct</span>
        </div>
        <div className="stat-card">
          <span className="stat-value streak">
            {results.maxStreak}
          </span>
          <span className="stat-label">Best Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {results.wrongAnswers}
          </span>
          <span className="stat-label">Mistakes</span>
        </div>
      </section>

      {/* Level progress message */}
      {canUnlockNextLevel && results.level < 5 && (
        <section className="unlock-section">
          <div className="unlock-message">
            <span className="unlock-icon">!</span>
            <span className="unlock-text">
              Level {results.level + 1} Unlocked!
            </span>
          </div>
        </section>
      )}

      {/* Tip based on performance */}
      <section className="tip-section">
        <p className="tip-text">{getTip(results)}</p>
      </section>

      {/* Actions */}
      <section className="actions-section">
        <button className="btn-play-again" onClick={onPlayAgain}>
          Play Again
        </button>

        {canUnlockNextLevel && results.level < 5 && onNextLevel && (
          <button className="btn-next-level" onClick={onNextLevel}>
            Try Level {results.level + 1}
          </button>
        )}

        <button className="btn-home" onClick={onHome}>
          Back to Menu
        </button>
      </section>
    </div>
  );
};

const getResultTitle = (accuracy: number): string => {
  if (accuracy === 100) return 'Perfect Score!';
  if (accuracy >= 90) return 'Excellent!';
  if (accuracy >= 80) return 'Great Job!';
  if (accuracy >= 70) return 'Good Work!';
  if (accuracy >= 50) return 'Keep Practicing!';
  return 'Nice Try!';
};

const getAccuracyGrade = (accuracy: number): string => {
  if (accuracy >= 90) return 'a';
  if (accuracy >= 80) return 'b';
  if (accuracy >= 70) return 'c';
  return 'd';
};

const getTip = (results: GameResults): string => {
  if (results.accuracy === 100) {
    return 'Incredible! You got every note right!';
  }
  if (results.accuracy >= 90) {
    return 'Amazing accuracy! You\'re becoming a master decoder!';
  }
  if (results.accuracy >= 70) {
    return 'Great progress! Keep practicing to improve your speed.';
  }
  if (results.maxStreak >= 5) {
    return `Nice streak of ${results.maxStreak}! Try to build even longer chains.`;
  }
  if (results.wrongAnswers > results.correctAnswers) {
    return 'Remember the mnemonics: "Every Good Boy Does Fine" for lines, "FACE" for spaces.';
  }
  return 'Practice makes perfect! Each session helps your brain remember.';
};

export default ResultsScreen;
