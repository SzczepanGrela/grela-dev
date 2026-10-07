import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PROJECTS, TAGS, TAG_CATEGORIES } from '../../data/portfolioData';

export function FilterSidebar({ filter, children }) {
  const { lang, t } = useApp();

  const [openCats, setOpenCats] = useState(() => {
    const init = {};
    Object.keys(filter.tagsByCat).forEach((c, i) => { init[c] = i < 2; });
    return init;
  });

  const toggleCat = (c) => setOpenCats(s => ({ ...s, [c]: !s[c] }));

  // Auto-open category when a tag inside it gets activated
  useEffect(() => {
    setOpenCats(prev => {
      let changed = false;
      const next = { ...prev };
      filter.active.forEach(id => {
        const c = TAGS[id]?.cat;
        if (c && !next[c]) {
          next[c] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [filter.active]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "260px 1fr",
      gap: 32,
      alignItems: "start",
    }} className="filter-sidebar-layout">
      <aside style={{
        position: "sticky", top: 80,
        padding: "20px 20px 24px",
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
      }} aria-label="Project filters">
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px",
          border: "1px solid var(--border)", borderRadius: 8,
          background: "var(--bg)",
          marginBottom: 18,
        }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-dim)" }}>⌕</span>
          <input
            value={filter.query}
            onChange={(e) => filter.setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            data-cursor="text"
            aria-label={t("search_placeholder")}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--fg)", fontSize: 13, fontFamily: "inherit", minWidth: 0,
            }}
          />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.04em",
          color: "var(--fg-dim)", marginBottom: 16,
        }}>
          <span>{filter.filtered.length}/{PROJECTS.length} {t("nav_work").toLowerCase()}</span>
          {(filter.active.size > 0 || filter.query) && (
            <button
              type="button"
              onClick={filter.clear}
              data-cursor="pointer"
              style={{
                border: "none", background: "transparent",
                color: "var(--accent)", fontFamily: "inherit", fontSize: 11,
                letterSpacing: "0.04em", cursor: "pointer", textTransform: "uppercase",
                padding: 0,
              }}
            >
              {t("filter_clear")}
            </button>
          )}
        </div>

        {Object.entries(filter.tagsByCat).map(([cat, ids]) => {
          if (!ids.length) return null;
          const activeInCat = ids.filter(id => filter.active.has(id)).length;
          const isOpen = !!openCats[cat];
          return (
            <div key={cat} style={{ marginBottom: 8, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <button
                type="button"
                onClick={() => toggleCat(cat)}
                data-cursor="pointer"
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "transparent", border: "none",
                  color: "var(--fg)", fontFamily: "var(--mono)",
                  fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                  padding: "8px 0", cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    color: "var(--fg-dim)",
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                    display: "inline-block", width: 10,
                  }}>›</span>
                  <span style={{ color: activeInCat ? "var(--accent)" : "var(--fg)" }}>
                    {TAG_CATEGORIES[cat]?.[lang] || cat}
                  </span>
                </span>
                <span style={{ color: "var(--fg-dim)", fontSize: 10 }}>
                  {activeInCat ? <span style={{ color: "var(--accent)" }}>{activeInCat}/</span> : null}{ids.length}
                </span>
              </button>

              {isOpen && (
                <div style={{ display: "flex", flexDirection: "column", paddingBottom: 6 }}>
                  {ids.map(id => {
                    const isActive = filter.active.has(id);
                    const count = filter.tagCounts[id] || 0;
                    const isDisabled = count === 0 && !isActive;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => filter.toggle(id)}
                        disabled={isDisabled}
                        data-cursor={isDisabled ? "default" : "pointer"}
                        aria-pressed={isActive}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "5px 0 5px 18px",
                          background: "transparent", border: "none",
                          color: isActive ? "var(--accent)" : "var(--fg)",
                          fontFamily: "inherit", fontSize: 13,
                          cursor: isDisabled ? "not-allowed" : "pointer", textAlign: "left",
                          opacity: isDisabled ? 0.3 : 1,
                          pointerEvents: isDisabled ? "none" : "auto",
                          transition: "opacity 0.15s",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{
                            width: 12, height: 12, borderRadius: 3,
                            border: "1px solid " + (isActive ? "var(--accent)" : "var(--border)"),
                            background: isActive ? "var(--accent)" : "transparent",
                            display: "grid", placeItems: "center",
                            color: "var(--bg)", fontSize: 9, fontWeight: 700,
                          }}>
                            {isActive ? "✓" : ""}
                          </span>
                          {TAGS[id]?.label || id}
                        </span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)" }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </aside>
      {children}
    </div>
  );
}
