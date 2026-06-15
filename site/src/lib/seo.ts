import { site } from './site';

export interface MetaInput {
  title?: string;
  description?: string;
  /** Absolute or root-relative image URL for Open Graph / Twitter cards. */
  image?: string;
  /** 'website' for listing pages, 'article' for case studies / bites. */
  type?: 'website' | 'article';
  publishDate?: Date;
  modifiedDate?: Date;
}

export interface Meta {
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article';
  publishDate?: Date;
  modifiedDate?: Date;
}

const DEFAULT_OG_IMAGE = '/og-default.svg';

/**
 * Merge per-page SEO input with sensible site-wide defaults. Pages pass only
 * what they know; everything else falls back to the global config.
 */
export function buildMeta(input: MetaInput = {}): Meta {
  const title = input.title ? `${input.title} — ${site.name}` : `${site.name} · ${site.tagline}`;
  return {
    title,
    description: input.description ?? site.description,
    image: input.image ?? DEFAULT_OG_IMAGE,
    type: input.type ?? 'website',
    publishDate: input.publishDate,
    modifiedDate: input.modifiedDate,
  };
}
