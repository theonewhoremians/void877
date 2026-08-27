import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  Info,
  MoreVertical,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import reelThumb from "@/assets/reel-thumb.jpg";
import icHeart from "@/assets/ig-icon/heart.png.png";
import icComment from "@/assets/ig-icon/comment.png.png";
import icRepost from "@/assets/ig-icon/repost.png.png";
import icShare from "@/assets/ig-icon/share.png.png";
import icBookmark from "@/assets/ig-icon/bookmark.png.png";
import ic2Timer from "@/assets/ig-icon2/timer.png";
import ic2Share from "@/assets/ig-icon2/share.png";
import ic2Heart from "@/assets/ig-icon2/heart.png";
import ic2Bookmark from "@/assets/ig-icon2/bookmark.png";
import ic2Repost from "@/assets/ig-icon2/repost.png";
import ic2Comment from "@/assets/ig-icon2/comment.png";
import {
  clearSession,
  getLicenseStatus,
  loadSession,
} from "@/services/license";
import { importPublicInstagramReel } from "@/services/instagram-import";

export const Route = createFileRoute("/")({ component: ReelInsightsPage });

const STORAGE_KEY = "reel-insights-data-v3";
const VIEWS_TEMPLATES_KEY = "reel-insights-views-templates-v1";
const WATCH_TEMPLATES_KEY = "reel-insights-watch-templates-v1";
const LIKES_TEMPLATES_KEY = "reel-insights-likes-templates-v1";
const TOP_GAP_KEY = "reel-insights-top-gap-v1";
const AGE_EDITED_KEYS_KEY = "reel-insights-age-edited-keys-v1";
const LICENSE_REVALIDATE_MS = 60_000;
const GRAPH_POINT_COUNT = 32;
function resamplePoints(points: number[], count = GRAPH_POINT_COUNT) {
  if (points.length === count) return points.slice();
  if (points.length < 2) return Array.from({ length: count }, () => points[0] ?? 0);
  return Array.from({ length: count }, (_, index) => {
    const position = (index * (points.length - 1)) / (count - 1);
    const left = Math.floor(position), right = Math.min(points.length - 1, Math.ceil(position));
    const ratio = position - left;
    return points[left] + (points[right] - points[left]) * ratio;
  });
}
function remapVisibleUntil(value: number, oldCount: number, newCount = GRAPH_POINT_COUNT) {
  if (value < 0 || oldCount < 2) return value;
  return Math.min(newCount - 1, Math.round((value / (oldCount - 1)) * (newCount - 1)));
}
function formatGraphDuration(seconds: number) {
  const rounded = Math.max(0, Math.round(seconds));
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
}
function parseGraphDuration(value: string) {
  const text = value.trim().toLowerCase();
  const clock = text.match(/^(\d+):(\d{1,2})$/);
  if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
  const seconds = text.match(/^(\d+(?:\.\d+)?)s$/);
  return seconds ? Number(seconds[1]) : null;
}
const defaultViewsMain = resamplePoints([
  155, 152, 148, 142, 135, 128, 120, 112, 104, 96, 86, 76, 65, 52, 38, 25,
]);
const defaultViewsTypical = resamplePoints([
  155, 150, 145, 140, 133, 126, 120, 113, 106, 100, 93, 86, 80, 73, 65, 55,
]);
const defaultWatch = resamplePoints([
  15, 20, 26, 33, 41, 50, 58, 66, 74, 82, 90, 100, 110, 118, 126, 132,
]);
const defaultLikes = resamplePoints([
  125, 115, 105, 95, 88, 82, 78, 72, 68, 60, 55, 48, 42, 38, 32, 28,
]);

type ViewsTemplate = {
  id: string;
  name: string;
  main: number[];
  typical: number[];
  mainVisibleUntil: number;
  typicalVisibleUntil: number;
};

type WatchTemplate = { id: string; name: string; points: number[]; visibleUntil: number; xEnd: string; yTop?: string; yMid?: string };
const WATCH_PRESET_TEMPLATES: WatchTemplate[] = [
  { id: "watch-125", name: "Long fade · 1:25", points: [10, 48, 68, 75, 86, 92, 99, 102, 103, 104, 108, 112, 116, 117, 117, 122], visibleUntil: -1, xEnd: "1:25" },
  { id: "watch-134", name: "Stepped fade · 1:34", points: [10, 36, 53, 62, 68, 72, 76, 78, 78, 81, 86, 88, 88, 90, 96, 103], visibleUntil: -1, xEnd: "1:34" },
  { id: "watch-154", name: "Deep retention · 1:54", points: [10, 31, 47, 54, 70, 79, 81, 94, 97, 105, 106, 107, 111, 113, 114, 115], visibleUntil: -1, xEnd: "1:54" },
  { id: "watch-058", name: "Quick fade · 0:58", points: [10, 45, 64, 77, 85, 89, 96, 98, 99, 100, 101, 102, 103, 104, 106, 106], visibleUntil: -1, xEnd: "0:58" },
];
const LIKES_PRESET_TEMPLATES: WatchTemplate[] = [
  { id: "likes-154-dense", name: "Dense spikes · 1:54", points: [22, 90, 118, 105, 116, 96, 124, 112, 122, 72, 108, 126, 128, 119, 82, 116, 128, 129, 110, 126, 130, 128, 129, 126, 118, 126, 121, 128, 125, 129, 128, 66], visibleUntil: -1, xEnd: "1:54", yTop: "10%", yMid: "5%" },
  { id: "likes-118-varied", name: "Varied spikes · 1:18", points: [23, 98, 93, 129, 99, 110, 91, 58, 123, 109, 118, 112, 120, 108, 126, 116, 122, 128, 119, 114, 126, 116, 128, 108, 120, 117, 101, 128, 109, 112, 129, 105], visibleUntil: -1, xEnd: "1:18", yTop: "10%", yMid: "5%" },
  { id: "likes-134-sparse", name: "Sparse spikes · 1:34", points: [82, 110, 96, 130, 130, 118, 130, 117, 130, 130, 115, 104, 130, 130, 130, 122, 130, 130, 112, 130, 130, 130, 130, 130, 104, 130, 130, 118, 130, 110, 130, 46], visibleUntil: -1, xEnd: "1:34", yTop: "20%", yMid: "10%" },
  { id: "likes-223-tail", name: "Long tail · 2:23", points: [58, 96, 116, 126, 122, 130, 125, 130, 127, 130, 126, 129, 125, 130, 127, 130, 126, 130, 125, 130, 128, 130, 126, 130, 82, 130, 127, 130, 118, 130, 128, 86], visibleUntil: -1, xEnd: "2:23", yTop: "20%", yMid: "10%" },
];

async function watchPatternFromImage(file: File, pointCount = GRAPH_POINT_COUNT): Promise<WatchTemplate> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Image analysis is unavailable in this browser.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const pink: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < canvas.height; y += 2) for (let x = 0; x < canvas.width; x += 2) {
    const offset = (y * canvas.width + x) * 4;
    const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2];
    if (r > 175 && b > 125 && r + b > g * 3.1 && Math.abs(r - b) < 150) pink.push({ x, y });
  }
  if (pink.length < 30) throw new Error("No clear pink retention line was found in that image.");
  const minX = Math.min(...pink.map((point) => point.x));
  const maxX = Math.max(...pink.map((point) => point.x));
  const minY = Math.min(...pink.map((point) => point.y));
  const maxY = Math.max(...pink.map((point) => point.y));
  const rowScores: Array<{ y: number; count: number; minX: number; maxX: number }> = [];
  for (let y = 0; y < canvas.height; y += 1) {
    let count = 0, rowMin = Infinity, rowMax = -Infinity;
    for (let x = Math.max(0, minX - 20); x < canvas.width * .98; x += 3) {
      const offset = (y * canvas.width + x) * 4;
      const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2];
      const light = (r + g + b) / 3;
      if (Math.max(r, g, b) - Math.min(r, g, b) < 10 && light >= 18 && light <= 75) {
        count++; rowMin = Math.min(rowMin, x); rowMax = Math.max(rowMax, x);
      }
    }
    if (count > Math.max(25, canvas.width / 20)) rowScores.push({ y, count, minX: rowMin, maxX: rowMax });
  }
  const rows: typeof rowScores = [];
  for (const row of rowScores) {
    const previous = rows.at(-1);
    if (previous && row.y - previous.y <= 3) { if (row.count > previous.count) rows[rows.length - 1] = row; }
    else rows.push(row);
  }
  const relevant = rows.filter((row) => row.y >= minY - canvas.height * .15 && row.y <= maxY + canvas.height * .15);
  const plotTop = relevant.length >= 2 ? relevant[0].y : minY;
  const plotBottom = relevant.length >= 2 ? relevant.at(-1)!.y : Math.min(canvas.height - 1, maxY + canvas.height * .08);
  const graphLeft = relevant.length >= 2 ? Math.min(minX, ...relevant.map((row) => row.minX)) : minX;
  const graphRight = relevant.length >= 2 ? Math.max(...relevant.map((row) => row.maxX)) : canvas.width * .96;
  const points = Array.from({ length: pointCount }, (_, index) => {
    const targetX = graphLeft + ((graphRight - graphLeft) * index) / (pointCount - 1);
    const nearby = pink.filter((point) => Math.abs(point.x - targetX) <= Math.max(5, (graphRight - graphLeft) / 36));
    const source = nearby.length ? nearby : pink.slice().sort((a, b) => Math.abs(a.x - targetX) - Math.abs(b.x - targetX)).slice(0, 10);
    const ys = source.map((point) => point.y).sort((a, b) => a - b);
    return Math.max(10, Math.min(130, 10 + ((ys[Math.floor(ys.length / 2)] - plotTop) / Math.max(1, plotBottom - plotTop)) * 120));
  });
  const endIndex = Math.round(((maxX - graphLeft) / Math.max(1, graphRight - graphLeft)) * (pointCount - 1));
  return { id: `watch-uploaded-${Date.now()}`, name: file.name.replace(/\.[^.]+$/, "").slice(0, 36) || "Uploaded graph", points, visibleUntil: endIndex >= pointCount - 1 ? -1 : Math.max(1, endIndex), xEnd: "0:56" };
}

const VIEWS_PRESET_TEMPLATES: ViewsTemplate[] = [
  { id: "fast-6k", name: "Fast rise · 6K", main: [155, 86, 48, 43, 39, 35, 32, 30, 29, 28, 28, 28, 28, 28, 28, 28], typical: [155, 132, 128, 127, 126, 126, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125], mainVisibleUntil: -1, typicalVisibleUntil: -1 },
  { id: "plateau-22k", name: "Early plateau · 22K", main: [155, 120, 78, 43, 34, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32], typical: [155, 139, 137, 137, 136, 136, 136, 136, 136, 136, 136, 136, 136, 136, 136, 136], mainVisibleUntil: 11, typicalVisibleUntil: -1 },
  { id: "growth-500k", name: "Steady growth · 500K", main: [155, 120, 73, 58, 47, 28, 24, 22, 20, 18, 16, 14, 12, 11, 10, 10], typical: [155, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154], mainVisibleUntil: 13, typicalVisibleUntil: -1 },
  { id: "staged-50k", name: "Staged growth · 50K", main: [155, 137, 116, 98, 95, 70, 51, 44, 39, 35, 32, 30, 28, 26, 15, 15], typical: [155, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 155], mainVisibleUntil: 14, typicalVisibleUntil: -1 },
  { id: "spike-3k", name: "Sharp spike · 3K", main: [155, 54, 42, 35, 31, 28, 25, 21, 21, 21, 21, 21, 21, 21, 21, 21], typical: [155, 68, 48, 43, 40, 37, 34, 31, 28, 25, 22, 19, 17, 15, 14, 14], mainVisibleUntil: 7, typicalVisibleUntil: -1 },
];

