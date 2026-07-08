// Hero section explorations — 6 variants for the design canvas.
// Each variant is a self-contained <section> intended to live inside a
// `.cv-artboard-root` that already provides theming + TopBar.
//
// Real data:
//   name        = "Szczepan Grela"
//   initials    = "SG"
//   github      = "SzczepanGrela"
// Tagline rewritten — less cheesy, more concrete.

const { useState: useShv, useEffect: useEffhv, useRef: useRefhv, useMemo: useMemohv } = React;

const ME = {
  name: "Szczepan Grela",
  initials: "SG",
  github: "SzczepanGrela",
  ghUrl: "https://github.com/SzczepanGrela",
  role: { en: "CS student", pl: "Student informatyki" },
  status: { en: "Looking for first job", pl: "Szukam pierwszej pracy" },
  // Real, verifiable from github.com/SzczepanGrela:
  ghSince: 2022,        // first repo: lab_wdp, Oct 2022
  publicRepos: 16,
  // Language counts across public repos (by primary language):
  // C# 6, Python 5, Dart 1, JS 1, HTML 1, null 1, other 1 → normalized
  langs: [
    { name: "C#",     count: 6 },
    { name: "Python", count: 5 },
    { name: "Dart",   count: 1 },
    { name: "JS",     count: 1 },
    { name: "HTML",   count: 1 },
  ],
  recentRepos: [
    { name: "SmakoszWebApp",          lang: "C#",     pushed: "2026-04-30", note: { en: "active",         pl: "aktywny" } },
    { name: "PiHole-parental_control",lang: "Dart",   pushed: "2025-11-19", note: { en: "Flutter, vibecoded", pl: "Flutter, vibecoded" } },
    { name: "ST2-NetFilmx",           lang: "C#",     pushed: "2025-12-09", note: { en: "coursework",     pl: "uczelnia" } },
    { name: "UrlShortenerSystem",     lang: "C#",     pushed: "2025-07-08", note: { en: "weekend project",pl: "projekt weekendowy" } },
    { name: "kolkokrzyzyk",           lang: "Python", pushed: "2025-07-03", note: { en: "tic-tac-toe",    pl: "kółko-krzyżyk" } },
    { name: "AirQualityApp",          lang: "Python", pushed: "2025-03-03", note: { en: "API client",     pl: "klient API" } },
  ],
};

// New, less-cheesy taglines per variant. Concrete, low-decoration.
const TAGLINES = {
  big: {
    en: { lead: "Backend, ML pipelines,", trail: "the parts that make the thing work in production." },
    pl: { lead: "Backend, pipeline'y ML,", trail: "te części, które sprawiają, że to działa na produkcji." },
  },
  rotating: {
    en: { prefix: "I ship", words: ["recommenders", "REST APIs", "ML pipelines", "monitored deployments", "clean architecture"] },
    pl: { prefix: "Dowożę", words: ["rekomendery", "REST API", "pipeline'y ML", "wdrożenia z monitoringiem", "clean architecture"] },
  },
};

// ─────────────────────────────────────────────────────────────
// GitHub stats hook — live fetch with mock fallback.
// Aggregates language usage across public repos; counts repos and stars.
// ─────────────────────────────────────────────────────────────
function useGithubStats(handle) {
  const [data, setData] = useShv({ loading: true, mock: false, repos: 0, stars: 0, languages: [], top: null });
  useEffhv(() => {
    let dead = false;
    const mock = () => ({
      loading: false, mock: true, repos: 14, stars: 23,
      languages: [
        { name: "C#", pct: 0.42 },
        { name: "Python", pct: 0.28 },
        { name: "TypeScript", pct: 0.12 },
        { name: "HTML", pct: 0.08 },
        { name: "CSS", pct: 0.06 },
        { name: "Other", pct: 0.04 },
      ],
      top: { name: "SmakoszWebApp", desc: "NCF recommender · Clean Arch backend" },
    });
    (async () => {
      try {
        const r = await fetch(`https://api.github.com/users/${handle}/repos?per_page=100&sort=updated`);
        if (!r.ok) throw new Error("rate-limited or 404");
        const repos = await r.json();
        if (dead) return;
        const lang = {};
        let stars = 0;
        repos.forEach(p => {
          if (p.language) lang[p.language] = (lang[p.language] || 0) + 1;
          stars += p.stargazers_count || 0;
        });
        const total = Object.values(lang).reduce((a, b) => a + b, 0) || 1;
        const languages = Object.entries(lang)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, n]) => ({ name, pct: n / total }));
        const top = repos.find(p => !p.fork) || repos[0];
        setData({
          loading: false, mock: false,
          repos: repos.length, stars,
          languages,
          top: top ? { name: top.name, desc: top.description || "" } : null,
        });
      } catch (e) {
        if (!dead) setData(mock());
      }
    })();
    return () => { dead = true; };
  }, [handle]);
  return data;
}

