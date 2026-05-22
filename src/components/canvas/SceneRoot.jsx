import { useEffect, useMemo, useRef } from "react";
import { Color, Fog, MathUtils, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import TunnelField from "@/components/canvas/TunnelField";
import StageMonoliths, { PLANET_STOPS } from "@/components/canvas/StageMonoliths";
import SpeedParticles from "@/components/canvas/SpeedParticles";

const tmpPosition = new Vector3();
const tmpLookAt = new Vector3();
const currentPosition = new Vector3();
const currentLookAt = new Vector3();

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function sampleCamera(progress) {
  const scaled = MathUtils.clamp(progress, 0, 1) * (PLANET_STOPS.length - 1);
  const index = Math.floor(scaled);
  const nextIndex = Math.min(index + 1, PLANET_STOPS.length - 1);
  const previous = PLANET_STOPS[index];
  const next = PLANET_STOPS[nextIndex];
  const alpha = easeInOutCubic(scaled - index);

  return {
    activeIndex: MathUtils.clamp(Math.round(scaled), 0, PLANET_STOPS.length - 1),
    position: previous.camera.map((value, axis) => MathUtils.lerp(value, next.camera[axis], alpha)),
    lookAt: previous.lookAt.map((value, axis) => MathUtils.lerp(value, next.lookAt[axis], alpha)),
    roll: MathUtils.lerp(previous.roll, next.roll, alpha)
  };
}

export default function SceneRoot({ sceneStateRef }) {
  const rigRef = useRef(null);
  const keyLightRef = useRef(null);
  const rimLightRef = useRef(null);
  const emberLightRef = useRef(null);
  const initializedRef = useRef(false);
  const { camera, scene, invalidate, size } = useThree();

  const deviceProfile = useMemo(
    () => ({
      isMobile: size.width < 768,
      particleCount: size.width < 768 ? 130 : 220
    }),
    [size.width]
  );

  useEffect(() => {
    scene.background = new Color("#01030a");
    scene.fog = new Fog("#01030a", 34, 250);
    sceneStateRef.current.invalidate = invalidate;
  }, [invalidate, scene, sceneStateRef]);

  useFrame((state, delta) => {
    const progress = sceneStateRef.current.progress ?? 0;
    const scrollEnergy = Math.sin(MathUtils.clamp(progress, 0, 1) * Math.PI);
    const sampled = sampleCamera(progress);
    const group = rigRef.current;
    sceneStateRef.current.activePlanet = sampled.activeIndex;

    tmpPosition.fromArray(sampled.position);
    tmpLookAt.fromArray(sampled.lookAt);

    if (!initializedRef.current) {
      currentPosition.copy(tmpPosition);
      currentLookAt.copy(tmpLookAt);
      state.camera.position.copy(tmpPosition);
      state.camera.lookAt(tmpLookAt);
      state.camera.rotation.z = sampled.roll;
      initializedRef.current = true;
    }

    currentPosition.lerp(tmpPosition, 1 - Math.pow(0.002, delta));
    currentLookAt.lerp(tmpLookAt, 1 - Math.pow(0.002, delta));

    state.camera.position.copy(currentPosition);
    state.camera.lookAt(currentLookAt);
    state.camera.rotation.z = MathUtils.lerp(state.camera.rotation.z, sampled.roll, 1 - Math.pow(0.002, delta));

    if (group) {
      group.rotation.z = MathUtils.lerp(group.rotation.z, sampled.roll * 0.16, 1 - Math.pow(0.002, delta));
      group.position.y = MathUtils.lerp(group.position.y, Math.sin(progress * Math.PI * 2) * 0.035, 1 - Math.pow(0.002, delta));
    }

    if (keyLightRef.current && rimLightRef.current && emberLightRef.current) {
      keyLightRef.current.intensity = MathUtils.lerp(keyLightRef.current.intensity, 2.6 - progress * 1.2, 1 - Math.pow(0.01, delta));
      rimLightRef.current.intensity = MathUtils.lerp(rimLightRef.current.intensity, 0.8 + scrollEnergy * 0.8, 1 - Math.pow(0.01, delta));
      emberLightRef.current.intensity = MathUtils.lerp(emberLightRef.current.intensity, 0.5 + Math.pow(progress, 1.8) * 0.45, 1 - Math.pow(0.01, delta));
      emberLightRef.current.position.z = MathUtils.lerp(emberLightRef.current.position.z, -90 - progress * 110, 1 - Math.pow(0.01, delta));
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight ref={keyLightRef} position={[0, 1.8, -4]} intensity={2.4} color="#ffbc72" distance={90} decay={1.8} />
      <pointLight ref={rimLightRef} position={[4.5, 4, -92]} intensity={0.9} color="#86d9ff" distance={170} decay={2} />
      <pointLight ref={emberLightRef} position={[-2, 2.2, -150]} intensity={0.5} color="#8fa9ff" distance={130} decay={2} />

      <group ref={rigRef}>
        <TunnelField planetStops={PLANET_STOPS} />
        <StageMonoliths sceneStateRef={sceneStateRef} isMobile={deviceProfile.isMobile} />
        <SpeedParticles count={deviceProfile.particleCount} />
      </group>
    </>
  );
}
