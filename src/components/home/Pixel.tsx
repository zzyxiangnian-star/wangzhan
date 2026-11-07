import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const SILK = [0.22, 1, 0.36, 1] as const;

export function Pixel() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // The photo grows from a rounded tile into a full-bleed stage.
  const inset = useTransform(scrollYProgress, [0, 0.45], [18, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [40, 0]);
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.26, 0.44], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.26, 0.46], [42, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.32, 0.48], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.32, 0.50], [36, 0]);

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath }} className="absolute inset-0 bg-ink">
          <motion.img
            src="/assets/home/pixel.webp"
            alt="Tyria pixel neon running a colour chase"
            style={{ scale: imgScale }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] flex-col gap-8 px-5 pb-14 text-canvas sm:flex-row sm:items-end sm:justify-between sm:px-10">
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            transition={{ duration: 0.9, ease: SILK }}
          >
            <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-canvas/60">03 — Pixel</div>
            <h2 className="max-w-[16ch] font-display text-[clamp(40px,6vw,104px)] font-light leading-[0.98] tracking-[-0.05em]">
              Every segment, its own colour.
            </h2>
          </motion.div>
          <motion.div
            style={{ opacity: descOpacity, y: descY }}
            transition={{ duration: 0.95, ease: SILK }}
            className="max-w-[34ch] space-y-5"
          >
            <p className="text-[15px] leading-relaxed text-canvas/75">
              Addressable neon and strip, driven by DMX512 or SPI. The same silicone body, the same bend, now in motion.
            </p>
            <Link to="/products/neon-flex/pixel-neon" className="pill bg-canvas text-ink hover:scale-[1.03]">
              Explore pixel neon
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
