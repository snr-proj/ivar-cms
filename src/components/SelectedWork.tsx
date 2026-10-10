import { Link } from "react-router-dom";
import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useProjects } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

export default function SelectedWork() {
  const { data: projects, loading } = useProjects("commercial");

  if (!loading && projects.length === 0) return null;

  return (
    <section id="work" className="bg-primary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="03" title="SELECTED WORK" />
        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-16">
            COMMERCIAL
            <br />
            PRODUCTION
          </h2>
        </RevealOnScroll>

        <div className="flex flex-col divide-y divide-line">
          {projects.map((project, i) => (
            <RevealOnScroll key={project.id} delay={i * 0.08}>
              <Link
                to={`/work/${project.slug}`}
                className="group grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 py-12 items-center"
              >
                <div className="overflow-hidden">
                  <img
                    src={resolveMediaUrl(project.cover_image) ?? undefined}
                    alt={`${project.client ?? project.title} cover`}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div>
                  <span className="label">{project.project_type}</span>
                  <h3 className="font-sans font-extrabold text-project leading-[0.95] mt-3 mb-4">
                    {project.client ?? project.title}
                  </h3>
                  <p className="text-muted leading-relaxed max-w-xl mb-4">
                    {project.description}
                  </p>
                  {project.contributions && project.contributions.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {project.contributions.map((c) => (
                        <span key={c} className="text-xs text-accent uppercase tracking-label">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
