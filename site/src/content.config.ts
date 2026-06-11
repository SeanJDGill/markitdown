import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

/**
 * Shared topic vocabulary. Keeping this as an enum gives us validation at build
 * time and a single source of truth for topic landing pages and filters.
 */
export const TOPICS = [
  'onboarding',
  'signup',
  'checkout',
  'forms',
  'navigation',
  'pricing',
  'mobile',
  'search',
  'notifications',
  'empty-states',
  'accessibility',
  'retention',
] as const;

const topic = z.enum(TOPICS);

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/caseStudies' }),
  schema: () =>
    z.object({
      title: z.string(),
      company: z.string(),
      excerpt: z.string(),
      topics: z.array(topic).min(1),
      category: z.string().optional(),
      // Root-relative path (served from /public) or absolute URL. Kept as a
      // string so a CMS can supply a URL later without code changes.
      heroImage: z.string(),
      heroImageAlt: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Editorial Team'),
      featured: z.boolean().default(false),
      rating: z.number().min(0).max(10).optional(),
      draft: z.boolean().default(false),
      readingTime: z.number().optional(),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          ogImage: z.string().optional(),
        })
        .optional(),
    }),
});

const uxBites = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/uxBites' }),
  schema: () =>
    z.object({
      title: z.string(),
      company: z.string().optional(),
      insight: z.string(),
      topics: z.array(topic).min(1),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      publishDate: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
});

const cheatsheets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cheatsheets' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    topics: z.array(topic).min(1),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const tooltips = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tooltips' }),
  schema: z.object({
    term: z.string(),
    aliases: z.array(z.string()).default([]),
    definition: z.string(),
    relatedTopics: z.array(topic).default([]),
  }),
});

export const collections = { caseStudies, uxBites, cheatsheets, tooltips };
