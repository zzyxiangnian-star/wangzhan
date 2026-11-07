import { motion } from 'framer-motion';

const SILK = [0.22, 1, 0.36, 1] as const;
const CERTS = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'UL', 'ETL', 'TÜV CE', 'UKCA', 'RoHS'];

export function Certified() {
  const row = [...CERTS, ...CERTS];
  return (
    <section className="py-[12vh]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.95, ease: SILK }}
        className="mx-auto mb-10 max-w-[1600px] px-5 sm:px-10"
      >
        <div className="micro">06 — Certified</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 1.05, ease: SILK, delay: 0.08 }}
        className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-4">
          {row.map((c, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full bg-paper px-8 py-5 font-display text-[clamp(28px,3.4vw,56px)] font-light tracking-[-0.04em] text-ink shadow-[0_20px_40px_-30px_rgba(17,17,17,0.35)]"
            >
              {c}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 1.0, ease: SILK, delay: 0.16 }}
        className="mx-auto mt-10 max-w-[1600px] px-5 text-[14px] text-graphite sm:px-10"
      >
        Quality, environmental and safety management certified. Product listings for North America, Europe and the UK.
      </motion.p>
    </section>
  );
}
