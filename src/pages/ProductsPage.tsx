import React, { useMemo, useState } from 'react';
import plainHeroes from '../data/plain_heroes.json';

// Products whose only photo is a datasheet shot on white. They go after the studio photos.
const PLAIN = new Set<string>(plainHeroes);
const rank = (p: { id: string; familySlug: string }) => (p.familySlug === 'aluminum-profile' ? 2 : PLAIN.has(p.id) ? 1 : 0);
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Product } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { ProfileCrossSectionSVG } from '../components/products/ProfileCrossSectionSVG';
import { useInquiry } from '../context/InquiryContext';
import lightHeroes from '../data/light_heroes.json';

const LIGHT_HEROES = new Set<string>(lightHeroes as string[]);
const SILK = [0.22, 1, 0.36, 1] as const;

const FAMILIES = [
  { slug: 'all', label: 'All', title: 'All products' },
  { slug: 'neon-flex', label: 'Neon Flex', title: 'LED Neon Flex' },
  { slug: 'led-strip', label: 'LED Strip', title: 'LED Strip' },
  { slug: 'wall-grazer', label: 'Wall Grazer', title: 'Wall Grazer' },
  { slug: 'led-sheet', label: 'LED Sheet', title: 'Backlit LED Sheet' },
  { slug: 'aluminum-profile', label: 'Aluminum Profile', title: 'Aluminum Profile' },
];

const VIEWS = ['TV', 'SV', '360', '3D', 'Dome', 'Dual', 'Embedded', 'Anti-Glare', 'COB', 'Strip'];
const IPS = ['IP68', 'IP67', 'IP65', 'IP20'];
const CONTROLS = [
  { key: 'Single', label: 'Single colour' },
  { key: 'Tunable', label: 'Tunable white' },
  { key: 'RGB', label: 'RGB / RGBW' },
  { key: 'DMX', label: 'DMX512' },
  { key: 'SPI', label: 'SPI' },
];

