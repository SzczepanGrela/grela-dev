import React from 'react';
import { useApp } from '../../context/AppContext';
import { useProjectFilter } from '../../hooks/useProjectFilter';
import { SectionLabel } from '../layout/SectionLabel';
import { FilterSidebar } from '../filters/FilterSidebar';
import { MosaicTile } from './MosaicTile';
import { NoResults } from '../common/NoResults';

export function ProjectMosaic({ wrapWithSidebar = true, ThumbComp = null, onOpenDetail }) {
  const { t } = useApp();
  const filter = useProjectFilter();

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

  const SIDEBAR_SIZES = [
    { col: 4, row: 2 },
    { col: 2, row: 2 },
    { col: 3, row: 1 },
    { col: 3, row: 1 },
    { col: 2, row: 1 },
    { col: 4, row: 1 },
    { col: 3, row: 1 },
    { col: 3, row: 1 },
  ];

  const grid = (
    <div style={{ marginTop: wrapWithSidebar ? 0 : 32 }}>
      {filter.filtered.length === 0 ? (
        <NoResults />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: wrapWithSidebar ? "repeat(6, 1fr)" : "repeat(8, 1fr)",
          gridAutoRows: "220px",
          gap: 12,
        }}>
          {filter.filtered.map((p, i) => {
            const s = wrapWithSidebar
              ? SIDEBAR_SIZES[i % SIDEBAR_SIZES.length]
              : SIZES[i % SIZES.length];
            return (
              <MosaicTile
                key={p.id}
                project={p}
                size={s}
                hero={i === 0}
                ThumbComp={ThumbComp}
                onOpenDetail={onOpenDetail}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section id="work" style={{ padding: "96px 64px", borderBottom: "1px solid var(--border)" }}>
      <SectionLabel num="01" label={t("section_work")} />
      <h2 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(36px, 4.5vw, 64px)",
        fontWeight: 500,
        letterSpacing: "-0.025em",
        lineHeight: 1.05,
        margin: "32px 0 48px",
        maxWidth: 900,
        color: "var(--fg)",
        textWrap: "balance",
      }}>
        {t("section_work_sub")}
      </h2>

      {wrapWithSidebar ? (
        <FilterSidebar filter={filter}>{grid}</FilterSidebar>
      ) : (
        grid
      )}
    </section>
  );
}
