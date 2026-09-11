import { motion } from "framer-motion";

const contactLinks = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sazzzid",
    href: "https://www.linkedin.com/in/sazzzid",
  },
  {
    label: "Behance",
    value: "behance.net/sazzzid",
    href: "https://www.behance.net/sazzzid",
  },
  {
    label: "Email",
    value: "sazidiqbalh@gmail.com",
    href: "mailto:sazidiqbalh@gmail.com",
  },
  {
    label: "Phone",
    value: "+91 70863 01406",
    href: "tel:+917086301406",
  },
];

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
            <p className="hud-caption text-[0.72rem] text-fog/70">
              Final scene // end credits
            </p>

            <h2 className="text-balance mt-6 max-w-4xl font-display text-4xl leading-[0.94] tracking-[-0.08em] text-white sm:text-5xl xl:text-7xl">
              Let's build something unforgettable.
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-fog/78 md:text-lg">
              If you want a designer who thinks in systems, player
              experience, cinematic pacing, and premium interaction
              quality, this is where the trailer stops and the real
              conversation begins.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {contactLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/30 hover:bg-white/[0.06]"
                >
                  <p className="hud-caption text-[0.62rem] uppercase tracking-[0.2em] text-fog/60">
                    {link.label}
                  </p>

                  <p className="mt-4 break-all font-display text-lg tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-cyan md:text-xl">
                    {link.value}
                  </p>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sazidiqbalh@gmail.com&su=Let's%20build%20something%20unforgettable"
              target="_blank"
              rel="noreferrer"
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