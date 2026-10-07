import React from 'react';
import { useApp } from '../../context/AppContext';

export function StatusPill({ status }) {
  const { t } = useApp();
  const map = {
    live:    { label: "LIVE",    color: "var(--accent)" },
    repo:    { label: "REPO",    color: "var(--fg)" },
    private: { label: (t("private_repo") || "Private").toUpperCase(), color: "var(--fg-dim)" },
  };
  const s = map[status] || map.repo;

  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: s.color,
        padding: "2px 8px",
        border: "1px solid " + s.color,
        borderRadius: 999,
        lineHeight: 1.4,
      }}
    >
      {s.label}
    </span>
  );
}
