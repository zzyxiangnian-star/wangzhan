import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const TEXT =
  'Co-extruded in Dow SILASTIC™ ET-7021 optical silicone. One seamless line of light — no dots, no shadows, IP67 to IP68, built to bend where architecture does.';

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start * 0.85, start * 0.85 + 0.12], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block pr-[0.24em]">
      {word}
    </motion.span>
  );
}

const SILK = [0.22, 1, 0.36, 1] as const;

export function Material() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const words = TEXT.split(' ');

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-5 py-[22vh] sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.95, ease: SILK }}
        className="micro mb-10"
      >
        01 — Material
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 1.05, ease: SILK, delay: 0.08 }}
        className="max-w-[22ch] font-display text-[clamp(36px,5.4vw,92px)] font-normal leading-[1.02] tracking-[-0.045em] text-ink"
      >
        {words.map((w, i) => (
          <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
        ))}
      </motion.p>
      <div className="mt-20 grid grid-cols-2 gap-y-12 sm:grid-cols-4">
        {[
          ['2012', 'Founded in Shenzhen'],
          ['11,000 m²', 'Two factories'],
          ['260', 'People on the line'],
          ['50+', 'Export countries'],
        ].map(([n, l], idx) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 1.0, ease: SILK, delay: idx * 0.1 }}
          >
            <div className="font-display text-[clamp(36px,4vw,64px)] font-light tracking-[-0.05em] text-ink">{n}</div>
            <div className="micro mt-2">{l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
