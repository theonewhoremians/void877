import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type License = {
  access_code: string;
  plan: string;
  active: boolean;
  duration_days: number | null;
  activated_at: string | null;
  expires_at: string | null;
  device_id: string | null;
  activation_count: number;
  notes: string | null;
};

type FunctionResponse = {
  error?: string;
  license?: License;
  licenses?: License[];
  ok?: boolean;
};

const durations = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "100 Days", value: 100 },
  { label: "180 Days", value: 180 },
  { label: "365 Days", value: 365 },
  { label: "Lifetime", value: "lifetime" },
];

export const Route = createFileRoute("/admin")({ component: AdminPage });

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function remainingDays(expiresAt: string | null) {
  if (!expiresAt) return "Lifetime";
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000));
}

function durationLabel(durationDays: number | null) {
  if (durationDays === null) return "Lifetime";
  return `${durationDays} ${durationDays === 1 ? "Day" : "Days"}`;
}

function expiryLabel(license: License) {
  if (license.duration_days === null) return "Lifetime";
  if (!license.expires_at) {
    return `${durationLabel(license.duration_days)} · starts on first activation`;
  }

  return `${new Date(license.expires_at).toLocaleDateString()} · ${remainingDays(license.expires_at)}d`;
}

function AdminPage() {
  const [key, setKey] = useState("");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState("Premium");
  const [duration, setDuration] = useState("30");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const requestId = useRef(0);
  const debouncedQuery = useDebouncedValue(query.trim(), 350);

  const invoke = useCallback(
    async (name: string, body?: unknown, method = "POST") => {
      if (!supabase) throw new Error("License service is not configured.");

      const { data, error } = await supabase.functions.invoke<FunctionResponse>(name, {
        method,
        body,
        headers: { "x-admin-key": key },
      });

      if (error || data?.error) {
        throw new Error(data?.error ?? error?.message ?? "Request failed.");
      }

      return data ?? {};
    },
    [key],
  );

  const load = useCallback(
    async (searchQuery = debouncedQuery) => {
      if (!key.trim()) {
        setNotice("Enter your admin API key first.");
        return;
      }

      const currentRequest = ++requestId.current;
      setIsLoading(true);

      try {
        const data = await invoke(
          `manage-license?q=${encodeURIComponent(searchQuery)}`,
          undefined,
          "GET",
        );

        if (currentRequest === requestId.current) {
          setLicenses(data.licenses ?? []);
          setNotice("");
        }
      } catch (error) {
        if (currentRequest === requestId.current) {
          setNotice(error instanceof Error ? error.message : "Could not load licenses.");
        }
      } finally {
        if (currentRequest === requestId.current) setIsLoading(false);
      }
    },
    [debouncedQuery, invoke, key],
  );

  useEffect(() => {
    if (key.trim()) void load(debouncedQuery);
  }, [debouncedQuery, key, load]);

  const replaceLicense = useCallback((updatedLicense: License) => {
    setLicenses((current) =>
      current.map((license) =>
        license.access_code === updatedLicense.access_code ? updatedLicense : license,
      ),
    );
  }, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    if (isCreating) return;

    setIsCreating(true);
    try {
      const data = await invoke("create-license", {
        plan,
        durationDays: duration === "lifetime" ? null : Number(duration),
      });

      if (!data.license) {
        throw new Error("The license was created but no license details were returned.");
      }

      const normalizedQuery = query.trim().toUpperCase();
      if (!normalizedQuery || data.license.access_code.includes(normalizedQuery)) {
        setLicenses((current) => [data.license!, ...current]);
      }

      setNotice(`Created: ${data.license.access_code}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Create failed.");
    } finally {
      setIsCreating(false);
    }
  }

  async function action(accessCode: string, actionName: string, days?: number) {
    if (pendingAction) return;

    setPendingAction(`${accessCode}:${actionName}`);
    try {
      const data =
        actionName === "reset"
          ? await invoke("reset-device", { accessCode })
          : await invoke("manage-license", { accessCode, action: actionName, days });

      if (actionName === "delete") {
        setLicenses((current) => current.filter((license) => license.access_code !== accessCode));
        setNotice(`Deleted: ${accessCode}`);
      } else if (data.license) {
        replaceLicense(data.license);
        setNotice("License updated.");
      } else {
        throw new Error("The license was updated but no license details were returned.");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setPendingAction(null);
    }
  }

  function exportCsv() {
    const rows = [
      "Access Code,Plan,Active,Expiry,Activated,Device ID,Remaining Days",
      ...licenses.map((license) =>
        [
          license.access_code,
          license.plan,
          license.active,
          expiryLabel(license),
          license.activated_at ?? "",
          license.device_id ?? "",
          remainingDays(license.expires_at),
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      ),
    ];

    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "licenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-5 text-zinc-100 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-fuchsia-400">
            EditFlow
          </p>
          <h1 className="mt-1 text-3xl font-semibold">License Admin</h1>
        </header>

        <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
          <label className="text-sm">
            Admin API key
            <input
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              className="ml-3 rounded bg-black px-3 py-2"
            />
            <button
              type="button"
              onClick={() => void load(query.trim())}
              disabled={isLoading}
              className="ml-2 rounded bg-white px-3 py-2 text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Load"}
            </button>
          </label>
        </div>

        <form
          onSubmit={create}
          className="flex flex-wrap gap-3 rounded-xl border border-white/10 bg-zinc-900 p-4"
        >
          <input
            value={plan}
            onChange={(event) => setPlan(event.target.value)}
            placeholder="Plan"
            className="rounded bg-black px-3 py-2"
          />
          <select
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="rounded bg-black px-3 py-2"
          >
            {durations.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            disabled={isCreating}
            className="rounded bg-fuchsia-500 px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create license"}
          </button>
        </form>

        {notice && <p className="text-sm text-fuchsia-300">{notice}</p>}

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search access code"
            className="rounded bg-black px-3 py-2"
          />
          <button
            type="button"
            onClick={() => void load(query.trim())}
            disabled={isLoading}
            className="rounded border border-white/20 px-3 py-2 disabled:opacity-60"
          >
            Search
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded border border-white/20 px-3 py-2"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                {[
                  "Code",
                  "Plan",
                  "Status",
                  "Expiry / remaining",
                  "Activated",
                  "Device",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="p-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => {
                const pending = pendingAction?.startsWith(`${license.access_code}:`);
                return (
                  <tr key={license.access_code} className="border-t border-white/10">
                    <td className="p-3 font-mono">{license.access_code}</td>
                    <td className="p-3">{license.plan}</td>
                    <td className="p-3">{license.active ? "Active" : "Disabled"}</td>
                    <td className="p-3">{expiryLabel(license)}</td>
                    <td className="p-3">
                      {license.activated_at
                        ? new Date(license.activated_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="max-w-36 truncate p-3" title={license.device_id ?? ""}>
                      {license.device_id ?? "—"}
                    </td>
                    <td className="flex flex-wrap gap-2 p-3">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          void action(
                            license.access_code,
                            license.active ? "disable" : "enable",
                          )
                        }
                        className="underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {license.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => void action(license.access_code, "extend", 30)}
                        className="underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +30d
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => void action(license.access_code, "extend", 90)}
                        className="underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +90d
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          const value = prompt("Extend by how many days?");
                          if (value) void action(license.access_code, "extend", Number(value));
                        }}
                        className="underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Custom
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => void action(license.access_code, "reset")}
                        className="underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reset device
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (confirm(`Delete ${license.access_code}?`)) {
                            void action(license.access_code, "delete");
                          }
                        }}
                        className="text-red-400 underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
