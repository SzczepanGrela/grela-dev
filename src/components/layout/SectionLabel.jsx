import React from 'react';

export function SectionLabel({ num, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        fontFamily: "var(--mono)",
        fontSize: 12,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--fg-dim)",
      }}
    >
      <span style={{ color: "var(--accent)" }}>{num}</span>
      <span style={{ width: 24, height: 1, background: "var(--border)" }} />
      <span style={{ color: "var(--fg)" }}>{label}</span>
    </div>
  );
}
