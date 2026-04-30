import { motion } from "framer-motion";
import { projectChapters } from "@/data/portfolio";

export default function ProjectsSequence() {
  return (
    <section id="work" className="section-shell relative">
      <div id="projects" aria-hidden="true" className="absolute -top-24 h-px w-px opacity-0" />
      <div className="sticky top-0 flex min-h-screen items-center px-4 py-24 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-4xl"
          >
            <p className="hud-caption text-[0.72rem] text-fog/68">Projects sequence // mission chapters</p>
            <h2 className="text-balance mt-5 font-display text-4xl leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl xl:text-6xl">
              Projects should feel like entering new chapters, not scanning portfolio cards.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-fog/78 md:text-lg">
              Each project below is treated like a mission reveal: category, tension, objective, and design signal
              all surfaced with controlled motion and premium hierarchy.
            </p>
          </motion.div>

          <div className="grid gap-5">
            {projectChapters.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group glass-panel relative overflow-hidden rounded-[2.1rem] border border-white/10 p-6 shadow-glass transition-transform duration-500 hover:-translate-y-1.5 md:p-8"
              >
                <div className="absolute right-6 top-4 font-display text-6xl tracking-[-0.08em] text-white/[0.05] md:text-8xl">
                  0{index + 1}
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:items-end">
                  <div>
                    <p className="hud-caption text-[0.68rem] text-white/52/70">{project.code}</p>
                    <p className="mt-4 text-sm uppercase tracking-[0.2em] text-fog/72">{project.category}</p>
                  </div>

                  <div>
                    <h3 className="text-balance font-display text-3xl leading-[1.02] tracking-[-0.05em] text-white md:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-fog/78 md:text-lg">{project.summary}</p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/76"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,0.7fr)_minmax(180px,0.3fr)]">
                      <p className="text-base leading-8 text-white/72">{project.detail}</p>
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <p className="hud-caption text-[0.62rem] text-fog/60">chapter pulse</p>
                        <div className="mt-4 space-y-3">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan to-royal" />
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                            <div className="h-full w-[54%] rounded-full bg-gradient-to-r from-royal to-ember" />
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                            <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-white/80 to-cyan/35" />
                          </div>
                        </div>
                      </div>
                    </div>
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