async function graphPatternFromImage(file: File): Promise<ViewsTemplate> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Image analysis is unavailable in this browser.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const pink: Array<{ x: number; y: number }> = [];
  const grey: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const index = (y * canvas.width + x) * 4;
      const r = pixels[index], g = pixels[index + 1], b = pixels[index + 2];
      if (r > 175 && b > 125 && r + b > g * 3.1 && Math.abs(r - b) < 150) pink.push({ x, y });
      if (
        r >= 120 && r <= 215 &&
        Math.abs(r - g) < 22 && Math.abs(g - b) < 22 && Math.abs(r - b) < 22
      ) grey.push({ x, y });
    }
  }
  if (pink.length < 30) throw new Error("No clear pink graph line was found in that image.");
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const point of pink) {
    minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
  }
  if (maxX - minX < 30 || maxY - minY < 8) throw new Error("The graph line is too small to trace reliably.");

  // Locate the chart grid before sampling either line. Using the fixed plot
  // rectangle preserves absolute top/bottom positions and prevents a partial
  // line from being stretched across the full chart.
  const rawGridRows: Array<{ y: number; count: number; minX: number; maxX: number }> = [];
  const scanLeft = Math.max(0, Math.floor(minX - canvas.width * 0.03));
  const scanRight = Math.min(canvas.width - 1, Math.floor(canvas.width * 0.98));
  for (let y = 0; y < canvas.height; y += 1) {
    let count = 0, rowMinX = Infinity, rowMaxX = -Infinity;
    for (let x = scanLeft; x <= scanRight; x += 3) {
      const index = (y * canvas.width + x) * 4;
      const r = pixels[index], g = pixels[index + 1], b = pixels[index + 2];
      const neutral = Math.max(r, g, b) - Math.min(r, g, b) < 10;
      const brightness = (r + g + b) / 3;
      if (neutral && brightness >= 18 && brightness <= 75) {
        count += 1;
        rowMinX = Math.min(rowMinX, x);
        rowMaxX = Math.max(rowMaxX, x);
      }
    }
    if (count >= Math.max(25, (scanRight - scanLeft) / 18)) {
      rawGridRows.push({ y, count, minX: rowMinX, maxX: rowMaxX });
    }
  }
  const gridRows: typeof rawGridRows = [];
  for (const row of rawGridRows) {
    const previous = gridRows.at(-1);
    if (previous && row.y - previous.y <= 3) {
      if (row.count > previous.count) gridRows[gridRows.length - 1] = row;
    } else {
      gridRows.push(row);
    }
  }
  const relevantGridRows = gridRows.filter((row) =>
    row.y >= minY - canvas.height * 0.18 && row.y <= maxY + canvas.height * 0.12,
  );
  const plotTop = relevantGridRows.length >= 2 ? relevantGridRows[0].y : Math.max(0, minY - canvas.height * 0.12);
  const plotBottom = relevantGridRows.length >= 2 ? relevantGridRows.at(-1)!.y : Math.min(canvas.height - 1, maxY);
  const graphMinX = relevantGridRows.length >= 2
    ? Math.min(minX, ...relevantGridRows.map((row) => row.minX))
    : minX;
  const graphMaxX = relevantGridRows.length >= 2
    ? Math.max(...relevantGridRows.map((row) => row.maxX))
    : canvas.width * 0.96;
  const graphGrey = grey.filter((point) =>
    point.x >= graphMinX - 10 && point.x <= graphMaxX + 10 &&
    point.y >= plotTop - 10 && point.y <= plotBottom + 10,
  );
  if (graphGrey.length < 20) throw new Error("No clear grey typical-reel line was found in that image.");

  const greyMaxX = Math.max(...graphGrey.map((point) => point.x));
  const sampleRawLine = (points: Array<{ x: number; y: number }>) =>
    Array.from({ length: GRAPH_POINT_COUNT }, (_, index) => {
      const targetX = graphMinX + ((graphMaxX - graphMinX) * index) / (GRAPH_POINT_COUNT - 1);
      const windowSize = Math.max(5, (graphMaxX - graphMinX) / 36);
      let candidates = points.filter((point) => Math.abs(point.x - targetX) <= windowSize);
      if (!candidates.length) {
        candidates = points.slice().sort((a, b) => Math.abs(a.x - targetX) - Math.abs(b.x - targetX)).slice(0, 12);
      }
      const sortedY = candidates.map((point) => point.y).sort((a, b) => a - b);
      return sortedY[Math.floor(sortedY.length / 2)];
    });
  const sampleGreyLine = () => {
    const rowCounts = new Map<number, number>();
    for (const point of graphGrey) {
      const row = Math.round(point.y / 4) * 4;
      rowCounts.set(row, (rowCounts.get(row) ?? 0) + 1);
    }
    const dominantRow = [...rowCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    const hasHorizontalStroke = Boolean(dominantRow && dominantRow[1] >= Math.max(18, (graphMaxX - graphMinX) / 28));
    let previousY = hasHorizontalStroke ? dominantRow[0] : maxY;
    return Array.from({ length: GRAPH_POINT_COUNT }, (_, index) => {
      const targetX = graphMinX + ((graphMaxX - graphMinX) * index) / (GRAPH_POINT_COUNT - 1);
      const windowSize = Math.max(6, (graphMaxX - graphMinX) / 30);
      const candidates = graphGrey.filter((point) => Math.abs(point.x - targetX) <= windowSize);
      if (!candidates.length) return previousY;
      const eligible = hasHorizontalStroke
        ? candidates.filter((point) => Math.abs(point.y - dominantRow[0]) <= 8)
        : candidates;
      if (!eligible.length) return previousY;
      const nearestY = eligible.reduce((best, point) =>
        Math.abs(point.y - previousY) < Math.abs(best - previousY) ? point.y : best,
      eligible[0].y);
      const sameStroke = eligible.filter((point) => Math.abs(point.y - nearestY) <= 5);
      if (sameStroke.length < 2) return previousY;
      previousY = sameStroke.reduce((sum, point) => sum + point.y, 0) / sameStroke.length;
      return previousY;
    });
  };
  const mainRaw = sampleRawLine(pink);
  const typicalRaw = sampleGreyLine();
  const normalizeLine = (points: number[]) => points.map((point) =>
    Math.max(5, Math.min(155, 5 + ((point - plotTop) / Math.max(1, plotBottom - plotTop)) * 150)),
  );
  const visibleUntil = (lineMaxX: number) => {
    const index = Math.round(((lineMaxX - graphMinX) / Math.max(1, graphMaxX - graphMinX)) * (GRAPH_POINT_COUNT - 1));
    return index >= GRAPH_POINT_COUNT - 1 ? -1 : Math.max(1, index);
  };
  return {
    id: `uploaded-${Date.now()}`,
    name: file.name.replace(/\.[^.]+$/, "").slice(0, 36) || "Uploaded pattern",
    main: normalizeLine(mainRaw),
    typical: normalizeLine(typicalRaw),
    mainVisibleUntil: visibleUntil(maxX),
    typicalVisibleUntil: visibleUntil(greyMaxX),
  };
}

const defaultData = {
  title: "Reel Insights",
  accountsReachedLabel: "Accounts reached",
  likes: "739",
  comments: "5",
  reposts: "34",
  shares: "189",
  saves: "102",
  views: "73,348",
  reached: "68,549",
  avgWatch: "22s",
  follows: "18",
  chartMax: "74K",
  chartMid: "37K",
  chartYAxisAuto: true,
  skipRate: "12.7%",
  shareRate: "0.3%",
  likeRate: "1.0%",
  saveRate: "0.2%",
  repostRate: "0.1%",
  commentRate: "0.1%",
  eFollows: "18",
  eProfileVisits: "129",
  eLikes: "739",
  eComments: "5",
  eReposts: "34",
  eShares: "189",
  eSaves: "102",
  audFollowers: "8.3%",
  audNonFollowers: "91.7%",
  c1Name: "United States",
  c1Val: "51.3%",
  c2Name: "United Kingdom",
  c2Val: "13.7%",
  c3Name: "Canada",
  c3Val: "9.2%",
  c4Name: "Australia",
  c4Val: "4.9%",
  c5Name: "France",
  c5Val: "2.1%",
  a1: "9.6%",
  a2: "12.9%",
  a3: "59.1%",
  a4: "15.5%",
  a5: "0.9%",
  a6: "1.4%",
  gMen: "58.4%",
  gWomen: "41.6%",
  src1Name: "Reels tab",
  src1Val: "58.4%",
  src2Name: "Explore",
  src2Val: "16.1%",
  src3Name: "Profile",
  src3Val: "7.5%",
  src4Name: "Feed",
  src4Val: "3.8%",
  src5Name: "Stories",
  src5Val: "0.2%",
  viewsX0: "0",
  viewsX1: "6h",
  viewsX2: "12h",
  watchYTop: "100%",
  watchYMid: "50%",
  watchX0: "0:00",
  watchX1: "0:56",
  likesYTop: "20%",
  likesYMid: "10%",
  likesX0: "0:00",
  likesX1: "0:56",
  viewsMain: defaultViewsMain,
  viewsTypical: defaultViewsTypical,
  watch: defaultWatch,
  likesOverTime: defaultLikes,
  viewsMainVisibleUntil: -1,
  viewsTypicalVisibleUntil: -1,
  watchVisibleUntil: -1,
  likesVisibleUntil: -1,
};

type DataShape = typeof defaultData;
type Tab = "Overview" | "Engagement" | "Audience";
type AudTab = "Age" | "Country" | "Gender";
type AccessState = "checking" | "allowed" | "activation-required";

function numericCount(value: string) {
  const normalized = value.trim().replace(/,/g, "");
  const match = normalized.match(/^([\d.]+)\s*([kmb])?$/i);
  if (!match) return null;
  const multiplier = { k: 1_000, m: 1_000_000, b: 1_000_000_000 }[
    (match[2]?.toLowerCase() ?? "") as "k" | "m" | "b"
  ] ?? 1;
  const count = Number(match[1]) * multiplier;
  return Number.isFinite(count) ? Math.round(count) : null;
}

function compactAxisCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 100_000 ? 0 : 1,
  }).format(value);
}

function syncViewsYAxis(data: DataShape, views: string): DataShape {
  const count = numericCount(views);
  if (count === null) return { ...data, views };
  const reduction = 0.1 + Math.random() * 0.05;
  const reached = new Intl.NumberFormat("en-US").format(
    Math.round(count * (1 - reduction)),
  );
  if (!data.chartYAxisAuto) return { ...data, views, reached };
  return {
    ...data,
    views,
    reached,
    chartMax: compactAxisCount(count),
    chartMid: compactAxisCount(Math.round(count / 2)),
  };
}

function randomUnitedStatesAudience() {
  return `${(40.1 + Math.random() * 14.9).toFixed(1)}%`;
}

function randomAgeAudience() {
  const dominantTenths = 400 + Math.floor(Math.random() * 101);
  const remainingTenths = 1000 - dominantTenths;
  const weights = Array.from({ length: 5 }, () => 0.25 + Math.random());
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const exactShares = weights.map((weight) => (weight / totalWeight) * remainingTenths);
  const shares = exactShares.map(Math.floor);
  let leftover = remainingTenths - shares.reduce((sum, value) => sum + value, 0);
  exactShares
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)
    .forEach(({ index }) => {
      if (leftover > 0) { shares[index] += 1; leftover -= 1; }
    });
  const percentage = (tenths: number) => `${(tenths / 10).toFixed(1)}%`;
  return {
    a1: percentage(shares[0]), a2: percentage(shares[1]),
    a3: percentage(dominantTenths), a4: percentage(shares[2]),
    a5: percentage(shares[3]), a6: percentage(shares[4]),
  };
}

const COUNTRY_AUDIENCE_POOL = [
  "United Kingdom", "Canada", "Australia", "Philippines", "France",
  "Switzerland", "Norway", "Ireland", "Netherlands", "New Zealand",
];

function distributeTenths(total: number, weights: number[]) {
  const safeWeights = weights.some((weight) => weight > 0)
    ? weights.map((weight) => Math.max(0, weight))
    : weights.map(() => 1);
  const weightTotal = safeWeights.reduce((sum, weight) => sum + weight, 0);
  const exact = safeWeights.map((weight) => (weight / weightTotal) * total);
  const result = exact.map(Math.floor);
  let leftover = total - result.reduce((sum, value) => sum + value, 0);
  exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)
    .forEach(({ index }) => {
      if (leftover > 0) { result[index] += 1; leftover -= 1; }
    });
  return result;
}

