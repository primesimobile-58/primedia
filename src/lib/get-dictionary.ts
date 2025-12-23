import 'server-only';
import type { Locale } from '@/i18n-config';

// We enumerate all dictionaries here for better type safety and to ensure they are bundled
const dictionaries = {
  tr: () => import('@/dictionaries/tr.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
