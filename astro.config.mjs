// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://trip.six-six6.workers.dev',
  // Shiki writes inline style="" attributes, which the CSP (style-src 'self') blocks.
  // Code blocks are styled in global.css instead.
  markdown: { syntaxHighlight: false },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } } })],
});
