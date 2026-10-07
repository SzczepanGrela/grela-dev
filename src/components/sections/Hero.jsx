import { useApp } from '../../context/AppContext';
import { ME } from '../../data/portfolioData';
import { useGithubStats } from '../../hooks/useGithubStats';

export function Hero() {
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

      {/* 2. Headline */}
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

      {/* 3. Bio paragraph */}
      <p style={{
        marginTop: 28, maxWidth: 720,
        fontSize: 17, lineHeight: 1.6,
        color: "var(--fg-dim)",
        textWrap: "pretty",
      }}>
        {lang === "en" ? (
          <>I focus on backend and automation using <strong>C#/.NET</strong> and <strong>Python</strong>. I am also interested in the practical applications of machine learning (<strong>ML</strong>) and <strong>AI</strong> — training recommender models in PyTorch and deploying LLM pipelines. I care about stability and keep my code verified with tests, containerized with Docker, and monitored.</>
        ) : (
          <>Skupiam się na backendzie i automatyzacji w <strong>C#/.NET</strong> oraz <strong>Pythonie</strong>. Interesuję się także praktycznym zastosowaniem uczenia maszynowego (<strong>ML</strong>) i sztucznej inteligencji (<strong>AI</strong>) — od trenowania modeli rekomendacji w PyTorch po wdrażanie pipeline&apos;ów LLM. Dbam o to, by kod działał stabilnie: piszę testy, konteneryzuję usługi w Dockerze i konfiguruję podstawowy monitoring.</>
        )}
      </p>

      {/* 4. GitHub Live Stats Card */}
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
        <a href="#contact" className="cv-cta" data-cursor="pointer">
          {t("contact_cv")} ↓
        </a>
      </div>
    </section>
  );
}
