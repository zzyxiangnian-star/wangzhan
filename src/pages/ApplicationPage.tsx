import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Product } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';

const SILK = [0.22, 1, 0.36, 1] as const;

/**
 * Application scenes. Images live in /public/assets/applications/<slug>.webp;
 * replace those files with project or rendered photos and the page picks them up.
 */
const SCENES = [
  {
    slug: 'facade',
    k: 'Building facade',
    title: 'Media facades that move.',
    body: 'Addressable pixel neon and wall grazers turn a whole elevation into a canvas, controlled pixel by pixel over DMX512 or SPI.',
    series: [
      { label: 'Pixel Neon', to: '/products/neon-flex/pixel-neon' },
      { label: 'Wall Grazer', to: '/products/wall-grazer' },
    ],
  },
  {
    slug: 'outline',
    k: 'Architectural outline',
    title: 'Draw the building with a single line.',
    body: 'Top-view and 3D-bend silicone neon follow rooflines, arches and edges with a continuous, dot-free line of light.',
    series: [
      { label: 'Top View Neon', to: '/products/neon-flex/top-view' },
      { label: '3D Bend Neon', to: '/products/neon-flex/3d-bend' },
    ],
  },
  {
    slug: 'signage',
    k: 'LED neon signage',
    title: 'Neon signs without the glass.',
    body: 'Thin side-view and 360° emitting neon bend into letters and logos for retail, hospitality and brand spaces.',
    series: [
      { label: 'Side View Neon', to: '/products/neon-flex/side-view' },
      { label: '360° Emitting', to: '/products/neon-flex/360-emitting' },
    ],
  },
  {
    slug: 'interior',
    k: 'Interior linear lighting',
    title: 'Cove, shelf and ceiling light.',
    body: 'High-efficiency and COB strip in aluminium profiles give even, glare-free light in coves, shelves and ceilings.',
    series: [
      { label: 'LED Strip', to: '/products/led-strip' },
      { label: 'Aluminum Profile', to: '/products/aluminum-profile' },
    ],
  },
  {
    slug: 'landscape',
    k: 'Landscape & outdoor',
    title: 'Built for rain, salt and sun.',
    body: 'IP67 and IP68 silicone neon with UV- and salt-resistant Dow SILASTIC™ silicone for bridges, pools and gardens.',
    series: [
      { label: 'IP68 Neon', to: '/products/neon-flex/ip68-silicone' },
      { label: 'Anti-Glare Neon', to: '/products/neon-flex/anti-glare' },
    ],
  },
];

/** Each scene opens from a framed card to a full-bleed image as it reaches the centre of the screen. */
function Scene({ s, i }: { s: (typeof SCENES)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const inset = useTransform(scrollYProgress, [0, 0.4, 0.75, 1], [14, 0, 0, 6]);
  const radius = useTransform(scrollYProgress, [0, 0.4, 0.75, 1], [40, 0, 0, 40]);
  const clip = useTransform([inset, radius], ([v, r]: number[]) => `inset(${v}% ${v * 0.6}% ${v}% ${v * 0.6}% round ${r}px)`);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const textY = useTransform(scrollYProgress, [0.15, 0.5], [60, 0]);
  const textO = useTransform(scrollYProgress, [0.15, 0.45, 0.8, 0.95], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative h-[140vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-ink">
          <motion.img
            src={`/assets/applications/${s.slug}.webp`}
            alt={s.k}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{ y: imgY }}
            className="absolute inset-0 h-[116%] w-full -translate-y-[8%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/10" />
        </motion.div>
        <motion.div style={{ y: textY, opacity: textO }} className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-[10vh] text-canvas sm:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-canvas/60">
            {String(i + 1).padStart(2, '0')} · {s.k}
          </div>
          <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(40px,6.4vw,112px)] font-light leading-[0.92] tracking-[-0.055em]">{s.title}</h2>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[48ch] text-[16px] leading-relaxed text-canvas/75">{s.body}</p>
            <div className="flex flex-wrap gap-2">
              {s.series.map((x) => (
                <Link key={x.to} to={x.to} className="pill h-11 bg-canvas/15 px-5 text-canvas backdrop-blur-md hover:bg-canvas hover:text-ink">
                  {x.label} →
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export const ApplicationPage: React.FC<{ products: Product[] }> = () => {
  return (
    <div className="pt-32">
      <SEOHead
        title="Application · Facade, Neon Signage & Linear Lighting"
        description="Where Tyria LED neon flex, pixel neon, LED strip and wall grazers are used: building facades, architectural outlines, neon signage, interior linear lighting and landscape."
        canonicalPath="/application"
      />
      <section className="mx-auto max-w-[1600px] px-5 pb-[8vh] sm:px-10">
        <div className="micro mb-6">Application</div>
        <h1 className="max-w-[13ch] font-display text-[clamp(52px,9vw,160px)] font-light leading-[0.9] tracking-[-0.065em] text-ink">
          {['Light', 'for', 'the', 'places', 'people', 'look', 'at.'].map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                initial={{ y: '110%', rotate: 6 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 1.1, ease: SILK, delay: 0.1 + i * 0.06 }}
                className="inline-block origin-bottom-left pr-[0.22em]"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="mt-10 flex flex-wrap gap-2">
          {SCENES.map((s, i) => (
            <span key={s.slug} className="rounded-full bg-stone/60 px-4 py-2 text-[13px] text-graphite">
              {String(i + 1).padStart(2, '0')} {s.k}
            </span>
          ))}
        </div>
      </section>
      {SCENES.map((s, i) => (
        <Scene key={s.slug} s={s} i={i} />
      ))}
      <section className="mx-auto max-w-[1600px] px-5 py-[14vh] text-center sm:px-10">
        <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink">
          Planning a project? Send us the drawings.
        </h2>
        <div className="mt-10 flex justify-center gap-2">
          <Link to="/contact" className="pill-ink h-12 px-7">Contact us</Link>
          <Link to="/resources/ies" className="pill-soft h-12 px-6">IES files</Link>
        </div>
      </section>
    </div>
  );
};
