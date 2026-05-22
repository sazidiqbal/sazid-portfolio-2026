import { Suspense } from "react";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import SceneRoot from "@/components/canvas/SceneRoot";

export default function SceneCanvas({ sceneStateRef }) {
  return (
    <div className="fixed inset-0 z-0 bg-[#03050a]">
      <Canvas
        dpr={[1, 1.75]}
        frameloop="demand"
        shadows={false}
        performance={{ min: 0.65 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true
        }}
        camera={{ fov: 42, position: [0, 1.2, 10], near: 0.1, far: 340 }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr />
          <AdaptiveEvents />
          <SceneRoot sceneStateRef={sceneStateRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
