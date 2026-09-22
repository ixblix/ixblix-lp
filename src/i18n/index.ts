import en from './en';
import pt from './pt';
import es from './es';
import type { Locale } from './config';

const translations: Record<Locale, Record<string, string>> = { en, pt, es };

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locale === 'pt' || locale === 'es') return locale;
  return 'en';
}
