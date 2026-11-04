import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import ProjectCard from "./ProjectCard";
import { useProjects } from "@/hooks/usePortfolioData";

const GAP = 24; // px — keep in sync with gap-6

export default function SelectedWork() {
  const { data: projects, loading } = useProjects("commercial");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [projects, updateButtons]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + GAP : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (!loading && projects.length === 0) return null;

  return (
    <section id="work" className="bg-primary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="03" title="SELECTED WORK" />

        <div className="mb-12 flex items-end justify-between gap-6">
          <RevealOnScroll>
            <h2 className="font-sans font-extrabold text-section leading-[0.95]">
              COMMERCIAL
              <br />
              PRODUCTION
            </h2>
          </RevealOnScroll>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              aria-label="Previous projects"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-primary disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next projects"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-primary disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <RevealOnScroll>
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="w-[80vw] shrink-0 snap-start sm:w-[400px] lg:w-[440px]"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}