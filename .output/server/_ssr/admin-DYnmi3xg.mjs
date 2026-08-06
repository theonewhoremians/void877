import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-CoQutyqX.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DYnmi3xg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var durations = [
	{
		label: "1 Day",
		value: 1
	},
	{
		label: "7 Days",
		value: 7
	},
	{
		label: "30 Days",
		value: 30
	},
	{
		label: "90 Days",
		value: 90
	},
	{
		label: "100 Days",
		value: 100
	},
	{
		label: "180 Days",
		value: 180
	},
	{
		label: "365 Days",
		value: 365
	},
	{
		label: "Lifetime",
		value: "lifetime"
	}
];
function useDebouncedValue(value, delay = 350) {
	const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
		return () => window.clearTimeout(timeout);
	}, [delay, value]);
	return debouncedValue;
}
function remainingDays(expiresAt) {
	if (!expiresAt) return "Lifetime";
	return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 864e5));
}
function durationLabel(durationDays) {
	if (durationDays === null) return "Lifetime";
	return `${durationDays} ${durationDays === 1 ? "Day" : "Days"}`;
}
function expiryLabel(license) {
	if (license.duration_days === null) return "Lifetime";
	if (!license.expires_at) return `${durationLabel(license.duration_days)} · starts on first activation`;
	return `${new Date(license.expires_at).toLocaleDateString()} · ${remainingDays(license.expires_at)}d`;
}
function AdminPage() {
	const [key, setKey] = (0, import_react.useState)("");
	const [licenses, setLicenses] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [plan, setPlan] = (0, import_react.useState)("Premium");
	const [duration, setDuration] = (0, import_react.useState)("30");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isCreating, setIsCreating] = (0, import_react.useState)(false);
	const [pendingAction, setPendingAction] = (0, import_react.useState)(null);
	const requestId = (0, import_react.useRef)(0);
	const debouncedQuery = useDebouncedValue(query.trim(), 350);
	const invoke = (0, import_react.useCallback)(async (name, body, method = "POST") => {
		if (!supabase) throw new Error("License service is not configured.");
		const { data, error } = await supabase.functions.invoke(name, {
			method,
			body,
			headers: { "x-admin-key": key }
		});
		if (error || data?.error) throw new Error(data?.error ?? error?.message ?? "Request failed.");
		return data ?? {};
	}, [key]);
	const load = (0, import_react.useCallback)(async (searchQuery = debouncedQuery) => {
		if (!key.trim()) {
			setNotice("Enter your admin API key first.");
			return;
		}
		const currentRequest = ++requestId.current;
		setIsLoading(true);
		try {
			const data = await invoke(`manage-license?q=${encodeURIComponent(searchQuery)}`, void 0, "GET");
			if (currentRequest === requestId.current) {
				setLicenses(data.licenses ?? []);
				setNotice("");
			}
		} catch (error) {
			if (currentRequest === requestId.current) setNotice(error instanceof Error ? error.message : "Could not load licenses.");
		} finally {
			if (currentRequest === requestId.current) setIsLoading(false);
		}
	}, [
		debouncedQuery,
		invoke,
		key
	]);
	(0, import_react.useEffect)(() => {
		if (key.trim()) load(debouncedQuery);
	}, [
		debouncedQuery,
		key,
		load
	]);
	const replaceLicense = (0, import_react.useCallback)((updatedLicense) => {
		setLicenses((current) => current.map((license) => license.access_code === updatedLicense.access_code ? updatedLicense : license));
	}, []);
	async function create(event) {
		event.preventDefault();
		if (isCreating) return;
		setIsCreating(true);
		try {
			const data = await invoke("create-license", {
				plan,
				durationDays: duration === "lifetime" ? null : Number(duration)
			});
			if (!data.license) throw new Error("The license was created but no license details were returned.");
			const normalizedQuery = query.trim().toUpperCase();
			if (!normalizedQuery || data.license.access_code.includes(normalizedQuery)) setLicenses((current) => [data.license, ...current]);
			setNotice(`Created: ${data.license.access_code}`);
		} catch (error) {
			setNotice(error instanceof Error ? error.message : "Create failed.");
		} finally {
			setIsCreating(false);
		}
	}
	async function action(accessCode, actionName, days) {
		if (pendingAction) return;
		setPendingAction(`${accessCode}:${actionName}`);
		try {
			const data = actionName === "reset" ? await invoke("reset-device", { accessCode }) : await invoke("manage-license", {
				accessCode,
				action: actionName,
				days
			});
			if (actionName === "delete") {
				setLicenses((current) => current.filter((license) => license.access_code !== accessCode));
				setNotice(`Deleted: ${accessCode}`);
			} else if (data.license) {
				replaceLicense(data.license);
				setNotice("License updated.");
			} else throw new Error("The license was updated but no license details were returned.");
		} catch (error) {
			setNotice(error instanceof Error ? error.message : "Request failed.");
		} finally {
			setPendingAction(null);
		}
	}
	function exportCsv() {
		const rows = ["Access Code,Plan,Active,Expiry,Activated,Device ID,Remaining Days", ...licenses.map((license) => [
			license.access_code,
			license.plan,
			license.active,
			expiryLabel(license),
			license.activated_at ?? "",
			license.device_id ?? "",
			remainingDays(license.expires_at)
		].map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(","))];
		const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
		const link = document.createElement("a");
		link.href = url;
		link.download = "licenses.csv";
		link.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-zinc-950 p-5 text-zinc-100 md:p-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[.2em] text-fuchsia-400",
					children: "EditFlow"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-semibold",
					children: "License Admin"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-white/10 bg-zinc-900 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [
							"Admin API key",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: key,
								onChange: (event) => setKey(event.target.value),
								className: "ml-3 rounded bg-black px-3 py-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void load(query.trim()),
								disabled: isLoading,
								className: "ml-2 rounded bg-white px-3 py-2 text-black disabled:cursor-not-allowed disabled:opacity-60",
								children: isLoading ? "Loading..." : "Load"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: create,
					className: "flex flex-wrap gap-3 rounded-xl border border-white/10 bg-zinc-900 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: plan,
							onChange: (event) => setPlan(event.target.value),
							placeholder: "Plan",
							className: "rounded bg-black px-3 py-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: duration,
							onChange: (event) => setDuration(event.target.value),
							className: "rounded bg-black px-3 py-2",
							children: durations.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.value,
								children: item.label
							}, item.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: isCreating,
							className: "rounded bg-fuchsia-500 px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-60",
							children: isCreating ? "Creating..." : "Create license"
						})
					]
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fuchsia-300",
					children: notice
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Search access code",
							className: "rounded bg-black px-3 py-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void load(query.trim()),
							disabled: isLoading,
							className: "rounded border border-white/20 px-3 py-2 disabled:opacity-60",
							children: "Search"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: exportCsv,
							className: "rounded border border-white/20 px-3 py-2",
							children: "Export CSV"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-white/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-zinc-900 text-zinc-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
								"Code",
								"Plan",
								"Status",
								"Expiry / remaining",
								"Activated",
								"Device",
								"Actions"
							].map((heading) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: heading
							}, heading)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: licenses.map((license) => {
							const pending = pendingAction?.startsWith(`${license.access_code}:`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-white/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 font-mono",
										children: license.access_code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: license.plan
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: license.active ? "Active" : "Disabled"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: expiryLabel(license)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: license.activated_at ? new Date(license.activated_at).toLocaleDateString() : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "max-w-36 truncate p-3",
										title: license.device_id ?? "",
										children: license.device_id ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "flex flex-wrap gap-2 p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: pending,
												onClick: () => void action(license.access_code, license.active ? "disable" : "enable"),
												className: "underline disabled:cursor-not-allowed disabled:opacity-50",
												children: license.active ? "Disable" : "Enable"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: pending,
												onClick: () => void action(license.access_code, "extend", 30),
												className: "underline disabled:cursor-not-allowed disabled:opacity-50",
												children: "+30d"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: pending,
												onClick: () => void action(license.access_code, "extend", 90),
												className: "underline disabled:cursor-not-allowed disabled:opacity-50",
												children: "+90d"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: pending,
												onClick: () => {
													const value = prompt("Extend by how many days?");
													if (value) action(license.access_code, "extend", Number(value));
												},
												className: "underline disabled:cursor-not-allowed disabled:opacity-50",
												children: "Custom"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: pending,
												onClick: () => void action(license.access_code, "reset"),
												className: "underline disabled:cursor-not-allowed disabled:opacity-50",
												children: "Reset device"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: pending,
												onClick: () => {
													if (confirm(`Delete ${license.access_code}?`)) action(license.access_code, "delete");
												},
												className: "text-red-400 underline disabled:cursor-not-allowed disabled:opacity-50",
												children: "Delete"
											})
										]
									})
								]
							}, license.access_code);
						}) })]
					})
				})
			]
		})
	});
}
//#endregion
export { AdminPage as component };
