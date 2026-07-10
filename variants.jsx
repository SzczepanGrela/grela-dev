// Three project-list variants for the design canvas.
// Each consumes the shared filter UI + project data and presents results
// in a different layout: grid cards / changelog rows / mosaic.

const { useState: useS1 } = React;

// ---------- VARIANT 1: GRID OF CARDS ----------
function ProjectGrid() {
  const { t, lang } = useApp();
  const filter = useProjectFilter();

  return (
    <section id="work" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="01" label={t("section_work")} />
      <h2 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 500,
        letterSpacing: "-0.025em", lineHeight: 1.05,
        margin: "32px 0 48px", maxWidth: 900, color: "var(--fg)",
        textWrap: "balance",
      }}>
        {t("section_work_sub")}
      </h2>

      <FilterBar filter={filter} />

      <div style={{ marginTop: 32 }}>
        {filter.filtered.length === 0 ? <NoResults /> : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: 20,
          }}>
            {filter.filtered.map(p => <GridCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function GridCard({ project }) {
  const { lang } = useApp();
  const [hover, setHover] = useS1(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="pointer"
      style={{
        position: "relative",
        border: "1px solid var(--border)", borderRadius: 12,
        padding: 24,
        background: "var(--bg-elev)",
        transition: "transform 0.25s, border-color 0.25s, background 0.25s",
        transform: hover ? "translateY(-4px)" : "none",
        borderColor: hover ? "var(--accent)" : "var(--border)",
        display: "flex", flexDirection: "column", gap: 16,
        minHeight: 320,
      }}>
      {/* Top row: number + status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em",
          color: "var(--fg-dim)",
        }}>
          {project.year}
        </span>
        <StatusPill status={project.status} />
      </div>

      {/* Placeholder visual */}
      <div style={{
        height: 140, borderRadius: 8,
        background:
          "repeating-linear-gradient(135deg, var(--placeholder-a) 0 12px, var(--placeholder-b) 12px 24px)",
        display: "grid", placeItems: "center",
        fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)",
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        {project.name}
      </div>

      <div>
        <h3 style={{
          fontFamily: "var(--display)",
          fontSize: 24, fontWeight: 500, letterSpacing: "-0.015em",
          margin: "0 0 8px", color: "var(--fg)",
        }}>
          {project.name}
        </h3>
        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.5,
          color: "var(--fg-dim)", textWrap: "pretty",
        }}>
          {project.summary[lang]}
        </p>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {project.tags.slice(0, 8).map(id => <TagChip key={id} id={id} small />)}
          {project.tags.length > 8 && (
            <span style={{
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)",
              padding: "3px 8px",
            }}>+{project.tags.length - 8}</span>
          )}
        </div>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

// ---------- VARIANT 2: CHANGELOG / TABLE ROWS ----------
function ProjectChangelog() {
  const { t } = useApp();
  const filter = useProjectFilter();

  return (
    <section id="work" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="01" label={t("section_work")} />
      <h2 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 500,
        letterSpacing: "-0.025em", lineHeight: 1.05,
        margin: "32px 0 48px", maxWidth: 900, color: "var(--fg)",
        textWrap: "balance",
      }}>
        {t("section_work_sub")}
      </h2>

      <FilterBar filter={filter} />

      <div style={{ marginTop: 32 }}>
        {filter.filtered.length === 0 ? <NoResults /> :
          filter.filtered.map((p, i) => <ChangelogRow key={p.id} project={p} index={i} />)
        }
      </div>
    </section>
  );
}

