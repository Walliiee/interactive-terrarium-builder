const CATALOG = [
  { id: "fern", name: "Maidenhair", latin: "Adiantum", group: "plant", water: "damp", width: 44, sink: 0, lift: 0 },
  { id: "fig", name: "Fiddle fig", latin: "Ficus lyrata", group: "plant", water: "either", width: 34, sink: 0, lift: 0 },
  { id: "echeveria", name: "Echeveria", latin: "Echeveria", group: "plant", water: "dry", width: 30, sink: 1, lift: 0 },
  { id: "fittonia", name: "Nerve plant", latin: "Fittonia", group: "plant", water: "damp", width: 36, sink: 0, lift: 0 },
  { id: "palm", name: "Parlor palm", latin: "Chamaedorea", group: "plant", water: "either", width: 52, sink: 0, lift: 0 },
  { id: "moss", name: "Moss", latin: "Bryophyta", group: "plant", water: "damp", width: 34, sink: 2, lift: 0 },
  { id: "mushroom", name: "Mushrooms", latin: "Fungi", group: "plant", water: "damp", width: 28, sink: 1, lift: 0 },
  { id: "pothos", name: "Pothos", latin: "Epipremnum", group: "plant", water: "either", width: 36, sink: 0, lift: 0 },
  { id: "airplant", name: "Air plant", latin: "Tillandsia", group: "plant", water: "either", width: 30, sink: 0, lift: 12 },
  { id: "stone", name: "River stone", latin: "Stone", group: "stone", water: "either", width: 22, sink: 5, lift: 0 },
  { id: "boulder", name: "Boulder", latin: "Stone", group: "stone", water: "either", width: 32, sink: 6, lift: 0 },
  { id: "driftwood", name: "Driftwood", latin: "Wood", group: "stone", water: "either", width: 38, sink: 3, lift: 0 },
  { id: "pebbles", name: "Pebbles", latin: "Gravel", group: "stone", water: "either", width: 26, sink: 7, lift: 0 },
  { id: "quartz", name: "Quartz", latin: "Mineral", group: "stone", water: "either", width: 24, sink: 4, lift: 0 },
  { id: "bark", name: "Bark", latin: "Wood", group: "stone", water: "either", width: 26, sink: 3, lift: 0 },
  { id: "snail", name: "Snail", latin: "Gastropod", group: "life", water: "damp", width: 18, sink: 1, lift: 0 },
  { id: "frog", name: "Tree frog", latin: "Hyla", group: "life", water: "damp", width: 20, sink: 0, lift: 2 },
  { id: "beetle", name: "Beetle", latin: "Coleoptera", group: "life", water: "either", width: 14, sink: 1, lift: 0 },
];

const ASSETS = Object.fromEntries(CATALOG.map((asset) => [asset.id, asset]));
const FIT = { globe: 0.92, jar: 0.84, bowl: 0.74, cloche: 0.9 };
const VESSELS = ["globe", "jar", "bowl", "cloche"];
const MAX_PIECES = 12;
const STORE_KEY = "under-glass-grok";

