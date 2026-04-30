import { useEffect, useMemo, useRef } from "react";
import { Color, Fog, MathUtils, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import TunnelField from "@/components/canvas/TunnelField";
import StageMonoliths from "@/components/canvas/StageMonoliths";
import SpeedParticles from "@/components/canvas/SpeedParticles";

const CAMERA_KEYFRAMES = [
  { at: 0, position: [0, 0.3, 14], lookAt: [0, 0, -6], roll: 0 },
  { at: 0.18, position: [0.7, 0.15, 2], lookAt: [0, 0, -22], roll: -0.05 },
  { at: 0.36, position: [-0.65, 0.08, -20], lookAt: [0, 0, -46], roll: 0.04 },
  { at: 0.56, position: [0.32, 0.12, -52], lookAt: [0, 0, -80], roll: -0.03 },
  { at: 0.78, position: [-0.45, 0.18, -92], lookAt: [0, 0, -122], roll: 0.05 },
  { at: 0.92, position: [0.18, 0.08, -126], lookAt: [0, 0, -150], roll: -0.02 },
  { at: 1, position: [0, 0.05, -150], lookAt: [0, 0, -176], roll: 0 }
];

const tmpPosition = new Vector3();
const tmpLookAt = new Vector3();
const currentPosition = new Vector3();
const currentLookAt = new Vector3();

function sampleKeyframes(progress) {
  let index = CAMERA_KEYFRAMES.findIndex((frame) => progress <= frame.at);

  if (index <= 0) {
    return CAMERA_KEYFRAMES[0];
  }

  if (index === -1) {
    return CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
  }

  const previous = CAMERA_KEYFRAMES[index - 1];
  const next = CAMERA_KEYFRAMES[index];
  const interval = next.at - previous.at || 1;
  const alpha = MathUtils.clamp((progress - previous.at) / interval, 0, 1);

  return {
    position: previous.position.map((value, axis) => MathUtils.lerp(value, next.position[axis], alpha)),
    lookAt: previous.lookAt.map((value, axis) => MathUtils.lerp(value, next.lookAt[axis], alpha)),
    roll: MathUtils.lerp(previous.roll, next.roll, alpha)
  };
}

export default function SceneRoot({ sceneStateRef }) {
  const rigRef = useRef(null);
  const initializedRef = useRef(false);
  const { camera, scene, invalidate, size } = useThree();

  const deviceProfile = useMemo(
    () => ({
      isMobile: size.width < 768,
      ringCount: size.width < 768 ? 34 : 58,
      particleCount: size.width < 768 ? 90 : 150
    }),
    [size.width]
  );

  useEffect(() => {
    scene.background = new Color("#05070b");
    scene.fog = new Fog("#05070b", 18, 220);
    sceneStateRef.current.invalidate = invalidate;
  }, [invalidate, scene, sceneStateRef]);

  useFrame((state, delta) => {
    const progress = sceneStateRef.current.progress ?? 0;
    const sampled = sampleKeyframes(progress);
    const group = rigRef.current;

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
      group.rotation.z = MathUtils.lerp(group.rotation.z, sampled.roll * 0.35, 1 - Math.pow(0.002, delta));
      group.position.y = MathUtils.lerp(group.position.y, Math.sin(progress * Math.PI * 5) * 0.08, 1 - Math.pow(0.002, delta));
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 8]} intensity={4.8} color="#6d8cff" distance={60} decay={2} />
      <pointLight position={[0, -2, -34]} intensity={3.4} color="#ffffff" distance={90} decay={2} />
      <pointLight position={[0, 0, -120]} intensity={2.2} color="#ff9f5a" distance={70} decay={2} />

      <group ref={rigRef}>
        <TunnelField ringCount={deviceProfile.ringCount} />
        <StageMonoliths />
        <SpeedParticles count={deviceProfile.particleCount} />
      </group>
    </>
  );
}
