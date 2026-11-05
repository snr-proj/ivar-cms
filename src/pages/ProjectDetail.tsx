import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProjectCard from "@/components/ProjectCard";
import ScrollToTop from "@/components/ScrollToTop";
import Lightbox from "@/components/Lightbox";
import { useProject, useChildProjects, useProjectById } from "@/hooks/usePortfolioData";
import { resolveMediaUrl } from "@/lib/media";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, loading } = useProject(slug);
  // Hooks must run before any early return below.
  const { data: children } = useChildProjects(project?.id);
  const { data: parent } = useProjectById(project?.parent_id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="label">LOADING…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6">
        <p className="label">PROJECT NOT FOUND</p>
        <Link to="/" className="label hover:text-accent transition-colors">
          ← BACK HOME
        </Link>
      </div>
    );
  }

  const gallery = (project.gallery_images ?? []).filter(Boolean);
  const galleryImages = gallery.map((src, i) => ({
    src: resolveMediaUrl(src) ?? src,
    alt: `${project.title} picture ${i + 1}`,
  }));
  const brandName = project.client ?? project.title;
  const cover = resolveMediaUrl(project.cover_image);

  // A sub-project goes back to its brand page; a brand goes back to the carousel.
  const backTo = parent ? `/work/${parent.slug}` : "/#work";
  const backLabel = parent ? `BACK TO ${(parent.client ?? parent.title).toUpperCase()}` : "BACK";

  return (
    <>
      <Navbar />
      <main className="bg-primary pb-16 pt-24 sm:pb-24 sm:pt-28 lg:pt-32">
        <div className="container-x">
          <Link
            to={backTo}
            className="label mb-8 flex w-fit items-center gap-2 transition-colors hover:text-accent sm:mb-10"
          >
            <ArrowLeft size={16} /> {backLabel}
          </Link>

          {/* Text on the left, standard-size cover on the right (stacked on small screens) */}
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] xl:gap-x-16">
            <header className="lg:col-start-1 lg:row-start-1">
              <RevealOnScroll>
                {project.project_type && <span className="label">{project.project_type}</span>}
                <h1 className="mt-3 font-sans text-section font-extrabold leading-[0.95]">
                  {brandName}
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5 text-sm">
                  {project.role && (
                    <div className="max-w-xs">
                      <dt className="label mb-1">ROLE</dt>
                      <dd className="text-ink/90">{project.role}</dd>
                    </div>
                  )}
                  {project.production_company && (
                    <div>
                      <dt className="label mb-1">PRODUCTION</dt>
                      <dd className="text-ink/90">{project.production_company}</dd>
                    </div>
                  )}
                  {project.year && (
                    <div>
                      <dt className="label mb-1">YEAR</dt>
                      <dd className="text-ink/90">{project.year}</dd>
                    </div>
                  )}
                </dl>
              </RevealOnScroll>
            </header>

            {cover && (
              <RevealOnScroll
                delay={0.15}
                className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
              >
                <img
                  src={cover}
                  alt={project.title}
                  className="aspect-[4/3] max-h-[70vh] w-full rounded-2xl object-cover"
                />
              </RevealOnScroll>
            )}

            <div className="lg:col-start-1 lg:row-start-2">
              {project.description && (
                <RevealOnScroll delay={0.2}>
                  <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink/90 sm:text-lg">
                    {project.description}
                  </p>
                </RevealOnScroll>
              )}

              {project.contributions && project.contributions.length > 0 && (
                <RevealOnScroll delay={0.25}>
                  <p className="label mb-3">CONTRIBUTIONS</p>
                  <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2">
                    {project.contributions.map((c) => (
                      <span key={c} className="text-sm uppercase tracking-label text-accent">
                        {c}
                      </span>
                    ))}
                  </div>
                </RevealOnScroll>
              )}

              {project.video_url && (
                <RevealOnScroll delay={0.3}>
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary transition-[filter] hover:brightness-110 sm:px-7 sm:py-4"
                  >
                    WATCH VIDEO <ExternalLink size={16} />
                  </a>
                </RevealOnScroll>
              )}
            </div>
          </div>

          {/* Pictures — click any to view full size */}
          {galleryImages.length > 0 && (
            <section className="mt-14 sm:mt-20">
              <RevealOnScroll>
                <p className="label mb-5 sm:mb-6">GALLERY</p>
              </RevealOnScroll>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {galleryImages.map((img, i) => (
                  <RevealOnScroll key={`${img.src}-${i}`} delay={(i % 3) * 0.08}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`View ${img.alt} full size`}
                      className="group block w-full overflow-hidden rounded-xl"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                  </RevealOnScroll>
                ))}
              </div>
            </section>
          )}

          {/* Other commercials / projects listed under this brand */}
          {children.length > 0 && (
            <section className="mt-14 sm:mt-20">
              <RevealOnScroll>
                <p className="label mb-5 sm:mb-6">MORE FROM {brandName.toUpperCase()}</p>
              </RevealOnScroll>
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {children.map((child, i) => (
                  <RevealOnScroll key={child.id} delay={(i % 3) * 0.06}>
                    <ProjectCard project={child} />
                  </RevealOnScroll>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />

      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}