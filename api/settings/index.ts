import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabaseAdmin.js";
import { requireAdmin, sendError, HttpError } from "../_lib/auth.js";
/**
 * site_settings is a single-row table — there's no list/CRUD UX for it, so
 * it gets one endpoint instead of the generic resource handler.
 *
 * GET        → the one row (or null if it hasn't been created yet) — public
 * POST / PUT → upsert it — requires admin
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw new HttpError(500, error.message);
      res.status(200).json({ data });
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      await requireAdmin(req);
      const payload = { ...(req.body ?? {}) } as Record<string, unknown>;
      const id = typeof payload.id === "string" ? payload.id : null;
      delete payload.id;

      const result = id
        ? await supabaseAdmin.from("site_settings").update(payload).eq("id", id).select().single()
        : await supabaseAdmin.from("site_settings").insert(payload).select().single();

      if (result.error) throw new HttpError(500, result.error.message);
      res.status(200).json({ data: result.data });
      return;
    }

    res.setHeader("Allow", "GET, POST, PUT");
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    sendError(res, err);
  }
}
