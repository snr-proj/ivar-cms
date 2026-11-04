import { useEffect, useState } from "react";
import { supabase, SUPABASE_CONFIGURED } from "@/lib/supabase";
import type { Project, Experience, Skill, SiteSettings, ProjectCategory } from "@/types";

interface FetchState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

function useSupabaseQuery<T>(
  key: string,
  queryFn: () => Promise<{ data: T | null; error: { message: string } | null }>,
  fallback: T
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: fallback,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      setState({
        data: fallback,
        loading: false,
        error:
          "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
      });
      return;
    }
    let active = true;
    setState((s) => ({ ...s, loading: true }));
    queryFn().then(({ data, error }) => {
      if (!active) return;
      setState({
        data: data ?? fallback,
        loading: false,
        error: error ? error.message : null,
      });
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

/**
 * All published TOP-LEVEL projects, optionally filtered by category.
 * Projects that belong to a brand (parent_id set) are left out here — they
 * only appear on their brand's page (see useChildProjects).
 */
export function useProjects(category?: ProjectCategory) {
  return useSupabaseQuery<Project[]>(
    `projects-${category ?? "all"}`,
    async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      const topLevel = ((data as Project[] | null) ?? []).filter((p) => !p.parent_id);
      return { data: error ? null : topLevel, error };
    },
    []
  );
}

/** Published projects listed under a brand (parent_id = the brand's id). */
export function useChildProjects(parentId: string | undefined) {
  return useSupabaseQuery<Project[]>(
    `children-${parentId ?? "none"}`,
    async () => {
      if (!parentId) return { data: [], error: null };
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("parent_id", parentId)
        .eq("published", true)
        .order("sort_order", { ascending: true });
      return { data: data as Project[] | null, error };
    },
    []
  );
}

/** A single project by id (used to find a sub-project's parent brand). */
export function useProjectById(id: string | null | undefined) {
  return useSupabaseQuery<Project | null>(
    `project-id-${id ?? "none"}`,
    async () => {
      if (!id) return { data: null, error: null };
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      return { data: data as Project | null, error };
    },
    null
  );
}

/** A single project by slug (used by the project detail route). */
export function useProject(slug: string | undefined) {
  return useSupabaseQuery<Project | null>(
    `project-${slug}`,
    async () => {
      if (!slug) return { data: null, error: null };
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return { data: data as Project | null, error };
    },
    null
  );
}

export function useExperience() {
  return useSupabaseQuery<Experience[]>(
    "experience",
    async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true });
      return { data: data as Experience[] | null, error };
    },
    []
  );
}

export function useSkills() {
  return useSupabaseQuery<Skill[]>(
    "skills",
    async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true });
      return { data: data as Skill[] | null, error };
    },
    []
  );
}

export function useSiteSettings() {
  return useSupabaseQuery<SiteSettings | null>(
    "site-settings",
    async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      return { data: data as SiteSettings | null, error };
    },
    null
  );
}