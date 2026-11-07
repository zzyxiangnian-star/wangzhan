import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
      { name: '360° Round', slug: '360-round' },
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
];

const NAV = [
  { label: 'Profiles', to: '/products/neon-flex' },
  { label: 'Downloads', to: '/downloads' },
  { label: 'About', to: '/about' },
];

const pillLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-[14px] transition-colors duration-500 ease-silk ${
    isActive ? 'bg-stone/80 text-ink' : 'text-graphite hover:bg-stone/70 hover:text-ink'
  }`;

export const Header: React.FC = () => {
  const { items, setIsDrawerOpen } = useInquiry();
  const [megaOpen, setMegaOpen] = useState(false);
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
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160);
  };

  const productsActive = pathname.startsWith('/product');

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: hidden && !megaOpen && !mobileOpen ? '-110%' : '0%' }}
      transition={{ duration: 0.6, ease: SILK }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-silk ${
        scrolled || megaOpen || mobileOpen ? 'bg-canvas/80 backdrop-blur-xl' : ''
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-10">
        <Link to="/" className="flex items-center whitespace-nowrap shrink-0" aria-label="Tyria Lighting home">
          <img
            src="/assets/tyria-logo.png"
            alt="Tyria Lighting"
            className="h-9 sm:h-10 w-auto object-contain select-none"
          />
        </Link>

        <nav
          className={`hidden md:flex items-center gap-1 rounded-full p-1 transition-all duration-700 ease-silk ${
            scrolled ? 'bg-paper/80 shadow-[0_8px_30px_-12px_rgba(17,17,17,0.18)] backdrop-blur-xl' : 'bg-transparent'
          }`}
        >
          <div onMouseEnter={openMega} onMouseLeave={closeMega}>
            <Link
              to="/products"
              className={pillLink({ isActive: productsActive })}
              onFocus={openMega}
            >
              Products
            </Link>
          </div>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => pillLink({ isActive: isActive && n.label !== 'Profiles' })}>
              {n.label}
            </NavLink>
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
          <Link to="/contact" className="pill-ink hidden h-10 sm:inline-flex">
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full bg-stone/70 md:hidden"
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
        {megaOpen && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute inset-x-0 top-[76px] hidden justify-center px-5 md:flex">
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.45, ease: SILK }}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            className="pointer-events-auto w-full max-w-[980px] origin-top"
          >
            <div className="grid grid-cols-4 gap-8 rounded-card bg-paper/95 p-8 shadow-[0_40px_80px_-30px_rgba(17,17,17,0.28)] backdrop-blur-xl">
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: SILK }}
            className="fixed inset-x-0 bottom-0 top-20 bg-canvas px-5 pb-10 pt-6 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {[{ label: 'Products', to: '/products' }, ...NAV, { label: 'Contact', to: '/contact' }].map((n, i) => (
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
