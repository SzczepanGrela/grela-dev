import React from 'react';
import { TAGS } from '../../data/portfolioData';

export function TagChip({ id, active = false, onClick, count, small = false }) {
  const tag = TAGS[id];
  if (!tag) return null;
  const isDisabled = count === 0 && !active;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      data-cursor={isDisabled ? "default" : "pointer"}
      style={{
        border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
        background: active ? "var(--accent)" : "transparent",
        color: active ? "var(--bg)" : "var(--fg)",
        padding: small ? "3px 8px" : "5px 10px",
        borderRadius: 999,
        fontFamily: "var(--mono)",
        fontSize: small ? 10 : 11,
        letterSpacing: "0.02em",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.35 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
        transition: "background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s",
      }}
    >
      {tag.label}
      {count != null && !small ? (
        <span style={{ opacity: 0.55, marginLeft: 6 }}>{count}</span>
      ) : null}
    </button>
  );
}
