import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Product, CatalogItem, PhotometricEntry } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';

const SILK = [0.22, 1, 0.36, 1] as const;

const FAMILIES = [
  { slug: 'all', label: 'All' },
  { slug: 'neon-flex', label: 'Neon Flex' },
  { slug: 'led-strip', label: 'LED Strip' },
  { slug: 'wall-grazer', label: 'Wall Grazer' },
  { slug: 'led-sheet', label: 'LED Sheet' },
];

// Each catalogue cover gets its own light: a soft coloured glow on ink.
const COVER_GLOW = ['#FFC97A', '#F5F4F0', '#FF6FB5', '#9AD7FF', '#FFE3A3', '#8CFFB8'];

const Down = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1.5v8M2.5 6.5L6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A catalogue cover that tilts towards the cursor like a real book in the hand. */
function Cover({ c, i }: { c: CatalogItem; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const glow = COVER_GLOW[i % COVER_GLOW.length];

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: SILK, delay: (i % 3) * 0.08 }}
      style={{ perspective: 1000 }}
    >
      <motion.a
        ref={ref}
        href={c.url}
        target="_blank"
        rel="noreferrer"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative block aspect-[3/4] overflow-hidden rounded-card bg-ink p-7 text-canvas shadow-[0_40px_70px_-40px_rgba(17,17,17,0.7)]"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[60px] transition-opacity duration-700 group-hover:opacity-70"
          style={{ left: glowX, top: glowY, background: glow }}
        />
        {/* A single line of neon across the cover */}
        <div
          aria-hidden
          className="absolute left-7 right-7 top-[46%] h-[3px] rounded-full"
          style={{ background: glow, boxShadow: `0 0 12px ${glow}, 0 0 32px ${glow}` }}
        />
        <div className="relative flex h-full flex-col justify-between" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-canvas/60">{c.category}</span>
            <span className="font-mono text-[10.5px] text-canvas/60">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <div>
            <div className="font-display text-[clamp(22px,1.9vw,30px)] font-light leading-[1.05] tracking-[-0.035em]">
              {c.title.replace(/\s*\(.*?\)\s*/g, ' ').replace('Master Catalogue', '').trim()}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-canvas/60">{c.pages} pages · PDF</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-canvas/15 transition-all duration-500 ease-silk group-hover:bg-canvas group-hover:text-ink">
                <Down />
              </span>
            </div>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

function unique(list: PhotometricEntry[]) {
  const seen = new Set<string>();
  return list.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}

