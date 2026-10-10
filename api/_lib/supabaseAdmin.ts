import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service_role key, which bypasses Row Level
// Security entirely — that's the point: these functions ARE the security
// boundary now, enforced in code (see requireAdmin in ./auth.ts) rather than
// left to the database policies alone.
//
// SUPABASE_SERVICE_ROLE_KEY must be set as a plain (non "VITE_"-prefixed)
// environment variable in Vercel, so it is never bundled into the browser.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // eslint-disable-next-line no-console
  console.error(
    "[api] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Set SUPABASE_SERVICE_ROLE_KEY in your Vercel project's environment " +
      "variables (Settings → Environment Variables) — never in a VITE_-" +
      "prefixed variable or in any file that ships to the browser."
  );
}

export const supabaseAdmin = createClient(supabaseUrl ?? "", serviceRoleKey ?? "", {
  auth: { persistSession: false },
});
