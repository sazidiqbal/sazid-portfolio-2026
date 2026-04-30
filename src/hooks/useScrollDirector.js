import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollDirector(scrollRef, sceneStateRef, progressBarRef) {
  useLayoutEffect(() => {
    const root = scrollRef.current;

    if (!root) {
      return undefined;
    }

    const sceneState = sceneStateRef.current;
    const setProgress = gsap.quickTo(sceneState, "progress", {
      duration: 0.24,
      ease: "power3.out",
      onUpdate: () => {
        sceneState.invalidate();
      }
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: false,
        onUpdate: (self) => {
          setProgress(self.progress);

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`;
          }
        }
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [progressBarRef, sceneStateRef, scrollRef]);
}
