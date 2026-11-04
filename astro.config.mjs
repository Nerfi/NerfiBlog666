// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://trip.six-six6.workers.dev',
  // Prism emits CSS classes. Shiki writes inline style="" attributes, which the CSP
  // (style-src 'self') blocks. Token colours live in global.css.
  markdown: { syntaxHighlight: 'prism' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } } })],
});