const PRESETS = [
  {
    id: "quiet-fern",
    name: "Quiet fern",
    vessel: "globe",
    pebble: 12,
    charcoal: true,
    soil: 20,
    moss: true,
    light: "day",
    mist: 38,
    pieces: [
      ["moss", 28, 0.9, false, 1],
      ["fittonia", 24, 0.92, false, 2],
      ["fern", 52, 1.05, false, 3],
      ["stone", 74, 1, false, 4],
    ],
  },
  {
    id: "dry-bowl",
    name: "Dry bowl",
    vessel: "bowl",
    pebble: 18,
    charcoal: false,
    soil: 16,
    moss: false,
    light: "dawn",
    mist: 8,
    pieces: [
      ["pebbles", 22, 1, false, 1],
      ["echeveria", 42, 1.08, false, 3],
      ["quartz", 64, 1.05, true, 2],
      ["bark", 80, 0.9, false, 4],
      ["airplant", 70, 0.85, false, 5],
    ],
  },
  {
    id: "moss-ward",
    name: "Moss ward",
    vessel: "jar",
    pebble: 10,
    charcoal: true,
    soil: 24,
    moss: true,
    light: "dusk",
    mist: 70,
    pieces: [
      ["moss", 32, 1.05, true, 1],
      ["moss", 68, 0.85, false, 2],
      ["mushroom", 48, 1, false, 3],
      ["fern", 22, 0.82, true, 4],
      ["snail", 58, 1, false, 5],
      ["frog", 78, 0.95, true, 6],
    ],
  },
  {
    id: "palm-house",
    name: "Palm house",
    vessel: "cloche",
    pebble: 12,
    charcoal: true,
    soil: 18,
    moss: false,
    light: "day",
    mist: 26,
    pieces: [
      ["driftwood", 30, 1.05, false, 1],
      ["fig", 26, 0.95, true, 2],
      ["palm", 56, 1, false, 3],
      ["pothos", 78, 0.95, false, 4],
      ["beetle", 42, 1, false, 5],
    ],
  },
];

const BLANK = {
  name: "Untitled",
  vessel: "globe",
  pebble: 14,
  charcoal: false,
  soil: 18,
  moss: false,
  light: "day",
  mist: 12,
  pieces: [],
};

function pieceFrom(row, id) {
  return { id, assetId: row[0], x: row[1], scale: row[2], flip: row[3], z: row[4] };
}

function materialize(seed, id) {
  return {
    id,
    name: seed.name,
    vessel: seed.vessel,
    pebble: seed.pebble,
    charcoal: seed.charcoal,
    soil: seed.soil,
    moss: seed.moss,
    light: seed.light,
    mist: seed.mist,
    pieces: seed.pieces.map((row, index) => pieceFrom(row, `${id}-${index}`)),
  };
}

let draft = materialize(PRESETS[0], "draft-quiet-fern");
let library = [];
let selectedId = null;
let past = [];
let future = [];
let gesture = null;
let tab = "plant";
let note = "";
let savedFlash = false;
const app = document.querySelector("#app");

function soilLine(design) {
  return design.pebble + (design.charcoal ? 4 : 0) + design.soil + (design.moss ? 2 : 0);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function commit(next) {
  if (same(draft, next)) return;
  past = [...past, clone(draft)].slice(-40);
  future = [];
  gesture = null;
  draft = next;
  persist();
  render();
}

function persist() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ draft, library }));
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.draft && Array.isArray(data.draft.pieces)) draft = data.draft;
    if (Array.isArray(data.library)) library = data.library;
  } catch {
    /* Keep the starter if storage is unreadable. */
  }
}

function reading(design) {
  const assets = design.pieces.map((piece) => ASSETS[piece.assetId]).filter(Boolean);
  const plants = assets.filter((asset) => asset.group === "plant");
  const life = assets.filter((asset) => asset.group === "life");
  const damp = plants.filter((asset) => asset.water === "damp").length;
  const dry = plants.filter((asset) => asset.water === "dry").length;
  if (!plants.length && !life.length) return ["An empty room", "Soil and glass, and time. Set something in it."];
  if (life.length && !plants.length) return ["Nowhere to hide", "A creature in a bare jar will not stay. Give it cover."];
  if (damp && dry) return ["Two climates", "Ferns want damp air. The succulent wants to dry. One of them loses."];
  if (design.mist > 60 && dry && !damp) return ["Too wet for this", "Succulents sulk in a misted jar. Ease the fog, or change the planting."];
  if (design.mist < 18 && damp && !dry) return ["They want weather", "These plants keep better with a little mist on the glass."];
  if (plants.length >= 5) return ["Crowded, but alive", "A full planting. Leave a path of soil so nothing smothers."];
  if (life.length && damp) return ["A small household", "Cover, moisture, and something that moves. It can keep itself a while."];
  return ["Closed and quiet", "The balance is close enough. Leave it shut and let it settle."];
}

