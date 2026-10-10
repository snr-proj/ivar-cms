import type { VercelRequest } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// A lightweight client used only to verify a caller-supplied Supabase
// access token. It uses the public anon key — the same one the browser
// already has — and never touches the database directly.
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const authClient = createClient(supabaseUrl, anonKey);

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface AdminUser {
  userId: string;
  email: string | null;
}

/**
 * Verifies the Authorization: Bearer <token> header against Supabase Auth.
 * Throws HttpError(401) if missing/invalid.
 *
 * There's no public sign-up for this app — every account is created by
 * hand in the Supabase dashboard (see README) — so any authenticated user
 * is treated as an admin. If that ever changes, check a role/claim here.
 */
export async function requireAdmin(req: VercelRequest): Promise<AdminUser> {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    throw new HttpError(401, "Missing Authorization header — please sign in again");
  }

  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) {
    throw new HttpError(401, "Invalid or expired session — please sign in again");
  }

  return { userId: data.user.id, email: data.user.email ?? null };
}

export function sendError(res: { status: (code: number) => { json: (body: unknown) => void } }, err: unknown) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
