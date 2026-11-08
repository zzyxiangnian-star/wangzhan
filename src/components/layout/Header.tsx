import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useInquiry } from '../../context/InquiryContext';

const SILK = [0.22, 1, 0.36, 1] as const;

const PRODUCT_MENU = [
  {
    family: 'LED Neon Flex',
    slug: 'neon-flex',
    series: [
      { name: 'Top View', slug: 'top-view' },
      { name: 'Side View', slug: 'side-view' },
      { name: '360° Emitting', slug: '360-emitting' },
      { name: '3D Dual-Bend', slug: '3d-bend' },
      { name: 'Anti-Glare', slug: 'anti-glare' },
      { name: 'Dome & Dual-Side', slug: 'dome' },
      { name: 'IP68 Submersible', slug: 'ip68-silicone' },
      { name: 'Pixel Neon', slug: 'pixel-neon' },
    ],
  },
  {
    family: 'LED Strip',
    slug: 'led-strip',
    series: [
      { name: 'High Efficiency', slug: 'high-efficiency' },
      { name: 'COB', slug: 'cob-strip' },
      { name: 'SMD2835', slug: 'smd2835' },
      { name: '48V Super Long', slug: '48v-super-long' },
      { name: 'Tunable & RGBW', slug: 'cct-tunable' },
      { name: 'Addressable Pixel', slug: 'addressable-pixel' },
    ],
  },
  {
    family: 'Wall Grazer',
    slug: 'wall-grazer',
    series: [
      { name: 'Wall Grazer 2621 Pro', slug: 'grazer-2621-pro' },
      { name: 'Wall Grazer 1615', slug: 'grazer-1615' },
      { name: 'PU DMX512 Grazer', slug: 'grazer-pu' },
    ],
  },
  {
    family: 'LED Sheet',
    slug: 'led-sheet',
    series: [{ name: 'Backlit LED Sheet', slug: 'backlit-sheet' }],
  },
  {
    family: 'Aluminum Profile',
    slug: 'aluminum-profile',
    series: [
      { name: 'LED Strip Profile', slug: 'strip-profile' },
      { name: 'Linear Light Profile', slug: 'linear-light' },
      { name: 'Bendable Linear Light', slug: 'bendable-linear' },
      { name: 'Modular Linear System', slug: 'modular-linear' },
      { name: 'Acoustic Luminaire', slug: 'acoustic' },
      { name: 'Hand-Bendable Profile', slug: 'hand-bendable' },
    ],
  },
];

type MenuKey = 'product' | 'about' | 'resource';

const NAV: { label: string; to: string; menu?: MenuKey; items?: { label: string; to: string; note?: string }[] }[] = [
  { label: 'Product', to: '/products', menu: 'product' },
  {
    label: 'About',
    to: '/about',
    menu: 'about',
    items: [
      { label: 'Company Profile', to: '/about' },
      { label: 'R&D Capacity', to: '/about#rd' },
      { label: 'Packaging Equipment', to: '/about#packaging' },
      { label: 'Manufacturing Capacity', to: '/about#manufacturing' },
      { label: 'Our Laboratory', to: '/about#laboratory' },
    ],
  },
  {
    label: 'Resource',
    to: '/resources',
    menu: 'resource',
    items: [
      { label: 'Datasheets & Manuals', to: '/resources/datasheets', note: 'PDF per model' },
      { label: 'IES File & Test Report', to: '/resources/ies', note: 'Photometry and lab reports' },
      { label: 'Catalogs', to: '/resources/catalogs', note: 'Full product catalogs' },
    ],
  },
  { label: 'Application', to: '/application' },
  { label: 'Contact us', to: '/contact' },
];

const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: SILK }} width="9" height="9" viewBox="0 0 10 10" fill="none" className="mt-[1px]">
    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