function sample(items, count) {
  const pool = [...items];
  const picked = [];
  while (pool.length && picked.length < count) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return picked;
}

function shuffle() {
  const vessel = VESSELS[Math.floor(Math.random() * VESSELS.length)];
  const plants = sample(CATALOG.filter((asset) => asset.group === "plant"), 2 + Math.floor(Math.random() * 3));
  const stones = sample(CATALOG.filter((asset) => asset.group === "stone"), 1 + Math.floor(Math.random() * 2));
  const life = Math.random() < 0.6 ? sample(CATALOG.filter((asset) => asset.group === "life"), 1) : [];
  const chosen = [...stones, ...plants, ...life];
  const slots = [16, 32, 48, 64, 80, 88].slice(0, chosen.length);
  for (let i = slots.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const damp = plants.filter((asset) => asset.water === "damp").length;
  const dry = plants.filter((asset) => asset.water === "dry").length;
  const moss = damp > dry;
  selectedId = null;
  commit({
    ...draft,
    vessel,
    pebble: dry > damp ? 18 : 12,
    charcoal: damp >= dry,
    soil: moss ? 22 : 16,
    moss,
    light: moss ? "dusk" : dry > damp ? "dawn" : "day",
    mist: dry > damp ? 10 : moss ? 62 : 30,
    pieces: chosen.map((asset, index) => ({
      id: crypto.randomUUID(),
      assetId: asset.id,
      x: slots[index] ?? 50,
      scale: asset.group === "life" ? 0.9 + Math.random() * 0.2 : 0.82 + Math.random() * 0.36,
      flip: Math.random() < 0.45,
      z: index + 1,
    })),
  });
}

function addPiece(assetId) {
  if (draft.pieces.length >= MAX_PIECES) {
    note = "The glass is full.";
    render();
    window.setTimeout(() => {
      note = "";
      render();
    }, 1600);
    return;
  }
  const id = crypto.randomUUID();
  const z = draft.pieces.reduce((max, piece) => Math.max(max, piece.z), 0) + 1;
  const slot = draft.pieces.length;
  const x = Math.min(88, Math.max(12, 50 + ((slot % 5) - 2) * 14 + (Math.random() * 8 - 4)));
  selectedId = id;
  note = "";
  commit({
    ...draft,
    pieces: [...draft.pieces, { id, assetId, x, scale: 0.92 + Math.random() * 0.16, flip: false, z }],
  });
}

function patchPiece(id, patch, record) {
  const next = {
    ...draft,
    pieces: draft.pieces.map((piece) => (piece.id === id ? { ...piece, ...patch } : piece)),
  };
  if (record) commit(next);
  else {
    draft = next;
    const button = app.querySelector(`[data-piece="${id}"]`);
    const piece = next.pieces.find((item) => item.id === id);
    const asset = ASSETS[piece.assetId];
    if (button && asset) {
      const bed = soilLine(draft);
      button.style.left = `${piece.x}%`;
      button.style.bottom = `${bed - asset.sink + asset.lift}%`;
      button.style.width = `${asset.width * piece.scale * FIT[draft.vessel]}%`;
      button.style.transform = `translateX(-50%) scaleX(${piece.flip ? -1 : 1})`;
    }
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "\u0026amp;")
    .replaceAll("<", "\u003c")
    .replaceAll(">", "\u003e")
    .replaceAll('"', "\u0026quot;");
}

function render() {
  const focus = document.activeElement;
  const focusId = focus && focus.id;
  const caret = focus && focus.selectionStart;
  const [title, body] = reading(draft);
  const bed = soilLine(draft);
  const pieces = [...draft.pieces].sort((a, b) => a.z - b.z);
  const selected = draft.pieces.find((piece) => piece.id === selectedId);
  const selectedAsset = selected ? ASSETS[selected.assetId] : null;
  const stored = library.find((item) => item.id === draft.id);
  const inSync = stored ? same({ ...stored, updatedAt: 0 }, { ...draft, updatedAt: 0 }) : false;

  const drops = Array.from({ length: 8 }, () => "<span></span>").join("");
  const pieceHtml = pieces
    .map((piece) => {
      const asset = ASSETS[piece.assetId];
      if (!asset) return "";
      const bottom = bed - asset.sink + asset.lift;
      return `<button type="button" class="piece${piece.id === selectedId ? " is-selected" : ""}" data-piece="${piece.id}" aria-pressed="${piece.id === selectedId}" aria-label="${escapeHtml(asset.name)}" style="left:${piece.x}%;bottom:${bottom}%;width:${asset.width * piece.scale * FIT[draft.vessel]}%;z-index:${piece.z};transform:translateX(-50%) scaleX(${piece.flip ? -1 : 1})"><img src="assets/${asset.id}.png" alt="" draggable="false"></button>`;
    })
    .join("");

  const catalog = CATALOG.filter((asset) => asset.group === tab)
    .map(
      (asset) =>
        `<button type="button" class="thumb-btn" data-add="${asset.id}"><span class="thumb"><img src="assets/${asset.id}.png" alt="" draggable="false"></span><span class="thumb-name">${escapeHtml(asset.name)}</span></button>`,
    )
    .join("");

  const tabs = [
    ["plant", "Plants"],
    ["stone", "Stone"],
    ["life", "Life"],
    ["ground", "Ground"],
    ["saved", "Saved"],
  ]
    .map(
      ([id, label]) =>
        `<button type="button" class="tab" role="tab" aria-selected="${tab === id}" data-tab="${id}">${label}</button>`,
    )
    .join("");

  const vessels = VESSELS.map(
    (id) =>
      `<button type="button" class="vessel-btn${draft.vessel === id ? " is-on" : ""}" data-vessel="${id}" aria-pressed="${draft.vessel === id}"><span class="mini mini-${id}" aria-hidden="true"></span>${id[0].toUpperCase()}${id.slice(1)}</button>`,
  ).join("");

  let panel = "";
  if (tab === "plant" || tab === "stone" || tab === "life") {
    panel = `<div class="catalog">${catalog}</div>${note ? `<p class="dock-note">${escapeHtml(note)}</p>` : ""}`;
  } else if (tab === "ground") {
    panel = `<div class="ground-panel">
      ${slider("Pebbles", "pebble", draft.pebble, 8, 26)}
      ${slider("Soil", "soil", draft.soil, 12, 34)}
      ${slider("Mist", "mist", draft.mist, 0, 100)}
      <div class="switch-row">
        ${toggle("Charcoal", "charcoal", draft.charcoal)}
        ${toggle("Moss carpet", "moss", draft.moss)}
      </div>
      <div class="light-row" role="group" aria-label="Light">
        ${["dawn", "day", "dusk"].map((light) => `<button type="button" class="chip${draft.light === light ? " is-on" : ""}" data-light="${light}" aria-pressed="${draft.light === light}">${light[0].toUpperCase()}${light.slice(1)}</button>`).join("")}
      </div>
      <div class="row-actions">
        <button type="button" class="btn" data-action="new">New glass</button>
        <button type="button" class="btn" data-action="clear">Clear planting</button>
      </div>
    </div>`;
  } else {
    const saved = library
      .map(
        (entry) => `<li class="saved-item"><button type="button" class="saved-load" data-load="${entry.id}"><span>${escapeHtml(entry.name)}</span><span class="saved-meta">${entry.pieces.length} placed</span></button><button type="button" class="icon-btn" data-remove-saved="${entry.id}" aria-label="Remove ${escapeHtml(entry.name)}">Remove</button></li>`,
      )
      .join("");
    panel = `<div class="saved-panel">
      <p class="section-label">Start from</p>
      <ul class="saved-list">${PRESETS.map((preset) => `<li><button type="button" class="saved-load" data-preset="${preset.id}"><span>${escapeHtml(preset.name)}</span><span class="saved-meta">${preset.vessel}</span></button></li>`).join("")}</ul>
      <p class="section-label">On this device</p>
      ${library.length ? `<ul class="saved-list">${saved}</ul>` : `<p class="dock-note">Nothing saved yet. Save keeps this glass here.</p>`}
    </div>`;
  }

  const inspector = selected && selectedAsset
    ? `<div class="inspector-body">
        <div class="inspector-head"><p class="inspector-name">${escapeHtml(selectedAsset.name)}</p><p class="inspector-latin">${escapeHtml(selectedAsset.latin)}</p></div>
        <label class="field"><span>Scale <span class="field-value">${selected.scale.toFixed(2)}</span></span>
          <input id="scale" type="range" min="0.55" max="1.65" step="0.01" value="${selected.scale}" data-scale="${selected.id}">
        </label>
        <div class="row-actions">
          <button type="button" class="btn" data-action="flip">Flip</button>
          <button type="button" class="btn" data-action="front">Front</button>
          <button type="button" class="btn" data-action="back">Back</button>
          <button type="button" class="btn btn-quiet" data-action="remove">Remove</button>
        </div>
      </div>`
    : `<p class="dock-note">Tap a plant to set it in the glass. Drag what you placed.</p>`;

  app.innerHTML = `
    <header class="topbar">
      <div class="brand"><p class="kicker">Closed terrarium</p><h1>Under Glass</h1></div>
      <div class="top-actions">
        <button type="button" class="icon-btn" data-action="undo" aria-label="Undo" ${past.length ? "" : "disabled"}>Undo</button>
        <button type="button" class="icon-btn" data-action="redo" aria-label="Redo" ${future.length ? "" : "disabled"}>Redo</button>
        <button type="button" class="icon-btn" data-action="shuffle" aria-label="Shuffle planting">Shuffle</button>
        <button type="button" class="btn btn-primary" data-action="save" ${inSync && !savedFlash ? "disabled" : ""}>${savedFlash || inSync ? "Saved" : "Save"}</button>
      </div>
      <label class="name-field"><span class="sr-only">Name</span>
        <input id="name" aria-label="Terrarium name" maxlength="40" value="${escapeHtml(draft.name)}">
      </label>
    </header>
    <section class="stage" aria-label="Terrarium">
      <div class="vessel-slot">
        <div class="vessel vessel-${draft.vessel}">
          <div class="shell light-${draft.light}">
            <div class="interior" style="--pebble:${draft.pebble}%;--soil:${draft.soil}%;--char:${draft.charcoal ? "4%" : "0%"}">
              <div class="strata" aria-hidden="true">
                <div class="pebbles"></div>
                ${draft.charcoal ? `<div class="charcoal"></div>` : ""}
                <div class="soil"></div>
                ${draft.moss ? `<div class="moss-lip"></div>` : ""}
              </div>
              ${pieceHtml}
              <div class="mist" style="bottom:${Math.max(bed - 8, 0)}%;--mist:${draft.mist / 100}"></div>
              <div class="grade"></div>
            </div>
            <div class="sheen" aria-hidden="true"></div>
            <div class="drops" aria-hidden="true">${drops}</div>
          </div>
          ${draft.vessel === "cloche" ? `<div class="plinth" aria-hidden="true"></div>` : ""}
        </div>
      </div>
      <div class="reading"><p class="reading-title">${escapeHtml(title)}</p><p class="reading-body">${escapeHtml(body)}</p></div>
      <div class="vessel-picker" role="group" aria-label="Vessel">${vessels}</div>
    </section>
    <div class="dock">
      <div class="tablist" role="tablist" aria-label="Terrarium parts">${tabs}</div>
      <div class="tab-panel">${panel}</div>
      <div class="inspector">${inspector}</div>
    </div>`;

  if (focusId) {
    const next = document.getElementById(focusId);
    if (next) {
      next.focus();
      if (typeof caret === "number" && next.setSelectionRange) next.setSelectionRange(caret, caret);
    }
  }
}

function slider(label, field, value, min, max) {
  return `<label class="field"><span>${label} <span class="field-value">${Math.round(value)}</span></span><input type="range" min="${min}" max="${max}" step="1" value="${value}" data-field="${field}"></label>`;
}

function toggle(label, field, checked) {
  return `<label class="toggle"><span>${label}</span><button type="button" class="switch" role="switch" aria-checked="${checked}" data-toggle="${field}" aria-label="${label}"><span class="switch-thumb"></span></button></label>`;
}

function beginGesture() {
  if (!gesture) gesture = clone(draft);
}

function endGesture() {
  if (!gesture) return;
  if (same(gesture, draft)) gesture = null;
  else {
    past = [...past, gesture].slice(-40);
    future = [];
    gesture = null;
    persist();
  }
  render();
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-tab], [data-add], [data-vessel], [data-light], [data-preset], [data-load], [data-remove-saved], [data-toggle], [data-piece]");
  if (!target || !app.contains(target)) return;
  if (target.dataset.tab) {
    tab = target.dataset.tab;
    render();
    return;
  }
  if (target.dataset.add) return addPiece(target.dataset.add);
  if (target.dataset.vessel) return commit({ ...draft, vessel: target.dataset.vessel });
  if (target.dataset.light) return commit({ ...draft, light: target.dataset.light });
  if (target.dataset.toggle) return commit({ ...draft, [target.dataset.toggle]: !draft[target.dataset.toggle] });
  if (target.dataset.preset) {
    const preset = PRESETS.find((item) => item.id === target.dataset.preset);
    selectedId = null;
    past = [];
    future = [];
    draft = materialize(preset, crypto.randomUUID());
    persist();
    render();
    return;
  }
  if (target.dataset.load) {
    const saved = library.find((item) => item.id === target.dataset.load);
    if (!saved) return;
    const { updatedAt, ...design } = saved;
    draft = clone(design);
    selectedId = null;
    past = [];
    future = [];
    persist();
    render();
    return;
  }
  if (target.dataset.removeSaved) {
    library = library.filter((item) => item.id !== target.dataset.removeSaved);
    persist();
    render();
    return;
  }
  if (target.dataset.piece) {
    selectedId = target.dataset.piece;
    render();
    return;
  }
  const action = target.dataset.action;
  if (action === "undo" && past.length && !gesture) {
    future = [clone(draft), ...future].slice(0, 40);
    draft = past.pop();
    if (!draft.pieces.some((piece) => piece.id === selectedId)) selectedId = null;
    persist();
    render();
  } else if (action === "redo" && future.length && !gesture) {
    past = [...past, clone(draft)].slice(-40);
    draft = future.shift();
    if (!draft.pieces.some((piece) => piece.id === selectedId)) selectedId = null;
    persist();
    render();
  } else if (action === "shuffle") shuffle();
  else if (action === "save") {
    library = [{ ...clone(draft), updatedAt: Date.now() }, ...library.filter((item) => item.id !== draft.id)].slice(0, 24);
    savedFlash = true;
    persist();
    render();
    window.setTimeout(() => {
      savedFlash = false;
      render();
    }, 1400);
  } else if (action === "new") {
    selectedId = null;
    past = [];
    future = [];
    draft = materialize(BLANK, crypto.randomUUID());
    persist();
    render();
  } else if (action === "clear" && draft.pieces.length) {
    selectedId = null;
    commit({ ...draft, pieces: [] });
  } else if (action === "flip" && selectedId) {
    const piece = draft.pieces.find((item) => item.id === selectedId);
    patchPiece(selectedId, { flip: !piece.flip }, true);
  } else if (action === "front" && selectedId) {
    const z = Math.max(...draft.pieces.map((piece) => piece.z)) + 1;
    patchPiece(selectedId, { z }, true);
  } else if (action === "back" && selectedId) {
    const z = Math.min(...draft.pieces.map((piece) => piece.z)) - 1;
    patchPiece(selectedId, { z }, true);
  } else if (action === "remove" && selectedId) {
    const id = selectedId;
    selectedId = null;
    commit({ ...draft, pieces: draft.pieces.filter((piece) => piece.id !== id) });
  }
});

