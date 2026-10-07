import React from 'react';
import { useApp } from '../../context/AppContext';
import { ME } from '../../data/portfolioData';
import { SectionLabel } from '../layout/SectionLabel';

export function Contact() {
  const { t } = useApp();

  const items = [
    { label: t("contact_email"),    value: "szczepan.grela@example.com", href: "mailto:szczepan.grela@example.com", isPendingDecision: true },
    { label: t("contact_github"),   value: "github.com/" + ME.github,   href: ME.ghUrl, target: "_blank", rel: "noopener noreferrer" },
    { label: t("contact_linkedin"), value: "linkedin.com/in/szczepangrela", href: "https://linkedin.com", isPendingDecision: true, target: "_blank", rel: "noopener noreferrer" },
    { label: t("cv_pdf"),           value: "Szczepan_Grela_CV.pdf",     href: "#", isPendingDecision: true },
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
          <a
            key={i}
            href={it.href}
            target={it.target}
            rel={it.rel}
            data-cursor="pointer"
            style={{
              display: "grid", gridTemplateColumns: "180px 1fr 80px",
              gap: 32, padding: "24px 0",
              borderTop: "1px solid var(--border)",
              borderBottom: i === items.length - 1 ? "1px solid var(--border)" : "none",
              textDecoration: "none", color: "var(--fg)",
              transition: "color 0.2s, padding-left 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.paddingLeft = "12px"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg)";    e.currentTarget.style.paddingLeft = "0"; }}
          >
            <span style={{
              fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--fg-dim)",
            }}>
              {it.label}
            </span>
            <span style={{ fontSize: 22, letterSpacing: "-0.01em" }}>
              {it.value}
            </span>
            <span style={{ textAlign: "right", color: "var(--fg-dim)" }}>↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
