import React from 'react';
import { useApp } from '../../context/AppContext';

export function NoResults() {
  const { t } = useApp();
  return (
    <div
      style={{
        padding: "80px 0",
        textAlign: "center",
        fontFamily: "var(--mono)",
        color: "var(--fg-dim)",
        fontSize: 13,
        letterSpacing: "0.04em",
      }}
    >
      {t("no_results") || "No projects match these filters."}
    </div>
  );
}
