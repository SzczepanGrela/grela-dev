import React from 'react';

export function ThumbStripes({ project, height = 140 }) {
  return (
    <div
      style={{
        height,
        borderRadius: 8,
        background: "repeating-linear-gradient(135deg, var(--placeholder-a) 0 12px, var(--placeholder-b) 12px 24px)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--fg-dim)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        border: "1px solid var(--border)",
      }}
    >
      {project.name}
    </div>
  );
}
