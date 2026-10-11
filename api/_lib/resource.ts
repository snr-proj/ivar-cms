import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "./supabaseAdmin.js";
import { requireAdmin, sendError, HttpError } from "./auth.js";

interface ResourceOptions {
  table: string;
  defaultSort?: string;
  defaultOrder?: "asc" | "desc";
}

function firstString(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
}

function parseIdsParam(raw: unknown): string[] | null {
  const str = firstString(raw);
  if (!str) return null;
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseFilter(raw: unknown): Record<string, unknown> {
  const str = firstString(raw);
  if (!str) return {};
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * GET  /api/<resource>            → list (paginated, sorted, filtered) — public
 * GET  /api/<resource>?ids=a,b,c  → getMany — public
 * POST /api/<resource>            → create — requires admin
 */
export function resourceListHandler({
  table,
  defaultSort = "sort_order",
  defaultOrder = "asc",
}: ResourceOptions) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    try {
      if (req.method === "GET") {
        const ids = parseIdsParam(req.query.ids);

        if (ids) {
          const { data, error } = await supabaseAdmin.from(table).select("*").in("id", ids);
          if (error) throw new HttpError(500, error.message);
          res.status(200).json({ data });
          return;
        }

        const sort = firstString(req.query.sort) ?? defaultSort;
        const order = (firstString(req.query.order) ?? defaultOrder).toLowerCase();
        const start = Number(firstString(req.query.start) ?? 0) || 0;
        const end = Number(firstString(req.query.end) ?? start + 24);
        const filter = parseFilter(req.query.filter);

        let query = supabaseAdmin.from(table).select("*", { count: "exact" });

        for (const [key, value] of Object.entries(filter)) {
          if (value === undefined || value === null || value === "") continue;
          // "q" is a free-text search param some react-admin lists send;
          // there's no full-text index for it here, so it's ignored rather
          // than guessed at.
          if (key === "q") continue;
          query = query.eq(key, value as string | number | boolean);
        }

        query = query.order(sort, { ascending: order !== "desc" }).range(start, end);

        const { data, count, error } = await query;
        if (error) throw new HttpError(500, error.message);

        res.status(200).json({ data, total: count ?? data?.length ?? 0 });
        return;
      }

      if (req.method === "POST") {
        await requireAdmin(req);
        const payload = { ...(req.body ?? {}) } as Record<string, unknown>;
        delete payload.id;
        const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single();
        if (error) throw new HttpError(500, error.message);
        res.status(201).json({ data });
        return;
      }

      res.setHeader("Allow", "GET, POST");
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (err) {
      sendError(res, err);
    }
  };
}

/**
 * GET    /api/<resource>/:id → getOne — public
 * PUT    /api/<resource>/:id → update — requires admin
 * DELETE /api/<resource>/:id → delete — requires admin
 */
export function resourceItemHandler({ table }: ResourceOptions) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    try {
      const id = firstString(req.query.id);
      if (!id) throw new HttpError(400, "Missing id");

      if (req.method === "GET") {
        const { data, error } = await supabaseAdmin.from(table).select("*").eq("id", id).single();
        if (error) throw new HttpError(404, "Not found");
        res.status(200).json({ data });
        return;
      }

      if (req.method === "PUT" || req.method === "PATCH") {
        await requireAdmin(req);
        const payload = { ...(req.body ?? {}) } as Record<string, unknown>;
        delete payload.id;
        const { data, error } = await supabaseAdmin
          .from(table)
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw new HttpError(500, error.message);
        res.status(200).json({ data });
        return;
      }

      if (req.method === "DELETE") {
        await requireAdmin(req);
        const { data, error } = await supabaseAdmin
          .from(table)
          .delete()
          .eq("id", id)
          .select()
          .maybeSingle();
        if (error) throw new HttpError(500, error.message);
        res.status(200).json({ data: data ?? { id } });
        return;
      }

      res.setHeader("Allow", "GET, PUT, DELETE");
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (err) {
      sendError(res, err);
    }
  };
}
