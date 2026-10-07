# grela.dev

Personal portfolio and technical case studies of Szczepan Grela — Software Engineer focusing on backend systems in C#/.NET and Python, process automation, and practical ML integrations.

Built with Vite, React 18, self-hosted typography (Inter Tight & JetBrains Mono), and styled using custom OKLCH design tokens with accessibility and motion controls.

## Features

- **Static Production Site**: Pure static compilation via Vite, zero runtime Babel, zero CDN runtime dependencies.
- **Bilingual (PL / EN)**: Interactive language toggle with layout stability and responsive text balancing.
- **Theme Support**: High-contrast Dark and Light modes using modern OKLCH tokens and custom cursor tracking.
- **Faceted Project Filter**: Real-time multi-dimensional project filtering by domain, language, framework, and tool with dynamic zero-result dimming.
- **Interactive Deep Linking**: In-app hash routing (`#project-:id`) with fallback for invalid or missing project IDs.
- **Accessible & Motion-Safe**: WCAG AA color contrast, visible focus rings (`:focus-visible`), and `@media (prefers-reduced-motion)` suppression.

## Development

```bash
# Install locked dependencies
npm ci

# Start local development server
npm run dev

# Run unit and component test suite
npm test

# Run ESLint
npm run lint

# Compile static production bundle
npm run build

# Preview production build locally
npm run preview
```

## Architecture

- `src/data/`: Structured source of truth for projects, skills, experience, and multilingual copy.
- `src/context/`: Global application state (`AppContext`) for language, theme, and faceted filter selection.
- `src/components/`: Modular React components divided into layout, sections, filters, common widgets, and case study views.
- `src/styles/`: Theme tokens, bundled typography, responsive grid breakpoints, and motion accessibility.

## License

MIT License. Designed and maintained by Szczepan Grela.
