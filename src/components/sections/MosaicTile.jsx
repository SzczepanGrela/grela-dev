import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../common/StatusPill';
import { TagChip } from '../common/TagChip';
import { ProjectLinks } from '../common/ProjectLinks';

export function MosaicTile({ project, size, hero, ThumbComp, onOpenDetail }) {
  const { lang } = useApp();
  const [hover, setHover] = useState(false);
  const showThumb = !!ThumbComp && (hero || size.row === 2 || size.col >= 4);
  const thumbHeight = hero ? 220 : (size.row === 2 ? 180 : 110);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        if (!e.target.closest("a, button")) {
          if (onOpenDetail) onOpenDetail(project.id);
        }
      }}
      data-cursor="pointer"
      tabIndex={0}
      role="region"
      aria-label={project.name}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.target.closest("a, button")) {
          if (onOpenDetail) onOpenDetail(project.id);
        }
      }}
      style={{
        gridColumn: `span ${size.col}`,
        gridRow: `span ${size.row}`,
        border: "1px solid var(--border)",
        borderRadius: 12,
        background: "var(--bg-elev)",
        padding: hero ? "40px 32px 36px" : "28px 24px 26px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.25s, background 0.25s",
        borderColor: hover ? "var(--accent)" : "var(--border)",
        display: "flex",
        flexDirection: "column",
        outline: "none",
      }}
    >
      {/* Decorative striped layer for hero tile */}
      {hero && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(135deg, transparent 0 24px, color-mix(in oklab, var(--accent) 8%, transparent) 24px 25px)",
            pointerEvents: "none",
          }}
        />
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
        fontWeight: 500,
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        margin: "0 0 16px",
        color: "var(--fg)",
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
