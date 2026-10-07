import { PROJECTS } from './portfolioData';

export const DETAILS = {
  smakosz: {
    project: PROJECTS.find(p => p.id === "smakosz"),
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
  },
  urlshortener: {
    project: PROJECTS.find(p => p.id === "urlshortener"),
    meta: {
      role:     { en: "Lead Architect",               pl: "Główny architekt" },
      timeline: { en: "Oct 2025 — Present",            pl: "Paź 2025 — Obecnie" },
      type:     { en: "Open Source Tool",             pl: "Narzędzie Open Source" },
      scale:    { en: "150k operations/sec",          pl: "150k operacji/sek" },
    },
    toc: {
      en: ["Overview", "The Challenge", "Architecture", "Distributed Caching", "Database & Scale", "Key Takeaways"],
      pl: ["Wstęp", "Wyzwanie", "Architektura", "Rozproszony Cache", "Baza danych i Skala", "Wnioski"],
    },
    blocks: {
      en: [
        { kind: "lead", text: "A high-performance distributed URL shortener system built with .NET Core and C#, designed to handle massive redirection traffic with sub-millisecond latencies using caching layers and distributed identifiers." },
        { kind: "h2", text: "The Challenge" },
        { kind: "p", text: "The primary challenge in a URL shortener is scale and speed. Short URLs must be resolved instantly, and generating short links must guarantee uniqueness across multiple instances without centralized bottleneck locks." },
        { kind: "h2", text: "Architecture" },
        { kind: "p", text: "The system is structured around Clean Architecture principles. It uses CQRS to separate read and write requests, allowing the read side (redirections) to scale independently from the write side (link generation)." },
        { kind: "code", lang: "csharp", text:
`public sealed class RedirectUrlQueryHandler 
    : IRequestHandler<RedirectUrlQuery, ShortUrlDto>
{
    private readonly IDistributedCache _cache;
    private readonly IUrlRepository _repo;
    // Fast path via Cache, slow path via DB
}` },
        { kind: "h2", text: "Distributed Caching" },
        { kind: "p", text: "Redis serves as the front line for redirections. We implement a bloom filter to intercept requests for non-existent short URLs, preventing cache-penetration attacks from hitting the database." },
        { kind: "h2", text: "Database & Scale" },
        { kind: "p", text: "PostgreSQL holds the source of truth. We shard the table by key hash and use a Snowflake-like distributed ID generator to generate short codes without coordinating locks." },
        { kind: "h2", text: "Key Takeaways" },
        { kind: "p", text: "Separating reads and writes allowed us to run the redirect path entirely in memory. Bloom filters saved up to 90% of database queries during spikes of invalid requests." },
      ],
      pl: [
        { kind: "lead", text: "Wysokowydajny, rozproszony system skracania adresów URL zbudowany w oparciu o .NET Core i C#. Zaprojektowany tak, aby obsługiwać masowy ruch przekierowań z opóźnieniami poniżej milisekundy dzięki warstwowemu cache'owaniu i rozproszonym identyfikatorom." },
        { kind: "h2", text: "Wyzwanie" },
        { kind: "p", text: "Głównym wyzwaniem w systemach skracania linków jest szybkość i spójność. Przekierowanie musi nastąpić natychmiastowo, a generowanie unikalnych krótkich kodów musi być bezkolizyjne w architekturze wielu instancji bez centralnego blokowania." },
        { kind: "h2", text: "Architektura" },
        { kind: "p", text: "Projekt opiera się na zasadach Czystej Architektury. Zastosowanie CQRS pozwoliło oddzielić zapytania (odczyt linków) od komend (tworzenie linków), co umożliwia niezależne skalowanie ścieżki krytycznej." },
        { kind: "code", lang: "csharp", text:
`public sealed class RedirectUrlQueryHandler 
    : IRequestHandler<RedirectUrlQuery, ShortUrlDto>
{
    private readonly IDistributedCache _cache;
    private readonly IUrlRepository _repo;
    // Szybka ścieżka przez Cache, wolna przez DB
}` },
        { kind: "h2", text: "Rozproszony Cache" },
        { kind: "p", text: "Redis stanowi pierwszą linię obrony. Zaimplementowaliśmy filtr Blooma na poziomie pamięci podręcznej, aby natychmiast odrzucać zapytania o nieistniejące kody, zapobiegając przeciążeniu bazy danych PostgreSQL (Cache-Penetration)." },
        { kind: "h2", text: "Baza danych i Skala" },
        { kind: "p", text: "PostgreSQL przechowuje dane źródłowe. Zastosowaliśmy partycjonowanie tabel oraz generator unikalnych identyfikatorów wzorowany na algorytmie Snowflake firmy Twitter, co eliminuje potrzebę blokad w bazie." },
        { kind: "h2", text: "Wnioski" },
        { kind: "p", text: "Rozdzielenie ruchu odczytu i zapisu pozwoliło utrzymać stałą wydajność ścieżki przekierowań. Zastosowanie filtrów Blooma zredukowało zapytania do bazy o 90% podczas symulowanych ataków DDoS." },
      ],
    },
  },
  "narzedzia-ai": {
    project: PROJECTS.find(p => p.id === "narzedzia-ai"),
    meta: {
      role:     { en: "Backend & ML Engineer",        pl: "Backend & ML Engineer" },
      timeline: { en: "May 2025 — Jul 2025",          pl: "Maj 2025 — Lip 2025" },
      type:     { en: "Automation System",            pl: "System automatyzacji" },
      scale:    { en: "50+ content pipelines",        pl: "50+ potoków przetwarzania" },
    },
    toc: {
      en: ["Overview", "Concept", "Pipeline Architecture", "ML Ingestion", "Monitoring", "Lessons"],
      pl: ["Wstęp", "Koncepcja", "Architektura Pipeline", "Przetwarzanie ML", "Monitoring", "Wnioski"],
    },
    blocks: {
      en: [
        { kind: "lead", text: "An automated data processing and prompt execution pipeline built with Python and GCP. It orchestrates text analysis, metadata enhancement, and ML-driven content generation pipelines in a serverless ecosystem." },
        { kind: "h2", text: "Concept" },
        { kind: "p", text: "The client wanted a system to ingest thousands of source articles, run complex prompts through LLMs, extract structured JSON, and perform sentiment classification using custom local PyTorch models." },
        { kind: "h2", text: "Pipeline Architecture" },
        { kind: "p", text: "The pipeline is event-driven. GCS buckets trigger Cloud Run instances that orchestrate task state using Google Cloud Tasks. The Python application coordinates tasks with Vertex AI APIs." },
        { kind: "code", lang: "python", text:
`def process_event(event, context):
    # Triggered by Google Cloud Storage event
    data = extract_metadata(event)
    queue_task("analyze-sentiment", data)
    queue_task("generate-summary", data)` },
        { kind: "h2", text: "ML Ingestion" },
        { kind: "p", text: "We deploy custom PyTorch sentiment classifiers containerized inside Docker and exported to ONNX for fast inference. Vertex AI endpoints serve as fallback models during peak loads." },
        { kind: "h2", text: "Monitoring" },
        { kind: "p", text: "We log system execution metadata into BigQuery and display operation costs and success rates using Looker Studio. Slack webhooks notify the team immediately about failed pipeline steps." },
        { kind: "h2", text: "Lessons" },
        { kind: "p", text: "Serverless architectures excel at dynamic scaling but require strict timeout and retry policies. Using Cloud Tasks queues with exponential backoff resolved API rate-limit errors entirely." },
      ],
      pl: [
        { kind: "lead", text: "Zautomatyzowany potok przetwarzania danych i wykonywania promptów oparty na języku Python i GCP. Koordynuje analizę tekstu, uzupełnianie metadanych oraz generowanie treści przez modele ML w ekosystemie bezserwerowym." },
        { kind: "h2", text: "Koncepcja" },
        { kind: "p", text: "Cel polegał na pobieraniu tysięcy artykułów, wysyłaniu zaawansowanych zapytań do modeli LLM, wyodrębnianiu ustrukturyzowanych danych JSON oraz klasyfikacji sentymentu za pomocą lokalnych modeli PyTorch." },
        { kind: "h2", text: "Architektura Pipeline" },
        { kind: "p", text: "Całość opiera się na zdarzeniach (Event-driven). Zapisy w Cloud Storage wyzwalają kontenery Cloud Run, które rozdzielają zadania przy użyciu usługi Cloud Tasks. Aplikacja w Pythonie koordynuje zapytania do Vertex AI." },
        { kind: "code", lang: "python", text:
`def process_event(event, context):
    # Obsługa zdarzenia zapisu pliku
    data = extract_metadata(event)
    queue_task("analyze-sentiment", data)
    queue_task("generate-summary", data)` },
        { kind: "h2", text: "Przetwarzanie ML" },
        { kind: "p", text: "Lokalne klasyfikatory PyTorch zostały spakowane do kontenerów Docker i wyeksportowane do formatu ONNX, aby zmaksymalizować szybkość działania i ograniczyć koszty chmury." },
        { kind: "h2", text: "Monitoring" },
        { kind: "p", text: "Metadane wykonania potoków zapisujemy do bazy BigQuery. Dashboard w Looker Studio wizualizuje koszty zapytań do API oraz wskaźniki błędów. Alerty o awariach są wysyłane bezpośrednio na Slacka." },
        { kind: "h2", text: "Wnioski" },
        { kind: "p", text: "Bezserwerowość (Serverless) doskonale sprawdza się przy zmiennym natężeniu ruchu, ale wymaga precyzyjnych mechanizmów ponawiania prób (retry policy). Zastosowanie Cloud Tasks z wykładniczym opóźnieniem rozwiązało błędy przekroczenia limitów zapytań API." },
      ],
    },
  },
  audiomaster: {
    project: PROJECTS.find(p => p.id === "audiomaster"),
    meta: {
      role:     { en: "Developer & Audio Engineer",  pl: "Programista i akustyk" },
      timeline: { en: "Jan 2025 — Apr 2025",          pl: "Sty 2025 — Kwi 2025" },
      type:     { en: "Desktop & Web Application",    pl: "Aplikacja desktopowa i web" },
      scale:    { en: "Cross-platform application",   pl: "Aplikacja wieloplatformowa" },
    },
    toc: {
      en: ["Overview", "Audio Processing", "Interface", "ONNX Speech Model", "Performance & Lessons"],
      pl: ["Wstęp", "Przetwarzanie audio", "Interfejs", "Model mowy ONNX", "Wydajność i wnioski"],
    },
    blocks: {
      en: [
        { kind: "lead", text: "A cross-platform mastering and audio enhancement tool featuring a PyQt desktop interface, Python-based digital signal processing, and integrated deep learning noise reduction models." },
        { kind: "h2", text: "Audio Processing" },
        { kind: "p", text: "AudioMaster processes WAV and MP3 files. It performs loudness normalization according to EBU R128 standards, multi-band compression, and frequency spectrum analysis using fast Fourier transforms." },
        { kind: "h2", text: "Interface" },
        { kind: "p", text: "The desktop client is written in Python using PyQt6. It displays real-time waveform visualization, spectrogram graphs using matplotlib, and offers knobs to fine-tune compression levels." },
        { kind: "code", lang: "python", text:
`class AudioProcessor:
    def process_file(self, input_path):
        data, rate = soundfile.read(input_path)
        normalized = r128_normalize(data, rate)
        return apply_onnx_model(normalized)` },
        { kind: "h2", text: "ONNX Speech Model" },
        { kind: "p", text: "We integrated a deep learning speech enhancement model. The PyTorch model is converted to ONNX and runs locally on CPU using ONNX Runtime, removing room reverb and low-frequency hiss instantly." },
        { kind: "h2", text: "Performance & Lessons" },
        { kind: "p", text: "Python is slow for sample-by-sample audio loops, so we vectorized all calculations using NumPy and SciPy. This improved audio rendering speeds by over 50x, enabling near-instantaneous processing." },
      ],
      pl: [
        { kind: "lead", text: "Wieloplatformowe narzędzie do masteringu i ulepszania dźwięku. Posiada interfejs graficzny w PyQt, silnik przetwarzania sygnałów cyfrowych w Pythonie oraz wbudowane modele głębokiego uczenia do redukcji szumów." },
        { kind: "h2", text: "Przetwarzanie audio" },
        { kind: "p", text: "AudioMaster analizuje pliki WAV i MP3. Aplikacja wykonuje normalizację głośności zgodnie ze standardem EBU R128, kompresję wielopasmową oraz rysuje wykresy częstotliwości za pomocą szybkiej transformacji Fouriera (FFT)." },
        { kind: "h2", text: "Interfejs" },
        { kind: "p", text: "Klient desktopowy został napisany w Pythonie przy użyciu PyQt6. Wyświetla wizualizację fali dźwiękowej na żywo oraz spektrogram za pomocą biblioteki matplotlib, oferując pokrętła do regulacji kompresji." },
        { kind: "code", lang: "python", text:
`class AudioProcessor:
    def process_file(self, input_path):
        data, rate = soundfile.read(input_path)
        normalized = r128_normalize(data, rate)
        return apply_onnx_model(normalized)` },
        { kind: "h2", text: "Model mowy ONNX" },
        { kind: "p", text: "Zintegrowaliśmy model usuwania szumów oparty na sieciach neuronowych. Model z PyTorcha został wyeksportowany do ONNX i działa lokalnie na CPU za pomocą ONNX Runtime, eliminując pogłos i szumy mowy." },
        { kind: "h2", text: "Wydajność i wnioski" },
        { kind: "p", text: "Operacje na pojedynczych próbkach dźwięku w czystym Pythonie były zbyt wolne. Przeniesienie obliczeń na wektoryzowane operacje w NumPy i SciPy przyspieszyło renderowanie ponad 50-krotnie, dając natychmiastowy wynik." },
      ],
    },
  },
};
