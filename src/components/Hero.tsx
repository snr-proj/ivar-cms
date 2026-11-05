import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/usePortfolioData";

const capabilities = [
  "COMMERCIAL PRODUCTION",
  "DIGITAL OOH",
  "CINEMATOGRAPHY",
  "PHOTOGRAPHY",
];

export default function Hero() {
  const { data: settings } = useSiteSettings();

  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-primary">
      <motion.img
        src="/images/hero-media.jpg"
        alt="Ivar Delos Santos on a video production shoot, operating a camera on a tripod"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.55 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />

      <div className="relative z-10 container-x flex min-h-[100svh] flex-col justify-between pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div />

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-extrabold text-hero leading-[0.95] tracking-tight"
          >
            IVAR
            <br />
            DELOS SANTOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-5 max-w-xl text-base font-light text-muted sm:mt-6 sm:text-lg md:text-2xl"
          >
            {settings?.professional_title ?? "Media Production Artist / Production Specialist"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            {capabilities.map((c, i) => (
              <span key={c} className="flex items-center gap-3">
                <span className="label">{c}</span>
                {i < capabilities.length - 1 && (
                  <span className="text-accent text-xs">•</span>
                )}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="label flex items-center gap-2 self-start transition-colors hover:text-accent"
        >
          SCROLL TO EXPLORE
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}