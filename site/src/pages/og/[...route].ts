import { OGImageRoute } from 'astro-og-canvas';
import { getAllCaseStudies, getAllUxBites } from '../../data/content';

/**
 * Build-time Open Graph image generator. Produces a unique social card per
 * case study and UX bite at `/og/case-studies/<slug>.png` and
 * `/og/ux-bites/<slug>.png`. Rendered with canvaskit (no network needed) using
 * the bundled DejaVu fonts in `src/og-fonts/`.
 */
interface OgPage {
  title: string;
  description: string;
}

const studies = await getAllCaseStudies();
const bites = await getAllUxBites();

const pages: Record<string, OgPage> = {};
for (const s of studies) {
  pages[`case-studies/${s.slug}`] = {
    title: s.title,
    description: `${s.company} · Case study — ${s.excerpt}`,
  };
}
for (const b of bites) {
  pages[`ux-bites/${b.slug}`] = {
    title: b.title,
    description: `${b.company ?? 'UX'} · UX Bite — ${b.insight}`,
  };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: OgPage) => ({
    title: page.title,
    description: page.description,
    // A strong title plus the accent border gives the card its brand identity.
    bgGradient: [
      [20, 17, 15],
      [28, 22, 18],
    ],
    border: { color: [255, 77, 46], width: 24, side: 'inline-start' },
    padding: 80,
    font: {
      title: {
        color: [255, 255, 255],
        size: 64,
        lineHeight: 1.15,
        weight: 'Bold',
        families: ['DejaVu Sans'],
      },
      description: {
        color: [176, 168, 160],
        size: 30,
        lineHeight: 1.4,
        families: ['DejaVu Sans'],
      },
    },
    fonts: ['./src/og-fonts/DejaVuSans.ttf', './src/og-fonts/DejaVuSans-Bold.ttf'],
    format: 'PNG',
  }),
});
