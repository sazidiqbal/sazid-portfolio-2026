import { motion } from "framer-motion";
import { skillModules } from "@/data/portfolio";

export default function SkillsSequence() {
  return (
    <section id="skills" className="section-shell relative">
      <div className="sticky top-0 flex min-h-screen items-center px-4 py-24 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.84, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
          >
            <div className="max-w-2xl">
              <p className="hud-caption text-[0.72rem] text-fog/68">Skills sequence // racing HUD / control system</p>
              <h2 className="text-balance mt-5 font-display text-4xl leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl xl:text-6xl">
                Presented like a machine diagnostics panel, not a pile of software logos.
              </h2>
              <p className="mt-6 text-base leading-8 text-fog/78 md:text-lg">
                These tools are framed as a controlled system: interface, 3D, gameplay, frontend, motion, and
                launch surfaces working together as one design engine.
              </p>
            </div>

            <div className="glass-panel hud-grid rounded-[2.2rem] border border-white/10 p-5 shadow-glass md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {skillModules.map((skill, index) => (
                  <motion.article
                    key={skill.name}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[1.6rem] border border-white/10 bg-[#0b1017]/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xl tracking-[-0.04em] text-white">{skill.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-fog/64">{skill.category}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/52/80">
                        {skill.band}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-fog/76">{skill.detail}</p>

                    <div className="mt-5 space-y-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                        <div className={`h-full rounded-full bg-gradient-to-r from-cyan to-royal ${index % 3 === 0 ? "w-[86%]" : index % 3 === 1 ? "w-[72%]" : "w-[64%]"}`} />
                      </div>
                      <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.18em] text-fog/62">
                        <span>readiness</span>
                        <span>{index % 3 === 0 ? "high" : index % 3 === 1 ? "strong" : "active"}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
