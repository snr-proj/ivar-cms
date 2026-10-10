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
    <section className="bg-primary py-24 md:py-36">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="07" title="PHOTOGRAPHY" />

        {projects.map((project) => (
          <div key={project.id} className="mb-16">
            <RevealOnScroll>
              <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-4">
                {project.title.toUpperCase()}
              </h2>
              <p className="text-muted max-w-2xl mb-10 leading-relaxed">
                {project.description}
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
