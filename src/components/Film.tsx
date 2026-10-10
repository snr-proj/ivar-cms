import { Link } from "react-router-dom";
import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useProjects } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

export default function Film() {
  const { data: projects, loading } = useProjects("film");

  if (!loading && projects.length === 0) return null;

  return (
    <section className="bg-primary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="06" title="FILM" />
        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-16">
            FILM
          </h2>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, i) => (
            <RevealOnScroll key={project.id} delay={i * 0.1}>
              <Link to={`/work/${project.slug}`} className="group block">
                <div className="overflow-hidden mb-5">
                  <img
                    src={resolveMediaUrl(project.cover_image) ?? undefined}
                    alt={`Still from ${project.title}`}
                    className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-serif italic text-2xl md:text-3xl mb-1">
                  "{project.title}"
                </h3>
                <p className="label !text-muted mb-1">
                  {project.production_company} — Finalist
                </p>
                <p className="text-muted text-sm">Role: {project.role}</p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
