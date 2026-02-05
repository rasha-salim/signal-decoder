# Signal Decoder - Learn Piano Notes

An 80s sci-fi themed game for learning to read piano notes on the musical staff. Built for kids to learn through fun, gamified spaced repetition.

## Features

- **5 Progressive Levels**
  - Level 1: Line Notes (E-G-B-D-F) - "Every Good Boy Does Fine"
  - Level 2: Space Notes (F-A-C-E) - "FACE"
  - Level 3: Full Staff - All 9 notes combined
  - Level 4: Below the Staff - Adding Middle C & D
  - Level 5: Full Range - C4 to A5

- **Two Game Modes**
  - Practice Mode: Learn at your own pace with hints
  - Challenge Mode: Race against the clock (30s, 60s, 90s)

- **80s Sci-Fi Theme**
  - Synthwave neon visuals
  - Procedural 8-bit chiptune background music
  - Animated starfield background

- **Interactive Piano Keyboard**
  - Click keys or use keyboard shortcuts (A-J, K-;, Z-X)
  - Audio feedback with Web Audio API

## Tech Stack

- React 19 + TypeScript
- Vite
- Web Audio API (piano sounds & music)
- CSS custom properties for theming
- LocalStorage for progress persistence

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Deploy to Cloudflare Pages, Vercel, or Netlify:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 18+

## License

MIT
