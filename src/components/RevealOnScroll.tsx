import { motion } from "framer-motion";
import type { ReactNode, ElementType } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  amount?: number;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  amount = 0.2,
}: RevealOnScrollProps) {
  const MotionTag = motion(as as ElementType);
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