app.addEventListener("pointerdown", (event) => {
  const piece = event.target.closest("[data-piece]");
  if (piece && event.button === 0) {
    event.preventDefault();
    selectedId = piece.dataset.piece;
    beginGesture();
    const bounds = piece.parentElement.getBoundingClientRect();
    const move = (ev) => {
      const x = ((ev.clientX - bounds.left) / bounds.width) * 100;
      patchPiece(piece.dataset.piece, { x: Math.min(92, Math.max(8, x)) }, false);
    };
    const up = () => {
      piece.removeEventListener("pointermove", move);
      piece.removeEventListener("pointerup", up);
      piece.removeEventListener("pointercancel", up);
      endGesture();
    };
    piece.addEventListener("pointermove", move);
    piece.addEventListener("pointerup", up);
    piece.addEventListener("pointercancel", up);
    try {
      piece.setPointerCapture(event.pointerId);
    } catch {
      /* Optional. */
    }
    return;
  }
  if (event.target.classList && event.target.classList.contains("interior")) {
    selectedId = null;
    render();
  }
  const field = event.target.closest("[data-field], [data-scale]");
  if (field) beginGesture();
});

app.addEventListener("input", (event) => {
  const field = event.target.dataset.field;
  if (field) {
    draft = { ...draft, [field]: Number(event.target.value) };
    const value = event.target.parentElement.querySelector(".field-value");
    if (value) value.textContent = String(Math.round(draft[field]));
    const interior = app.querySelector(".interior");
    if (interior) {
      interior.style.setProperty("--pebble", `${draft.pebble}%`);
      interior.style.setProperty("--soil", `${draft.soil}%`);
    }
    const mist = app.querySelector(".mist");
    if (mist) mist.style.setProperty("--mist", String(draft.mist / 100));
    return;
  }
  if (event.target.dataset.scale && selectedId) {
    patchPiece(selectedId, { scale: Number(event.target.value) }, false);
    const value = event.target.parentElement.querySelector(".field-value");
    if (value) value.textContent = Number(event.target.value).toFixed(2);
  }
  if (event.target.id === "name") draft = { ...draft, name: event.target.value };
});

