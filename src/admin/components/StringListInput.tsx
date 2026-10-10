import { useInput } from "react-admin";

interface StringListInputProps {
  source: string;
  label?: string;
  helperText?: string;
}

/**
 * Edits a text[] column (e.g. contributions, responsibilities,
 * gallery_images) as a simple one-item-per-line textarea — much friendlier
 * for a non-developer than a nested array-of-objects form.
 */
export default function StringListInput({
  source,
  label,
  helperText,
}: StringListInputProps) {
  const {
    field: { value, onChange },
  } = useInput({ source });

  const text = Array.isArray(value) ? value.join("\n") : "";

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block text-xs uppercase tracking-wide text-[#A0A0A0] mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={4}
        value={text}
        onChange={(e) => {
          const lines = e.target.value
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
          onChange(lines);
        }}
        className="w-full bg-[#222222] border border-[#464646] rounded px-3 py-2 text-sm text-[#EDEBE6] focus:outline-none focus:border-[#899474]"
        placeholder="One item per line"
      />
      {helperText && <p className="text-xs text-[#A0A0A0] mt-1">{helperText}</p>}
    </div>
  );
}
