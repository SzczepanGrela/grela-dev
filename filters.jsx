// Five filter UI variants. All share the useProjectFilter() hook from shared.jsx;
// they differ only in chrome / layout. Each accepts a `filter` prop.

const { useState: useFs, useRef: useFr, useEffect: useFe, useMemo } = React;

// Reusable: search input row
function SearchRow({ filter, right }) {
  const { t } = useApp();
  const { query, setQuery, active, clear, filtered } = filter;
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
      <div style={{
        flex: 1, display: "flex", alignItems: "center", gap: 12,
        padding: "14px 18px",
        border: "1px solid var(--border)", borderRadius: 10,
        background: "var(--bg-elev)",
      }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-dim)" }}>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          data-cursor="text"
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "var(--fg)", fontSize: 15, fontFamily: "inherit",
          }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)" }}>
          {filtered.length}/{window.PROJECTS.length}
        </span>
      </div>
      {(active.size > 0 || query) && (
        <button onClick={clear} data-cursor="pointer" style={{
          border: "1px solid var(--border)", background: "transparent",
          color: "var(--fg)", padding: "14px 18px", borderRadius: 10,
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.04em",
          cursor: "pointer", textTransform: "uppercase",
        }}>
          {t("filter_clear")} · {active.size}
        </button>
      )}
      {right}
    </div>
  );
}

