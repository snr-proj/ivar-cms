import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useSiteSettings } from "@/hooks/usePortfolioData";

export default function About() {
  const { data: settings } = useSiteSettings();

  return (
    <section id="about" className="bg-primary py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="02" title="PROFILE" />

        <div className="grid items-start gap-8 md:grid-cols-12 md:gap-12 lg:gap-16">
          <RevealOnScroll className="md:col-span-5">
            <h2 className="font-sans font-extrabold text-section leading-[0.95]">
              ABOUT ME
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="md:col-span-7">
            <p className="max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink/90 sm:text-lg">
              {settings?.bio ??
                "I'm Ivar Delos Santos, a Media Production Artist with professional experience in commercial productions, on-set operations, digital content adaptation, and creative production."}
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}