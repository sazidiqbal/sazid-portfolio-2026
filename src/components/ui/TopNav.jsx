import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#top", label: "Home", sectionId: "top" },
  { href: "#about", label: "About", sectionId: "about" },
  { href: "#work", label: "Work", sectionId: "work" },
  { href: "#experience", label: "Experience", sectionId: "experience" },
  { href: "#contact", label: "Contact", sectionId: "contact" }
];

function resolveInitialSection() {
  if (typeof window === "undefined") {
    return "top";
  }

  const hash = window.location.hash.replace("#", "");

  if (hash === "projects") {
    return "work";
  }

  return hash || "top";
}

export default function TopNav({ progressBarRef }) {
  const [activeSection, setActiveSection] = useState(resolveInitialSection);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter(Boolean);

    if (!sectionElements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => {
            if (right.intersectionRatio !== left.intersectionRatio) {
              return right.intersectionRatio - left.intersectionRatio;
            }

            return Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top);
          });

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-16% 0px -62% 0px",
        threshold: [0.15, 0.3, 0.45, 0.6]
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    const handleHashChange = () => {
      const nextHash = window.location.hash.replace("#", "");
      setActiveSection(nextHash === "projects" ? "work" : nextHash || "top");
      setIsMenuOpen(false);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [isMenuOpen]);

  const mobileTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1]
      };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 px-3 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="pointer-events-auto mx-auto max-w-[1120px]">
          <div className="relative overflow-hidden rounded-[1.65rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(10,13,18,0.9),rgba(8,10,14,0.86))] shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-[20px]">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 md:px-5 lg:px-6">
              <a href="#top" className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 flex-none place-items-center overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.045] p-[2px] md:h-12 md:w-12">
                  <img
                    src="https://res.cloudinary.com/dxbnzirkf/image/upload/q_auto/f_auto/v1777311769/dp_pianaa.jpg"
                    alt="Sazid Iqbal Hussain"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-display text-[0.88rem] font-semibold tracking-[0.14em] text-white/94 md:text-[0.92rem] lg:text-[0.95rem]">
                    SAZZZID
                  </p>
                  <p className="mt-1 hidden text-[0.7rem] font-medium tracking-[0.16em] text-fog/68 sm:block md:text-[0.68rem] lg:text-[0.72rem]">
                    Product Designer
                  </p>
                </div>
              </a>

              <nav className="hidden items-center gap-5 md:flex md:gap-4 lg:gap-6">
                {navItems.map((item) => {
                  const isActive = activeSection === item.sectionId;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group relative inline-flex min-h-11 items-center py-1 text-[0.86rem] font-medium tracking-[0.01em] transition-colors duration-300 lg:text-[0.9rem] ${
                        isActive ? "text-white" : "text-white/62 hover:text-white/88"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`absolute inset-x-0 -bottom-[1px] h-px origin-left bg-white/80 transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </a>
                  );
                })}
              </nav>

              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 text-sm font-medium tracking-[0.08em] text-white/88 transition-colors duration-300 hover:bg-white/[0.07] md:hidden"
              >
                <span>Menu</span>
                <span className="relative h-3.5 w-4">
                  <span
                    className={`absolute left-0 top-[2px] h-px w-4 bg-white/85 transition-transform duration-300 ${
                      isMenuOpen ? "translate-y-[4px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[9px] h-px w-4 bg-white/85 transition-transform duration-300 ${
                      isMenuOpen ? "-translate-y-[3px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
            </div>

            <div className="hidden md:block">
              <div className="mx-5 h-px overflow-hidden rounded-full bg-white/[0.06] lg:mx-6">
                <span
                  ref={progressBarRef}
                  className="block h-full origin-left scale-x-0 bg-gradient-to-r from-white/80 via-white/48 to-white/22"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={mobileTransition}
            className="fixed inset-0 z-40 md:hidden"
          >
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-[rgba(3,5,8,0.72)] backdrop-blur-md"
            />

            <motion.aside
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
              transition={mobileTransition}
              className="absolute inset-x-3 top-3 bottom-3 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(8,10,14,0.96),rgba(6,8,12,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.34)]"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

              <div className="flex h-full flex-col px-4 pb-5 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 flex-none place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] font-display text-[0.7rem] font-semibold tracking-[0.24em] text-white/94">
                      SIH
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-[0.82rem] font-semibold tracking-[0.12em] text-white/92">
                        SAZID IQBAL HUSSAIN
                      </p>
                      <p className="mt-1 text-[0.65rem] font-medium tracking-[0.14em] text-fog/66">
                        Product Designer / Game Designer
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-sm font-medium text-white/84 transition-colors duration-300 hover:bg-white/[0.07]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-10 flex-1">
                  <div className="mb-5 px-1 text-[0.68rem] uppercase tracking-[0.22em] text-fog/56">Navigation</div>
                  <nav className="space-y-2.5">
                    {navItems.map((item) => {
                      const isActive = activeSection === item.sectionId;

                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex min-h-[4.25rem] items-center justify-between rounded-[1.4rem] border px-5 py-4 transition-colors duration-300 ${
                            isActive
                              ? "border-white/[0.14] bg-white/[0.07] text-white"
                              : "border-white/[0.08] bg-white/[0.03] text-white/82"
                          }`}
                        >
                          <span className="font-display text-[1.35rem] tracking-[-0.04em]">{item.label}</span>
                          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-fog/56">Go</span>
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {/* <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-fog/56">Brand note</p>
                  <p className="mt-3 text-sm leading-7 text-white/74">
                    A quieter navigation with stronger hierarchy, premium spacing, and a more refined first
                    impression across desktop, tablet, and mobile.
                  </p>
                </div> */} 
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
