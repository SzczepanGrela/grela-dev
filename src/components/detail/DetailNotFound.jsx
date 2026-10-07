import { useApp } from '../../context/AppContext';

export function DetailNotFound({ projectId, onBack }) {
  const { t } = useApp();

  return (
    <div style={{
      padding: "120px 64px",
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      maxWidth: 800,
    }}>
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--accent)",
        marginBottom: 16,
      }}>
        404 · {t("project_not_found_title")}
      </div>
      <h1 style={{
        fontFamily: "var(--display)",
        fontSize: "clamp(36px, 5vw, 64px)",
        fontWeight: 500,
        margin: "0 0 24px",
        color: "var(--fg)",
      }}>
        &ldquo;{projectId}&rdquo;
      </h1>
      <p style={{
        fontSize: 18,
        color: "var(--fg-dim)",
        lineHeight: 1.6,
        margin: "0 0 40px",
      }}>
        {t("project_not_found_desc")}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="cv-cta primary"
        data-cursor="pointer"
      >
        ← {t("back_to_work")}
      </button>
    </div>
  );
}
