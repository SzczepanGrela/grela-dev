// Skills section explorations — 6 variants for the design canvas.
// Each variant assumes it lives inside a `.cv-artboard-root` that already has
// a TopBar, so it just renders its own <section>. Variant V0 is the current
// (locked-in) layout, kept as a baseline for comparison.

const { useState: useSv, useMemo: useMemoSv, useRef: useRefSv, useEffect: useEffSv } = React;

// ─────────────────────────────────────────────────────────────
// Enriched skills model — adds level (1–5), years, and project links.
// Pulled from the existing project tag set so "used in" is real.
// ─────────────────────────────────────────────────────────────
const SKILLS_RICH = [
  {
    group: { en: "Backend",   pl: "Backend" },
    items: [
      { name: ".NET",             level: 5, years: 4, tag: "dotnet" },
      { name: "ASP.NET Core",     level: 5, years: 3, tag: "aspnet" },
      { name: "C#",               level: 5, years: 4, tag: "csharp" },
      { name: "Python",           level: 4, years: 3, tag: "python" },
      { name: "REST",             level: 5, years: 4, tag: "rest" },
      { name: "Entity Framework", level: 4, years: 3, tag: "efcore" },
      { name: "MediatR",          level: 4, years: 2, tag: "mediatr" },
    ],
  },
  {
    group: { en: "ML / Data",  pl: "ML / Dane" },
    items: [
      { name: "PyTorch",                 level: 4, years: 2, tag: "pytorch" },
      { name: "ONNX",                    level: 3, years: 1, tag: "onnx" },
      { name: "Vertex AI",               level: 3, years: 1, tag: "vertex" },
      { name: "Collaborative Filtering", level: 4, years: 2, tag: "collab" },
      { name: "Generative AI",           level: 3, years: 1, tag: "genai" },
    ],
  },
  {
    group: { en: "DevOps",     pl: "DevOps" },
    items: [
      { name: "Docker",         level: 4, years: 3, tag: "docker" },
      { name: "GitHub Actions", level: 4, years: 2, tag: "gha" },
      { name: "CI/CD",          level: 4, years: 2, tag: "cicd" },
      { name: "Grafana",        level: 3, years: 1, tag: "grafana" },
      { name: "Prometheus",     level: 3, years: 1, tag: "prometheus" },
      { name: "GCP",            level: 3, years: 1, tag: "gcp" },
    ],
  },
  {
    group: { en: "Storage",    pl: "Bazy danych" },
    items: [
      { name: "PostgreSQL",   level: 4, years: 3, tag: "postgres" },
      { name: "SQL",          level: 4, years: 4, tag: "sql" },
      { name: "Cloudflare R2", level: 3, years: 1, tag: "r2" },
    ],
  },
  {
    group: { en: "Frontend",   pl: "Frontend" },
    items: [
      { name: "Blazor",     level: 3, years: 2, tag: "blazor" },
      { name: "TypeScript", level: 3, years: 2, tag: "typescript" },
      { name: "PyQt",       level: 3, years: 1, tag: "pyqt" },
    ],
  },
  {
    group: { en: "Practices", pl: "Praktyki" },
    items: [
      { name: "Clean Architecture", level: 5, years: 3, tag: "cleanArch" },
      { name: "CQRS",               level: 4, years: 2, tag: "cqrs" },
      { name: "Microservices",      level: 4, years: 2, tag: "microsvc" },
      { name: "Unit Testing",       level: 4, years: 3, tag: "unitTest" },
      { name: "Integration Testing",level: 4, years: 2, tag: "intTest" },
      { name: "Load Testing",       level: 3, years: 1, tag: "loadTest" },
    ],
  },
];

// helper — list of projects that use a given skill tag
function projectsForTag(tag) {
  return (window.PROJECTS || []).filter(p => (p.tags || []).includes(tag));
}

