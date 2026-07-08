// Project detail page — four narrative directions for SmakoszWebApp.
// All share project data + placeholder visuals; differ in layout/IA.

const { useState: usePd, useEffect: usePde } = React;

// Sample content for SmakoszWebApp — realistic structure, easy to replace.
// Each "block" is one paragraph or visual. Different layouts pick what to show.
const DETAIL = {
  project: window.PROJECTS.find(p => p.id === "smakosz"),
  meta: {
    role:     { en: "Solo · end-to-end",            pl: "Solo · end-to-end" },
    timeline: { en: "Sep 2024 — Jun 2025",          pl: "Wrz 2024 — Cze 2025" },
    type:     { en: "Engineering thesis",           pl: "Praca inżynierska" },
    scale:    { en: "~12k users (synthetic)",       pl: "~12k użytkowników (syntetycznych)" },
  },
  toc: {
    en: ["Overview", "Problem", "Architecture", "Recommender", "Infra & monitoring", "Lessons"],
    pl: ["Wstęp", "Problem", "Architektura", "Rekomender", "Infra i monitoring", "Wnioski"],
  },
  // long-form blocks; mixed text + visuals. Every block is independent.
  blocks: {
    en: [
      { kind: "lead", text: "SmakoszWebApp is a restaurant and dish review platform built around a recommender engine. The interesting part isn't the CRUD — it's that the recommender is a Neural Collaborative Filtering model trained on a separate GPU worker, exported to ONNX, and served back to the API behind a thin inference layer." },
      { kind: "h2", text: "Problem" },
      { kind: "p", text: "Most review apps lean on coarse signals — average ratings, recency, geography. That's fine for tail content but flattens taste. The goal here was to model the latent space of users and dishes well enough that two people with overlapping but non-identical preferences get distinct, useful suggestions." },
      { kind: "p", text: "The constraint: I'm one person. So the architecture had to keep the ML side strictly out of the request path, and any retraining had to be triggerable without redeploying the API." },
      { kind: "fig", caption: "Logical view: API and ML training are independent processes joined by R2 + ONNX." },
      { kind: "h2", text: "Architecture" },
      { kind: "p", text: "The backend follows Clean Architecture with CQRS via MediatR. Commands and queries are explicit, application logic is thin, and infrastructure is pluggable — the inference adapter can be swapped between local ONNX, remote ONNX-Runtime-Web, or a heuristics fallback." },
      { kind: "code", lang: "csharp", text:
`public sealed record GetRecommendationsQuery(Guid UserId, int Take)
    : IRequest<IReadOnlyList<DishRecommendation>>;

public sealed class GetRecommendationsHandler
    : IRequestHandler<GetRecommendationsQuery, IReadOnlyList<DishRecommendation>>
{
    private readonly IRecommenderInference _inf;
    // ...
}` },
      { kind: "p", text: "Hangfire handles background work — moderation queue, push fan-out, periodic rating snapshots. Nothing in the request path waits on it." },
      { kind: "h2", text: "Recommender" },
      { kind: "p", text: "The model is a small NCF: user and item embeddings concatenated and fed through an MLP. Training runs on a separate worker with a CUDA-capable GPU, reading interactions from a dedicated read replica. Once a checkpoint passes a hold-out NDCG threshold, the worker exports it to ONNX and uploads to Cloudflare R2 with a content-addressed key." },
      { kind: "fig", caption: "Training loop: Postgres → PyTorch worker → ONNX → R2 → API." },
      { kind: "p", text: "The API polls R2 for new keys and hot-swaps the inference session. Rollback is just \"point at the previous key\". No deploys involved." },
      { kind: "h2", text: "Infra & monitoring" },
      { kind: "p", text: "Everything runs in Docker. Prometheus scrapes both the API and the GPU worker; a small Grafana dashboard surfaces request latency, recommender hit-rate, and training-job status side by side. CI/CD is GitHub Actions: build, test, push image, redeploy via SSH on tag." },
      { kind: "fig", caption: "Grafana: request latency vs. recommender hit-rate over a 24h window." },
      { kind: "h2", text: "Lessons" },
      { kind: "p", text: "Splitting ML training from serving was the right call — it stayed cheap to iterate, and a bad checkpoint never broke the API. The cost: I spent more time on the training-side ergonomics (dataset versioning, evaluation harness) than I expected. Worth it." },
      { kind: "p", text: "If I were starting over I'd reach for a managed feature store earlier rather than rolling my own snapshotting; the rest holds up." },
    ],
    pl: [
      { kind: "lead", text: "SmakoszWebApp to platforma recenzji restauracji i dań zbudowana wokół silnika rekomendacji. Ciekawa nie jest część CRUD — tylko to, że rekomender to model Neural Collaborative Filtering trenowany na osobnym GPU workerze, eksportowany do ONNX i serwowany z powrotem do API przez cienką warstwę inferencji." },
      { kind: "h2", text: "Problem" },
      { kind: "p", text: "Większość aplikacji recenzenckich opiera się na sygnałach gruboziarnistych — średnia ocen, świeżość, geografia. To wystarcza dla treści ogonowej, ale spłaszcza gust. Celem było wymodelowanie przestrzeni latentnej użytkowników i dań na tyle dobrze, by dwie osoby o nakładających się, ale niedokładnie tych samych preferencjach dostawały różne, sensowne propozycje." },
      { kind: "p", text: "Ograniczenie: jestem jedną osobą. Więc architektura musiała trzymać ML strict poza ścieżką requestu, a retreningi musiały być uruchamialne bez redeploya API." },
      { kind: "fig", caption: "Widok logiczny: API i trening ML to niezależne procesy spięte przez R2 i ONNX." },
      { kind: "h2", text: "Architektura" },
      { kind: "p", text: "Backend trzyma się Clean Architecture z CQRS przez MediatR. Komendy i zapytania są jawne, logika aplikacji jest cienka, a infrastruktura jest pluggable — adapter inferencji można podmienić między lokalnym ONNX, zdalnym ONNX-Runtime-Web a fallbackiem heurystycznym." },
      { kind: "code", lang: "csharp", text:
`public sealed record GetRecommendationsQuery(Guid UserId, int Take)
    : IRequest<IReadOnlyList<DishRecommendation>>;

public sealed class GetRecommendationsHandler
    : IRequestHandler<GetRecommendationsQuery, IReadOnlyList<DishRecommendation>>
{
    private readonly IRecommenderInference _inf;
    // ...
}` },
      { kind: "p", text: "Hangfire ogarnia robotę w tle — kolejka moderacji, fan-out powiadomień, okresowe snapshoty ocen. Nic na ścieżce requestu na to nie czeka." },
      { kind: "h2", text: "Rekomender" },
      { kind: "p", text: "Model to małe NCF: embeddingi użytkownika i itemu konkatenowane i puszczone przez MLP. Trening idzie na osobnym workerze z CUDA, czytając interakcje z dedykowanej repliki odczytu. Gdy checkpoint przebije próg NDCG na hold-oucie, worker eksportuje go do ONNX i wrzuca do Cloudflare R2 z kluczem content-addressed." },
      { kind: "fig", caption: "Pętla treningowa: Postgres → worker PyTorch → ONNX → R2 → API." },
      { kind: "p", text: "API odpytuje R2 o nowe klucze i hot-swapuje sesję inferencji. Rollback to po prostu \"wskaż na poprzedni klucz\". Bez deploya." },
      { kind: "h2", text: "Infra i monitoring" },
      { kind: "p", text: "Całość chodzi w Dockerze. Prometheus scrapuje API i workera GPU; mały dashboard w Grafanie pokazuje latency requestów, hit-rate rekomendera i status zadań treningowych obok siebie. CI/CD to GitHub Actions: build, testy, push image, redeploy po tagu przez SSH." },
      { kind: "fig", caption: "Grafana: latency requestów vs. hit-rate rekomendera w oknie 24h." },
      { kind: "h2", text: "Wnioski" },
      { kind: "p", text: "Rozdzielenie treningu i serwowania ML było dobrą decyzją — iteracje pozostały tanie, a zły checkpoint nigdy nie wywalił API. Koszt: spędziłem więcej czasu na ergonomii treningu (wersjonowanie datasetów, harness ewaluacji) niż się spodziewałem. Warto." },
      { kind: "p", text: "Gdybym zaczynał od zera, sięgnąłbym po gotowy feature store wcześniej, zamiast pisać własne snapshotowanie; reszta się broni." },
    ],
  },
};

