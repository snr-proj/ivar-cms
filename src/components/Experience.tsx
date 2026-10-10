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
    <section id="experience" className="bg-primary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="09" title="EXPERIENCE" />
        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-16">
            EXPERIENCE
          </h2>
        </RevealOnScroll>

        <div className="flex flex-col divide-y divide-line">
          {experience.map((exp, i) => {
            const range = formatRange(exp.start_date, exp.end_date, exp.current);
            return (
              <RevealOnScroll key={exp.id} delay={i * 0.08}>
                <div className="grid md:grid-cols-[1fr_2fr] gap-6 py-10">
                  <div>
                    <h3 className="font-sans font-bold text-xl md:text-2xl">
                      {exp.company}
                    </h3>
                    {exp.organization && (
                      <p className="text-muted text-sm mt-1">{exp.organization}</p>
                    )}
                    {range && <p className="label mt-3">{range}</p>}
                  </div>

                  <div>
                    <p className="text-ink/90 font-medium mb-2">{exp.position}</p>
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
