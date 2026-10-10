// ============================================================================
// Core domain types — mirror the Supabase schema in supabase/schema.sql.
// Keep these in sync whenever a column is added/changed.
// ============================================================================

export type ProjectCategory =
  | "commercial"
  | "digital-ooh"
  | "film"
  | "photography"
  | "early-production";

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  category: ProjectCategory;
  project_type: string | null;
  production_company: string | null;
  role: string | null;
  year: string | null;
  description: string | null;
  contributions: string[] | null;
  featured: boolean;
  sort_order: number;
  cover_image: string | null;
  gallery_images: string[] | null;
  video_url: string | null;
  // Digital OOH–specific fields (nullable; only used when category = 'digital-ooh')
  ooh_format: string | null;
  ooh_location: string | null;
  ooh_original_material: string | null;
  ooh_adapted_material: string | null;
  ooh_live_display_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type MediaType = "image" | "video";

export interface ProjectMedia {
  id: string;
  project_id: string;
  type: MediaType;
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  organization: string | null;
  position: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  description: string | null;
  responsibilities: string[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type SkillCategory =
  | "Production"
  | "Digital & LED"
  | "Camera & Visual"
  | "Software";

export interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  sort_order: number;
}

export interface EducationEntry {
  degree: string;
  school: string;
  location: string;
  years: string;
  recognitions: string[];
}

export interface SiteSettings {
  id: string;
  name: string;
  professional_title: string;
  location: string;
  email: string;
  phone: string | null;
  bio: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  vimeo_url: string | null;
  showreel_url: string | null;
  education: EducationEntry[] | null;
  updated_at: string;
}
