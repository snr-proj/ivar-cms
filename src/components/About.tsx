import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useSiteSettings } from "@/hooks/usePortfolioData";

export default function About() {
  const { data: settings } = useSiteSettings();

  return (
    <section id="about" className="bg-primary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="02" title="PROFILE" />

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
          <RevealOnScroll>
            <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-8">
              ABOUT ME
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <p className="text-ink/90 text-lg leading-relaxed whitespace-pre-line">
              {settings?.bio ??
                "I'm Ivar Delos Santos, a Media Production Artist with professional experience in commercial productions, on-set operations, digital content adaptation, and creative production."}
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
