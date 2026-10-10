import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useSiteSettings } from "@/hooks/usePortfolioData";

export default function Background() {
  const { data: settings } = useSiteSettings();
  const education = settings?.education?.[0];

  if (!education) return null;

  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="11" title="BACKGROUND" />

        <RevealOnScroll>
          <div className="max-w-xl">
            <p className="text-ink/90 font-medium">{education.degree}</p>
            <p className="text-muted text-sm mt-1">{education.school}</p>
            <p className="text-muted text-sm">{education.location}</p>
            <p className="label mt-3">{education.years}</p>

            {education.recognitions && education.recognitions.length > 0 && (
              <ul className="mt-6 flex flex-col gap-1.5">
                {education.recognitions.map((r) => (
                  <li key={r} className="text-sm text-muted">
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
