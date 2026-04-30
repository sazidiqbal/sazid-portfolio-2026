import { useMemo } from "react";

function createParticles(count) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const radius = 2.8 + Math.random() * 6.4;
    const angle = Math.random() * Math.PI * 2;

    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 5.6;
    positions[index * 3 + 2] = -Math.random() * 190;
  }

  return positions;
}

export default function SpeedParticles({ count }) {
  const positions = useMemo(() => createParticles(count), [count]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#d7ecff" size={0.05} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}
