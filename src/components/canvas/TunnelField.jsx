import { AdditiveBlending, Color } from "three";

function OrbitMarker({ stop, index }) {
  if (index === 0) {
    return null;
  }

  const scale = 1 + index * 0.06;

  return (
    <group position={[0, stop.position[1] - 0.04, stop.position[2]]} rotation={[Math.PI / 2, 0, index * 0.08]} scale={[scale, 0.35, 1]}>
      <mesh>
        <torusGeometry args={[3.2 + index * 0.22, 0.006, 6, 120]} />
        <meshBasicMaterial color={stop.accent} transparent opacity={0.13} depthWrite={false} blending={AdditiveBlending} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[2.1 + index * 0.14, 0.004, 6, 96]} />
        <meshBasicMaterial color="#dce8ff" transparent opacity={0.055} depthWrite={false} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}

function SolarGuide({ depth, index }) {
  return (
    <mesh position={[index % 2 === 0 ? -3.6 : 3.6, -1.15 + (index % 3) * 0.42, depth]} scale={[0.018, 0.018, 9.8]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={index % 4 === 0 ? "#ffb06a" : "#7dbdff"} transparent opacity={0.09} depthWrite={false} blending={AdditiveBlending} />
    </mesh>
  );
}

export default function TunnelField({ planetStops = [] }) {
  const guideLines = Array.from({ length: 18 }, (_, index) => -12 - index * 12.4);

  return (
    <group>
      <mesh position={[0, -1.55, -110]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 250]} />
        <meshBasicMaterial color={new Color("#01030a")} transparent opacity={0.34} depthWrite={false} />
      </mesh>

      {planetStops.map((stop, index) => (
        <OrbitMarker key={`orbit-${stop.id}`} stop={stop} index={index} />
      ))}

      {guideLines.map((depth, index) => (
        <SolarGuide key={`solar-guide-${depth}`} depth={depth} index={index} />
      ))}
    </group>
  );
}
