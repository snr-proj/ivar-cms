import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const name = project.client ?? project.title;
  const label = project.project_type ?? "Commercial";
  const cover = resolveMediaUrl(project.cover_image);

  return (
    <Link
      to={`/work/${project.slug}`}
      className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-secondary ${className}`}
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {cover && (
        <img
          src={cover}
          alt={`${name} cover`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      )}

      <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-label text-primary">
        {label}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 pt-16">
        <h3 className="font-sans text-xl font-extrabold leading-tight md:text-2xl">{name}</h3>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-highlight text-primary transition-transform duration-300 group-hover:scale-110">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}