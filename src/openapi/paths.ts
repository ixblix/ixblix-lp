import type { SupportedLanguage } from "./translations";

export const supportedLanguages: SupportedLanguage[] = ["en", "pt", "es"];

/**
 * Public URL of the generated OpenAPI document for a given language.
 * The documents are emitted as static JSON endpoints at build time
 * (see `src/pages/docs/openapi*.json.ts`).
 */
export function specPathFor(language: SupportedLanguage): string {
  return language === "en"
    ? "/docs/openapi.json"
    : `/docs/openapi.${language}.json`;
}
