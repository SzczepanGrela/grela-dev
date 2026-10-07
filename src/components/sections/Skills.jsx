import React from 'react';
import { useApp } from '../../context/AppContext';
import { SKILLS_RICH } from '../../data/portfolioData';
import { useProjectFilter } from '../../hooks/useProjectFilter';
import { SectionLabel } from '../layout/SectionLabel';

export function Skills() {
  const { t, lang } = useApp();
  const filter = useProjectFilter();

  const handleTagClick = (tag) => {
    filter.clear();
    filter.toggle(tag);
    const el = document.getElementById("work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="skills" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="02" label={t("section_skills")} />

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
            }}>
              {g.group[lang]}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {g.items.map((it, j) => {
                const isSelected = filter.active.has(it.tag);
                return (
                  <button
                    key={j}
                    type="button"
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
