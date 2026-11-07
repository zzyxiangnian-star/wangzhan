import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Product, PhotometricEntry } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { ProfileCrossSectionSVG } from '../components/products/ProfileCrossSectionSVG';
import { useInquiry } from '../context/InquiryContext';
import lightHeroes from '../data/light_heroes.json';

const LIGHT_HEROES = new Set<string>(lightHeroes as string[]);
const SILK = [0.22, 1, 0.36, 1] as const;
type Entry = 'Front' | 'Side' | 'Bottom' | 'Standard';

const Arrow = ({ down = false }: { down?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={down ? 'rotate-[135deg]' : ''}>
    <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Number that counts up the first time it scrolls into view. */
function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.6, ease: SILK, onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {shown.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

/** One plate in the sticky stacking gallery. Earlier plates sink back as later ones slide over them. */
function Plate({
  i,
  total,
  progress,
  children,
  tone,
  caption,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
  tone: 'dark' | 'light' | 'stone';
  caption: string;
}) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i - 1) * 0.04]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, i === total - 1 ? 0 : 0.35]);
  const bg = tone === 'dark' ? 'bg-ink' : tone === 'light' ? 'bg-white' : 'bg-stone/70';
  return (
    <div className="sticky" style={{ top: `calc(96px + ${i * 14}px)` }}>
      <motion.figure
        style={{ scale }}
        className={`relative aspect-[5/4] origin-top overflow-hidden rounded-card ${bg} shadow-[0_-20px_50px_-30px_rgba(17,17,17,0.35)]`}
      >
        {children}
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-ink" />
        <figcaption
          className={`absolute left-5 top-5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] backdrop-blur-md ${
            tone === 'dark' ? 'bg-canvas/15 text-canvas/85' : 'bg-ink/5 text-graphite'
          }`}
        >
          {caption}
        </figcaption>
      </motion.figure>
      <div className="h-6" />
    </div>
  );
}

