import React from 'react';
import { useApp } from '../../context/AppContext';

export function ProjectLinks({ project }) {
  const { t } = useApp();
  const ls = [];

  if (project.links && project.links.live && project.links.live !== "#") {
    ls.push({
      label: t("visit_site") || "Visit live",
      href: project.links.live,
      primary: true,
      target: "_blank",
      rel: "noopener noreferrer",
    });
  }

  const repoUrl = project.links && project.links.repo && project.links.repo !== "#"
    ? project.links.repo
    : (project.status === "private" ? null : `https://github.com/SzczepanGrela/${project.name}`);

  if (repoUrl) {
    ls.push({
      label: "GitHub",
      href: repoUrl,
      primary: false,
      target: "_blank",
      rel: "noopener noreferrer",
    });
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {ls.map((l, i) => (
        <a
          key={i}
          href={l.href}
          target={l.target}
          rel={l.rel}
          data-cursor="pointer"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: l.primary ? "var(--bg)" : "var(--fg)",
            background: l.primary ? "var(--accent)" : "transparent",
            border: "1px solid " + (l.primary ? "var(--accent)" : "var(--border)"),
            padding: "6px 10.5px",
            borderRadius: 6,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!l.primary) e.currentTarget.style.borderColor = "var(--fg)";
          }}
          onMouseLeave={(e) => {
            if (!l.primary) e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          {l.label} →
        </a>
      ))}
    </div>
  );
}
