/**
 * Two-ink hero illustration: a git branch graph flows across the top into a terminal, set against a red
 * disc with signal rings and a row of metric bars. Pure SVG, no assets.
 *
 * The terminal's lines come from the profile (editable in the admin portal); {projects} expands to the
 * featured projects, so adding a project updates the picture too.
 *
 * Anchored right (xMaxYMid slice) so the left side, where the hero text sits, stays calm at every size.
 */
import { featuredProjects, profile } from "@/lib/content";

const BARS = Array.from({ length: 19 }, (_, i) => {
  const h = 70 + Math.round(Math.abs(Math.sin(i * 1.7) * 110 + Math.sin(i * 0.45) * 80));
  return { x: 960 + i * 34, h };
});

const MONO = { fontFamily: "var(--ff-mono), ui-monospace, Consolas, monospace" };

const PAPER = "#efe7d6";
const DIM = "#a59d8b";
const YELLOW = "#f2c230";
const RED = "#e0402c";

// Terminal placement and type metrics (viewBox units).
const TX = 1140;
const TY = 100;
const TW = 440;
const FONT = 20;
const LH = 34;
const FIRST = 84;
const MAX_CHARS = 32; // what fits in the window at this font size
const MAX_LINES = 9;

type Row = { symbol: string; text: string; tone: "command" | "status" | "output" };

/** Greedy word wrap that keeps the separator the tokens were joined with. */
function wrap(tokens: string[], sep: string, max: number): string[] {
  const rows: string[] = [];
  let cur = "";
  for (const t of tokens) {
    if (!cur) cur = t;
    else if ((cur + sep + t).length <= max) cur += sep + t;
    else {
      rows.push(cur);
      cur = t;
    }
  }
  if (cur) rows.push(cur);
  return rows.map((r) => (r.length > max ? r.slice(0, max - 1) + "…" : r));
}

function terminalRows(): Row[] {
  const source = profile.terminal?.length ? profile.terminal : ["$ whoami", profile.shortName, "$ ls projects/", "{projects}"];
  const rows: Row[] = [];
  for (const raw of source) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^([$✓●✗>])\s+(.*)$/);
    const symbol = m ? m[1] : "";
    const body = m ? m[2] : line;
    const tone: Row["tone"] = symbol === "$" ? "command" : symbol ? "status" : "output";
    const max = symbol ? MAX_CHARS - 2 : MAX_CHARS;
    const pieces = body.includes("{projects}")
      ? wrap(featuredProjects.map((p) => p.slug), "  ", max)
      : wrap(body.replace(/\{name\}/g, profile.shortName).replace(/\{title\}/g, profile.title).split(/\s+/), " ", max);
    pieces.forEach((text, i) => rows.push({ symbol: i === 0 ? symbol : "", text, tone }));
  }
  return rows.slice(0, MAX_LINES);
}

export default function HeroArt() {
  const rows = terminalRows();
  const cursorY = FIRST + rows.length * LH;
  const TH = cursorY + 26;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
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
        <circle key={r} cx="1400" cy="270" r={r} fill="none" stroke={RED} strokeWidth={9 - i * 1.5} opacity={0.7 - i * 0.12} />
      ))}
      <circle cx="1400" cy="270" r="250" fill={RED} />
      <circle cx="1400" cy="270" r="250" fill="url(#ha-disc-dots)" mask="url(#ha-disc-mask)" />

      {/* Metric bars under the terminal. */}
      {BARS.map((b) => (
        <rect key={b.x} x={b.x} y={900 - b.h} width="22" height={b.h} fill="#10286e" />
      ))}

      <rect width="1600" height="900" fill="url(#ha-dots)" mask="url(#ha-dot-mask)" opacity="0.45" />

      {/* Git graph: two branches fork off main and merge back, then main flows into the terminal. Kept in the top band. */}
      <g fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw-in" pathLength={1} d={`M-20 175 H${TX - 14}`} stroke={PAPER} />
        <path className="draw-in" pathLength={1} style={{ animationDelay: "0.3s" }} d="M240 175 C280 175 280 97 320 97 H500 C540 97 540 175 580 175" stroke={YELLOW} />
        <path className="draw-in" pathLength={1} style={{ animationDelay: "0.55s" }} d="M650 175 C690 175 690 97 730 97 H890 C930 97 930 175 970 175" stroke={RED} />
        <path d={`M${TX - 30} 163 L${TX - 12} 175 L${TX - 30} 187`} stroke={PAPER} />
      </g>
      <g strokeWidth="5">
        {[90, 170, 410, 800, 1050].map((x) => (
          <circle key={x} cx={x} cy="175" r="11" fill="#1b3fa8" stroke={PAPER} />
        ))}
        {[580, 970].map((x) => (
          <circle key={x} cx={x} cy="175" r="13" fill={PAPER} stroke={PAPER} />
        ))}
        {[375, 450].map((x) => (
          <circle key={x} cx={x} cy="97" r="10" fill="#1b3fa8" stroke={YELLOW} />
        ))}
        {[775, 850].map((x) => (
          <circle key={x} cx={x} cy="97" r="10" fill="#1b3fa8" stroke={RED} />
        ))}
      </g>
      <g style={MONO} fontSize="16" fill={PAPER} opacity="0.85">
        <text x="28" y="155">main</text>
        <text x="322" y="76">feature/*</text>
        <text x="732" y="76">hotfix/*</text>
      </g>

      {/* Terminal window; its height follows the number of lines. */}
      <g className="hero-term" transform={`translate(${TX} ${TY})`}>
        <rect x="14" y="14" width={TW} height={TH} fill="#0e0d12" />
        <rect width={TW} height={TH} fill="#16151a" stroke={PAPER} strokeWidth="3" />
        <rect width={TW} height="44" fill={PAPER} />
        <circle cx="24" cy="22" r="7" fill={RED} />
        <circle cx="46" cy="22" r="7" fill={YELLOW} />
        <circle cx="68" cy="22" r="7" fill="#1b3fa8" />
        <text x="96" y="28" style={MONO} fontSize="16" fill="#16151a">
          {profile.terminalTitle || "~/portfolio — main"}
        </text>
        <g style={{ ...MONO, whiteSpace: "pre" }} fontSize={FONT}>
          {rows.map((row, i) => {
            // Wrapped continuation lines of a command/status line sit under its text, not under the symbol.
            const indent = !row.symbol && row.tone !== "output" ? FONT * 1.2 : 0;
            return (
              <text key={i} x={26 + indent} y={FIRST + i * LH} xmlSpace="preserve" className="type-in" style={{ animationDelay: `${0.8 + i * 0.22}s` }}>
                {row.symbol && <tspan fill={YELLOW}>{row.symbol} </tspan>}
                <tspan fill={row.tone === "output" ? DIM : PAPER} fontWeight={row.tone === "command" ? 600 : 400}>
                  {row.text}
                </tspan>
              </text>
            );
          })}
          <text x="26" y={cursorY} className="type-in" style={{ animationDelay: `${0.8 + rows.length * 0.22}s` }}>
            <tspan fill={YELLOW}>$ </tspan>
          </text>
          <rect className="cursor-blink" x="52" y={cursorY - 17} width="12" height="21" fill={RED} />
        </g>
      </g>

      <rect width="1600" height="900" fill="url(#ha-shade)" />
    </svg>
  );
}