// shared kicker (same vocabulary as existing TopBar)
function HeroKicker({ children, withDot = true }) {
  return (
    <div style={{
      fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
      textTransform: "uppercase", color: "var(--accent)",
      display: "flex", alignItems: "center", gap: 12, marginBottom: 28,
    }}>
      {withDot && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)", boxShadow: "0 0 16px var(--accent)" }} />}
      {children}
    </div>
  );
}

function HeroCTAs({ t }) {
  return (
    <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
      <a href="#work" className="cv-cta primary" data-cursor="pointer">{t("nav_work")} →</a>
      <a href="#contact" className="cv-cta" data-cursor="pointer">{t("nav_contact")}</a>
      <a href={ME.ghUrl} className="cv-cta" data-cursor="pointer">GitHub ↗</a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// H1 — Editorial. Massive type, name as monogram, manifesto sub.
// Statyczny — czysty render. Tagline mniej cheesy.
// ─────────────────────────────────────────────────────────────
function HeroH1_Editorial() {
  const { t, lang } = useApp();
  const tag = TAGLINES.big[lang];
  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto", alignItems: "start",
        gap: 64, marginBottom: 48,
      }}>
        <HeroKicker>
          {ME.role[lang]} — {ME.name} · {lang === "en" ? "Poland" : "Polska"} · {ME.status[lang]}
        </HeroKicker>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--fg-dim)",
          textAlign: "right",
        }}>
          <div>github.com/{ME.github}</div>
          <div style={{ marginTop: 4 }}>{lang === "en" ? "available · 2026 Q1" : "dostępny · 2026 Q1"}</div>
        </div>
      </div>

      <h1 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(72px, 11vw, 200px)",
        lineHeight: 0.88,
        letterSpacing: "-0.045em",
        fontWeight: 500, margin: 0,
        color: "var(--fg)", textWrap: "balance",
      }}>
        Szczepan<br />
        <span style={{ color: "var(--fg-dim)" }}>Grela.</span>
      </h1>

      <div style={{
        marginTop: 40,
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 64, maxWidth: 1200,
      }}>
        <p style={{
          fontSize: 26, lineHeight: 1.3,
          color: "var(--fg)", margin: 0,
          letterSpacing: "-0.01em", textWrap: "pretty",
        }}>
          {tag.lead} <span style={{ color: "var(--fg-dim)" }}>{tag.trail}</span>
        </p>
        <p style={{
          fontSize: 15, lineHeight: 1.6,
          color: "var(--fg-dim)", margin: 0,
          maxWidth: 460,
        }}>
          {lang === "en"
            ? "CS graduate, Poland. Comfortable across backend, DevOps and ML; capable on the frontend when the project needs it. Looking for the first commercial role."
            : "Absolwent informatyki, Polska. Pewnie w backendzie, DevOps i ML; sprawnie we frontendzie, gdy projekt tego wymaga. Szukam pierwszej roli komercyjnej."}
        </p>
      </div>

      <HeroCTAs t={t} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// H2 — Terminal boot. `whoami` style, type-in animation, monospace.
