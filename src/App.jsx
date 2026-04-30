import { Suspense, lazy, useRef } from "react";
import { motion } from "framer-motion";
import SceneCanvas from "@/components/canvas/SceneCanvas";
import HeroSequence from "@/components/sections/HeroSequence";
import AboutSequence from "@/components/sections/AboutSequence";
import HudOverlay from "@/components/ui/HudOverlay";
import TopNav from "@/components/ui/TopNav";
import { useScrollDirector } from "@/hooks/useScrollDirector";

const ExperienceSequence = lazy(() => import("@/components/sections/ExperienceSequence"));
const ProjectsSequence = lazy(() => import("@/components/sections/ProjectsSequence"));
const SkillsSequence = lazy(() => import("@/components/sections/SkillsSequence"));
const ContactSequence = lazy(() => import("@/components/sections/ContactSequence"));

function SequenceFallback({ label }) {
  return (
    <section className="section-shell relative">
      <div className="sticky top-0 flex min-h-screen items-center px-4 py-24 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2rem] border border-white/10 px-6 py-8 md:px-10 md:py-10"
          >
            <p className="hud-caption text-[0.72rem] text-fog/70">{label}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan via-royal to-ember"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const scrollRef = useRef(null);
  const progressBarRef = useRef(null);
  const sceneStateRef = useRef({
    progress: 0,
    invalidate: () => {}
  });

  useScrollDirector(scrollRef, sceneStateRef, progressBarRef);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-midnight text-white">
      <SceneCanvas sceneStateRef={sceneStateRef} />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,transparent_40%,rgba(2,3,6,0.35)_72%,rgba(2,3,6,0.92)_100%)]" />

      <TopNav progressBarRef={progressBarRef} />
      <HudOverlay sceneStateRef={sceneStateRef} />

      <main ref={scrollRef} className="relative z-10">
        <HeroSequence />
        <AboutSequence />

        <Suspense fallback={<SequenceFallback label="Loading Pixentech reveal" />}>
          <ExperienceSequence />
        </Suspense>

        <Suspense fallback={<SequenceFallback label="Loading mission chapters" />}>
          <ProjectsSequence />
        </Suspense>

        <Suspense fallback={<SequenceFallback label="Loading control system" />}>
          <SkillsSequence />
        </Suspense>

        <Suspense fallback={<SequenceFallback label="Loading final scene" />}>
          <ContactSequence />
        </Suspense>
      </main>
    </div>
  );
}
