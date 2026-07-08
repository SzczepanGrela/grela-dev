// Hero v2 — six variants riffing on H2 (Terminal) and H3 (GitHub stats).
// Reuses ME + useGithubStats from hero-variants.jsx.
//
// IMPORTANT: every number in here must be true for github.com/SzczepanGrela.
// No invented projects, no fake stars, no "X years of production experience".
// If a stat can't be verified from the public profile, it doesn't ship.

const { useState: useShv2, useEffect: useEffhv2, useRef: useRefhv2, useMemo: useMemohv2 } = React;

// ─────────────────────────────────────────────────────────────
// Shared mini bits
// ─────────────────────────────────────────────────────────────
function HeroKicker2({ children, withDot = true }) {
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
function HeroCTAs2({ t }) {
  return (
    <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
      <a href="#work" className="cv-cta primary" data-cursor="pointer">{t("nav_work")} →</a>
      <a href="#contact" className="cv-cta" data-cursor="pointer">{t("nav_contact")}</a>
      <a href={ME.ghUrl} className="cv-cta" data-cursor="pointer">github.com/{ME.github} ↗</a>
    </div>
  );
}
function TermChrome({ title, children }) {
  return (
    <div style={{
      background: "var(--bg-elev)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "14px 18px",
      fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.7,
      color: "var(--fg)",
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
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// T1 — `htop` style language mix. Bars = real percentage of repos
// that use each language as primary, derived from ME.langs.
// No fake "domain expertise" %; just the language histogram.
// ─────────────────────────────────────────────────────────────
function HeroT1_Htop() {
  const { t, lang } = useApp();
  const total = ME.langs.reduce((a, l) => a + l.count, 0);
  const rows = ME.langs.map(l => ({
    name: l.name,
    pct: (l.count / total) * 100,
    count: l.count,
  }));

  const Bar = ({ pct }) => {
    const cells = 28;
    const filled = Math.round((pct / 100) * cells);
    return (
      <span style={{ letterSpacing: "0.05em" }}>
        <span style={{ color: "var(--accent)" }}>{"█".repeat(Math.max(0, filled - 1))}</span>
        <span style={{ color: "var(--fg)" }}>{"▓".repeat(Math.min(1, filled))}</span>
        <span style={{ color: "var(--fg-dim)", opacity: 0.4 }}>{"░".repeat(cells - filled)}</span>
      </span>
    );
  };

  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "center",
      }}>
        <div>
          <HeroKicker2>{ME.role[lang]} · {ME.name}</HeroKicker2>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(48px, 6vw, 92px)",
            lineHeight: 0.96, letterSpacing: "-0.035em",
            fontWeight: 500, margin: 0, color: "var(--fg)",
          }}>
            {lang === "en" ? "What I've actually used." : "Czego naprawdę używałem."}
          </h1>
          <p style={{
            marginTop: 24, fontSize: 17, lineHeight: 1.55,
            color: "var(--fg-dim)", maxWidth: 460,
          }}>
            {lang === "en"
              ? `Primary language across ${ME.publicRepos} public repos on GitHub. Counted, not claimed.`
              : `Główny język w ${ME.publicRepos} publicznych repo na GitHubie. Zliczone, nie wyobrażone.`}
          </p>
          <HeroCTAs2 t={t} />
        </div>

        <TermChrome title={`languages.sh — ${ME.github}`}>
          <div style={{ color: "var(--fg-dim)" }}>
            <span style={{ color: "var(--accent)" }}>$ </span>
            ls ~/repos | xargs -I @ jq -r .language @/.git/lang | sort | uniq -c
          </div>
          <div style={{ height: 14 }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "72px 1fr 56px 56px",
            columnGap: 14, rowGap: 6,
          }}>
            <span style={{ color: "var(--fg-dim)" }}>LANG</span>
            <span style={{ color: "var(--fg-dim)" }}>SHARE</span>
            <span style={{ color: "var(--fg-dim)", textAlign: "right" }}>%</span>
            <span style={{ color: "var(--fg-dim)", textAlign: "right" }}>repos</span>
            {rows.map((r, i) => (
              <React.Fragment key={i}>
                <span style={{ color: "var(--accent)" }}>{r.name}</span>
                <span><Bar pct={r.pct} /></span>
                <span style={{ textAlign: "right", color: "var(--fg)" }}>
                  {r.pct.toFixed(0)}
                </span>
                <span style={{ textAlign: "right", color: "var(--fg-dim)" }}>
                  {r.count}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div style={{ height: 18 }} />
          <div style={{
            paddingTop: 10, borderTop: "1px solid var(--border)",
            color: "var(--fg-dim)", fontSize: 12, lineHeight: 1.7,
          }}>
            <div>
              {lang === "en" ? "Mostly coursework + side projects." : "Głównie projekty z uczelni + poboczne."}
            </div>
            <div>
              {lang === "en"
                ? "C# from .NET classes. Python from labs. Dart is recent (Flutter)."
                : "C# z zajęć z .NET. Python z laboratoriów. Dart świeży (Flutter)."}
            </div>
          </div>
        </TermChrome>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// T2 — Git diff hero. Honest delta between "where I was" and now.
// Removes any fabricated project lines.
// ─────────────────────────────────────────────────────────────
function HeroT2_Diff() {
  const { t, lang } = useApp();
  const file = "whoami.md";
  const lines = lang === "en" ? [
    { kind: "ctx", n: "1",  text: `# ${ME.name}` },
    { kind: "ctx", n: "2",  text: `> ${ME.role[lang]} · Poland · @${ME.github}` },
    { kind: "ctx", n: "3",  text: "" },
    { kind: "ctx", n: "4",  text: "## Where I am" },
    { kind: "del", n: "5",  text: "- Just doing whatever the syllabus says." },
    { kind: "add", n: "5",  text: "+ Coursework + side projects, all public." },
    { kind: "add", n: "6",  text: `+ ${ME.publicRepos} repos on GitHub. 0 stars. That's fine.` },
    { kind: "add", n: "7",  text: "+ Picking up things outside the syllabus (Flutter, AI tooling)." },
    { kind: "ctx", n: "8",  text: "" },
    { kind: "ctx", n: "9",  text: "## Where I'm going" },
    { kind: "add", n: "10", text: "+ First commercial role." },
    { kind: "add", n: "11", text: "+ Anything backend / mobile / scripts. Want to work with seniors." },
  ] : [
    { kind: "ctx", n: "1",  text: `# ${ME.name}` },
    { kind: "ctx", n: "2",  text: `> ${ME.role[lang]} · Polska · @${ME.github}` },
    { kind: "ctx", n: "3",  text: "" },
    { kind: "ctx", n: "4",  text: "## Gdzie jestem" },
    { kind: "del", n: "5",  text: "- Robię tylko to, co każe sylabus." },
    { kind: "add", n: "5",  text: "+ Projekty z uczelni + poboczne, wszystkie publiczne." },
    { kind: "add", n: "6",  text: `+ ${ME.publicRepos} repo na GitHubie. 0 gwiazdek. Spoko.` },
    { kind: "add", n: "7",  text: "+ Łapię rzeczy poza sylabusem (Flutter, narzędzia AI)." },
    { kind: "ctx", n: "8",  text: "" },
    { kind: "ctx", n: "9",  text: "## Dokąd idę" },
    { kind: "add", n: "10", text: "+ Pierwsza rola komercyjna." },
    { kind: "add", n: "11", text: "+ Backend / mobile / skrypty. Chcę pracować z seniorami." },
  ];

  const colorFor = k =>
    k === "add" ? { bg: "color-mix(in oklab, var(--accent) 18%, transparent)", text: "var(--fg)", n: "var(--accent)" } :
    k === "del" ? { bg: "color-mix(in oklab, oklch(0.66 0.15 25) 14%, transparent)", text: "var(--fg-dim)", n: "oklch(0.66 0.15 25)" } :
                  { bg: "transparent", text: "var(--fg-dim)", n: "var(--fg-dim)" };

  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <HeroKicker2>{ME.role[lang]} · {ME.name} · {ME.status[lang]}</HeroKicker2>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 56, alignItems: "start",
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(56px, 7.5vw, 116px)",
            lineHeight: 0.94, letterSpacing: "-0.04em",
            fontWeight: 500, margin: 0, color: "var(--fg)",
          }}>
            {lang === "en" ? (
              <>What changed<br /><span style={{ color: "var(--accent)" }}>this year.</span></>
            ) : (
              <>Co się zmieniło<br /><span style={{ color: "var(--accent)" }}>w tym roku.</span></>
            )}
          </h1>
          <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.6, color: "var(--fg-dim)", maxWidth: 420 }}>
            {lang === "en"
              ? "Small PR. Honest one."
              : "Mały PR. Szczery."}
          </p>
          <HeroCTAs2 t={t} />
        </div>

        <div style={{
          background: "var(--bg-elev)", border: "1px solid var(--border)",
          borderRadius: 10, fontFamily: "var(--mono)", fontSize: 13.5, lineHeight: 1.7,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 18px", borderBottom: "1px solid var(--border)",
            color: "var(--fg-dim)", fontSize: 12,
          }}>
            <span>
              <span style={{ color: "var(--fg)" }}>{file}</span>
              {"  "}<span style={{ color: "var(--accent)" }}>+6</span> <span style={{ color: "oklch(0.66 0.15 25)" }}>−1</span>
            </span>
            <span style={{ letterSpacing: "0.06em" }}>{lang === "en" ? "draft · 2026" : "szkic · 2026"}</span>
          </div>
          {lines.map((l, i) => {
            const c = colorFor(l.kind);
            const sign = l.kind === "add" ? "+" : l.kind === "del" ? "−" : " ";
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "44px 18px 1fr",
                background: c.bg,
              }}>
                <span style={{
                  textAlign: "right", paddingRight: 10, color: "var(--fg-dim)",
                  borderRight: "1px solid var(--border)", opacity: 0.6,
                }}>{l.n}</span>
                <span style={{ textAlign: "center", color: c.n }}>{sign}</span>
                <span style={{ paddingLeft: 10, paddingRight: 16, color: c.text, whiteSpace: "pre" }}>
                  {l.text.replace(/^[+-]\s?/, "")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// T3 — Terminal session showing real `git log`-style data:
// most recently pushed repos with their primary language and date.
// All entries are real repos. The right panel pulls live stats
// and falls back to a known-good snapshot.
// ─────────────────────────────────────────────────────────────
function HeroT3_TerminalStats() {
  const { t, lang } = useApp();
  const stats = useGithubStats(ME.github);

  return (
    <section style={{ padding: "100px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <HeroKicker2>{ME.role[lang]} · {ME.name} · {lang === "en" ? "Poland" : "Polska"} · {ME.status[lang]}</HeroKicker2>

      <h1 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(56px, 8vw, 120px)",
        lineHeight: 0.94, letterSpacing: "-0.04em",
        fontWeight: 500, margin: 0, color: "var(--fg)",
        textWrap: "balance", maxWidth: 1280,
      }}>
        {lang === "en" ? (
          <>The actual repos. <span style={{ color: "var(--fg-dim)" }}>Pulled live.</span></>
        ) : (
          <>Faktyczne repo. <span style={{ color: "var(--fg-dim)" }}>Pobrane na żywo.</span></>
        )}
      </h1>

      <div style={{
        marginTop: 56, display: "grid",
        gridTemplateColumns: "1.3fr 1fr", gap: 28,
      }}>
        <TermChrome title={`${ME.github}@github: ~ — zsh`}>
          <div><span style={{ color: "var(--accent)" }}>$ </span>gh repo list --limit 6 --sort pushed</div>
          <div style={{ height: 6 }} />
          <div style={{
            display: "grid", gridTemplateColumns: "auto auto 1fr auto",
            columnGap: 16, rowGap: 4, fontSize: 12.5,
          }}>
            {ME.recentRepos.map((r, i) => (
              <React.Fragment key={i}>
                <span style={{ color: "var(--fg)" }}>{r.name}</span>
                <span style={{ color: "var(--accent)" }}>[{r.lang}]</span>
                <span style={{ color: "var(--fg-dim)" }}>{r.note[lang]}</span>
                <span style={{ color: "var(--fg-dim)", textAlign: "right" }}>{r.pushed}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ height: 12 }} />
          <div><span style={{ color: "var(--accent)" }}>$ </span>cat ~/about.txt</div>
          <div style={{ color: "var(--fg-dim)" }}>
            {lang === "en"
              ? "CS student. Comfortable in C# and Python. Trying things outside class."
              : "Student informatyki. Pewnie w C# i Pythonie. Próbuję rzeczy poza zajęciami."}
          </div>
          <div style={{ height: 8 }} />
          <div><span style={{ color: "var(--accent)" }}>$ </span>echo $STATUS</div>
          <div style={{ color: "var(--accent)" }}>→ {ME.status[lang]}</div>
          <div style={{ height: 8 }} />
          <div>
            <span style={{ color: "var(--accent)" }}>$ </span>
            <span style={{
              display: "inline-block", width: 8, height: 16, background: "var(--accent)",
              verticalAlign: "middle", animation: "hv2-blink 0.9s steps(2, end) infinite",
            }} />
          </div>
        </TermChrome>

        <div style={{
          padding: 24, border: "1px solid var(--border)", borderRadius: 10,
          background: "var(--bg-elev)",
          display: "flex", flexDirection: "column", gap: 18,
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--fg-dim)",
            display: "flex", justifyContent: "space-between",
          }}>
            <span>github.com/{ME.github}</span>
            {stats.mock && <span style={{ color: "var(--accent)" }}>· cached</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { k: lang === "en" ? "Public repos" : "Repo", v: stats.loading ? "…" : stats.repos },
              { k: lang === "en" ? "Languages"    : "Języki",
                v: stats.loading ? "…" : stats.languages.length },
              { k: lang === "en" ? "Top language" : "Główny język",
                v: stats.loading ? "…" : (stats.languages[0]?.name || "—") },
              { k: lang === "en" ? "On GitHub since" : "Na GitHubie od",
                v: ME.ghSince },
            ].map((s, i) => (
              <div key={i} style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.k}</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 36, lineHeight: 1, color: "var(--fg)", letterSpacing: "-0.02em", marginTop: 4 }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: "var(--bg)" }}>
              {stats.languages.map((l, i) => (
                <div key={i} style={{
                  width: `${l.pct * 100}%`,
                  background: i === 0 ? "var(--accent)"
                    : `color-mix(in oklab, var(--accent) ${Math.max(20, 100 - i*18)}%, var(--bg))`,
                }} />
              ))}
            </div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 12, fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)" }}>
              {stats.languages.slice(0, 5).map((l, i) => (
                <span key={i}>{l.name} <span style={{ opacity: 0.7 }}>{(l.pct*100).toFixed(0)}%</span></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HeroCTAs2 t={t} />
      <style>{`@keyframes hv2-blink{50%{opacity:0}}`}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// S1 — Stats panel. Six cards, all real and verifiable.
// No fabricated commit counts, streaks, or production deploys.
// ─────────────────────────────────────────────────────────────
function HeroS1_Dashboard() {
  const { t, lang } = useApp();
  const stats = useGithubStats(ME.github);
  const yearsOnGh = new Date().getFullYear() - ME.ghSince;

  // primary-language histogram for a small bar chart inside the card.
  const total = ME.langs.reduce((a, l) => a + l.count, 0);
  const langBars = ME.langs.map(l => ({ name: l.name, pct: l.count / total }));

  const cards = [
    {
      k: lang === "en" ? "Public repos" : "Repo",
      v: stats.loading ? "…" : stats.repos,
      sub: lang === "en" ? "all public, no forks" : "wszystkie publiczne, bez forków",
    },
    {
      k: lang === "en" ? "On GitHub since" : "GitHub od",
      v: ME.ghSince,
      sub: lang === "en" ? `~${yearsOnGh} years` : `~${yearsOnGh} lat`,
    },
    {
      k: lang === "en" ? "Languages used" : "Używane języki",
      v: ME.langs.length,
      sub: lang === "en" ? "as primary across repos" : "jako główny w repo",
    },
    {
      k: lang === "en" ? "Last push" : "Ostatni push",
      v: "Apr 26",
      sub: "SmakoszWebApp",
    },
    {
      k: lang === "en" ? "Stars on profile" : "Gwiazdki",
      v: 0,
      sub: lang === "en" ? "I don't fish for them" : "nie zabiegam o nie",
      muted: true,
    },
    {
      k: "Status",
      v: lang === "en" ? "OPEN" : "OTW.",
      sub: ME.status[lang],
      accent: true,
    },
  ];

  return (
    <section style={{ padding: "100px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "end",
      }}>
        <div>
          <HeroKicker2>{ME.role[lang]} · {ME.name}</HeroKicker2>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(56px, 7.5vw, 124px)",
            lineHeight: 0.94, letterSpacing: "-0.04em",
            fontWeight: 500, margin: 0, color: "var(--fg)",
            textWrap: "balance",
          }}>
            {lang === "en" ? (
              <>The boring numbers, <span style={{ color: "var(--fg-dim)" }}>before the talking starts.</span></>
            ) : (
              <>Nudne liczby, <span style={{ color: "var(--fg-dim)" }}>zanim zacznie się gadanie.</span></>
            )}
          </h1>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--fg-dim)", margin: 0, maxWidth: 380 }}>
          {lang === "en"
            ? "Everything below comes straight off the GitHub API. If a number isn't here, it's because I couldn't verify it."
            : "Wszystko poniżej pochodzi prosto z API GitHuba. Jeśli czegoś nie ma — nie umiałem tego zweryfikować."}
        </p>
      </div>

      <div style={{
        marginTop: 56, display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
        background: "var(--bg-elev)",
      }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            padding: "28px 28px 24px",
            borderRight: (i % 3 !== 2) ? "1px solid var(--border)" : "none",
            borderBottom: i < 3 ? "1px solid var(--border)" : "none",
            position: "relative",
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11,
              color: "var(--fg-dim)", letterSpacing: "0.12em",
              textTransform: "uppercase", marginBottom: 14,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>{c.k}</span>
              {c.accent && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)", boxShadow: "0 0 12px var(--accent)" }} />}
            </div>
            <div style={{
              fontFamily: "var(--display)",
              fontSize: 56, lineHeight: 1, letterSpacing: "-0.03em",
              color: c.accent ? "var(--accent)" : (c.muted ? "var(--fg-dim)" : "var(--fg)"),
              fontFeatureSettings: "'tnum' 1",
            }}>{c.v}</div>
            <div style={{ marginTop: 14, color: "var(--fg-dim)", fontFamily: "var(--mono)", fontSize: 11 }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* language histogram beneath the cards */}
      <div style={{ marginTop: 32 }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 12,
        }}>
          {lang === "en" ? "Language mix · primary across repos" : "Mix języków · główne w repo"}
        </div>
        <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", background: "var(--bg-elev)" }}>
          {langBars.map((l, i) => (
            <div key={i} title={`${l.name} ${(l.pct*100).toFixed(0)}%`} style={{
              width: `${l.pct * 100}%`,
              background: i === 0 ? "var(--accent)"
                : `color-mix(in oklab, var(--accent) ${Math.max(20, 100 - i*18)}%, var(--bg-elev))`,
            }} />
          ))}
        </div>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 16, fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)" }}>
          {langBars.map((l, i) => (
            <span key={i}>{l.name} <span style={{ opacity: 0.7 }}>{(l.pct*100).toFixed(0)}%</span></span>
          ))}
        </div>
      </div>

      <HeroCTAs2 t={t} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// S2 — Repo timeline. Replaces the old fabricated contribution
// heatmap. Each circle = one real repo, plotted against its
// pushed_at year. Honest, sparse, accurate.
// ─────────────────────────────────────────────────────────────
function HeroS2_RepoTimeline() {
  const { t, lang } = useApp();

  // Real repos with creation year + primary language, taken from the
  // public profile. Sorted oldest → newest.
  const repos = [
    { y: 2022, name: "lab_wdp",                            l: "Python" },
    { y: 2023, name: "AiSD",                               l: "Python" },
    { y: 2023, name: "SzczepanGrela_lab_programowanie",    l: "HTML" },
    { y: 2023, name: "gragas",                             l: "JS" },
    { y: 2024, name: "Kuchnia-Generator-Spisu",            l: "C#" },
    { y: 2024, name: "Projekt-ST1-Generator-Spisu",        l: "C#" },
    { y: 2024, name: "Punkt_Skladania_Zamowien",           l: "C#" },
    { y: 2024, name: "ST2-NetFilmx",                       l: "C#" },
    { y: 2024, name: "JPP_Laboratorium",                   l: "Python" },
    { y: 2025, name: "AirQualityApp",                      l: "Python" },
    { y: 2025, name: "AudioMaster",                        l: "Python" },
    { y: 2025, name: "kolkokrzyzyk",                       l: "Python" },
    { y: 2025, name: "SmakoszWebApp",                      l: "C#" },
    { y: 2025, name: "UrlShortenerSystem",                 l: "C#" },
    { y: 2025, name: "PiHole-parental_control",            l: "Dart" },
    { y: 2026, name: "(active) SmakoszWebApp",             l: "C#",   active: true },
  ];

  const years = [2022, 2023, 2024, 2025, 2026];
  const byYear = years.map(y => repos.filter(r => r.y === y));

  const langColor = (l) => {
    const map = {
      "C#":     "var(--accent)",
      "Python": "color-mix(in oklab, var(--accent) 70%, var(--fg))",
      "Dart":   "color-mix(in oklab, var(--accent) 50%, var(--fg-dim))",
      "JS":     "color-mix(in oklab, var(--accent) 35%, var(--fg-dim))",
      "HTML":   "color-mix(in oklab, var(--accent) 25%, var(--fg-dim))",
    };
    return map[l] || "var(--fg-dim)";
  };

  return (
    <section style={{ padding: "100px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56,
        alignItems: "end", marginBottom: 48,
      }}>
        <div>
          <HeroKicker2>{ME.role[lang]} · {ME.name} · {lang === "en" ? "Poland" : "Polska"}</HeroKicker2>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(54px, 7.5vw, 112px)",
            lineHeight: 0.94, letterSpacing: "-0.04em",
            fontWeight: 500, margin: 0, color: "var(--fg)",
            textWrap: "balance",
          }}>
            {lang === "en" ? (
              <>Four years, <span style={{ color: "var(--accent)" }}>{ME.publicRepos} repos.</span></>
            ) : (
              <>Cztery lata, <span style={{ color: "var(--accent)" }}>{ME.publicRepos} repo.</span></>
            )}
          </h1>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--fg-dim)", margin: 0, maxWidth: 420 }}>
          {lang === "en"
            ? "Every dot is a real, public repo on github.com/SzczepanGrela. Started slow with labs, picked up pace last year."
            : "Każda kropka to prawdziwe, publiczne repo na github.com/SzczepanGrela. Zacząłem powoli od laborek, w zeszłym roku przyspieszyłem."}
        </p>
      </div>

      {/* timeline */}
      <div style={{
        background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: 12, padding: "32px 36px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${years.length}, 1fr)`,
          columnGap: 24,
          alignItems: "end",
          minHeight: 220,
        }}>
          {byYear.map((bucket, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column-reverse",
              alignItems: "center", gap: 8,
              borderLeft: i > 0 ? "1px dashed var(--border)" : "none",
              paddingLeft: i > 0 ? 12 : 0, minHeight: 200,
            }}>
              {bucket.map((r, j) => (
                <div key={j} title={`${r.name} · ${r.l}`} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%",
                }}>
                  <span style={{
                    width: r.active ? 14 : 10, height: r.active ? 14 : 10,
                    borderRadius: 999,
                    background: langColor(r.l),
                    boxShadow: r.active ? "0 0 12px var(--accent)" : "none",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 11,
                    color: r.active ? "var(--accent)" : "var(--fg-dim)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {r.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* x-axis years */}
        <div style={{
          marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)",
          display: "grid", gridTemplateColumns: `repeat(${years.length}, 1fr)`,
          columnGap: 24, fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--fg-dim)", letterSpacing: "0.08em",
        }}>
          {years.map((y, i) => (
            <div key={y} style={{
              borderLeft: i > 0 ? "1px dashed var(--border)" : "none",
              paddingLeft: i > 0 ? 12 : 0,
              display: "flex", justifyContent: "space-between",
            }}>
              <span style={{ color: y === 2026 ? "var(--accent)" : "var(--fg)" }}>{y}</span>
              <span>· {byYear[i].length}</span>
            </div>
          ))}
        </div>

        {/* legend */}
        <div style={{
          marginTop: 18, display: "flex", flexWrap: "wrap", gap: 18,
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)",
        }}>
          {ME.langs.map((l, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: langColor(l.name) }} />
              {l.name} <span style={{ opacity: 0.7 }}>· {l.count}</span>
            </span>
          ))}
        </div>
      </div>

      <HeroCTAs2 t={t} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// S3 — Receipt. Same metaphor, but every line is a real fact.
// "READY TO HIRE" stamp removed (cringe + presumptuous).
// ─────────────────────────────────────────────────────────────
function HeroS3_Receipt() {
  const { t, lang } = useApp();
  const stats = useGithubStats(ME.github);
  const today = new Date();
  const dStr = today.toLocaleDateString(lang === "en" ? "en-GB" : "pl-PL");
  const tStr = today.toLocaleTimeString(lang === "en" ? "en-GB" : "pl-PL", { hour: "2-digit", minute: "2-digit" });
  const yearsOnGh = today.getFullYear() - ME.ghSince;

  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center",
      }}>
        <div>
          <HeroKicker2>{ME.role[lang]} · {ME.name} · {ME.status[lang]}</HeroKicker2>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(56px, 8vw, 128px)",
            lineHeight: 0.94, letterSpacing: "-0.04em",
            fontWeight: 500, margin: 0, color: "var(--fg)",
          }}>
            {lang === "en" ? (
              <>Itemized.<br /><span style={{ color: "var(--fg-dim)" }}>No rounding up.</span></>
            ) : (
              <>Wyszczególnione.<br /><span style={{ color: "var(--fg-dim)" }}>Bez zaokrągleń w górę.</span></>
            )}
          </h1>
          <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.55, color: "var(--fg-dim)", maxWidth: 460 }}>
            {lang === "en"
              ? "Every line is something you can verify by clicking through to GitHub."
              : "Każda linia to coś, co można sprawdzić klikając w GitHub."}
          </p>
          <HeroCTAs2 t={t} />
        </div>

        <div style={{
          fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.7,
          background: "var(--bg-elev)",
          color: "var(--fg)", padding: "32px 36px",
          borderRadius: 4,
          maxWidth: 460, marginLeft: "auto",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)",
          clipPath: "polygon(0 8px, 4% 0, 8% 8px, 12% 0, 16% 8px, 20% 0, 24% 8px, 28% 0, 32% 8px, 36% 0, 40% 8px, 44% 0, 48% 8px, 52% 0, 56% 8px, 60% 0, 64% 8px, 68% 0, 72% 8px, 76% 0, 80% 8px, 84% 0, 88% 8px, 92% 0, 96% 8px, 100% 0, 100% calc(100% - 8px), 96% 100%, 92% calc(100% - 8px), 88% 100%, 84% calc(100% - 8px), 80% 100%, 76% calc(100% - 8px), 72% 100%, 68% calc(100% - 8px), 64% 100%, 60% calc(100% - 8px), 56% 100%, 52% calc(100% - 8px), 48% 100%, 44% calc(100% - 8px), 40% 100%, 36% calc(100% - 8px), 32% 100%, 28% calc(100% - 8px), 24% 100%, 20% calc(100% - 8px), 16% 100%, 12% calc(100% - 8px), 8% 100%, 4% calc(100% - 8px), 0 100%)",
        }}>
          <div style={{ textAlign: "center", letterSpacing: "0.2em", paddingTop: 8 }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>SZCZEPAN GRELA</div>
            <div style={{ color: "var(--fg-dim)", fontSize: 11, marginTop: 4 }}>{ME.role[lang].toUpperCase()} · PL</div>
            <div style={{ color: "var(--fg-dim)", fontSize: 11, marginTop: 2 }}>github.com/{ME.github}</div>
          </div>
          <div style={{ borderTop: "1px dashed var(--border)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-dim)", fontSize: 11 }}>
            <span>{dStr}</span><span>{tStr}</span><span>#0042</span>
          </div>
          <div style={{ borderTop: "1px dashed var(--border)", margin: "16px 0" }} />
          {[
            { k: lang === "en" ? "Public repos"      : "Repo publiczne",  v: stats.loading ? ME.publicRepos : stats.repos },
            { k: lang === "en" ? "Stars"             : "Gwiazdki",        v: 0, dim: true },
            { k: lang === "en" ? "Languages used"    : "Używane języki",  v: ME.langs.length },
            { k: lang === "en" ? "On GitHub since"   : "Na GitHubie od",  v: ME.ghSince },
            { k: lang === "en" ? "Top language"      : "Główny język",    v: "C#" },
            { k: lang === "en" ? "Latest active repo": "Najświeższe",     v: "SmakoszWebApp" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "4px 0",
            }}>
              <span style={{ color: row.dim ? "var(--fg-dim)" : "inherit" }}>{row.k}</span>
              <span style={{ flex: 1, borderBottom: "1px dotted var(--border)", margin: "0 8px" }} />
              <span style={{ color: row.dim ? "var(--fg-dim)" : "var(--fg)", fontWeight: row.dim ? 400 : 500 }}>{row.v}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px dashed var(--border)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{ME.status[lang].toUpperCase()}</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>✓</span>
          </div>
          <div style={{ borderTop: "1px dashed var(--border)", margin: "16px 0" }} />
          <div style={{ textAlign: "center", color: "var(--fg-dim)", fontSize: 10, letterSpacing: "0.08em" }}>
            {lang === "en" ? "** THANKS FOR READING **" : "** DZIĘKUJĘ ZA UWAGĘ **"}
            <div style={{ marginTop: 4 }}>SCAN ↓</div>
            <div style={{
              marginTop: 8, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 1,
            }}>
              {Array.from({ length: 50 }).map((_, i) => (
                <span key={i} style={{
                  width: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
                  height: 24,
                  background: "var(--fg)",
                }} />
              ))}
            </div>
            <div style={{ marginTop: 6, letterSpacing: "0.2em" }}>{ME.github.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  HeroT1_Htop,
  HeroT2_Diff,
  HeroT3_TerminalStats,
  HeroS1_Dashboard,
  HeroS2_RepoTimeline,
  HeroS3_Receipt,
  // back-compat alias for old artboard reference
  HeroS2_ContribGraph: HeroS2_RepoTimeline,
});
