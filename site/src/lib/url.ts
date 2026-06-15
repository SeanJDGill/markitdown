/**
 * Prefix a root-relative app path with the configured base path so the site
 * works whether it's served from `/` (local, custom domain) or a subpath like
 * `/markitdown/` (GitHub Pages project site).
 *
 * External URLs (http/https/mailto/#) and already-based paths are returned
 * untouched. `import.meta.env.BASE_URL` is `/` by default, so this is a no-op
 * unless `base` is set in astro.config.mjs.
 */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|#|data:)/.test(path)) return path;
  const base = import.meta.env.BASE_URL; // e.g. '/' or '/markitdown/'
  const b = base.endsWith('/') ? base.slice(0, -1) : base; // '' or '/markitdown'
  const p = path.startsWith('/') ? path : `/${path}`;
  if (b && (p === b || p.startsWith(`${b}/`))) return p; // already based
  return `${b}${p}`;
}
