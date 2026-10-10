import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useProjects } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

export default function BehindTheScenes() {
  const { data: projects, loading } = useProjects("early-production");

  if (!loading && projects.length === 0) return null;

  return (
    <section className="bg-secondary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="08" title="BEHIND THE SCENES" />
        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-6">
            EARLY PRODUCTION
            <br />
            EXPERIENCE
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-muted max-w-2xl mb-12 leading-relaxed">
            Gained hands-on experience across production, content creation, and
            event coverage with When in Rizal — shoot preparation, equipment
            handling, shot-list development, production assistance, hosting,
            and client-facing work.
          </p>
        </RevealOnScroll>
      </div>

      {/* Desktop: horizontal scroll. Mobile: vertical stack. */}
      <div className="max-w-container mx-auto px-6 md:px-10">
        <div className="flex gap-4 overflow-x-auto md:overflow-x-scroll pb-4 snap-x snap-mandatory md:flex-row flex-col md:[&>*]:snap-start">
          {projects.map((project, i) => (
            <RevealOnScroll
              key={project.id}
              delay={i * 0.05}
              className="shrink-0 w-full md:w-[320px]"
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
