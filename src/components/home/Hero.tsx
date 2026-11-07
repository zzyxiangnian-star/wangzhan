import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { HERO_PRODUCTS, type HeroProduct } from '../../data/heroProducts';

const N = HERO_PRODUCTS.length;
const SILK = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: 'spring' as const, stiffness: 90, damping: 20, mass: 1 };

/** Wrap a card's distance from the active slot into [-N/2, N/2). */
function wrap(d: number) {
  return ((((d + N / 2) % N) + N) % N) - N / 2;
}

function useCardWidth() {
  const [w, setW] = useState(300);
  useEffect(() => {
    const fit = () => setW(Math.round(Math.min(250, Math.max(150, window.innerWidth * 0.155))));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return w;
}

function Card({ p, i, pos, cardW, onSelect }: { p: HeroProduct; i: number; pos: MotionValue<number>; cardW: number; onSelect: (i: number) => void }) {
  const step = 0.27; // radians between neighbours on the arc
  const R = cardW * 4.6; // arc radius: a wide, shallow curve
  const d = useTransform(pos, (v) => wrap(i - v));
  const transform = useTransform(d, (dv) => {
    const a = dv * step;
    const x = Math.sin(a) * R;
    const z = (Math.cos(a) - 1) * R;
    const y = (1 - Math.cos(a)) * -R * 0.55; // edges rise: a gentle smile
    const lift = Math.max(0, 1 - Math.abs(dv));
    const s = 1 + lift * 0.22;
    return `translate3d(${x}px, ${y - lift * 18}px, ${z}px) rotateY(${a}rad) scale(${s})`;
  });
  const opacity = useTransform(d, (dv) => Math.max(0, 1 - Math.max(0, Math.abs(dv) - 2.9) * 1.3));
  const brightness = useTransform(d, (dv) => `brightness(${1 - Math.min(Math.abs(dv), 4) * 0.1})`);
  const zIndex = useTransform(d, (dv) => 100 - Math.round(Math.abs(dv) * 10));

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(i)}
      aria-label={`Show ${p.name}`}
      className="absolute left-1/2 top-1/2 block cursor-grab active:cursor-grabbing"
      style={{
        width: cardW,
        height: cardW * 1.25,
        marginLeft: -cardW / 2,
        marginTop: -cardW * 0.625,
        transform,
        opacity,
        zIndex,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      <motion.div
        className="h-full w-full overflow-hidden rounded-[26px] bg-ink shadow-[0_30px_60px_-28px_rgba(17,17,17,0.5)]"
        style={{ filter: brightness }}
      >
        <img
          src={p.img}
          alt={`${p.name} silicone LED neon`}
          draggable={false}
          className="h-full w-full select-none object-cover"
        />
      </motion.div>
    </motion.button>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const cardW = useCardWidth();
  const pos = useMotionValue(0);
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; start: number; t: number; v: number } | null>(null);

  useMotionValueEvent(pos, 'change', (v) => {
    const a = ((Math.round(v) % N) + N) % N;
    setActive((prev) => (prev === a ? prev : a));
  });

  const goTo = (target: number) => animate(pos, target, SPRING);
  const step = (dir: 1 | -1) => goTo(Math.round(pos.get()) + dir);
  const select = (i: number) => {
    const cur = pos.get();
    goTo(cur + wrap(i - cur));
  };

  // Gentle idle drift until the visitor interacts.
  const touched = useRef(false);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!touched.current && !document.hidden) step(1);
    }, 3800);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    touched.current = true;
    pos.stop();
    drag.current = { x: e.clientX, start: pos.get(), t: performance.now(), v: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const g = drag.current;
    if (!g) return;
    const now = performance.now();
    const next = g.start - (e.clientX - g.x) / (cardW * 0.9);
    g.v = (next - pos.get()) / Math.max(1, now - g.t);
    g.t = now;
    pos.set(next);
  };
  const onPointerUp = () => {
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    goTo(Math.round(pos.get() + g.v * 220)); // inertia, then settle on a card
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { touched.current = true; step(1); }
      if (e.key === 'ArrowLeft') { touched.current = true; step(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll: the wordmark lifts away, the ring leans back and opens up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const markY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const markOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const ringTilt = useTransform(scrollYProgress, [0, 1], [-4, 16]);
  const ringOpacity = useTransform(scrollYProgress, [0.4, 0.95], [1, 0]);

  const p = HERO_PRODUCTS[active];
  const letters = 'TYRIA'.split('');

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden">
      {/* Giant wordmark — Editorial High-Contrast Serif (Bodoni Moda) with Italic R */}
      <motion.h1
        style={{ y: markY, opacity: markOpacity }}
        className="font-editorial absolute inset-x-0 top-[15%] z-0 sm:top-[11%] flex items-baseline justify-center overflow-hidden py-[0.05em] font-normal leading-[0.9] text-ink select-none"
        aria-label="Tyria Lighting"
      >
        <motion.span
          initial={{ opacity: 0, letterSpacing: '-0.068em', filter: 'blur(6px)' }}
          animate={{ opacity: 1, letterSpacing: '-0.015em', filter: 'blur(0px)' }}
          transition={{
            opacity: { duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
            letterSpacing: { duration: 2.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
            filter: { duration: 2.0, ease: SILK, delay: 0.08 },
          }}
          className="inline-flex items-baseline justify-center"
        >
          {letters.map((l, i) => {
            const centerOffset = i - (letters.length - 1) / 2;
            const kerning =
              l === 'T'
                ? 'mr-[-0.025em]'
                : l === 'Y'
                  ? 'mr-[-0.018em]'
                  : l === 'R'
                    ? 'italic font-normal ml-[-0.012em] pr-[0.044em]'
                    : l === 'I'
                      ? 'mr-[-0.01em]'
                      : '';
            return (
              <motion.span
                key={i}
                initial={{
                  opacity: 0,
                  y: '18%',
                  x: `${centerOffset * -0.042}em`,
                }}
                animate={{
                  opacity: 1,
                  y: '0%',
                  x: '0em',
                }}
                transition={{
                  opacity: { duration: 1.95, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 },
                  y: { duration: 2.25, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 },
                  x: { duration: 2.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
                }}
                className={`inline-block text-[clamp(110px,24.5vw,470px)] will-change-transform ${kerning}`}
                aria-hidden
              >
                {l}
              </motion.span>
            );
          })}
        </motion.span>
      </motion.h1>

      {/* 3D arc carousel */}
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease: SILK, delay: 0.55 }}
        className="absolute inset-x-0 bottom-[20%] top-[24%] z-10 sm:bottom-[17%] sm:top-[40%]"
      >
        <motion.div
          style={{ scale: ringScale, opacity: ringOpacity, perspective: 1800 }}
          className="relative h-full w-full touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d', rotateX: ringTilt }}
          >
            {HERO_PRODUCTS.map((prod, i) => (
              <Card key={prod.code} p={prod} i={i} pos={pos} cardW={cardW} onSelect={(k) => { touched.current = true; select(k); }} />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Active product caption */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute inset-x-0 bottom-[7%] z-20 flex items-center justify-center gap-6 px-5"
      >
        <button type="button" onClick={() => { touched.current = true; step(-1); }} className="grid h-11 w-11 place-items-center rounded-full bg-stone/70 text-ink transition-all duration-500 ease-silk hover:scale-105 hover:bg-stone" aria-label="Previous product">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="relative h-[58px] w-[min(420px,60vw)] text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={p.code}
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.7, ease: SILK }}
              className="absolute inset-0"
            >
              <Link to={`/product/${p.id}`} className="block font-display text-[clamp(20px,2vw,28px)] font-normal tracking-[-0.03em] hover:opacity-60 transition-opacity">{p.name}</Link>
              <div className="micro mt-1.5">
                {p.size} · {p.ip}<span className="hidden sm:inline"> · {p.code}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <button type="button" onClick={() => { touched.current = true; step(1); }} className="grid h-11 w-11 place-items-center rounded-full bg-stone/70 text-ink transition-all duration-500 ease-silk hover:scale-105 hover:bg-stone" aria-label="Next product">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </motion.div>

      {/* Progress dots */}
      <div className="absolute bottom-[3.2%] left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {HERO_PRODUCTS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { touched.current = true; select(i); }}
            aria-label={`Product ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-700 ease-silk ${i === active ? 'w-6 bg-ink' : 'w-1.5 bg-ink/20 hover:bg-ink/40'}`}
          />
        ))}
      </div>
    </section>
  );
}