app.addEventListener("change", (event) => {
  if (event.target.dataset.field || event.target.dataset.scale || event.target.id === "name") endGesture();
});

app.addEventListener("focusin", (event) => {
  if (event.target.id === "name") beginGesture();
});

document.addEventListener("keydown", (event) => {
  const typing = event.target instanceof HTMLInputElement;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !typing) {
    event.preventDefault();
    app.querySelector(event.shiftKey ? '[data-action="redo"]' : '[data-action="undo"]')?.click();
    return;
  }
  if (!selectedId || typing) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    const piece = draft.pieces.find((item) => item.id === selectedId);
    const step = event.shiftKey ? 6 : 2;
    const x = Math.min(92, Math.max(8, piece.x + (event.key === "ArrowLeft" ? -step : step)));
    patchPiece(selectedId, { x }, true);
  } else if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    app.querySelector('[data-action="remove"]')?.click();
  }
});

const style = document.createElement("style");
style.textContent = `
  .switch[aria-checked="true"] { background: var(--color-accent); }
  .switch[aria-checked="true"] .switch-thumb { transform: translateX(19px); }
  input[type="range"] { width: 100%; accent-color: var(--color-fg); height: 28px; }
  .icon-btn { width: auto; padding: 0 10px; font-size: 0.75rem; }
`;
document.head.appendChild(style);

loadStore();
render();
