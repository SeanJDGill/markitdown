// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Update this to your production domain. Required for absolute URLs in the
// sitemap, RSS feed, canonical tags and Open Graph metadata.
const SITE = 'https://teardowns.example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
