// Thumbnail strategies for project tiles. Each accepts {project} and renders
// a 16:9-ish thumbnail. They share the same height contract so tiles align.

const { useMemo: useTm } = React;

// --------- per-project metadata used by some thumb strategies ---------
const PROJECT_META = {
  smakosz: {
    arch: [
      { row: 0, label: "Blazor SPA", w: 100 },
      { row: 1, label: "ASP.NET API · CQRS", w: 100 },
      { row: 2, label: "Postgres", w: 48 },
      { row: 2, label: "Hangfire", w: 48, offset: 52 },
      { row: 3, label: "GPU worker · PyTorch", w: 100 },
      { row: 4, label: "ONNX → R2", w: 100 },
    ],
    code: [
      "service: smakosz",
      "stack:  C# · .NET · Blazor",
      "ml:     PyTorch → ONNX",
      "infra:  Docker · R2 · Hangfire",
      "tests:  ✓ unit",
    ],
    stats: [
      { k: "Services", v: "4" },
      { k: "Stack",    v: "5" },
      { k: "Tests",    v: "✓"  },
      { k: "Live",     v: "↗"  },
    ],
  },
  urlshortener: {
    arch: [
      { row: 0, label: "Client", w: 100 },
      { row: 1, label: "Shortener API", w: 48 },
      { row: 1, label: "Analytics API", w: 48, offset: 52 },
      { row: 2, label: "Postgres · Cache", w: 100 },
    ],
    code: [
      "service: url-shortener",
      "stack:  C# · .NET · EF Core",
      "infra:  microservices",
      "tests:  ✓ integration",
      "tests:  ✓ load",
    ],
    stats: [
      { k: "Services", v: "2" },
      { k: "Stack",    v: "3" },
      { k: "Tests",    v: "i+l" },
      { k: "RPS",      v: "2k" },
    ],
  },
  "narzedzia-ai": {
    arch: [
      { row: 0, label: "Profession seeds", w: 100 },
      { row: 1, label: "Vertex AI · Gemini", w: 100 },
      { row: 2, label: "500 landing pages", w: 100 },
    ],
    code: [
      "service: pseo-pipeline",
      "stack:  Python · GCP",
      "model:  Vertex AI",
      "out:    500 pages",
      "infra:  automation",
    ],
    stats: [
      { k: "Pages",    v: "500" },
      { k: "Model",    v: "GCP" },
      { k: "Auto",     v: "✓"   },
      { k: "Live",     v: "↗"   },
    ],
  },
  audiomaster: {
    arch: [
      { row: 0, label: "Audio file IO", w: 100 },
      { row: 1, label: "Pipeline · ffmpeg", w: 100 },
      { row: 2, label: "PyQt UI", w: 100 },
    ],
    code: [
      "service: audiomaster",
      "stack:  Python · PyQt",
      "tool:   ffmpeg",
      "arch:   pipeline",
      "ui:     desktop",
    ],
    stats: [
      { k: "Steps",    v: "8" },
      { k: "Stack",    v: "3" },
      { k: "GUI",      v: "Qt" },
      { k: "Threads",  v: "n"  },
    ],
  },
  "placeholder-1": {
    arch: [{row:0,label:"node-a",w:48},{row:0,label:"node-b",w:48,offset:52},{row:1,label:"declarative provisioning",w:100}],
    code: [ "service: homelab-iac", "stack:  Docker · GHA", "infra:  2 nodes", "auto:   ✓", "tests:  —" ],
    stats: [ {k:"Nodes",v:"2"}, {k:"Auto",v:"✓"}, {k:"CI",v:"GHA"}, {k:"Live",v:"24/7"} ],
  },
  "placeholder-2": {
    arch: [{row:0,label:"REST API",w:100},{row:1,label:"Generalized Inverted Index",w:100},{row:2,label:"PostgreSQL",w:100}],
    code: [ "service: gin-search", "stack:  C# · Postgres", "index:  GIN", "tests:  bench", "" ],
    stats: [ {k:"Index",v:"GIN"}, {k:"Db",v:"PG"}, {k:"Bench",v:"✓"}, {k:"Stack",v:"3"} ],
  },
  "placeholder-3": {
    arch: [{row:0,label:"TS client",w:100},{row:1,label:"JWT · refresh rotation",w:100},{row:2,label:"ASP.NET Core",w:100}],
    code: [ "service: auth-playground", "stack:  C# · TS", "auth:   JWT + refresh", "limit:  rate-limit", "tests:  ✓ unit" ],
    stats: [ {k:"Auth",v:"JWT"}, {k:"Rotate",v:"✓"}, {k:"Limit",v:"✓"}, {k:"Tests",v:"u"} ],
  },
};

