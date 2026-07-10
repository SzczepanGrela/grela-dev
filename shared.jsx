// Shared chrome: top bar (lang + theme), hero, skills, experience, contact,
// and the project-filter logic (used by all three layout variants).

const { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } = React;

// ---------- App context: theme + language ----------
const AppCtx = createContext(null);

function AppProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [lang,  setLang]  = useState("en");
  const [filterActive, setFilterActive] = useState(new Set());
  const [filterQuery, setFilterQuery] = useState("");

  const t = useCallback((k) => (window.I18N[lang] && window.I18N[lang][k]) || k, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <AppCtx.Provider value={{
      theme, setTheme,
      lang, setLang,
      t,
      filterActive, setFilterActive,
      filterQuery, setFilterQuery
    }}>
      {children}
    </AppCtx.Provider>
  );
}
function useApp() { return useContext(AppCtx); }

// ---------- Top bar (used inside each artboard) ----------
function TopBar({ initials = "MK", artboardId }) {
  const { theme, setTheme, lang, setLang, t } = useApp();
  const tbStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 32px",
    fontFamily: "var(--mono)",
    fontSize: 12,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    borderBottom: "1px solid var(--border)",
    position: "sticky", top: 0,
    background: "color-mix(in oklab, var(--bg) 88%, transparent)",
    backdropFilter: "blur(8px)",
    zIndex: 10,
  };
  const linkStyle = { color: "var(--fg-dim)", textDecoration: "none", marginRight: 18 };
  const activeBtn = { background: "var(--fg)", color: "var(--bg)" };
  const btn = {
    border: "1px solid var(--border)", background: "transparent", color: "var(--fg-dim)",
    padding: "4px 8px", fontFamily: "inherit", fontSize: 11, letterSpacing: "0.05em",
    cursor: "pointer", textTransform: "uppercase",
  };
  return (
    <div style={tbStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: "var(--accent)", color: "var(--bg)",
          display: "grid", placeItems: "center",
          fontWeight: 700, fontSize: 12, fontFamily: "var(--mono)",
        }}>{initials}</div>
        <span style={{ color: "var(--fg)" }}>{initials} · Portfolio</span>
        <span style={{ color: "var(--fg-dim)", marginLeft: 8 }}>· {artboardId}</span>
      </div>

      <nav style={{ display: "flex", alignItems: "center" }}>
        <a style={linkStyle} href="#work">{t("nav_work")}</a>
        <a style={linkStyle} href="#skills">{t("nav_skills")}</a>
        <a style={linkStyle} href="#about">{t("nav_about")}</a>
        <a style={linkStyle} href="#contact">{t("nav_contact")}</a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button style={{ ...btn, ...(lang === "en" ? activeBtn : {}) }} onClick={() => setLang("en")}>EN</button>
        <button style={{ ...btn, ...(lang === "pl" ? activeBtn : {}) }} onClick={() => setLang("pl")}>PL</button>
        <span style={{ width: 1, height: 16, background: "var(--border)", margin: "0 6px" }} />
        <button style={{ ...btn, ...(theme === "dark"  ? activeBtn : {}) }} onClick={() => setTheme("dark")}>Dark</button>
        <button style={{ ...btn, ...(theme === "light" ? activeBtn : {}) }} onClick={() => setTheme("light")}>Light</button>
      </div>
    </div>
  );
}

// ---------- Hero ----------
const ME = {
  name: "Szczepan Grela",
  initials: "SG",
  github: "SzczepanGrela",
  ghUrl: "https://github.com/SzczepanGrela",
  role: { en: "Junior Software Engineer", pl: "Junior Software Engineer" },
  status: { en: "Open to roles", pl: "Szukam pracy" },
};

