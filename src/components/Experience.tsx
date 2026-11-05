import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useExperience } from "@/hooks/usePortfolioData";

function formatRange(start: string | null, end: string | null, current: boolean) {
  const startYear = start ? new Date(start).getFullYear() : null;
  const endYear = current ? "Present" : end ? new Date(end).getFullYear() : null;
  if (!startYear && !endYear) return null;
  if (startYear && endYear) return `${startYear}–${endYear}`;
  return `${startYear ?? endYear}`;
}

export default function Experience() {
  const { data: experience } = useExperience();

  return (
    <section id="experience" className="bg-primary py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="09" title="EXPERIENCE" />
        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-10 sm:mb-16">
            EXPERIENCE
          </h2>
        </RevealOnScroll>

        <div className="flex flex-col divide-y divide-line">
          {experience.map((exp, i) => {
            const range = formatRange(exp.start_date, exp.end_date, exp.current);
            return (
              <RevealOnScroll key={exp.id} delay={i * 0.08}>
                <div className="grid gap-4 py-8 md:grid-cols-12 md:gap-12 md:py-10 lg:gap-16">
                  <div className="md:col-span-5">
                    <h3 className="font-sans text-xl font-bold md:text-2xl">
                      {exp.company}
                    </h3>
                    {exp.organization && (
                      <p className="text-muted text-sm mt-1">{exp.organization}</p>
                    )}
                    {range && <p className="label mt-3">{range}</p>}
                  </div>

                  <div className="md:col-span-7">
                    <p className="mb-2 font-medium text-ink/90">{exp.position}</p>
                    {exp.description && (
                      <p className="text-muted leading-relaxed mb-4 max-w-2xl">
                        {exp.description}
                      </p>
                    )}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {exp.responsibilities.map((r) => (
                          <span
                            key={r}
                            className="text-xs text-accent uppercase tracking-label"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}