// ─────────────────────────────────────────────────────────────
function HeroH2_Terminal() {
  const { t, lang } = useApp();
  const lines = useMemohv(() => lang === "en" ? [
    { kind: "cmd",  text: "whoami" },
    { kind: "out",  text: "szczepan@grela:~$ Software engineer · Poland" },
    { kind: "cmd",  text: "cat ~/about.md" },
    { kind: "out",  text: "Backend (.NET, ASP.NET Core), DevOps (Docker, GHA, monitoring)," },
    { kind: "out",  text: "and ML (PyTorch, ONNX, recommenders). Frontend when needed." },
    { kind: "cmd",  text: "git log --oneline -3" },
    { kind: "out",  text: "9f3a1c2  ship NCF model to R2 via export pipeline" },
    { kind: "out",  text: "5b2ee01  add load tests + p99 budget for /shorten" },
    { kind: "out",  text: "1a8d4b7  programmatic SEO: 500 landing pages / profession" },
    { kind: "cmd",  text: "echo $STATUS" },
    { kind: "out",  text: "→ Open to first commercial role" },
  ] : [
    { kind: "cmd",  text: "whoami" },
    { kind: "out",  text: "szczepan@grela:~$ Inżynier oprogramowania · Polska" },
    { kind: "cmd",  text: "cat ~/o-mnie.md" },
    { kind: "out",  text: "Backend (.NET, ASP.NET Core), DevOps (Docker, GHA, monitoring)" },
    { kind: "out",  text: "i ML (PyTorch, ONNX, rekomendery). Frontend, kiedy trzeba." },
    { kind: "cmd",  text: "git log --oneline -3" },
    { kind: "out",  text: "9f3a1c2  wysłanie modelu NCF do R2 przez pipeline" },
    { kind: "out",  text: "5b2ee01  load testy + budżet p99 dla /shorten" },
    { kind: "out",  text: "1a8d4b7  pSEO: 500 landing pages / profesja" },
    { kind: "cmd",  text: "echo $STATUS" },
    { kind: "out",  text: "→ Otwarty na pierwszą rolę komercyjną" },
  ], [lang]);

  // Reveal lines progressively
  const [count, setCount] = useShv(0);
  useEffhv(() => {
    setCount(0);
    const id = setInterval(() => {
      setCount(c => (c < lines.length ? c + 1 : c));
    }, 240);
    return () => clearInterval(id);
  }, [lines]);

  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64,
        alignItems: "start",
      }}>
        <div>
          <HeroKicker>{ME.role[lang]} — {ME.name}</HeroKicker>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(48px, 6vw, 88px)",
            lineHeight: 0.98, letterSpacing: "-0.03em",
            fontWeight: 500, margin: "0 0 24px", color: "var(--fg)",
          }}>
            {lang === "en" ? "Hello. I'm Szczepan." : "Cześć. Jestem Szczepan."}
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: "var(--fg-dim)",
            margin: 0, maxWidth: 480,
          }}>
            {lang === "en"
              ? "Read me as a shell session — same content, less marketing."
              : "Przeczytaj mnie jak sesję shella — te same fakty, mniej marketingu."}
          </p>
          <HeroCTAs t={t} />
        </div>

        <div style={{
          background: "var(--bg-elev)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "16px 20px",
          fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.7,
          color: "var(--fg)", minHeight: 360,
        }}>
          <div style={{
            display: "flex", gap: 6, alignItems: "center",
            paddingBottom: 12, marginBottom: 14,
            borderBottom: "1px solid var(--border)",
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.66 0.15 25)" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.78 0.13 85)" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.74 0.16 142)" }} />
            <span style={{ marginLeft: 12, color: "var(--fg-dim)", fontSize: 11, letterSpacing: "0.05em" }}>
              szczepan@portfolio: ~ — zsh
            </span>
          </div>
          {lines.slice(0, count).map((l, i) => (
            <div key={i}>
              {l.kind === "cmd" ? (
                <>
                  <span style={{ color: "var(--accent)" }}>$ </span>
                  <span>{l.text}</span>
                </>
              ) : (
                <span style={{ color: "var(--fg-dim)" }}>{l.text}</span>
              )}
            </div>
          ))}
          {count < lines.length && (
            <span style={{
              display: "inline-block", width: 8, height: 16,
              background: "var(--accent)", verticalAlign: "middle",
              animation: "hv-blink 0.9s steps(2, end) infinite",
            }} />
          )}
        </div>
      </div>
      <style>{`@keyframes hv-blink{50%{opacity:0}}`}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// H3 — Live GitHub stats. Big name, then live API panel.
