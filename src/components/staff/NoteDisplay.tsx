import React from 'react';

interface NoteDisplayProps {
  x: number;
  y: number;
  color?: string;
  animated?: boolean;
  size?: number;
  showHint?: boolean;
  hintText?: string;
  state?: 'normal' | 'correct' | 'wrong';
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({
  x,
  y,
  color = 'var(--neon-cyan)',
  animated = true,
  size = 14,
  showHint = false,
  hintText = '',
  state = 'normal',
}) => {
  // Note head is an ellipse (slightly wider than tall)
  const radiusX = size;
  const radiusY = size * 0.75;

  const getStateColor = () => {
    switch (state) {
      case 'correct':
        return 'var(--success)';
      case 'wrong':
        return 'var(--error)';
      default:
        return color;
    }
  };

  const stateColor = getStateColor();

  const getStateClass = () => {
    switch (state) {
      case 'correct':
        return 'note-correct';
      case 'wrong':
        return 'note-wrong';
      default:
        return animated ? 'note-animated' : '';
    }
  };

  return (
    <g className={getStateClass()}>
      {/* Outer glow ring */}
      <ellipse
        cx={x}
        cy={y}
        rx={radiusX + 4}
        ry={radiusY + 3}
        fill="none"
        stroke={stateColor}
        strokeWidth="1"
        opacity="0.3"
        style={{
          filter: `drop-shadow(0 0 10px ${stateColor})`,
        }}
      />

      {/* Note head - filled ellipse with gradient */}
      <defs>
        <radialGradient id={`noteGradient-${x}-${y}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor={stateColor} stopOpacity="1" />
        </radialGradient>
      </defs>

      <ellipse
        cx={x}
        cy={y}
        rx={radiusX}
        ry={radiusY}
        fill={`url(#noteGradient-${x}-${y})`}
        stroke={stateColor}
        strokeWidth="2"
        className="note-head"
        style={{
          filter: `drop-shadow(0 0 8px ${stateColor})`,
        }}
      />

      {/* Inner highlight */}
      <ellipse
        cx={x - 3}
        cy={y - 2}
        rx={radiusX * 0.4}
        ry={radiusY * 0.3}
        fill="rgba(255, 255, 255, 0.3)"
      />

      {/* Hint text (note name) */}
      {showHint && hintText && (
        <text
          x={x}
          y={y + radiusY + 20}
          className="note-hint"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="var(--neon-cyan)"
          style={{
            filter: 'drop-shadow(0 0 5px var(--neon-cyan))',
          }}
        >
          {hintText}
        </text>
      )}
    </g>
  );
};

export default NoteDisplay;
