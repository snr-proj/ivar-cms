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

/**
 * Converts a YouTube or Vimeo watch/share link (as pasted by a human into
 * the admin's "Video URL" field) into an embeddable iframe src. Any other
 * URL is returned unchanged — ProjectDetail falls back to a plain "Watch
 * video" link for those instead of an iframe.
 */
export function getVideoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}