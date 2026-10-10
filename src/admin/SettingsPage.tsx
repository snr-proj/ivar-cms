import { useEffect, useState } from "react";
import { Title, useNotify } from "react-admin";
import { supabase } from "@/lib/supabase";
import type { SiteSettings } from "@/types";

async function fetchSettings(): Promise<SiteSettings | null> {
  const res = await fetch("/api/settings");
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
  return (body?.data as SiteSettings | null) ?? null;
}

async function saveSettings(
  payload: Record<string, unknown>
): Promise<{ data?: SiteSettings; error?: string }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { error: body?.error ?? `Request failed (${res.status})` };
  return { data: body?.data as SiteSettings };
}

const emptyEducation = { degree: "", school: "", location: "", years: "", recognitions: [] as string[] };

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-wide text-[#A0A0A0] mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full bg-[#222222] border border-[#464646] rounded px-3 py-2 text-sm text-[#EDEBE6] focus:outline-none focus:border-[#899474]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#222222] border border-[#464646] rounded px-3 py-2 text-sm text-[#EDEBE6] focus:outline-none focus:border-[#899474]"
        />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const notify = useNotify();
  const [row, setRow] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((data) => setRow(data))
      .catch(() => setRow(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-[#A0A0A0]">Loading…</div>;

  const settings: SiteSettings = row ?? {
    id: "",
    name: "",
    professional_title: "",
    location: "",
    email: "",
    phone: "",
    bio: "",
    linkedin_url: "",
    instagram_url: "",
    vimeo_url: "",
    showreel_url: "",
    education: [emptyEducation],
    updated_at: "",
  };

  const education = settings.education?.[0] ?? emptyEducation;

  const update = (patch: Partial<SiteSettings>) =>
    setRow({ ...settings, ...patch } as SiteSettings);

  const updateEducation = (patch: Partial<typeof education>) =>
    update({ education: [{ ...education, ...patch }] });

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...(row?.id ? { id: row.id } : {}),
      name: settings.name,
      professional_title: settings.professional_title,
      location: settings.location,
      email: settings.email,
      phone: settings.phone,
      bio: settings.bio,
      linkedin_url: settings.linkedin_url || null,
      instagram_url: settings.instagram_url || null,
      vimeo_url: settings.vimeo_url || null,
      showreel_url: settings.showreel_url || null,
      education: settings.education,
    };

    const result = await saveSettings(payload);

    setSaving(false);
    if (result.error) {
      notify(`Save failed: ${result.error}`, { type: "error" });
    } else {
      if (result.data) setRow(result.data);
      notify("Settings saved", { type: "success" });
    }
  };

  return (
    <div className="p-2 max-w-2xl">
      <Title title="Settings" />
      <h1 className="text-xl font-semibold text-[#EDEBE6] mb-6">Site Settings</h1>

      <Field label="Name" value={settings.name} onChange={(v) => update({ name: v })} />
      <Field
        label="Professional title"
        value={settings.professional_title}
        onChange={(v) => update({ professional_title: v })}
      />
      <Field label="Location" value={settings.location} onChange={(v) => update({ location: v })} />
      <Field label="Email" value={settings.email} onChange={(v) => update({ email: v })} />
      <Field label="Phone" value={settings.phone ?? ""} onChange={(v) => update({ phone: v })} />
      <Field
        label="Bio (About Me)"
        value={settings.bio ?? ""}
        onChange={(v) => update({ bio: v })}
        textarea
      />

      <h2 className="text-sm uppercase tracking-wide text-[#899474] mt-8 mb-4">
        Social links (leave blank if you don't have one yet)
      </h2>
      <Field
        label="LinkedIn URL"
        value={settings.linkedin_url ?? ""}
        onChange={(v) => update({ linkedin_url: v })}
      />
      <Field
        label="Instagram URL"
        value={settings.instagram_url ?? ""}
        onChange={(v) => update({ instagram_url: v })}
      />
      <Field
        label="Vimeo URL"
        value={settings.vimeo_url ?? ""}
        onChange={(v) => update({ vimeo_url: v })}
      />
      <Field
        label="Showreel URL"
        value={settings.showreel_url ?? ""}
        onChange={(v) => update({ showreel_url: v })}
      />

      <h2 className="text-sm uppercase tracking-wide text-[#899474] mt-8 mb-4">Education</h2>
      <Field label="Degree" value={education.degree} onChange={(v) => updateEducation({ degree: v })} />
      <Field label="School" value={education.school} onChange={(v) => updateEducation({ school: v })} />
      <Field
        label="Location"
        value={education.location}
        onChange={(v) => updateEducation({ location: v })}
      />
      <Field label="Years" value={education.years} onChange={(v) => updateEducation({ years: v })} />
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-wide text-[#A0A0A0] mb-2">
          Recognitions (one per line)
        </label>
        <textarea
          rows={4}
          value={education.recognitions.join("\n")}
          onChange={(e) =>
            updateEducation({
              recognitions: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
            })
          }
          className="w-full bg-[#222222] border border-[#464646] rounded px-3 py-2 text-sm text-[#EDEBE6] focus:outline-none focus:border-[#899474]"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 bg-[#899474] text-[#181818] font-semibold px-6 py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}
