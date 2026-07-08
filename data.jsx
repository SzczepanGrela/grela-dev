// Shared data: projects, skills, experience, i18n strings.
// Tagged with categories so filter UI can group them.

const TAG_CATEGORIES = {
  language:  { en: "Languages",  pl: "Języki" },
  framework: { en: "Frameworks", pl: "Frameworki" },
  concept:   { en: "Concepts",   pl: "Koncepcje" },
  database:  { en: "Storage",    pl: "Bazy danych" },
  tool:      { en: "Tools",      pl: "Narzędzia" },
  practice:  { en: "Practices",  pl: "Praktyki" },
};

// Tag registry — id -> {label, category}
const TAGS = {
  // languages
  csharp:    { label: "C#",         cat: "language" },
  python:    { label: "Python",     cat: "language" },
  typescript:{ label: "TypeScript", cat: "language" },
  sql:       { label: "SQL",        cat: "language" },

  // frameworks
  dotnet:    { label: ".NET",            cat: "framework" },
  aspnet:    { label: "ASP.NET Core",    cat: "framework" },
  blazor:    { label: "Blazor",          cat: "framework" },
  efcore:    { label: "Entity Framework",cat: "framework" },
  mediatr:   { label: "MediatR",         cat: "framework" },
  pytorch:   { label: "PyTorch",         cat: "framework" },
  pyqt:      { label: "PyQt",            cat: "framework" },
  hangfire:  { label: "Hangfire",        cat: "framework" },

  // concepts
  cleanArch: { label: "Clean Architecture",        cat: "concept" },
  cqrs:      { label: "CQRS",                      cat: "concept" },
  microsvc:  { label: "Microservices",             cat: "concept" },
  rest:      { label: "REST API",                  cat: "concept" },
  ml:        { label: "Machine Learning",          cat: "concept" },
  ncf:       { label: "Neural Collaborative Filtering", cat: "concept" },
  collab:    { label: "Collaborative Filtering",   cat: "concept" },
  genai:     { label: "Generative AI",             cat: "concept" },
  llm:       { label: "LLM",                       cat: "concept" },
  pipeline:  { label: "Pipeline Architecture",     cat: "concept" },
  pseo:      { label: "Programmatic SEO",          cat: "concept" },
  rateLimit: { label: "Rate Limiting",             cat: "concept" },
  caching:   { label: "Caching",                   cat: "concept" },
  geo:       { label: "GeoLocation",               cat: "concept" },
  twofa:     { label: "2FA",                       cat: "concept" },
  multithread:{ label: "Multithreading",           cat: "concept" },
  audio:     { label: "Audio Processing",          cat: "concept" },
  desktop:   { label: "Desktop App",               cat: "concept" },

  // storage
  postgres:  { label: "PostgreSQL", cat: "database" },
  r2:        { label: "Cloudflare R2", cat: "database" },

  // tools
  docker:    { label: "Docker",        cat: "tool" },
  grafana:   { label: "Grafana",       cat: "tool" },
  prometheus:{ label: "Prometheus",    cat: "tool" },
  gha:       { label: "GitHub Actions",cat: "tool" },
  onnx:      { label: "ONNX",          cat: "tool" },
  ffmpeg:    { label: "ffmpeg",        cat: "tool" },
  gcp:       { label: "GCP",           cat: "tool" },
  vertex:    { label: "Vertex AI",     cat: "tool" },

  // practices
  cicd:        { label: "CI/CD",               cat: "practice" },
  unitTest:    { label: "Unit Testing",        cat: "practice" },
  intTest:     { label: "Integration Testing", cat: "practice" },
  loadTest:    { label: "Load Testing",        cat: "practice" },
  contentGen:  { label: "Content Generation",  cat: "practice" },
  automation:  { label: "Automation",          cat: "practice" },
};

