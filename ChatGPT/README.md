# Glasshouse — Interactive Terrarium Builder

A browser-based terrarium studio with original SVG botanical artwork. Built with HTML, CSS, and JavaScript; no installation or build step is required.

[Open the hosted app](https://terrarium-studio-mik.rq7hm2gmxx.chatgpt.site) (access follows the hosted site's sharing settings).

## Run locally

From the repository root:

```bash
python3 -m http.server 8000 --directory ChatGPT
```

Open <http://localhost:8000>. You can also serve this folder with any static web server.

## Features

- Three glass vessels: globe, apothecary jar, and geometric.
- Eight illustrated pieces: fern, nerve plant, monstera, moss, succulent, river stones, driftwood, and mushrooms.
- Pointer and touch dragging, size adjustment, mirroring, and removal.
- Woodland, desert, and secret-garden starter landscapes.
- Adjustable light, moisture, soil depth, lid, and backdrop.
- Undo/redo, editable design names, and automatic local saving.
- PNG image export with SVG fallback.
- Responsive layout and keyboard controls.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, controls, dialogs, and icons. |
| `style.css` | Layout, colors, typography, and responsive styles. |
| `art.js` | Original, deterministic SVG botanical illustrations. |
| `app.js` | Terrarium rendering, interaction, history, persistence, and image export. |

## Keyboard controls

Select a piece, then use the arrow keys to move it; hold Shift for larger steps. Delete or Backspace removes the selected piece. Ctrl/Cmd+Z undoes; Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redoes. Escape clears the selection.

## Saving and care cues

Designs are stored in browser local storage on the current device and origin. They do not sync between devices. The app does not use a backend or an API key. Google Fonts is optional and falls back to system fonts if unavailable.

The care panel offers simple creative cues, rather than a scientific ecosystem simulation. For real planting guidance, see the [Royal Horticultural Society terrarium guide](https://www.rhs.org.uk/plants/types/houseplants/bottle-gardens-and-terrariums).

## Validation

JavaScript syntax checks and ten DOM/VM interaction check groups passed, covering adding pieces, presets, history, sliders, piece controls, keyboard movement, dragging, stored-data validation, dialogs, naming, and SVG export fallback. Generated SVGs were checked for valid XML, unique IDs, and resolved references. Botanical artwork was visually inspected using a native SVG renderer. Full browser and device testing was unavailable during creation.
