import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "./_lib/supabaseAdmin.js";
import { requireAdmin, sendError, HttpError } from "./_lib/auth.js";

// Images only — this app's video fields are plain URLs (e.g. a Vimeo link),
// never binary uploads. Keep the request body small and bounded.
export const config = {
  api: {
    bodyParser: { sizeLimit: "8mb" },
  },
};

const ALLOWED_BUCKETS = new Set(["portfolio-images", "portfolio-videos"]);
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * POST /api/upload — requires admin
 * Body: { bucket: "portfolio-images" | "portfolio-videos", path: string,
 *         fileBase64: string, contentType?: string }
 *
 * Uploads straight to Supabase Storage using the service_role key (the
 * browser no longer holds any credential capable of writing to Storage)
 * and returns the stored object path for the form field to save.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    await requireAdmin(req);

    const { bucket, path, fileBase64, contentType } = (req.body ?? {}) as Record<string, unknown>;

    if (typeof bucket !== "string" || !ALLOWED_BUCKETS.has(bucket)) {
      throw new HttpError(400, "Invalid or missing bucket");
    }
    if (typeof path !== "string" || path.length === 0 || path.includes("..") || path.startsWith("/")) {
      throw new HttpError(400, "Invalid path");
    }
    if (typeof fileBase64 !== "string" || fileBase64.length === 0) {
      throw new HttpError(400, "Missing file data");
    }

    const buffer = Buffer.from(fileBase64, "base64");
    if (buffer.byteLength > MAX_BYTES) {
      throw new HttpError(413, "File too large (8MB limit)");
    }

    const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
      upsert: true,
      contentType: typeof contentType === "string" ? contentType : undefined,
    });

    if (uploadError) throw new HttpError(500, uploadError.message);

    res.status(200).json({ data: { path } });
  } catch (err) {
    sendError(res, err);
  }
}