const PROJECTS = [
  {
    id: "smakosz",
    name: "SmakoszWebApp",
    year: "2025",
    status: "live", // live | repo | private
    summary: {
      en: "Restaurant & dish review platform with a Neural Collaborative Filtering recommender. Clean Architecture backend with CQRS; a separate GPU worker trains an NCF model in PyTorch, exports to ONNX, and ships it to Cloudflare R2.",
      pl: "Platforma recenzji restauracji i dań z silnikiem rekomendacji opartym na Neural Collaborative Filtering. Backend w Clean Architecture z CQRS; osobny GPU worker trenuje model NCF w PyTorch, eksportuje do ONNX i wysyła do Cloudflare R2.",
    },
    blurb: {
      en: "Content moderation, 2FA, push notifications, full monitoring, automatic CI/CD.",
      pl: "Moderacja treści, 2FA, powiadomienia push, pełny monitoring, automatyczny CI/CD.",
    },
    tags: ["csharp","dotnet","aspnet","blazor","cleanArch","cqrs","mediatr","python","pytorch","ncf","ml","onnx","collab","r2","hangfire","docker","grafana","prometheus","gha","cicd","twofa","rest","unitTest"],
    links: { live: "#", repo: "#" },
    accent: "lime",
  },
  {
    id: "urlshortener",
    name: "UrlShortenerSystem",
    year: "2025",
    status: "repo",
    summary: {
      en: "Distributed URL shortener with a separate analytics microservice tracking clicks with geolocation. Rate limiting, caching, integration tests, and load tests.",
      pl: "Rozproszony system skracania linków z osobnym mikroserwisem analitycznym śledzącym kliknięcia z geolokalizacją. Rate limiting, caching, testy integracyjne i load tests.",
    },
    blurb: {
      en: "URL Shortener and Analytics cleanly split as independent services with shared cross-cutting layers.",
      pl: "URL Shortener i Analytics rozdzielone jako niezależne serwisy ze wspólnymi warstwami cross-cutting.",
    },
    tags: ["csharp","dotnet","aspnet","microsvc","rest","rateLimit","caching","geo","efcore","intTest","loadTest","cleanArch"],
    links: { repo: "#" },
    accent: "amber",
  },
  {
    id: "narzedzia-ai",
    name: "narzedzia-ai-pipeline",
    year: "2024",
    status: "private",
    summary: {
      en: "Automatic programmatic-SEO pipeline — generates 500 landing pages per profession for narzedzia-ai.pl using GCP Vertex AI for bulk content generation.",
      pl: "Automatyczny pipeline do programmatycznego SEO — generuje 500 landing pages per profesja dla narzedzia-ai.pl, używając GCP Vertex AI do masowej generacji treści.",
    },
    blurb: {
      en: "Bulk LLM-driven content generation pipeline.",
      pl: "Masowa generacja treści sterowana przez LLM.",
    },
    tags: ["python","gcp","vertex","genai","pseo","contentGen","automation","llm"],
    links: { live: "https://narzedzia-ai.pl" },
    accent: "violet",
  },
  {
    id: "audiomaster",
    name: "AudioMaster",
    year: "2024",
    status: "repo",
    summary: {
      en: "Desktop audio processing app with a graphical UI. Pipeline architecture with chunked processing, layer separation (IO, processing, widgets), and configurable steps via ffmpeg.",
      pl: "Desktopowa aplikacja do przetwarzania audio z GUI. Architektura pipeline z chunked processingiem, separacją warstw (IO, processing, widgets) i konfigurowalnymi krokami przez ffmpeg.",
    },
    blurb: {
      en: "Configurable ffmpeg-driven processing pipeline.",
      pl: "Konfigurowalny pipeline przetwarzania oparty o ffmpeg.",
    },
    tags: ["python","pyqt","ffmpeg","audio","desktop","pipeline","multithread"],
    links: { repo: "#" },
    accent: "rose",
  },
  // Placeholders to round out to 7 projects
  {
    id: "placeholder-1",
    name: "infra-as-code-lab",
    year: "2024",
    status: "repo",
    summary: {
      en: "Personal homelab automation: declarative provisioning of services across two Linux nodes, tracked in Git with reproducible builds.",
      pl: "Automatyzacja domowego homelabu: deklaratywne provisioning usług na dwóch węzłach Linux, śledzone w Git z reprodukowalnymi buildami.",
    },
    blurb: {
      en: "Reproducible self-hosted services.",
      pl: "Reprodukowalne self-hosted usługi.",
    },
    tags: ["docker","cicd","gha","automation"],
    links: { repo: "#" },
    accent: "cyan",
    placeholder: true,
  },
  {
    id: "placeholder-2",
    name: "inverted-index-search",
    year: "2023",
    status: "repo",
    summary: {
      en: "From-scratch full-text search service exploring a Generalized Inverted Index built on PostgreSQL, with a small REST surface for benchmarking.",
      pl: "Od zera napisany serwis pełnotekstowy badający Generalized Inverted Index zbudowany na PostgreSQL, z niewielkim REST do benchmarków.",
    },
    blurb: {
      en: "GIN-backed full-text search benchmarks.",
      pl: "Benchmarki full-text search opartego o GIN.",
    },
    tags: ["csharp","dotnet","postgres","sql","rest","efcore"],
    links: { repo: "#" },
    accent: "amber",
    placeholder: true,
  },
  {
    id: "placeholder-3",
    name: "auth-playground",
    year: "2023",
    status: "repo",
    summary: {
      en: "Compact reference implementation of JWT-based auth with refresh rotation, rate limiting, and a typed TS client. Used as a teaching artefact.",
      pl: "Zwarta implementacja referencyjna autoryzacji JWT z rotacją refresh, rate limiting i typowanym klientem TS. Używana jako materiał edukacyjny.",
    },
    blurb: {
      en: "JWT auth with refresh rotation.",
      pl: "JWT z rotacją refresh.",
    },
    tags: ["csharp","aspnet","typescript","rest","rateLimit","unitTest"],
    links: { repo: "#" },
    accent: "lime",
    placeholder: true,
  },
];

