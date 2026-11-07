import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CERTIFICATIONS = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ETL', 'TÜV-CE', 'UKCA', 'RCM', 'RoHS', 'LM-80', 'ErP'];

const COLUMNS = [
  {
    title: 'Products',
    links: [
      { label: 'LED Neon Flex', to: '/products/neon-flex' },
      { label: 'LED Strip', to: '/products/led-strip' },
      { label: 'Wall Grazer', to: '/products/wall-grazer' },
      { label: 'Backlit LED Sheet', to: '/products/led-sheet' },
      { label: 'Aluminum Profile', to: '/products/aluminum-profile' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Datasheets & Manuals', to: '/resources/datasheets' },
      { label: 'IES File & Test Report', to: '/resources/ies' },
      { label: 'Catalogs', to: '/resources/catalogs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Application', to: '/application' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
];

export const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <footer className="bg-[#F5F4F0] text-[#55534E]">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-10">
        {/* Closing statement (the home page ends with its own) */}
        {!isHome && <div className="pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <h2 className="lg:col-span-8 font-display text-[clamp(44px,7vw,112px)] leading-[0.95] tracking-[-0.045em] text-[#111111] font-medium">
            Light, engineered
            <br />
            to bend.
          </h2>
          <div className="lg:col-span-4 lg:justify-self-end flex flex-col items-start gap-4">
            <p className="text-[15px] leading-relaxed max-w-[34ch]">
              Free engineering samples for lighting designers, consultants and contractors.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center h-11 px-6 rounded-full bg-[#111111] text-[#F5F4F0] text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              Request a sample
            </Link>
          </div>
        </div>}

        {/* Brand + link grid */}
        <div className="grid grid-cols-2 gap-10 pb-10 pt-14 text-[14px] md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Link to="/" aria-label="Tyria Lighting home" className="inline-block">
              <img src="/assets/tyria-logo.png" alt="Tyria Lighting" className="h-14 w-auto select-none" />
            </Link>
            <p className="mt-5 max-w-[32ch] text-[14px] leading-relaxed">
              LED neon flex, LED strip and linear lighting, made in Shenzhen since 2012.
            </p>
          </div>
          {COLUMNS.map((col, i) => (
            <div key={col.title} className={`space-y-4 md:col-span-2 ${i === 0 ? 'md:col-start-7' : ''}`}>
              <div className="spec-label">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[#111111] transition-opacity hover:opacity-60">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact: one tile per channel, then the two factories side by side */}
        <div className="grid grid-cols-1 gap-3 pb-6 sm:grid-cols-3 md:grid-cols-6">
          {[
            { k: 'Email', v: 'info@tyrialight.com', href: 'mailto:info@tyrialight.com' },
            { k: 'Phone', v: '+86 755 3693 1652', href: 'tel:+8675536931652' },
            { k: 'WhatsApp', v: '+86 189 3869 3458', href: 'https://wa.me/8618938693458' },
          ].map((c) => (
            <a
              key={c.k}
              href={c.href}
              target={c.k === 'WhatsApp' ? '_blank' : undefined}
              rel="noreferrer"
              className="group flex items-end justify-between rounded-[24px] bg-paper px-5 py-5 transition-colors duration-500 hover:bg-[#111111] md:col-span-2"
            >
              <span>
                <span className="spec-label block !text-[10px] group-hover:!text-[#F5F4F0]/50">{c.k}</span>
                <span className="mt-2 block text-[16px] text-[#111111] transition-colors group-hover:text-[#F5F4F0]">{c.v}</span>
              </span>
              <span className="text-[#111111] transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-[#F5F4F0]">→</span>
            </a>
          ))}
          {[
            ['Factory 01 · HQ', 'Antonio Technology Park, Shajing, Bao’an, Shenzhen, China'],
            ['Factory 02', 'Shancheng Industrial Zone, Shiyan, Bao’an, Shenzhen, China'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[24px] bg-stone/50 px-5 py-5 sm:col-span-3 md:col-span-3">
              <span className="spec-label block !text-[10px]">{k}</span>
              <span className="mt-2 block text-[14px] leading-relaxed text-[#111111]">{v}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mb-6 rounded-[28px] md:rounded-full bg-stone/60 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-[10px] tracking-[0.08em] uppercase text-[#8C8A84]">
          <span>© {new Date().getFullYear()} Shenzhen Tyria Lighting Technology Co., Ltd.</span>
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            {CERTIFICATIONS.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
};
