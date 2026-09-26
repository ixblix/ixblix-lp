import type { APIRoute } from "astro";
import { buildOpenApiSpec } from "../../openapi/generate";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildOpenApiSpec("es")), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
