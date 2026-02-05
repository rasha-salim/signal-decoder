import React, { useCallback, useEffect, useState } from 'react';
import { NoteName } from '../../types';
import { playNote, resumeAudio } from '../../services/audioService';
import './PianoKeyboard.css';

interface PianoKeyboardProps {
  onKeyPress: (noteId: string) => void;
  activeNotes?: string[]; // Notes available in current level
  highlightedKey?: string | null; // Show which key to press (hint)
  feedbackKey?: string | null; // Key that shows feedback
  feedbackType?: 'correct' | 'wrong' | null;
  disabled?: boolean;
}

interface KeyConfig {
  noteId: string;
  noteName: NoteName;
  isBlack: boolean;
  keyboardKey: string; // Computer keyboard shortcut
}

// Full piano keyboard from C4 to A5
const PIANO_KEYS: KeyConfig[] = [
  { noteId: 'C4', noteName: 'C', isBlack: false, keyboardKey: 'a' },
  { noteId: 'D4', noteName: 'D', isBlack: false, keyboardKey: 's' },
  { noteId: 'E4', noteName: 'E', isBlack: false, keyboardKey: 'd' },
  { noteId: 'F4', noteName: 'F', isBlack: false, keyboardKey: 'f' },
  { noteId: 'G4', noteName: 'G', isBlack: false, keyboardKey: 'g' },
  { noteId: 'A4', noteName: 'A', isBlack: false, keyboardKey: 'h' },
  { noteId: 'B4', noteName: 'B', isBlack: false, keyboardKey: 'j' },
  { noteId: 'C5', noteName: 'C', isBlack: false, keyboardKey: 'k' },
  { noteId: 'D5', noteName: 'D', isBlack: false, keyboardKey: 'l' },
  { noteId: 'E5', noteName: 'E', isBlack: false, keyboardKey: ';' },
  { noteId: 'F5', noteName: 'F', isBlack: false, keyboardKey: "'" },
  { noteId: 'G5', noteName: 'G', isBlack: false, keyboardKey: 'z' },
  { noteId: 'A5', noteName: 'A', isBlack: false, keyboardKey: 'x' },
];

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  onKeyPress,
  activeNotes,
  highlightedKey,
  feedbackKey,
  feedbackType,
  disabled = false,
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyClick = useCallback(
    (noteId: string) => {
      if (disabled) return;

      // Check if note is available in current level
      if (activeNotes && !activeNotes.includes(noteId)) {
        return;
      }

      resumeAudio();
      playNote(noteId);
      setPressedKey(noteId);
      onKeyPress(noteId);

      // Reset pressed state after animation
      setTimeout(() => setPressedKey(null), 150);
    },
    [disabled, activeNotes, onKeyPress]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      const key = PIANO_KEYS.find(
        (k) => k.keyboardKey.toLowerCase() === event.key.toLowerCase()
      );

      if (key) {
        event.preventDefault();
        handleKeyClick(key.noteId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleKeyClick]);

  const getKeyClassName = (key: KeyConfig): string => {
    const classes = ['piano-key'];

    if (key.isBlack) {
      classes.push('piano-key-black');
    } else {
      classes.push('piano-key-white');
    }

    // Check if key is available in current level
    const isAvailable = !activeNotes || activeNotes.includes(key.noteId);
    if (!isAvailable) {
      classes.push('piano-key-unavailable');
    }

    // Check if key is currently pressed
    if (pressedKey === key.noteId) {
      classes.push('piano-key-pressed');
    }

    // Check if key should be highlighted (hint)
    if (highlightedKey === key.noteId) {
      classes.push('piano-key-highlighted');
    }

    // Check feedback state
    if (feedbackKey === key.noteId && feedbackType) {
      classes.push(`piano-key-${feedbackType}`);
    }

    return classes.join(' ');
  };

  return (
    <div className="piano-keyboard-container">
      <div className="piano-keyboard">
        {PIANO_KEYS.map((key) => (
          <button
            key={key.noteId}
            className={getKeyClassName(key)}
            onClick={() => handleKeyClick(key.noteId)}
            disabled={disabled || (activeNotes && !activeNotes.includes(key.noteId))}
            aria-label={`Piano key ${key.noteName}`}
          >
            <span className="piano-key-label">{key.noteName}</span>
            <span className="piano-key-shortcut">{key.keyboardKey.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <div className="piano-keyboard-hint">
        Press the piano key or use keyboard shortcuts (A-J, K-;, Z-X)
      </div>
    </div>
  );
};

export default PianoKeyboard;
