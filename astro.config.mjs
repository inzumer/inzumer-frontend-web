// @ts-check
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/constants/site.ts';
import { SETTINGS_STORAGE_KEY } from './src/constants/storage.ts';
import {
  languageRedirectScript,
  notFoundLanguageScript,
  themeScript,
} from './src/utils/inline-scripts/inline-scripts.ts';
import { DEFAULT_LOCALE, LOCALES } from './src/utils/locale/locale.ts';

/** Project slugs, for the 308 redirects of the old English URLs (`/projects/belo`). */
const PROJECT_SLUGS = readdirSync('src/content/projects/en').map((file) =>
  file.replace(/\.md$/, ''),
);

/**
 * @param {string} text
 * @returns {`sha256-${string}`}
 */
const sha256 = (text) => `sha256-${createHash('sha256').update(text).digest('base64')}`;
const inlineScriptHashes = [
  sha256(themeScript(SETTINGS_STORAGE_KEY, 'dark')),
  sha256(
    languageRedirectScript({
      storageKey: SETTINGS_STORAGE_KEY,
      locales: LOCALES,
      fallbackLocale: DEFAULT_LOCALE,
      base: '',
    }),
  ),
  sha256(notFoundLanguageScript({ locales: LOCALES, base: '' })),
];

/** @type {Exclude<NonNullable<NonNullable<import('astro').AstroUserConfig['security']>['csp']>, boolean>} */
const csp = {
  directives: [
    "default-src 'self'",
    "connect-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ],
  scriptDirective: { resources: ["'self'"], hashes: inlineScriptHashes },
  styleDirective: {
    resources: [
      { resource: "'self'", kind: 'element' },
      { resource: "'unsafe-inline'", kind: 'attribute' },
    ],
  },
};

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // Only the contact endpoint runs on demand (`prerender = false`); every page is static.
  adapter: vercel(),
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  security: { csp },
  redirects: {
    ...Object.fromEntries(
      PROJECT_SLUGS.map((slug) => [`/projects/${slug}`, `/en/projects/${slug}`]),
    ),
    // Retired project; its old URL lands on the home.
    '/projects/api-store': '/en',
  },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: DEFAULT_LOCALE, locales: { es: 'es', en: 'en' } },
      filter: (page) => {
        const { pathname } = new URL(page);

        return (
          pathname !== '/' && !pathname.includes('404') && pathname.split('/')[1] !== 'projects'
        );
      },
    }),
  ],
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  markdown: { syntaxHighlight: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