function FileRow({ p, open, onToggle, mode }: { p: Product; open: boolean; onToggle: () => void; mode: 'datasheets' | 'ies' }) {
  const ies = unique(p.downloads.ies);
  const ldt = unique(p.downloads.ldt);
  const reports = unique(p.downloads.report);
  const extra = ies.length + ldt.length + reports.length;

  return (
    <motion.li layout transition={{ duration: 0.5, ease: SILK }} className={`rounded-[26px] transition-colors duration-500 ${open ? 'bg-paper shadow-[0_24px_50px_-36px_rgba(17,17,17,0.45)]' : 'hover:bg-stone/40'}`}>
      <div className="flex items-center gap-4 px-4 py-3 sm:px-5">
        <div className="min-w-0 flex-1">
          <Link to={`/product/${p.id}`} className="block truncate font-display text-[18px] tracking-[-0.025em] text-ink hover:opacity-60">
            {p.model}
          </Link>
          <div className="truncate font-mono text-[10.5px] tracking-[0.04em] text-mute">{p.itemNo}</div>
        </div>
        <span className="micro hidden w-[160px] truncate md:block">{p.series}</span>
        {mode === 'datasheets' && p.downloads.datasheet && (
          <a href={p.downloads.datasheet} target="_blank" rel="noreferrer" className="pill h-9 bg-stone/70 px-4 text-[13px] text-ink hover:bg-ink hover:text-canvas">
            Datasheet <Down />
          </a>
        )}
        {mode === 'ies' && <button
          type="button"
          onClick={onToggle}
          disabled={extra === 0}
          className={`pill h-9 px-4 text-[13px] ${extra === 0 ? 'cursor-default bg-transparent text-mute' : open ? 'bg-ink text-canvas' : 'bg-stone/70 text-ink hover:bg-stone'}`}
        >
          {extra === 0 ? 'No IES' : `${extra} files`}
          {extra > 0 && (
            <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: SILK }} className="inline-block">
              +
            </motion.span>
          )}
        </button>}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: SILK }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 px-4 pb-5 sm:px-5">
              {[
                ...ies.map((e) => ({ k: 'IES', e })),
                ...ldt.map((e) => ({ k: 'LDT', e })),
                ...reports.map((e) => ({ k: 'Report', e })),
              ].map(({ k, e }, n) => (
                <motion.a
                  key={k + e.url}
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: SILK, delay: Math.min(n, 12) * 0.025 }}
                  className="inline-flex items-center gap-2 rounded-full bg-stone/60 py-1.5 pl-1.5 pr-3.5 text-[12.5px] text-ink transition-colors hover:bg-ink hover:text-canvas"
                  title={e.filename}
                >
                  <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[9.5px] tracking-[0.06em] text-ink">{k}</span>
                  {e.label || e.cct} · {e.watt}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

const TABS = [
  {
    slug: 'datasheets',
    label: 'Datasheets & Manuals',
    title: 'Datasheets & manuals.',
    lead: 'One PDF per model with dimensions, photometry, wiring and installation notes.',
  },
  {
    slug: 'ies',
    label: 'IES File & Test Report',
    title: 'IES files & test reports.',
    lead: 'IES and LDT photometry for lighting simulation, plus the test report behind each file.',
  },
  {
    slug: 'catalogs',
    label: 'Catalogs',
    title: 'Catalogs.',
    lead: 'Full product catalogs for every line we make, ready to download and share.',
  },
] as const;

type TabSlug = (typeof TABS)[number]['slug'];

interface ResourcePageProps {
  products: Product[];
  catalogs: CatalogItem[];
}

export const ResourcePage: React.FC<ResourcePageProps> = ({ products: all, catalogs }) => {
  // Aluminium profiles share one catalogue PDF, which lives under Catalogs.
  const products = useMemo(() => all.filter((p) => p.familySlug !== 'aluminum-profile'), [all]);
  const params = useParams();
  const navigate = useNavigate();
  const tab: TabSlug = (TABS.find((t) => t.slug === params.section)?.slug ?? 'datasheets') as TabSlug;
  const meta = TABS.find((t) => t.slug === tab)!;
  const [family, setFamily] = useState('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(
    () =>
      products.filter((p) => {
        if (tab === 'datasheets' && !p.downloads.datasheet) return false;
        if (tab === 'ies' && p.downloads.ies.length + p.downloads.ldt.length + p.downloads.report.length === 0) return false;
        if (family !== 'all' && p.familySlug !== family) return false;
        const q = query.trim().toLowerCase();
        return !q || `${p.model} ${p.itemNo} ${p.series}`.toLowerCase().includes(q);
      }),
    [products, family, query, tab],
  );

  const totals = useMemo(() => {
    const ies = new Set<string>();
    const reports = new Set<string>();
    products.forEach((p) => {
      [...p.downloads.ies, ...p.downloads.ldt].forEach((e) => ies.add(e.url));
      p.downloads.report.forEach((e) => reports.add(e.url));
    });
    return {
      datasheets: [new Set(products.map((p) => p.downloads.datasheet).filter(Boolean)).size, 'Datasheets'],
      ies: [ies.size, 'IES & LDT files', reports.size, 'Test reports'],
      catalogs: [catalogs.length, 'Catalogs'],
    } as Record<TabSlug, (string | number)[]>;
  }, [products, catalogs]);

  const stats = totals[tab];

  return (
    <div className="min-h-screen pb-[14vh] pt-32">
      <SEOHead
        title={`${meta.label} · Resource`}
        description="Download Tyria Lighting catalogs, product datasheets, IES / LDT photometric files and test reports for silicone LED neon flex, LED strip, wall grazers and LED sheets."
        canonicalPath={`/resources/${tab}`}
      />
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="micro mb-5">Resource</div>

        <div className="no-scrollbar -mx-1 mb-10 flex gap-1 overflow-x-auto px-1">
          <div className="flex gap-1 rounded-full bg-stone/60 p-1">
            {TABS.map((t) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => {
                  setOpen(null);
                  navigate(`/resources/${t.slug}`);
                }}
                className="relative whitespace-nowrap rounded-full px-5 py-2.5 text-[14px]"
              >
                {tab === t.slug && (
                  <motion.span layoutId="res-tab" transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full bg-ink" />
                )}
                <span className={`relative transition-colors duration-500 ${tab === t.slug ? 'text-canvas' : 'text-graphite'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6, ease: SILK }}>
            <h1 className="max-w-[14ch] font-display text-[clamp(48px,7.4vw,124px)] font-light leading-[0.92] tracking-[-0.06em] text-ink">
              {meta.title}
            </h1>
            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-[46ch] text-[16px] leading-relaxed text-graphite">{meta.lead}</p>
              <div className="flex gap-12">
                {Array.from({ length: stats.length / 2 }, (_, k) => (
                  <div key={k}>
                    <div className="font-display text-[44px] font-light tabular-nums tracking-[-0.05em] text-ink">{stats[k * 2]}</div>
                    <div className="micro">{stats[k * 2 + 1]}</div>
                  </div>
                ))}
              </div>
            </div>

            {tab === 'catalogs' ? (
              <section className="mt-[8vh] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {catalogs.map((c, i) => (
                  <Cover key={c.id} c={c} i={i} />
                ))}
              </section>
            ) : (
              <section className="mt-[8vh]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-stone/60 p-1">
                    {FAMILIES.map((f) => (
                      <button key={f.slug} type="button" onClick={() => setFamily(f.slug)} className="relative whitespace-nowrap rounded-full px-4 py-2 text-[13px]">
                        {family === f.slug && (
                          <motion.span layoutId="dl-family" transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full bg-paper shadow-[0_6px_20px_-10px_rgba(17,17,17,0.35)]" />
                        )}
                        <span className={`relative ${family === f.slug ? 'text-ink' : 'text-graphite'}`}>{f.label}</span>
                      </button>
                    ))}
                  </div>
                  <label className="relative flex h-11 items-center rounded-full bg-stone/60 pl-11 pr-4 focus-within:bg-paper">
                    <svg className="absolute left-4 text-mute" width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Model or part number"
                      className="w-full bg-transparent text-[14px] text-ink placeholder:text-mute focus:outline-none sm:w-[220px]"
                    />
                  </label>
                </div>
                <ul className="mt-8 space-y-1">
                  {list.map((p) => (
                    <FileRow key={p.id} p={p} mode={tab} open={open === p.id} onToggle={() => setOpen((o) => (o === p.id ? null : p.id))} />
                  ))}
                </ul>
                {list.length === 0 && <p className="mt-10 text-[15px] text-graphite">No model matches “{query}”.</p>}
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
