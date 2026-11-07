import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const ROW_A = ['01', '07', '16', '11', '20', '14'];
const ROW_B = ['13', '08', '09', '02', '17', '21'];
const src = (n: string) => `/assets/factory/lab_facility_${n}.webp`;

const STATS = [
  ['11,000 m²', 'Manufacturing floor'],
  ['260', 'Staff'],
  ['15', 'R&D engineers'],
  ['2', 'Factories in Bao’an'],
];

const SILK = [0.22, 1, 0.36, 1] as const;

export function Factory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xA = useTransform(scrollYProgress, [0, 1], ['4%', '-28%']);
  const xB = useTransform(scrollYProgress, [0, 1], ['-28%', '4%']);

  return (
    <section ref={ref} className="overflow-hidden py-[18vh]">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.95, ease: SILK }}
          className="micro mb-5"
        >
          05 — Factory
        </motion.div>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 1.05, ease: SILK, delay: 0.08 }}
            className="font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink lg:col-span-7"
          >
            Made end to end in Shenzhen.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 1.05, ease: SILK, delay: 0.16 }}
            className="max-w-[44ch] text-[15px] leading-relaxed text-graphite lg:col-span-5"
          >
            LED packaging, SMT, silicone co-extrusion and photometric testing happen under our own roof, so every reel
            ships with a datasheet and IES file you can trust.
          </motion.p>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {STATS.map(([n, l], idx) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 1.0, ease: SILK, delay: 0.12 + idx * 0.1 }}
            >
              <div className="font-display text-[clamp(36px,4vw,64px)] font-light tracking-[-0.05em] text-ink">{n}</div>
              <div className="micro mt-2">{l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-20 space-y-5">
        {[
          { row: ROW_A, x: xA },
          { row: ROW_B, x: xB },
        ].map(({ row, x }, r) => (
          <motion.div key={r} style={{ x }} className="flex w-max gap-5 pl-5">
            {[...row, ...row].map((n, i) => (
              <div key={i} className="h-[clamp(180px,24vw,340px)] aspect-[4/3] shrink-0 overflow-hidden rounded-card bg-stone">
                <img src={src(n)} alt="Tyria factory" loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.95, ease: SILK }}
        className="mx-auto mt-14 max-w-[1600px] px-5 sm:px-10"
      >
        <Link to="/about" className="pill-soft">
          Inside the factory
        </Link>
      </motion.div>
    </section>
  );
}
