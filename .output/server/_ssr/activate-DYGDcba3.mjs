import { n as __toESM } from "../_runtime.mjs";
import { a as loadSession, r as createDeviceId, t as activateLicense } from "./license-Bk6t9cBB.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activate-DYGDcba3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ActivatePage() {
	const navigate = useNavigate();
	const [code, setCode] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("checking");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const current = loadSession();
		if (current && new Date(current.expiresAt) > /* @__PURE__ */ new Date()) {
			navigate({
				to: "/",
				replace: true
			});
			return;
		}
		setState("ready");
	}, [navigate]);
	async function submit(event) {
		event.preventDefault();
		if (busy) return;
		setBusy(true);
		setMessage("");
		try {
			await activateLicense(code, createDeviceId(), "web");
			await navigate({
				to: "/",
				replace: true
			});
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Activation failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-zinc-950 p-6 text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-7 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[.2em] text-fuchsia-400",
					children: "EditFlow"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: "Enter Access Code"
				}),
				state === "checking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-zinc-400",
					children: "Checking your license…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-4",
					onSubmit: submit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-zinc-300",
							children: ["Access Code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: code,
								onChange: (event) => setCode(event.target.value.toUpperCase()),
								placeholder: "A8KD-4F9Q-LX7P",
								required: true,
								maxLength: 14,
								autoComplete: "off",
								autoFocus: true,
								className: "mt-2 w-full rounded-lg border border-white/15 bg-black px-3 py-3 font-mono tracking-wider outline-none focus:border-fuchsia-400"
							})]
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-sm text-red-400",
							children: message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: busy,
							className: "w-full rounded-lg bg-fuchsia-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50",
							children: busy ? "Activating…" : "Activate"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ActivatePage as component };