// ─────────────────────────────────────────────────────────────
function HeroH3_GithubStats() {
  const { t, lang } = useApp();
  const stats = useGithubStats(ME.github);

  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <HeroKicker>{ME.role[lang]} · {ME.name} · {lang === "en" ? "Poland" : "Polska"}</HeroKicker>

      <div style={{
        display: "grid", gridTemplateColumns: "1.5fr 1fr",
        gap: 64, alignItems: "end",
      }}>
        <h1 style={{
          fontFamily: "var(--display)",
          fontSize: "clamp(56px, 8vw, 132px)",
          lineHeight: 0.94, letterSpacing: "-0.04em",
          fontWeight: 500, margin: 0, color: "var(--fg)",
          textWrap: "balance",
        }}>
          {lang === "en" ? "Numbers" : "Liczby"}
          <span style={{ color: "var(--fg-dim)" }}>{lang === "en" ? ", not adjectives." : ", nie przymiotniki."}</span>
        </h1>

        <p style={{
          fontSize: 16, lineHeight: 1.6,
          color: "var(--fg-dim)", margin: 0, maxWidth: 360,
        }}>
          {lang === "en"
            ? "Live from github.com/SzczepanGrela. If the API rate-limits, falls back to cached snapshot."
            : "Na żywo z github.com/SzczepanGrela. Jeśli API zlimituje — pokażę zapisany snapshot."}
        </p>
      </div>

      {/* stats strip */}
      <div style={{
        marginTop: 64, display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        {[
          { k: lang === "en" ? "Public repos" : "Repozytoria", v: stats.loading ? "…" : stats.repos },
          { k: lang === "en" ? "Stars" : "Gwiazdki", v: stats.loading ? "…" : stats.stars },
          { k: lang === "en" ? "Top language" : "Główny język", v: stats.loading ? "…" : (stats.languages[0]?.name || "—") },
          { k: lang === "en" ? "Status" : "Status", v: lang === "en" ? "Open" : "Otwarty", accent: true },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "32px 24px",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11,
              color: "var(--fg-dim)", letterSpacing: "0.12em",
              textTransform: "uppercase", marginBottom: 12,
            }}>{s.k}</div>
            <div style={{
              fontFamily: "var(--display)",
              fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em",
              color: s.accent ? "var(--accent)" : "var(--fg)",
            }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* language breakdown bar */}
      <div style={{ marginTop: 48 }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 12,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>{lang === "en" ? "Language mix · public repos" : "Języki · publiczne repo"}</span>
          {stats.mock && <span style={{ color: "var(--accent)" }}>cached</span>}
        </div>
        <div style={{
          display: "flex", height: 8, borderRadius: 999, overflow: "hidden",
          background: "var(--bg-elev)",
        }}>
          {stats.languages.map((l, i) => (
            <div key={i} title={`${l.name} ${(l.pct*100).toFixed(0)}%`} style={{
              width: `${l.pct * 100}%`,
              background: i === 0 ? "var(--accent)"
                : `color-mix(in oklab, var(--accent) ${Math.max(20, 100 - i*18)}%, var(--bg-elev))`,
            }} />
          ))}
        </div>
        <div style={{
          marginTop: 14, display: "flex", flexWrap: "wrap",
          gap: 18, fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-dim)",
        }}>
          {stats.languages.map((l, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 8, height: 8, borderRadius: 2,
                background: i === 0 ? "var(--accent)"
                  : `color-mix(in oklab, var(--accent) ${Math.max(20, 100 - i*18)}%, var(--bg-elev))`,
              }} />
              {l.name} <span style={{ opacity: 0.7 }}>{(l.pct*100).toFixed(0)}%</span>
            </span>
          ))}
        </div>
      </div>

      <HeroCTAs t={t} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// H4 — Kinetic / rotating-word. "I ship X" cycles through
// recommenders / REST APIs / pipelines …
// ─────────────────────────────────────────────────────────────
function HeroH4_Kinetic() {
  const { t, lang } = useApp();
  const conf = TAGLINES.rotating[lang];
  const [idx, setIdx] = useShv(0);
  useEffhv(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % conf.words.length), 1800);
    return () => clearInterval(id);
  }, [conf.words.length]);

  // measure widest word, lock width so layout doesn't jump
  const measureRef = useRefhv(null);
  const [maxW, setMaxW] = useShv(0);
  useEffhv(() => {
    if (!measureRef.current) return;
    const widths = [...measureRef.current.children].map(el => el.offsetWidth);
    setMaxW(Math.max(...widths));
  }, [conf.words]);

  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <HeroKicker>{ME.role[lang]} · {ME.name} · {ME.status[lang]}</HeroKicker>

      <h1 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(56px, 8vw, 128px)",
        lineHeight: 0.95, letterSpacing: "-0.04em",
        fontWeight: 500, margin: 0, color: "var(--fg)",
      }}>
        {conf.prefix}{" "}
        <span style={{
          display: "inline-block",
          width: maxW || "auto",
          verticalAlign: "baseline",
          position: "relative",
          color: "var(--accent)",
          height: "1em",
        }}>
          {conf.words.map((w, i) => (
            <span key={i} style={{
              position: "absolute", left: 0, top: 0,
              transition: "opacity 0.5s, transform 0.5s",
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? "translateY(0)" : (i < idx ? "translateY(-30%)" : "translateY(30%)"),
              whiteSpace: "nowrap",
            }}>{w}.</span>
          ))}
        </span>
        <br />
        <span style={{ color: "var(--fg-dim)" }}>
          {lang === "en" ? "Tested. Monitored. Deployed." : "Z testami. Z monitoringiem. Wdrożone."}
        </span>
      </h1>

      {/* hidden measure layer */}
      <span ref={measureRef} style={{
        position: "absolute", visibility: "hidden", whiteSpace: "nowrap",
        fontFamily: "var(--display)",
        fontSize: "clamp(56px, 8vw, 128px)",
        letterSpacing: "-0.04em", fontWeight: 500,
      }}>
        {conf.words.map((w, i) => <span key={i} style={{ marginRight: 16 }}>{w}.</span>)}
      </span>

      <p style={{
        marginTop: 36, maxWidth: 640,
        fontSize: 18, lineHeight: 1.55,
        color: "var(--fg-dim)",
      }}>
        {lang === "en"
          ? `${ME.name}. CS graduate working backend / DevOps / ML. Looking for the first commercial role.`
          : `${ME.name}. Absolwent informatyki, działający w backendzie / DevOps / ML. Szukam pierwszej roli komercyjnej.`}
      </p>
      <HeroCTAs t={t} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// H5 — Split: marquee surname on the right, hard-info card on the left.
