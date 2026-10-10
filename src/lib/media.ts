import { supabase } from "./supabase";

/**
 * Resolves an image/video reference stored in the database into a URL the
 * browser can load.
 *
 * - Absolute URLs (http/https) and local public paths (starting with "/")
 *   are returned as-is — this covers the seeded placeholder/local images
 *   that ship in public/images.
 * - Anything else is treated as a path inside the "portfolio-images" (or
 *   "portfolio-videos") Supabase Storage bucket and resolved to its public
 *   URL.
 */
export function resolveMediaUrl(
  value: string | null | undefined,
  bucket: "portfolio-images" | "portfolio-videos" = "portfolio-images"
): string | null {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  if (value.startsWith("/")) {
    return value;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(value);
  return data.publicUrl;
}
