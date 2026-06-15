import type { ContentSource } from '../types';

/**
 * Placeholder adapter for a future headless CMS (e.g. Sanity, Contentful,
 * Storyblok). It implements the exact same `ContentSource` interface as the
 * Astro adapter and would return the same domain types — typically by
 * `fetch`-ing the CMS API and mapping the response.
 *
 * To migrate: implement these methods, then set CONTENT_SOURCE=cms in the
 * environment. No pages or components need to change.
 */
export const cmsAdapter: ContentSource = {
  async getAllCaseStudies() {
    throw new Error('CMS adapter not implemented yet. Set CONTENT_SOURCE=astro.');
  },
  async getAllUxBites() {
    throw new Error('CMS adapter not implemented yet. Set CONTENT_SOURCE=astro.');
  },
  async getAllCheatsheets() {
    throw new Error('CMS adapter not implemented yet. Set CONTENT_SOURCE=astro.');
  },
  async getAllTooltips() {
    throw new Error('CMS adapter not implemented yet. Set CONTENT_SOURCE=astro.');
  },
};
