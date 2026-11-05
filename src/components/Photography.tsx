import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import Lightbox from "./Lightbox";
import { useProjects } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

export default function Photography() {
  const { data: projects, loading } = useProjects("photography");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!loading && projects.length === 0) return null;

  const images = projects.flatMap((project) =>
    (project.gallery_images?.length ? project.gallery_images : [project.cover_image])
      .filter((src): src is string => Boolean(src))
      .map((src) => ({
        src: resolveMediaUrl(src) ?? src,
        alt: project.title,
      }))
  );

  return (
    <section className="bg-primary py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="07" title="PHOTOGRAPHY" />

        {projects.map((project) => (
          <div key={project.id} className="mb-12 last:mb-0 sm:mb-16">
            <RevealOnScroll>
              <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-4">
                {project.title.toUpperCase()}
              </h2>
              <p className="mb-8 max-w-2xl leading-relaxed text-muted sm:mb-10">
                {project.description}
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {(project.gallery_images?.length ? project.gallery_images : [project.cover_image])
                .filter((src): src is string => Boolean(src))
                .map((src, i) => {
                  const resolved = resolveMediaUrl(src) ?? src;
                  const globalIndex = images.findIndex((img) => img.src === resolved);
                  return (
                    <RevealOnScroll key={src} delay={i * 0.06}>
                      <button
                        onClick={() => setLightboxIndex(globalIndex)}
                        className="block w-full group overflow-hidden"
                      >
                        <img
                          src={resolved}
                          alt={`${project.title} photo ${i + 1}`}
                          className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </button>
                    </RevealOnScroll>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}