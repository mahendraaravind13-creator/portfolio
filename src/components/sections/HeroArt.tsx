/**
 * Two-ink hero background: a git branch graph across the top, a red disc with signal rings and a row of
 * metric bars. Pure SVG, no assets. The photo and terminal windows sit on top of it as HTML (HeroWindows).
 *
 * Anchored top-right (xMaxYMin slice): wide screens crop the bottom (bars) rather than the graph, and the
 * left side, where the hero text sits, stays calm at every size.
 */
const BARS = Array.from({ length: 19 }, (_, i) => {
  const h = 70 + Math.round(Math.abs(Math.sin(i * 1.7) * 110 + Math.sin(i * 0.45) * 80));
  return { x: 960 + i * 34, h };
});

const MONO = { fontFamily: "var(--ff-mono), ui-monospace, Consolas, monospace" };
const PAPER = "#efe7d6";
const YELLOW = "#f2c230";
const RED = "#e0402c";

export default function HeroArt() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMin slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="ha-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="3.2" fill="#16151a" />
        </pattern>
        <linearGradient id="ha-dot-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
        </linearGradient>
        <mask id="ha-dot-mask">
          <rect width="1600" height="900" fill="url(#ha-dot-fade)" />
        </mask>
        <pattern id="ha-disc-dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2.4" fill="#1b3fa8" />
        </pattern>
        <linearGradient id="ha-disc-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.9" />
        </linearGradient>
        <mask id="ha-disc-mask">
          <rect width="1600" height="900" fill="url(#ha-disc-fade)" />
        </mask>
        <linearGradient id="ha-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#16151a" stopOpacity="0" />
          <stop offset="1" stopColor="#16151a" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="#1b3fa8" />

      {/* Signal rings and the disc. */}
      {[330, 410, 500, 600, 710].map((r, i) => (
        <circle key={r} cx="1330" cy="340" r={r} fill="none" stroke={RED} strokeWidth={9 - i * 1.5} opacity={0.7 - i * 0.12} />
      ))}
      <circle cx="1330" cy="340" r="250" fill={RED} />
      <circle cx="1330" cy="340" r="250" fill="url(#ha-disc-dots)" mask="url(#ha-disc-mask)" />

      {/* Metric bars. */}
      {BARS.map((b) => (
        <rect key={b.x} x={b.x} y={900 - b.h} width="22" height={b.h} fill="#10286e" />
      ))}

      <rect width="1600" height="900" fill="url(#ha-dots)" mask="url(#ha-dot-mask)" opacity="0.45" />

      {/* Git graph across the top: branches fork off main and merge back. */}
      <g fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw-in" pathLength={1} d="M-20 150 H1620" stroke={PAPER} />
        <path className="draw-in" pathLength={1} style={{ animationDelay: "0.3s" }} d="M240 150 C280 150 280 72 320 72 H500 C540 72 540 150 580 150" stroke={YELLOW} />
        <path className="draw-in" pathLength={1} style={{ animationDelay: "0.55s" }} d="M650 150 C690 150 690 72 730 72 H890 C930 72 930 150 970 150" stroke={RED} />
        <path className="draw-in" pathLength={1} style={{ animationDelay: "0.8s" }} d="M1060 150 C1100 150 1100 72 1140 72 H1300 C1340 72 1340 150 1380 150" stroke={YELLOW} />
      </g>
      <g strokeWidth="5">
        {[90, 170, 410, 800, 1020, 1220, 1470].map((x) => (
          <circle key={x} cx={x} cy="150" r="11" fill="#1b3fa8" stroke={PAPER} />
        ))}
        {[580, 970, 1380].map((x) => (
          <circle key={x} cx={x} cy="150" r="13" fill={PAPER} stroke={PAPER} />
        ))}
        {[375, 450, 1185, 1255].map((x) => (
          <circle key={x} cx={x} cy="72" r="10" fill="#1b3fa8" stroke={YELLOW} />
        ))}
        {[775, 850].map((x) => (
          <circle key={x} cx={x} cy="72" r="10" fill="#1b3fa8" stroke={RED} />
        ))}
      </g>
      <g style={MONO} fontSize="16" fill={PAPER} opacity="0.85">
        <text x="28" y="130">main</text>
        <text x="322" y="52">feature/*</text>
        <text x="732" y="52">hotfix/*</text>
        <text x="1142" y="52">release/*</text>
      </g>

      <rect width="1600" height="900" fill="url(#ha-shade)" />
    </svg>
  );
}
