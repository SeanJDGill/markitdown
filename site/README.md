# Teardown — a Built for Mars–style UX case-study site

An editorial, content-driven site for in-depth UX teardowns, in the style of
[builtformars.com](https://builtformars.com). Built with [Astro](https://astro.build)
(static-first), Tailwind CSS v4, and Markdown/MDX content collections.

> This lives in its own subdirectory inside the `markitdown` repo and is fully
> self-contained — it shares nothing with the Python packages.

## Content types

Modeled on the real Built for Mars taxonomy:

| Collection    | What it is                           | Location                   |
| ------------- | ------------------------------------ | -------------------------- |
| `caseStudies` | Deep, long-form product teardowns    | `src/content/caseStudies/` |
| `uxBites`     | Short, single-insight UX examples    | `src/content/uxBites/`     |
| `cheatsheets` | Practical decision aids / checklists | `src/content/cheatsheets/` |
| `tooltips`    | UX glossary term definitions         | `src/content/tooltips/`    |

Schemas (with validation) live in `src/content.config.ts`.

## Develop

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:4321
npm run build      # type-checks + validates content, outputs ./dist
npm run preview    # serve the production build
```

## Authoring a case study

Add an `.mdx` file to `src/content/caseStudies/`. Frontmatter is validated against the
schema; `readingTime` is computed automatically. Inside the body you can use the article
building blocks:

```mdx
import Screenshot from '../../components/article/Screenshot.astro';
import Insight from '../../components/article/Insight.astro';
import PullQuote from '../../components/article/PullQuote.astro';

<Screenshot src="/placeholders/screen-a.svg" alt="…" caption="…" number={1} />
<Insight number={1} title="Key lesson">The takeaway.</Insight>
<PullQuote cite="Source">A memorable line.</PullQuote>
```

## Images

Imagery is currently **placeholder SVG art** in `public/heroes/`, `public/bites/` and
`public/placeholders/`. Hero/bite images are referenced by string path (frontmatter
`heroImage` / `image`), so replacing them with real screenshots — or pointing them at a
CDN/CMS URL — needs **no code change**.

## Swapping in a headless CMS later

No page or component imports `astro:content` directly. All content is read through the
data layer:

- `src/data/types.ts` — source-agnostic domain types.
- `src/data/content.ts` — the public API (`getAllCaseStudies()`, etc.).
- `src/data/adapters/astroCollections.ts` — current implementation (Markdown/MDX).
- `src/data/adapters/cms.ts` — typed stub for a future CMS (Sanity/Contentful/…).

Implement `cms.ts` and set `CONTENT_SOURCE=cms` — pages and components stay untouched.

## Configuration

- Site name, nav, copy, social and the newsletter endpoint: `src/lib/site.ts`.
- Newsletter delivery: set `PUBLIC_NEWSLETTER_ENDPOINT` (the form runs in demo mode if unset).
- Production domain (for sitemap/RSS/canonical/OG): `SITE` in `astro.config.mjs`.

## SEO & feeds

- `src/components/Seo.astro` — meta, Open Graph, Twitter cards, JSON-LD on articles.
- `@astrojs/sitemap` — auto `sitemap-index.xml` (referenced from `public/robots.txt`).
- `src/pages/rss.xml.ts` — RSS feed of case studies.
