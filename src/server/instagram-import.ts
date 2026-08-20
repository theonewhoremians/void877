export type InstagramReel = {
  shortcode: string | null;
  url: string | null;
  username: string | null;
  fullName: string | null;
  profilePicture: string | null;
  verified: boolean | null;
  caption: string | null;
  hashtags: string[];
  mentions: string[];
  thumbnail: string | null;
  videoUrl: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  uploadDate: string | null;
  audioTitle: string | null;
  audioArtist: string | null;
  likes: number | null;
  comments: number | null;
  views: number | null;
  reposts: number | null;
  shares: number | null;
  saves: number | null;
};

export type ImportResponse = { success: true; source: string; reel: InstagramReel } | { success: false; error: string; retryable: boolean };

export interface InstagramProvider {
  name: string;
  extract(url: string, deadline: number): Promise<Partial<InstagramReel>>;
}

const CACHE_MS = 10 * 60_000;
const RATE_WINDOW_MS = 15 * 60_000;
const RATE_MAX = 20;
const cache = new Map<string, { response: Extract<ImportResponse, { success: true }>; expiresAt: number }>();
const inFlight = new Map<string, Promise<Extract<ImportResponse, { success: true }>>>();
const requests = new Map<string, number[]>();

function emptyReel(url: string, shortcode: string): InstagramReel {
  return { shortcode, url, username: null, fullName: null, profilePicture: null, verified: null, caption: null, hashtags: [], mentions: [], thumbnail: null, videoUrl: null, duration: null, width: null, height: null, uploadDate: null, audioTitle: null, audioArtist: null, likes: null, comments: null, views: null, reposts: null, shares: null, saves: null };
}

function parseCount(value: string | undefined) {
  if (!value) return null;
  const match = value.replace(/,/g, "").match(/([\d.]+)\s*([km])?/i);
  if (!match) return null;
  const number = Number(match[1]);
  if (!Number.isFinite(number)) return null;
  return Math.round(number * (match[2]?.toLowerCase() === "k" ? 1_000 : match[2]?.toLowerCase() === "m" ? 1_000_000 : 1));
}

function htmlEntityDecode(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function meta(html: string, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const found = html.match(pattern)?.[1];
    if (found) return htmlEntityDecode(found);
  }
  return null;
}

