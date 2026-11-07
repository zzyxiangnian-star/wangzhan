import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types/product';

const SILK = [0.22, 1, 0.36, 1] as const;

const FAMILIES = [
  { slug: 'neon-flex', name: 'LED Neon Flex', line: 'Silicone neon from 3 mm to 50 mm. Top, side, 360° and 3D bend.', img: '/assets/hero/nt1615.webp', dark: true },
  { slug: 'led-strip', name: 'LED Strip', line: 'COB, SMD, 48 V long runs, tunable white and addressable pixel.', img: '/assets/home/strip.webp', dark: true },
  { slug: 'wall-grazer', name: 'Wall Grazer', line: 'Flexible linear grazers that wash façades in white or full colour.', img: '/assets/home/grazer.webp', dark: true },
  { slug: 'led-sheet', name: 'Backlit LED Sheet', line: 'Bendable LED sheets for even, edge-to-edge backlighting.', img: '/assets/home/sheet.webp', dark: false },
];

export function Families({ products }: { products: Product[] }) {
  const count = (slug: string) => products.filter((p) => p.familySlug === slug).length;

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-[18vh] sm:px-10">
      <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.95, ease: SILK }}
            className="micro mb-5"
          >
            04 — Range
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 1.05, ease: SILK, delay: 0.08 }}
            className="max-w-[14ch] font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink"
          >
            Four families of linear light.
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.95, ease: SILK, delay: 0.16 }}
          className="self-start sm:self-auto"
        >
          <Link to="/products" className="pill-soft">
            All {products.length} models
          </Link>
        </motion.div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {FAMILIES.map((f, i) => (
          <motion.div
            key={f.slug}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.1, ease: SILK, delay: (i % 2) * 0.12 }}
            className={i % 2 === 1 ? 'md:translate-y-20' : ''}
          >
            <Link to={`/products/${f.slug}`} className="group block">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-card ${f.dark ? 'bg-ink' : 'bg-stone'}`}>
                <img
                  src={f.img}
                  alt={f.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.05]"
                />
                <span
                  className={`absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-all duration-500 ease-silk group-hover:scale-110 ${
                    f.dark ? 'bg-canvas/15 text-canvas group-hover:bg-canvas group-hover:text-ink' : 'bg-ink/10 text-ink group-hover:bg-ink group-hover:text-canvas'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6% 0px' }}
                transition={{ duration: 0.9, ease: SILK, delay: (i % 2) * 0.12 + 0.12 }}
                className="mt-5 flex items-start justify-between gap-6 px-1"
              >
                <div>
                  <div className="font-display text-[clamp(22px,2vw,30px)] tracking-[-0.03em] text-ink">{f.name}</div>
                  <p className="mt-1.5 max-w-[42ch] text-[14px] leading-relaxed text-graphite">{f.line}</p>
                </div>
                <div className="micro whitespace-nowrap pt-2">{count(f.slug)} models</div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
