import { motion } from "framer-motion";
import { contactLinks } from "@/data/portfolio";

export default function ContactSequence() {
  return (
    <section id="contact" className="section-shell relative min-h-[120vh]">
      <div className="sticky top-0 flex min-h-screen items-center px-4 py-24 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-[2.4rem] border border-white/10 p-8 shadow-glass md:p-12"
          >
            <p className="hud-caption text-[0.72rem] text-fog/70">Final scene // end credits</p>
            <h2 className="text-balance mt-6 max-w-4xl font-display text-4xl leading-[0.94] tracking-[-0.08em] text-white sm:text-5xl xl:text-7xl">
              Let's build something unforgettable.
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-fog/78 md:text-lg">
              If you want a designer who thinks in systems, player experience, cinematic pacing, and premium
              interaction quality, this is where the trailer stops and the real conversation begins.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {contactLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{ duration: 0.75, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
                >
                  <p className="hud-caption text-[0.62rem] text-fog/60">{link.label}</p>
                  <p className="mt-4 font-display text-xl tracking-[-0.04em] text-white">{link.value}</p>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:your-email@example.com?subject=Let's%20build%20something%20unforgettable"
                className="inline-flex min-h-12 items-center rounded-full border border-cyan/30 bg-cyan/10 px-6 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-cyan/16"
              >
                Start the conversation
              </a>
              <a
                href="#top"
                className="inline-flex min-h-12 items-center rounded-full border border-white/12 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.22em] text-white/84 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/8"
              >
                Replay the intro
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
