# Grok Bot: interactive terrarium builder

Prompt: "Create an interactive terrarium builder."

Open `index.html` in a browser. It is one file with no network dependencies.

## Features
- Three containers: jar with cork lid, bowl, geometric glass.
- Substrate layers: gravel, charcoal, soil, moss. Toggle each one; they stay in order.
- 12 SVG items: fern, succulent, cactus, moss ball, ivy, mushroom, flower, stone, pebbles, crystal, wood, tiny house.
- Drag from the palette into the glass. Move, resize and rotate with handles or buttons. Flip, bring to front, delete.
- Items are clipped to the glass, and any move that would push one outside is blocked.
- Undo (Ctrl+Z), Randomize, Clear, Save PNG.

## Screenshots
- `01-empty.png`: empty start
- `02-built.png`: a built terrarium
- `03-controls.png`: selected item with rotate and resize handles

## Limitations
- The inside-the-glass check uses five points on each item's box, not its exact outline. A leaf tip can be clipped at a curved edge.
- No gravity: items can float or sit below the soil line.
- Tested in Chromium with a mouse. Touch and other browsers are untested.
- The sidebar is not laid out for phones.
