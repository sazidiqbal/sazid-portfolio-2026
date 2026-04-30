import { motion } from "framer-motion";
import { heroStats } from "@/data/portfolio";

const transition = {
  duration: 0.9,
  ease: [0.16, 1, 0.3, 1]
};

export default function HeroSequence() {
  return (
    <section id="top" className="section-shell relative">
      <div className="sticky top-0 flex min-h-screen items-start px-4 py-24 md:items-center md:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-12 pt-24 md:pt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={transition}
            className="max-w-4xl"
          >
            <p className="hud-caption text-[0.72rem] text-fog/70">
              Opening sequence // premium racing intro // interactive world reveal
            </p>

            <h1 className="text-balance mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.9] tracking-[-0.08em] text-white sm:text-6xl md:text-7xl xl:text-[7.25rem]">
              SAZID IQBAL HUSSAIN
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.28em] text-fog/82">
              <span>Product Designer</span>
              <span className="h-px w-8 bg-white/16" />
              <span>Game Designer</span>
              <span className="h-px w-8 bg-white/16" />
              <span>Visual Storyteller</span>
            </div>

            <p className="text-balance mt-8 max-w-3xl font-display text-2xl leading-tight text-white/88 md:text-3xl">
              I design products like experiences. I build interfaces like worlds.
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-fog/78 md:text-lg">
              This portfolio is built like a playable title sequence. Scroll becomes the camera move, the layout
              becomes the pacing, and every chapter is meant to feel like a premium reveal instead of a normal
              portfolio page.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#experience"
                className="inline-flex min-h-12 items-center rounded-full border border-cyan/30 bg-cyan/10 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-cyan/16"
              >
                Enter Experience
              </a>
              <a
                href="#work"
                className="inline-flex min-h-12 items-center rounded-full border border-white/12 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-white/84 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/8"
              >
                View Mission Chapters
              </a>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={{ ...transition, delay: 0.08 }}
            className="glass-panel hud-grid rounded-[2rem] border border-white/10 p-6 shadow-glass"
          >
            <div className="flex items-center justify-between">
              <p className="hud-caption text-[0.62rem] text-fog/60">launch diagnostics</p>
              <p className="font-display text-sm uppercase tracking-[0.18em] text-white/52">online</p>
            </div>

            <div className="mt-8 space-y-5">
              {heroStats.map((item) => (
                <article key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="hud-caption text-[0.62rem] text-fog/58">{item.label}</p>
                  <p className="mt-2 text-sm leading-7 text-white/82">{item.value}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="hud-caption text-[0.62rem] text-fog/58">mood vector</p>
              <div className="mt-3 space-y-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan to-royal" />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-royal to-ember" />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-white/80 to-cyan/40" />
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
