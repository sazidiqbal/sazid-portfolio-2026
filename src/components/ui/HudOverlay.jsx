import { useEffect, useRef } from "react";
import { stageLabels } from "@/data/portfolio";

function getStageLabel(progress) {
  const match = stageLabels.find((stage) => progress <= stage.until);
  return match ? match.label : stageLabels[stageLabels.length - 1].label;
}

export default function HudOverlay({ sceneStateRef }) {
  const progressRef = useRef(null);
  const labelRef = useRef(null);
  const plutoLineRef = useRef(null);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      const progress = sceneStateRef.current.progress ?? 0;

      if (progressRef.current) {
        progressRef.current.textContent = `${Math.round(progress * 100)
          .toString()
          .padStart(2, "0")}%`;
      }

      if (labelRef.current) {
        labelRef.current.textContent = getStageLabel(progress);
      }

      if (plutoLineRef.current) {
        const visible = progress > 0.965;
        plutoLineRef.current.style.opacity = visible ? "1" : "0";
        plutoLineRef.current.style.transform = visible ? "translate(-50%, 0)" : "translate(-50%, 10px)";
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [sceneStateRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden xl:block">
      {/* Top Left */}
      {/* <div className="absolute left-8 top-28">
        <div className="rounded-3xl border border-white/20 bg-white/6 px-5 py-4 backdrop-blur-2xl shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
            sequence mode
          </p>
          <p className="mt-2 font-display text-sm tracking-[0.22em] text-white">
            CINEMATIC DRIVE
          </p>
        </div>
      </div> */}

      {/* Bottom Left */}
      <div className="absolute bottom-8 left-8 max-w-[15rem]">
        <div className="rounded-3xl border border-white/20 bg-white/6 px-5 py-4 backdrop-blur-2xl shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
            current sector
          </p>

          <p
            ref={labelRef}
            className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.14em] text-white"
          >
            title reveal
          </p>

          <p className="mt-3 text-sm leading-relaxed text-white/72">
            Premium racing intro meets product storytelling, optimized for
            smooth scroll and mid-range devices.
          </p>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-8 right-8 text-right">
        <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
          progress
        </p>
        <p
          ref={progressRef}
          className="mt-2 font-display text-4xl font-semibold text-white"
        >
          100%
        </p>
      </div>

      <div
        ref={plutoLineRef}
        className="absolute bottom-10 left-1/2 max-w-[32rem] -translate-x-1/2 rounded-full border border-white/18 bg-black/42 px-5 py-3 text-center text-sm text-white/82 opacity-0 shadow-[0_10px_44px_rgba(116,151,255,0.16)] backdrop-blur-2xl transition duration-500"
      >
        Pluto: not a planet, still the main character.
      </div>
    </div>
  );
}
