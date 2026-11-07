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
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Datasheets', to: '/downloads' },
      { label: 'IES & LDT Files', to: '/downloads' },
      { label: 'Catalogues', to: '/downloads' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
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

        {/* Link grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-10 text-[14px]">
          <div className="col-span-2 md:col-span-5 space-y-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-editorial text-[21px] font-normal uppercase tracking-[0.04em] text-[#111111]">
                TY<span className="italic pr-[0.03em]">R</span>IA
              </span>
              <span className="spec-label !text-[10px]">Lighting</span>
            </div>
            <div className="space-y-1 leading-relaxed">
              <div><a href="mailto:info@tyrialight.com" className="text-[#111111] hover:opacity-60 transition-opacity">info@tyrialight.com</a></div>
              <div><a href="tel:+8675536931652" className="hover:text-[#111111] transition-colors">+86 755 3693 1652</a></div>
              <div>
                <a href="https://wa.me/8618938693458" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">
                  WhatsApp +86 189 3869 3458
                </a>
              </div>
            </div>
            <div className="space-y-3 max-w-[46ch] text-[13px] leading-relaxed">
              <p>
                <span className="spec-label block mb-1">Factory 01 · HQ</span>
                Antonio Technology Park, Shajing, Bao&apos;an, Shenzhen, China
              </p>
              <p>
                <span className="spec-label block mb-1">Factory 02</span>
                Shancheng Industrial Zone, Shiyan, Bao&apos;an, Shenzhen, China
              </p>
            </div>
          </div>
          {COLUMNS.map((col, i) => (
            <div key={col.title} className={`md:col-span-2 space-y-4 ${i === 0 ? 'md:col-start-7' : ''}`}>
              <div className="spec-label">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[#111111] hover:opacity-60 transition-opacity">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
