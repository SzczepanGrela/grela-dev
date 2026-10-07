import React from 'react';
import { useApp } from '../../context/AppContext';
import { EXPERIENCE } from '../../data/portfolioData';
import { SectionLabel } from '../layout/SectionLabel';

export function Experience() {
  const { lang, t } = useApp();
  return (
    <section id="experience" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="04" label={t("section_experience")} />
      <div style={{ marginTop: 40, maxWidth: 900 }}>
        {EXPERIENCE.map((e, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "180px 1fr",
            gap: 32, padding: "28px 0",
            borderTop: i === 0 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--fg-dim)", letterSpacing: "0.04em",
            }}>
              {e.period}
            </div>
            <div>
              <div style={{ fontSize: 20, color: "var(--fg)", marginBottom: 4, letterSpacing: "-0.01em", fontWeight: 500 }}>
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
