import type { OpenAPIV3 } from "openapi-types";
import { openApiSpec } from "./spec";
import { translateSpec, type SupportedLanguage } from "./translations";

/** Public production server exposed in the published documentation. */
const apiServer: OpenAPIV3.ServerObject = {
  url: "https://api.ixblix.app/api",
  description: "Production server",
};

/** Brand shown as the API title in every language. */
const apiTitle = "ixblix API";

/**
 * Builds the localized OpenAPI document served by the public documentation
 * site. Thin wrapper around `translateSpec` that points the spec at the
 * production API and applies the public brand.
 */
export function buildOpenApiSpec(
  language: SupportedLanguage,
): OpenAPIV3.Document {
  const spec = translateSpec(openApiSpec, language);
  return {
    ...spec,
    info: { ...spec.info, title: apiTitle },
    servers: [apiServer],
  };
}

export { supportedLanguages } from "./paths";
export type { SupportedLanguage };
