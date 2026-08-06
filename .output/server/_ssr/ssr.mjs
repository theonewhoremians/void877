//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var CACHE_MS = 10 * 6e4;
var RATE_WINDOW_MS = 15 * 6e4;
var RATE_MAX = 20;
var cache = /* @__PURE__ */ new Map();
var inFlight = /* @__PURE__ */ new Map();
var requests = /* @__PURE__ */ new Map();
function emptyReel(url, shortcode) {
	return {
		shortcode,
		url,
		username: null,
		fullName: null,
		profilePicture: null,
		verified: null,
		caption: null,
		hashtags: [],
		mentions: [],
		thumbnail: null,
		videoUrl: null,
		duration: null,
		width: null,
		height: null,
		uploadDate: null,
		audioTitle: null,
		audioArtist: null,
		likes: null,
		comments: null,
		views: null,
		reposts: null,
		shares: null,
		saves: null
	};
}
function parseCount(value) {
	if (!value) return null;
	const match = value.replace(/,/g, "").match(/([\d.]+)\s*([km])?/i);
	if (!match) return null;
	const number = Number(match[1]);
	if (!Number.isFinite(number)) return null;
	return Math.round(number * (match[2]?.toLowerCase() === "k" ? 1e3 : match[2]?.toLowerCase() === "m" ? 1e6 : 1));
}
function htmlEntityDecode(value) {
	return value.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function meta(html, key) {
	const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const patterns = [new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"), new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i")];
	for (const pattern of patterns) {
		const found = html.match(pattern)?.[1];
		if (found) return htmlEntityDecode(found);
	}
	return null;
}
function jsonString(html, name) {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	for (const source of jsonSources(html)) {
		const match = source.match(new RegExp(`"${escaped}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i"))?.[1];
		if (!match) continue;
		try {
			return JSON.parse(`"${match}"`);
		} catch {}
	}
	return null;
}
function jsonNumber(html, name) {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	for (const source of jsonSources(html)) {
		const value = source.match(new RegExp(`"${escaped}"\\s*:\\s*(\\d+(?:\\.\\d+)?)`, "i"))?.[1];
		if (value) return Number(value);
	}
	return null;
}
function jsonSources(html) {
	return [html, html.replace(/\\"/g, "\"").replace(/\\u0026/g, "&").replace(/\\u003c/g, "<")];
}
function parsePublicHtml(html) {
	const description = meta(html, "og:description") ?? meta(html, "description") ?? "";
	const title = meta(html, "og:title") ?? "";
	const username = jsonString(html, "username") ?? title.match(/^([^(@]+?)(?:\s*\(@[^)]*\))?\s+on Instagram/i)?.[1]?.trim() ?? null;
	const captionText = (jsonString(html, "edge_media_to_caption") ?? jsonString(html, "caption") ?? description ?? null)?.replace(/\s+/g, " ").trim() ?? null;
	const likes = jsonNumber(html, "like_count") ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+likes?/i)?.[1]);
	const comments = jsonNumber(html, "comment_count") ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+comments?/i)?.[1]);
	const views = jsonNumber(html, "video_view_count") ?? jsonNumber(html, "video_play_count") ?? jsonNumber(html, "play_count") ?? jsonNumber(html, "view_count") ?? jsonNumber(html, "video_viewer_count") ?? jsonNumber(html, "ig_reels_plays") ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+(?:views?|plays?)/i)?.[1]);
	const reposts = jsonNumber(html, "repost_count") ?? jsonNumber(html, "reshare_count") ?? jsonNumber(html, "reposts_count") ?? jsonNumber(html, "reel_repost_count") ?? jsonNumber(html, "reel_reshare_count") ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+reposts?/i)?.[1]);
	const hashtags = captionText ? [...captionText.matchAll(/#([\p{L}\p{N}_]+)/gu)].map((match) => match[1]) : [];
	const mentions = captionText ? [...captionText.matchAll(/@([a-z0-9._]+)/gi)].map((match) => match[1]) : [];
	const width = Number(meta(html, "og:video:width") ?? jsonNumber(html, "video_width")) || null;
	const height = Number(meta(html, "og:video:height") ?? jsonNumber(html, "video_height")) || null;
	return {
		username,
		caption: captionText,
		hashtags: [...new Set(hashtags)],
		mentions: [...new Set(mentions)],
		thumbnail: meta(html, "og:image") ?? jsonString(html, "display_url") ?? null,
		videoUrl: meta(html, "og:video") ?? jsonString(html, "video_url") ?? null,
		duration: jsonNumber(html, "video_duration"),
		width,
		height,
		uploadDate: jsonString(html, "taken_at_timestamp") ?? meta(html, "article:published_time") ?? null,
		audioTitle: jsonString(html, "music_asset_info") ? null : jsonString(html, "audio_title"),
		audioArtist: jsonString(html, "audio_artist"),
		profilePicture: jsonString(html, "profile_pic_url"),
		verified: html.includes("\"is_verified\":true") ? true : html.includes("\"is_verified\":false") ? false : null,
		likes,
		comments,
		views,
		reposts
	};
}
async function fetchPublicPage(url, deadline) {
	let current = new URL(url);
	for (let redirects = 0; redirects < 6; redirects++) {
		const remaining = deadline - Date.now();
		if (remaining <= 0) throw new Error("Import timed out.");
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), Math.min(remaining, 8e3));
		try {
			const response = await fetch(current, {
				redirect: "manual",
				signal: controller.signal,
				headers: {
					"user-agent": "Mozilla/5.0 (compatible; EditFlowImporter/1.0)",
					accept: "text/html,application/xhtml+xml"
				}
			});
			if ([
				301,
				302,
				303,
				307,
				308
			].includes(response.status)) {
				const location = response.headers.get("location");
				if (!location) throw new Error("Instagram returned an invalid redirect.");
				current = new URL(location, current);
				if (!isAllowedHost(current.hostname)) throw new Error("The link redirected to an unsupported host.");
				continue;
			}
			if (!response.ok) throw new Error(`Instagram returned ${response.status}.`);
			return {
				url: current.toString(),
				html: await response.text()
			};
		} finally {
			clearTimeout(timer);
		}
	}
	throw new Error("Too many redirects.");
}
var PublicPageProvider = class {
	name = "public-page";
	async extract(url, deadline) {
		const page = await fetchPublicPage(url, deadline);
		return {
			...parsePublicHtml(page.html),
			url: page.url
		};
	}
};
var EmbedPageProvider = class {
	name = "public-embed";
	async extract(url, deadline) {
		return {
			...parsePublicHtml((await fetchPublicPage(`https://www.instagram.com/reel/${shortcodeFromUrl(new URL(url))}/embed/captioned/`, deadline)).html),
			url
		};
	}
};
var CaptionEmbedProvider = class {
	name = "caption-embed";
	async extract(url, deadline) {
		return {
			...parsePublicHtml((await fetchPublicPage(`https://www.instagram.com/reel/${shortcodeFromUrl(new URL(url))}/embed/`, deadline)).html),
			url
		};
	}
};
var providers = [
	new PublicPageProvider(),
	new EmbedPageProvider(),
	new CaptionEmbedProvider()
];
function isAllowedHost(hostname) {
	return /(^|\.)(instagram\.com|instagr\.am)$/i.test(hostname);
}
function shortcodeFromUrl(url) {
	return url.pathname.match(/^\/(?:reel|p)\/([^/?#]+)/i)?.[1] ?? "";
}
function merge(base, incoming) {
	for (const [key, value] of Object.entries(incoming)) {
		if (value === null || value === void 0 || Array.isArray(value) && value.length === 0) continue;
		if (base[key] === null || Array.isArray(base[key]) && base[key].length === 0) base[key] = value;
	}
}
function rateLimit(ip) {
	const now = Date.now();
	const active = (requests.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
	if (active.length >= RATE_MAX) return false;
	active.push(now);
	requests.set(ip, active);
	return true;
}
async function importUncached(url) {
	const initialUrl = new URL(url);
	const shortcode = shortcodeFromUrl(initialUrl);
	const reel = emptyReel(initialUrl.toString(), shortcode);
	const deadline = Date.now() + 15e3;
	const used = [];
	for (const provider of providers) for (let attempt = 0; attempt < 2; attempt++) try {
		merge(reel, await provider.extract(url, deadline));
		used.push(provider.name);
		break;
	} catch {
		if (Date.now() >= deadline) break;
	}
	if (!reel.thumbnail && !reel.caption && !reel.username) throw new Error("Instagram did not make metadata available for this reel. Confirm that it is public and try again later.");
	return {
		success: true,
		source: used.length ? "public-instagram" : "cache",
		reel
	};
}
async function importInstagramReel(request) {
	if (request.method !== "POST") return Response.json({
		success: false,
		error: "Method not allowed.",
		retryable: false
	}, { status: 405 });
	if (!rateLimit(request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local")) return Response.json({
		success: false,
		error: "Too many imports. Please try again in a few minutes.",
		retryable: true
	}, { status: 429 });
	try {
		const body = await request.json();
		const url = new URL(String(body.url ?? ""));
		if (!isAllowedHost(url.hostname)) throw new Error("Enter a public Instagram Reel URL.");
		const cached = cache.get(url.toString());
		if (cached) {
			if (cached.expiresAt <= Date.now() && !inFlight.has(url.toString())) {
				const refresh = importUncached(url.toString()).then((response) => cache.set(url.toString(), {
					response,
					expiresAt: Date.now() + CACHE_MS
				})).catch(() => void 0).finally(() => inFlight.delete(url.toString()));
				inFlight.set(url.toString(), refresh.then(() => cached.response));
			}
			return Response.json(cached.response);
		}
		const running = inFlight.get(url.toString()) ?? importUncached(url.toString());
		inFlight.set(url.toString(), running);
		try {
			const response = await running;
			cache.set(url.toString(), {
				response,
				expiresAt: Date.now() + CACHE_MS
			});
			return Response.json(response);
		} finally {
			inFlight.delete(url.toString());
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not import this reel.";
		const status = message.includes("Instagram did not") ? 422 : 400;
		return Response.json({
			success: false,
			error: message,
			retryable: status === 422
		}, { status });
	}
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-MX2qljiQ.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		if (new URL(request.url).pathname === "/api/import-instagram") return await importInstagramReel(request);
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
