import { useEffect, useState } from "react";
import { Title } from "react-admin";
import { supabase } from "@/lib/supabase";

interface Counts {
  totalProjects: number;
  featuredProjects: number;
  experienceEntries: number;
  mediaAssets: number;
}

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="bg-[#222222] border border-[#464646] rounded-lg p-6 flex-1 min-w-[180px]">
      <p className="text-xs uppercase tracking-wide text-[#A0A0A0] mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#EDEBE6]">{value ?? "—"}</p>
    </div>
  );
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function load() {
      const [projects, featured, experience, media] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("featured", true),
        supabase.from("experience").select("id", { count: "exact", head: true }),
        supabase.from("project_media").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        totalProjects: projects.count ?? 0,
        featuredProjects: featured.count ?? 0,
        experienceEntries: experience.count ?? 0,
        mediaAssets: media.count ?? 0,
      });
    }
    load();
  }, []);

  return (
    <div className="p-2">
      <Title title="Dashboard" />
      <h1 className="text-xl font-semibold text-[#EDEBE6] mb-6">
        Welcome back, Ivar
      </h1>
      <div className="flex flex-wrap gap-4">
        <StatCard label="Total Projects" value={counts?.totalProjects ?? null} />
        <StatCard label="Featured Projects" value={counts?.featuredProjects ?? null} />
        <StatCard label="Experience Entries" value={counts?.experienceEntries ?? null} />
        <StatCard label="Media Assets" value={counts?.mediaAssets ?? null} />
      </div>
    </div>
  );
}
