# EditFlow License System

Secure, account-free licensing for the web and Android clients. Customers receive only an access code. The browser client never reads the `licenses` table and never receives the Supabase service-role key.

## Architecture

```text
Web / Android -> HTTPS Supabase Edge Functions -> service-role database connection -> licenses
                                      |                                      |
                                   HS256 JWT                              RLS: no client policies
```

The code is activated once per device. `activate_license` locks the license row while it decides whether to bind the device, eliminating concurrent activation races. The expiration date is set on first activation, not creation. A valid 24-hour token permits offline use; when connectivity returns, `/license-status` rechecks the database and immediately reflects disablement or expiry.

## Install and deploy

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli), authenticate, then link your project: `supabase link --project-ref YOUR_PROJECT_REF`.
2. Apply the migration: `supabase db push`.
3. Create the Edge Function secrets. Do not put any of these in `VITE_*` variables or commit them:

   ```powershell
   supabase secrets set LICENSE_JWT_SECRET="<32+ random chars>" LICENSE_ADMIN_KEY="<long random admin key>" ALLOWED_ORIGIN="https://your-domain.example"
   ```

   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied by Supabase to deployed functions. For local serving, use `supabase/.env.example` as the template.
4. Deploy all functions:

   ```powershell
   supabase functions deploy activate-license
   supabase functions deploy refresh-license
   supabase functions deploy license-status
   supabase functions deploy create-license
   supabase functions deploy reset-device
   supabase functions deploy manage-license
   ```
5. Copy `.env.example` to `.env.local`, fill in the project URL and publishable/anon key, then run `npm run dev`.
6. Visit `/admin`, paste the admin API key for the session, and create codes. The key is intentionally not saved in local storage. Protect this route with an access-control layer (for example, a private VPN, Cloudflare Access, or a separate back-office domain) in production.

## API

All endpoints are under `https://YOUR_PROJECT_REF.supabase.co/functions/v1`. JSON responses include `{ error: string }` on failure. Requests use HTTPS.

| Endpoint | Auth | Body / result |
| --- | --- | --- |
| `POST /activate-license` | none | `{ accessCode, deviceId, appVersion }`; returns a 24-hour `token`, `expiresAt`, and license summary |
| `POST /refresh-license` | none | `{ accessCode, deviceId, appVersion }`; verifies the original bound device and returns a new token |
| `GET /license-status` | `Authorization: Bearer <token>` | Returns the current license summary; rejects disabled, expired, or moved licenses |
| `POST /create-license` | `x-admin-key` | `{ plan, durationDays }`; use `null` for lifetime |
| `POST /reset-device` | `x-admin-key` | `{ accessCode }`; clears only `device_id` |
| `POST /manage-license` | `x-admin-key` | `{ action: enable|disable|delete|extend, accessCode, days? }` |
| `GET /manage-license?q=CODE` | `x-admin-key` | Searches up to 200 licenses for the dashboard/export |

Durations 1, 7, 30, 90, 100, 180, and 365 days are offered by the dashboard. The API permits a bounded positive custom duration for operational flexibility. Renewal adds days to a future expiry, otherwise it starts from the current time. Lifetime uses `duration_days = null` and no expiry date.

## Android integration

Store the returned JWT and access code using Android Keystore-backed encrypted storage. Persist a stable app-install UUID as `deviceId` (do not use raw hardware identifiers). On startup:

1. Use the token locally only while `expiresAt` is in the future.
2. When online, call `GET /license-status` with the bearer token.
3. Refresh before expiry with the saved access code and same device ID.
4. If status or refresh says disabled/expired/device mismatch, clear premium access immediately.

Do not embed the service-role key, `LICENSE_JWT_SECRET`, or admin key in the Android APK. Consider device IDs an anti-sharing control, not an infallible hardware attestation: a rooted device can copy app data.

## Security notes

- `licenses` has RLS enabled, forced RLS, no public policies, and revoked public privileges.
- Only Edge Functions have the service-role secret and use parameterized Supabase queries/RPC.
- Inputs are length/format checked server-side. Codes use cryptographically random bytes.
- Configure `ALLOWED_ORIGIN` to the production website rather than `*` before deployment.
- Rotate `LICENSE_JWT_SECRET` to invalidate all issued tokens. Rotate `LICENSE_ADMIN_KEY` if it is exposed.
- Add API gateway/WAF rate limits for public activation routes in production; the app-level functions remain authoritative.

## Files

- `supabase/migrations/20260724000100_license_system.sql` — schema, RLS, indexes, atomic activation RPC
- `supabase/functions/` — six deployable Edge Functions and shared crypto/validation
- `src/routes/activate.tsx` — customer access-code screen
- `src/routes/admin.tsx` — browser admin dashboard
- `src/services/license.ts` — reusable website client API
"# leere" 
