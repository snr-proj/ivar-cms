import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useProjects } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

export default function BehindTheScenes() {
  const { data: projects, loading } = useProjects("early-production");

  if (!loading && projects.length === 0) return null;

  return (
    <section className="bg-secondary py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="08" title="BEHIND THE SCENES" />
        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-5 sm:mb-6">
            EARLY PRODUCTION
            <br />
            EXPERIENCE
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="mb-10 max-w-2xl leading-relaxed text-muted sm:mb-12">
            Gained hands-on experience across production, content creation, and
            event coverage with When in Rizal — shoot preparation, equipment
            handling, shot-list development, production assistance, hosting,
            and client-facing work.
          </p>
        </RevealOnScroll>
      </div>

      {/* Desktop: horizontal scroll. Mobile: 2-column grid. */}
      <div className="container-x">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:flex md:snap-x md:snap-mandatory md:overflow-x-auto md:pb-4">
          {projects.map((project, i) => (
            <RevealOnScroll
              key={project.id}
              delay={i * 0.05}
              className="min-w-0 md:w-[280px] md:shrink-0 md:snap-start lg:w-[320px]"
            >
              <div className="overflow-hidden mb-3">
                <img
                  src={resolveMediaUrl(project.cover_image) ?? undefined}
                  alt={project.title}
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-sm text-ink/90">{project.title}</p>
              <p className="text-xs text-muted">{project.role}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}