/**
 * Pure, framework-free filtering helpers. Shared between build-time topic pages
 * and the client-side Library filter script so the matching logic stays
 * identical in both places.
 */
export interface Filterable {
  title: string;
  company?: string;
  topics: string[];
}

export interface FilterState {
  query: string;
  topic: string | null;
  company: string | null;
}

export function matches(item: Filterable, state: FilterState): boolean {
  if (state.topic && !item.topics.includes(state.topic)) return false;
  if (state.company && item.company !== state.company) return false;
  if (state.query) {
    const haystack = `${item.title} ${item.company ?? ''} ${item.topics.join(' ')}`.toLowerCase();
    if (!haystack.includes(state.query.trim().toLowerCase())) return false;
  }
  return true;
}