export const Header: React.FC = () => {
  const { items, setIsDrawerOpen } = useInquiry();
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const megaOpen = menu !== null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();
  const closeTimer = useRef<number | undefined>(undefined);
  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Tuck the bar away while reading downwards, bring it back on any upward scroll.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const openMenu = (k: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    setMenu(k);
  };
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  };
  const isActive = (to: string) => (to === '/products' ? pathname.startsWith('/product') : pathname.startsWith(to));
  const dropdown = NAV.find((n) => n.menu === menu && n.items);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: hidden && !megaOpen && !mobileOpen ? '-110%' : '0%' }}
      transition={{ duration: 0.6, ease: SILK }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-silk ${
        scrolled || megaOpen || mobileOpen ? 'bg-canvas/80 backdrop-blur-xl' : ''
      }`}
    >
      <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-10">
        <Link to="/" className="flex items-center whitespace-nowrap shrink-0" aria-label="Tyria Lighting home">
          <img
            src="/assets/tyria-logo.png"
            alt="Tyria Lighting"
            className="h-10 sm:h-12 w-auto object-contain select-none"
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[clamp(20px,3.4vw,56px)] lg:flex">
          {NAV.map((n) => (
            <div
              key={n.to}
              className="relative"
              onMouseEnter={() => (n.menu ? openMenu(n.menu) : setMenu(null))}
              onMouseLeave={n.menu ? closeMenu : undefined}
            >
              <Link
                to={n.to}
                onFocus={() => n.menu && openMenu(n.menu)}
                className={`group relative flex items-center gap-1.5 py-2 text-[15px] tracking-[-0.01em] transition-colors duration-500 ${
                  isActive(n.to) || menu === n.menu && n.menu ? 'text-ink' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {n.label}
                {n.menu && <Chevron open={menu === n.menu} />}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] rounded-full bg-ink transition-all duration-500 ease-silk ${
                    isActive(n.to) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="pill-soft h-10 px-4"
              aria-label={`Open inquiry list, ${totalItems} items`}
            >
              List
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[11px] text-canvas tabular-nums">
                {totalItems}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full bg-stone/70 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-[1.5px] w-4 rounded-full bg-ink transition-all duration-500 ease-silk ${
                  mobileOpen ? 'top-[5px] rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 rounded-full bg-ink transition-all duration-500 ease-silk ${
                  mobileOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Products mega menu */}
      <AnimatePresence>
        {menu === 'product' && (
          <motion.div key="mega" exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute inset-x-0 top-[72px] hidden justify-center px-5 lg:flex">
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.45, ease: SILK }}
            onMouseEnter={() => openMenu('product')}
            onMouseLeave={closeMenu}
            className="pointer-events-auto w-full max-w-[1180px] origin-top"
          >
            <div className="grid grid-cols-5 gap-8 rounded-card bg-paper/95 p-8 shadow-[0_40px_80px_-30px_rgba(17,17,17,0.28)] backdrop-blur-xl">
              {PRODUCT_MENU.map((col) => (
                <div key={col.slug}>
                  <Link
                    to={`/products/${col.slug}`}
                    className="font-display text-[17px] font-medium tracking-[-0.02em] text-ink hover:opacity-60 transition-opacity"
                  >
                    {col.family}
                  </Link>
                  <ul className="mt-4 space-y-2">
                    {col.series.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/products/${col.slug}/${s.slug}`}
                          className="text-[14px] text-graphite transition-colors hover:text-ink"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About / Resource dropdown */}
      <AnimatePresence>
        {dropdown && (
          <motion.div key={dropdown.menu} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="pointer-events-none absolute inset-x-0 top-[72px] hidden justify-center px-5 lg:flex">
            <motion.div
              initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: SILK }}
              onMouseEnter={() => openMenu(dropdown.menu!)}
              onMouseLeave={closeMenu}
              className="pointer-events-auto w-[340px] rounded-[26px] bg-paper/95 p-2 shadow-[0_40px_80px_-30px_rgba(17,17,17,0.28)] backdrop-blur-xl"
            >
              {dropdown.items!.map((it, i) => (
                <motion.div key={it.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: SILK, delay: 0.03 * i }}>
                  <Link to={it.to} className="group flex items-center justify-between rounded-[20px] px-4 py-3 transition-colors hover:bg-stone/60">
                    <span>
                      <span className="block text-[15px] text-ink">{it.label}</span>
                      {it.note && <span className="block text-[12.5px] text-mute">{it.note}</span>}
                    </span>
                    <span className="text-mute transition-transform duration-500 ease-silk group-hover:translate-x-1 group-hover:text-ink">→</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: SILK }}
            className="fixed inset-x-0 top-20 h-[calc(100svh-5rem)] overflow-y-auto bg-canvas px-5 pb-10 pt-6 lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: SILK, delay: 0.05 + i * 0.05 }}
                >
                  <Link to={n.to} className="block py-2 font-display text-[44px] font-light leading-none tracking-[-0.045em] text-ink">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-10 flex flex-wrap gap-2">
              {PRODUCT_MENU.map((c) => (
                <Link key={c.slug} to={`/products/${c.slug}`} className="pill-soft">
                  {c.family}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
