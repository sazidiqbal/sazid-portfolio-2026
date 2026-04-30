import { Suspense } from "react";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import SceneRoot from "@/components/canvas/SceneRoot";

export default function SceneCanvas({ sceneStateRef }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        shadows={false}
        performance={{ min: 0.7 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        camera={{ fov: 42, position: [0, 0.2, 12], near: 0.1, far: 240 }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <SceneRoot sceneStateRef={sceneStateRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
