import React from 'react';
import { useApp } from '../../context/AppContext';
import { SectionLabel } from '../layout/SectionLabel';

export function About() {
  const { t } = useApp();
  return (
    <section id="about" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="03" label={t("section_about")} />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64,
        marginTop: 40, maxWidth: 1100,
      }}>
        <p
          style={{ fontSize: 22, lineHeight: 1.45, color: "var(--fg)", letterSpacing: "-0.005em", margin: 0, textWrap: "pretty" }}
          dangerouslySetInnerHTML={{ __html: t("section_about_body_1") }}
        />
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--fg-dim)", margin: 0, textWrap: "pretty" }}>
          {t("section_about_body_2")}
        </p>
      </div>
    </section>
  );
}