function randomCountryAudience() {
  const countries = [...COUNTRY_AUDIENCE_POOL];
  for (let index = countries.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [countries[index], countries[swapIndex]] = [countries[swapIndex], countries[index]];
  }
  const unitedStatesTenths = 400 + Math.floor(Math.random() * 151);
  const shares = distributeTenths(
    1000 - unitedStatesTenths,
    Array.from({ length: 4 }, () => 0.25 + Math.random()),
  );
  const rankedCountries = countries
    .slice(0, 4)
    .map((name, index) => ({ name, tenths: shares[index] }))
    .sort((a, b) => b.tenths - a.tenths);
  const percentage = (tenths: number) => `${(tenths / 10).toFixed(1)}%`;
  return {
    c1Name: "United States", c1Val: percentage(unitedStatesTenths),
    c2Name: rankedCountries[0].name, c2Val: percentage(rankedCountries[0].tenths),
    c3Name: rankedCountries[1].name, c3Val: percentage(rankedCountries[1].tenths),
    c4Name: rankedCountries[2].name, c4Val: percentage(rankedCountries[2].tenths),
    c5Name: rankedCountries[3].name, c5Val: percentage(rankedCountries[3].tenths),
  };
}

let lamaSessionPromise: Promise<import("onnxruntime-web").InferenceSession> | null = null;

async function getLamaSession() {
  if (!lamaSessionPromise) {
    lamaSessionPromise = import("onnxruntime-web").then(async (ort) => {
      ort.env.wasm.numThreads = 1;
      return ort.InferenceSession.create("/models/lama_512_int8.onnx", {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });
    });
  }
  return lamaSessionPromise;
}

async function cleanedThumbnail(source: string) {
  const response = await fetch(`/api/download-thumbnail?url=${encodeURIComponent(source)}`);
  if (!response.ok) throw new Error("Could not load the thumbnail for cleanup.");
  const bitmap = await createImageBitmap(await response.blob());
  const edgeCrop = Math.round(Math.min(bitmap.width, bitmap.height) * 0.035);
  const sourceWidth = bitmap.width - edgeCrop * 2;
  const sourceHeight = bitmap.height - edgeCrop * 2;
  const scale = Math.min(1, 1080 / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Thumbnail editing is unavailable in this browser.");
  context.drawImage(bitmap, edgeCrop, edgeCrop, sourceWidth, sourceHeight, 0, 0, width, height);
  bitmap.close();

  const modelSize = 512;
  const modelCanvas = document.createElement("canvas");
  modelCanvas.width = modelSize;
  modelCanvas.height = modelSize;
  const modelContext = modelCanvas.getContext("2d", { willReadFrequently: true });
  if (!modelContext) throw new Error("AI thumbnail editing is unavailable.");
  modelContext.drawImage(canvas, 0, 0, modelSize, modelSize);
  const modelPixels = modelContext.getImageData(0, 0, modelSize, modelSize).data;
  const plane = modelSize * modelSize;
  const input = new Float32Array(plane * 4);
  const center = (modelSize - 1) / 2;
  const maskRadius = modelSize * 0.155;
  for (let y = 0; y < modelSize; y++) {
    for (let x = 0; x < modelSize; x++) {
      const pixel = y * modelSize + x;
      const masked = (x - center) ** 2 + (y - center) ** 2 <= maskRadius ** 2;
      input[pixel] = masked ? 0 : modelPixels[pixel * 4] / 255;
      input[plane + pixel] = masked ? 0 : modelPixels[pixel * 4 + 1] / 255;
      input[plane * 2 + pixel] = masked ? 0 : modelPixels[pixel * 4 + 2] / 255;
      input[plane * 3 + pixel] = masked ? 1 : 0;
    }
  }

  const ort = await import("onnxruntime-web");
  const session = await getLamaSession();
  const results = await session.run({ input: new ort.Tensor("float32", input, [1, 4, modelSize, modelSize]) });
  const output = results.output.data as Float32Array;
  const outputPixels = modelContext.createImageData(modelSize, modelSize);
  for (let pixel = 0; pixel < plane; pixel++) {
    outputPixels.data[pixel * 4] = Math.max(0, Math.min(255, Math.round(output[pixel] * 255)));
    outputPixels.data[pixel * 4 + 1] = Math.max(0, Math.min(255, Math.round(output[plane + pixel] * 255)));
    outputPixels.data[pixel * 4 + 2] = Math.max(0, Math.min(255, Math.round(output[plane * 2 + pixel] * 255)));
    outputPixels.data[pixel * 4 + 3] = 255;
  }
  modelContext.putImageData(outputPixels, 0, 0);

  const patch = document.createElement("canvas");
  patch.width = width;
  patch.height = height;
  const patchContext = patch.getContext("2d");
  if (!patchContext) throw new Error("AI result compositing is unavailable.");
  patchContext.drawImage(modelCanvas, 0, 0, width, height);
  patchContext.globalCompositeOperation = "destination-in";
  const resultRadius = Math.min(width, height) * 0.155;
  const gradient = patchContext.createRadialGradient(width / 2, height / 2, resultRadius * 0.82, width / 2, height / 2, resultRadius);
  gradient.addColorStop(0, "rgba(0,0,0,1)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  patchContext.fillStyle = gradient;
  patchContext.fillRect(0, 0, width, height);
  context.drawImage(patch, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.92);
}

function useLocalData() {
  const [data, setData] = useState<DataShape>(defaultData);
  const latestDataRef = useRef<DataShape>(defaultData);
  const pendingSaveRef = useRef<DataShape | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const flushPendingSave = () => {
    if (!pendingSaveRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingSaveRef.current));
      pendingSaveRef.current = null;
    } catch {}
  };
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<DataShape>;
        const viewsMain = stored.viewsMain ?? defaultViewsMain;
        const viewsTypical = stored.viewsTypical ?? defaultViewsTypical;
        const watch = stored.watch ?? defaultWatch;
        const likesOverTime = stored.likesOverTime ?? defaultLikes;
        const restoredData = {
          ...defaultData,
          ...stored,
          ...(stored.viewsX2 && parseGraphDuration(stored.viewsX2) !== null
            ? { viewsX0: defaultData.viewsX0, viewsX1: defaultData.viewsX1, viewsX2: defaultData.viewsX2 }
            : {}),
          viewsMain: resamplePoints(viewsMain),
          viewsTypical: resamplePoints(viewsTypical),
          watch: resamplePoints(watch),
          likesOverTime: resamplePoints(likesOverTime),
          viewsMainVisibleUntil: remapVisibleUntil(stored.viewsMainVisibleUntil ?? -1, viewsMain.length),
          viewsTypicalVisibleUntil: remapVisibleUntil(stored.viewsTypicalVisibleUntil ?? -1, viewsTypical.length),
          watchVisibleUntil: remapVisibleUntil(stored.watchVisibleUntil ?? -1, watch.length),
          likesVisibleUntil: remapVisibleUntil(stored.likesVisibleUntil ?? -1, likesOverTime.length),
        };
        latestDataRef.current = restoredData;
        setData(restoredData);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const flushOnHide = () => {
      if (document.visibilityState === "hidden") flushPendingSave();
    };
    window.addEventListener("pagehide", flushPendingSave);
    window.addEventListener("beforeunload", flushPendingSave);
    document.addEventListener("visibilitychange", flushOnHide);
    return () => {
      window.removeEventListener("pagehide", flushPendingSave);
      window.removeEventListener("beforeunload", flushPendingSave);
      document.removeEventListener("visibilitychange", flushOnHide);
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
      flushPendingSave();
    };
  }, []);

  const save = (next: DataShape) => {
    latestDataRef.current = next;
    setData(next);
    pendingSaveRef.current = next;
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null;
      flushPendingSave();
    }, 250);
  };
  const set = <K extends keyof DataShape>(key: K, value: DataShape[K]) => {
    const mirrors: Partial<Record<keyof DataShape, keyof DataShape>> = {
      likes: "eLikes", eLikes: "likes",
      comments: "eComments", eComments: "comments",
      reposts: "eReposts", eReposts: "reposts",
      shares: "eShares", eShares: "shares",
      saves: "eSaves", eSaves: "saves",
      follows: "eFollows", eFollows: "follows",
    };
    const mirror = mirrors[key];
    save({ ...latestDataRef.current, [key]: value, ...(mirror ? { [mirror]: value } : {}) });
  };
  return { data, set, save, flushPendingSave };
}

function AccessGate() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0c0f14] p-6 text-white">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-fuchsia-400">
          EditFlow
        </p>
        <p className="mt-3 text-sm text-zinc-400">Checking access…</p>
      </div>
    </main>
  );
}