// CV / experience
const EXPERIENCE = [
  {
    period: "2024 — 2025",
    role: { en: "Engineering thesis & independent projects", pl: "Praca inżynierska i projekty własne" },
    org:  { en: "Self-directed",                              pl: "Działalność własna" },
    desc: {
      en: "Built SmakoszWebApp end-to-end: backend, ML training pipeline, model serving, monitoring, deployment.",
      pl: "Zbudowałem SmakoszWebApp end-to-end: backend, pipeline trenowania ML, serwowanie modelu, monitoring, deployment.",
    },
  },
  {
    period: "2023 — 2024",
    role: { en: "Backend & systems projects",  pl: "Projekty backend i systemowe" },
    org:  { en: "Self-directed",               pl: "Działalność własna" },
    desc: {
      en: "Microservice architectures, distributed systems patterns, integration & load testing — UrlShortenerSystem and supporting work.",
      pl: "Architektury mikroserwisowe, wzorce systemów rozproszonych, testy integracyjne i obciążeniowe — UrlShortenerSystem i prace pokrewne.",
    },
  },
  {
    period: "2021 — 2025",
    role: { en: "BSc, Computer Science",          pl: "Inż. Informatyki" },
    org:  { en: "University",                     pl: "Studia inżynierskie" },
    desc: {
      en: "Algorithms, distributed systems, databases, ML foundations.",
      pl: "Algorytmy, systemy rozproszone, bazy danych, podstawy ML.",
    },
  },
];

// Skills, grouped
const SKILLS = [
  { group: { en: "Backend",  pl: "Backend" },  items: [".NET", "ASP.NET Core", "Python", "REST", "PostgreSQL", "Entity Framework"] },
  { group: { en: "ML / Data", pl: "ML / Data" }, items: ["PyTorch", "ONNX", "Vertex AI", "Collaborative Filtering"] },
  { group: { en: "DevOps",   pl: "DevOps" },   items: ["Docker", "GitHub Actions", "Grafana", "Prometheus", "Cloudflare R2"] },
  { group: { en: "Frontend", pl: "Frontend" }, items: ["Blazor", "TypeScript", "HTML / CSS"] },
  { group: { en: "Practices",pl: "Praktyki" },items: ["Clean Architecture", "CQRS", "Microservices", "Unit / Integration / Load Testing", "CI/CD"] },
];

