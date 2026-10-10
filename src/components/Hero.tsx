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

      <div className="relative z-10 max-w-container mx-auto h-screen flex flex-col justify-between px-6 md:px-10 pt-28 pb-12">
        <div />

        <div className="max-w-5xl">
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
            className="mt-6 text-lg md:text-2xl text-muted font-light max-w-xl"
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
          className="label self-start md:self-end flex items-center gap-2 hover:text-accent transition-colors"
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
