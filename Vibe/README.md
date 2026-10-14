# 🌿 Interactive Terrarium Builder

An interactive terrarium builder built with **React**, **Tailwind CSS**, and **Framer Motion**. Design a tiny glass world and keep it alive by balancing light and humidity.

Originally created as a Vibe (AI-assisted) React canvas app — this folder contains the full source.

## Features

- **12 placeable items** — 7 plants (fern, moss, succulent, cactus, wildflowers, air plant, mushrooms), 2 critters (snail, frog), and 3 decorations (rock, crystal, driftwood), all hand-drawn as inline SVG.
- **Click-to-place & drag-to-move** — pick an item from the greenhouse shelf, click inside the jar to place it, then drag it around. Tap an item to flip or delete it.
- **Living conditions** — light and humidity sliders change the scene in real time: sun rays appear when it's bright, condensation beads up the glass when it's humid.
- **Ecosystem health** — every plant and critter has its own light/moisture preferences. Unhappy ones droop and fade; the health panel explains exactly what's wrong ("Your cactus is too damp in here") and scores the terrarium 0–100.
- **🎲 Surprise me** — scatter a random arrangement, or 🗑 Clear to start over.

## Files

| File | Description |
| --- | --- |
| `src/TerrariumBuilder.jsx` | Self-contained React component (default export: `App`) |

## Run it

The component is a single self-contained file. Drop it into any React project that has Tailwind CSS and Framer Motion installed:

```bash
npm install react framer-motion
# make sure Tailwind CSS is configured in your project
```

Then import and render it:

```jsx
import App from "./Vibe/src/TerrariumBuilder.jsx";

export default function Root() {
  return <App />;
}
```

For example, with [Vite](https://vitejs.dev/):

```bash
npm create vite@latest terrarium -- --template react
cd terrarium
npm install
npm install framer-motion
npm install -D tailwindcss @tailwindcss/vite
# copy Vibe/src/TerrariumBuilder.jsx into src/ and render <App /> in src/App.jsx
npm run dev
```

## How it works

- The jar is a single SVG scene with a `clipPath` so plants stay inside the glass.
- Items are positioned in SVG coordinates; pointer events convert screen coordinates to viewBox space for placement and dragging.
- Each catalog entry stores a humidity and light comfort range; the score is the average fit of all living things, and plants below 55 fit generate a plain-language warning.
- Framer Motion drives the springy placement, the gentle sway of healthy plants, and the droop of unhappy ones.
