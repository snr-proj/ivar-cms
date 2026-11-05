import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useSkills } from "@/hooks/usePortfolioData";
import type { SkillCategory } from "@/types";

const categoryOrder: SkillCategory[] = [
  "Production",
  "Digital & LED",
  "Camera & Visual",
  "Software",
];

export default function Capabilities() {
  const { data: skills } = useSkills();

  const grouped = categoryOrder.map((category) => ({
    category,
    items: skills.filter((s) => s.category === category),
  }));

  return (
    <section className="bg-secondary py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="10" title="CAPABILITIES" />
        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-10 sm:mb-16">
            CAPABILITIES
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
          {grouped.map((group, i) => (
            <RevealOnScroll key={group.category} delay={i * 0.08}>
              <h3 className="label mb-5">{group.category}</h3>
              <ul className="flex flex-col gap-2">
                {group.items.map((skill) => (
                  <li key={skill.id} className="text-ink/90 text-sm">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}