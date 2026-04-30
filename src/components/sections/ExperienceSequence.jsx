import { motion } from "framer-motion";
import { experienceTimeline } from "@/data/portfolio";

const featured = experienceTimeline[0];
const supporting = experienceTimeline.slice(1);

export default function ExperienceSequence() {
  return (
    <section id="experience" className="section-shell relative">
      <div className="sticky top-0 flex min-h-screen items-center px-4 py-24 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-[2.2rem] border border-cyan/14 p-6 shadow-glass md:p-8"
          >
            <p className="hud-caption text-[0.72rem] text-white/52/70">Experience sequence // hero reveal</p>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.2em] text-white/62">{featured.company}</p>
                <h2 className="mt-2 text-balance font-display text-4xl leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
                  {featured.role}
                </h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-fog/80">
                {featured.period}
              </span>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-8 text-fog/78 md:text-lg">{featured.summary}</p>

            <div className="mt-8 grid gap-4">
              {featured.bullets.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="chapter-line rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 pl-8"
                >
                  <p className="text-base leading-7 text-white/82">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[2rem] border border-white/10 p-6 shadow-glass"
            >
              <p className="hud-caption text-[0.72rem] text-fog/68">Why this chapter matters</p>
              <h3 className="mt-4 text-balance font-display text-3xl leading-[1.02] tracking-[-0.05em] text-white">
                Pixentech is the proof that this portfolio is grounded in real game experience, not borrowed aesthetics.
              </h3>
              <p className="mt-5 text-base leading-8 text-fog/76">
                That is the key difference this sequence is trying to communicate: the visual world is cinematic,
                but the thinking comes from gameplay systems, player journeys, UI logic, and immersive interaction design.
              </p>
            </motion.div>

            {supporting.map((item, index) => (
              <motion.article
                key={item.company}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ duration: 0.82, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel rounded-[2rem] border border-white/10 p-6 shadow-glass"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg tracking-[-0.04em] text-white">{item.role}</p>
                    <p className="mt-1 text-sm uppercase tracking-[0.18em] text-fog/64">{item.company}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-fog/72">
                    {item.period}
                  </span>
                </div>

                <p className="mt-5 text-base leading-8 text-fog/76">{item.summary}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {item.bullets.map((bullet) => (
                    <span
                      key={bullet}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/74"
                    >
                      {bullet}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
