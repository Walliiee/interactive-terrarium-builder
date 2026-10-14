import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------ catalog ------------------------------ */

const CATALOG = [
  { id: "fern", name: "Fern", kind: "flora", hum: [55, 100], light: [20, 65] },
  { id: "moss", name: "Moss", kind: "flora", hum: [65, 100], light: [10, 55] },
  { id: "succulent", name: "Succulent", kind: "flora", hum: [10, 40], light: [55, 100] },
  { id: "cactus", name: "Cactus", kind: "flora", hum: [5, 35], light: [70, 100] },
  { id: "flowers", name: "Wildflowers", kind: "flora", hum: [40, 75], light: [45, 90] },
  { id: "airplant", name: "Air plant", kind: "flora", hum: [30, 70], light: [40, 85] },
  { id: "mushroom", name: "Mushrooms", kind: "flora", hum: [60, 100], light: [10, 50] },
  { id: "snail", name: "Snail", kind: "critter", hum: [55, 100], light: [10, 80] },
  { id: "frog", name: "Frog", kind: "critter", hum: [60, 100], light: [20, 70] },
  { id: "rock", name: "Rock", kind: "decor" },
  { id: "crystal", name: "Crystal", kind: "decor" },
  { id: "driftwood", name: "Driftwood", kind: "decor" },
];

const byId = (id) => CATALOG.find((c) => c.id === id);

/* ------------------------------- artwork ------------------------------ */

function Bloom({ cx, cy, color }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={cx + 3.4 * Math.cos((a * Math.PI) / 180)}
          cy={cy + 3.4 * Math.sin((a * Math.PI) / 180)}
          r="3"
          fill={color}
        />
      ))}
      <circle cx={cx} cy={cy} r="2.2" fill="#f7d354" />
    </g>
  );
}

