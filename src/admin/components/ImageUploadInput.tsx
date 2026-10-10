import { useState } from "react";
import { useInput } from "react-admin";
import { supabase } from "@/lib/supabase";
import { resolveMediaUrl } from "@/lib/media";

interface ImageUploadInputProps {
  source: string;
  label?: string;
  bucket?: "portfolio-images" | "portfolio-videos";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:<mime>;base64," prefix — the API only wants the payload.
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
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
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${source}/${crypto.randomUUID()}.${ext}`;
      const fileBase64 = await fileToBase64(file);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bucket, path, fileBase64, contentType: file.type }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error ?? `Upload failed (${res.status})`);
      }

      onChange(body.data.path as string);
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
