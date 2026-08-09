import { n as __toESM } from "../_runtime.mjs";
import { a as loadSession, i as getLicenseStatus, n as clearSession } from "./license-Bk6t9cBB.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowLeft, i as ChevronRight, n as Info, r as EllipsisVertical, t as TrendingUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CcQagQ-I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var reel_thumb_default = "/assets/reel-thumb-tRQHh08Z.jpg";
var heart_png_default = "data:image/png;base64,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";
var comment_png_default = "data:image/png;base64,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";
var repost_png_default = "/assets/repost-2ZMzA8ZP.png";
var share_png_default = "data:image/png;base64,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";
var bookmark_png_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAADmCAYAAADBavm7AAAFUElEQVR4nO3c3VLbOhhA0XCm7//KnIuWKS0Fkli2t6y1Zrjiz5a+DSYOeXl9fb0BLf+dfQDAR8KEIGFCkDAhSJgQJEwIEiYECROChAlBwoQgYUKQMCFImBAkTAgSJgQJE4KECUHChCBhQtCPsw/gSV6oiEe8nH0Aj5rtN+brTZQ8brqZmSnM6RaXlKl+qM8S5jQLSt4UszRDmFMsJIw0Q5gwWv6HfT3M/AIyrfRs1cOEJQkTgsphpi81YE/lMGFZwoSgcpjTPb8RRimHCcsSJgQJE4KECUHChCBhQtCsLy3yDLdfrmGJZ4T5jQlBwoQgYUKQMCFImBAkTAgSJgQJE4KECUHChCBhQpAwIUiYECRMCBImBAkTgoQJQcKEIGFCkDAhSJgQJEwIEiYECROChAlBwoQgYUKQMCFImBAkTAgSJgQJE4KECUHChCBhQpAwIUiYECRMCBImBAkTgoQJQcKEIGFCkDAhSJgQJEwIEiYECROChAlBwoQgYUKQMCFImBAkTAgSJgQJE4KECUHChCBhQpAwIUiYECRMCBImBAkTgoQJQcKEIGFCkDAhSJgQJEwIEiYECROChAlBwoQgYUKQMCFImBAkTAgSJgQJE4KECUHChCBhQpAwIUiYECRMCBImBAkTgoQJQcKEIGFCkDAh6MfZB8Amr9+8/+WQo2A4Yc7puyD//jiBTsal7HzujXLr53AiYc7j9bYtMHFORJhzGBWVOCchzL7RMYlzAsJckzjjhNm19W/Ke74+UcJsOiqavePnScLsOSMUccYIs+XMQMQZIsyOQhiFY+AmzIpSEKVjWZYwz1cMoXhMSxHmeeqPiJaP7fKEeY5Zhn6W47wcYR5vtmGf7XgvQZjHmnXI65fdlyPM41xhsK9wDlMQ5jGuNNBXOpcsYe7vioN8xXNKEea+rjzAVz630wlzP0cO7su7tyOJcyfCHO/oRzD/jlGcFyDMsY4e0s8iFOfkhDlOJcp73z+ae50DCXOMWpSPftxI4hxAmNtVo3z24wkQ5jb1KN9/3pGBuqzdSJjPmyXK0V/jEeJ8kjCfM2OUe3yte4jzCcJ8zBn3KPcISZxxwrzf1YZLnGHCvM8ZQ3VEOOKMEub3rhrlGd/rdhPnXYT5tTMe5DnjvqM4Y4T5uZkfeZ3h+7vX+QVh/ttqUb7xr2MRwvxo1SjfE+fJhPknUf4mzhMJ86cz/t4pR/lGnCcR5vVvh2wlzhOsHqYo7yPOg60cpigfI84DrRrmKk8cGE2cB1kxTA/ybHPGP10vZ7UwRTmOV0TY0UphinI8l7Y7WSnMI60Q5ZuVzvUwwhxvxUFd8Zx3JcyxVh7Qlc99OGGOYzCtwTDCHMNA/mYtBhDmdgbxI2uykTC3MYCfszYbCPN5Bu971uhJwnzcVZ73ehRr9QRhPsaQPce6PUiY9zNc27jSeIAw72OgxrGWdxDm9wzSeNb0G8L8mgHaj7X9gjA/Z3D2Z40/Icx/MzDHsdb/IMyPDMrxrPlfhPknA3Iea/+OMH9yj63BHvwiTMNQYz9u7TCPeOElQ9C0/L6Uw9x7c5bf/Lil96cc5p6W3vSJLLtPK4a57GZPaq8H5tJzUA9z9OKlN4MvLbV39TBHWmpjL2rUHuZnYYYwRyxifiO429a9nGIWZgjzdtu2mFNsBA95dk+nmYVZwrzdHl9Uz+a5tmfmYRo/zj6AB70t7ldPPphqA9jk/V5/NhNTzsNsYb6ZcrHZ1aVmYqZLWViGMCFImBAkTAgSJgQJE4KECUHChCBhQpAwIUiYECRMCBImBAkTgoQJQcKEIGFCkDAhSJgQ9D/wg3/og+Xy5gAAAABJRU5ErkJggg==";
async function importPublicInstagramReel(url) {
	const result = await (await fetch("/api/import-instagram", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ url })
	})).json();
	if (!result.success) throw Object.assign(new Error(result.error), { retryable: result.retryable });
	return result;
}
var STORAGE_KEY = "reel-insights-data-v3";
var LICENSE_REVALIDATE_MS = 6e4;
var defaultData = {
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
	viewsMain: [
		155,
		152,
		148,
		142,
		135,
		128,
		120,
		112,
		104,
		96,
		86,
		76,
		65,
		52,
		38,
		25
	],
	viewsTypical: [
		155,
		150,
		145,
		140,
		133,
		126,
		120,
		113,
		106,
		100,
		93,
		86,
		80,
		73,
		65,
		55
	],
	watch: [
		15,
		20,
		26,
		33,
		41,
		50,
		58,
		66,
		74,
		82,
		90,
		100,
		110,
		118,
		126,
		132
	],
	likesOverTime: [
		125,
		115,
		105,
		95,
		88,
		82,
		78,
		72,
		68,
		60,
		55,
		48,
		42,
		38,
		32,
		28
	]
};
function useLocalData() {
	const [data, setData] = (0, import_react.useState)(defaultData);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setData({
				...defaultData,
				...JSON.parse(raw)
			});
		} catch {}
	}, []);
	const save = (next) => {
		setData(next);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		} catch {}
	};
	const set = (key, value) => {
		const mirror = {
			likes: "eLikes",
			eLikes: "likes",
			comments: "eComments",
			eComments: "comments",
			reposts: "eReposts",
			eReposts: "reposts",
			shares: "eShares",
			eShares: "shares",
			saves: "eSaves",
			eSaves: "saves",
			follows: "eFollows",
			eFollows: "follows"
		}[key];
		save({
			...data,
			[key]: value,
			...mirror ? { [mirror]: value } : {}
		});
	};
	return {
		data,
		set,
		save
	};
}
function AccessGate() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-[#0c0f14] p-6 text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[.2em] text-fuchsia-400",
				children: "EditFlow"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-zinc-400",
				children: "Checking access…"
			})]
		})
	});
}
function Editable({ value, onChange, className, style, as: As = "span", ariaLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, {
		ref: (0, import_react.useRef)(null),
		className: "outline-none rounded-sm px-0.5 -mx-0.5 hover:bg-white/5 focus:bg-white/10 focus:ring-1 focus:ring-[#eb22d4]/70 transition-colors cursor-text " + (className ?? ""),
		style,
		contentEditable: true,
		suppressContentEditableWarning: true,
		spellCheck: false,
		"aria-label": ariaLabel,
		onBlur: (event) => {
			const text = (event.currentTarget.textContent ?? "").trim();
			if (text !== value) onChange(text);
		},
		onKeyDown: (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				event.currentTarget.blur();
			}
		},
		children: value
	});
}
var IG_ICON_FILTER = "brightness(0) invert(1)";
function IgIcon({ src, className, alt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		draggable: false,
		className: "select-none object-contain " + (className ?? ""),
		style: { filter: IG_ICON_FILTER }
	});
}
function IgHeart(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
		src: heart_png_default,
		alt: "Likes",
		className: props.className
	});
}
function IgComment(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
		src: comment_png_default,
		alt: "Comments",
		className: props.className
	});
}
function IgRepost(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
		src: repost_png_default,
		alt: "Reposts",
		className: props.className
	});
}
function IgShare(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
		src: share_png_default,
		alt: "Shares",
		className: props.className
	});
}
function IgBookmark(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
		src: bookmark_png_default,
		alt: "Saves",
		className: props.className
	});
}
function ReelInsightsPage() {
	const navigate = useNavigate();
	const [access, setAccess] = (0, import_react.useState)("checking");
	const { data, set, save } = useLocalData();
	const [tab, setTab] = (0, import_react.useState)("Overview");
	const [audTab, setAudTab] = (0, import_react.useState)("Country");
	const [viewsTab, setViewsTab] = (0, import_react.useState)("All");
	const [savedToast, setSavedToast] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(true);
	const [thumb, setThumb] = (0, import_react.useState)(reel_thumb_default);
	const [hasImportedThumbnail, setHasImportedThumbnail] = (0, import_react.useState)(false);
	const [isImportOpen, setIsImportOpen] = (0, import_react.useState)(false);
	const [reelUrl, setReelUrl] = (0, import_react.useState)("");
	const [importError, setImportError] = (0, import_react.useState)("");
	const [importNotice, setImportNotice] = (0, import_react.useState)("");
	const [isImporting, setIsImporting] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		const revokeAccess = () => {
			if (!active) return;
			clearSession();
			setAccess("activation-required");
			navigate({
				to: "/activate",
				replace: true
			});
		};
		const checkLicense = async () => {
			const session = loadSession();
			if (!session || new Date(session.expiresAt) <= /* @__PURE__ */ new Date()) {
				revokeAccess();
				return;
			}
			if (active) setAccess("allowed");
			try {
				await getLicenseStatus(session.token);
			} catch {
				if (navigator.onLine) revokeAccess();
			}
		};
		checkLicense();
		const intervalId = window.setInterval(() => {
			checkLicense();
		}, LICENSE_REVALIDATE_MS);
		const handleWindowFocus = () => {
			checkLicense();
		};
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") checkLicense();
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
	(0, import_react.useEffect)(() => {
		try {
			const storedThumb = localStorage.getItem("reel-insights-thumb");
			if (storedThumb) setThumb(storedThumb);
			setHasImportedThumbnail(localStorage.getItem("reel-insights-imported-thumb") === "true");
		} catch {}
	}, []);
	if (access !== "allowed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {});
	const onPickThumb = (event) => {
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
	const handleHeaderSave = () => {
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
		save(data);
		setEditing(false);
		setSavedToast(true);
		setTimeout(() => setSavedToast(false), 1400);
	};
	const setComplementaryPercentage = (key, oppositeKey, value) => {
		const percentage = parsePct(value);
		const opposite = Math.round((100 - percentage) * 10) / 10;
		save({
			...data,
			[key]: value,
			[oppositeKey]: `${opposite}%`
		});
	};
	const openImport = () => {
		setImportError("");
		setImportNotice("");
		setIsImportOpen(true);
	};
	const handleImport = async (event) => {
		event.preventDefault();
		setImportError("");
		setImportNotice("");
		try {
			setIsImporting(true);
			const imported = (await importPublicInstagramReel(reelUrl)).reel;
			const count = (value) => value === null ? void 0 : new Intl.NumberFormat("en-US").format(value);
			const duration = (seconds) => seconds === null ? void 0 : `${Math.round(seconds)}s`;
			const applyCount = (key, value) => value === null ? {} : { [key]: count(value) };
			const next = {
				...data,
				...applyCount("likes", imported.likes),
				...applyCount("eLikes", imported.likes),
				...applyCount("comments", imported.comments),
				...applyCount("eComments", imported.comments),
				...applyCount("reposts", imported.reposts),
				...applyCount("eReposts", imported.reposts),
				...applyCount("views", imported.views),
				...applyCount("reached", imported.reached),
				...duration(imported.duration) ? {
					watchX1: duration(imported.duration),
					likesX1: duration(imported.duration)
				} : {}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#0c0f14] text-zinc-100",
		style: { fontFamily: "'Roboto', system-ui, -apple-system, sans-serif" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-md pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex items-center gap-3 bg-[#0c0f14]/95 px-4 pb-3 pt-4 backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Back",
								className: "-ml-1 p-1 text-white/75 hover:text-zinc-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
									className: "h-6 w-6",
									strokeWidth: 2.25
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleHeaderSave,
								onDoubleClick: () => setEditing(true),
								className: "flex-1 text-left",
								title: "Click title to save · double-click to edit graphs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
									as: "h1",
									value: data.title,
									onChange: (value) => set("title", value),
									className: "text-[22px] font-semibold tracking-tight",
									ariaLabel: "Page title"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Trends",
								className: "p-1 text-white/75 hover:text-zinc-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
									className: "h-6 w-6",
									strokeWidth: 2.25
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: openImport,
								"aria-label": "Import Instagram reel",
								className: "p-1 text-white/75 hover:text-zinc-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, {
									className: "h-6 w-6",
									strokeWidth: 2.25
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-center pt-4",
						children: [hasImportedThumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: thumb,
							alt: "Imported reel thumbnail",
							className: "h-[190px] w-[130px] object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							className: "group relative h-[190px] w-[130px] overflow-hidden rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#eb22d4]",
							"aria-label": "Change thumbnail",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: thumb,
								alt: "Reel thumbnail",
								className: "h-full w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-0 flex items-center justify-center bg-black/0 text-[11px] text-white opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100",
								children: "Change photo"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: onPickThumb
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-5 gap-2 px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatIcon, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgHeart, { className: "h-6 w-6" }),
								value: data.likes,
								onChange: (value) => set("likes", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatIcon, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgComment, { className: "h-6 w-6" }),
								value: data.comments,
								onChange: (value) => set("comments", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatIcon, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgRepost, { className: "h-6 w-6" }),
								value: data.reposts,
								onChange: (value) => set("reposts", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatIcon, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgShare, { className: "h-6 w-6" }),
								value: data.shares,
								onChange: (value) => set("shares", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatIcon, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgBookmark, { className: "h-6 w-6" }),
								value: data.saves,
								onChange: (value) => set("saves", value)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid grid-cols-3 border-b border-white/10 px-2",
						children: [
							"Overview",
							"Engagement",
							"Audience"
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTab(item),
							className: "relative py-3 text-[15px] font-medium " + (tab === item ? "text-zinc-100" : "text-white/45"),
							children: [item, tab === item && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-[-1px] left-1/4 right-1/4 h-0.5 rounded-full bg-white" })]
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pt-5",
						children: [
							tab === "Overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Summary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
											label: "Views",
											value: data.views,
											onChange: (value) => set("views", value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
											label: data.accountsReachedLabel,
											value: data.reached,
											onChange: (value) => set("reached", value),
											onLabelChange: (value) => set("accountsReachedLabel", value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
											label: "Average watch time",
											value: data.avgWatch,
											onChange: (value) => set("avgWatch", value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
											label: "Follows",
											value: data.follows,
											onChange: (value) => set("follows", value)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Views over time" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex gap-2",
											children: [
												"All",
												"Followers",
												"Non-followers"
											].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setViewsTab(item),
												className: "rounded-full border px-4 py-1.5 text-[13px] font-medium " + (viewsTab === item ? "border-white bg-white text-black" : "border-white/20 bg-transparent text-white/75"),
												children: item
											}, item))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableLineChart, {
											main: data.viewsMain,
											typical: data.viewsTypical,
											onMain: (value) => {
												setEditing(true);
												set("viewsMain", value);
											},
											onTypical: (value) => {
												setEditing(true);
												set("viewsTypical", value);
											},
											showHandles: editing,
											yTop: data.chartMax,
											yMid: data.chartMid,
											onYTop: (value) => set("chartMax", value),
											onYMid: (value) => set("chartMid", value),
											xLabelsData: [
												data.viewsX0,
												data.viewsX1,
												data.viewsX2
											],
											onXLabel: (index, value) => set([
												"viewsX0",
												"viewsX1",
												"viewsX2"
											][index], value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex items-center gap-4 text-[12px] text-white/80",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "h-2 w-2 rounded-full",
													style: { background: "#eb22d4" }
												}), "This reel"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-white/40" }), "Your typical reel"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "What impacts your views" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[13px] text-white/75",
											children: "Rates are listed in order of importance to reach."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 divide-y divide-white/5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactRow, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
														src: "/assets/timer-C9hxXrwb.png",
														alt: "Skip",
														className: "h-[19px] w-[19px]"
													}),
													label: "Skip rate",
													value: data.skipRate,
													onChange: (value) => set("skipRate", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactRow, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
														src: "/assets/share-0H-pAryc.png",
														alt: "Share",
														className: "h-[19px] w-[19px]"
													}),
													label: "Share rate",
													value: data.shareRate,
													onChange: (value) => set("shareRate", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactRow, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
														src: "/assets/heart-BayXRS8Q.png",
														alt: "Like",
														className: "h-[19px] w-[19px]"
													}),
													label: "Like rate",
													value: data.likeRate,
													onChange: (value) => set("likeRate", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactRow, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
														src: "/assets/bookmark-D-AJcAo6.png",
														alt: "Save",
														className: "h-[19px] w-[19px]"
													}),
													label: "Save rate",
													value: data.saveRate,
													onChange: (value) => set("saveRate", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactRow, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
														src: "/assets/repost-2ZMzA8ZP.png",
														alt: "Repost",
														className: "h-[19px] w-[19px]"
													}),
													label: "Repost rate",
													value: data.repostRate,
													onChange: (value) => set("repostRate", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactRow, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IgIcon, {
														src: "/assets/comment-DFv7chMC.png",
														alt: "Comment",
														className: "h-[19px] w-[19px]"
													}),
													label: "Comment rate",
													value: data.commentRate,
													onChange: (value) => set("commentRate", value)
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaChart, {
									title: "How long people watched your reel",
									thumb,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableSingleChart, {
										data: data.watch,
										onChange: (value) => {
											setEditing(true);
											set("watch", value);
										},
										showHandles: editing,
										yTop: data.watchYTop,
										yMid: data.watchYMid,
										onYTop: (value) => set("watchYTop", value),
										onYMid: (value) => set("watchYMid", value),
										xLabelsData: [data.watchX0, data.watchX1],
										onXLabel: (index, value) => set(["watchX0", "watchX1"][index], value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Top sources of views" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
												name: data.src1Name,
												val: data.src1Val,
												onName: (value) => set("src1Name", value),
												onVal: (value) => set("src1Val", value),
												color: IG_PINK
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
												name: data.src2Name,
												val: data.src2Val,
												onName: (value) => set("src2Name", value),
												onVal: (value) => set("src2Val", value),
												color: IG_PINK
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
												name: data.src3Name,
												val: data.src3Val,
												onName: (value) => set("src3Name", value),
												onVal: (value) => set("src3Val", value),
												color: IG_PINK
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
												name: data.src4Name,
												val: data.src4Val,
												onName: (value) => set("src4Name", value),
												onVal: (value) => set("src4Val", value),
												color: IG_PINK
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
												name: data.src5Name,
												val: data.src5Val,
												onName: (value) => set("src5Name", value),
												onVal: (value) => set("src5Val", value),
												color: IG_PINK
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 text-[14px] font-semibold text-white/90",
										children: "Ad"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex w-full items-center gap-3 py-2 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
												className: "h-5 w-5",
												strokeWidth: 2
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex-1 text-[15px]",
												children: "Boost this reel"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-white/60" })
										]
									})]
								})
							] }),
							tab === "Engagement" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Actions after viewing" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 divide-y divide-white/5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleRow, {
										label: "Follows",
										value: data.eFollows,
										onChange: (value) => set("eFollows", value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleRow, {
										label: "Profile visits",
										value: data.eProfileVisits,
										onChange: (value) => set("eProfileVisits", value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Interactions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 divide-y divide-white/5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleRow, {
												label: "Likes",
												value: data.eLikes,
												onChange: (value) => set("eLikes", value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleRow, {
												label: "Comments",
												value: data.eComments,
												onChange: (value) => set("eComments", value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleRow, {
												label: "Reposts",
												value: data.eReposts,
												onChange: (value) => set("eReposts", value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleRow, {
												label: "Shares",
												value: data.eShares,
												onChange: (value) => set("eShares", value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleRow, {
												label: "Saves",
												value: data.eSaves,
												onChange: (value) => set("eSaves", value)
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaChart, {
									title: "When people liked your reel",
									thumb,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableSingleChart, {
										data: data.likesOverTime,
										onChange: (value) => {
											setEditing(true);
											set("likesOverTime", value);
										},
										showHandles: editing,
										yTop: data.likesYTop,
										yMid: data.likesYMid,
										onYTop: (value) => set("likesYTop", value),
										onYMid: (value) => set("likesYMid", value),
										xLabelsData: [data.likesX0, data.likesX1],
										onXLabel: (index, value) => set(["likesX0", "likesX1"][index], value)
									})
								})
							] }),
							tab === "Audience" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Who viewed your reel" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
										label: "Followers",
										value: data.audFollowers,
										onChange: (value) => setComplementaryPercentage("audFollowers", "audNonFollowers", value),
										pct: parsePct(data.audFollowers),
										color: IG_PINK
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
										label: "Non-followers",
										value: data.audNonFollowers,
										onChange: (value) => setComplementaryPercentage("audNonFollowers", "audFollowers", value),
										pct: parsePct(data.audNonFollowers),
										color: IG_PURPLE
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Audience details" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex gap-2",
											children: [
												"Age",
												"Country",
												"Gender"
											].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setAudTab(item),
												className: "rounded-full border px-4 py-1.5 text-[13px] font-medium " + (audTab === item ? "border-white/20 bg-white/15 text-white" : "border-white/20 bg-transparent text-white/80"),
												children: item
											}, item))
										}),
										audTab === "Country" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 space-y-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
													name: data.c1Name,
													val: data.c1Val,
													onName: (value) => set("c1Name", value),
													onVal: (value) => set("c1Val", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
													name: data.c2Name,
													val: data.c2Val,
													onName: (value) => set("c2Name", value),
													onVal: (value) => set("c2Val", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
													name: data.c3Name,
													val: data.c3Val,
													onName: (value) => set("c3Name", value),
													onVal: (value) => set("c3Val", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
													name: data.c4Name,
													val: data.c4Val,
													onName: (value) => set("c4Name", value),
													onVal: (value) => set("c4Val", value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryRow, {
													name: data.c5Name,
													val: data.c5Val,
													onName: (value) => set("c5Name", value),
													onVal: (value) => set("c5Val", value)
												})
											]
										}),
										audTab === "Age" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 space-y-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
													label: "13-17",
													value: data.a1,
													onChange: (value) => set("a1", value),
													pct: parsePct(data.a1),
													color: IG_PINK
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
													label: "18-24",
													value: data.a2,
													onChange: (value) => set("a2", value),
													pct: parsePct(data.a2),
													color: IG_PINK
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
													label: "25-34",
													value: data.a3,
													onChange: (value) => set("a3", value),
													pct: parsePct(data.a3),
													color: IG_PINK
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
													label: "35-44",
													value: data.a4,
													onChange: (value) => set("a4", value),
													pct: parsePct(data.a4),
													color: IG_PINK
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
													label: "45-54",
													value: data.a5,
													onChange: (value) => set("a5", value),
													pct: parsePct(data.a5),
													color: IG_PINK
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
													label: "55-64",
													value: data.a6,
													onChange: (value) => set("a6", value),
													pct: parsePct(data.a6),
													color: IG_PINK
												})
											]
										}),
										audTab === "Gender" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 space-y-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
												label: "Men",
												value: data.gMen,
												onChange: (value) => setComplementaryPercentage("gMen", "gWomen", value),
												pct: parsePct(data.gMen),
												color: IG_PINK
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
												label: "Women",
												value: data.gWomen,
												onChange: (value) => setComplementaryPercentage("gWomen", "gMen", value),
												pct: parsePct(data.gWomen),
												color: IG_PURPLE
											})]
										})
									]
								})
							] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm text-black shadow-lg transition-all " + (savedToast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"),
				children: "Saved"
			}),
			isImportOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-black/75 p-5 backdrop-blur-sm",
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "import-reel-title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleImport,
					className: "w-full max-w-sm rounded-2xl border border-white/15 bg-zinc-950 p-5 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "import-reel-title",
							className: "text-lg font-semibold text-white",
							children: "Import Instagram reel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-white",
							children: "Paste a public reel link to import its available metadata and thumbnail."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-5 block text-sm font-medium text-white",
							htmlFor: "instagram-reel-url",
							children: "Instagram reel link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "instagram-reel-url",
							type: "url",
							required: true,
							value: reelUrl,
							onChange: (event) => setReelUrl(event.target.value),
							placeholder: "https://www.instagram.com/reel/...",
							className: "mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#eb22d4]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs leading-5 text-white",
							children: "This imports the thumbnail, creator, and caption/title, plus visible likes and comments whenever Instagram makes them available. Shares, reposts, saves, duration, and insights are private."
						}),
						importError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-red-300",
							children: importError
						}),
						importNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-emerald-300",
							children: importNotice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsImportOpen(false),
								className: "rounded-lg px-3 py-2 text-sm font-medium text-white",
								children: "Close"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: isImporting,
								className: "inline-flex items-center gap-2 rounded-lg bg-[#eb22d4] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60",
								children: [isImporting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" }), isImporting ? "Importing…" : importError ? "Retry import" : "Import"]
							})]
						})
					]
				})
			})
		]
	});
}
function SectionTitle({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-[17px] font-semibold",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-white/60" })]
	});
}
function StatIcon({ icon, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-1.5 text-white/95",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-7 items-center justify-center",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
			value,
			onChange,
			className: "text-[15px]"
		})]
	});
}
function SummaryCard({ label, value, onChange, onLabelChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-[#25282d] px-4 py-3.5",
		children: [onLabelChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
			value: label,
			onChange: onLabelChange,
			className: "text-[13px] text-white/80",
			ariaLabel: "Accounts reached heading"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[13px] text-white/80",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
			value,
			onChange,
			className: "mt-1 block text-[22px] font-semibold tracking-tight text-white/90"
		})]
	});
}
function ImpactRow({ icon, label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 py-3.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white/[0.08] text-white/85",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 text-[15px]",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
				value,
				onChange,
				className: "text-[15px] font-semibold"
			})
		]
	});
}
function SimpleRow({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 text-[15px] text-white",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
			value,
			onChange,
			className: "text-[15px] font-semibold"
		})]
	});
}
function parsePct(value) {
	const number = parseFloat(value.replace(/[^0-9.]/g, ""));
	return Number.isNaN(number) ? 0 : Math.max(0, Math.min(100, number));
}
var IG_PINK = "#eb22d4";
var IG_PURPLE = "#7c3aea";
function BarRow({ label, value, onChange, pct, color = IG_PINK }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[14px] text-white",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[8px] flex-1 overflow-hidden rounded-full bg-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full",
				style: {
					width: `${pct}%`,
					background: color
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
			value,
			onChange,
			className: "w-14 text-right text-[14px] font-semibold"
		})]
	})] });
}
function CountryRow({ name, val, onName, onVal, color = IG_PINK }) {
	const pct = parsePct(val);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
		value: name,
		onChange: onName,
		className: "text-[15px] text-white"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[8px] flex-1 overflow-hidden rounded-full bg-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full",
				style: {
					width: `${pct}%`,
					background: color
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
			value: val,
			onChange: onVal,
			className: "w-14 text-right text-[14px] font-semibold"
		})]
	})] });
}
function MediaChart({ title, thumb, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: title }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-[160px] w-[110px] overflow-hidden rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: thumb,
						alt: "",
						className: "h-full w-full object-cover",
						loading: "lazy"
					})
				})
			}),
			children
		]
	});
}
function useDragPoints(points, onChange, yMin, yMax) {
	const svgRef = (0, import_react.useRef)(null);
	const dragIndex = (0, import_react.useRef)(null);
	const onPointerDown = (index) => (event) => {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		dragIndex.current = index;
	};
	const onPointerMove = (event) => {
		if (dragIndex.current === null || !svgRef.current) return;
		const rect = svgRef.current.getBoundingClientRect();
		const viewBox = svgRef.current.viewBox.baseVal;
		const y = (event.clientY - rect.top) / rect.height * viewBox.height;
		const next = points.slice();
		next[dragIndex.current] = Math.max(yMin, Math.min(yMax, y));
		onChange(next);
	};
	return {
		svgRef,
		onPointerDown,
		onPointerMove,
		onPointerUp: () => {
			dragIndex.current = null;
		}
	};
}
function pathFromPoints(points, width) {
	const step = width / (points.length - 1);
	return points.map((y, index) => `${index === 0 ? "M" : "L"}${(index * step).toFixed(1)},${y.toFixed(1)}`).join(" ");
}
function EditableLineChart({ main, typical, onMain, onTypical, yTop, yMid, onYTop, onYMid, xLabelsData, onXLabel, showHandles = true }) {
	const width = 320, height = 160;
	const svgRef = (0, import_react.useRef)(null);
	const activePoint = (0, import_react.useRef)(null);
	const movePoint = (event) => {
		const active = activePoint.current;
		if (!active || !svgRef.current) return;
		const rect = svgRef.current.getBoundingClientRect();
		const nextY = Math.max(5, Math.min(155, (event.clientY - rect.top) / rect.height * height));
		const points = (active.line === "main" ? main : typical).slice();
		points[active.index] = nextY;
		if (active.line === "main") onMain(points);
		else onTypical(points);
	};
	const startPoint = (line, index) => (event) => {
		event.preventDefault();
		event.currentTarget.setPointerCapture(event.pointerId);
		activePoint.current = {
			line,
			index
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-4 h-52 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-0 top-0 text-[11px] text-white/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: yTop,
					onChange: onYTop
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-0 top-1/2 -translate-y-1/2 text-[11px] text-white/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: yMid,
					onChange: onYMid
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-6 left-0 text-[11px] text-white/50",
				children: "0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				ref: svgRef,
				viewBox: `0 0 ${width} ${height}`,
				preserveAspectRatio: "none",
				className: "absolute inset-0 left-8 right-0 h-[calc(100%-1.5rem)] w-[calc(100%-2rem)] touch-none",
				onPointerMove: movePoint,
				onPointerUp: () => {
					activePoint.current = null;
				},
				onPointerLeave: () => {
					activePoint.current = null;
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "0",
						x2: width,
						y2: "0",
						stroke: "rgba(255,255,255,0.08)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: height / 2,
						x2: width,
						y2: height / 2,
						stroke: "rgba(255,255,255,0.08)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: height,
						x2: width,
						y2: height,
						stroke: "rgba(255,255,255,0.08)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: pathFromPoints(typical, width),
						fill: "none",
						stroke: "rgba(255,255,255,0.4)",
						strokeWidth: "2.5",
						strokeDasharray: "6 6",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					showHandles && typical.map((y, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: index * width / (typical.length - 1),
						cy: y,
						r: 7,
						fill: "rgba(255,255,255,0.001)",
						stroke: "rgba(255,255,255,0.5)",
						strokeWidth: "1",
						style: { cursor: "ns-resize" },
						onPointerDown: startPoint("typical", index)
					}, index)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: pathFromPoints(main, width),
						fill: "none",
						stroke: "#eb22d4",
						strokeWidth: "3.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					showHandles && main.map((y, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: index * width / (main.length - 1),
						cy: y,
						r: 8,
						fill: "#eb22d4",
						fillOpacity: "0.25",
						stroke: "#eb22d4",
						strokeWidth: "2",
						style: { cursor: "ns-resize" },
						onPointerDown: startPoint("main", index)
					}, index))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 left-8 right-0 flex justify-between text-[11px] text-white/50",
				children: xLabelsData.map((label, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: label,
					onChange: (value) => onXLabel(index, value)
				}, index))
			})
		]
	});
}
function EditableSingleChart({ data, onChange, showHandles = true, yTop, yMid, onYTop, onYMid, xLabelsData, onXLabel }) {
	const width = 320, height = 140;
	const drag = useDragPoints(data, onChange, 5, 135);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-6 h-44 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-0 top-2 text-[11px] text-white/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: yTop,
					onChange: onYTop
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-0 top-1/2 text-[11px] text-white/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: yMid,
					onChange: onYMid
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-6 left-0 text-[11px] text-white/50",
				children: "0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				ref: drag.svgRef,
				viewBox: `0 0 ${width} ${height}`,
				preserveAspectRatio: "none",
				className: "absolute inset-0 left-10 right-0 h-[calc(100%-1.5rem)] w-[calc(100%-2.5rem)] touch-none",
				onPointerMove: drag.onPointerMove,
				onPointerUp: drag.onPointerUp,
				onPointerLeave: drag.onPointerUp,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "10",
						x2: width,
						y2: "10",
						stroke: "rgba(255,255,255,0.08)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: height / 2,
						x2: width,
						y2: height / 2,
						stroke: "rgba(255,255,255,0.08)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: height - 10,
						x2: width,
						y2: height - 10,
						stroke: "rgba(255,255,255,0.08)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: pathFromPoints(data, width),
						fill: "none",
						stroke: "#eb22d4",
						strokeWidth: "3.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					showHandles && data.map((y, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: index * width / (data.length - 1),
						cy: y,
						r: 8,
						fill: "#eb22d4",
						fillOpacity: "0.25",
						stroke: "#eb22d4",
						strokeWidth: "2",
						style: { cursor: "ns-resize" },
						onPointerDown: drag.onPointerDown(index)
					}, index))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 left-10 right-0 flex justify-between text-[11px] text-white/50",
				children: xLabelsData.map((label, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: label,
					onChange: (value) => onXLabel(index, value)
				}, index))
			})
		]
	});
}
//#endregion
export { ReelInsightsPage as component };
