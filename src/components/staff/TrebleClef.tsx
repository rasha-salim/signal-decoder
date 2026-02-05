import React from 'react';

interface TrebleClefProps {
  x: number;
  y: number;
  color?: string;
}

export const TrebleClef: React.FC<TrebleClefProps> = ({
  x,
  y,
  color = 'var(--neon-purple)'
}) => {
  // SVG path for treble clef symbol
  // Scaled and positioned relative to staff
  return (
    <g transform={`translate(${x}, ${y}) scale(0.35)`}>
      <defs>
        <linearGradient id="clefGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--neon-purple)" />
          <stop offset="50%" stopColor="var(--neon-pink)" />
          <stop offset="100%" stopColor="var(--neon-magenta)" />
        </linearGradient>
        <filter id="clefGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d="M30 200
           C30 180 40 160 50 140
           C60 120 70 100 70 80
           C70 60 60 40 50 30
           C40 20 30 20 25 30
           C20 40 20 60 30 80
           C40 100 60 120 70 150
           C80 180 80 210 70 240
           C60 270 40 290 30 310
           C20 330 20 350 30 360
           C40 370 60 360 70 340
           C80 320 80 290 70 260
           C60 230 40 210 30 200
           M50 30
           C50 10 60 0 70 10
           C80 20 80 40 70 60"
        fill="url(#clefGradient)"
        stroke={color}
        strokeWidth="2"
        filter="url(#clefGlow)"
        style={{
          filter: `drop-shadow(0 0 8px var(--neon-purple))`,
        }}
      />
    </g>
  );
};

export default TrebleClef;
