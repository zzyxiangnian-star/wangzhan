import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Product } from '../../types/product';
import { ProfileCrossSectionSVG } from '../products/ProfileCrossSectionSVG';

const SILK = [0.22, 1, 0.36, 1] as const;

// A size-ordered tour of the neon range. Every specimen is drawn at the same scale,
// so the object on stage physically grows as the visitor scrolls.
const PICK = [
  'neon-flex-0306-sv-ty-ns0306v24p6',
  'neon-flex-0606-tv-ty-nt0606v24px',
  'neon-flex-0612-sv-ty-ns0612v24px',
  'neon-flex-3d-1010-ty-n3d1010v24p',
  'neon-flex-360-r13-ty-nr13v24px-c',
  'neon-flex-1220-sv-ty-ns1220v24px',
  'neon-flex-1615-tv-ty-nt1615v24px',
  'neon-flex-d16-tv-ty-ntd16v24px',
  'neon-flex-1617-tv-anti-glare-ugr-19-anti-glare-ty',
  'neon-flex-t1615-ty-nt1615ev24p',
  'neon-flex-1225-sv-ty-ns1225v24px',
  'neon-flex-2020-tv-ty-nt2020v24px',
  'neon-flex-360-r25-ty-nr25v24px-c',
  'neon-flex-3032-sv-ty-ns3032v24px',
  'neon-flex-360-r40-ty-nr40v24px-c',
  'neon-flex-5025-tv-ty-nt5025v24px',
];

const VIEW_NAME: Record<string, string> = {
  TV: 'Top view',
  SV: 'Side view',
  '360': '360° round',
  '3D': '3D dual bend',
  Dome: 'Dome',
  'Anti-Glare': 'Anti-glare UGR<19',
  Embedded: 'Recessed',
};

const SCALE = 3.4; // px per mm inside the SVG
const dims = (p: Product) => (p.view === '360' ? `Ø ${p.size.w} mm` : `${p.size.w} × ${p.size.h} mm`);

export function Profiles({ products }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const items = useMemo(
    () => PICK.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)),
    [products],
  );
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0.04, 0.96], [0, items.length - 1]);
  useMotionValueEvent(raw, 'change', (v) => {
    const i = Math.max(0, Math.min(items.length - 1, Math.round(v)));
    setActive((prev) => (prev === i ? prev : i));
  });

  // The lineup ruler slides so the active specimen sits under the stage.
  const smooth = useSpring(raw, { stiffness: 140, damping: 28 });
  const lineupX = useTransform(smooth, (v) => `calc(-${v} * (var(--slot) + 24px) - var(--slot) / 2)`);
  const p = items[active];

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop;
    const travel = el.offsetHeight - window.innerHeight;
    const t = 0.04 + (i / (items.length - 1)) * 0.92;
    window.scrollTo({ top: top + travel * t + 1, behavior: 'smooth' });
  };

  if (!p) return null;

  return (
    <section ref={ref} id="profiles" className="relative" style={{ height: `${items.length * 32 + 80}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Millimetre grid: the drawing board the specimens sit on */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_50%,#000_30%,transparent_75%)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(17,17,17,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.07) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            backgroundPosition: 'center center',
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-center gap-6 px-5 pt-24 sm:px-10 lg:grid-cols-12">
          {/* Left: the spec readout */}
          <div className="order-2 lg:order-1 lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.95, ease: SILK }}
              className="micro mb-5"
            >
              02 — Profiles
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 1.05, ease: SILK, delay: 0.08 }}
              className="mb-10 max-w-[12ch] font-display text-[clamp(30px,3.4vw,56px)] font-normal leading-[1] tracking-[-0.045em] text-ink"
            >
              Every profile, drawn to scale.
            </motion.h2>
            <div className="relative h-[150px] sm:h-[170px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.55, ease: SILK }}
                  className="absolute inset-0"
                >
                  <div className="font-display text-[clamp(44px,5vw,84px)] font-light leading-none tracking-[-0.055em] text-ink">
                    {p.model}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[dims(p), VIEW_NAME[p.view] ?? p.view, p.ip].map((t) => (
                      <span key={t} className="rounded-full bg-stone/80 px-3.5 py-1.5 text-[13px] text-graphite">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/product/${p.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-[14px] text-ink underline-offset-4 hover:underline"
                  >
                    View datasheet
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Centre: the specimen, true scale, morphing from one profile to the next */}
          <div className="relative order-1 flex h-[38vh] items-center justify-center lg:order-2 lg:col-span-5 lg:h-[56vh]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.86, filter: 'blur(14px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(14px)' }}
                transition={{ duration: 0.7, ease: SILK }}
                className="absolute flex items-center justify-center text-ink"
              >
                <div className="scale-[1.4] sm:scale-[2.1]">
                  <ProfileCrossSectionSVG w={p.size.w} h={p.size.h} view={p.view} scale={SCALE} showDimensions={false} />
                </div>
              </motion.div>
            </AnimatePresence>
            {/* 10 mm scale bar, same scale as the drawing */}
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
              <div className="h-[3px] rounded-full bg-ink/70" style={{ width: `calc(${10 * SCALE}px * var(--spec-zoom))` }} />
              <span className="micro">10 mm</span>
            </div>
          </div>

          {/* Right: big counter */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 1.05, ease: SILK, delay: 0.16 }}
            className="order-3 hidden lg:col-span-3 lg:block lg:text-right"
          >
            <div className="font-display text-[clamp(64px,7vw,128px)] font-light leading-none tabular-nums tracking-[-0.06em] text-ink">
              {String(active + 1).padStart(2, '0')}
            </div>
            <div className="micro mt-3">of {items.length} · 3 mm to 50 mm</div>
          </motion.div>
        </div>

        {/* Bottom: the whole range lined up on one baseline, at true relative size */}
        <div className="relative mb-8 mt-4 h-[84px] w-full">
          <motion.div
            className="absolute bottom-6 left-1/2 flex items-end gap-6"
            style={{ x: lineupX }}
          >
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => jump(i)}
                aria-label={`Show ${it.model}`}
                className={`flex w-[var(--slot)] shrink-0 items-end justify-center transition-all duration-700 ease-silk ${
                  i === active ? 'opacity-100' : 'opacity-30 hover:opacity-70'
                }`}
              >
                <span
                  className={`block rounded-[3px] transition-colors duration-700 ease-silk ${
                    it.view === '360' || it.view === 'Dome' ? 'rounded-t-full' : ''
                  } ${i === active ? 'bg-ink' : 'bg-ink/60'}`}
                  style={{ width: it.size.w * 1.15, height: Math.max(4, (it.view === '360' ? it.size.w : it.size.h) * 1.15) }}
                />
              </button>
            ))}
          </motion.div>
          <div className="absolute bottom-[22px] left-0 right-0 h-px bg-ink/10" />
          <div className="micro absolute bottom-0 left-1/2 hidden -translate-x-1/2 whitespace-nowrap sm:block">Lineup at true relative size</div>
        </div>
      </div>
      <style>{`#profiles{--slot:62px;--spec-zoom:1.4}@media (min-width:640px){#profiles{--spec-zoom:2.1}}`}</style>
    </section>
  );
}