const sizeLabel = (p: Product) =>
  !p.size.w ? '—' : p.view === '360' ? `Ø ${p.size.w} mm` : p.view === 'Sheet' ? `${p.size.w} × ${p.size.h} mm` : `${p.size.w} × ${p.size.h} mm`;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-all duration-500 ease-silk ${
        active ? 'bg-ink text-canvas' : 'bg-stone/60 text-graphite hover:bg-stone hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function ProductCard({ p, onAdd }: { p: Product; onAdd: () => void }) {
  const showPhoto = Boolean(p.images?.hero) && !LIGHT_HEROES.has(p.id);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
      transition={{ duration: 0.7, ease: SILK }}
      className="group"
    >
      <Link
        to={`/product/${p.id}`}
        className={`relative block aspect-[4/5] overflow-hidden rounded-card ${showPhoto ? 'bg-ink' : 'bg-stone/70'}`}
      >
        {showPhoto ? (
          <img
            src={p.images.hero}
            alt={p.model}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.08]">
            <ProfileCrossSectionSVG w={p.size.w} h={p.size.h} view={p.view} scale={4.2} showDimensions={false} />
          </div>
        )}

        {/* X-ray: a frosted sheet rises on hover with the true-scale section and key numbers */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[calc(100%+16px)] rounded-[22px] bg-canvas/85 p-4 text-ink opacity-0 backdrop-blur-xl transition-all duration-700 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-4">
            {p.view !== 'Profile' && (
              <div className="grid h-16 w-20 shrink-0 place-items-center">
                <ProfileCrossSectionSVG w={p.size.w} h={p.size.h} view={p.view} scale={2} showDimensions={false} />
              </div>
            )}
            <dl className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
              <div>
                <dt className="micro !text-[9.5px]">Size</dt>
                <dd>{sizeLabel(p)}</dd>
              </div>
              <div>
                <dt className="micro !text-[9.5px]">Power</dt>
                <dd>{p.wattOptions.length ? `${p.wattOptions.slice(0, 3).join(' / ')} W/m` : '—'}</dd>
              </div>
              {p.view === 'Profile' ? (
                <div className="col-span-2">
                  <dt className="micro !text-[9.5px]">Length</dt>
                  <dd>{p.maxRun !== '—' ? p.maxRun : 'Custom'}</dd>
                </div>
              ) : (
                <>
                  <div>
                    <dt className="micro !text-[9.5px]">Voltage</dt>
                    <dd>{p.voltage}</dd>
                  </div>
                  <div>
                    <dt className="micro !text-[9.5px]">Rating</dt>
                    <dd>{p.ip}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>

        {p.ip && <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] backdrop-blur-md ${
            showPhoto ? 'bg-ink/45 text-canvas/90' : 'bg-canvas/70 text-graphite'
          }`}
        >
          {p.ip}
        </span>}
      </Link>
      <div className="flex items-start justify-between gap-4 px-1 pt-4">
        <div className="min-w-0">
          <div className="micro truncate">{p.series}</div>
          <Link
            to={`/product/${p.id}`}
            className="mt-1 block truncate font-display text-[20px] leading-tight tracking-[-0.03em] text-ink"
          >
            {p.model}
          </Link>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone/70 text-ink transition-all duration-500 ease-silk hover:scale-110 hover:bg-ink hover:text-canvas"
          aria-label={`Add ${p.model} to sample request`}
          title="Add to sample request"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

interface ProductsPageProps {
  products: Product[];
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products }) => {
  const { family = 'all', series = 'all' } = useParams<{ family?: string; series?: string }>();
  const navigate = useNavigate();
  const { addItem } = useInquiry();

  const [view, setView] = useState('all');
  const [ip, setIp] = useState('all');
  const [control, setControl] = useState('all');
  const [maxWidth, setMaxWidth] = useState(60);
  const [query, setQuery] = useState('');
  const [refineOpen, setRefineOpen] = useState(false);

  const fam = FAMILIES.find((f) => f.slug === family) ?? FAMILIES[0];

  const seriesList = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (family === 'all' || p.familySlug === family) map.set(p.seriesSlug, p.series);
    });
    return Array.from(map.entries());
  }, [products, family]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (family !== 'all' && p.familySlug !== family) return false;
        if (series !== 'all' && p.seriesSlug !== series) return false;
        if (view !== 'all' && p.view !== view) return false;
        if (ip !== 'all' && !p.ip.includes(ip)) return false;
        if (control !== 'all' && !p.controls.some((c) => c.toLowerCase().includes(control.toLowerCase()))) return false;
        if (maxWidth < 60 && p.size.w > maxWidth && p.view !== 'Sheet') return false;
        if (query.trim()) {
          const hay = `${p.model} ${p.itemNo} ${p.series} ${p.family}`.toLowerCase();
          if (!hay.includes(query.trim().toLowerCase())) return false;
        }
        return true;
      }).sort((a, b) => rank(a) - rank(b)),
    [products, family, series, view, ip, control, maxWidth, query],
  );

  const refineCount = [view, ip, control].filter((v) => v !== 'all').length + (maxWidth < 60 ? 1 : 0);
  const reset = () => {
    setView('all');
    setIp('all');
    setControl('all');
    setMaxWidth(60);
    setQuery('');
  };
  const go = (f: string, s = 'all') => navigate(f === 'all' ? '/products' : s === 'all' ? `/products/${f}` : `/products/${f}/${s}`);
  const seriesName = seriesList.find(([s]) => s === series)?.[1];

  return (
    <div className="min-h-screen pb-[14vh] pt-32">
      <SEOHead
        title={seriesName ? `${seriesName} · ${fam.title}` : fam.title}
        description="Browse Tyria Lighting silicone LED neon flex, LED strips, wall grazers and backlit LED sheets with true-scale cross-sections, datasheets and IES files."
        canonicalPath={family !== 'all' ? `/products/${family}${series !== 'all' ? `/${series}` : ''}` : '/products'}
      />

      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        {/* Title */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="micro mb-5">Catalogue</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={fam.slug + series}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: SILK }}
                className="font-display text-[clamp(48px,8vw,136px)] font-light leading-[0.92] tracking-[-0.06em] text-ink"
              >
                {seriesName ?? fam.title}
              </motion.h1>
            </AnimatePresence>
          </div>
          <div className="pb-2 text-right">
            <motion.div
              key={filtered.length}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-[44px] font-light tabular-nums tracking-[-0.05em] text-ink"
            >
              {filtered.length}
            </motion.div>
            <div className="micro">Models</div>
          </div>
        </div>

        {/* Family switch with a sliding pill */}
        <LayoutGroup>
          <div className="no-scrollbar mt-12 flex gap-1 overflow-x-auto rounded-full bg-stone/60 p-1 sm:inline-flex">
            {FAMILIES.map((f) => (
              <button
                key={f.slug}
                type="button"
                onClick={() => go(f.slug)}
                className="relative whitespace-nowrap rounded-full px-5 py-2.5 text-[14px]"
              >
                {family === f.slug && (
                  <motion.span
                    layoutId="family-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-paper shadow-[0_6px_20px_-10px_rgba(17,17,17,0.35)]"
                  />
                )}
                <span className={`relative transition-colors duration-300 ${family === f.slug ? 'text-ink' : 'text-graphite hover:text-ink'}`}>
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        {/* Series + tools */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
            {family !== 'all' && (
              <>
                <Chip active={series === 'all'} onClick={() => go(family)}>
                  All series
                </Chip>
                {seriesList.map(([slug, label]) => (
                  <Chip key={slug} active={series === slug} onClick={() => go(family, slug)}>
                    {label}
                  </Chip>
                ))}
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <label className="relative flex h-11 items-center rounded-full bg-stone/60 pl-11 pr-4 transition-colors focus-within:bg-paper focus-within:shadow-[0_8px_24px_-14px_rgba(17,17,17,0.4)]">
              <svg className="absolute left-4 text-mute" width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 1617, R40, COB…"
                className="w-[170px] bg-transparent text-[14px] text-ink placeholder:text-mute focus:outline-none sm:w-[210px]"
              />
            </label>
            <button
              type="button"
              onClick={() => setRefineOpen((o) => !o)}
              className={`pill h-11 ${refineOpen || refineCount ? 'bg-ink text-canvas' : 'bg-stone/60 text-ink hover:bg-stone'}`}
              aria-expanded={refineOpen}
            >
              Refine
              {refineCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-canvas px-1.5 text-[11px] text-ink">{refineCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Refine drawer */}
        <AnimatePresence initial={false}>
          {refineOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: SILK }}
              className="overflow-hidden"
            >
              <div className="mt-5 grid gap-8 rounded-card bg-paper p-6 shadow-[0_30px_60px_-40px_rgba(17,17,17,0.35)] sm:p-8 lg:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                  <div className="micro mb-3">Light output</div>
                  <div className="flex flex-wrap gap-2">
                    <Chip active={view === 'all'} onClick={() => setView('all')}>Any</Chip>
                    {VIEWS.map((v) => (
                      <Chip key={v} active={view === v} onClick={() => setView(v)}>{v}</Chip>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="micro mb-3">Ingress rating</div>
                    <div className="flex flex-wrap gap-2">
                      <Chip active={ip === 'all'} onClick={() => setIp('all')}>Any</Chip>
                      {IPS.map((v) => (
                        <Chip key={v} active={ip === v} onClick={() => setIp(v)}>{v}</Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex justify-between">
                      <span className="micro">Max width</span>
                      <span className="text-[13px] text-ink">{maxWidth >= 60 ? 'Any' : `≤ ${maxWidth} mm`}</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={60}
                      step={2}
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(Number(e.target.value))}
                      className="w-full accent-[#111111]"
                    />
                  </div>
                </div>
                <div>
                  <div className="micro mb-3">Control</div>
                  <div className="flex flex-wrap gap-2">
                    <Chip active={control === 'all'} onClick={() => setControl('all')}>Any</Chip>
                    {CONTROLS.map((c) => (
                      <Chip key={c.key} active={control === c.key} onClick={() => setControl(c.key)}>{c.label}</Chip>
                    ))}
                  </div>
                  <button type="button" onClick={reset} className="mt-8 text-[13px] text-graphite underline-offset-4 hover:text-ink hover:underline">
                    Clear all
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid: cards reflow smoothly when filters change */}
        <div className="mt-14">
          {filtered.length === 0 ? (
            <div className="rounded-card bg-paper px-6 py-20 text-center">
              <div className="font-display text-[28px] tracking-[-0.03em] text-ink">Nothing matches yet.</div>
              <p className="mx-auto mt-3 max-w-[44ch] text-[14px] text-graphite">
                Loosen a filter, or ask us: custom silicone extrusions are part of what we do.
              </p>
              <button type="button" onClick={reset} className="pill-ink mt-8">
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} onAdd={() => addItem(p)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
