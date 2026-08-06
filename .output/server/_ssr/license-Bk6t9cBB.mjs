import { t as supabase } from "./supabase-CoQutyqX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/license-Bk6t9cBB.js
var SESSION_KEY = "editflow-license-session";
function clientError(message) {
	return new Error(message);
}
async function call(name, body, method = "POST", token) {
	if (!supabase) throw clientError("License service is not configured.");
	const { data, error } = await supabase.functions.invoke(name, {
		method,
		body,
		headers: token ? { Authorization: `Bearer ${token}` } : void 0
	});
	if (error) {
		let serverMessage;
		const response = error.context;
		if (response) try {
			serverMessage = (await response.clone().json()).error;
		} catch {}
		throw clientError(serverMessage ?? data?.error ?? error.message);
	}
	if (data?.error) throw clientError(data.error);
	return data;
}
function loadSession() {
	try {
		return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
	} catch {
		return null;
	}
}
function saveSession(session) {
	localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
function clearSession() {
	localStorage.removeItem(SESSION_KEY);
}
async function activateLicense(accessCode, deviceId, appVersion) {
	const result = await call("activate-license", {
		accessCode,
		deviceId,
		appVersion
	});
	saveSession(result);
	return result;
}
async function getLicenseStatus(token) {
	return call("license-status", void 0, "GET", token);
}
function createDeviceId() {
	const existing = localStorage.getItem("editflow-device-id");
	if (existing) return existing;
	const id = crypto.randomUUID();
	localStorage.setItem("editflow-device-id", id);
	return id;
}
//#endregion
export { loadSession as a, getLicenseStatus as i, clearSession as n, createDeviceId as r, activateLicense as t };