// =================== Shared atomic blocks ===================
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

// Hero strip — used as page top in all variants
function DetailHero({ project, compact = false }) {
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
        <a href="#" data-cursor="pointer" style={{ color: "var(--fg-dim)", textDecoration: "none" }}>← {t("nav_work")}</a>
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

// Action links — used in all variants in some shape
function DetailLinks({ project, vertical = false }) {
  const { t } = useApp();
  const items = [
    project.links.live ? { label: t("visit_site"), href: project.links.live, primary: true } : null,
    project.links.repo ? { label: t("view_repo"), href: project.links.repo } : null,
    { label: "Documentation", href: "#" },
  ].filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 8, flexWrap: "wrap" }}>
      {items.map((l, i) => (
        <a key={i} href={l.href} data-cursor="pointer" style={{
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: l.primary ? "var(--bg)" : "var(--fg)",
          background: l.primary ? "var(--accent)" : "transparent",
          border: "1px solid " + (l.primary ? "var(--accent)" : "var(--border)"),
          padding: "10px 14px", borderRadius: 8, textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 8,
          justifyContent: vertical ? "space-between" : "flex-start",
        }}>
          {l.label} <span style={{ opacity: 0.7 }}>↗</span>
        </a>
      ))}
    </div>
  );
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

// =================== VARIANT 1: EDITORIAL / BLOG ===================
function DetailEditorial() {
  const { lang, t } = useApp();
  const { project, blocks, toc, meta } = DETAIL;

  return (
    <>
      <DetailHero project={project} />
      {/* meta strip */}
      <div style={{
        padding: "24px 64px", borderBottom: "1px solid var(--border)",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 32, alignItems: "center",
      }}>
        <MetaPair label={t("section_experience")} value={meta.role[lang]} />
        <MetaPair label="Timeline" value={meta.timeline[lang]} />
        <MetaPair label="Context"  value={meta.type[lang]} />
        <MetaPair label="Scale"    value={meta.scale[lang]} />
        <DetailLinks project={project} />
      </div>

      {/* body: TOC + article */}
      <div style={{
        padding: "80px 64px 120px",
        display: "grid", gridTemplateColumns: "200px 1fr",
        gap: 64, alignItems: "start",
        borderBottom: "1px solid var(--border)",
      }}>
        <aside style={{ position: "sticky", top: 100 }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 16,
          }}>Contents</div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {toc[lang].map((t, i) => (
              <li key={i}>
                <a href={`#sec-${i}`} data-cursor="pointer" style={{
                  fontFamily: "var(--mono)", fontSize: 12,
                  color: "var(--fg-dim)", textDecoration: "none",
                  display: "flex", gap: 12, alignItems: "baseline",
                }}>
                  <span style={{ color: "var(--accent)" }}>{String(i+1).padStart(2,"0")}</span>
                  {t}
                </a>
              </li>
            ))}
          </ol>
          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--fg-dim)",
            }}>Stack</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {project.tags.slice(0, 12).map(id => <TagChip key={id} id={id} small />)}
            </div>
          </div>
        </aside>
        <article>
          {blocks[lang].map(renderBlock)}
        </article>
      </div>
    </>
  );
}

