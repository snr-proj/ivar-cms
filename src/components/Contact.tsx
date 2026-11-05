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
    <section id="contact" className="bg-primary py-16 sm:py-24 lg:py-36">
      <div className="container-x">
        <SectionLabel index="12" title="CONTACT" />

        <RevealOnScroll>
          <h2 className="font-sans font-extrabold text-section leading-[0.95] mb-8 sm:mb-12">
            LET'S WORK
            <br />
            TOGETHER.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="grid gap-8 md:grid-cols-12 md:gap-12 lg:gap-16">
            <div className="md:col-span-5">
              <p className="text-lg font-semibold text-ink">
                {settings?.name ?? "Ivar Delos Santos"}
              </p>
              <p className="text-muted">
                {settings?.professional_title ?? "Media Production Artist / Production Specialist"}
              </p>
              <p className="text-muted mt-2">
                {settings?.location ?? "Malolos, Bulacan, Philippines"}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 md:col-span-7">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="break-words text-base font-semibold transition-colors hover:text-accent sm:text-xl"
                >
                  {settings.email}
                </a>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="break-words text-base font-semibold transition-colors hover:text-accent sm:text-xl"
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