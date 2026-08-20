import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { importInstagramReel } from "./server/instagram-import";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

async function downloadThumbnail(request: Request) {
  try {
    const source = new URL(new URL(request.url).searchParams.get("url") ?? "");
    if (!/(^|\.)(cdninstagram\.com|fbcdn\.net|instagram\.com)$/i.test(source.hostname)) {
      return new Response("Unsupported thumbnail source.", { status: 400 });
    }
    const response = await fetch(source, { headers: { accept: "image/*,video/*;q=0.9,*/*;q=0.5" } });
    if (!response.ok) return new Response("Imported media is unavailable.", { status: 502 });
    const headers = new Headers();
    headers.set("content-type", response.headers.get("content-type") ?? "image/jpeg");
    headers.set("content-disposition", response.headers.get("content-type")?.startsWith("video/")
      ? 'inline; filename="imported-reel-video.mp4"'
      : 'attachment; filename="imported-reel-thumbnail.jpg"');
    headers.set("cache-control", "private, max-age=300");
    return new Response(response.body, { headers });
  } catch {
    return new Response("Invalid thumbnail URL.", { status: 400 });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (new URL(request.url).pathname === "/api/import-instagram") {
        return await importInstagramReel(request);
      }
      if (new URL(request.url).pathname === "/api/download-thumbnail") {
        return await downloadThumbnail(request);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