function Option<T extends string>({
  label,
  values,
  value,
  onChange,
  id,
}: {
  label: string;
  values: T[];
  value: T;
  onChange: (v: T) => void;
  id: string;
}) {
  if (values.length === 0) return null;
  return (
    <div>
      <div className="micro mb-3">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`relative rounded-full px-3.5 py-2 text-[13px] transition-colors ${value === v ? '' : 'bg-stone/60'}`}
          >
            {value === v && (
              <motion.span
                layoutId={`opt-${id}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-ink"
              />
            )}
            <span
              className={`relative transition-colors duration-300 ${
                value === v ? 'text-canvas' : 'text-graphite hover:text-ink'
              }`}
            >
              {v}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function uniqueByUrl(list: PhotometricEntry[]) {
  const seen = new Set<string>();
  return list.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}

interface ProductDetailPageProps {
  products: Product[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useInquiry();
  const product = useMemo(() => products.find((p) => p.id === id) || products[0], [products, id]);

  const [cct, setCct] = useState(product.cctOptions[0] || '3000K');
  const [watt, setWatt] = useState(product.wattOptions[0] ? `${product.wattOptions[0]}W/m` : '');
  const [entry, setEntry] = useState<Entry>('Front');
  const [lengthM, setLengthM] = useState(50);
  const [added, setAdded] = useState(false);
  const [allFiles, setAllFiles] = useState(false);

  useEffect(() => {
    setCct(product.cctOptions[0] || '3000K');
    setWatt(product.wattOptions[0] ? `${product.wattOptions[0]}W/m` : '');
    setEntry('Front');
    setAdded(false);
  }, [product]);

  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: galleryRef, offset: ['start start', 'end end'] });

  const showPhoto = Boolean(product.images.hero) && !LIGHT_HEROES.has(product.id);
  const isProfile = product.view === 'Profile';
  const plates: { key: string; tone: 'dark' | 'light' | 'stone'; caption: string; node: React.ReactNode }[] = [
    showPhoto
      ? {
          key: 'hero',
          tone: 'dark',
          caption: 'Studio',
          node: <img src={product.images.hero} alt={product.model} className="h-full w-full object-cover" />,
        }
      : {
          key: 'hero',
          tone: 'stone',
          caption: 'Cross-section',
          node: (
            <div className="flex h-full items-center justify-center text-ink">
              <div className="scale-[1.6]">
                <ProfileCrossSectionSVG w={product.size.w} h={product.size.h} view={product.view} scale={4.2} showDimensions={false} />
              </div>
            </div>
          ),
        },
    ...(product.images.section
      ? [{ key: 'section', tone: 'light' as const, caption: isProfile ? 'Catalogue page' : 'Dimensions', node: <img src={product.images.section} alt={`${product.model} dimensions`} loading="lazy" className="h-full w-full object-contain p-6" /> }]
      : []),
    ...(product.images.curve
      ? [{ key: 'curve', tone: 'light' as const, caption: 'Light distribution', node: <img src={product.images.curve} alt={`${product.model} light distribution`} loading="lazy" className="h-full w-full object-contain p-6" /> }]
      : []),
    ...product.images.detail.slice(0, 2).map((src, k) => ({
      key: `d${k}`,
      tone: 'light' as const,
      caption: isProfile ? 'In situ' : k === 0 ? 'Installation' : 'Details',
      node: <img src={src} alt={`${product.model} detail ${k + 1}`} loading="lazy" className={`h-full w-full ${isProfile ? 'object-cover' : 'object-contain p-6'}`} />,
    })),
  ];

  const isLinear = product.view !== 'Sheet' && !isProfile;
  const keyNumbers = [
    product.maxLumen ? { v: product.maxLumen, s: '', l: isLinear ? 'Max lm / m' : 'Max lumen' } : null,
    product.efficacy ? { v: product.efficacy, s: '', l: 'lm / W' } : null,
    product.minBendDiameter ? { v: product.minBendDiameter, s: ' mm', l: 'Min. bend Ø' } : null,
    product.ledsPerM ? { v: product.ledsPerM, s: '', l: isLinear ? 'LEDs / m' : 'LEDs' } : null,
  ].filter(Boolean) as { v: number; s: string; l: string }[];

  const specRows: [string, string][] = [
    ['Part number', product.itemNo],
    ['Size', !product.size.w ? '' : product.view === '360' ? `Ø ${product.size.w} mm` : `${product.size.w} × ${product.size.h} mm`],
    ['Material', (product as Product & { material?: string }).material ?? ''],
    ['Light output', isProfile ? '' : product.view],
    ['CCT', isProfile ? product.cctOptions.join(' / ') : ''],
    ['Voltage', product.voltage],
    ['Power', product.wattOptions.length ? `${product.wattOptions.join(' / ')} W/m` : '—'],
    ['LED', `${product.ledType}${product.ledsPerM ? ` · ${product.ledsPerM}/m` : ''}`],
    ['Colour rendering', product.cri],
    ['Colour consistency', product.sdcm],
    ['Ingress rating', product.ip],
    ['Cut unit', product.cutUnit],
    ['Min. bend radius', isProfile && product.minBendRadius ? `${product.minBendRadius} mm` : ''],
    [isProfile ? 'Available length' : 'Max run', product.maxRun],
    ['Warranty', product.warranty],
  ].filter(([, v]) => v && v !== '—') as [string, string][];

  const ies = uniqueByUrl(product.downloads.ies);
  const ldt = uniqueByUrl(product.downloads.ldt);
  const reports = uniqueByUrl(product.downloads.report);
  const related = products.filter((p) => p.seriesSlug === product.seriesSlug && p.id !== product.id).concat(
    products.filter((p) => p.familySlug === product.familySlug && p.seriesSlug !== product.seriesSlug),
  ).slice(0, 8);

  const files = [
    ...(product.downloads.datasheet ? [{ k: 'PDF', t: 'Datasheet', s: product.itemNo, u: product.downloads.datasheet }] : []),
    ...ies.map((e) => ({ k: 'IES', t: `Photometry ${e.label || e.cct}`, s: `${e.watt} · ${e.filename}`, u: e.url })),
    ...ldt.map((e) => ({ k: 'LDT', t: `Eulumdat ${e.label || e.cct}`, s: `${e.watt} · ${e.filename}`, u: e.url })),
    ...reports.map((e) => ({ k: 'PDF', t: `Test report ${e.label || e.cct}`, s: e.filename, u: e.url })),
  ];

  const add = () => {
    addItem(product, { cct, wattage: watt || undefined, cableEntry: entry, lengthM, qty: 1 });
    setAdded(true);
  };

  return (
    <div className="min-h-screen pt-24">
      <SEOHead
        title={`${product.model} (${product.itemNo}) · ${product.series}`}
        description={product.pitch}
        canonicalPath={`/product/${product.id}`}
        product={product}
      />

      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-[13px] text-mute">
          <Link to="/products" className="rounded-full px-2 py-1 hover:bg-stone/60 hover:text-ink">Products</Link>
          <span>/</span>
          <Link to={`/products/${product.familySlug}`} className="rounded-full px-2 py-1 hover:bg-stone/60 hover:text-ink">{product.family}</Link>
          <span>/</span>
          <Link to={`/products/${product.familySlug}/${product.seriesSlug}`} className="rounded-full px-2 py-1 hover:bg-stone/60 hover:text-ink">{product.series}</Link>
        </nav>

        {/* 1. Sticky info + stacking gallery */}
        <div ref={galleryRef} className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: SILK }}>
                <div className="micro">{product.family}</div>
                <h1
                  className={`mt-4 break-words font-display font-light leading-[0.92] tracking-[-0.055em] text-ink ${
                    product.model.length > 18
                      ? 'text-[clamp(30px,2.9vw,50px)]'
                      : product.model.length > 10
                        ? 'text-[clamp(40px,4.4vw,76px)]'
                        : 'text-[clamp(52px,6.4vw,112px)]'
                  }`}
                >
                  {product.model}
                </h1>
                <div className="mt-3 font-mono text-[12px] tracking-[0.04em] text-mute">{product.itemNo}</div>
                <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-graphite">{product.pitch}</p>
              </motion.div>

              <div className="mt-8 space-y-6">
                <Option id="cct" label="Colour" values={product.cctOptions} value={cct} onChange={setCct} />
                <Option id="watt" label="Power" values={product.wattOptions.map((w) => `${w}W/m`)} value={watt} onChange={setWatt} />
                {isLinear && (
                  <Option<Entry> id="entry" label="Cable entry" values={['Front', 'Side', 'Bottom']} value={entry} onChange={setEntry} />
                )}
                <div>
                  <div className="mb-3 flex justify-between">
                    <span className="micro">Sample length</span>
                    <span className="text-[13px] tabular-nums text-ink">{lengthM} m</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={lengthM}
                    onChange={(e) => setLengthM(Number(e.target.value))}
                    className="w-full accent-[#111111]"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <button type="button" onClick={add} className="pill-ink h-12 px-7">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={added ? 'a' : 'b'}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {added ? 'Added to your list' : 'Request a sample'}
                    </motion.span>
                  </AnimatePresence>
                </button>
                {product.downloads.datasheet && (
                  <a href={product.downloads.datasheet} target="_blank" rel="noreferrer" className="pill-soft h-12 px-6">
                    Datasheet <Arrow down />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {plates.map((pl, i) => (
              <Plate key={pl.key} i={i} total={plates.length} progress={scrollYProgress} tone={pl.tone} caption={pl.caption}>
                {pl.node}
              </Plate>
            ))}
          </div>
        </div>

        {/* 2. Key numbers */}
        {keyNumbers.length > 0 && (
          <section className="mt-[14vh] grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {keyNumbers.map((k) => (
              <div key={k.l}>
                <div className="font-display text-[clamp(44px,5.4vw,96px)] font-light leading-none tracking-[-0.06em] text-ink">
                  <CountUp value={k.v} suffix={k.s} />
                </div>
                <div className="micro mt-3">{k.l}</div>
              </div>
            ))}
          </section>
        )}

        {/* 3. Section drawing + full specification */}
        <section className="mt-[14vh] grid gap-10 lg:grid-cols-12">
          {isProfile ? (
            <div className="overflow-hidden rounded-card bg-white lg:col-span-5">
              <img src={product.images.section} alt={`${product.model} catalogue page`} loading="lazy" className="w-full object-contain" />
            </div>
          ) : (
          <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-card bg-paper lg:col-span-5">
            <div
              aria-hidden
              className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,#000_35%,transparent_80%)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.06) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                backgroundPosition: 'center',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              whileInView={{ opacity: 1, scale: 1.5, rotate: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 1.2, ease: SILK }}
              className="relative text-ink"
            >
              <ProfileCrossSectionSVG w={product.size.w} h={product.size.h} view={product.view} scale={4.2} showDimensions />
            </motion.div>
            <span className="micro absolute bottom-5 left-5">Cross-section · to scale</span>
          </div>
          )}

          <div className="lg:col-span-7">
            <div className="micro mb-5">Specification</div>
            <dl className="grid gap-x-10 sm:grid-cols-2">
              {specRows.map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: SILK, delay: (i % 6) * 0.04 }}
                  className="flex items-baseline justify-between gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-stone/50"
                >
                  <dt className="text-[13px] text-mute">{k}</dt>
                  <dd className="text-right text-[14px] text-ink">{v}</dd>
                </motion.div>
              ))}
            </dl>
            {product.features.length > 0 && (
              <ul className="mt-10 space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[14px] leading-relaxed text-graphite">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-glow shadow-[0_0_8px_#FFC97A]" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 4. Downloads */}
        <section id="downloads" className="mt-[14vh]">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(32px,3.6vw,60px)] font-normal leading-none tracking-[-0.045em] text-ink">Files</h2>
            <span className="micro">{files.length} downloads</span>
          </div>
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {files.slice(0, allFiles ? files.length : 8).map((f) => (
              <a
                key={f.u + f.k}
                href={f.u}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-full bg-stone/50 py-2 pl-2 pr-5 transition-all duration-500 ease-silk hover:bg-ink hover:text-canvas"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper font-mono text-[10px] tracking-[0.06em] text-ink">
                  {f.k}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px]">{f.t}</span>
                  <span className="block truncate font-mono text-[10.5px] text-mute group-hover:text-canvas/60">{f.s}</span>
                </span>
                <span className="transition-transform duration-500 ease-silk group-hover:translate-y-0.5">
                  <Arrow down />
                </span>
              </a>
            ))}
          </div>
          {files.length > 8 && (
            <button type="button" onClick={() => setAllFiles((v) => !v)} className="pill-soft mt-6">
              {allFiles ? 'Show fewer' : `Show all ${files.length} files`}
            </button>
          )}
        </section>

        {/* 5. Related: a horizontal drag rail */}
        {related.length > 0 && (
          <section className="mt-[14vh] pb-[6vh]">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-[clamp(32px,3.6vw,60px)] font-normal leading-none tracking-[-0.045em] text-ink">Also in this range</h2>
              <Link to={`/products/${product.familySlug}`} className="pill-soft hidden sm:inline-flex">View all</Link>
            </div>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-[10vh] sm:px-10" data-lenis-prevent>
          {related.map((r) => {
            const photo = Boolean(r.images.hero) && !LIGHT_HEROES.has(r.id);
            return (
              <Link key={r.id} to={`/product/${r.id}`} className="group w-[240px] shrink-0 snap-start sm:w-[280px]">
                <div className={`relative aspect-[4/5] overflow-hidden rounded-card ${photo ? 'bg-ink' : 'bg-stone/70'}`}>
                  {photo || r.view === 'Profile' ? (
                    <img src={r.images.hero} alt={r.model} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.06]" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink">
                      <ProfileCrossSectionSVG w={r.size.w} h={r.size.h} view={r.view} scale={3.6} showDimensions={false} />
                    </div>
                  )}
                </div>
                <div className="mt-3 px-1 font-display text-[18px] tracking-[-0.03em] text-ink">{r.model}</div>
                <div className="micro mt-0.5 px-1">{r.series}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
