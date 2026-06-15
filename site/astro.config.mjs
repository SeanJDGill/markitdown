// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production domain + base path. Configured for a GitHub Pages project site at
// https://seanjdgill.github.io/markitdown/. For a custom domain, set
// SITE to that origin and BASE to '/'.
const SITE = 'https://seanjdgill.github.io';
const BASE = '/markitdown';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,

  integrations: [
    mdx(),
    // Keep generated OG images out of the sitemap.
    sitemap({ filter: (page) => !page.includes('/og/') }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
