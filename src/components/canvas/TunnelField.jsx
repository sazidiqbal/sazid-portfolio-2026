import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Matrix4, Object3D } from "three";

const ringDummy = new Object3D();
const stripDummy = new Object3D();
const matrix = new Matrix4();

function buildRingData(count) {
  return Array.from({ length: count }, (_, index) => {
    const depth = -index * 3.2;
    const wobble = Math.sin(index * 0.35) * 0.28;
    const vertical = Math.cos(index * 0.28) * 0.12;
    const scale = 1 + (index % 6) * 0.04;

    return {
      position: [wobble, vertical, depth],
      rotationZ: index * 0.11,
      scale
    };
  });
}

function buildStripData(count) {
  return Array.from({ length: count * 2 }, (_, index) => {
    const lane = index % 2 === 0 ? -1 : 1;
    const depthIndex = Math.floor(index / 2);
    const depth = -depthIndex * 3.2;
    const y = Math.sin(depthIndex * 0.2) * 0.16;

    return {
      position: [lane * 6.1, y, depth],
      scale: [0.18, 0.04, 1.6]
    };
  });
}

export default function TunnelField({ ringCount }) {
  const ringsRef = useRef(null);
  const stripsRef = useRef(null);

  const ringData = useMemo(() => buildRingData(ringCount), [ringCount]);
  const stripData = useMemo(() => buildStripData(ringCount), [ringCount]);

  useLayoutEffect(() => {
    if (!ringsRef.current || !stripsRef.current) {
      return;
    }

    ringData.forEach((ring, index) => {
      ringDummy.position.set(...ring.position);
      ringDummy.rotation.set(0, 0, ring.rotationZ);
      ringDummy.scale.setScalar(ring.scale);
      ringDummy.updateMatrix();
      ringsRef.current.setMatrixAt(index, ringDummy.matrix);
    });

    stripData.forEach((strip, index) => {
      stripDummy.position.set(...strip.position);
      stripDummy.rotation.set(0, 0, 0);
      stripDummy.scale.set(...strip.scale);
      stripDummy.updateMatrix();
      stripsRef.current.setMatrixAt(index, stripDummy.matrix);
    });

    ringsRef.current.instanceMatrix.needsUpdate = true;
    stripsRef.current.instanceMatrix.needsUpdate = true;
  }, [ringData, stripData]);

  return (
  <group>
    <instancedMesh ref={stripsRef} args={[null, null, stripData.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={new Color("#ffffff")}
        transparent
        opacity={0.65}
      />
    </instancedMesh>

    <mesh position={[0, -2.65, -88]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[16, 200]} />
      <meshBasicMaterial
        color={new Color("#05070b")}
        transparent
        opacity={0.45}
      />
    </mesh>
  </group>
);
}
