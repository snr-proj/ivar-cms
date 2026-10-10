import { Linkedin, Instagram, Film as FilmIcon, PlayCircle } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import SectionLabel from "./SectionLabel";
import { useSiteSettings } from "@/hooks/usePortfolioData";

export default function Contact() {
  const { data: settings } = useSiteSettings();

  const socials = [
    { url: settings?.linkedin_url, label: "LinkedIn", icon: Linkedin },
    { url: settings?.instagram_url, label: "Instagram", icon: Instagram },
    { url: settings?.vimeo_url, label: "Vimeo", icon: FilmIcon },
    { url: settings?.showreel_url, label: "Showreel", icon: PlayCircle },
  ].filter((s) => Boolean(s.url));

  return (
    <section id="contact" className="bg-primary py-24 md:py-40">
      <div className="max-w-container mx-auto px-6 md:px-10">
        <SectionLabel index="12" title="CONTACT" />

        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-12">
            LET'S WORK
            <br />
            TOGETHER.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-ink font-semibold text-lg">
                {settings?.name ?? "Ivar Delos Santos"}
              </p>
              <p className="text-muted">
                {settings?.professional_title ?? "Media Production Artist / Production Specialist"}
              </p>
              <p className="text-muted mt-2">
                {settings?.location ?? "Malolos, Bulacan, Philippines"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="text-xl font-semibold hover:text-accent transition-colors"
                >
                  {settings.email}
                </a>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="text-xl font-semibold hover:text-accent transition-colors"
                >
                  {settings.phone}
                </a>
              )}

              {socials.length > 0 && (
                <div className="flex gap-5 mt-4">
                  {socials.map(({ url, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={url ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-muted hover:text-accent transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
