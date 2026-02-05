import React, { useState } from 'react';
import { GameMode, ChallengeDuration, LevelProgress } from '../../types';
import { LevelNumber } from '../../types/note';
import { LEVEL_CONFIGS, CHALLENGE_DURATIONS } from '../../constants';
import './HomeScreen.css';

interface HomeScreenProps {
  onStartGame: (mode: GameMode, level: LevelNumber, duration?: ChallengeDuration) => void;
  levelProgress: Record<LevelNumber, LevelProgress>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  levelProgress,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelNumber>(1);
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');
  const [selectedDuration, setSelectedDuration] = useState<ChallengeDuration>(60);

  const handleStartGame = () => {
    if (selectedMode === 'challenge') {
      onStartGame(selectedMode, selectedLevel, selectedDuration);
    } else {
      onStartGame(selectedMode, selectedLevel);
    }
  };

  return (
    <div className="home-screen">
      {/* Animated stars background */}
      <div className="stars-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 100 100" className="satellite-svg">
              <circle cx="50" cy="50" r="15" fill="var(--neon-cyan)" />
              <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="var(--neon-pink)" strokeWidth="2" transform="rotate(-30 50 50)" />
              <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="var(--neon-purple)" strokeWidth="2" transform="rotate(30 50 50)" />
              <circle cx="50" cy="50" r="5" fill="var(--neon-green)" />
            </svg>
          </div>
        </div>
        <h1 className="game-title">
          <span className="title-signal">Signal</span>
          <span className="title-decoder">Decoder</span>
        </h1>
        <p className="game-subtitle">
          Learn to decode musical transmissions from across the galaxy
        </p>
      </header>

      {/* Main content */}
      <main className="home-content">
        {/* Level Selection */}
        <section className="level-section">
          <h2 className="section-title">Select Mission</h2>
          <div className="level-grid">
            {([1, 2, 3, 4, 5] as LevelNumber[]).map((level) => {
              const config = LEVEL_CONFIGS[level];
              const progress = levelProgress[level];
              const isUnlocked = progress?.isUnlocked ?? level === 1;
              const mastery = progress?.masteryPercentage ?? 0;

              return (
                <button
                  key={level}
                  className={`level-card ${selectedLevel === level ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => isUnlocked && setSelectedLevel(level)}
                  disabled={!isUnlocked}
                  style={{ '--level-color': config.color } as React.CSSProperties}
                >
                  <div className="level-header">
                    <span className="level-number">Level {level}</span>
                    {!isUnlocked && <span className="lock-icon">LOCKED</span>}
                  </div>
                  <h3 className="level-name">{config.name}</h3>
                  <p className="level-subtitle">{config.subtitle}</p>
                  {isUnlocked && (
                    <div className="level-progress">
                      <div className="progress-bar-mini">
                        <div
                          className="progress-bar-fill-mini"
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                      <span className="progress-text">{Math.round(mastery)}%</span>
                    </div>
                  )}
                  {config.mnemonic && isUnlocked && (
                    <p className="level-mnemonic">"{config.mnemonic}"</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Mode Selection */}
        <section className="mode-section">
          <h2 className="section-title">Select Mode</h2>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${selectedMode === 'practice' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('practice')}
            >
              <span className="mode-icon-container practice">
                <svg viewBox="0 0 24 24" className="mode-svg">
                  <path fill="currentColor" d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  <path fill="currentColor" d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </span>
              <span className="mode-name">Practice</span>
              <span className="mode-desc">Learn at your pace with hints</span>
            </button>
            <button
              className={`mode-btn ${selectedMode === 'challenge' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('challenge')}
            >
              <span className="mode-icon-container challenge">
                <svg viewBox="0 0 24 24" className="mode-svg">
                  <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                </svg>
              </span>
              <span className="mode-name">Challenge</span>
              <span className="mode-desc">Race against the clock!</span>
            </button>
          </div>

          {/* Duration selection for challenge mode */}
          {selectedMode === 'challenge' && (
            <div className="duration-section animate-slide-up">
              <h3 className="duration-title">Time Limit</h3>
              <div className="duration-buttons">
                {CHALLENGE_DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    className={`duration-btn ${selectedDuration === duration ? 'selected' : ''}`}
                    onClick={() => setSelectedDuration(duration)}
                  >
                    {duration}s
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Start Button */}
        <button className="start-btn" onClick={handleStartGame}>
          <span className="start-text">Launch Mission</span>
          <span className="start-arrow">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M10 17l5-5-5-5v10z"/>
            </svg>
          </span>
        </button>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p className="footer-text">
          Press piano keys to decode alien signals
        </p>
      </footer>
    </div>
  );
};

export default HomeScreen;
