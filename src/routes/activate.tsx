import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  activateLicense,
  createDeviceId,
  loadSession,
} from "@/services/license";

export const Route = createFileRoute("/activate")({ component: ActivatePage });

function ActivatePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"checking" | "ready">("checking");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const current = loadSession();
    if (current && new Date(current.expiresAt) > new Date()) {
      // A valid local token authorizes offline use. The home route performs
      // the non-blocking online status check after the app has opened.
      void navigate({ to: "/", replace: true });
      return;
    }

    setState("ready");
  }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setMessage("");
    try {
      await activateLicense(
        code,
        createDeviceId(),
        import.meta.env.VITE_APP_VERSION ?? "web",
      );
      // Session storage has completed successfully, so open the app now.
      await navigate({ to: "/", replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Activation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-6 text-white">
      <section className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-7 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-fuchsia-400">
          EditFlow
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Enter Access Code</h1>

        {state === "checking" ? (
          <p className="mt-3 text-zinc-400">Checking your license…</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm text-zinc-300">
              Access Code
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="A8KD-4F9Q-LX7P"
                required
                maxLength={14}
                autoComplete="off"
                autoFocus
                className="mt-2 w-full rounded-lg border border-white/15 bg-black px-3 py-3 font-mono tracking-wider outline-none focus:border-fuchsia-400"
              />
            </label>
            {message && (
              <p role="alert" className="text-sm text-red-400">
                {message}
              </p>
            )}
            <button
              disabled={busy}
              className="w-full rounded-lg bg-fuchsia-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Activating…" : "Activate"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