function ChangelogRow({ project, index }) {
  const { lang, t } = useApp();
  const [open, setOpen] = useS1(false);

  return (
    <div
      style={{
        borderTop: index === 0 ? "1px solid var(--border)" : "none",
        borderBottom: "1px solid var(--border)",
      }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); } }}
        data-cursor="pointer"
        style={{
          width: "100%", padding: "28px 0",
          display: "grid",
          gridTemplateColumns: "80px 80px minmax(220px, 320px) 1fr auto",
          gap: 32, alignItems: "center",
          background: "transparent", border: "none",
          color: "var(--fg)", fontFamily: "inherit",
          cursor: "pointer", textAlign: "left",
          transition: "padding 0.2s",
          paddingLeft: open ? 16 : 0,
        }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--fg-dim)", letterSpacing: "0.04em",
        }}>{String(index + 1).padStart(2, "0")}</span>

        <span style={{
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--fg-dim)",
        }}>{project.year}</span>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: "var(--display)", fontSize: 22,
            fontWeight: 500, letterSpacing: "-0.015em", color: "var(--fg)",
          }}>{project.name}</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {project.tags.slice(0, 6).map(id => <TagChip key={id} id={id} small />)}
          {project.tags.length > 6 && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)", padding: "3px 6px" }}>
              +{project.tags.length - 6}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <StatusPill status={project.status} />
          <span style={{
            color: "var(--fg-dim)", fontSize: 18,
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform 0.2s",
          }}>+</span>
        </div>
      </div>

      {open && (
        <div style={{
          padding: "0 0 36px 80px",
          display: "grid", gridTemplateColumns: "1fr 320px",
          gap: 48,
        }}>
          <div>
            <p style={{
              fontSize: 17, lineHeight: 1.55, color: "var(--fg)",
              margin: "0 0 16px", maxWidth: 720, textWrap: "pretty",
            }}>{project.summary[lang]}</p>
            <p style={{
              fontSize: 14, lineHeight: 1.55, color: "var(--fg-dim)",
              margin: "0 0 24px", maxWidth: 720, textWrap: "pretty",
            }}>{project.blurb[lang]}</p>
            <ProjectLinks project={project} />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 12,
            }}>
              All tags · {project.tags.length}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {project.tags.map(id => <TagChip key={id} id={id} small />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- VARIANT 3: ASYMMETRIC MOSAIC ----------
// 8-col grid; tile sizes vary by project importance/index
// `FilterComp` selects which filter UI to use; `wrapWithSidebar` lets the
// sidebar variant take over layout (filter on the left, mosaic on the right).
function ProjectMosaic({ FilterComp = FilterGrouped, wrapWithSidebar = false, ThumbComp = null, onOpenDetail }) {
  const { t } = useApp();
  const filter = useProjectFilter();

  // Tile size pattern; cycled if filter shrinks list
  const SIZES = [
    { col: 5, row: 2 }, // hero — wide & tall
    { col: 3, row: 2 }, // tall
    { col: 4, row: 1 },
    { col: 4, row: 1 },
    { col: 3, row: 1 },
    { col: 5, row: 1 },
    { col: 4, row: 1 },
    { col: 4, row: 1 },
  ];

  return (
    <section id="work" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="01" label={t("section_work")} />
      <h2 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 500,
        letterSpacing: "-0.025em", lineHeight: 1.05,
        margin: "32px 0 48px", maxWidth: 900, color: "var(--fg)",
        textWrap: "balance",
      }}>
        {t("section_work_sub")}
      </h2>

      {(() => {
        const grid = (
          <div style={{ marginTop: wrapWithSidebar ? 0 : 32 }}>
            {filter.filtered.length === 0 ? <NoResults /> : (
              <div style={{
                display: "grid",
                gridTemplateColumns: wrapWithSidebar ? "repeat(6, 1fr)" : "repeat(8, 1fr)",
                gridAutoRows: "220px",
                gap: 12,
              }}>
                {filter.filtered.map((p, i) => {
                  const s = wrapWithSidebar
                    ? [{col:4,row:2},{col:2,row:2},{col:3,row:1},{col:3,row:1},{col:2,row:1},{col:4,row:1},{col:3,row:1},{col:3,row:1}][i % 8]
                    : SIZES[i % SIZES.length];
                  return <MosaicTile key={p.id} project={p} size={s} hero={i === 0} ThumbComp={ThumbComp} onOpenDetail={onOpenDetail} />;
                })}
              </div>
            )}
          </div>
        );
        return wrapWithSidebar
          ? <FilterSidebar filter={filter}>{grid}</FilterSidebar>
          : <><FilterComp filter={filter} />{grid}</>;
      })()}
    </section>
  );
}

function MosaicTile({ project, size, hero, ThumbComp, onOpenDetail }) {
  const { lang, t } = useApp();
  const [hover, setHover] = useS1(false);
  const showThumb = !!ThumbComp && (hero || size.row === 2 || size.col >= 4);
  const thumbHeight = hero ? 220 : (size.row === 2 ? 180 : 110);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        if (!e.target.closest("a, button")) {
          onOpenDetail && onOpenDetail(project.id);
        }
      }}
      data-cursor="pointer"
      style={{
        gridColumn: `span ${size.col}`,
        gridRow: `span ${size.row}`,
        border: "1px solid var(--border)", borderRadius: 12,
        background: "var(--bg-elev)",
        padding: hero ? "40px 32px 36px" : "28px 24px 26px",
        position: "relative", overflow: "hidden",
        transition: "border-color 0.25s, background 0.25s",
        borderColor: hover ? "var(--accent)" : "var(--border)",
        display: "flex", flexDirection: "column",
      }}>
      {/* Decorative striped layer for hero tile */}
      {hero && (
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background:
            "repeating-linear-gradient(135deg, transparent 0 24px, color-mix(in oklab, var(--accent) 8%, transparent) 24px 25px)",
          pointerEvents: "none",
        }} />
      )}

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)" }}>
          {project.year}
        </span>
        <StatusPill status={project.status} />
      </div>

      <h3 style={{
        position: "relative",
        fontFamily: "var(--display)",
        fontSize: hero ? 40 : (size.row === 2 ? 26 : 22),
        fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1,
        margin: "0 0 16px", color: "var(--fg)",
      }}>
        {project.name}
      </h3>

      {showThumb && (
        <div style={{ position: "relative", marginBottom: 16 }}>
          <ThumbComp project={project} height={thumbHeight} />
        </div>
      )}

      <p style={{
        position: "relative",
        margin: 0,
        fontSize: hero ? 16 : 13,
        lineHeight: 1.6,
        color: "var(--fg-dim)",
        textWrap: "pretty",
        display: "-webkit-box",
        WebkitLineClamp: hero ? 5 : (size.row === 2 ? 6 : 2),
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {hero ? project.summary[lang] : project.blurb[lang]}
      </p>

      <div style={{ position: "relative", marginTop: "auto", paddingTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {project.tags.slice(0, hero ? 10 : 5).map(id => <TagChip key={id} id={id} small />)}
          {project.tags.length > (hero ? 10 : 5) && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)", padding: "3px 6px" }}>
              +{project.tags.length - (hero ? 10 : 5)}
            </span>
          )}
        </div>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

Object.assign(window, { ProjectGrid, ProjectChangelog, ProjectMosaic });
