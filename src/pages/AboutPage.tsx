import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { SEOHead } from '../components/common/SEOHead';

const SILK = [0.22, 1, 0.36, 1] as const;

const img = (n: string) => `/assets/about/${n}.webp`;

const SECTIONS = [
  { id: 'rd', label: 'R&D Capacity' },
  { id: 'packaging', label: 'Packaging Equipment' },
  { id: 'manufacturing', label: 'Manufacturing Capacity' },
  { id: 'laboratory', label: 'Our Laboratory' },
];

const WORKSHOPS = [
  { n: '01', l: 'SMT Workshop', t: 'High-speed automatic placement lines build every flexible circuit board in-house.', img: img('smt-workshop') },
  { n: '02', l: 'LED Neon Workshop', t: 'Six silicone co-extrusion lines form the neon body around the light engine in one pass.', img: img('neon-extrusion') },
  { n: '03', l: 'LED Strip Workshop', t: 'Automatic production lines for LED strip, from reel to finished product.', img: img('strip-workshop') },
  { n: '04', l: 'Waterproof Products Workshop', t: 'Potting, sealing and ageing for IP65, IP67 and IP68 products.', img: img('waterproof-workshop') },
];

const PACKAGING = [
  { t: 'Automatic SMD packaging line', d: 'LED chips are packaged and binned on our own line, so colour stays consistent from reel to reel.', img: img('packaging-line') },
  { t: 'Precision dispensing', d: 'Phosphor and encapsulant are dispensed automatically for a stable colour point and light output.', img: img('packaging-dispense') },
];

const LAB = [
  ['lab-ies', 'IES laboratory (goniophotometer)'],
  ['lab-sphere', 'Integrating sphere'],
  ['lab-temp-humidity', 'Temperature & humidity test chamber'],
  ['lab-uv', 'UV weathering test box'],
  ['lab-ip-chamber', 'IP3–IP6 integrated waterproof test chamber'],
  ['lab-ipx8', 'IPX8 flooding pressure tester'],
  ['lab-salt-spray', 'Salt spray chamber'],
  ['lab-optical-measuring', 'Optical image coordinate measuring instrument'],
  ['lab-drop', 'Arm drop test machine'],
  ['lab-tensile', 'Microcomputer tensile tester'],
  ['lab-vibration', 'Transportation vibration tester'],
];

const CERTS = [
  'ISO 9001', 'ISO 14001', 'ISO 45001', 'ETL', 'TÜV CE', 'UKCA', 'RCM', 'RoHS', 'LM-80',
];

function SectionHead({ k, title, zh, children }: { k: string; title: string; zh?: string; children?: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <div className="micro mb-5">{k}</div>
        <h2 className="font-display text-[clamp(40px,5.6vw,96px)] font-light leading-[0.95] tracking-[-0.055em] text-ink">{title}</h2>
      </div>
      {children && <div className="text-[16px] leading-relaxed text-graphite lg:col-span-5">{children}</div>}
    </div>
  );
}

