export const i18n = {
  defaultLocale: 'tr',
  locales: ['tr', 'en', 'ar'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
