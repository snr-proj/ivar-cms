import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useProjects } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

const flow = ["CLIENT MATERIAL", "ADAPTATION", "LED FITTING", "LIVE DISPLAY"];

export default function DigitalOOH() {
  const { data: projects } = useProjects("digital-ooh");
  const general = projects[0];

  const stages = [
    { label: "CLIENT MATERIAL", src: general?.ooh_original_material },
    { label: "ADAPTATION", src: general?.ooh_adapted_material },
    { label: "LIVE DISPLAY", src: general?.ooh_live_display_image },
  ].filter((stage) => stage.src);

  return (
    <section className="bg-secondary py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="05" title="DIGITAL OOH" />

        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-8 sm:mb-10">
            LED / DIGITAL OOH
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-3 sm:mb-12">
            {flow.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="label whitespace-nowrap rounded-full border border-line px-3 py-1.5 !text-ink sm:px-4 sm:py-2">
                  {step}
                </span>
                {i < flow.length - 1 && <span className="text-accent">→</span>}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-ink/90 sm:mb-14 sm:text-lg">
            {general?.description ??
              "In addition to production work, I edit, resize, and re-layout client-provided visual materials according to LED display specifications. I prepare and fit digital assets for various out-of-home formats, including gantry LEDs, standard LED billboards, and 3D digital billboards around BGC."}
          </p>
        </RevealOnScroll>

        {stages.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {stages.map((stage, i) => (
              <RevealOnScroll key={stage.label} delay={0.2 + i * 0.08}>
                <p className="label mb-3">{stage.label}</p>
                <img
                  src={resolveMediaUrl(stage.src) ?? undefined}
                  alt={`${stage.label} — Digital OOH / LED content`}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          general?.cover_image && (
            <RevealOnScroll delay={0.2}>
              <img
                src={resolveMediaUrl(general.cover_image) ?? undefined}
                alt="Digital OOH / LED content placeholder"
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
            </RevealOnScroll>
          )
        )}
      </div>
    </section>
  );
}