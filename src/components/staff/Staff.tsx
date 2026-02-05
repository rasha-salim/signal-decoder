import React from 'react';
import { Note } from '../../types';
import { TrebleClef } from './TrebleClef';
import { NoteDisplay } from './NoteDisplay';
import './Staff.css';

interface StaffProps {
  note?: Note | null;
  showNote?: boolean;
  showHint?: boolean;
  noteState?: 'normal' | 'correct' | 'wrong';
  animated?: boolean;
}

// Staff configuration
const STAFF_CONFIG = {
  width: 450,
  height: 220,
  lineSpacing: 20,      // Space between staff lines
  marginTop: 70,        // Space above first line for higher notes + ledger lines
  marginBottom: 50,     // Space below for lower notes + ledger lines
  marginLeft: 80,       // Space for treble clef
  marginRight: 40,
  lineStrokeWidth: 2,
  noteX: 260,           // X position for note display
};

export const Staff: React.FC<StaffProps> = ({
  note,
  showNote = true,
  showHint = false,
  noteState = 'normal',
  animated = true,
}) => {
  const { width, height, lineSpacing, marginTop, marginLeft, lineStrokeWidth, noteX } = STAFF_CONFIG;

  // Calculate Y positions for the 5 staff lines
  // Line 1 (bottom) = E4
  // Line 2 = G4
  // Line 3 = B4
  // Line 4 = D5
  // Line 5 (top) = F5
  const getLineY = (lineNumber: number): number => {
    // lineNumber 1 = bottom, 5 = top
    return marginTop + (5 - lineNumber) * lineSpacing;
  };

  // Calculate note Y position based on staffPosition
  // staffPosition: C4=0, D4=1, E4=2, F4=3, G4=4, A4=5, B4=6, C5=7, D5=8, E5=9, F5=10, G5=11, A5=12
  // E4 (position 2) is on line 1 (bottom line)
  // Each position step = half a line spacing
  const getNoteY = (staffPosition: number): number => {
    const e4Y = getLineY(1); // E4 is on bottom line
    const positionOffset = (staffPosition - 2) * (lineSpacing / 2);
    return e4Y - positionOffset;
  };

  // Determine which ledger lines are needed
  const getLedgerLines = (staffPosition: number): number[] => {
    const ledgerLines: number[] = [];

    // Below the staff: C4 needs one ledger line
    if (staffPosition === 0) {
      ledgerLines.push(0); // C4 ledger line
    }

    // Above the staff: G5 is in space above, A5 needs ledger line
    if (staffPosition === 12) {
      ledgerLines.push(12); // A5 ledger line
    }

    return ledgerLines;
  };

  const renderLedgerLines = () => {
    if (!note) return null;

    const ledgerPositions = getLedgerLines(note.staffPosition);

    return ledgerPositions.map((position) => {
      const y = getNoteY(position);
      return (
        <line
          key={`ledger-${position}`}
          x1={noteX - 25}
          y1={y}
          x2={noteX + 25}
          y2={y}
          className="ledger-line"
          strokeWidth={lineStrokeWidth}
        />
      );
    });
  };

  return (
    <div className="staff-container">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="staff-svg"
        aria-label="Musical staff with treble clef"
      >
        {/* Background glow effect */}
        <defs>
          <filter id="staffGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Staff lines */}
        <g filter="url(#staffGlow)">
          {[1, 2, 3, 4, 5].map((lineNum) => (
            <line
              key={lineNum}
              x1={marginLeft - 10}
              y1={getLineY(lineNum)}
              x2={width - 20}
              y2={getLineY(lineNum)}
              className="staff-line"
              strokeWidth={lineStrokeWidth}
            />
          ))}
        </g>

        {/* Treble Clef */}
        <TrebleClef x={marginLeft - 5} y={marginTop - 10} />

        {/* Ledger lines for notes outside the staff */}
        {showNote && note && renderLedgerLines()}

        {/* Note */}
        {showNote && note && (
          <NoteDisplay
            x={noteX}
            y={getNoteY(note.staffPosition)}
            animated={animated && noteState === 'normal'}
            state={noteState}
            showHint={showHint}
            hintText={note.name}
          />
        )}
      </svg>
    </div>
  );
};

export default Staff;
