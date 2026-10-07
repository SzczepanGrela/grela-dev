import React from 'react';
import { useApp } from '../../context/AppContext';
import { ME } from '../../data/portfolioData';

export function TopBar({ artboardId = 'home' }) {
  const { theme, setTheme, lang, setLang, t } = useApp();

  const tbStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 32px",
    fontFamily: "var(--mono)",
    fontSize: 12,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    background: "color-mix(in oklab, var(--bg) 88%, transparent)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 10,
  };

  const linkStyle = {
    color: "var(--fg-dim)",
    textDecoration: "none",
    marginRight: 18,
    transition: "color 0.2s",
  };

  const activeBtn = {
    background: "var(--fg)",
    color: "var(--bg)",
    border: "1px solid var(--fg)",
  };

  const btn = {
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--fg-dim)",
    padding: "4px 8px",
    fontFamily: "inherit",
    fontSize: 11,
    letterSpacing: "0.05em",
    cursor: "pointer",
    textTransform: "uppercase",
    borderRadius: 4,
    transition: "all 0.15s",
  };

  return (
    <header style={tbStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "var(--accent)",
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: 12,
            fontFamily: "var(--mono)",
          }}
          aria-hidden="true"
        >
          {ME.initials}
        </div>
        <span style={{ color: "var(--fg)" }}>{ME.name} · Portfolio</span>
        {artboardId && (
          <span style={{ color: "var(--fg-dim)", marginLeft: 4 }} className="screen-indicator">
            · {artboardId}
          </span>
        )}
      </div>

      <nav style={{ display: "flex", alignItems: "center" }} aria-label="Main navigation">
        <a style={linkStyle} href="#work">{t("nav_work")}</a>
        <a style={linkStyle} href="#skills">{t("nav_skills")}</a>
        <a style={linkStyle} href="#about">{t("nav_about")}</a>
        <a style={linkStyle} href="#contact">{t("nav_contact")}</a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          type="button"
          style={{ ...btn, ...(lang === "en" ? activeBtn : {}) }}
          onClick={() => setLang("en")}
          aria-label="Switch language to English"
        >
          EN
        </button>
        <button
          type="button"
          style={{ ...btn, ...(lang === "pl" ? activeBtn : {}) }}
          onClick={() => setLang("pl")}
          aria-label="Przełącz język na polski"
        >
          PL
        </button>
        <span style={{ width: 1, height: 16, background: "var(--border)", margin: "0 6px" }} aria-hidden="true" />
        <button
          type="button"
          style={{ ...btn, ...(theme === "dark" ? activeBtn : {}) }}
          onClick={() => setTheme("dark")}
          aria-label="Switch to dark theme"
        >
          Dark
        </button>
        <button
          type="button"
          style={{ ...btn, ...(theme === "light" ? activeBtn : {}) }}
          onClick={() => setTheme("light")}
          aria-label="Switch to light theme"
        >
          Light
        </button>
      </div>
    </header>
  );
}
