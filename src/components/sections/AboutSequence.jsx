import { motion } from "framer-motion";
import { aboutBeats } from "@/data/portfolio";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
};

export default function AboutSequence() {
  return (
    <section id="about" className="section-shell relative">
      <div className="sticky top-0 flex min-h-screen items-center px-4 py-24 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <motion.div {...reveal} className="max-w-xl">
            <p className="hud-caption text-[0.72rem] text-fog/70">Narrative reveal // who I am</p>
            <h2 className="text-balance mt-5 font-display text-4xl leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl xl:text-6xl">
              Designed like exposition in a film, not an about section on a template.
            </h2>
            <p className="mt-6 text-base leading-8 text-fog/78 md:text-lg">
              I think in interaction, emotion, immersion, behavior, and the invisible logic that makes a system
              feel inevitable. That is the crossover between product design and game design that defines my work.
            </p>
          </motion.div>

          <div className="space-y-5">
            {aboutBeats.map((beat, index) => (
              <motion.article
                key={beat.code}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
                className="glass-panel rounded-[2rem] border border-white/10 p-6 shadow-glass md:p-7"
              >
                <div className="flex items-start gap-5">
                  <span className="font-display text-3xl tracking-[-0.08em] text-white/28">{beat.code}</span>
                  <div>
                    <h3 className="text-balance font-display text-2xl leading-tight tracking-[-0.05em] text-white">
                      {beat.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-fog/78">{beat.copy}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