// i18n strings for shared chrome
const I18N = {
  en: {
    nav_work: "Work",
    nav_skills: "Skills",
    nav_about: "About",
    nav_contact: "Contact",
    hero_kicker: "Software engineer",
    hero_title_a: "I build",
    hero_title_b: "backends, pipelines, and the occasional UI.",
    hero_sub: "Computer science graduate working across backend, DevOps, and ML — comfortable enough on the frontend to ship the whole thing.",
    hero_status: "Open to first commercial role",
    section_work: "Selected work",
    section_work_sub: "Seven projects, filterable by stack, concept, or tool.",
    section_skills: "Stack",
    section_about: "About",
    section_about_body_1: "CS graduate from Poland who likes systems with moving parts behind them — recommenders, distributed services, automation pipelines. Mostly <span style=\"color: var(--accent)\">C#</span> and <span style=\"color: var(--accent)\">Python</span> these days, with the curiosity to learn whatever the next project needs.",
    section_about_body_2: "Before code, I worked on the production line for jet-engine turbine blades — micrometre tolerances, written-down checks, no room for \"almost right.\" That habit moved into the way I work: tests, monitoring, CI/CD, and a deployed instance, even on side projects. Looking for a first commercial role where the same care is the baseline.",
    section_experience: "Experience",
    section_contact: "Get in touch",
    section_contact_sub: "Looking for a first commercial position. Open to backend, DevOps, or full-stack roles.",
    contact_email: "Email",
    contact_github: "GitHub",
    contact_linkedin: "LinkedIn",
    contact_cv: "Download CV",
    cv_pdf: "CV (PDF)",
    search_placeholder: "Search projects, tags, technologies…",
    filter_clear: "Clear filters",
    filter_active: "active",
    visit_site: "Visit live",
    view_repo: "View source",
    view_case: "Case study",
    private_repo: "Private",
    no_results: "No projects match these filters.",
    layout_label: "Layout",
    cursor_hint: "Move your cursor",
    selected: "selected",
  },
  pl: {
    nav_work: "Projekty",
    nav_skills: "Stack",
    nav_about: "O mnie",
    nav_contact: "Kontakt",
    hero_kicker: "Inżynier oprogramowania",
    hero_title_a: "Buduję",
    hero_title_b: "backendy, pipeline'y, czasem UI.",
    hero_sub: "Absolwent informatyki działający w backendzie, DevOps i ML — wystarczająco sprawnie we frontendzie, żeby dowieźć całość.",
    hero_status: "Otwarty na pierwszą rolę komercyjną",
    section_work: "Wybrane projekty",
    section_work_sub: "Siedem projektów, filtrowanych po stacku, koncepcji lub narzędziu.",
    section_skills: "Stack",
    section_about: "O mnie",
    section_about_body_1: "Absolwent informatyki z Polski, który lubi systemy z mechaniką pod spodem — rekomendery, usługi rozproszone, pipeline'y automatyzacyjne. Głównie <span style=\"color: var(--accent)\">C#</span> i <span style=\"color: var(--accent)\">Python</span>, z ciekawością do nauki tego, czego wymaga kolejny projekt.",
    section_about_body_2: "Zanim zacząłem pisać kod, pracowałem na linii produkcyjnej łopatek do silników lotniczych — tolerancje mikrometrowe, spisane checki, zero miejsca na \"prawie dobrze.\" Ten nawyk przeszedł do kodu: testy, monitoring, CI/CD i wdrożona instancja, nawet w side projektach. Szukam pierwszej roli komercyjnej, gdzie taka staranność jest standardem, nie wyjątkiem.",
    section_experience: "Doświadczenie",
    section_contact: "Kontakt",
    section_contact_sub: "Szukam pierwszej pracy komercyjnej. Otwarty na role backend, DevOps lub full-stack.",
    contact_email: "Email",
    contact_github: "GitHub",
    contact_linkedin: "LinkedIn",
    contact_cv: "Pobierz CV",
    cv_pdf: "CV (PDF)",
    search_placeholder: "Szukaj projektów, tagów, technologii…",
    filter_clear: "Wyczyść filtry",
    filter_active: "aktywnych",
    visit_site: "Live",
    view_repo: "Kod źródłowy",
    view_case: "Case study",
    private_repo: "Prywatne",
    no_results: "Żaden projekt nie pasuje do tych filtrów.",
    layout_label: "Layout",
    cursor_hint: "Porusz kursorem",
    selected: "zaznaczonych",
  },
};

Object.assign(window, { TAGS, TAG_CATEGORIES, PROJECTS, EXPERIENCE, SKILLS, I18N });