/** A slim index that sticks under the header and tracks which capability is on screen. */
function CapabilityIndex() {
  const [active, setActive] = useState('rd');
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="sticky top-24 z-30 mx-auto mt-[10vh] flex max-w-[1600px] justify-center px-5 sm:px-10">
      <nav className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-paper/85 p-1 shadow-[0_12px_30px_-18px_rgba(17,17,17,0.35)] backdrop-blur-xl">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="relative whitespace-nowrap rounded-full px-4 py-2 text-[13px]">
            {active === s.id && (
              <motion.span layoutId="about-index" transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full bg-ink" />
            )}
            <span className={`relative transition-colors duration-500 ${active === s.id ? 'text-canvas' : 'text-graphite'}`}>{s.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

/** R&D: two photos slide apart from a single frame as the section scrolls in. */
function RD() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const left = useTransform(scrollYProgress, [0, 1], ['18%', '0%']);
  const right = useTransform(scrollYProgress, [0, 1], ['-18%', '0%']);
  const rot = useTransform(scrollYProgress, [0, 1], [-4, 0]);
  return (
    <section id="rd" ref={ref} className="mx-auto max-w-[1600px] scroll-mt-28 px-5 py-[14vh] sm:px-10">
      <SectionHead k="01 · R&D Capacity" title="Fifteen engineers. One brief: better light.">
        A team of 15 engineers with more than 10 years of experience across structure, technology, material science,
        electronics, intelligent control, industrial design and facade &amp; architectural lighting solutions.
      </SectionHead>
      <div className="mt-14 grid gap-4 md:grid-cols-12">
        <motion.div style={{ x: left, rotate: rot }} className="overflow-hidden rounded-[40px] bg-stone md:col-span-7">
          <img src={img('rd-team')} alt="Tyria R&D engineers at work" loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
        </motion.div>
        <motion.div style={{ x: right }} className="flex flex-col gap-4 md:col-span-5">
          <div className="overflow-hidden rounded-[40px] bg-stone">
            <img src={img('rd-engineer')} alt="Optical and structural design" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4">
            {[
              ['15', 'R&D engineers'],
              ['10+', 'Years of experience each'],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col justify-end rounded-[32px] bg-paper p-6">
                <div className="font-display text-[clamp(40px,4vw,64px)] font-light leading-none tracking-[-0.05em] text-ink">{n}</div>
                <div className="micro mt-3">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Packaging: hover a step and the frame beside it wipes to the matching photo. */
function Packaging() {
  const [active, setActive] = useState(0);
  return (
    <section id="packaging" className="scroll-mt-28 bg-ink py-[14vh] text-canvas">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="micro mb-5 !text-canvas/50">02 · Packaging Equipment</div>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[clamp(40px,5vw,84px)] font-light leading-[0.95] tracking-[-0.055em]">
              We package our own LEDs.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-canvas/65">
              In-house SMD packaging means we choose the chip, the phosphor and the bin, instead of buying whatever is on the market.
            </p>
            <ol className="mt-10 space-y-2">
              {PACKAGING.map((s, i) => (
                <li key={s.t}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`w-full rounded-[24px] px-5 py-4 text-left transition-colors duration-500 ${active === i ? 'bg-canvas/10' : 'hover:bg-canvas/5'}`}
                  >
                    <span className={`block font-display text-[clamp(22px,2vw,30px)] tracking-[-0.035em] transition-colors ${active === i ? 'text-canvas' : 'text-canvas/35'}`}>{s.t}</span>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: SILK }} className="block overflow-hidden">
                          <span className="block pt-2 text-[15px] leading-relaxed text-canvas/60">{s.d}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[40px] bg-canvas/10 lg:col-span-7">
            <AnimatePresence initial={false}>
              <motion.img
                key={active}
                src={PACKAGING[active].img}
                alt={PACKAGING[active].t}
                initial={{ clipPath: 'circle(0% at 85% 15%)', scale: 1.08 }}
                animate={{ clipPath: 'circle(150% at 85% 15%)', scale: 1 }}
                exit={{ opacity: 0.7 }}
                transition={{ duration: 1, ease: SILK }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Manufacturing: vertical scroll drives a horizontal track of the four workshops. */
function Manufacturing() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((WORKSHOPS.length - 1) / WORKSHOPS.length) * 100}%`]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <section id="manufacturing" ref={ref} className="relative scroll-mt-0" style={{ height: `${WORKSHOPS.length * 85}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-[1600px] items-end justify-between gap-6 px-5 sm:px-10">
          <div>
            <div className="micro mb-4">03 · Manufacturing Capacity</div>
            <h2 className="font-display text-[clamp(34px,4vw,68px)] font-light leading-[0.95] tracking-[-0.05em] text-ink">11,000 m² · 260 people</h2>
          </div>
          <div className="hidden h-[3px] w-[220px] overflow-hidden rounded-full bg-stone md:block">
            <motion.div style={{ width: bar }} className="h-full rounded-full bg-ink" />
          </div>
        </div>
        <motion.div style={{ x, width: `${WORKSHOPS.length * 100}vw` }} className="flex">
          {WORKSHOPS.map((c) => (
            <div key={c.l} className="flex w-screen shrink-0 px-5 sm:px-10">
              <div className="mx-auto grid w-full max-w-[1600px] items-center gap-8 lg:grid-cols-12">
                <div className="order-2 lg:order-1 lg:col-span-4">
                  <div className="font-mono text-[12px] text-mute">{c.n} / {String(WORKSHOPS.length).padStart(2, '0')}</div>
                  <div className="mt-4 font-display text-[clamp(28px,3vw,48px)] tracking-[-0.04em] text-ink">{c.l}</div>
                  <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-graphite">{c.t}</p>
                </div>
                <div className="order-1 lg:order-2 lg:col-span-8">
                  <div className="aspect-[16/9] overflow-hidden rounded-[40px] bg-stone">
                    <img src={c.img} alt={c.l} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Laboratory: instruments drop into a masonry wall; the first one is featured large. */
function Laboratory() {
  return (
    <section id="laboratory" className="mx-auto max-w-[1600px] scroll-mt-28 px-5 py-[14vh] sm:px-10">
      <SectionHead k="04 · Our Laboratory" title="Quality control ability.">
        Optical, environmental and mechanical tests run in-house, so every number on a datasheet and every IES file is measured, not
        estimated.
      </SectionHead>
      <div className="mt-14 columns-2 gap-4 md:columns-3 lg:columns-4">
        {LAB.map(([n, t], i) => (
          <motion.figure
            key={n}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, delay: (i % 4) * 0.07 }}
            className="group mb-4 break-inside-avoid"
          >
            <div className="overflow-hidden rounded-[28px] bg-stone">
              <img src={img(n)} alt={t} loading="lazy" className="w-full transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.05]" />
            </div>
            <figcaption className="mt-2 px-1 text-[13px] text-graphite">{t}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

/** Certificates arrive as a fanned hand of cards and spread on hover. */
function Certificates() {
  const [spread, setSpread] = useState(false);
  const n = 9;
  return (
    <section className="overflow-hidden py-[14vh]">
      <div className="mx-auto max-w-[1600px] px-5 text-center sm:px-10">
        <div className="micro mb-5">Certified</div>
        <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(36px,4.6vw,76px)] font-normal leading-[1] tracking-[-0.045em] text-ink">
          Tested to the standards your project asks for.
        </h2>
      </div>
      <div
        className="relative mx-auto mt-16 h-[clamp(260px,34vw,460px)] max-w-[1200px]"
        onMouseEnter={() => setSpread(true)}
        onMouseLeave={() => setSpread(false)}
        onClick={() => setSpread((s) => !s)}
      >
        {Array.from({ length: n }).map((_, i) => {
          const c = i - (n - 1) / 2;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{
                rotate: spread ? c * 3 : c * 7,
                x: `${c * (spread ? 105 : 22)}%`,
                y: spread ? Math.abs(c) * 6 : Math.abs(c) * 14,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18, delay: spread ? 0 : 0.02 * i }}
              className="absolute left-1/2 top-0 aspect-[7/10] h-full -translate-x-1/2 origin-bottom"
              style={{ zIndex: 10 - Math.abs(Math.round(c)) }}
            >
              <img
                src={`/assets/certs/cert_0${i + 1}.webp`}
                alt={CERTS[i]}
                loading="lazy"
                className="h-full w-full rounded-[18px] bg-white object-cover shadow-[0_30px_60px_-30px_rgba(17,17,17,0.5)]"
              />
            </motion.div>
          );
        })}
      </div>
      <div className="mx-auto mt-14 flex max-w-[900px] flex-wrap justify-center gap-2 px-5">
        {CERTS.map((c) => (
          <span key={c} className="rounded-full bg-stone/60 px-4 py-2 text-[13px] text-graphite">{c}</span>
        ))}
      </div>
    </section>
  );
}

export const AboutPage: React.FC = () => {
  const words = ['Linear', 'light,', 'made', 'in', 'Shenzhen', 'since', '2012.'];
  return (
    <div className="pt-32">
      <SEOHead
        title="About · Factory, Lab & Certifications"
        description="Tyria Lighting has made silicone LED neon flex, LED strip and wall grazers in Shenzhen since 2012: 11,000 m² across two factories, 260 people, in-house lab and ISO-certified quality management."
        canonicalPath="/about"
      />

      {/* Opening line, word by word from behind a mask */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="micro mb-6">About Tyria</div>
        <h1 className="max-w-[14ch] font-display text-[clamp(52px,9vw,160px)] font-light leading-[0.9] tracking-[-0.065em] text-ink">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, ease: SILK, delay: 0.15 + i * 0.07 }}
                className="inline-block pr-[0.22em]"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: SILK, delay: 0.8 }}
          className="mt-10 max-w-[52ch] text-[17px] leading-relaxed text-graphite"
        >
          Founded in 2012, Tyria Lighting develops and manufactures LED neon flex, LED strip and linear lighting, with customised lighting solutions and professional service. Stable quality, fast delivery, efficient and professional service.
        </motion.p>
      </section>

      {/* Enterprise profile */}
      <section className="mx-auto mt-[10vh] grid max-w-[1600px] gap-4 px-5 sm:px-10 md:grid-cols-12">
        <motion.div
          initial={{ clipPath: 'inset(12% 12% 12% 12% round 40px)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 40px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: SILK }}
          className="overflow-hidden rounded-[40px] md:col-span-7"
        >
          <img src={img('building')} alt="Tyria Lighting headquarters" className="aspect-[4/3] h-full w-full object-cover" />
        </motion.div>
        <div className="grid grid-cols-2 gap-4 md:col-span-5">
          {[
            ['2012', 'Founded'],
            ['11,000 m²', 'Workshops'],
            ['260', 'Employees'],
            ['50+', 'Export countries'],
          ].map(([n, l], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 140, damping: 18, delay: i * 0.08 }}
              className="flex flex-col justify-end rounded-[32px] bg-paper p-6"
            >
              <div className="font-display text-[clamp(32px,3.2vw,52px)] font-light leading-none tracking-[-0.05em] text-ink">{n}</div>
              <div className="micro mt-3">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <CapabilityIndex />
      <RD />
      <Packaging />
      <Manufacturing />
      <Laboratory />

      <Certificates />

      {/* Factories */}
      <section className="mx-auto max-w-[1600px] px-5 pb-[12vh] sm:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Factory 01 · Headquarters', 'Antonio Technology Park, Shajing, Bao’an, Shenzhen, China'],
            ['Factory 02', 'Shancheng Industrial Zone, Shiyan, Bao’an, Shenzhen, China'],
          ].map(([t, a]) => (
            <div key={t} className="rounded-card bg-paper p-8 sm:p-10">
              <div className="micro">{t}</div>
              <p className="mt-4 max-w-[30ch] font-display text-[clamp(22px,2vw,30px)] leading-snug tracking-[-0.03em] text-ink">{a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          <Link to="/contact" className="pill-ink h-12 px-7">Visit or request a sample</Link>
          <Link to="/resources/catalogs" className="pill-soft h-12 px-6">Company catalogue</Link>
        </div>
      </section>
    </div>
  );
};
