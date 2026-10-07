import React from 'react';
import { useApp } from '../../context/AppContext';
import { DETAILS } from '../../data/projectDetails';
import { TagChip } from '../common/TagChip';
import { DetailNotFound } from './DetailNotFound';

function Figure({ caption }) {
  return (
    <figure style={{ margin: "32px 0" }}>
      <div style={{
        height: 280, borderRadius: 8,
        background: "repeating-linear-gradient(135deg, var(--placeholder-a) 0 12px, var(--placeholder-b) 12px 24px)",
        display: "grid", placeItems: "center",
        fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)",
        letterSpacing: "0.12em", textTransform: "uppercase",
        border: "1px solid var(--border)",
      }}>
        diagram / screenshot
      </div>
      <figcaption style={{
        marginTop: 12, fontFamily: "var(--mono)",
        fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.04em",
      }}>
        Fig. — {caption}
      </figcaption>
    </figure>
  );
}

function CodeBlock({ text, lang }) {
  return (
    <pre style={{
      margin: "24px 0",
      padding: "16px 18px",
      background: "var(--bg-elev)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      fontFamily: "var(--mono)", fontSize: 12.5,
      lineHeight: 1.55, color: "var(--fg)",
      overflowX: "auto",
      position: "relative",
    }}>
      <span style={{
        position: "absolute", top: 8, right: 12,
        fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--fg-dim)",
      }}>{lang}</span>
      <code>{text}</code>
    </pre>
  );
}

function renderBlock(b, i) {
  switch (b.kind) {
    case "lead":
      return <p key={i} style={{
        fontSize: 22, lineHeight: 1.5, color: "var(--fg)",
        letterSpacing: "-0.01em", margin: "8px 0 32px",
        textWrap: "pretty",
      }}>{b.text}</p>;
    case "h2":
      return <h2 key={i} style={{
        fontFamily: "var(--display)",
        fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em",
        margin: "56px 0 16px", color: "var(--fg)",
      }}>{b.text}</h2>;
    case "p":
      return <p key={i} style={{
        fontSize: 16, lineHeight: 1.65,
        color: "var(--fg-dim)", margin: "0 0 18px",
        maxWidth: 720, textWrap: "pretty",
      }}>{b.text}</p>;
    case "fig":
      return <Figure key={i} caption={b.caption} />;
    case "code":
      return <CodeBlock key={i} text={b.text} lang={b.lang} />;
    default: return null;
  }
}

function MetaPair({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 10,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--fg-dim)",
      }}>{label}</span>
      <span style={{ fontSize: 15, color: "var(--fg)" }}>{value}</span>
    </div>
  );
}

function DetailHero({ project, compact = false, onBack }) {
  const { lang, t } = useApp();
  return (
    <header style={{
      padding: compact ? "56px 64px 32px" : "120px 64px 56px",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "var(--fg-dim)",
        display: "flex", gap: 12, alignItems: "center", marginBottom: 24,
      }}>
        <button
          type="button"
          onClick={onBack}
          data-cursor="pointer"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--fg-dim)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "inherit",
            padding: 0,
            textTransform: "inherit",
            letterSpacing: "inherit",
          }}
        >
          ← {t("nav_work")}
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ color: "var(--accent)" }}>{project.id}</span>
        <span style={{ color: "var(--border)" }}>/</span>
        <span>{project.year}</span>
      </div>
      <h1 style={{
        fontFamily: "var(--display)",
        fontSize: compact ? "clamp(48px, 5.5vw, 80px)" : "clamp(64px, 7vw, 104px)",
        fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 0.98,
        margin: 0, color: "var(--fg)", textWrap: "balance",
      }}>{project.name}</h1>
      <p style={{
        marginTop: 28, maxWidth: 720,
        fontSize: 18, lineHeight: 1.55, color: "var(--fg-dim)",
      }}>{project.summary[lang]}</p>
    </header>
  );
}

function DetailLinks({ project, vertical = false }) {
  const { t } = useApp();
  const items = [
    project.links.live && project.links.live !== "#" ? { label: t("visit_site"), href: project.links.live, primary: true } : null,
    project.links.repo && project.links.repo !== "#" ? { label: "GitHub", href: project.links.repo } : null,
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 8, flexWrap: "wrap" }}>
      {items.map((l, i) => (
        <a
          key={i}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          style={{
            fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: l.primary ? "var(--bg)" : "var(--fg)",
            background: l.primary ? "var(--accent)" : "transparent",
            border: "1px solid " + (l.primary ? "var(--accent)" : "var(--border)"),
            padding: "10px 14px", borderRadius: 8, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 8,
            justifyContent: vertical ? "space-between" : "flex-start",
          }}
        >
          {l.label} <span style={{ opacity: 0.7 }}>↗</span>
        </a>
      ))}
    </div>
  );
}

export function DetailSplit({ projectId = "smakosz", onBack }) {
  const { lang } = useApp();
  const detail = DETAILS[projectId];

  if (!detail || !detail.project) {
    return <DetailNotFound projectId={projectId} onBack={onBack} />;
  }

  const { project, blocks, meta } = detail;

  return (
    <>
      <DetailHero project={project} compact onBack={onBack} />
      <div style={{
        padding: "0 64px 120px",
        display: "grid", gridTemplateColumns: "320px 1fr",
        gap: 64, alignItems: "start",
        borderBottom: "1px solid var(--border)",
      }} className="detail-split-layout">
        <aside style={{
          position: "sticky", top: 100,
          paddingTop: 56,
          display: "flex", flexDirection: "column", gap: 28,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <MetaPair label="Role"     value={meta.role[lang]} />
            <MetaPair label="Timeline" value={meta.timeline[lang]} />
            <MetaPair label="Context"  value={meta.type[lang]} />
            <MetaPair label="Scale"    value={meta.scale[lang]} />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 10,
            }}>Stack</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {project.tags.map(id => <TagChip key={id} id={id} small />)}
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 10,
            }}>Links</div>
            <DetailLinks project={project} vertical />
          </div>
        </aside>
        <article style={{ paddingTop: 56 }}>
          {blocks[lang].map(renderBlock)}
        </article>
      </div>
    </>
  );
}
