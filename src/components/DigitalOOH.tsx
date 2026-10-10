import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useProjects } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

const flow = ["CLIENT MATERIAL", "ADAPTATION", "LED FITTING", "LIVE DISPLAY"];

export default function DigitalOOH() {
  const { data: projects } = useProjects("digital-ooh");
  const general = projects[0];

  return (
    <section className="bg-secondary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="05" title="DIGITAL OOH" />

        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-10">
            LED / DIGITAL OOH
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {flow.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="label !text-ink border border-line rounded-full px-4 py-2">
                  {step}
                </span>
                {i < flow.length - 1 && <span className="text-accent">→</span>}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
          <RevealOnScroll delay={0.15}>
            <p className="text-ink/90 text-lg leading-relaxed max-w-xl">
              {general?.description ??
                "In addition to production work, I edit, resize, and re-layout client-provided visual materials according to LED display specifications. I prepare and fit digital assets for various out-of-home formats, including gantry LEDs, standard LED billboards, and 3D digital billboards around BGC."}
            </p>
          </RevealOnScroll>

          {general?.cover_image && (
            <RevealOnScroll delay={0.2}>
              <img
                src={resolveMediaUrl(general.cover_image) ?? undefined}
                alt="Digital OOH / LED content placeholder"
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
            </RevealOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}