// =============== A. STRIPES (current — baseline) ===============
function ThumbStripes({ project, height = 140 }) {
  return (
    <div style={{
      height, borderRadius: 8,
      background: "repeating-linear-gradient(135deg, var(--placeholder-a) 0 12px, var(--placeholder-b) 12px 24px)",
      display: "grid", placeItems: "center",
      fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)",
      letterSpacing: "0.12em", textTransform: "uppercase",
    }}>
      {project.name}
    </div>
  );
}

// =============== B. ARCHITECTURE DIAGRAM ===============
function ThumbArchitecture({ project, height = 140 }) {
  const meta = PROJECT_META[project.id]?.arch || [
    { row: 0, label: project.name, w: 100 },
  ];
  const rows = useTm(() => {
    const map = {};
    meta.forEach(b => { (map[b.row] = map[b.row] || []).push(b); });
    return Object.keys(map).sort((a,b)=>+a-+b).map(k => map[k]);
  }, [meta]);

  return (
    <div style={{
      height, borderRadius: 8,
      padding: 14,
      background: "var(--bg)",
      border: "1px solid var(--border)",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      gap: 8, position: "relative", overflow: "hidden",
    }}>
      {/* faint grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        opacity: 0.25, pointerEvents: "none",
      }} />
      {rows.map((row, ri) => (
        <div key={ri} style={{ position: "relative", display: "flex", gap: 4, height: `calc(${100/rows.length}% - 4px)` }}>
          {row.map((b, bi) => (
            <div key={bi} style={{
              position: "absolute",
              left: `${b.offset || 0}%`, width: `${b.w}%`,
              height: "100%",
              border: "1px solid var(--accent)",
              background: "color-mix(in oklab, var(--accent) 10%, var(--bg-elev))",
              borderRadius: 4,
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg)",
              display: "grid", placeItems: "center",
              padding: "0 6px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{b.label}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

// =============== C. TAG CLOUD ===============
function ThumbTagCloud({ project, height = 140 }) {
  // Pick top 6 tags for this project; size them descending.
  const tags = project.tags.slice(0, 6).map((id, i) => ({
    id, label: window.TAGS[id]?.label || id,
    size: [22, 18, 16, 14, 12, 11][i] || 10,
    weight: i === 0 ? 600 : 500,
  }));
  return (
    <div style={{
      height, borderRadius: 8,
      padding: 14,
      background: "var(--bg-elev)",
      border: "1px solid var(--border)",
      display: "flex", flexWrap: "wrap", alignItems: "center",
      gap: "4px 10px",
      lineHeight: 1.05,
      fontFamily: "var(--display)",
      letterSpacing: "-0.015em",
      overflow: "hidden",
    }}>
      {tags.map((t, i) => (
        <span key={t.id} style={{
          fontSize: t.size, fontWeight: t.weight,
          color: i === 0 ? "var(--accent)" : (i < 3 ? "var(--fg)" : "var(--fg-dim)"),
        }}>{t.label}</span>
      ))}
    </div>
  );
}

// =============== D. CODE SNIPPET ===============
function ThumbCode({ project, height = 140 }) {
  const lines = PROJECT_META[project.id]?.code || [
    `service: ${project.name}`,
    `tags:    ${project.tags.length}`,
  ];
  return (
    <div style={{
      height, borderRadius: 8,
      padding: 14,
      background: "var(--bg)",
      border: "1px solid var(--border)",
      fontFamily: "var(--mono)",
      fontSize: 11, lineHeight: 1.55,
      color: "var(--fg-dim)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 8, right: 12,
        fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "var(--fg-dim)",
      }}>
        {project.id}.yaml
      </div>
      {lines.map((line, i) => {
        const m = line.match(/^([^:]+):(.*)$/);
        return (
          <div key={i}>
            {m ? (
              <>
                <span style={{ color: "var(--accent)" }}>{m[1]}</span>
                <span style={{ color: "var(--fg-dim)" }}>:</span>
                <span style={{ color: "var(--fg)" }}>{m[2]}</span>
              </>
            ) : line}
          </div>
        );
      })}
    </div>
  );
}

// =============== E. ASCII / BOX-DRAWING ===============
function ThumbAscii({ project, height = 140 }) {
  // Build a simple labelled box-drawing diagram from arch metadata
  const arch = PROJECT_META[project.id]?.arch || [{row:0,label:project.name,w:100}];
  const lines = useTm(() => {
    const out = [];
    const W = 38;
    const groupedByRow = {};
    arch.forEach(b => { (groupedByRow[b.row] = groupedByRow[b.row] || []).push(b); });
    const rows = Object.keys(groupedByRow).sort((a,b)=>+a-+b);

    rows.forEach((rk, ri) => {
      const items = groupedByRow[rk];
      // for simplicity if 1 item span full; if 2 split
      if (items.length === 1) {
        const inner = " " + items[0].label.slice(0, W - 4) + " ";
        const pad = Math.max(0, W - 2 - inner.length);
        out.push("┌" + "─".repeat(W - 2) + "┐");
        out.push("│" + inner + " ".repeat(pad) + "│");
        out.push("└" + "─".repeat(W - 2) + "┘");
      } else {
        const half = Math.floor((W - 1) / 2);
        const a = items[0].label.slice(0, half - 4);
        const b = (items[1]?.label || "").slice(0, W - half - 4);
        out.push("┌" + "─".repeat(half - 1) + "┐┌" + "─".repeat(W - half - 2) + "┐");
        out.push("│ " + a.padEnd(half - 3) + "││ " + b.padEnd(W - half - 4) + "│");
        out.push("└" + "─".repeat(half - 1) + "┘└" + "─".repeat(W - half - 2) + "┘");
      }
      if (ri < rows.length - 1) {
        out.push("       │");
        out.push("       ▼");
      }
    });
    return out;
  }, [arch]);

  return (
    <div style={{
      height, borderRadius: 8,
      padding: 12,
      background: "var(--bg)",
      border: "1px solid var(--border)",
      fontFamily: "var(--mono)",
      fontSize: 9, lineHeight: 1.25,
      color: "var(--fg)",
      overflow: "hidden",
      whiteSpace: "pre",
    }}>
      {lines.slice(0, Math.floor((height - 24) / (9 * 1.25))).join("\n")}
    </div>
  );
}

// =============== F. GENERATIVE GRADIENT POSTER ===============
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h<<5)-h+s.charCodeAt(i))|0; return Math.abs(h); }
function ThumbGradient({ project, height = 140 }) {
  const seed = hashStr(project.id);
  const h1 = (seed % 360);
  const h2 = ((seed * 7) % 360);
  const angle = (seed % 4) * 45;
  return (
    <div style={{
      height, borderRadius: 8, position: "relative", overflow: "hidden",
      background: `linear-gradient(${angle}deg,
        oklch(0.55 0.13 ${h1}) 0%,
        oklch(0.40 0.12 ${(h1+h2)/2}) 55%,
        oklch(0.30 0.10 ${h2}) 100%)`,
      border: "1px solid var(--border)",
    }}>
      {/* grain / noise via repeating dots */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0, transparent 40%)," +
          "radial-gradient(circle at 80% 70%, rgba(0,0,0,0.25) 0, transparent 50%)",
      }} />
      {/* big initial */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "flex-end", justifyContent: "flex-start",
        padding: 14,
        fontFamily: "var(--display)",
        fontSize: 56, fontWeight: 600,
        color: "rgba(255,255,255,0.92)",
        letterSpacing: "-0.04em",
        lineHeight: 0.9,
        mixBlendMode: "overlay",
      }}>
        {project.name.replace(/[^A-Z]/g, "").slice(0, 2) || project.name.slice(0, 2).toUpperCase()}
      </div>
      <div style={{
        position: "absolute", top: 12, right: 12,
        fontFamily: "var(--mono)", fontSize: 10,
        color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em",
      }}>
        {project.year}
      </div>
    </div>
  );
}

// =============== Wiring ===============
const THUMB_VARIANTS = {
  stripes:      { Comp: ThumbStripes,      label: "Stripes (current)" },
  architecture: { Comp: ThumbArchitecture, label: "Architecture" },
  tagcloud:     { Comp: ThumbTagCloud,     label: "Tag cloud" },
  code:         { Comp: ThumbCode,         label: "Code snippet" },
  ascii:        { Comp: ThumbAscii,        label: "ASCII diagram" },
  gradient:     { Comp: ThumbGradient,     label: "Gradient poster" },
};

Object.assign(window, {
  ThumbStripes, ThumbArchitecture, ThumbTagCloud, ThumbCode, ThumbAscii, ThumbGradient,
  THUMB_VARIANTS, PROJECT_META,
});
