// serialnumberage.com, bought by Jon on Cloudflare 2026-11-10.
export const SITE_URL = 'https://serialnumberage.com';
export const SITE_NAME = 'Serial Number Age';
// While true: every page is noindex, robots.txt blocks crawlers, and a banner shows.
export const PREVIEW = false;

export const AMAZON_TAG = 'booforgen-20';
export const amazonUrl = (q: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(q)}${AMAZON_TAG ? `&tag=${AMAZON_TAG}` : ''}`;
