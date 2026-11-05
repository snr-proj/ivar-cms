import { useRef, useState } from "react";
import { useInput } from "react-admin";
import { X } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";
import { uploadImage } from "./uploadImage";

interface GalleryUploadInputProps {
  source: string;
  label?: string;
  /** Show a "needs N more" hint until this many pictures are added. */
  minimum?: number;
}

/**
 * Multi-picture uploader for a text[] column (project gallery). Pick several
 * files at once; each is uploaded to Storage and its path is appended to the
 * list. Thumbnails can be removed individually.
 */
export default function GalleryUploadInput({
  source,
  label,
  minimum = 3,
}: GalleryUploadInputProps) {
  const {
    field: { value, onChange },
  } = useInput({ source });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const images: string[] = Array.isArray(value) ? value : [];

  const handleFiles = async (files: FileList) => {
    setBusy(true);
    setError(null);
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        added.push(await uploadImage(file, source));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      // Keep whatever uploaded successfully, even if a later file failed.
      if (added.length > 0) onChange([...images, ...added]);
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remaining = Math.max(0, minimum - images.length);

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="mb-2 block text-xs uppercase tracking-wide text-[#A0A0A0]">
          {label}
        </label>
      )}

      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative">
              <img
                src={resolveMediaUrl(src) ?? undefined}
                alt=""
                className="h-24 w-32 rounded border border-[#464646] object-cover"
              />
              <button
                type="button"
                aria-label="Remove picture"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#181818] text-[#EDEBE6] ring-1 ring-[#464646] hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
        }}
        className="text-sm"
      />

      <p className={`mt-1 text-xs ${remaining > 0 ? "text-[#E0A458]" : "text-[#899474]"}`}>
        {busy
          ? "Uploading…"
          : remaining > 0
            ? `${images.length} of ${minimum} pictures — add ${remaining} more so the project page has at least ${minimum}.`
            : `${images.length} pictures ✓ — shown as the gallery on the project page.`}
      </p>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}