// ============ A: GROUPED CHIPS (current) ============
function FilterGrouped({ filter }) {
  const { lang } = useApp();
  return (
    <div style={{ paddingBottom: 24 }}>
      <SearchRow filter={filter} />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
      }}>
        {Object.entries(filter.tagsByCat).map(([cat, ids]) => ids.length > 0 && (
          <div key={cat}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 10,
            }}>
              {window.TAG_CATEGORIES[cat][lang]}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ids.map(id => (
                <TagChip key={id} id={id}
                  active={filter.active.has(id)}
                  onClick={() => filter.toggle(id)}
                  count={filter.tagCounts[id]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ B: COMPACT — single popularity-sorted flow ============
function FilterCompact({ filter }) {
  // Sort all tags by use count, descending; show all in one flowing row.
  const sorted = useMemo(() => {
    const ids = Object.keys(filter.tagCounts);
    return ids.sort((a, b) => filter.tagCounts[b] - filter.tagCounts[a]);
  }, [filter.tagCounts]);

  return (
    <div style={{ paddingBottom: 24 }}>
      <SearchRow filter={filter} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {sorted.map(id => (
          <TagChip key={id} id={id}
            active={filter.active.has(id)}
            onClick={() => filter.toggle(id)}
            count={filter.tagCounts[id]} />
        ))}
      </div>
    </div>
  );
}

// ============ C: SIDEBAR — left rail of categories, right side keeps projects ============
// This is a wrapper that returns BOTH sidebar + a slot for content.
// Used by ProjectMosaicWithSidebar variant.
function FilterSidebar({ filter, children }) {
  const { lang, t } = useApp();
  // Default: all categories with active selections expanded; first category open as a hint
  const [openCats, setOpenCats] = useFs(() => {
    const init = {};
    Object.keys(filter.tagsByCat).forEach((c, i) => { init[c] = i < 2; });
    return init;
  });
  const toggleCat = (c) => setOpenCats(s => ({ ...s, [c]: !s[c] }));

  // Auto-open category when a tag inside it gets activated
  useFe(() => {
    setOpenCats(prev => {
      let changed = false; const next = { ...prev };
      filter.active.forEach(id => {
        const c = window.TAGS[id]?.cat;
        if (c && !next[c]) { next[c] = true; changed = true; }
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
    }}>
      <aside style={{
        position: "sticky", top: 80,
        padding: "20px 20px 24px",
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
      }}>
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
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--fg)", fontSize: 13, fontFamily: "inherit", minWidth: 0,
            }} />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.04em",
          color: "var(--fg-dim)", marginBottom: 16,
        }}>
          <span>{filter.filtered.length}/{window.PROJECTS.length} {t("nav_work").toLowerCase()}</span>
          {(filter.active.size > 0 || filter.query) && (
            <button onClick={filter.clear} data-cursor="pointer" style={{
              border: "none", background: "transparent",
              color: "var(--accent)", fontFamily: "inherit", fontSize: 11,
              letterSpacing: "0.04em", cursor: "pointer", textTransform: "uppercase",
              padding: 0,
            }}>
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
              <button onClick={() => toggleCat(cat)} data-cursor="pointer" style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "transparent", border: "none",
                color: "var(--fg)", fontFamily: "var(--mono)",
                fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "8px 0", cursor: "pointer", textAlign: "left",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    color: "var(--fg-dim)",
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                    display: "inline-block", width: 10,
                  }}>›</span>
                  <span style={{ color: activeInCat ? "var(--accent)" : "var(--fg)" }}>
                    {window.TAG_CATEGORIES[cat][lang]}
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
                    return (
                      <button key={id} onClick={() => filter.toggle(id)} data-cursor="pointer" style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "5px 0 5px 18px",
                        background: "transparent", border: "none",
                        color: isActive ? "var(--accent)" : "var(--fg)",
                        fontFamily: "inherit", fontSize: 13,
                        cursor: "pointer", textAlign: "left",
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{
                            width: 12, height: 12, borderRadius: 3,
                            border: "1px solid " + (isActive ? "var(--accent)" : "var(--border)"),
                            background: isActive ? "var(--accent)" : "transparent",
                            display: "grid", placeItems: "center",
                            color: "var(--bg)", fontSize: 9, fontWeight: 700,
                          }}>{isActive ? "✓" : ""}</span>
                          {window.TAGS[id].label}
                        </span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)" }}>
                          {filter.tagCounts[id]}
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
      <div>{children}</div>
    </div>
  );
}

// ============ D: DROPDOWN per category ============
function FilterDropdowns({ filter }) {
  const { lang } = useApp();
  const [open, setOpen] = useFs(null); // open category id
  const ref = useFr(null);

  useFe(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // count active per category
  const activePerCat = useMemo(() => {
    const c = {};
    filter.active.forEach(id => {
      const cat = window.TAGS[id]?.cat;
      if (cat) c[cat] = (c[cat]||0)+1;
    });
    return c;
  }, [filter.active]);

  return (
    <div style={{ paddingBottom: 24 }} ref={ref}>
      <SearchRow filter={filter} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {Object.entries(filter.tagsByCat).map(([cat, ids]) => ids.length > 0 && (
          <div key={cat} style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(o => o === cat ? null : cat)}
              data-cursor="pointer"
              style={{
                border: "1px solid " + (activePerCat[cat] ? "var(--accent)" : "var(--border)"),
                background: activePerCat[cat] ? "color-mix(in oklab, var(--accent) 12%, transparent)" : "var(--bg-elev)",
                color: "var(--fg)",
                padding: "10px 14px", borderRadius: 8,
                fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}>
              {window.TAG_CATEGORIES[cat][lang]}
              {activePerCat[cat] ? (
                <span style={{
                  background: "var(--accent)", color: "var(--bg)",
                  fontSize: 10, padding: "1px 6px", borderRadius: 999, fontWeight: 700,
                }}>{activePerCat[cat]}</span>
              ) : (
                <span style={{ color: "var(--fg-dim)", fontSize: 10 }}>({ids.length})</span>
              )}
              <span style={{ color: "var(--fg-dim)", fontSize: 10, transform: open === cat ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </button>
            {open === cat && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                minWidth: 240, maxWidth: 360,
                background: "var(--bg-elev)",
                border: "1px solid var(--border)", borderRadius: 10,
                padding: 12,
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                zIndex: 20,
              }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {ids.map(id => (
                    <TagChip key={id} id={id} small
                      active={filter.active.has(id)}
                      onClick={() => filter.toggle(id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ E: ACTIVE STRIP + SCROLLABLE RAIL ============
function FilterRail({ filter }) {
  const { lang, t } = useApp();
  // Sort tags: active first, then by count desc
  const sortedAll = useMemo(() => {
    const ids = Object.keys(filter.tagCounts);
    return ids.sort((a, b) => filter.tagCounts[b] - filter.tagCounts[a]);
  }, [filter.tagCounts]);

  const activeArr = Array.from(filter.active);

  return (
    <div style={{ paddingBottom: 24 }}>
      <SearchRow filter={filter} />

      {activeArr.length > 0 && (
        <div style={{
          padding: "12px 16px",
          background: "color-mix(in oklab, var(--accent) 8%, var(--bg-elev))",
          border: "1px solid var(--accent)",
          borderRadius: 10,
          marginBottom: 12,
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--accent)",
          }}>
            {activeArr.length} {t("selected")}
          </span>
          <span style={{ width: 1, height: 16, background: "var(--border)" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1 }}>
            {activeArr.map(id => (
              <button key={id} onClick={() => filter.toggle(id)} data-cursor="pointer" style={{
                border: "1px solid var(--accent)",
                background: "var(--accent)", color: "var(--bg)",
                padding: "3px 4px 3px 9px", borderRadius: 999,
                fontFamily: "var(--mono)", fontSize: 11,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}>
                {window.TAGS[id].label}
                <span style={{
                  width: 14, height: 14, borderRadius: 999,
                  background: "color-mix(in oklab, var(--bg) 30%, transparent)",
                  display: "grid", placeItems: "center", fontSize: 11, lineHeight: 1,
                }}>×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{
        position: "relative",
        padding: "10px 0",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflowX: "auto",
      }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "nowrap", whiteSpace: "nowrap" }}>
          {sortedAll.filter(id => !filter.active.has(id)).map(id => (
            <TagChip key={id} id={id}
              active={false}
              onClick={() => filter.toggle(id)}
              count={filter.tagCounts[id]} />
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SearchRow, FilterGrouped, FilterCompact, FilterSidebar, FilterDropdowns, FilterRail,
});
