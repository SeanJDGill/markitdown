/**
 * Global site configuration. Editing copy, nav and social lives here so it
 * never has to be hunted down across components.
 */
export const site = {
  name: 'Teardown',
  tagline: 'In-depth UX teardowns of the products you use every day.',
  description:
    'Teardown publishes long-form UX case studies, short UX bites and practical cheatsheets — reverse-engineering how the best products are designed.',
  author: 'The Teardown Team',
  email: 'hello@teardowns.example.com',
  /** Where the newsletter form posts. Wire this to your ESP (e.g. Buttondown,
   *  ConvertKit, Mailchimp). Left blank, the form runs in demo mode. */
  newsletterEndpoint: import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT ?? '',
  social: {
    twitter: 'https://twitter.com/',
    rss: '/rss.xml',
  },
} as const;

export const nav = [
  { label: 'Library', href: '/library/' },
  { label: 'UX Bites', href: '/ux-bites/' },
  { label: 'Cheatsheets', href: '/cheatsheets/' },
  { label: 'Glossary', href: '/glossary/' },
  { label: 'About', href: '/about/' },
] as const;

/** Human-readable labels for the topic slugs used across content. */
export const topicLabels: Record<string, string> = {
  onboarding: 'Onboarding',
  signup: 'Sign-up',
  checkout: 'Checkout',
  forms: 'Forms',
  navigation: 'Navigation',
  pricing: 'Pricing',
  mobile: 'Mobile',
  search: 'Search',
  notifications: 'Notifications',
  'empty-states': 'Empty states',
  accessibility: 'Accessibility',
  retention: 'Retention',
};

export function topicLabel(slug: string): string {
  return topicLabels[slug] ?? slug;
}
