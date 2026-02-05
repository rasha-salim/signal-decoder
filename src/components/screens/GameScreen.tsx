import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Staff } from '../staff';
import { PianoKeyboard } from '../piano';
import { GameMode, ChallengeDuration, Note } from '../../types';
import { LevelNumber } from '../../types/note';
import { LEVEL_CONFIGS, MASTERY_THRESHOLDS } from '../../constants';
import { getNoteById, getNotesByIds } from '../../constants/notes';
import { playCorrectSound, playWrongSound, playCountdownBeep } from '../../services/audioService';
import './GameScreen.css';

interface GameScreenProps {
  mode: GameMode;
  level: LevelNumber;
  duration?: ChallengeDuration;
  onGameEnd: (results: GameResults) => void;
  onExit: () => void;
}

export interface GameResults {
  mode: GameMode;
  level: LevelNumber;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  maxStreak: number;
  accuracy: number;
  duration?: ChallengeDuration;
}

type GameStatus = 'countdown' | 'playing' | 'finished';

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  level,
  duration = 60,
  onGameEnd,
  onExit,
}) => {
  const levelConfig = LEVEL_CONFIGS[level];
  const availableNotes = useMemo(
    () => getNotesByIds(levelConfig.availableNotes),
    [levelConfig.availableNotes]
  );

  // Game state
  const [status, setStatus] = useState<GameStatus>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);
  const [showHint, setShowHint] = useState(false);
  const [noteState, setNoteState] = useState<'normal' | 'correct' | 'wrong'>('normal');
  const [feedbackKey, setFeedbackKey] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const isProcessingRef = useRef(false);

  // Pick a random note from available notes
  const pickRandomNote = useCallback((): Note => {
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    return availableNotes[randomIndex];
  }, [availableNotes]);

  // Initialize first note - only on mount or level change
  useEffect(() => {
    const notes = getNotesByIds(levelConfig.availableNotes);
    const randomIndex = Math.floor(Math.random() * notes.length);
    setCurrentNote(notes[randomIndex]);
  }, [level]); // Only depends on level, not on callbacks

  // Countdown timer
  useEffect(() => {
    if (status !== 'countdown') return;

    if (countdown > 0) {
      playCountdownBeep(countdown === 1);
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      playCountdownBeep(true);
      setStatus('playing');
    }
  }, [status, countdown]);

  // Challenge mode timer
  useEffect(() => {
    if (status !== 'playing' || mode !== 'challenge') return;

    if (timeRemaining <= 0) {
      setStatus('finished');
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, mode, timeRemaining]);

  // End game and report results
  useEffect(() => {
    if (status !== 'finished') return;

    const totalAnswers = correctAnswers + wrongAnswers;
    const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

    const results: GameResults = {
      mode,
      level,
      score,
      correctAnswers,
      wrongAnswers,
      maxStreak,
      accuracy,
      duration: mode === 'challenge' ? duration : undefined,
    };

    // Small delay to show final state
    const timer = setTimeout(() => {
      onGameEnd(results);
    }, 1500);

    return () => clearTimeout(timer);
  }, [status, mode, level, score, correctAnswers, wrongAnswers, maxStreak, duration, onGameEnd]);

  // Handle piano key press
  const handleKeyPress = useCallback(
    (noteId: string) => {
      if (status !== 'playing' || !currentNote || isProcessingRef.current) return;

      isProcessingRef.current = true;
      const pressedNote = getNoteById(noteId);

      if (!pressedNote) {
        isProcessingRef.current = false;
        return;
      }

      const isCorrect = pressedNote.name === currentNote.name;

      if (isCorrect) {
        // Correct answer
        playCorrectSound();
        setNoteState('correct');
        setFeedbackKey(noteId);
        setFeedbackType('correct');

        // Calculate points
        const points = MASTERY_THRESHOLDS.pointsPerCorrect + (streak * MASTERY_THRESHOLDS.streakBonusMultiplier);
        setScore((prev) => prev + points);

        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak((prev) => Math.max(prev, newStreak));
        setCorrectAnswers((prev) => prev + 1);
        setWrongAttempts(0);
        setShowHint(false);

        // Move to next note after delay
        setTimeout(() => {
          setNoteState('normal');
          setFeedbackKey(null);
          setFeedbackType(null);
          setCurrentNote(pickRandomNote());
          isProcessingRef.current = false;
        }, mode === 'challenge' ? 400 : 600);
      } else {
        // Wrong answer
        playWrongSound();
        setNoteState('wrong');
        setFeedbackKey(noteId);
        setFeedbackType('wrong');
        setStreak(0);
        setWrongAnswers((prev) => prev + 1);

        const newWrongAttempts = wrongAttempts + 1;
        setWrongAttempts(newWrongAttempts);

        // Show hint after multiple wrong attempts in practice mode
        if (mode === 'practice' && newWrongAttempts >= 2) {
          setShowHint(true);
        }

        // Reset feedback after delay
        setTimeout(() => {
          setNoteState('normal');
          setFeedbackKey(null);
          setFeedbackType(null);
          isProcessingRef.current = false;

          // In challenge mode, move to next note after wrong answer
          if (mode === 'challenge') {
            setCurrentNote(pickRandomNote());
            setWrongAttempts(0);
            setShowHint(false);
          }
        }, mode === 'challenge' ? 400 : 800);
      }
    },
    [status, currentNote, streak, wrongAttempts, mode, pickRandomNote]
  );

  // Skip note (practice mode only)
  const handleSkip = () => {
    if (mode !== 'practice' || status !== 'playing') return;
    setCurrentNote(pickRandomNote());
    setWrongAttempts(0);
    setShowHint(false);
    setNoteState('normal');
  };

  // Calculate accuracy
  const totalAnswers = correctAnswers + wrongAnswers;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Render countdown
  if (status === 'countdown') {
    return (
      <div className="game-screen countdown-screen">
        <div className="countdown-display">
          <h2 className="countdown-title">Get Ready!</h2>
          <div className="countdown-number">{countdown || 'GO!'}</div>
          <p className="countdown-level">{levelConfig.name}</p>
          <p className="countdown-mode">
            {mode === 'practice' ? 'Practice Mode' : `${duration}s Challenge`}
          </p>
        </div>
      </div>
    );
  }

  // Render finished state
  if (status === 'finished') {
    return (
      <div className="game-screen finished-screen">
        <div className="finished-display">
          <h2 className="finished-title">Mission Complete!</h2>
          <div className="finished-score">{score}</div>
          <p className="finished-label">Points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      {/* Header */}
      <header className="game-header">
        <button className="exit-btn" onClick={onExit}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          Exit
        </button>

        <div className="game-stats">
          <div className="stat-box score-box">
            <span className="stat-value">{score}</span>
            <span className="stat-label">Score</span>
          </div>

          {mode === 'challenge' && (
            <div className={`stat-box timer-box ${timeRemaining <= 10 ? 'warning' : ''}`}>
              <span className="stat-value">{timeRemaining}</span>
              <span className="stat-label">Seconds</span>
            </div>
          )}

          <div className="stat-box streak-box">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>
      </header>

      {/* Level indicator */}
      <div className="level-indicator">
        <span className="level-badge" style={{ background: levelConfig.color }}>
          Level {level}: {levelConfig.name}
        </span>
        {levelConfig.mnemonic && (
          <span className="mnemonic-hint">{levelConfig.mnemonic}</span>
        )}
      </div>

      {/* Staff display */}
      <section className="staff-section">
        <Staff
          note={currentNote}
          showNote={true}
          showHint={showHint}
          noteState={noteState}
          animated={noteState === 'normal'}
        />
      </section>

      {/* Feedback overlay */}
      {noteState !== 'normal' && (
        <div className={`feedback-overlay ${noteState}`}>
          <span className="feedback-text">
            {noteState === 'correct' ? 'Correct!' : `It's ${currentNote?.name}`}
          </span>
        </div>
      )}

      {/* Piano keyboard */}
      <section className="piano-section">
        <PianoKeyboard
          onKeyPress={handleKeyPress}
          activeNotes={levelConfig.availableNotes}
          highlightedKey={showHint && currentNote ? currentNote.id : null}
          feedbackKey={feedbackKey}
          feedbackType={feedbackType}
          disabled={status !== 'playing' || isProcessingRef.current}
        />
      </section>

      {/* Footer stats */}
      <footer className="game-footer">
        <div className="footer-stat">
          <span className="footer-value">{correctAnswers}</span>
          <span className="footer-label">Correct</span>
        </div>
        <div className="footer-stat">
          <span className="footer-value">{accuracy}%</span>
          <span className="footer-label">Accuracy</span>
        </div>
        <div className="footer-stat">
          <span className="footer-value">{maxStreak}</span>
          <span className="footer-label">Best Streak</span>
        </div>

        {mode === 'practice' && (
          <button className="skip-btn" onClick={handleSkip}>
            Skip Note
          </button>
        )}
      </footer>
    </div>
  );
};

export default GameScreen;