function jsonString(html: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const source of jsonSources(html)) {
    const match = source.match(new RegExp(`"${escaped}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i"))?.[1];
    if (!match) continue;
    try { return JSON.parse(`"${match}"`) as string; } catch {}
  }
  return null;
}

function jsonNumber(html: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const source of jsonSources(html)) {
    const value = source.match(new RegExp(`"${escaped}"\\s*:\\s*(\\d+(?:\\.\\d+)?)`, "i"))?.[1];
    if (value) return Number(value);
  }
  return null;
}

// Instagram commonly nests its public page state as JSON encoded inside a
// script tag. Check both representations without relying on private APIs.
function jsonSources(html: string) {
  return [html, html.replace(/\\"/g, '"').replace(/\\u0026/g, "&").replace(/\\u003c/g, "<")];
}

function parsePublicHtml(html: string): Partial<InstagramReel> {
  const description = meta(html, "og:description") ?? meta(html, "description") ?? "";
  const title = meta(html, "og:title") ?? "";
  const username = jsonString(html, "username") ?? title.match(/^([^(@]+?)(?:\s*\(@[^)]*\))?\s+on Instagram/i)?.[1]?.trim() ?? null;
  const caption = jsonString(html, "edge_media_to_caption") ?? jsonString(html, "caption") ?? description ?? null;
  const captionText = caption?.replace(/\s+/g, " ").trim() ?? null;
  const likes = jsonNumber(html, "like_count") ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+likes?/i)?.[1]);
  const comments = jsonNumber(html, "comment_count") ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+comments?/i)?.[1]);
  const views = jsonNumber(html, "video_view_count")
    ?? jsonNumber(html, "video_play_count")
    ?? jsonNumber(html, "play_count")
    ?? jsonNumber(html, "view_count")
    ?? jsonNumber(html, "video_viewer_count")
    ?? jsonNumber(html, "ig_reels_plays")
    ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+(?:views?|plays?)/i)?.[1]);
  const reposts = jsonNumber(html, "repost_count")
    ?? jsonNumber(html, "reshare_count")
    ?? jsonNumber(html, "reposts_count")
    ?? jsonNumber(html, "reel_repost_count")
    ?? jsonNumber(html, "reel_reshare_count")
    ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+reposts?/i)?.[1]);
  const shares = jsonNumber(html, "share_count")
    ?? jsonNumber(html, "reshare_count")
    ?? jsonNumber(html, "shares_count")
    ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+shares?/i)?.[1]);
  const saves = jsonNumber(html, "save_count")
    ?? jsonNumber(html, "saved_count")
    ?? jsonNumber(html, "saves_count")
    ?? parseCount(description.match(/([\d.,]+\s*[KM]?)\s+saves?/i)?.[1]);
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
    verified: html.includes('"is_verified":true') ? true : html.includes('"is_verified":false') ? false : null,
    likes,
    comments,
    views,
    reposts,
    shares,
    saves,
  };
}

async function fetchPublicPage(url: string, deadline: number) {
  let current = new URL(url);
  for (let redirects = 0; redirects < 6; redirects++) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("Import timed out.");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(remaining, 8_000));
    try {
      const response = await fetch(current, { redirect: "manual", signal: controller.signal, headers: { "user-agent": "Mozilla/5.0 (compatible; EditFlowImporter/1.0)", accept: "text/html,application/xhtml+xml" } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new Error("Instagram returned an invalid redirect.");
        current = new URL(location, current);
        if (!isAllowedHost(current.hostname)) throw new Error("The link redirected to an unsupported host.");
        continue;
      }
      if (!response.ok) throw new Error(`Instagram returned ${response.status}.`);
      return { url: current.toString(), html: await response.text() };
    } finally { clearTimeout(timer); }
  }
  throw new Error("Too many redirects.");
}

class PublicPageProvider implements InstagramProvider {
  name = "public-page";
  async extract(url: string, deadline: number) {
    const page = await fetchPublicPage(url, deadline);
    return { ...parsePublicHtml(page.html), url: page.url };
  }
}

class EmbedPageProvider implements InstagramProvider {
  name = "public-embed";
  async extract(url: string, deadline: number) {
    const shortcode = shortcodeFromUrl(new URL(url));
    const page = await fetchPublicPage(`https://www.instagram.com/reel/${shortcode}/embed/captioned/`, deadline);
    return { ...parsePublicHtml(page.html), url };
  }
}

class CaptionEmbedProvider implements InstagramProvider {
  name = "caption-embed";
  async extract(url: string, deadline: number) {
    const shortcode = shortcodeFromUrl(new URL(url));
    const page = await fetchPublicPage(`https://www.instagram.com/reel/${shortcode}/embed/`, deadline);
    return { ...parsePublicHtml(page.html), url };
  }
}

const providers: InstagramProvider[] = [new PublicPageProvider(), new EmbedPageProvider(), new CaptionEmbedProvider()];

function isAllowedHost(hostname: string) { return /(^|\.)(instagram\.com|instagr\.am)$/i.test(hostname); }
function shortcodeFromUrl(url: URL) { return url.pathname.match(/^\/(?:reel|p)\/([^/?#]+)/i)?.[1] ?? ""; }

function merge(base: InstagramReel, incoming: Partial<InstagramReel>) {
  for (const [key, value] of Object.entries(incoming) as Array<[keyof InstagramReel, InstagramReel[keyof InstagramReel]]>) {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) continue;
    if (base[key] === null || (Array.isArray(base[key]) && (base[key] as string[]).length === 0)) (base as Record<string, unknown>)[key] = value;
  }
}

function rateLimit(ip: string) {
  const now = Date.now();
  const active = (requests.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (active.length >= RATE_MAX) return false;
  active.push(now); requests.set(ip, active); return true;
}

async function importUncached(url: string): Promise<Extract<ImportResponse, { success: true }>> {
  const initialUrl = new URL(url);
  const shortcode = shortcodeFromUrl(initialUrl);
  const reel = emptyReel(initialUrl.toString(), shortcode);
  const deadline = Date.now() + 15_000;
  const used: string[] = [];
  for (const provider of providers) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try { merge(reel, await provider.extract(url, deadline)); used.push(provider.name); break; } catch { if (Date.now() >= deadline) break; }
    }
  }
  if (!reel.thumbnail && !reel.caption && !reel.username) throw new Error("Instagram did not make metadata available for this reel. Confirm that it is public and try again later.");
  return { success: true, source: used.length ? "public-instagram" : "cache", reel };
}

export async function importInstagramReel(request: Request): Promise<Response> {
  if (request.method !== "POST") return Response.json({ success: false, error: "Method not allowed.", retryable: false } satisfies ImportResponse, { status: 405 });
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(ip)) return Response.json({ success: false, error: "Too many imports. Please try again in a few minutes.", retryable: true } satisfies ImportResponse, { status: 429 });
  try {
    const body = await request.json() as { url?: unknown };
    const url = new URL(String(body.url ?? ""));
    if (!isAllowedHost(url.hostname)) throw new Error("Enter a public Instagram Reel URL.");
    const cached = cache.get(url.toString());
    if (cached) {
      if (cached.expiresAt <= Date.now() && !inFlight.has(url.toString())) {
        const refresh = importUncached(url.toString())
          .then((response) => cache.set(url.toString(), { response, expiresAt: Date.now() + CACHE_MS }))
          .catch(() => undefined)
          .finally(() => inFlight.delete(url.toString()));
        inFlight.set(url.toString(), refresh.then(() => cached.response));
      }
      // Stale-while-revalidate keeps repeat imports fast while a background
      // request refreshes the public metadata.
      return Response.json(cached.response);
    }
    const running = inFlight.get(url.toString()) ?? importUncached(url.toString());
    inFlight.set(url.toString(), running);
    try {
      const response = await running;
      cache.set(url.toString(), { response, expiresAt: Date.now() + CACHE_MS });
      return Response.json(response);
    } finally { inFlight.delete(url.toString()); }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not import this reel.";
    const status = message.includes("Instagram did not") ? 422 : 400;
    return Response.json({ success: false, error: message, retryable: status === 422 } satisfies ImportResponse, { status });
  }
}
