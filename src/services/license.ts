import { supabase } from "@/lib/supabase";

export type LicenseSession = {
  token: string;
  expiresAt: string;
  license: { id: string; plan: string; expiresAt: string | null; active: boolean };
};

export type LicenseStatus = {
  license: LicenseSession["license"];
  token?: string;
  expiresAt?: string;
};

const SESSION_KEY = "editflow-license-session";

export class LicenseServiceError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "LicenseServiceError";
  }
}

function clientError(message: string, status?: number) { return new LicenseServiceError(message, status); }

async function call<T>(name: string, body?: unknown, method = "POST", token?: string): Promise<T> {
  if (!supabase) throw clientError("License service is not configured.");
  const { data, error } = await supabase.functions.invoke(name, {
    method,
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (error) {
    let serverMessage: string | undefined;
    const response = (error as { context?: Response }).context;
    if (response) {
      try {
        const result = (await response.clone().json()) as { error?: string };
        serverMessage = result.error;
      } catch {}
    }
    throw clientError(serverMessage ?? data?.error ?? error.message, response?.status);
  }
  if (data?.error) throw clientError(data.error);
  return data as T;
}

export function loadSession(): LicenseSession | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); } catch { return null; }
}

export function saveSession(session: LicenseSession) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
export function clearSession() { localStorage.removeItem(SESSION_KEY); }

export async function activateLicense(accessCode: string, deviceId: string, appVersion: string) {
  const result = await call<LicenseSession>("activate-license", { accessCode, deviceId, appVersion });
  saveSession(result);
  return result;
}

export async function getLicenseStatus(token: string) {
  return call<LicenseStatus>("license-status", undefined, "GET", token);
}

export function isLicenseDenied(error: unknown) {
  return error instanceof LicenseServiceError && [401, 403, 404].includes(error.status ?? 0);
}

export async function refreshLicense(accessCode: string, deviceId: string, appVersion: string) {
  const result = await call<LicenseSession>("refresh-license", { accessCode, deviceId, appVersion });
  saveSession(result);
  return result;
}

export function createDeviceId() {
  const existing = localStorage.getItem("editflow-device-id");
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem("editflow-device-id", id);
  return id;
}
