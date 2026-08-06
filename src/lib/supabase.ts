import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// This client is only used to invoke Edge Functions. RLS intentionally gives it
// no direct access to licensing data.
export const supabase = url && key ? createClient(url, key) : null;
