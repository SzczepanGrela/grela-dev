// Shared chrome: top bar (lang + theme), hero, skills, experience, contact,
// and the project-filter logic (used by all three layout variants).

const { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } = React;

// ---------- App context: theme + language ----------
const AppCtx = createContext(null);

function AppProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [lang,  setLang]  = useState("en");

  const t = useCallback((k) => (window.I18N[lang] && window.I18N[lang][k]) || k, [lang]);

  return (
    <AppCtx.Provider value={{ theme, setTheme, lang, setLang, t }}>
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
function Hero() {
  const { t, lang } = useApp();
  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "var(--accent)",
        display: "flex", alignItems: "center", gap: 12, marginBottom: 28,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)", boxShadow: "0 0 16px var(--accent)" }} />
        {t("hero_kicker")} · {lang === "en" ? "Poland" : "Polska"} · {t("hero_status")}
      </div>

      <h1 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(56px, 7vw, 112px)",
        lineHeight: 0.96,
        letterSpacing: "-0.035em",
        fontWeight: 500,
        margin: 0,
        color: "var(--fg)",
        textWrap: "balance",
        maxWidth: 1100,
      }}>
        {t("hero_title_a")} <span style={{ color: "var(--fg-dim)" }}>{t("hero_title_b")}</span>
      </h1>

      <p style={{
        marginTop: 36, maxWidth: 640,
        fontSize: 18, lineHeight: 1.55,
        color: "var(--fg-dim)",
      }}>{t("hero_sub")}</p>

      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
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
function Skills() {
  const { t, lang } = useApp();
  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="02" label={t("section_skills")} />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 32, marginTop: 48,
      }}>
        {window.SKILLS.map((g, i) => (
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
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
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
  const { lang, t } = useApp();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(new Set());

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

  const tagCounts = useMemo(() => {
    const c = {};
    window.PROJECTS.forEach(p => p.tags.forEach(tg => { c[tg] = (c[tg]||0)+1; }));
    return c;
  }, []);

  const toggle = useCallback((id) => {
    setActive(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);
  const clear = useCallback(() => { setActive(new Set()); setQuery(""); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return window.PROJECTS.filter(p => {
      // tag match: every active tag must be present
      for (const tg of active) if (!p.tags.includes(tg)) return false;
      if (!q) return true;
      const hay = [
        p.name,
        p.summary[lang],
        p.blurb[lang],
        ...p.tags.map(tg => window.TAGS[tg]?.label || ""),
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [query, active, lang]);

  return { query, setQuery, active, toggle, clear, tagsByCat, tagCounts, filtered };
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
  return (
    <button onClick={onClick} data-cursor="pointer" style={{
      border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
      background: active ? "var(--accent)" : "transparent",
      color: active ? "var(--bg)" : "var(--fg)",
      padding: small ? "3px 8px" : "5px 10px",
      borderRadius: 999,
      fontFamily: "var(--mono)", fontSize: small ? 10 : 11,
      letterSpacing: "0.02em",
      cursor: "pointer",
      transition: "background 0.15s, color 0.15s, border-color 0.15s",
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
  if (project.links.live) ls.push({ label: t("visit_site"), href: project.links.live, primary: true });
  if (project.links.repo) ls.push({ label: t("view_repo"), href: project.links.repo });
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {ls.map((l, i) => (
        <a key={i} href={l.href} data-cursor="pointer" style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: l.primary ? "var(--bg)" : "var(--fg)",
          background: l.primary ? "var(--accent)" : "transparent",
          border: "1px solid " + (l.primary ? "var(--accent)" : "var(--border)"),
          padding: "6px 10px", borderRadius: 6, textDecoration: "none",
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
    };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest?.("input, textarea")) dot.dataset.state = "text";
      else if (t.closest?.("a, button, [data-cursor], .cv-cta, .cv-card, .cv-chip")) dot.dataset.state = "pointer";
      else dot.dataset.state = "default";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
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
