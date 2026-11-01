import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useProject } from "@/hooks/usePortfolioData";
import { resolveMediaUrl, getVideoEmbedUrl } from "@/lib/media";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, loading } = useProject(slug);

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
  const videoEmbedUrl = getVideoEmbedUrl(project.video_url);

  return (
    <>
      <Navbar />
      <main className="bg-primary pt-32 pb-24">
        <div className="max-w-container mx-auto px-6 md:px-10">
          <Link
            to="/#work"
            className="label flex items-center gap-2 mb-10 hover:text-accent transition-colors w-fit"
          >
            <ArrowLeft size={16} /> BACK
          </Link>

          <RevealOnScroll>
            <span className="label">{project.project_type}</span>
            <h1 className="font-sans font-extrabold text-section leading-[0.95] mt-3 mb-6">
              {project.client ?? project.title}
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="grid md:grid-cols-[1fr_1fr] gap-10 mb-14 text-sm">
              {project.role && (
                <div>
                  <p className="label mb-1">ROLE</p>
                  <p className="text-ink/90">{project.role}</p>
                </div>
              )}
              {project.production_company && (
                <div>
                  <p className="label mb-1">PRODUCTION</p>
                  <p className="text-ink/90">{project.production_company}</p>
                </div>
              )}
              {project.year && (
                <div>
                  <p className="label mb-1">YEAR</p>
                  <p className="text-ink/90">{project.year}</p>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {project.cover_image && (
            <RevealOnScroll delay={0.15}>
              <img
                src={resolveMediaUrl(project.cover_image) ?? undefined}
                alt={project.title}
                className="w-full aspect-[16/9] object-cover mb-12"
              />
            </RevealOnScroll>
          )}

          {project.video_url && (
            <RevealOnScroll delay={0.17}>
              {videoEmbedUrl ? (
                <div className="w-full aspect-[16/9] mb-12">
                  <iframe
                    src={videoEmbedUrl}
                    title={`${project.title} video`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label flex items-center gap-2 mb-12 hover:text-accent transition-colors w-fit"
                >
                  WATCH VIDEO <ArrowUpRight size={16} />
                </a>
              )}
            </RevealOnScroll>
          )}

          {project.description && (
            <RevealOnScroll delay={0.2}>
              <p className="text-ink/90 text-lg leading-relaxed max-w-2xl mb-10">
                {project.description}
              </p>
            </RevealOnScroll>
          )}

          {project.contributions && project.contributions.length > 0 && (
            <RevealOnScroll delay={0.25}>
              <p className="label mb-3">CONTRIBUTIONS</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-14">
                {project.contributions.map((c) => (
                  <span key={c} className="text-sm text-accent uppercase tracking-label">
                    {c}
                  </span>
                ))}
              </div>
            </RevealOnScroll>
          )}

          {gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((src, i) => (
                <RevealOnScroll key={src} delay={i * 0.06}>
                  <img
                    src={resolveMediaUrl(src) ?? undefined}
                    alt={`${project.title} gallery ${i + 1}`}
                    className="w-full aspect-[4/5] object-cover"
                    loading="lazy"
                  />
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}