import { useState } from "react";
import { useInput } from "react-admin";
import { resolveMediaUrl } from "@/lib/media";
import { uploadImage } from "./uploadImage";

interface ImageUploadInputProps {
  source: string;
  label?: string;
  bucket?: "portfolio-images" | "portfolio-videos";
}

/**
 * A single-image uploader. The file is sent (as base64) to our own
 * /api/upload serverless function, which uploads it to Supabase Storage
 * using the service_role key — the browser never holds a credential capable
 * of writing to Storage. The form field stores the returned object path (or
 * a local "/images/..." seed path, or a full URL, for existing content).
 */
export default function ImageUploadInput({
  source,
  label,
  bucket = "portfolio-images",
}: ImageUploadInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useInput({ source });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      onChange(await uploadImage(file, source, bucket));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = value ? resolveMediaUrl(value, bucket) : null;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs uppercase tracking-wide text-[#A0A0A0] mb-2">
          {label}
        </label>
      )}
      {previewUrl && (
        <img
          src={previewUrl}
          alt=""
          className="w-40 h-28 object-cover rounded mb-2 border border-[#464646]"
        />
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="text-sm"
      />
      {uploading && <p className="text-xs text-[#899474] mt-1">Uploading…</p>}
      {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error.message}</p>}
    </div>
  );
}