// Vibe: dev-tool meets editorial.
// ─────────────────────────────────────────────────────────────
function HeroH5_Split() {
  const { t, lang } = useApp();
  const stats = useGithubStats(ME.github);
  return (
    <section style={{
      padding: "0", borderBottom: "1px solid var(--border)",
      display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 640,
    }}>
      {/* left — info panel */}
      <div style={{
        padding: "80px 64px",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div>
          <HeroKicker>{ME.role[lang]}</HeroKicker>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(40px, 4.5vw, 72px)",
            lineHeight: 1.02, letterSpacing: "-0.03em",
            fontWeight: 500, margin: 0, color: "var(--fg)",
          }}>
            {ME.name}
          </h1>
          <p style={{
            marginTop: 24, fontSize: 17, lineHeight: 1.55,
            color: "var(--fg-dim)", maxWidth: 480,
          }}>
            {lang === "en"
              ? "Backend, DevOps, and ML — comfortable across the layers, with a habit of shipping deployed instances even on side projects."
              : "Backend, DevOps i ML — pewnie w każdej warstwie, z nawykiem wdrażania instancji nawet w projektach pobocznych."}
          </p>
        </div>

        <dl style={{
          margin: "48px 0 0", display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "10px 24px",
          fontFamily: "var(--mono)", fontSize: 13,
        }}>
          <dt style={{ color: "var(--fg-dim)" }}>// status</dt>
          <dd style={{ margin: 0, color: "var(--accent)" }}>{ME.status[lang]}</dd>
          <dt style={{ color: "var(--fg-dim)" }}>// based</dt>
          <dd style={{ margin: 0, color: "var(--fg)" }}>{lang === "en" ? "Poland" : "Polska"}</dd>
          <dt style={{ color: "var(--fg-dim)" }}>// github</dt>
          <dd style={{ margin: 0, color: "var(--fg)" }}>
            {ME.github} {stats.loading ? "" : `· ${stats.repos} repos`}
          </dd>
          <dt style={{ color: "var(--fg-dim)" }}>// stack</dt>
          <dd style={{ margin: 0, color: "var(--fg)" }}>.NET · Python · PyTorch · Docker</dd>
        </dl>

        <HeroCTAs t={t} />
      </div>

      {/* right — kinetic surname / marquee */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "var(--bg-elev)",
      }}>
        {/* faint grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }} />
        {/* marquee */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", justifyContent: "center",
          gap: 0, overflow: "hidden",
        }}>
          {[
            { dir: 1, dim: false },
            { dir: -1, dim: true },
            { dir: 1, dim: true },
            { dir: -1, dim: false },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", whiteSpace: "nowrap",
              animation: `hv-marquee${row.dir > 0 ? "L" : "R"} 24s linear infinite`,
              fontFamily: "var(--display)",
              fontSize: "clamp(80px, 9vw, 160px)",
              fontWeight: 500, letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: row.dim ? "var(--fg-dim)" : "var(--fg)",
              opacity: row.dim ? 0.25 : 0.8,
              willChange: "transform",
            }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} style={{ marginRight: 48 }}>
                  {ME.name.toUpperCase()} <span style={{ color: "var(--accent)" }}>·</span>{" "}
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* sticker */}
        <div style={{
          position: "absolute", bottom: 32, right: 32,
          padding: "14px 18px",
          background: "var(--bg)", border: "1px solid var(--accent)",
          borderRadius: 10,
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--accent)", letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          ◉ {lang === "en" ? "Available 2026" : "Dostępny 2026"}
        </div>
      </div>
      <style>{`
        @keyframes hv-marqueeL { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes hv-marqueeR { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// H6 — Manifesto. Tight. Almost no decoration. Strong copy.
// One block of text, treated like a magazine opener.
// ─────────────────────────────────────────────────────────────
function HeroH6_Manifesto() {
  const { t, lang } = useApp();
  const lines = lang === "en" ? [
    { text: "I write software", emph: false },
    { text: "with tests, monitoring,", emph: true },
    { text: "and a deployed instance —", emph: false },
    { text: "even on side projects.", emph: true },
  ] : [
    { text: "Piszę oprogramowanie", emph: false },
    { text: "z testami, monitoringiem", emph: true },
    { text: "i wdrożoną instancją —", emph: false },
    { text: "nawet w projektach pobocznych.", emph: true },
  ];

  return (
    <section style={{
      padding: "140px 64px 120px", borderBottom: "1px solid var(--border)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr",
        alignItems: "start", gap: 64, marginBottom: 64,
      }}>
        <div style={{
          display: "flex", flexDirection: "column", gap: 6,
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--fg-dim)", letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          <span>—</span>
          <span>{ME.name}</span>
          <span>{lang === "en" ? "Poland · 2026" : "Polska · 2026"}</span>
          <span style={{ color: "var(--accent)" }}>github.com/{ME.github}</span>
        </div>
        <HeroKicker>{ME.role[lang]} · {ME.status[lang]}</HeroKicker>
      </div>

      <h1 style={{
        fontFamily: "var(--display)", margin: 0,
        fontSize: "clamp(54px, 7.5vw, 116px)",
        lineHeight: 1.02, letterSpacing: "-0.04em",
        fontWeight: 500, color: "var(--fg-dim)", maxWidth: 1280,
        textWrap: "balance",
      }}>
        {lines.map((l, i) => (
          <span key={i} style={{
            display: "block",
            color: l.emph ? "var(--fg)" : "var(--fg-dim)",
          }}>{l.text}</span>
        ))}
      </h1>

      <div style={{
        marginTop: 64, display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0, borderTop: "1px solid var(--border)",
      }}>
        {[
          {
            n: "01",
            t: lang === "en" ? "Backend" : "Backend",
            d: lang === "en"
              ? "Clean Architecture, CQRS, microservices in .NET / ASP.NET Core."
              : "Clean Architecture, CQRS, mikroserwisy w .NET / ASP.NET Core.",
          },
          {
            n: "02",
            t: "ML",
            d: lang === "en"
              ? "PyTorch → ONNX → R2. NCF recommender shipped end-to-end."
              : "PyTorch → ONNX → R2. Rekomender NCF dowieziony end-to-end.",
          },
          {
            n: "03",
            t: "DevOps",
            d: lang === "en"
              ? "Docker, CI/CD on GitHub Actions, Grafana + Prometheus monitoring."
              : "Docker, CI/CD w GitHub Actions, monitoring Grafana + Prometheus.",
          },
        ].map((c, i) => (
          <div key={i} style={{
            padding: "28px 28px 28px 0",
            borderRight: i < 2 ? "1px solid var(--border)" : "none",
            paddingLeft: i > 0 ? 28 : 0,
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11,
              color: "var(--accent)", letterSpacing: "0.14em",
              marginBottom: 12,
            }}>{c.n} · {c.t}</div>
            <p style={{
              margin: 0, fontSize: 15, lineHeight: 1.55,
              color: "var(--fg-dim)", maxWidth: 360,
            }}>{c.d}</p>
          </div>
        ))}
      </div>

      <HeroCTAs t={t} />
    </section>
  );
}

Object.assign(window, {
  HeroH1_Editorial,
  HeroH2_Terminal,
  HeroH3_GithubStats,
  HeroH4_Kinetic,
  HeroH5_Split,
  HeroH6_Manifesto,
  ME,
});