function ItemArt({ id }) {
  switch (id) {
    case "fern":
      return (
        <g>
          <path d="M0,0 C2,-10 1,-22 -2,-34" stroke="#3f7d4c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M0,-12 C-7,-13 -11,-16 -13,-20" stroke="#4e9457" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M0,-18 C-7,-19 -12,-23 -14,-27" stroke="#4e9457" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M-1,-24 C-8,-26 -12,-30 -13,-33" stroke="#4e9457" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M0,-12 C7,-13 11,-16 12,-20" stroke="#5da862" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M1,-18 C7,-19 11,-23 12,-27" stroke="#5da862" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M-1,-24 C6,-26 10,-30 11,-33" stroke="#5da862" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "moss":
      return (
        <g>
          <circle cx="-11" cy="-4" r="7" fill="#4c7a3f" />
          <circle cx="0" cy="-6" r="9" fill="#5d8f4a" />
          <circle cx="11" cy="-4" r="7" fill="#456f3a" />
          <circle cx="-4" cy="-10" r="2" fill="#79b268" />
          <circle cx="5" cy="-11" r="1.6" fill="#79b268" />
          <circle cx="-12" cy="-7" r="1.6" fill="#79b268" />
        </g>
      );
    case "succulent":
      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <ellipse
              key={a}
              cx="0"
              cy="-15"
              rx="5.5"
              ry="12"
              fill={i % 2 ? "#7fb069" : "#5d9c58"}
              transform={`rotate(${a} 0 -15)`}
            />
          ))}
          <circle cx="0" cy="-15" r="5" fill="#a3c98e" />
        </g>
      );
    case "cactus":
      return (
        <g>
          <rect x="-17" y="-27" width="12" height="14" rx="6" fill="#588c4e" />
          <rect x="-15" y="-20" width="8" height="7" fill="#588c4e" />
          <rect x="-7" y="-40" width="14" height="40" rx="7" fill="#588c4e" />
          {[-34, -26, -18, -10].map((y) => (
            <g key={y}>
              <circle cx="-7" cy={y} r="0.9" fill="#e8f0d8" />
              <circle cx="7" cy={y} r="0.9" fill="#e8f0d8" />
            </g>
          ))}
          <circle cx="0" cy="-42" r="3.5" fill="#f2a3c6" />
          <circle cx="0" cy="-42" r="1.4" fill="#f7d354" />
        </g>
      );
    case "flowers":
      return (
        <g>
          {[-10, 0, 10].map((dx, i) => (
            <g key={dx}>
              <path
                d={`M${dx},0 C${dx - 2},-10 ${dx - 1},-16 ${dx - 1},-${20 + i * 4}`}
                stroke="#5d9c58"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <Bloom cx={dx - 1} cy={-(22 + i * 4)} color={["#f2a3c6", "#f5c04e", "#e26d5c"][i]} />
            </g>
          ))}
        </g>
      );
    case "airplant":
      return (
        <g>
          {[
            "M0,0 C-6,-12 -14,-18 -20,-22",
            "M0,0 C-2,-14 -4,-24 -8,-32",
            "M0,0 C2,-14 5,-22 10,-30",
            "M0,0 C6,-12 14,-18 18,-20",
          ].map((d, i) => (
            <path key={i} d={d} stroke={i % 2 ? "#8fb8a8" : "#a5c9bb"} strokeWidth="3" fill="none" strokeLinecap="round" />
          ))}
        </g>
      );
    case "mushroom":
      return (
        <g>
          <rect x="5" y="-9" width="4" height="9" rx="2" fill="#efe3cf" />
          <ellipse cx="7" cy="-11" rx="5" ry="3.5" fill="#d95d4e" />
          <rect x="-3" y="-15" width="7" height="15" rx="3" fill="#efe3cf" />
          <ellipse cx="0" cy="-17" rx="13" ry="9" fill="#d95d4e" />
          <circle cx="-6" cy="-20" r="1.6" fill="#fff" />
          <circle cx="3" cy="-15" r="1.6" fill="#fff" />
          <circle cx="7" cy="-20" r="1.6" fill="#fff" />
        </g>
      );
    case "snail":
      return (
        <g>
          <path d="M11,-8 L14,-19 M15,-8 L18,-19" stroke="#d9a066" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14.5" cy="-20" r="1.4" fill="#8a5228" />
          <circle cx="18.5" cy="-20" r="1.4" fill="#8a5228" />
          <path d="M-16,0 C-16,-7 -9,-9 -3,-9 L7,-9 C13,-9 17,-6 18,-1 L18,0 Z" fill="#d9a066" />
          <circle cx="-3" cy="-16" r="9" fill="#c97b4a" />
          <path d="M3,-16 a6,6 0 1 0 -6,6 a3,3 0 1 0 3,-3" fill="none" stroke="#8a5228" strokeWidth="2" />
        </g>
      );
    case "frog":
      return (
        <g>
          <ellipse cx="-10" cy="-2" rx="5" ry="2.5" fill="#4a9d4f" />
          <ellipse cx="10" cy="-2" rx="5" ry="2.5" fill="#4a9d4f" />
          <ellipse cx="0" cy="-9" rx="12" ry="10" fill="#5cb85c" />
          <ellipse cx="0" cy="-6" rx="7" ry="5" fill="#a8d8a0" />
          <circle cx="-5" cy="-19" r="4" fill="#fff" />
          <circle cx="5" cy="-19" r="4" fill="#fff" />
          <circle cx="-5" cy="-19" r="1.8" fill="#22333b" />
          <circle cx="5" cy="-19" r="1.8" fill="#22333b" />
          <path d="M-5,-12 Q0,-9 5,-12" stroke="#2f6b33" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "rock":
      return (
        <g>
          <polygon points="-16,0 -11,-10 -2,-13 9,-10 15,0" fill="#9aa3ab" />
          <path d="M-8,-9 L-1,-11 L6,-9" stroke="#c8ced4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "crystal":
      return (
        <g>
          <polygon points="9,-14 15,-26 19,-6 12,-2" fill="#c4b5fd" />
          <polygon points="0,-40 -9,-14 0,-2 9,-14" fill="#a78bfa" />
          <path d="M0,-40 L0,-2" stroke="#e9d5ff" strokeWidth="1" />
        </g>
      );
    case "driftwood":
      return (
        <g>
          <path d="M2,-6 C4,-13 9,-18 15,-20" stroke="#8a6642" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M-20,-2 C-8,-8 8,-6 20,-10" stroke="#8a6642" strokeWidth="7" fill="none" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

/* ------------------------------ jar scene ----------------------------- */

const JAR_PATH =
  "M150,96 C60,110 45,140 45,180 L45,460 Q45,495 80,495 L320,495 Q355,495 355,460 L355,180 C355,140 340,110 250,96 Z";

const PEBBLES = [
  [60, 486, 5], [78, 482, 4], [95, 488, 5.5], [112, 483, 4], [130, 487, 5],
  [148, 482, 4], [166, 488, 5], [184, 483, 4], [202, 487, 5.5], [220, 482, 4],
  [238, 488, 5], [256, 483, 4], [274, 487, 5.5], [292, 482, 4], [310, 488, 5],
  [328, 484, 4], [344, 488, 4],
];

function Jar({
  items,
  selectedTool,
  selectedId,
  svgRef,
  onPlace,
  onItemDown,
  onBackground,
  onMove,
  onUp,
  onFlip,
  onDelete,
  humidity,
  light,
}) {
  const cursor = selectedTool ? "crosshair" : "default";
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 520"
      className="w-full h-auto select-none touch-none"
      style={{ cursor }}
      onPointerDown={onBackground}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <defs>
        <clipPath id="jarClip">
          <path d={JAR_PATH} />
        </clipPath>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dbeef2" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#bcd8de" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* sun */}
      {light > 55 && (
        <g opacity={Math.min(1, (light - 55) / 35)}>
          <circle cx="42" cy="42" r="13" fill="#ffd166" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r1 = 16, r2 = 22;
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={42 + r1 * Math.cos(rad)}
                y1={42 + r1 * Math.sin(rad)}
                x2={42 + r2 * Math.cos(rad)}
                y2={42 + r2 * Math.sin(rad)}
                stroke="#ffd166"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      )}

      {/* lid */}
      <circle cx="200" cy="18" r="8" fill="#bcd8de" stroke="#9fc4cf" strokeWidth="2.5" />
      <path d="M150,72 Q200,14 250,72 Z" fill="url(#glassGrad)" stroke="#9fc4cf" strokeWidth="3" strokeLinejoin="round" />
      <rect x="152" y="70" width="96" height="28" rx="4" fill="url(#glassGrad)" stroke="#9fc4cf" strokeWidth="3" />

      {/* body */}
      <path d={JAR_PATH} fill="url(#glassGrad)" stroke="#9fc4cf" strokeWidth="3" strokeLinejoin="round" />

      {/* inside */}
      <g clipPath="url(#jarClip)">
        <rect x="45" y="60" width="310" height="435" fill="#f2f8f4" opacity="0.5" />
        {/* pebbles */}
        <rect x="45" y="452" width="310" height="45" fill="#d8c9ae" />
        {PEBBLES.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#c3b193" : "#cfc0a4"} />
        ))}
        {/* soil */}
        <path
          d="M45,466 Q90,460 130,466 T215,466 T300,466 T355,466 L355,495 L45,495 Z"
          fill="#6b4a32"
        />
        {[60, 88, 140, 190, 240, 300, 330].map((x, i) => (
          <circle key={x} cx={x} cy={470 + (i % 3)} r="1.4" fill="#8a664a" />
        ))}

        {/* items */}
        <AnimatePresence>
          {items.map((item) => {
            const spec = byId(item.type);
            const fit = spec.hum ? item.fit : null;
            const droop = fit === null ? 0 : fit >= 70 ? 0 : fit >= 40 ? 7 : 15;
            const dim = fit !== null && fit < 40 ? 0.65 : 1;
            return (
              <motion.g
                key={item.id}
                initial={{ x: item.x, y: item.y, scale: 0, opacity: 0 }}
                animate={{ x: item.x, y: item.y, scale: item.scale, opacity: dim }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                onPointerDown={(e) => onItemDown(e, item)}
                style={{ cursor: "grab" }}
              >
                {selectedId === item.id && (
                  <circle cx="0" cy="-22" r="27" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="4 4" />
                )}
                <ellipse cx="0" cy="0" rx="15" ry="3" fill="rgba(0,0,0,0.14)" />
                <motion.g
                  animate={{ rotate: [droop - 2.5, droop + 2.5, droop - 2.5] }}
                  transition={{ duration: 3 + (item.seed % 4), repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "0px 0px" }}
                >
                  <g transform={item.flip ? "scale(-1,1)" : undefined}>
                    <ItemArt id={item.type} />
                  </g>
                </motion.g>
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* condensation */}
        {humidity > 55 &&
          [
            [70, 200], [76, 260], [66, 320], [80, 380], [332, 180], [338, 250],
            [328, 330], [342, 400], [88, 150], [318, 140],
          ].map(([x, y], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="2"
              ry="3"
              fill="rgba(255,255,255,0.7)"
              stroke="rgba(160,200,215,0.8)"
              strokeWidth="0.6"
              opacity={Math.min(1, (humidity - 55) / 40)}
            />
          ))}
      </g>

      {/* glass shine */}
      <path d="M78,150 C68,190 68,300 74,380" stroke="rgba(255,255,255,0.75)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M95,150 C89,200 89,290 92,350" stroke="rgba(255,255,255,0.75)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4" />

      {/* toolbar for selected item */}
      {(() => {
        const it = items.find((i) => i.id === selectedId);
        if (!it) return null;
        const ty = Math.max(120, it.y - 58);
        return (
          <g transform={`translate(${it.x - 27}, ${ty})`} onPointerDown={(e) => e.stopPropagation()}>
            <rect x="0" y="0" width="54" height="24" rx="12" fill="#1f2937" opacity="0.92" />
            <text x="14" y="12" textAnchor="middle" dominantBaseline="central" fontSize="13" fill="#f87171" style={{ pointerEvents: "none" }}>
              ✕
            </text>
            <text x="40" y="12" textAnchor="middle" dominantBaseline="central" fontSize="13" fill="#93c5fd" style={{ pointerEvents: "none" }}>
              ⟲
            </text>
            <circle cx="14" cy="12" r="11" fill="transparent" style={{ cursor: "pointer" }} onClick={() => onDelete(it.id)} />
            <circle cx="40" cy="12" r="11" fill="transparent" style={{ cursor: "pointer" }} onClick={() => onFlip(it.id)} />
          </g>
        );
      })()}
    </svg>
  );
}

/* ------------------------------ logic ------------------------------ */

function rangeFit(v, [lo, hi]) {
  if (v >= lo && v <= hi) return 100;
  const d = v < lo ? lo - v : v - hi;
  return Math.max(0, 100 - d * 2.5);
}

function computeFits(items, humidity, light) {
  return items.map((it) => {
    const spec = byId(it.type);
    if (!spec.hum) return { ...it, fit: null };
    const fit = Math.round((rangeFit(humidity, spec.hum) + rangeFit(light, spec.light)) / 2);
    return { ...it, fit };
  });
}

function problemFor(spec, humidity, light) {
  if (humidity > spec.hum[1]) return `${spec.name} is too damp in here`;
  if (humidity < spec.hum[0]) return `${spec.name} wants more mist`;
  if (light > spec.light[1]) return `${spec.name} is getting sunburnt`;
  if (light < spec.light[0]) return `${spec.name} needs more light`;
  return null;
}

function moodFor(score) {
  if (score === null) return "Your jar is empty — add some greenery!";
  if (score >= 85) return "A thriving little paradise 🌿✨";
  if (score >= 65) return "Happy and growing 👍";
  if (score >= 45) return "Getting by, but keep an eye on it";
  if (score >= 25) return "Struggling — check the warnings below";
  return "Poor little garden 😢";
}

/* ------------------------------- app ------------------------------ */

export default function App() {
  const [items, setItems] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [humidity, setHumidity] = useState(60);
  const [light, setLight] = useState(55);
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const idRef = useRef(1);

  const fitted = useMemo(() => computeFits(items, humidity, light), [items, humidity, light]);

  const living = fitted.filter((i) => i.fit !== null);
  const score = living.length
    ? Math.round(living.reduce((s, i) => s + i.fit, 0) / living.length)
    : null;

  const warnings = useMemo(() => {
    const out = [];
    for (const it of living) {
      if (it.fit < 55) {
        const p = problemFor(byId(it.type), humidity, light);
        if (p) out.push(p);
      }
    }
    return out.slice(0, 4);
  }, [living, humidity, light]);

  function toSvg(e) {
    const r = svgRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 400, y: ((e.clientY - r.top) / r.height) * 520 };
  }

  const insideJar = (p) => p.x >= 75 && p.x <= 325 && p.y >= 125 && p.y <= 472;

  function place(p) {
    const id = idRef.current++;
    setItems((prev) => [
      ...prev,
      {
        id,
        type: selectedTool,
        x: Math.round(p.x),
        y: Math.round(p.y),
        scale: 0.9 + Math.random() * 0.3,
        flip: Math.random() < 0.5,
        seed: Math.floor(Math.random() * 10),
        fit: null,
      },
    ]);
    setSelectedId(id);
  }

  function onBackground(e) {
    dragRef.current = null;
    if (selectedTool) {
      const p = toSvg(e);
      if (insideJar(p)) place(p);
    } else {
      setSelectedId(null);
    }
  }

  function onItemDown(e, item) {
    e.stopPropagation();
    setSelectedId(item.id);
    dragRef.current = { id: item.id };
  }

  function onMove(e) {
    const d = dragRef.current;
    if (!d) return;
    const p = toSvg(e);
    if (!insideJar(p)) return;
    setItems((prev) => prev.map((i) => (i.id === d.id ? { ...i, x: Math.round(p.x), y: Math.round(p.y) } : i)));
  }

  function onUp() {
    dragRef.current = null;
  }

  function flipItem(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, flip: !i.flip } : i)));
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedId(null);
  }

  function clearAll() {
    setItems([]);
    setSelectedId(null);
  }

  function surprise() {
    setSelectedTool(null);
    setSelectedId(null);
    const pool = CATALOG.filter((c) => c.kind !== "decor");
    const decorPool = CATALOG.filter((c) => c.kind === "decor");
    const chosen = [];
    const n = 5 + Math.floor(Math.random() * 3);
    const picks = [];
    for (let i = 0; i < n; i++) picks.push(pool[Math.floor(Math.random() * pool.length)]);
    if (Math.random() < 0.8) picks.push(decorPool[Math.floor(Math.random() * decorPool.length)]);
    picks.forEach((spec) => {
      chosen.push({
        id: idRef.current++,
        type: spec.id,
        x: 95 + Math.random() * 210,
        y: 452 + Math.random() * 20,
        scale: 0.9 + Math.random() * 0.3,
        flip: Math.random() < 0.5,
        seed: Math.floor(Math.random() * 10),
        fit: null,
      });
    });
    setItems(chosen);
  }

  const scoreColor = score === null ? "#94a3b8" : score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  const level = (mid) => (mid > 60 ? "high" : mid < 35 ? "low" : "med");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef5ec] to-[#e0edf2] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#22333b]">🌿 Terrarium Builder</h1>
            <p className="text-[#5c6b73]">Design a tiny world and keep it happy.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={surprise}
              className="px-4 py-2 rounded-xl bg-[#3e7d4f] text-white font-medium hover:bg-[#356b43] transition shadow-sm"
            >
              🎲 Surprise me
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl bg-white text-[#22333b] font-medium hover:bg-[#eef2f4] transition shadow-sm border border-[#d8e2e6]"
            >
              🗑 Clear
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* jar panel */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm p-4 md:p-6 border border-[#e4ebee]">
            <Jar
              items={fitted}
              selectedTool={selectedTool}
              selectedId={selectedId}
              svgRef={svgRef}
              humidity={humidity}
              light={light}
              onBackground={onBackground}
              onItemDown={onItemDown}
              onMove={onMove}
              onUp={onUp}
              onFlip={flipItem}
              onDelete={deleteItem}
            />
            <p className="text-center text-sm text-[#7c8a91] mt-3">
              {selectedTool
                ? `Placing ${byId(selectedTool).name} — click inside the jar. Tap another card to switch.`
                : "Pick a plant or critter, then click inside the jar. Drag to move, tap for options."}
            </p>
          </div>

          {/* side panel */}
          <div className="w-full lg:w-96 space-y-4">
            {/* palette */}
            <div className="bg-white rounded-3xl shadow-sm p-4 border border-[#e4ebee]">
              <h2 className="font-semibold text-[#22333b] mb-3">Greenhouse shelf</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                {CATALOG.map((c) => {
                  const active = selectedTool === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedTool(active ? null : c.id)}
                      className={`rounded-2xl p-2 border transition text-left ${
                        active
                          ? "border-[#3e7d4f] bg-[#eaf4ec] ring-2 ring-[#3e7d4f]/40"
                          : "border-[#e4ebee] bg-[#fafcfc] hover:border-[#bcd8de]"
                      }`}
                    >
                      <div className="flex justify-center">
                        <svg viewBox="-30 -45 60 50" className="w-14 h-12">
                          <ItemArt id={c.id} />
                        </svg>
                      </div>
                      <div className="text-xs font-medium text-[#22333b] text-center mt-1">{c.name}</div>
                      {c.hum ? (
                        <div className="flex justify-center gap-1 mt-0.5 text-[10px] text-[#7c8a91]">
                          <span title="water">💧{level((c.hum[0] + c.hum[1]) / 2)}</span>
                          <span title="light">☀{level((c.light[0] + c.light[1]) / 2)}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#7c8a91] text-center mt-0.5">decor</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* sliders */}
            <div className="bg-white rounded-3xl shadow-sm p-4 border border-[#e4ebee]">
              <h2 className="font-semibold text-[#22333b] mb-3">Conditions</h2>
              <label className="block text-sm text-[#42525b] mb-1">
                ☀️ Light <span className="float-right font-mono text-[#5c6b73]">{light}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={light}
                onChange={(e) => setLight(Number(e.target.value))}
                className="w-full accent-[#f5c04e] mb-4"
              />
              <label className="block text-sm text-[#42525b] mb-1">
                💧 Humidity <span className="float-right font-mono text-[#5c6b73]">{humidity}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-[#4a9dd9]"
              />
            </div>

            {/* health */}
            <div className="bg-white rounded-3xl shadow-sm p-4 border border-[#e4ebee]">
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-semibold text-[#22333b]">Ecosystem health</h2>
                <span className="text-3xl font-bold" style={{ color: scoreColor }}>
                  {score === null ? "–" : score}
                </span>
              </div>
              <div className="h-3 rounded-full bg-[#eef2f4] overflow-hidden mb-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: scoreColor }}
                  animate={{ width: `${score ?? 0}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
              <p className="text-sm text-[#42525b] mb-3">{moodFor(score)}</p>
              {warnings.length > 0 && (
                <ul className="text-xs space-y-1">
                  {warnings.map((w, i) => (
                    <li key={i} className="flex gap-1.5 items-start text-[#b45309]">
                      <span>⚠️</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 text-xs text-[#7c8a91] flex justify-between">
                <span>🌱 {living.filter((i) => byId(i.type).kind === "flora").length} plants</span>
                <span>🐛 {living.filter((i) => byId(i.type).kind === "critter").length} critters</span>
                <span>🪨 {fitted.filter((i) => byId(i.type).kind === "decor").length} decor</span>
              </div>
            </div>

            <p className="text-xs text-[#94a3b8] text-center">
              Tip: group plants with similar light &amp; water needs, and mist accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