function useGithubStats(handle) {
  const [data, setData] = useState({ loading: true, mock: false, repos: 0, stars: 0, languages: [], top: null });
  useEffect(() => {
    let dead = false;
    const mock = () => ({
      loading: false, mock: true, repos: 16, stars: 0,
      languages: [
        { name: "C#", pct: 0.42 },
        { name: "Python", pct: 0.35 },
        { name: "Dart", pct: 0.08 },
        { name: "JS", pct: 0.08 },
        { name: "HTML", pct: 0.07 },
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
        const publicRepos = repos.filter(p => !p.fork);
        publicRepos.forEach(p => {
          if (p.language) lang[p.language] = (lang[p.language] || 0) + 1;
          stars += p.stargazers_count || 0;
        });
        const total = Object.values(lang).reduce((a, b) => a + b, 0) || 1;
        const languages = Object.entries(lang)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, n]) => ({ name, pct: n / total }));
        const top = publicRepos.find(p => p.name === "SmakoszWebApp") || publicRepos[0];
        setData({
          loading: false, mock: false,
          repos: publicRepos.length, stars,
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

function Hero() {
  const { t, lang } = useApp();
  const stats = useGithubStats(ME.github);

  return (
    <section style={{ padding: "100px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      {/* 1. Kicker */}
      <div style={{
        fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "var(--accent)",
        display: "flex", alignItems: "center", gap: 12, marginBottom: 28,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)", boxShadow: "0 0 16px var(--accent)" }} />
        {lang === "en" ? "SZCZEPAN GRELA · JUNIOR SOFTWARE ENGINEER · OPEN TO ROLES" : "SZCZEPAN GRELA · JUNIOR SOFTWARE ENGINEER · SZUKAM PRACY"}
      </div>

      {/* 2. Główny Tytuł */}
      <h1 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(48px, 6vw, 80px)",
        lineHeight: 0.96,
        letterSpacing: "-0.035em",
        fontWeight: 500,
        margin: 0,
        color: "var(--fg)",
        textWrap: "balance",
        maxWidth: 1100,
      }}>
        {lang === "en" ? (
          <>Backend & process automation. <span style={{ color: "var(--fg-dim)" }}>Practical ML/AI deployments.</span></>
        ) : (
          <>Backend i automatyzacja procesów. <span style={{ color: "var(--fg-dim)" }}>Praktyczne wdrożenia ML/AI.</span></>
        )}
      </h1>

      {/* 3. Opis bio */}
      <p style={{
        marginTop: 28, maxWidth: 720,
        fontSize: 17, lineHeight: 1.6,
        color: "var(--fg-dim)",
        textWrap: "pretty",
      }}>
        {lang === "en" ? (
          <>I focus on backend and automation using <strong>C#/.NET</strong> and <strong>Python</strong>. I am also interested in the practical applications of machine learning (<strong>ML</strong>) and <strong>AI</strong> — training recommender models in PyTorch and deploying LLM pipelines. I care about stability and keep my code verified with tests, containerized with Docker, and monitored.</>
        ) : (
          <>Skupiam się na backendzie i automatyzacji w <strong>C#/.NET</strong> oraz <strong>Pythonie</strong>. Interesuję się także praktycznym zastosowaniem uczenia maszynowego (<strong>ML</strong>) i sztucznej inteligencji (<strong>AI</strong>) — od trenowania modeli rekomendacji w PyTorch po wdrażanie pipeline'ów LLM. Dbam o to, by kod działał stabilnie: piszę testy, konteneryzuję usługi w Dockerze i konfiguruję podstawowy monitoring.</>
        )}
      </p>

      {/* 4. Karta GitHub Live Stats */}
      <div style={{
        marginTop: 40,
        padding: 24,
        border: "1px solid var(--border)",
        borderRadius: 10,
        background: "var(--bg-elev)",
        maxWidth: 800,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--fg-dim)",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>github.com/{ME.github}</span>
          {stats.mock && <span style={{ color: "var(--accent)" }}>· cached</span>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { k: lang === "en" ? "Public repos" : "Repozytoria", v: stats.loading ? "…" : stats.repos },
            { k: lang === "en" ? "Top language" : "Główny język", v: stats.loading ? "…" : (stats.languages[0]?.name || "—") },
            { k: "Status", v: lang === "en" ? "Open" : "Otwarty", accent: true },
          ].map((s, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.k}</div>
              <div style={{
                fontFamily: "var(--display)", fontSize: 32, lineHeight: 1,
                color: s.accent ? "var(--accent)" : "var(--fg)", letterSpacing: "-0.02em", marginTop: 4
              }}>
                {s.v}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 8,
          }}>
            {lang === "en" ? "Language mix" : "Rozkład języków"}
          </div>
          <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", background: "var(--bg)" }}>
            {stats.languages.map((l, i) => (
              <div key={i} title={`${l.name} ${(l.pct*100).toFixed(0)}%`} style={{
                width: `${l.pct * 100}%`,
                background: i === 0 ? "var(--accent)"
                  : `color-mix(in oklab, var(--accent) ${Math.max(20, 100 - i*18)}%, var(--bg))`
              }} />
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 14, fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)" }}>
            {stats.languages.slice(0, 5).map((l, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: 999,
                  background: i === 0 ? "var(--accent)"
                    : `color-mix(in oklab, var(--accent) ${Math.max(20, 100 - i*18)}%, var(--bg))`
                }} />
                {l.name} <span style={{ opacity: 0.7 }}>{(l.pct*100).toFixed(0)}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. CTAs */}
      <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="#work" className="cv-cta primary" data-cursor="pointer">
          {t("nav_work")} →
        </a>
        <a href="#contact" className="cv-cta" data-cursor="pointer">
          {t("nav_contact")}
        </a>
        <a href="#" className="cv-cta" data-cursor="pointer">
          {t("contact_cv")} ↓
        </a>
      </div>
    </section>
  );
}


// ---------- About ----------
function About() {
  const { t } = useApp();
  return (
    <section id="about" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="03" label={t("section_about")} />
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
        marginTop: 40, maxWidth: 1100,
      }}>
        <p style={{ fontSize: 22, lineHeight: 1.45, color: "var(--fg)", letterSpacing: "-0.005em", margin: 0, textWrap: "pretty" }}
           dangerouslySetInnerHTML={{ __html: t("section_about_body_1") }} />
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--fg-dim)", margin: 0, textWrap: "pretty" }}>
          {t("section_about_body_2")}
        </p>
      </div>
    </section>
  );
}

// ---------- Skills ----------
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

function Skills() {
  const { t, lang } = useApp();
  const filter = useProjectFilter();

  const handleTagClick = (tag) => {
    // Clear other filters for clean view
    filter.clear();
    // Activate the selected tag
    filter.toggle(tag);
    // Smooth scroll to the projects section
    const el = document.getElementById("work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-dim)" }}>
        <span style={{ color: "var(--accent)" }}>02</span>
        <span style={{ width: 24, height: 1, background: "var(--border)" }} />
        <span style={{ color: "var(--fg)" }}>{t("section_skills")}</span>
      </div>

      <h2 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 500,
        letterSpacing: "-0.025em", lineHeight: 1.05,
        margin: "32px 0 16px", maxWidth: 900, color: "var(--fg)",
        textWrap: "balance",
      }}>
        {lang === "en" ? "Stack — by domain" : "Stack — wg domeny"}
      </h2>
      <p style={{
        fontSize: 16, color: "var(--fg-dim)", margin: "0 0 48px",
        maxWidth: 720, lineHeight: 1.55,
      }}>
        {lang === "en"
          ? "Click any technology to filter the projects above."
          : "Kliknij wybraną technologię, aby przefiltrować listę projektów powyżej."}
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 32
      }}>
        {SKILLS_RICH.map((g, i) => (
          <div key={i}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--accent)", marginBottom: 16,
            }}>{g.group[lang]}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {g.items.map((it, j) => {
                const isSelected = filter.active.has(it.tag);
                return (
                  <button
                    key={j}
                    onClick={() => handleTagClick(it.tag)}
                    data-cursor="pointer"
                    style={{
                      padding: "5px 10px", borderRadius: 999, border: "1px solid",
                      borderColor: isSelected ? "var(--accent)" : "var(--border)",
                      background: isSelected ? "var(--accent)" : "transparent",
                      color: isSelected ? "var(--bg)" : "var(--fg)",
                      fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                  >
                    {it.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Experience ----------
function Experience() {
  const { t, lang } = useApp();
  return (
    <section style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="04" label={t("section_experience")} />
      <div style={{ marginTop: 48, maxWidth: 980 }}>
        {window.EXPERIENCE.map((e, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "180px 1fr",
            gap: 32, padding: "28px 0",
            borderTop: i === 0 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--fg-dim)", letterSpacing: "0.04em",
            }}>{e.period}</div>
            <div>
              <div style={{ fontSize: 20, color: "var(--fg)", marginBottom: 4, letterSpacing: "-0.01em" }}>
                {e.role[lang]}
              </div>
              <div style={{ fontSize: 14, color: "var(--fg-dim)", fontFamily: "var(--mono)", marginBottom: 12 }}>
                {e.org[lang]}
              </div>
              <p style={{ margin: 0, fontSize: 15, color: "var(--fg-dim)", lineHeight: 1.55, maxWidth: 640 }}>
                {e.desc[lang]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Contact ----------
function Contact() {
  const { t } = useApp();
  const items = [
    { label: t("contact_email"),    value: "hello@example.com",       href: "mailto:hello@example.com" },
    { label: t("contact_github"),   value: "github.com/yourhandle",   href: "#" },
    { label: t("contact_linkedin"), value: "linkedin.com/in/you",     href: "#" },
    { label: t("cv_pdf"),           value: "CV.pdf — 124 KB",         href: "#" },
  ];
  return (
    <section id="contact" style={{ padding: "120px 64px 140px" }}>
      <SectionLabel num="05" label={t("section_contact")} />
      <h2 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 500,
        letterSpacing: "-0.025em", lineHeight: 1.05,
        margin: "32px 0 16px", maxWidth: 900, color: "var(--fg)",
        textWrap: "balance",
      }}>
        {t("section_contact_sub")}
      </h2>
      <div style={{ marginTop: 56 }}>
        {items.map((it, i) => (
          <a key={i} href={it.href} data-cursor="pointer"
             style={{
               display: "grid", gridTemplateColumns: "180px 1fr 80px",
               gap: 32, padding: "24px 0",
               borderTop: "1px solid var(--border)",
               borderBottom: i === items.length - 1 ? "1px solid var(--border)" : "none",
               textDecoration: "none", color: "var(--fg)",
               transition: "color 0.2s, padding-left 0.2s",
             }}
             onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.paddingLeft = "12px"; }}
             onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg)";    e.currentTarget.style.paddingLeft = "0"; }}>
            <span style={{
              fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--fg-dim)",
            }}>{it.label}</span>
            <span style={{ fontSize: 22, letterSpacing: "-0.01em" }}>{it.value}</span>
            <span style={{ textAlign: "right", color: "var(--fg-dim)" }}>↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- Section label helper ----------
function SectionLabel({ num, label }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 16,
      fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
      textTransform: "uppercase", color: "var(--fg-dim)",
    }}>
      <span style={{ color: "var(--accent)" }}>{num}</span>
      <span style={{ width: 24, height: 1, background: "var(--border)" }} />
      <span style={{ color: "var(--fg)" }}>{label}</span>
    </div>
  );
}

// ---------- Project filter (search + tag chips, grouped by category) ----------
function useProjectFilter() {
  const { lang, t, filterActive, setFilterActive, filterQuery, setFilterQuery } = useApp();

  const allTagIds = useMemo(() => {
    const set = new Set();
    window.PROJECTS.forEach(p => p.tags.forEach(tg => set.add(tg)));
    return Array.from(set);
  }, []);

  const tagsByCat = useMemo(() => {
    const out = {};
    Object.keys(window.TAG_CATEGORIES).forEach(c => out[c] = []);
    allTagIds.forEach(id => {
      const t = window.TAGS[id];
      if (!t) return;
      (out[t.cat] = out[t.cat] || []).push(id);
    });
    Object.values(out).forEach(arr => arr.sort((a, b) =>
      window.TAGS[a].label.localeCompare(window.TAGS[b].label)
    ));
    return out;
  }, [allTagIds]);

  const toggle = useCallback((id) => {
    setFilterActive(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [setFilterActive]);

  const clear = useCallback(() => { setFilterActive(new Set()); setFilterQuery(""); }, [setFilterActive, setFilterQuery]);

  const filtered = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    return window.PROJECTS.filter(p => {
      // tag match: every active tag must be present
      for (const tg of filterActive) if (!p.tags.includes(tg)) return false;
      if (!q) return true;
      const hay = [
        p.name,
        p.summary[lang],
        p.blurb[lang],
        ...p.tags.map(tg => window.TAGS[tg]?.label || ""),
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [filterQuery, filterActive, lang]);

  const tagCounts = useMemo(() => {
    const c = {};
    allTagIds.forEach(id => { c[id] = 0; });
    filtered.forEach(p => {
      p.tags.forEach(tg => {
        c[tg] = (c[tg] || 0) + 1;
      });
    });
    return c;
  }, [filtered, allTagIds]);

  return { query: filterQuery, setQuery: setFilterQuery, active: filterActive, toggle, clear, tagsByCat, tagCounts, filtered };
}

function FilterBar({ filter, sticky = false }) {
  const { t, lang } = useApp();
  const { query, setQuery, active, toggle, clear, tagsByCat, tagCounts, filtered } = filter;

  return (
    <div style={{
      position: sticky ? "sticky" : "relative",
      top: sticky ? 60 : 0,
      background: "var(--bg)",
      zIndex: 5,
      paddingBottom: 24,
    }}>
      {/* search row */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 12,
          padding: "14px 18px",
          border: "1px solid var(--border)", borderRadius: 10,
          background: "var(--bg-elev)",
        }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-dim)" }}>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            data-cursor="text"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--fg)", fontSize: 15, fontFamily: "inherit",
            }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)" }}>
            {filtered.length}/{window.PROJECTS.length}
          </span>
        </div>
        {(active.size > 0 || query) && (
          <button onClick={clear} data-cursor="pointer" style={{
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--fg)", padding: "14px 18px", borderRadius: 10,
            fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.04em",
            cursor: "pointer", textTransform: "uppercase",
          }}>
            {t("filter_clear")} · {active.size} {t("filter_active")}
          </button>
        )}
      </div>

      {/* tag groups */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {Object.entries(tagsByCat).map(([cat, ids]) => ids.length > 0 && (
          <div key={cat}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 10,
            }}>
              {window.TAG_CATEGORIES[cat][lang]}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ids.map(id => (
                <TagChip
                  key={id}
                  id={id}
                  active={active.has(id)}
                  onClick={() => toggle(id)}
                  count={tagCounts[id]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagChip({ id, active, onClick, count, small = false }) {
  const tag = window.TAGS[id];
  if (!tag) return null;
  const isDisabled = count === 0 && !active;
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      data-cursor={isDisabled ? "default" : "pointer"}
      style={{
        border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
        background: active ? "var(--accent)" : "transparent",
        color: active ? "var(--bg)" : "var(--fg)",
        padding: small ? "3px 8px" : "5px 10px",
        borderRadius: 999,
        fontFamily: "var(--mono)", fontSize: small ? 10 : 11,
        letterSpacing: "0.02em",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.35 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
        transition: "background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s",
      }}>
      {tag.label}{count != null && !small ? <span style={{ opacity: 0.55, marginLeft: 6 }}>{count}</span> : null}
    </button>
  );
}

// Project status pill
function StatusPill({ status }) {
  const { t } = useApp();
  const map = {
    live:    { label: "LIVE",    color: "var(--accent)" },
    repo:    { label: "REPO",    color: "var(--fg)" },
    private: { label: t("private_repo").toUpperCase(), color: "var(--fg-dim)" },
  };
  const s = map[status] || map.repo;
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
      color: s.color, padding: "2px 8px",
      border: "1px solid " + s.color, borderRadius: 999,
    }}>
      {s.label}
    </span>
  );
}

// Common project links row
function ProjectLinks({ project }) {
  const { t } = useApp();
  const ls = [];
  
  if (project.links.live && project.links.live !== "#") {
    ls.push({ label: t("visit_site"), href: project.links.live, primary: true });
  }
  
  const repoUrl = project.links.repo && project.links.repo !== "#"
    ? project.links.repo
    : (project.status === "private" ? null : `https://github.com/SzczepanGrela/${project.name}`);

  if (repoUrl) {
    ls.push({ label: "GitHub", href: repoUrl, target: "_blank", rel: "noopener noreferrer" });
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {ls.map((l, i) => (
        <a key={i} href={l.href} target={l.target} rel={l.rel} data-cursor="pointer" style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: l.primary ? "var(--bg)" : "var(--fg)",
          background: l.primary ? "var(--accent)" : "transparent",
          border: "1px solid " + (l.primary ? "var(--accent)" : "var(--border)"),
          padding: "6px 10.5px", borderRadius: 6, textDecoration: "none",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!l.primary) e.currentTarget.style.borderColor = "var(--fg)";
        }}
        onMouseLeave={(e) => {
          if (!l.primary) e.currentTarget.style.borderColor = "var(--border)";
        }}>
          {l.label} →
        </a>
      ))}
    </div>
  );
}

function NoResults() {
  const { t } = useApp();
  return (
    <div style={{
      padding: "80px 0", textAlign: "center",
      fontFamily: "var(--mono)", color: "var(--fg-dim)",
      fontSize: 13, letterSpacing: "0.04em",
    }}>
      {t("no_results")}
    </div>
  );
}

// ---------- Custom cursor — Tiny dot · variant B (final) ----------
// 6 px fg dot in default, switches to accent on interactive targets.
// Becomes a 2 × 18 px caret in text inputs.
function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.createElement("div");
    dot.className = "cv-cursor-dot";
    dot.dataset.state = "default";
    document.body.append(dot);

    const onMove = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      // Hide if very close to the edges to prevent sticking
      if (e.clientX <= 2 || e.clientY <= 2 || e.clientX >= window.innerWidth - 2 || e.clientY >= window.innerHeight - 2) {
        dot.style.opacity = "0";
      } else {
        dot.style.opacity = "1";
      }
    };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest?.("input, textarea")) dot.dataset.state = "text";
      else if (t.closest?.("a, button, [data-cursor], .cv-cta, .cv-card, .cv-chip")) dot.dataset.state = "pointer";
      else dot.dataset.state = "default";
    };
    const onLeave = () => {
      dot.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
    };
    const onBlur = () => {
      dot.style.opacity = "0";
    };
    const onFocus = () => {
      dot.style.opacity = "1";
    };
    const onMouseOut = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        dot.style.opacity = "0";
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      dot.remove();
    };
  }, []);
  return null;
}

// expose
Object.assign(window, {
  AppProvider, useApp, AppCtx,
  TopBar, Hero, About, Skills, Experience, Contact,
  SectionLabel, useProjectFilter, FilterBar, TagChip,
  StatusPill, ProjectLinks, NoResults, CustomCursor,
});