function Editable({
  value,
  onChange,
  className,
  style,
  as: As = "span",
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "div" | "h1";
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  return (
    <As
      ref={ref as never}
      className={
        "outline-none rounded-sm px-0.5 -mx-0.5 hover:bg-white/5 focus:bg-white/10 focus:ring-1 focus:ring-[#eb22d4]/70 transition-colors cursor-text " +
        (className ?? "")
      }
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      aria-label={ariaLabel}
      onBlur={(event) => {
        const text = (event.currentTarget.textContent ?? "").trim();
        if (text !== value) onChange(text);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          (event.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {value}
    </As>
  );
}

const IG_ICON_FILTER = "brightness(0) invert(1)";
function IgIcon({
  src,
  className,
  alt,
}: {
  src: string;
  className?: string;
  alt: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={"select-none object-contain " + (className ?? "")}
      style={{ filter: IG_ICON_FILTER }}
    />
  );
}
function IgHeart(props: { className?: string }) {
  return <IgIcon src={icHeart} alt="Likes" className={props.className} />;
}
function IgComment(props: { className?: string }) {
  return <IgIcon src={icComment} alt="Comments" className={props.className} />;
}
function IgRepost(props: { className?: string }) {
  return <IgIcon src={icRepost} alt="Reposts" className={props.className} />;
}
function IgShare(props: { className?: string }) {
  return <IgIcon src={icShare} alt="Shares" className={props.className} />;
}
function IgBookmark(props: { className?: string }) {
  return <IgIcon src={icBookmark} alt="Saves" className={props.className} />;
}

function ReelInsightsPage() {
  const navigate = useNavigate();
  const [access, setAccess] = useState<AccessState>("checking");
  const { data, set, save, flushPendingSave } = useLocalData();
  const [tab, setTab] = useState<Tab>("Overview");
  const [audTab, setAudTab] = useState<AudTab>("Country");
  const [viewsTab, setViewsTab] = useState<
    "All" | "Followers" | "Non-followers"
  >("All");
  const [savedToast, setSavedToast] = useState(false);
  const [editing, setEditing] = useState(true);
  const [viewsEditableLine, setViewsEditableLine] = useState<"main" | "typical">("main");
  const [thumb, setThumb] = useState<string>(reelThumb);
  const [chartThumb, setChartThumb] = useState<string>(reelThumb);
  const [importedThumb, setImportedThumb] = useState("");
  const [isTrendMenuOpen, setIsTrendMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [topGap, setTopGap] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [reelUrl, setReelUrl] = useState("");
  const [importError, setImportError] = useState("");
  const [importNotice, setImportNotice] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [thumbnailImportMode, setThumbnailImportMode] = useState<"cleaned" | "original">("cleaned");
  const [isViewsTemplateOpen, setIsViewsTemplateOpen] = useState(false);
  const [savedViewsTemplates, setSavedViewsTemplates] = useState<ViewsTemplate[]>([]);
  const [isWatchTemplateOpen, setIsWatchTemplateOpen] = useState(false);
  const [savedWatchTemplates, setSavedWatchTemplates] = useState<WatchTemplate[]>([]);
  const [isLikesTemplateOpen, setIsLikesTemplateOpen] = useState(false);
  const [savedLikesTemplates, setSavedLikesTemplates] = useState<WatchTemplate[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const chartFileRef = useRef<HTMLInputElement | null>(null);
  const importSequenceRef = useRef(0);
  const editedAgeKeysRef = useRef(new Set<"a1" | "a2" | "a3" | "a4" | "a5" | "a6">());

  useEffect(() => {
    if (!importNotice) return;
    const timeout = window.setTimeout(() => setImportNotice(""), 2_000);
    return () => window.clearTimeout(timeout);
  }, [importNotice]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEWS_TEMPLATES_KEY);
      if (stored) setSavedViewsTemplates(JSON.parse(stored) as ViewsTemplate[]);
    } catch {}
  }, []);

  useEffect(() => {
    try { setTopGap(localStorage.getItem(TOP_GAP_KEY) === "on"); } catch {}
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(AGE_EDITED_KEYS_KEY) ?? "[]") as string[];
      editedAgeKeysRef.current = new Set(
        stored.filter((key): key is "a1" | "a2" | "a3" | "a4" | "a5" | "a6" =>
          ["a1", "a2", "a3", "a4", "a5", "a6"].includes(key),
        ),
      );
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKES_TEMPLATES_KEY);
      if (stored) setSavedLikesTemplates(JSON.parse(stored) as WatchTemplate[]);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCH_TEMPLATES_KEY);
      if (stored) setSavedWatchTemplates(JSON.parse(stored) as WatchTemplate[]);
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;

    // Keep local development testable without weakening production licensing.
    if (import.meta.env.DEV) {
      setAccess("allowed");
      return () => {
        active = false;
      };
    }

    const revokeAccess = () => {
      if (!active) return;
      clearSession();
      setAccess("activation-required");
      void navigate({ to: "/activate", replace: true });
    };

    const checkLicense = async () => {
      const session = loadSession();
      if (!session || new Date(session.expiresAt) <= new Date()) {
        revokeAccess();
        return;
      }

      if (active) setAccess("allowed");

      try {
        await getLicenseStatus(session.token);
      } catch {
        // Offline use stays allowed while the token is still valid.
        // An online rejection means the license was removed, disabled, expired, or moved.
        if (navigator.onLine) revokeAccess();
      }
    };

    void checkLicense();

    const intervalId = window.setInterval(() => {
      void checkLicense();
    }, LICENSE_REVALIDATE_MS);

    const handleWindowFocus = () => {
      void checkLicense();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void checkLicense();
    };

    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("online", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("online", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  useEffect(() => {
    try {
      const storedThumb = localStorage.getItem("reel-insights-thumb");
      const storedChartThumb = localStorage.getItem("reel-insights-chart-thumb");
      const storedImportedThumb = localStorage.getItem("reel-insights-imported-thumb-url");
      if (storedThumb) setThumb(storedThumb);
      setChartThumb(storedChartThumb || storedThumb || reelThumb);
      if (storedImportedThumb) setImportedThumb(storedImportedThumb);
    } catch {}
  }, []);

  if (access !== "allowed") return <AccessGate />;

  const onPickThumb = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setThumb(image);
      setChartThumb(image);
      try {
        localStorage.setItem("reel-insights-thumb", image);
        localStorage.setItem("reel-insights-chart-thumb", image);
      } catch {}
    };
    reader.readAsDataURL(file);
  };
  const onPickChartThumb = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setChartThumb(image);
      try { localStorage.setItem("reel-insights-chart-thumb", image); } catch {}
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  const downloadImportedThumbnail = async () => {
    if (!importedThumb) return;
    try {
      const response = await fetch(importedThumb.startsWith("data:") ? importedThumb : `/api/download-thumbnail?url=${encodeURIComponent(importedThumb)}`);
      if (!response.ok) throw new Error("Download failed");
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "imported-reel-thumbnail.jpg";
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(importedThumb, "_blank", "noopener,noreferrer");
    } finally {
      setIsTrendMenuOpen(false);
    }
  };
  const handleHeaderSave = () => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    save(data);
    flushPendingSave();
    setEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1400);
  };
  const syncedDurationFields = (endLabel: string) => {
    return {
      watchX1: endLabel,
      likesX1: endLabel,
    };
  };
  const setSyncedGraphDuration = (endLabel: string) =>
    save({ ...data, ...syncedDurationFields(endLabel) });
  const setSyncedGraphStart = (startLabel: string) =>
    save({ ...data, watchX0: startLabel, likesX0: startLabel });
  const persistViewsTemplates = (templates: ViewsTemplate[]) => {
    setSavedViewsTemplates(templates);
    try { localStorage.setItem(VIEWS_TEMPLATES_KEY, JSON.stringify(templates)); } catch {}
  };
  const applyViewsTemplate = (template: ViewsTemplate) => {
    const main = resamplePoints(template.main);
    const typical = resamplePoints(template.typical);
    save({
      ...data,
      viewsMain: main,
      viewsTypical: typical,
      viewsMainVisibleUntil: remapVisibleUntil(template.mainVisibleUntil, template.main.length),
      viewsTypicalVisibleUntil: remapVisibleUntil(template.typicalVisibleUntil, template.typical.length),
    });
    setEditing(true);
    setIsViewsTemplateOpen(false);
  };
  const saveCurrentViewsTemplate = () => {
    const template: ViewsTemplate = {
      id: `saved-${Date.now()}`,
      name: `Saved pattern ${savedViewsTemplates.length + 1}`,
      main: data.viewsMain.slice(),
      typical: data.viewsTypical.slice(),
      mainVisibleUntil: data.viewsMainVisibleUntil,
      typicalVisibleUntil: data.viewsTypicalVisibleUntil,
    };
    persistViewsTemplates([...savedViewsTemplates, template]);
  };
  const deleteViewsTemplate = (templateId: string) => {
    persistViewsTemplates(savedViewsTemplates.filter((template) => template.id !== templateId));
  };
  const uploadViewsTemplate = async (file: File) => {
    const template = await graphPatternFromImage(file);
    persistViewsTemplates([...savedViewsTemplates, template]);
    applyViewsTemplate(template);
  };
  const persistWatchTemplates = (templates: WatchTemplate[]) => {
    setSavedWatchTemplates(templates);
    try { localStorage.setItem(WATCH_TEMPLATES_KEY, JSON.stringify(templates)); } catch {}
  };
  const applyWatchTemplate = (template: WatchTemplate) => {
    save({
      ...data,
      watch: resamplePoints(template.points),
      watchVisibleUntil: remapVisibleUntil(template.visibleUntil, template.points.length),
      ...syncedDurationFields(template.xEnd),
    });
    setEditing(true);
    setIsWatchTemplateOpen(false);
  };
  const saveCurrentWatchTemplate = () => persistWatchTemplates([...savedWatchTemplates, {
    id: `watch-saved-${Date.now()}`,
    name: `Saved retention ${savedWatchTemplates.length + 1}`,
    points: data.watch.slice(), visibleUntil: data.watchVisibleUntil, xEnd: data.watchX1,
  }]);
  const deleteWatchTemplate = (templateId: string) =>
    persistWatchTemplates(savedWatchTemplates.filter((template) => template.id !== templateId));
  const uploadWatchTemplate = async (file: File) => {
    const traced = await watchPatternFromImage(file);
    const template = { ...traced, xEnd: data.watchX1 };
    persistWatchTemplates([...savedWatchTemplates, template]);
    applyWatchTemplate(template);
  };
  const persistLikesTemplates = (templates: WatchTemplate[]) => {
    setSavedLikesTemplates(templates);
    try { localStorage.setItem(LIKES_TEMPLATES_KEY, JSON.stringify(templates)); } catch {}
  };
  const applyLikesTemplate = (template: WatchTemplate) => {
    save({
      ...data,
      likesOverTime: resamplePoints(template.points),
      likesVisibleUntil: remapVisibleUntil(template.visibleUntil, template.points.length),
      ...syncedDurationFields(template.xEnd),
      likesYTop: template.yTop ?? data.likesYTop, likesYMid: template.yMid ?? data.likesYMid,
    });
    setEditing(true); setIsLikesTemplateOpen(false);
  };
  const saveCurrentLikesTemplate = () => persistLikesTemplates([...savedLikesTemplates, {
    id: `likes-saved-${Date.now()}`, name: `Saved likes pattern ${savedLikesTemplates.length + 1}`,
    points: data.likesOverTime.slice(), visibleUntil: data.likesVisibleUntil, xEnd: data.likesX1,
    yTop: data.likesYTop, yMid: data.likesYMid,
  }]);
  const deleteLikesTemplate = (templateId: string) =>
    persistLikesTemplates(savedLikesTemplates.filter((template) => template.id !== templateId));
  const uploadLikesTemplate = async (file: File) => {
    const traced = await watchPatternFromImage(file, GRAPH_POINT_COUNT);
    const template = { ...traced, id: `likes-uploaded-${Date.now()}`, xEnd: data.likesX1, yTop: data.likesYTop, yMid: data.likesYMid };
    persistLikesTemplates([...savedLikesTemplates, template]); applyLikesTemplate(template);
  };
  const setComplementaryPercentage = (
    key: "audFollowers" | "audNonFollowers" | "gMen" | "gWomen",
    oppositeKey: "audFollowers" | "audNonFollowers" | "gMen" | "gWomen",
    value: string,
  ) => {
    const percentage = parsePct(value);
    const opposite = Math.round((100 - percentage) * 10) / 10;
    save({ ...data, [key]: value, [oppositeKey]: `${opposite}%` });
  };
  const updateCountryPercentage = (
    changedKey: "c1Val" | "c2Val" | "c3Val" | "c4Val" | "c5Val",
    value: string,
  ) => {
    const percentage = Math.round(Math.min(100, Math.max(0, parsePct(value))) * 10) / 10;
    const nextValues = { ...data, [changedKey]: `${percentage.toFixed(1)}%` };
    const rankedCountries = ([2, 3, 4, 5] as const)
      .map((row) => ({
        name: nextValues[`c${row}Name`],
        value: nextValues[`c${row}Val`],
      }))
      .sort((a, b) => parsePct(b.value) - parsePct(a.value));
    const updates: Partial<DataShape> = {
      c1Val: nextValues.c1Val,
    };
    const rankedKeys = [
      ["c2Name", "c2Val"], ["c3Name", "c3Val"],
      ["c4Name", "c4Val"], ["c5Name", "c5Val"],
    ] as const;
    rankedCountries.forEach((country, index) => {
      const [nameKey, valueKey] = rankedKeys[index];
      updates[nameKey] = country.name;
      updates[valueKey] = country.value;
    });
    save({ ...data, ...updates });
  };
  const generateAgeAudience = () => {
    editedAgeKeysRef.current.clear();
    try { localStorage.removeItem(AGE_EDITED_KEYS_KEY); } catch {}
    setEditing(true);
    save({ ...data, ...randomAgeAudience() });
  };
  const updateAgePercentage = (
    changedKey: "a1" | "a2" | "a3" | "a4" | "a5" | "a6",
    value: string,
  ) => {
    const keys = ["a1", "a2", "a3", "a4", "a5", "a6"] as const;
    const previouslyEdited = keys.filter(
      (key) => key !== changedKey && editedAgeKeysRef.current.has(key),
    );
    const previousEditedTenths = previouslyEdited.reduce(
      (sum, key) => sum + Math.round(parsePct(data[key]) * 10),
      0,
    );
    const changedTenths = Math.min(
      1000 - previousEditedTenths,
      Math.round(Math.min(100, Math.max(0, parsePct(value))) * 10),
    );
    editedAgeKeysRef.current.add(changedKey);
    const unlockedKeys = keys.filter((key) => !editedAgeKeysRef.current.has(key));
    const lockedTotal = previousEditedTenths + changedTenths;
    const unlockedShares = unlockedKeys.length > 0
      ? distributeTenths(1000 - lockedTotal, unlockedKeys.map((key) => parsePct(data[key])))
      : [];
    const updates: Partial<DataShape> = {
      [changedKey]: `${(changedTenths / 10).toFixed(1)}%`,
    };
    unlockedKeys.forEach((key, index) => {
      updates[key] = `${(unlockedShares[index] / 10).toFixed(1)}%`;
    });
    try {
      localStorage.setItem(AGE_EDITED_KEYS_KEY, JSON.stringify([...editedAgeKeysRef.current]));
    } catch {}
    save({ ...data, ...updates });
  };
  const openImport = () => {
    setImportError("");
    setImportNotice("");
    setIsMoreMenuOpen(false);
    setIsImportOpen(true);
  };
  const toggleTopGap = () => {
    setTopGap((current) => {
      const next = !current;
      try { localStorage.setItem(TOP_GAP_KEY, next ? "on" : "off"); } catch {}
      return next;
    });
  };
  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const importSequence = ++importSequenceRef.current;
    setImportError("");
    setImportNotice("");
    try {
      setIsImporting(true);
      const result = await importPublicInstagramReel(reelUrl);
      const imported = result.reel;
      setEditing(true);
      const count = (value: number | null) =>
        value === null ? undefined : new Intl.NumberFormat("en-US").format(value);
      const durationLabel = imported.duration === null ? undefined : formatGraphDuration(imported.duration);
      const applyCount = (key: string, value: number | null) =>
        value === null ? {} : { [key]: count(value)! };
      const next = {
        ...data,
        c1Val: randomUnitedStatesAudience(),
        ...applyCount("likes", imported.likes), ...applyCount("eLikes", imported.likes),
        ...applyCount("comments", imported.comments), ...applyCount("eComments", imported.comments),
        ...applyCount("reposts", imported.reposts), ...applyCount("eReposts", imported.reposts),
        ...applyCount("shares", imported.shares), ...applyCount("eShares", imported.shares),
        ...applyCount("saves", imported.saves), ...applyCount("eSaves", imported.saves),
        ...(durationLabel ? {
          watchX0: "0:00", watchX1: durationLabel,
          likesX0: "0:00", likesX1: durationLabel,
        } : {}),
      };
      save(imported.views === null ? next : syncViewsYAxis(next, count(imported.views)!));
      if (imported.thumbnail) {
        const applyImportedThumbnail = (selectedThumbnail: string) => {
          if (importSequenceRef.current !== importSequence) return;
          setThumb(selectedThumbnail);
          setChartThumb(selectedThumbnail);
          setImportedThumb(selectedThumbnail);
          localStorage.setItem("reel-insights-thumb", selectedThumbnail);
          localStorage.setItem("reel-insights-chart-thumb", selectedThumbnail);
          localStorage.setItem("reel-insights-imported-thumb-url", selectedThumbnail);
        };
        // Complete the import immediately. AI cleanup is intentionally
        // background work because its first run downloads the local model.
        applyImportedThumbnail(imported.thumbnail);
        if (thumbnailImportMode === "cleaned") {
          void cleanedThumbnail(imported.thumbnail)
            .then((cleaned) => {
              applyImportedThumbnail(cleaned);
              if (importSequenceRef.current === importSequence)
                setImportNotice("Cleaned thumbnail applied.");
            })
            .catch(() => {
              if (importSequenceRef.current === importSequence)
                setImportNotice("Reel imported; the original thumbnail was kept because cleanup was unavailable.");
            });
        }
      }
      setImportNotice(thumbnailImportMode === "cleaned" ? "Reel details imported. Thumbnail cleanup is continuing." : "Reel details imported with the original thumbnail.");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Could not import that reel.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0c0f14] text-zinc-100"
      style={{ fontFamily: "'Roboto', system-ui, -apple-system, sans-serif" }}
    >
      <div className="mx-auto max-w-md pb-6">
        <header
          className="sticky top-0 z-20 flex items-center gap-3 bg-[#0c0f14]/95 px-4 pb-3 pt-4 backdrop-blur"
          style={{ paddingTop: topGap ? "calc(env(safe-area-inset-top, 0px) + 2.5rem)" : undefined }}
        >
          <button
            aria-label="Back"
            className="-ml-1 p-1 text-white/75 hover:text-zinc-100"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.25} />
          </button>
          <button
            onClick={handleHeaderSave}
            onDoubleClick={() => setEditing(true)}
            className="flex-1 text-left"
            title="Click title to save · double-click to edit graphs"
          >
            <Editable
              as="h1"
              value={data.title}
              onChange={(value) => set("title", value)}
              className="text-[22px] font-semibold tracking-tight"
              ariaLabel="Page title"
            />
          </button>
          <div className="relative">
            <button onClick={() => setIsTrendMenuOpen((open) => !open)} aria-label="Thumbnail options" aria-expanded={isTrendMenuOpen} className="p-1 text-zinc-100 hover:text-white">
              <TrendingUp className="h-6 w-6" strokeWidth={2.25} />
            </button>
            {isTrendMenuOpen && (
              <div className="absolute right-0 top-10 z-30 w-56 rounded-xl border border-white/15 bg-zinc-950 p-1.5 shadow-2xl">
                <button type="button" disabled={!importedThumb} onClick={downloadImportedThumbnail} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/35">
                  {importedThumb ? "Download imported thumbnail" : "Import a thumbnail first"}
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setIsMoreMenuOpen((open) => !open);
                setIsTrendMenuOpen(false);
              }}
              aria-label="More options"
              aria-expanded={isMoreMenuOpen}
              className="p-1 text-zinc-100 hover:text-white"
            >
              <MoreVertical className="h-6 w-6" strokeWidth={2.25} />
            </button>
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-white/15 bg-zinc-950 p-1.5 shadow-2xl">
                <button
                  type="button"
                  onClick={openImport}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-white/10"
                >
                  Import Instagram reel
                </button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={topGap}
                  onClick={toggleTopGap}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-white/10"
                >
                  <span>Top gap</span>
                  <span className={"relative h-5 w-9 rounded-full transition-colors " + (topGap ? "bg-[#eb22d4]" : "bg-white/20")}>
                    <span className={"absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform " + (topGap ? "translate-x-[18px]" : "translate-x-0.5")} />
                  </span>
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex justify-center pt-4">
          <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative h-[190px] w-[130px] overflow-hidden rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#eb22d4]"
              aria-label="Change thumbnail"
            >
              <img
                src={thumb}
                alt="Reel thumbnail"
                className="h-full w-full object-cover"
                decoding="async"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[11px] text-white opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
                Change photo
              </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickThumb}
          />
          <input ref={chartFileRef} type="file" accept="image/*" className="hidden" onChange={onPickChartThumb} />
        </div>
        <div className="mt-5 grid grid-cols-5 gap-2 px-6">
          <StatIcon
            icon={<IgHeart className="h-6 w-6" />}
            value={data.likes}
            onChange={(value) => set("likes", value)}
          />
          <StatIcon
            icon={<IgComment className="h-6 w-6" />}
            value={data.comments}
            onChange={(value) => set("comments", value)}
          />
          <StatIcon
            icon={<IgRepost className="h-6 w-6" />}
            value={data.reposts}
            onChange={(value) => set("reposts", value)}
          />
          <StatIcon
            icon={<IgShare className="h-6 w-6" />}
            value={data.shares}
            onChange={(value) => set("shares", value)}
          />
          <StatIcon
            icon={<IgBookmark className="h-6 w-6" />}
            value={data.saves}
            onChange={(value) => set("saves", value)}
          />
        </div>
        <div className="mt-5 grid grid-cols-3 border-b border-white/10 px-2">
          {(["Overview", "Engagement", "Audience"] as Tab[]).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={
                "relative py-3 text-[15px] font-medium " +
                (tab === item ? "text-zinc-100" : "text-white/45")
              }
            >
              {item}
              {tab === item && (
                <span className="absolute bottom-[-1px] left-1/4 right-1/4 h-0.5 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
        <div className="px-4 pt-5">
          {tab === "Overview" && (
            <>
              <SectionTitle>Summary</SectionTitle>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <SummaryCard
                  label="Views"
                  value={data.views}
                  onChange={(value) => save(syncViewsYAxis(data, value))}
                />
                <SummaryCard
                  label={data.accountsReachedLabel}
                  value={data.reached}
                  onChange={(value) => set("reached", value)}
                  onLabelChange={(value) => set("accountsReachedLabel", value)}
                />
                <SummaryCard
                  label="Average watch time"
                  value={data.avgWatch}
                  onChange={(value) => set("avgWatch", value)}
                />
                <SummaryCard
                  label="Follows"
                  value={data.follows}
                  onChange={(value) => set("follows", value)}
                />
              </div>
              <div className="mt-6">
                <SectionTitle
                  onDoubleClick={() => setIsViewsTemplateOpen(true)}
                  actionTitle="Double-click to open graph templates"
                >
                  Views over time
                </SectionTitle>
                <div className="mt-3 flex gap-2">
                  {(["All", "Followers", "Non-followers"] as const).map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => setViewsTab(item)}
                        className={
                          "rounded-full border px-4 py-1.5 text-[13px] font-medium " +
                          (viewsTab === item
                            ? "border-white bg-white text-black"
                            : "border-white/20 bg-transparent text-white/75")
                        }
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
                <EditableLineChart
                  main={data.viewsMain}
                  typical={data.viewsTypical}
                  onMain={(value) => {
                    setEditing(true);
                    set("viewsMain", value);
                  }}
                  onTypical={(value) => {
                    setEditing(true);
                    set("viewsTypical", value);
                  }}
                  mainVisibleUntil={data.viewsMainVisibleUntil}
                  typicalVisibleUntil={data.viewsTypicalVisibleUntil}
                  onMainVisibleUntil={(value) => set("viewsMainVisibleUntil", value)}
                  onTypicalVisibleUntil={(value) => set("viewsTypicalVisibleUntil", value)}
                  showHandles={editing}
                  editableLine={viewsEditableLine}
                  yTop={data.chartMax}
                  yMid={data.chartMid}
                  onYTop={(value) => save({ ...data, chartMax: value, chartYAxisAuto: false })}
                  onYMid={(value) => save({ ...data, chartMid: value, chartYAxisAuto: false })}
                  xLabelsData={[data.viewsX0, data.viewsX1, data.viewsX2]}
                  onXLabel={(index, value) =>
                    set((["viewsX0", "viewsX1", "viewsX2"] as const)[index], value)}
                  onTemplateRequest={() => setIsViewsTemplateOpen(true)}
                />
                <div className="mt-3 flex items-center gap-4 text-[12px] text-white/80">
                  <button
                    type="button"
                    disabled={!editing}
                    onClick={() => setViewsEditableLine("main")}
                    aria-pressed={editing && viewsEditableLine === "main"}
                    className={"flex items-center gap-1.5 rounded-md px-1 py-0.5 disabled:cursor-default " + (editing && viewsEditableLine !== "main" ? "opacity-45" : "")}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: "#eb22d4" }}
                    />
                    This reel
                  </button>
                  <button
                    type="button"
                    disabled={!editing}
                    onClick={() => setViewsEditableLine("typical")}
                    aria-pressed={editing && viewsEditableLine === "typical"}
                    className={"flex items-center gap-1.5 rounded-md px-1 py-0.5 disabled:cursor-default " + (editing && viewsEditableLine !== "typical" ? "opacity-45" : "")}
                  >
                    <span className="h-2 w-2 rounded-full bg-white/40" />
                    Your typical reel
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <SectionTitle>What impacts your views</SectionTitle>
                <p className="mt-1 text-[13px] text-white/75">
                  Rates are listed in order of importance to reach.
                </p>
                <div className="mt-4 divide-y divide-white/5">
                  <ImpactRow
                    icon={
                      <IgIcon
                        src={ic2Timer}
                        alt="Skip"
                        className="h-[19px] w-[19px]"
                      />
                    }
                    label="Skip rate"
                    value={data.skipRate}
                    onChange={(value) => set("skipRate", value)}
                  />
                  <ImpactRow
                    icon={
                      <IgIcon
                        src={ic2Share}
                        alt="Share"
                        className="h-[19px] w-[19px]"
                      />
                    }
                    label="Share rate"
                    value={data.shareRate}
                    onChange={(value) => set("shareRate", value)}
                  />
                  <ImpactRow
                    icon={
                      <IgIcon
                        src={ic2Heart}
                        alt="Like"
                        className="h-[19px] w-[19px]"
                      />
                    }
                    label="Like rate"
                    value={data.likeRate}
                    onChange={(value) => set("likeRate", value)}
                  />
                  <ImpactRow
                    icon={
                      <IgIcon
                        src={ic2Bookmark}
                        alt="Save"
                        className="h-[19px] w-[19px]"
                      />
                    }
                    label="Save rate"
                    value={data.saveRate}
                    onChange={(value) => set("saveRate", value)}
                  />
                  <ImpactRow
                    icon={
                      <IgIcon
                        src={ic2Repost}
                        alt="Repost"
                        className="h-[19px] w-[19px]"
                      />
                    }
                    label="Repost rate"
                    value={data.repostRate}
                    onChange={(value) => set("repostRate", value)}
                  />
                  <ImpactRow
                    icon={
                      <IgIcon
                        src={ic2Comment}
                        alt="Comment"
                        className="h-[19px] w-[19px]"
                      />
                    }
                    label="Comment rate"
                    value={data.commentRate}
                    onChange={(value) => set("commentRate", value)}
                  />
                </div>
              </div>
              <MediaChart
                title="How long people watched your reel"
                thumb={chartThumb}
                onChangeThumb={() => chartFileRef.current?.click()}
                onTemplateRequest={() => setIsWatchTemplateOpen(true)}
              >
                <EditableSingleChart
                  data={data.watch}
                  onChange={(value) => {
                    setEditing(true);
                    set("watch", value);
                  }}
                  visibleUntil={data.watchVisibleUntil}
                  onVisibleUntil={(value) => set("watchVisibleUntil", value)}
                  showHandles={editing}
                  yTop={data.watchYTop}
                  yMid={data.watchYMid}
                  onYTop={(value) => set("watchYTop", value)}
                  onYMid={(value) => set("watchYMid", value)}
                  xLabelsData={[data.watchX0, data.watchX1]}
                  onXLabel={(index, value) => index === 1
                    ? setSyncedGraphDuration(value)
                    : setSyncedGraphStart(value)}
                  onTemplateRequest={() => setIsWatchTemplateOpen(true)}
                />
              </MediaChart>
              <div className="mt-6">
                <SectionTitle>Top sources of views</SectionTitle>
                <div className="mt-4 space-y-4">
                  <CountryRow
                    name={data.src1Name}
                    val={data.src1Val}
                    onName={(value) => set("src1Name", value)}
                    onVal={(value) => set("src1Val", value)}
                    color={IG_PINK}
                  />
                  <CountryRow
                    name={data.src2Name}
                    val={data.src2Val}
                    onName={(value) => set("src2Name", value)}
                    onVal={(value) => set("src2Val", value)}
                    color={IG_PINK}
                  />
                  <CountryRow
                    name={data.src3Name}
                    val={data.src3Val}
                    onName={(value) => set("src3Name", value)}
                    onVal={(value) => set("src3Val", value)}
                    color={IG_PINK}
                  />
                  <CountryRow
                    name={data.src4Name}
                    val={data.src4Val}
                    onName={(value) => set("src4Name", value)}
                    onVal={(value) => set("src4Val", value)}
                    color={IG_PINK}
                  />
                  <CountryRow
                    name={data.src5Name}
                    val={data.src5Val}
                    onName={(value) => set("src5Name", value)}
                    onVal={(value) => set("src5Val", value)}
                    color={IG_PINK}
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 text-[14px] font-semibold text-white/90">
                  Ad
                </div>
                <button className="flex w-full items-center gap-3 py-2 text-left">
                  <TrendingUp className="h-5 w-5" strokeWidth={2} />
                  <span className="flex-1 text-[15px]">Boost this reel</span>
                  <ChevronRight className="h-5 w-5 text-white/60" />
                </button>
              </div>
            </>
          )}
          {tab === "Engagement" && (
            <>
              <SectionTitle>Actions after viewing</SectionTitle>
              <div className="mt-3 divide-y divide-white/5">
                <SimpleRow
                  label="Follows"
                  value={data.eFollows}
                  onChange={(value) => set("eFollows", value)}
                />
                <SimpleRow
                  label="Profile visits"
                  value={data.eProfileVisits}
                  onChange={(value) => set("eProfileVisits", value)}
                />
              </div>
              <div className="mt-6">
                <SectionTitle>Interactions</SectionTitle>
                <div className="mt-3 divide-y divide-white/5">
                  <SimpleRow
                    label="Likes"
                    value={data.eLikes}
                    onChange={(value) => set("eLikes", value)}
                  />
                  <SimpleRow
                    label="Comments"
                    value={data.eComments}
                    onChange={(value) => set("eComments", value)}
                  />
                  <SimpleRow
                    label="Reposts"
                    value={data.eReposts}
                    onChange={(value) => set("eReposts", value)}
                  />
                  <SimpleRow
                    label="Shares"
                    value={data.eShares}
                    onChange={(value) => set("eShares", value)}
                  />
                  <SimpleRow
                    label="Saves"
                    value={data.eSaves}
                    onChange={(value) => set("eSaves", value)}
                  />
                </div>
              </div>
              <MediaChart title="When people liked your reel" thumb={chartThumb} onChangeThumb={() => chartFileRef.current?.click()} onTemplateRequest={() => setIsLikesTemplateOpen(true)}>
                <EditableSingleChart
                  data={data.likesOverTime}
                  onChange={(value) => {
                    setEditing(true);
                    set("likesOverTime", value);
                  }}
                  visibleUntil={data.likesVisibleUntil}
                  onVisibleUntil={(value) => set("likesVisibleUntil", value)}
                  showHandles={editing}
                  yTop={data.likesYTop}
                  yMid={data.likesYMid}
                  onYTop={(value) => set("likesYTop", value)}
                  onYMid={(value) => set("likesYMid", value)}
                  xLabelsData={[data.likesX0, data.likesX1]}
                  onXLabel={(index, value) => index === 1
                    ? setSyncedGraphDuration(value)
                    : setSyncedGraphStart(value)}
                  onTemplateRequest={() => setIsLikesTemplateOpen(true)}
                />
              </MediaChart>
            </>
          )}
          {tab === "Audience" && (
            <>
              <SectionTitle>Who viewed your reel</SectionTitle>
              <div className="mt-4 space-y-4">
                <BarRow
                  label="Followers"
                  value={data.audFollowers}
                  onChange={(value) => setComplementaryPercentage("audFollowers", "audNonFollowers", value)}
                  pct={parsePct(data.audFollowers)}
                  color={IG_PINK}
                />
                <BarRow
                  label="Non-followers"
                  value={data.audNonFollowers}
                  onChange={(value) => setComplementaryPercentage("audNonFollowers", "audFollowers", value)}
                  pct={parsePct(data.audNonFollowers)}
                  color={IG_PURPLE}
                />
              </div>
              <div className="mt-6">
                <SectionTitle onDoubleClick={() => {
                  if (audTab === "Age") {
                    generateAgeAudience();
                  }
                  if (audTab === "Country") {
                    setEditing(true);
                    save({ ...data, ...randomCountryAudience() });
                  }
                }}>Audience details</SectionTitle>
                <div className="mt-3 flex gap-2">
                  {(["Age", "Country", "Gender"] as AudTab[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setAudTab(item)}
                      onDoubleClick={() => {
                        if (item === "Age") {
                          setAudTab("Age");
                          generateAgeAudience();
                        } else if (item === "Country") {
                          setAudTab("Country");
                          setEditing(true);
                          save({ ...data, ...randomCountryAudience() });
                        }
                      }}
                      title={item === "Age"
                        ? "Double-click to generate age percentages"
                        : item === "Country"
                          ? "Double-click to generate countries and percentages"
                          : undefined}
                      className={
                        "rounded-full border px-4 py-1.5 text-[13px] font-medium " +
                        (audTab === item
                          ? "border-white/20 bg-white/15 text-white"
                          : "border-white/20 bg-transparent text-white/80")
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {audTab === "Country" && (
                  <div className="mt-5 space-y-4">
                    <CountryRow
                      name={data.c1Name}
                      val={data.c1Val}
                      onName={(value) => set("c1Name", value)}
                      onVal={(value) => updateCountryPercentage("c1Val", value)}
                    />
                    <CountryRow
                      name={data.c2Name}
                      val={data.c2Val}
                      onName={(value) => set("c2Name", value)}
                      onVal={(value) => updateCountryPercentage("c2Val", value)}
                    />
                    <CountryRow
                      name={data.c3Name}
                      val={data.c3Val}
                      onName={(value) => set("c3Name", value)}
                      onVal={(value) => updateCountryPercentage("c3Val", value)}
                    />
                    <CountryRow
                      name={data.c4Name}
                      val={data.c4Val}
                      onName={(value) => set("c4Name", value)}
                      onVal={(value) => updateCountryPercentage("c4Val", value)}
                    />
                    <CountryRow
                      name={data.c5Name}
                      val={data.c5Val}
                      onName={(value) => set("c5Name", value)}
                      onVal={(value) => updateCountryPercentage("c5Val", value)}
                    />
                  </div>
                )}
                {audTab === "Age" && (
                  <div className="mt-5 space-y-4">
                    <BarRow
                      label="13-17"
                      value={data.a1}
                      onChange={(value) => updateAgePercentage("a1", value)}
                      pct={parsePct(data.a1)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="18-24"
                      value={data.a2}
                      onChange={(value) => updateAgePercentage("a2", value)}
                      pct={parsePct(data.a2)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="25-34"
                      value={data.a3}
                      onChange={(value) => updateAgePercentage("a3", value)}
                      pct={parsePct(data.a3)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="35-44"
                      value={data.a4}
                      onChange={(value) => updateAgePercentage("a4", value)}
                      pct={parsePct(data.a4)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="45-54"
                      value={data.a5}
                      onChange={(value) => updateAgePercentage("a5", value)}
                      pct={parsePct(data.a5)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="55-64"
                      value={data.a6}
                      onChange={(value) => updateAgePercentage("a6", value)}
                      pct={parsePct(data.a6)}
                      color={IG_PINK}
                    />
                  </div>
                )}
                {audTab === "Gender" && (
                  <div className="mt-5 space-y-4">
                    <BarRow
                      label="Men"
                      value={data.gMen}
                      onChange={(value) => setComplementaryPercentage("gMen", "gWomen", value)}
                      pct={parsePct(data.gMen)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="Women"
                      value={data.gWomen}
                      onChange={(value) => setComplementaryPercentage("gWomen", "gMen", value)}
                      pct={parsePct(data.gWomen)}
                      color={IG_PURPLE}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={
          "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm text-black shadow-lg transition-all " +
          (savedToast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0")
        }
      >
        Saved
      </div>
      {isImportOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="import-reel-title">
          <form onSubmit={handleImport} className="w-full max-w-sm rounded-2xl border border-white/15 bg-zinc-950 p-5 shadow-2xl">
            <h2 id="import-reel-title" className="text-lg font-semibold text-white">Import Instagram reel</h2>
            <p className="mt-1 text-sm text-white">Paste a public reel link to import its available metadata and thumbnail.</p>
            <label className="mt-5 block text-sm font-medium text-white" htmlFor="instagram-reel-url">Instagram reel link</label>
            <input
              id="instagram-reel-url"
              type="url"
              required
              value={reelUrl}
              onChange={(event) => setReelUrl(event.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#eb22d4]"
            />
            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-white">Thumbnail version</legend>
              <div className="mt-2 grid gap-2">
                <label className="flex cursor-pointer gap-3 rounded-xl border border-white/15 p-3 text-sm text-white has-[:checked]:border-[#eb22d4] has-[:checked]:bg-[#eb22d4]/10">
                  <input type="radio" name="thumbnail-version" value="cleaned" checked={thumbnailImportMode === "cleaned"} onChange={() => setThumbnailImportMode("cleaned")} className="mt-0.5 accent-[#eb22d4]" />
                  <span><span className="block font-medium">Cleaned thumbnail</span><span className="mt-0.5 block text-xs text-white/60">Crop the wrapper and locally remove the centered play button.</span></span>
                </label>
                <label className="flex cursor-pointer gap-3 rounded-xl border border-white/15 p-3 text-sm text-white has-[:checked]:border-[#eb22d4] has-[:checked]:bg-[#eb22d4]/10">
                  <input type="radio" name="thumbnail-version" value="original" checked={thumbnailImportMode === "original"} onChange={() => setThumbnailImportMode("original")} className="mt-0.5 accent-[#eb22d4]" />
                  <span><span className="block font-medium">Original thumbnail</span><span className="mt-0.5 block text-xs text-white/60">Keep the public image exactly as imported, including its play button.</span></span>
                </label>
              </div>
            </fieldset>
            <p className="mt-3 text-xs leading-5 text-white">This imports the thumbnail and public engagement data whenever Instagram makes them available. The title stays unchanged; private insights remain manually editable.</p>
            {importError && <p className="mt-3 text-sm text-red-300">{importError}</p>}
            {importNotice && <p className="mt-3 text-sm text-emerald-300">{importNotice}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setIsImportOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-white">Close</button>
              <button type="submit" disabled={isImporting} className="inline-flex items-center gap-2 rounded-lg bg-[#eb22d4] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {isImporting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                {isImporting ? "Importing…" : importError ? "Retry import" : "Import"}
              </button>
            </div>
          </form>
        </div>
      )}
      {isViewsTemplateOpen && (
        <ViewsTemplateDialog
          presets={VIEWS_PRESET_TEMPLATES}
          saved={savedViewsTemplates}
          onApply={applyViewsTemplate}
          onSaveCurrent={saveCurrentViewsTemplate}
          onDelete={deleteViewsTemplate}
          onUpload={uploadViewsTemplate}
          onClose={() => setIsViewsTemplateOpen(false)}
        />
      )}
      {isWatchTemplateOpen && (
        <WatchTemplateDialog
          presets={WATCH_PRESET_TEMPLATES}
          saved={savedWatchTemplates}
          onApply={applyWatchTemplate}
          onSaveCurrent={saveCurrentWatchTemplate}
          onDelete={deleteWatchTemplate}
          onUpload={uploadWatchTemplate}
          onClose={() => setIsWatchTemplateOpen(false)}
        />
      )}
      {isLikesTemplateOpen && (
        <WatchTemplateDialog
          presets={LIKES_PRESET_TEMPLATES}
          saved={savedLikesTemplates}
          onApply={applyLikesTemplate}
          onSaveCurrent={saveCurrentLikesTemplate}
          onDelete={deleteLikesTemplate}
          onUpload={uploadLikesTemplate}
          onClose={() => setIsLikesTemplateOpen(false)}
          title="Likes graph templates"
          description="Choose, save, or trace a likes pattern from an image. Detailed uploads use 32 editable points."
          uploadLabel="Upload likes graph image"
          emptyLabel="No saved likes patterns yet."
        />
      )}
    </div>
  );
}

function SectionTitle({
  children,
  onDoubleClick,
  actionTitle,
}: {
  children: React.ReactNode;
  onDoubleClick?: () => void;
  actionTitle?: string;
}) {
  return (
    <div className={"flex items-center gap-1.5 " + (onDoubleClick ? "cursor-pointer select-none" : "")} onDoubleClick={onDoubleClick} title={onDoubleClick ? actionTitle ?? "Double-click to refresh" : undefined}>
      <h2 className="text-[17px] font-semibold">{children}</h2>
      <Info className="h-4 w-4 text-white/60" />
    </div>
  );
}

function TemplatePreview({ template }: { template: ViewsTemplate }) {
  const previewPoints = (points: number[], visibleUntil: number) =>
    (visibleUntil < 0 ? points : points.slice(0, visibleUntil + 1)).map(
      (point) => 2 + (point / 160) * 54,
    );
  return (
    <svg viewBox="0 0 120 60" className="h-14 w-full" aria-hidden="true">
      <line x1="0" y1="58" x2="120" y2="58" stroke="rgba(255,255,255,.12)" />
      <path d={pathFromPoints(previewPoints(template.typical, template.typicalVisibleUntil), 120, template.typical.length)} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathFromPoints(previewPoints(template.main, template.mainVisibleUntil), 120, template.main.length)} fill="none" stroke="#eb22d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ViewsTemplateDialog({
  presets,
  saved,
  onApply,
  onSaveCurrent,
  onDelete,
  onUpload,
  onClose,
}: {
  presets: ViewsTemplate[];
  saved: ViewsTemplate[];
  onApply: (template: ViewsTemplate) => void;
  onSaveCurrent: () => void;
  onDelete: (templateId: string) => void;
  onUpload: (file: File) => Promise<void>;
  onClose: () => void;
}) {
  const [uploadError, setUploadError] = useState("");
  const [isTracing, setIsTracing] = useState(false);
  const uploadPattern = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setIsTracing(true);
    try { await onUpload(file); }
    catch (error) { setUploadError(error instanceof Error ? error.message : "Could not trace that graph image."); }
    finally { setIsTracing(false); event.target.value = ""; }
  };
  const templateGrid = (templates: ViewsTemplate[], deletable = false) => (
    <div className="grid grid-cols-2 gap-2">
      {templates.map((template) => (
        <div key={template.id} className="relative rounded-xl border border-white/15 bg-white/[.03] hover:border-[#eb22d4]/70 hover:bg-[#eb22d4]/10">
          <button type="button" onClick={() => onApply(template)} className="w-full rounded-xl p-2 text-left focus:outline-none focus:ring-2 focus:ring-[#eb22d4]">
            <TemplatePreview template={template} />
            <span className={"mt-1 block truncate text-xs font-medium text-white " + (deletable ? "pr-12" : "")}>{template.name}</span>
          </button>
          {deletable ? (
            <button
              type="button"
              onClick={() => onDelete(template.id)}
              aria-label={`Delete ${template.name}`}
              className="absolute bottom-1.5 right-1.5 rounded-md px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="views-template-title">
      <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/15 bg-zinc-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="views-template-title" className="text-lg font-semibold text-white">Views graph templates</h2><p className="mt-1 text-xs leading-5 text-white/60">Choose a pattern, save the current graph, or trace both the pink and grey lines from an image.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10">Close</button>
        </div>
        <h3 className="mb-2 mt-5 text-sm font-semibold text-white">Provided templates</h3>
        {templateGrid(presets)}
        <div className="mt-5 flex items-center justify-between"><h3 className="text-sm font-semibold text-white">Saved templates</h3><button type="button" onClick={onSaveCurrent} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10">Save current</button></div>
        <div className="mt-2">{saved.length ? templateGrid(saved, true) : <p className="rounded-xl border border-dashed border-white/15 p-4 text-center text-xs text-white/50">No saved patterns yet.</p>}</div>
        <label className="mt-5 flex cursor-pointer items-center justify-center rounded-xl bg-[#eb22d4] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d91fc4]">
          {isTracing ? "Tracing graph pattern…" : "Upload graph pattern image"}
          <input type="file" accept="image/*" disabled={isTracing} onChange={uploadPattern} className="hidden" />
        </label>
        {uploadError ? <p className="mt-2 text-sm text-red-300">{uploadError}</p> : null}
      </div>
    </div>
  );
}
function WatchTemplatePreview({ template }: { template: WatchTemplate }) {
  const points = (template.visibleUntil < 0 ? template.points : template.points.slice(0, template.visibleUntil + 1))
    .map((point) => 3 + ((point - 10) / 120) * 53);
  return (
    <svg viewBox="0 0 120 60" className="h-14 w-full" aria-hidden="true">
      <line x1="0" y1="57" x2="120" y2="57" stroke="rgba(255,255,255,.12)" />
      <path d={pathFromPoints(points, 120, template.points.length)} fill="none" stroke="#eb22d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WatchTemplateDialog({ presets, saved, onApply, onSaveCurrent, onDelete, onUpload, onClose, title = "Watch-time graph templates", description = "Choose, save, or trace a retention curve from an image. Partial curves keep their original length.", uploadLabel = "Upload retention graph image", emptyLabel = "No saved retention patterns yet." }: {
  presets: WatchTemplate[]; saved: WatchTemplate[];
  onApply: (template: WatchTemplate) => void; onSaveCurrent: () => void;
  onDelete: (templateId: string) => void; onUpload: (file: File) => Promise<void>; onClose: () => void;
  title?: string; description?: string; uploadLabel?: string; emptyLabel?: string;
}) {
  const [uploadError, setUploadError] = useState("");
  const [isTracing, setIsTracing] = useState(false);
  const uploadPattern = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploadError(""); setIsTracing(true);
    try { await onUpload(file); }
    catch (error) { setUploadError(error instanceof Error ? error.message : "Could not trace that retention image."); }
    finally { setIsTracing(false); event.target.value = ""; }
  };
  const grid = (templates: WatchTemplate[], deletable = false) => (
    <div className="grid grid-cols-2 gap-2">
      {templates.map((template) => (
        <div key={template.id} className="relative rounded-xl border border-white/15 bg-white/[.03] hover:border-[#eb22d4]/70 hover:bg-[#eb22d4]/10">
          <button type="button" onClick={() => onApply(template)} className="w-full rounded-xl p-2 text-left focus:outline-none focus:ring-2 focus:ring-[#eb22d4]">
            <WatchTemplatePreview template={template} />
            <span className={"mt-1 block truncate text-xs font-medium text-white " + (deletable ? "pr-12" : "")}>{template.name}</span>
          </button>
          {deletable ? <button type="button" onClick={() => onDelete(template.id)} aria-label={`Delete ${template.name}`} className="absolute bottom-1.5 right-1.5 rounded-md px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/15 focus:ring-2 focus:ring-red-400">Delete</button> : null}
        </div>
      ))}
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="watch-template-title">
      <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/15 bg-zinc-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4"><div><h2 id="watch-template-title" className="text-lg font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-white/60">{description}</p></div><button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10">Close</button></div>
        <h3 className="mb-2 mt-5 text-sm font-semibold">Provided templates</h3>{grid(presets)}
        <div className="mt-5 flex items-center justify-between"><h3 className="text-sm font-semibold">Saved templates</h3><button type="button" onClick={onSaveCurrent} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/10">Save current</button></div>
        <div className="mt-2">{saved.length ? grid(saved, true) : <p className="rounded-xl border border-dashed border-white/15 p-4 text-center text-xs text-white/50">{emptyLabel}</p>}</div>
        <label className="mt-5 flex cursor-pointer items-center justify-center rounded-xl bg-[#eb22d4] px-4 py-3 text-sm font-semibold hover:bg-[#d91fc4]">{isTracing ? "Tracing graph pattern…" : uploadLabel}<input type="file" accept="image/*" disabled={isTracing} onChange={uploadPattern} className="hidden" /></label>
        {uploadError ? <p className="mt-2 text-sm text-red-300">{uploadError}</p> : null}
      </div>
    </div>
  );
}

function StatIcon({
  icon,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-white/95">
      <div className="flex h-7 items-center justify-center">{icon}</div>
      <Editable value={value} onChange={onChange} className="text-[15px]" />
    </div>
  );
}
function SummaryCard({
  label,
  value,
  onChange,
  onLabelChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLabelChange?: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-[#25282d] px-4 py-3.5">
      {onLabelChange ? (
        <Editable
          value={label}
          onChange={onLabelChange}
          className="text-[13px] text-white/80"
          ariaLabel="Accounts reached heading"
        />
      ) : (
        <div className="text-[13px] text-white/80">{label}</div>
      )}
      <Editable
        value={value}
        onChange={onChange}
        className="mt-1 block text-[22px] font-semibold tracking-tight text-white/90"
      />
    </div>
  );
}
function ImpactRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white/[0.08] text-white/85">
        {icon}
      </div>
      <div className="flex-1 text-[15px]">{label}</div>
      <Editable
        value={value}
        onChange={onChange}
        className="text-[15px] font-semibold"
      />
    </div>
  );
}
function SimpleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center py-3">
      <div className="flex-1 text-[15px] text-white">{label}</div>
      <Editable
        value={value}
        onChange={onChange}
        className="text-[15px] font-semibold"
      />
    </div>
  );
}
function parsePct(value: string) {
  const number = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(number) ? 0 : Math.max(0, Math.min(100, number));
}
const IG_PINK = "#eb22d4";
const IG_PURPLE = "#7c3aea";
function BarRow({
  label,
  value,
  onChange,
  pct,
  color = IG_PINK,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  pct: number;
  color?: string;
}) {
  return (
    <div>
      <div className="text-[14px] text-white">{label}</div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <Editable
          value={value}
          onChange={onChange}
          className="w-14 text-right text-[14px] font-semibold"
        />
      </div>
    </div>
  );
}
function CountryRow({
  name,
  val,
  onName,
  onVal,
  color = IG_PINK,
}: {
  name: string;
  val: string;
  onName: (value: string) => void;
  onVal: (value: string) => void;
  color?: string;
}) {
  const pct = parsePct(val);
  return (
    <div>
      <Editable
        value={name}
        onChange={onName}
        className="text-[15px] text-white"
      />
      <div className="mt-2 flex items-center gap-3">
        <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <Editable
          value={val}
          onChange={onVal}
          className="w-14 text-right text-[14px] font-semibold"
        />
      </div>
    </div>
  );
}
function MediaChart({
  title,
  thumb,
  onChangeThumb,
  onTemplateRequest,
  children,
}: {
  title: string;
  thumb: string;
  onChangeThumb: () => void;
  onTemplateRequest?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <SectionTitle onDoubleClick={onTemplateRequest} actionTitle={onTemplateRequest ? "Double-click to open graph templates" : undefined}>{title}</SectionTitle>
      <div className="mt-4 flex justify-center">
        <button type="button" onClick={onChangeThumb} aria-label={`Change thumbnail for ${title}`} className="group relative h-[160px] w-[110px] overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#eb22d4]">
          <img
            src={thumb}
            alt={`${title} thumbnail`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[11px] text-white opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">Change photo</span>
        </button>
      </div>
      {children}
    </div>
  );
}
function useDragPoints(
  points: number[],
  onChange: (next: number[]) => void,
  yMin: number,
  yMax: number,
  onLongPress?: (index: number) => void,
) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragIndex = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const holdStart = useRef<{ x: number; y: number } | null>(null);
  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const onPointerDown = (index: number) => (event: React.PointerEvent) => {
    event.preventDefault();
    (event.target as Element).setPointerCapture(event.pointerId);
    dragIndex.current = index;
    longPressTriggered.current = false;
    holdStart.current = { x: event.clientX, y: event.clientY };
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      dragIndex.current = null;
      onLongPress?.(index);
    }, 5000);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (dragIndex.current === null || !svgRef.current) return;
    const start = holdStart.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10)
      clearLongPress();
    if (longPressTriggered.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const viewBox = svgRef.current.viewBox.baseVal;
    const y = ((event.clientY - rect.top) / rect.height) * viewBox.height;
    const next = points.slice();
    next[dragIndex.current] = Math.max(yMin, Math.min(yMax, y));
    onChange(next);
  };
  return {
    svgRef,
    onPointerDown,
    onPointerMove,
    onPointerUp: () => {
      clearLongPress();
      dragIndex.current = null;
      holdStart.current = null;
    },
  };
}
function pathFromPoints(points: number[], width: number, totalPoints = points.length) {
  const step = width / (totalPoints - 1);
  return points
    .map(
      (y, index) =>
        `${index === 0 ? "M" : "L"}${(index * step).toFixed(1)},${y.toFixed(1)}`,
    )
    .join(" ");
}
function EditableLineChart({
  main,
  typical,
  onMain,
  onTypical,
  mainVisibleUntil,
  typicalVisibleUntil,
  onMainVisibleUntil,
  onTypicalVisibleUntil,
  yTop,
  yMid,
  onYTop,
  onYMid,
  xLabelsData,
  onXLabel,
  onTemplateRequest,
  showHandles = true,
  editableLine = "main",
}: {
  main: number[];
  typical: number[];
  onMain: (value: number[]) => void;
  onTypical: (value: number[]) => void;
  mainVisibleUntil: number;
  typicalVisibleUntil: number;
  onMainVisibleUntil: (value: number) => void;
  onTypicalVisibleUntil: (value: number) => void;
  yTop: string;
  yMid: string;
  onYTop: (value: string) => void;
  onYMid: (value: string) => void;
  xLabelsData: string[];
  onXLabel: (index: number, value: string) => void;
  onTemplateRequest: () => void;
  showHandles?: boolean;
  editableLine?: "main" | "typical";
}) {
  const width = 320,
    height = 160;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activePoint = useRef<{ line: "main" | "typical"; index: number } | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const holdStart = useRef<{ x: number; y: number } | null>(null);
  const templatePointers = useRef(new Map<number, { x: number; y: number }>());
  const templateHoldTimer = useRef<number | null>(null);
  const clearTemplateHold = () => {
    if (templateHoldTimer.current !== null) {
      window.clearTimeout(templateHoldTimer.current);
      templateHoldTimer.current = null;
    }
  };
  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const visiblePoints = (points: number[], visibleUntil: number) =>
    visibleUntil < 0 ? points : points.slice(0, visibleUntil + 1);
  const displayedMain = visiblePoints(main, mainVisibleUntil);
  const displayedTypical = visiblePoints(typical, typicalVisibleUntil);
  const trackTemplatePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType !== "touch") return;
    templatePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (templatePointers.current.size === 2) {
      clearLongPress();
      activePoint.current = null;
      templateHoldTimer.current = window.setTimeout(() => {
        if (templatePointers.current.size >= 2) onTemplateRequest();
        clearTemplateHold();
      }, 2_000);
    }
  };
  const moveTemplatePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const start = templatePointers.current.get(event.pointerId);
    if (!start) return false;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) clearTemplateHold();
    return templatePointers.current.size >= 2;
  };
  const releaseTemplatePointer = (pointerId: number) => {
    templatePointers.current.delete(pointerId);
    if (templatePointers.current.size < 2) clearTemplateHold();
  };
  const movePoint = (event: React.PointerEvent<SVGSVGElement>) => {
    if (moveTemplatePointer(event)) return;
    const active = activePoint.current;
    if (!active || !svgRef.current) return;
    const start = holdStart.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10)
      clearLongPress();
    if (longPressTriggered.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const nextY = Math.max(5, Math.min(155, ((event.clientY - rect.top) / rect.height) * height));
    const points = (active.line === "main" ? main : typical).slice();
    points[active.index] = nextY;
    if (active.line === "main") onMain(points); else onTypical(points);
  };
  const startPoint = (line: "main" | "typical", index: number) => (event: React.PointerEvent<SVGCircleElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    activePoint.current = { line, index };
    longPressTriggered.current = false;
    holdStart.current = { x: event.clientX, y: event.clientY };
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      activePoint.current = null;
      if (line === "main") {
        onMainVisibleUntil(mainVisibleUntil === index ? -1 : index);
      } else {
        onTypicalVisibleUntil(typicalVisibleUntil === index ? -1 : index);
      }
    }, 5000);
  };
  return (
    <div className="relative mt-4 h-52 select-none">
      <div className="absolute left-0 top-0 text-[11px] text-white/50">
        <Editable value={yTop} onChange={onYTop} />
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[11px] text-white/50">
        <Editable value={yMid} onChange={onYMid} />
      </div>
      <div className="absolute bottom-6 left-0 text-[11px] text-white/50">
        0
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 left-8 right-0 h-[calc(100%-1.5rem)] w-[calc(100%-2rem)] touch-none"
        onPointerDown={trackTemplatePointer}
        onPointerMove={movePoint}
        onPointerUp={(event) => { releaseTemplatePointer(event.pointerId); clearLongPress(); activePoint.current = null; holdStart.current = null; }}
        onPointerLeave={(event) => { releaseTemplatePointer(event.pointerId); activePoint.current = null; }}
        onPointerCancel={(event) => { releaseTemplatePointer(event.pointerId); clearLongPress(); activePoint.current = null; holdStart.current = null; }}
      >
        <line x1="0" y1="0" x2={width} y2="0" stroke="rgba(255,255,255,0.08)" />
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="rgba(255,255,255,0.08)"
        />
        <line
          x1="0"
          y1={height}
          x2={width}
          y2={height}
          stroke="rgba(255,255,255,0.08)"
        />
        <path
          d={pathFromPoints(displayedTypical, width, typical.length)}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {showHandles && editableLine === "typical" &&
          displayedTypical.map((y, index) => (
            <circle
              key={index}
              cx={(index * width) / (typical.length - 1)}
              cy={y}
              r={7}
              fill="rgba(255,255,255,0.001)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
              style={{ cursor: "ns-resize" }}
              onPointerDown={startPoint("typical", index)}
            />
          ))}
        <path
          d={pathFromPoints(displayedMain, width, main.length)}
          fill="none"
          stroke="#eb22d4"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {showHandles && editableLine === "main" &&
          displayedMain.map((y, index) => (
            <circle
              key={index}
              cx={(index * width) / (main.length - 1)}
              cy={y}
              r={8}
              fill="#eb22d4"
              fillOpacity="0.25"
              stroke="#eb22d4"
              strokeWidth="2"
              style={{ cursor: "ns-resize" }}
              onPointerDown={startPoint("main", index)}
            />
          ))}
      </svg>
      <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[11px] text-white/50">
        {xLabelsData.map((label, index) => (
          <Editable
            key={index}
            value={label}
            onChange={(value) => onXLabel(index, value)}
          />
        ))}
      </div>
    </div>
  );
}
function EditableSingleChart({
  data,
  onChange,
  visibleUntil,
  onVisibleUntil,
  showHandles = true,
  yTop,
  yMid,
  onYTop,
  onYMid,
  xLabelsData,
  onXLabel,
  onTemplateRequest,
}: {
  data: number[];
  onChange: (value: number[]) => void;
  visibleUntil: number;
  onVisibleUntil: (value: number) => void;
  showHandles?: boolean;
  yTop: string;
  yMid: string;
  onYTop: (value: string) => void;
  onYMid: (value: string) => void;
  xLabelsData: string[];
  onXLabel: (index: number, value: string) => void;
  onTemplateRequest?: () => void;
}) {
  const width = 320,
    height = 140;
  const drag = useDragPoints(data, onChange, 5, 135, (index) => {
    onVisibleUntil(visibleUntil === index ? -1 : index);
  });
  const displayedData = visibleUntil < 0 ? data : data.slice(0, visibleUntil + 1);
  const templatePointers = useRef(new Map<number, { x: number; y: number }>());
  const templateTimer = useRef<number | null>(null);
  const clearTemplateTimer = () => {
    if (templateTimer.current !== null) { window.clearTimeout(templateTimer.current); templateTimer.current = null; }
  };
  const trackTemplatePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!onTemplateRequest || event.pointerType !== "touch") return;
    templatePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (templatePointers.current.size === 2) {
      clearTemplateTimer();
      templateTimer.current = window.setTimeout(() => {
        if (templatePointers.current.size >= 2) onTemplateRequest();
        clearTemplateTimer();
      }, 2_000);
    }
  };
  const moveTemplatePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const start = templatePointers.current.get(event.pointerId);
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) clearTemplateTimer();
  };
  const releaseTemplatePointer = (pointerId: number) => {
    templatePointers.current.delete(pointerId);
    if (templatePointers.current.size < 2) clearTemplateTimer();
  };
  return (
    <div className="relative mt-6 h-44 select-none">
      <div className="absolute left-0 top-2 text-[11px] text-white/50">
        <Editable value={yTop} onChange={onYTop} />
      </div>
      <div className="absolute left-0 top-1/2 text-[11px] text-white/50">
        <Editable value={yMid} onChange={onYMid} />
      </div>
      <div className="absolute bottom-6 left-0 text-[11px] text-white/50">
        0
      </div>
      <svg
        ref={drag.svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 left-10 right-0 h-[calc(100%-1.5rem)] w-[calc(100%-2.5rem)] touch-none"
        onPointerDown={trackTemplatePointer}
        onPointerMove={(event) => { moveTemplatePointer(event); if (templatePointers.current.size < 2) drag.onPointerMove(event); }}
        onPointerUp={(event) => { releaseTemplatePointer(event.pointerId); drag.onPointerUp(); }}
        onPointerLeave={(event) => { releaseTemplatePointer(event.pointerId); drag.onPointerUp(); }}
        onPointerCancel={(event) => { releaseTemplatePointer(event.pointerId); drag.onPointerUp(); }}
      >
        <line
          x1="0"
          y1="10"
          x2={width}
          y2="10"
          stroke="rgba(255,255,255,0.08)"
        />
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="rgba(255,255,255,0.08)"
        />
        <line
          x1="0"
          y1={height - 10}
          x2={width}
          y2={height - 10}
          stroke="rgba(255,255,255,0.08)"
        />
        <path
          d={pathFromPoints(displayedData, width, data.length)}
          fill="none"
          stroke="#eb22d4"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {showHandles &&
          displayedData.map((y, index) => (
            <circle
              key={index}
              cx={(index * width) / (data.length - 1)}
              cy={y}
              r={8}
              fill="#eb22d4"
              fillOpacity="0.25"
              stroke="#eb22d4"
              strokeWidth="2"
              style={{ cursor: "ns-resize" }}
              onPointerDown={drag.onPointerDown(index)}
            />
          ))}
      </svg>
      <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[11px] text-white/50">
        {xLabelsData.map((label, index) => (
          <Editable
            key={index}
            value={label}
            onChange={(value) => onXLabel(index, value)}
          />
        ))}
      </div>
    </div>
  );
}
