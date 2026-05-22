import { useLayoutEffect, useMemo, useRef } from "react";
import { AdditiveBlending } from "three";
import { useFrame } from "@react-three/fiber";

function createParticles(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  let seed = 12.9898;

  function random() {
    seed = Math.sin(seed) * 43758.5453;
    return seed - Math.floor(seed);
  }

  for (let index = 0; index < count; index += 1) {
    const accent = index % 17 === 0;

    positions[index * 3] = (random() - 0.5) * 26;
    positions[index * 3 + 1] = (random() - 0.5) * 12 + 1.8;
    positions[index * 3 + 2] = 10 - random() * 250;

    colors[index * 3] = accent ? 0.86 : 0.68;
    colors[index * 3 + 1] = accent ? 0.78 : 0.8;
    colors[index * 3 + 2] = accent ? 1 : 0.95;
  }

  return { positions, colors };
}

export default function SpeedParticles({ count }) {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const { positions, colors } = useMemo(() => createParticles(count), [count]);

  useLayoutEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [positions]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const energy = 0.5 + Math.sin(elapsed * 0.65) * 0.5;

    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.002;
      pointsRef.current.position.y = Math.sin(elapsed * 0.18) * 0.08;
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.18 + energy * 0.1;
    }
  });

  return (
    <points key={count} ref={pointsRef} frustumCulled={false}>
      <bufferGeometry key={`particles-${count}`}>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={colors.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.035}
        transparent
        opacity={0.46}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
