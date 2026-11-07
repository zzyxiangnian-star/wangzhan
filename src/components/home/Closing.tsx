import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SILK = [0.22, 1, 0.36, 1] as const;

export function Closing() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-[10vh] pt-[16vh] sm:px-10">
      <div className="relative overflow-hidden rounded-[40px] bg-ink px-6 py-[16vh] text-center text-canvas sm:px-10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/25 blur-[120px]" />
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 1.15, ease: SILK }}
          className="relative font-display text-[clamp(48px,9vw,160px)] font-light leading-[0.92] tracking-[-0.06em]"
        >
          Request a sample.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 1.05, ease: SILK, delay: 0.12 }}
          className="relative mx-auto mt-8 max-w-[40ch] text-[15px] leading-relaxed text-canvas/70"
        >
          Free engineering samples for lighting designers, consultants and contractors. Tell us the profile and colour
          temperature, we ship from Shenzhen.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 1.0, ease: SILK, delay: 0.22 }}
          className="relative mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link to="/contact" className="pill h-12 bg-canvas px-7 text-ink hover:scale-[1.03]">
            Contact us
          </Link>
          <Link to="/downloads" className="pill h-12 bg-canvas/10 px-7 text-canvas hover:bg-canvas/20">
            Download catalogues
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