// shared section header (matches the existing visual vocabulary)
function SVHeader({ num, label, title, sub }) {
  return (
    <div>
      <SectionLabel num={num} label={label} />
      {title ? (
        <h2 style={{
          fontFamily: "var(--display)",
          fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 500,
          letterSpacing: "-0.025em", lineHeight: 1.05,
          margin: "32px 0 16px", maxWidth: 900, color: "var(--fg)",
          textWrap: "balance",
        }}>{title}</h2>
      ) : null}
      {sub ? (
        <p style={{
          fontSize: 16, color: "var(--fg-dim)", margin: "0 0 48px",
          maxWidth: 720, lineHeight: 1.55,
        }}>{sub}</p>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V0 — Current / baseline (lists, mono kicker per group)
// ─────────────────────────────────────────────────────────────
function SkillsV0_Baseline() {
  const { t, lang } = useApp();
  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SVHeader
        num="02" label={t("section_skills")}
        title={lang === "en" ? "Stack — by domain." : "Stack — wg domeny."}
        sub={lang === "en"
          ? "Plain lists, grouped by where they live in the architecture."
          : "Prosta lista, pogrupowana po miejscu w architekturze."}
      />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 32,
      }}>
        {SKILLS_RICH.map((g, i) => (
          <div key={i}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--accent)", marginBottom: 16,
            }}>{g.group[lang]}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {g.items.map((it, j) => (
                <li key={j} style={{
                  padding: "10px 0",
                  borderTop: "1px solid var(--border)",
                  fontSize: 15, color: "var(--fg)",
                }}>{it.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// V1 — Proficiency bars — group → skill rows with a 5-step bar + years
// Most data-dense without being noisy. Bars use the accent color.
// ─────────────────────────────────────────────────────────────
function SkillsV1_Bars() {
  const { t, lang } = useApp();
  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SVHeader
        num="02" label={t("section_skills")}
        title={lang === "en"
          ? "What I reach for, and how often."
          : "Po co sięgam i jak często."}
        sub={lang === "en"
          ? "Five-step proficiency, plus years on the clock per skill."
          : "Pięciostopniowa biegłość plus przepracowane lata per technologia."}
      />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "48px 64px",
      }}>
        {SKILLS_RICH.map((g, gi) => (
          <div key={gi}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent)",
              borderTop: "1px solid var(--accent)", paddingTop: 14, marginBottom: 18,
              display: "flex", justifyContent: "space-between",
            }}>
              <span>{g.group[lang]}</span>
              <span style={{ color: "var(--fg-dim)" }}>{g.items.length}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
              {g.items.map((it, j) => (
                <li key={j} style={{
                  display: "grid", gridTemplateColumns: "1fr 110px 60px",
                  alignItems: "center", gap: 16,
                }}>
                  <span style={{ fontSize: 15, color: "var(--fg)" }}>{it.name}</span>
                  <span style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(n => (
                      <span key={n} style={{
                        flex: 1, height: 6, borderRadius: 2,
                        background: n <= it.level
                          ? "var(--accent)"
                          : "color-mix(in oklab, var(--fg-dim) 25%, transparent)",
                      }} />
                    ))}
                  </span>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)",
                    textAlign: "right", letterSpacing: "0.04em",
                  }}>{it.years}{lang === "en" ? "y" : "lat"}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// V2 — Heatmap matrix — projects × skills, intensity = used/strong/light
// Data-driven (uses PROJECTS tags). Rows = projects, columns = skills,
// shaded squares show where the work happened.
// ─────────────────────────────────────────────────────────────
function SkillsV2_Heatmap() {
  const { t, lang } = useApp();
  const projects = (window.PROJECTS || []).filter(p => !p.placeholder).slice(0, 6);
  // top skills by frequency across real projects
  const skillCounts = useMemoSv(() => {
    const m = new Map();
    SKILLS_RICH.forEach(g => g.items.forEach(it => {
      const used = projects.filter(p => p.tags.includes(it.tag)).length;
      if (used > 0) m.set(it.tag, { ...it, group: g.group, used });
    }));
    return [...m.values()].sort((a, b) => b.used - a.used).slice(0, 18);
  }, []);

  const cellIntensity = (proj, sk) => {
    if (!proj.tags.includes(sk.tag)) return 0;
    // Heuristic — first three skills of project are "primary"
    const idx = proj.tags.indexOf(sk.tag);
    if (idx < 4) return 1;
    if (idx < 8) return 0.65;
    return 0.35;
  };

  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SVHeader
        num="02" label={t("section_skills")}
        title={lang === "en"
          ? "Where each tool actually got used."
          : "Gdzie naprawdę użyłem każdego narzędzia."}
        sub={lang === "en"
          ? "Projects on the rows, technologies on the columns. Darker cells, heavier lifting."
          : "Projekty w wierszach, technologie w kolumnach. Ciemniejsza komórka — większy wkład."}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: `200px repeat(${skillCounts.length}, 36px)`,
        rowGap: 4, columnGap: 4,
        marginTop: 16,
      }}>
        {/* corner */}
        <div />
        {/* header row */}
        {skillCounts.map(sk => (
          <div key={sk.tag} style={{
            height: 140, position: "relative",
          }}>
            <div style={{
              position: "absolute", bottom: 4, left: "50%",
              transform: "rotate(-60deg)", transformOrigin: "left bottom",
              fontFamily: "var(--mono)", fontSize: 11,
              color: "var(--fg-dim)", whiteSpace: "nowrap",
            }}>{sk.name}</div>
          </div>
        ))}

        {projects.map(p => (
          <React.Fragment key={p.id}>
            <div style={{
              fontSize: 13, color: "var(--fg)", padding: "8px 12px 8px 0",
              borderRight: "1px solid var(--border)", textAlign: "right",
              fontFamily: "var(--mono)", letterSpacing: "0.01em",
              display: "flex", alignItems: "center", justifyContent: "flex-end",
            }}>{p.name}</div>
            {skillCounts.map(sk => {
              const v = cellIntensity(p, sk);
              return (
                <div key={sk.tag} title={`${p.name} · ${sk.name}`} style={{
                  height: 28, borderRadius: 3,
                  background: v > 0
                    ? `color-mix(in oklab, var(--accent) ${Math.round(v*100)}%, var(--bg-elev))`
                    : "color-mix(in oklab, var(--fg-dim) 8%, transparent)",
                  border: v === 0 ? "1px solid var(--border)" : "none",
                }} />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* legend */}
      <div style={{
        display: "flex", gap: 20, marginTop: 32, alignItems: "center",
        fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)",
        textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        <span>{lang === "en" ? "Lift" : "Wkład"}</span>
        {[0.35, 0.65, 1].map((v, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 22, height: 14, borderRadius: 3,
              background: `color-mix(in oklab, var(--accent) ${v*100}%, var(--bg-elev))`,
            }} />
            {["light", "solid", "heavy"][i]}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// V3 — Tag cloud, weighted by proficiency × years
// Loose flowing layout, font-size encodes weight.
// ─────────────────────────────────────────────────────────────
function SkillsV3_Cloud() {
  const { t, lang } = useApp();
  const allSkills = useMemoSv(() => {
    const flat = [];
    SKILLS_RICH.forEach(g => g.items.forEach(it =>
      flat.push({ ...it, group: g.group[lang], weight: it.level + Math.min(it.years, 4) })
    ));
    return flat.sort((a, b) => b.weight - a.weight);
  }, [lang]);

  const minW = 4, maxW = 9;
  const sizeFor = w => 14 + ((w - minW) / (maxW - minW)) * 38;
  const opacityFor = w => 0.45 + ((w - minW) / (maxW - minW)) * 0.55;
  const colorFor = it =>
    it.level >= 5 ? "var(--accent)" : it.level >= 4 ? "var(--fg)" : "var(--fg-dim)";

  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SVHeader
        num="02" label={t("section_skills")}
        title={lang === "en"
          ? "The whole stack at a glance."
          : "Cały stack na pierwszy rzut oka."}
        sub={lang === "en"
          ? "Size and weight track confidence — bigger means I've shipped with it more."
          : "Rozmiar i waga oddają pewność — im większe, tym więcej wdrożeń."}
      />
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "baseline",
        rowGap: 18, columnGap: 28, maxWidth: 1200,
        fontFamily: "var(--display)", letterSpacing: "-0.015em",
      }}>
        {allSkills.map((it, i) => (
          <span key={i} style={{
            fontSize: sizeFor(it.weight),
            color: colorFor(it),
            opacity: opacityFor(it.weight),
            lineHeight: 1.0, fontWeight: it.level >= 4 ? 500 : 400,
            display: "inline-flex", alignItems: "baseline", gap: 6,
          }}>
            {it.name}
            <sup style={{
              fontFamily: "var(--mono)", fontSize: 10,
              color: "var(--fg-dim)", letterSpacing: "0.04em",
              opacity: 0.7, fontWeight: 400,
            }}>{"·".repeat(it.level)}</sup>
          </span>
        ))}
      </div>

      <div style={{
        marginTop: 56, display: "flex", gap: 24,
        fontFamily: "var(--mono)", fontSize: 11,
        color: "var(--fg-dim)", letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        <span><span style={{ color: "var(--accent)" }}>●</span> Daily driver</span>
        <span><span style={{ color: "var(--fg)" }}>●</span> Strong</span>
        <span><span style={{ color: "var(--fg-dim)" }}>●</span> Working knowledge</span>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// V4 — Radar / polygon — six axes (one per domain), avg level per axis
// Pure SVG, no deps. Uses --accent for the polygon stroke + soft fill.
// ─────────────────────────────────────────────────────────────
function SkillsV4_Radar() {
  const { t, lang } = useApp();
  const axes = SKILLS_RICH.map(g => ({
    label: g.group[lang],
    avg: g.items.reduce((a, b) => a + b.level, 0) / g.items.length,
    count: g.items.length,
  }));
  const N = axes.length;
  const size = 520, cx = size / 2, cy = size / 2;
  const radius = 200;
  const angle = i => (i / N) * Math.PI * 2 - Math.PI / 2;
  const point = (i, mag) => {
    const a = angle(i);
    return [cx + Math.cos(a) * radius * mag, cy + Math.sin(a) * radius * mag];
  };
  const labelPoint = i => {
    const a = angle(i);
    return [cx + Math.cos(a) * (radius + 32), cy + Math.sin(a) * (radius + 32)];
  };
  const polygon = axes.map((ax, i) => point(i, ax.avg / 5).join(",")).join(" ");

  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SVHeader
        num="02" label={t("section_skills")}
        title={lang === "en"
          ? "Shape of the engineer."
          : "Kształt inżyniera."}
        sub={lang === "en"
          ? "Six domains, average proficiency per axis. Lopsided on purpose."
          : "Sześć domen, średnia biegłość per oś. Przekrzywione celowo."}
      />

      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        alignItems: "center", gap: 64,
      }}>
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 560 }}>
          {/* concentric grid */}
          {[1, 2, 3, 4, 5].map(r => (
            <polygon
              key={r}
              points={axes.map((_, i) => point(i, r / 5).join(",")).join(" ")}
              fill="none"
              stroke="var(--border)"
              strokeWidth={r === 5 ? 1.5 : 1}
              opacity={r === 5 ? 1 : 0.6}
            />
          ))}
          {/* axis lines */}
          {axes.map((_, i) => {
            const [x, y] = point(i, 1);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />;
          })}
          {/* polygon */}
          <polygon
            points={polygon}
            fill="color-mix(in oklab, var(--accent) 20%, transparent)"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* points */}
          {axes.map((ax, i) => {
            const [x, y] = point(i, ax.avg / 5);
            return <circle key={i} cx={x} cy={y} r="5" fill="var(--accent)" />;
          })}
          {/* labels */}
          {axes.map((ax, i) => {
            const [lx, ly] = labelPoint(i);
            const a = angle(i);
            const anchor = Math.abs(Math.cos(a)) < 0.3 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
            return (
              <g key={i}>
                <text
                  x={lx} y={ly}
                  textAnchor={anchor}
                  fill="var(--fg)"
                  fontFamily="var(--display)"
                  fontSize="16"
                  dominantBaseline="middle"
                  letterSpacing="-0.01em"
                >{ax.label}</text>
                <text
                  x={lx} y={ly + 18}
                  textAnchor={anchor}
                  fill="var(--fg-dim)"
                  fontFamily="var(--mono)"
                  fontSize="11"
                  dominantBaseline="middle"
                >{ax.avg.toFixed(1)} / 5 · {ax.count} {lang === "en" ? "tools" : "narz."}</text>
              </g>
            );
          })}
        </svg>

        <div style={{ maxWidth: 460 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 20 }}>
            {SKILLS_RICH.map((g, i) => (
              <li key={i}>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
                  color: "var(--accent)", textTransform: "uppercase", marginBottom: 6,
                }}>{g.group[lang]}</div>
                <div style={{ fontSize: 15, color: "var(--fg-dim)", lineHeight: 1.55 }}>
                  {g.items.map(it => it.name).join(" · ")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// V5 — Terminal / `skills --list` — monospace tree output, type-style
// Plays into the dev-tool aesthetic without being twee.
// ─────────────────────────────────────────────────────────────
function SkillsV5_Terminal() {
  const { t, lang } = useApp();
  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SVHeader
        num="02" label={t("section_skills")}
        title={lang === "en"
          ? "skills --list --by=domain"
          : "skills --list --by=domena"}
        sub={lang === "en"
          ? "Same content, served the way I'd actually read it."
          : "Ta sama treść, podana tak, jak sam wolałbym to czytać."}
      />

      <div style={{
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "20px 24px 28px",
        fontFamily: "var(--mono)",
        fontSize: 13,
        lineHeight: 1.7,
        color: "var(--fg)",
        maxWidth: 920,
      }}>
        <div style={{
          display: "flex", gap: 6, marginBottom: 18, alignItems: "center",
          paddingBottom: 12, borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.66 0.15 25)" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.78 0.13 85)" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.74 0.16 142)" }} />
          <span style={{
            marginLeft: 12, color: "var(--fg-dim)", fontSize: 11, letterSpacing: "0.05em",
          }}>~/portfolio — zsh</span>
        </div>

        <div>
          <span style={{ color: "var(--fg-dim)" }}>$ </span>
          <span style={{ color: "var(--accent)" }}>skills</span>
          <span> --list --by=domain</span>
        </div>
        <div style={{ height: 12 }} />

        {SKILLS_RICH.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 14 }}>
            <div style={{ color: "var(--accent)" }}>
              ▸ {g.group[lang].toLowerCase()}/
            </div>
            {g.items.map((it, i) => {
              const last = i === g.items.length - 1;
              const branch = last ? "└──" : "├──";
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto auto",
                  gap: 12,
                }}>
                  <span style={{ color: "var(--fg-dim)" }}>{"  "}{branch}</span>
                  <span>{it.name}</span>
                  <span style={{ color: "var(--fg-dim)" }}>
                    {"●".repeat(it.level)}{"○".repeat(5 - it.level)}
                  </span>
                  <span style={{ color: "var(--fg-dim)", minWidth: 56, textAlign: "right" }}>
                    {it.years}y
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 18, color: "var(--fg-dim)" }}>
          <span style={{ color: "var(--accent)" }}>✓</span> {SKILLS_RICH.reduce((a, g) => a + g.items.length, 0)} entries · {SKILLS_RICH.length} domains
        </div>
        <div>
          <span style={{ color: "var(--fg-dim)" }}>$ </span>
          <span style={{
            display: "inline-block", width: 8, height: 16,
            background: "var(--accent)", verticalAlign: "middle",
            animation: "sv-blink 1s steps(2, end) infinite",
          }} />
        </div>
      </div>
      <style>{`@keyframes sv-blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// V6 — Pivot — hover a skill, light up which projects use it.
// Two columns; left is skill list, right is project chip grid.
// Interactive, but degrades gracefully without hover.
// ─────────────────────────────────────────────────────────────
function SkillsV6_Pivot() {
  const { t, lang } = useApp();
  const allItems = useMemoSv(() => {
    const flat = [];
    SKILLS_RICH.forEach(g => g.items.forEach(it => flat.push({ ...it, group: g.group[lang] })));
    return flat;
  }, [lang]);
  const [hover, setHover] = useSv(null);
  const projects = (window.PROJECTS || []).filter(p => !p.placeholder);
  const activeTag = hover;

  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SVHeader
        num="02" label={t("section_skills")}
        title={lang === "en"
          ? "Pick a tool, see where it earned its place."
          : "Wybierz narzędzie, zobacz gdzie zasłużyło na miejsce."}
        sub={lang === "en"
          ? "Hover any technology — projects that use it light up; others fade out."
          : "Najedź na technologię — projekty, w których jej użyłem, podświetlają się."}
      />

      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
        gap: 64, alignItems: "start",
      }}>
        {/* left: skill list */}
        <div onMouseLeave={() => setHover(null)}>
          {SKILLS_RICH.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 28 }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "var(--accent)",
                marginBottom: 12,
              }}>{g.group[lang]}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.items.map((it, j) => {
                  const isActive = activeTag === it.tag;
                  const isDim = activeTag && !isActive;
                  return (
                    <button
                      key={j}
                      onMouseEnter={() => setHover(it.tag)}
                      onFocus={() => setHover(it.tag)}
                      data-cursor="pointer"
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: "1px solid",
                        borderColor: isActive ? "var(--accent)" : "var(--border)",
                        background: isActive
                          ? "color-mix(in oklab, var(--accent) 18%, transparent)"
                          : "transparent",
                        color: isActive ? "var(--accent)" : isDim ? "var(--fg-dim)" : "var(--fg)",
                        fontFamily: "var(--body)", fontSize: 13,
                        cursor: "pointer", transition: "all 0.18s",
                        opacity: isDim ? 0.4 : 1,
                      }}
                    >
                      {it.name}
                      <span style={{
                        marginLeft: 8, fontFamily: "var(--mono)", fontSize: 10,
                        color: isActive ? "var(--accent)" : "var(--fg-dim)",
                        opacity: 0.7,
                      }}>{it.level}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* right: projects, with active highlight */}
        <div style={{
          position: "sticky", top: 80,
          padding: 24, border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--bg-elev)",
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--fg-dim)",
            marginBottom: 18, display: "flex", justifyContent: "space-between",
          }}>
            <span>{lang === "en" ? "Used in" : "Użyte w"}</span>
            <span style={{ color: "var(--accent)" }}>
              {activeTag
                ? `${projects.filter(p => p.tags.includes(activeTag)).length} / ${projects.length}`
                : `— / ${projects.length}`}
            </span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 2 }}>
            {projects.map(p => {
              const used = activeTag ? p.tags.includes(activeTag) : true;
              return (
                <li key={p.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 0",
                  borderTop: "1px solid var(--border)",
                  opacity: activeTag ? (used ? 1 : 0.25) : 1,
                  transition: "opacity 0.2s",
                }}>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: 999,
                      background: used && activeTag ? "var(--accent)" : "var(--border)",
                      transition: "background 0.2s",
                    }} />
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 13,
                      color: used && activeTag ? "var(--fg)" : "var(--fg-dim)",
                    }}>{p.name}</span>
                  </span>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 11,
                    color: "var(--fg-dim)",
                  }}>{p.year}</span>
                </li>
              );
            })}
          </ul>
          {!activeTag && (
            <div style={{
              marginTop: 18, fontSize: 12, color: "var(--fg-dim)",
              fontStyle: "italic",
            }}>
              {lang === "en" ? "← Hover any tag" : "← Najedź na dowolny tag"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  SkillsV0_Baseline,
  SkillsV1_Bars,
  SkillsV2_Heatmap,
  SkillsV3_Cloud,
  SkillsV4_Radar,
  SkillsV5_Terminal,
  SkillsV6_Pivot,
  SKILLS_RICH,
});
