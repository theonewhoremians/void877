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
const LICENSE_REVALIDATE_MS = 60_000;
const defaultViewsMain = [
  155, 152, 148, 142, 135, 128, 120, 112, 104, 96, 86, 76, 65, 52, 38, 25,
];
const defaultViewsTypical = [
  155, 150, 145, 140, 133, 126, 120, 113, 106, 100, 93, 86, 80, 73, 65, 55,
];
const defaultWatch = [
  15, 20, 26, 33, 41, 50, 58, 66, 74, 82, 90, 100, 110, 118, 126, 132,
];
const defaultLikes = [
  125, 115, 105, 95, 88, 82, 78, 72, 68, 60, 55, 48, 42, 38, 32, 28,
];

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

function useLocalData() {
  const [data, setData] = useState<DataShape>(defaultData);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...defaultData, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const save = (next: DataShape) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
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
    save({ ...data, [key]: value, ...(mirror ? { [mirror]: value } : {}) });
  };
  return { data, set, save };
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
  const { data, set, save } = useLocalData();
  const [tab, setTab] = useState<Tab>("Overview");
  const [audTab, setAudTab] = useState<AudTab>("Country");
  const [viewsTab, setViewsTab] = useState<
    "All" | "Followers" | "Non-followers"
  >("All");
  const [savedToast, setSavedToast] = useState(false);
  const [editing, setEditing] = useState(true);
  const [thumb, setThumb] = useState<string>(reelThumb);
  const [hasImportedThumbnail, setHasImportedThumbnail] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [reelUrl, setReelUrl] = useState("");
  const [importError, setImportError] = useState("");
  const [importNotice, setImportNotice] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const chartImageRef = useRef<HTMLInputElement | null>(null);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(true);

  useEffect(() => {
    let active = true;

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
      if (storedThumb) setThumb(storedThumb);
      setHasImportedThumbnail(localStorage.getItem("reel-insights-imported-thumb") === "true");
      setChartImage(localStorage.getItem("reel-insights-chart-image"));
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
      setHasImportedThumbnail(false);
      try {
        localStorage.setItem("reel-insights-thumb", image);
        localStorage.removeItem("reel-insights-imported-thumb");
      } catch {}
    };
    reader.readAsDataURL(file);
  };
  const onPickChartImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setChartImage(image);
      try {
        localStorage.setItem("reel-insights-chart-image", image);
      } catch {}
    };
    reader.readAsDataURL(file);
  };
  const handleHeaderSave = () => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    save(data);
    setEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1400);
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
  const openImport = () => {
    setImportError("");
    setImportNotice("");
    setIsImportOpen(true);
  };
  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImportError("");
    setImportNotice("");
    try {
      setIsImporting(true);
      const result = await importPublicInstagramReel(reelUrl);
      const imported = result.reel;
      const count = (value: number | null) =>
        value === null ? undefined : new Intl.NumberFormat("en-US").format(value);
      const duration = (seconds: number | null) =>
        seconds === null ? undefined : `${Math.round(seconds)}s`;
      const applyCount = (key: string, value: number | null) =>
        value === null ? {} : { [key]: count(value)! };
      const next = {
        ...data,
        ...applyCount("likes", imported.likes), ...applyCount("eLikes", imported.likes),
        ...applyCount("comments", imported.comments), ...applyCount("eComments", imported.comments),
        ...applyCount("reposts", imported.reposts), ...applyCount("eReposts", imported.reposts),
        ...applyCount("views", imported.views), ...applyCount("reached", imported.reached),
        ...(duration(imported.duration) ? { watchX1: duration(imported.duration)!, likesX1: duration(imported.duration)! } : {}),
      };
      save(next);
      if (imported.thumbnail) {
        setThumb(imported.thumbnail);
        setHasImportedThumbnail(true);
        localStorage.setItem("reel-insights-thumb", imported.thumbnail);
        localStorage.setItem("reel-insights-imported-thumb", "true");
      }
      setImportNotice("Reel details imported.");
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
        <header className="sticky top-0 z-20 flex items-center gap-3 bg-[#0c0f14]/95 px-4 pb-3 pt-4 backdrop-blur">
          <button
            aria-label="Back"
            className="-ml-1 p-1 text-white/75 hover:text-zinc-100"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.25} />
          </button>
          <button
            onClick={handleHeaderSave}
            onDoubleClick={() => {
              setEditing(true);
              setShowUploadOptions((visible) => !visible);
            }}
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
          <button aria-label="Trends" className="p-1 text-white/75 hover:text-zinc-100">
            <TrendingUp className="h-6 w-6" strokeWidth={2.25} />
          </button>
          {showUploadOptions && (
            <button onClick={openImport} aria-label="Import Instagram reel" className="p-1 text-white/75 hover:text-zinc-100">
              <MoreVertical className="h-6 w-6" strokeWidth={2.25} />
            </button>
          )}
        </header>
        {showUploadOptions && (
          <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-white">Chart image output</p>
              <p className="text-xs text-white/55">Upload a finished chart or insights screenshot—no editing needed.</p>
            </div>
            <button type="button" onClick={() => chartImageRef.current?.click()} className="shrink-0 rounded-lg bg-[#eb22d4] px-3 py-2 text-xs font-semibold text-white">
              {chartImage ? "Replace" : "Upload"}
            </button>
            <input ref={chartImageRef} type="file" accept="image/*" className="hidden" onChange={onPickChartImage} />
          </div>
        )}
        {chartImage && (
          <section className="mx-4 mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <img src={chartImage} alt="Uploaded chart output" className="block h-auto w-full" />
          </section>
        )}
        <div className="flex justify-center pt-4">
          {hasImportedThumbnail || !showUploadOptions ? (
            <img
              src={thumb}
              alt="Imported reel thumbnail"
              className="h-[190px] w-[130px] object-cover"
            />
          ) : (
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
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[11px] text-white opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
                Change photo
              </span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickThumb}
          />
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
                  onChange={(value) => set("views", value)}
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
                <SectionTitle>Views over time</SectionTitle>
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
                  yTop={data.chartMax}
                  yMid={data.chartMid}
                  onYTop={(value) => set("chartMax", value)}
                  onYMid={(value) => set("chartMid", value)}
                  xLabelsData={[data.viewsX0, data.viewsX1, data.viewsX2]}
                  onXLabel={(index, value) =>
                    set(
                      (["viewsX0", "viewsX1", "viewsX2"] as const)[index],
                      value,
                    )
                  }
                />
                <div className="mt-3 flex items-center gap-4 text-[12px] text-white/80">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: "#eb22d4" }}
                    />
                    This reel
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/40" />
                    Your typical reel
                  </span>
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
                thumb={thumb}
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
                  onXLabel={(index, value) =>
                    set((["watchX0", "watchX1"] as const)[index], value)
                  }
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
              <MediaChart title="When people liked your reel" thumb={thumb}>
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
                  onXLabel={(index, value) =>
                    set((["likesX0", "likesX1"] as const)[index], value)
                  }
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
                <SectionTitle>Audience details</SectionTitle>
                <div className="mt-3 flex gap-2">
                  {(["Age", "Country", "Gender"] as AudTab[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setAudTab(item)}
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
                      onVal={(value) => set("c1Val", value)}
                    />
                    <CountryRow
                      name={data.c2Name}
                      val={data.c2Val}
                      onName={(value) => set("c2Name", value)}
                      onVal={(value) => set("c2Val", value)}
                    />
                    <CountryRow
                      name={data.c3Name}
                      val={data.c3Val}
                      onName={(value) => set("c3Name", value)}
                      onVal={(value) => set("c3Val", value)}
                    />
                    <CountryRow
                      name={data.c4Name}
                      val={data.c4Val}
                      onName={(value) => set("c4Name", value)}
                      onVal={(value) => set("c4Val", value)}
                    />
                    <CountryRow
                      name={data.c5Name}
                      val={data.c5Val}
                      onName={(value) => set("c5Name", value)}
                      onVal={(value) => set("c5Val", value)}
                    />
                  </div>
                )}
                {audTab === "Age" && (
                  <div className="mt-5 space-y-4">
                    <BarRow
                      label="13-17"
                      value={data.a1}
                      onChange={(value) => set("a1", value)}
                      pct={parsePct(data.a1)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="18-24"
                      value={data.a2}
                      onChange={(value) => set("a2", value)}
                      pct={parsePct(data.a2)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="25-34"
                      value={data.a3}
                      onChange={(value) => set("a3", value)}
                      pct={parsePct(data.a3)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="35-44"
                      value={data.a4}
                      onChange={(value) => set("a4", value)}
                      pct={parsePct(data.a4)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="45-54"
                      value={data.a5}
                      onChange={(value) => set("a5", value)}
                      pct={parsePct(data.a5)}
                      color={IG_PINK}
                    />
                    <BarRow
                      label="55-64"
                      value={data.a6}
                      onChange={(value) => set("a6", value)}
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
            <p className="mt-3 text-xs leading-5 text-white">This imports the thumbnail, creator, and caption/title, plus visible likes and comments whenever Instagram makes them available. Shares, reposts, saves, duration, and insights are private.</p>
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
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <h2 className="text-[17px] font-semibold">{children}</h2>
      <Info className="h-4 w-4 text-white/60" />
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
  children,
}: {
  title: string;
  thumb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-4 flex justify-center">
        <div className="relative h-[160px] w-[110px] overflow-hidden rounded-2xl">
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
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
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      dragIndex.current = null;
      onLongPress?.(index);
    }, 5000);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (dragIndex.current === null || !svgRef.current) return;
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
  showHandles = true,
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
  showHandles?: boolean;
}) {
  const width = 320,
    height = 160;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const activePoint = useRef<{ line: "main" | "typical"; index: number } | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
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
  const movePoint = (event: React.PointerEvent<SVGSVGElement>) => {
    const active = activePoint.current;
    if (!active || !svgRef.current) return;
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
        onPointerMove={movePoint}
        onPointerUp={() => { clearLongPress(); activePoint.current = null; }}
        onPointerLeave={() => { clearLongPress(); activePoint.current = null; }}
        onPointerCancel={() => { clearLongPress(); activePoint.current = null; }}
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
        {showHandles &&
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
        {showHandles &&
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
}) {
  const width = 320,
    height = 140;
  const drag = useDragPoints(data, onChange, 5, 135, (index) => {
    onVisibleUntil(visibleUntil === index ? -1 : index);
  });
  const displayedData = visibleUntil < 0 ? data : data.slice(0, visibleUntil + 1);
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
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onPointerLeave={drag.onPointerUp}
        onPointerCancel={drag.onPointerUp}
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