// =================== VARIANT 2: STICKY SPLIT (case-study) ===================
function DetailSplit() {
  const { lang, t } = useApp();
  const { project, blocks, meta } = DETAIL;

  return (
    <>
      <DetailHero project={project} compact />
      <div style={{
        padding: "0 64px 120px",
        display: "grid", gridTemplateColumns: "320px 1fr",
        gap: 64, alignItems: "start",
        borderBottom: "1px solid var(--border)",
      }}>
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

// =================== VARIANT 3: NOTEBOOK / DEV LOG ===================
function DetailNotebook() {
  const { lang, t } = useApp();
  const { project, blocks, toc, meta } = DETAIL;

  // Group blocks by h2 sections; first chunk before any h2 = "00 Overview"
  const sections = useTm(() => {
    const out = [];
    let cur = { title: toc[lang][0], items: [] };
    blocks[lang].forEach(b => {
      if (b.kind === "h2") {
        if (cur.items.length) out.push(cur);
        cur = { title: b.text, items: [] };
      } else {
        cur.items.push(b);
      }
    });
    if (cur.items.length) out.push(cur);
    return out;
  }, [lang]);

  return (
    <>
      <DetailHero project={project} compact />
      <div style={{
        padding: "20px 64px",
        borderBottom: "1px solid var(--border)",
        display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {project.tags.slice(0, 14).map(id => <TagChip key={id} id={id} small />)}
        </div>
        <DetailLinks project={project} />
      </div>
      <div style={{ padding: "64px 64px 120px" }}>
        {sections.map((s, si) => (
          <section key={si} style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: 48,
            padding: "48px 0",
            borderTop: si === 0 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 13,
              color: "var(--accent)", letterSpacing: "0.08em",
              position: "sticky", top: 100, alignSelf: "start",
            }}>
              <div>{String(si).padStart(2, "0")}</div>
              <div style={{ color: "var(--fg)", marginTop: 6 }}>{s.title}</div>
            </div>
            <div>
              {s.items.map(renderBlock)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

const { useMemo: useTm } = React;

// =================== VARIANT 4: SPEC CARD + NARRATIVE ===================
function DetailSpec() {
  const { lang, t } = useApp();
  const { project, blocks, meta } = DETAIL;

  const Stat = ({ k, v }) => (
    <div style={{
      padding: 18,
      border: "1px solid var(--border)", borderRadius: 10,
      background: "var(--bg)",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 10,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--fg-dim)",
      }}>{k}</span>
      <span style={{
        fontFamily: "var(--display)", fontSize: 22,
        letterSpacing: "-0.015em", color: "var(--fg)", lineHeight: 1.1,
      }}>{v}</span>
    </div>
  );

  return (
    <>
      <DetailHero project={project} compact />

      {/* spec card */}
      <div style={{ padding: "32px 64px 40px", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          padding: 28,
          background: "var(--bg-elev)",
          border: "1px solid var(--border)", borderRadius: 14,
          display: "grid", gap: 24,
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
          }}>
            <Stat k="Role" v={meta.role[lang]} />
            <Stat k="Timeline" v={meta.timeline[lang]} />
            <Stat k="Context" v={meta.type[lang]} />
            <Stat k="Scale" v={meta.scale[lang]} />
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto", gap: 24,
            alignItems: "center",
            paddingTop: 20, borderTop: "1px solid var(--border)",
          }}>
            <div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 10,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--fg-dim)", marginBottom: 10,
              }}>Stack</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {project.tags.map(id => <TagChip key={id} id={id} small />)}
              </div>
            </div>
            <DetailLinks project={project} />
          </div>
        </div>
      </div>

      {/* narrative */}
      <div style={{ padding: "80px 64px 120px", maxWidth: 880, margin: "0 auto" }}>
        <article>
          {blocks[lang].map(renderBlock)}
        </article>
      </div>
    </>
  );
}

Object.assign(window, {
  DetailEditorial, DetailSplit, DetailNotebook, DetailSpec, DETAIL,
});
