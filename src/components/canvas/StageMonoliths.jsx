import { useMemo, useRef } from "react";
import { Text } from "@react-three/drei";
import { AdditiveBlending, CanvasTexture, DoubleSide, MathUtils, SRGBColorSpace } from "three";
import { useFrame } from "@react-three/fiber";

const TEXTURE_WIDTH = 768;
const TEXTURE_HEIGHT = 384;

function hashSeed(value) {
  return value.split("").reduce((hash, char) => Math.imul(31, hash) + char.charCodeAt(0), 1779033703) >>> 0;
}

function createRandom(seedValue) {
  let seed = hashSeed(seedValue);

  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized.length === 3 ? normalized.replace(/(.)/g, "$1$1") : normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function lerpColor(start, end, alpha) {
  return {
    r: Math.round(MathUtils.lerp(start.r, end.r, alpha)),
    g: Math.round(MathUtils.lerp(start.g, end.g, alpha)),
    b: Math.round(MathUtils.lerp(start.b, end.b, alpha))
  };
}

function colorString(color, alpha = 1) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function addTextureNoise(ctx, width, height, seed, opacity = 0.08) {
  const random = createRandom(seed);
  const image = ctx.getImageData(0, 0, width, height);
  const { data } = image;

  for (let index = 0; index < data.length; index += 4) {
    const grain = (random() - 0.5) * 52 * opacity;
    data[index] = MathUtils.clamp(data[index] + grain, 0, 255);
    data[index + 1] = MathUtils.clamp(data[index + 1] + grain, 0, 255);
    data[index + 2] = MathUtils.clamp(data[index + 2] + grain, 0, 255);
  }

  ctx.putImageData(image, 0, 0);
}

function addPolarShade(ctx, width, height, opacity = 0.16) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `rgba(0,0,0,${opacity})`);
  gradient.addColorStop(0.18, "rgba(0,0,0,0)");
  gradient.addColorStop(0.82, "rgba(0,0,0,0)");
  gradient.addColorStop(1, `rgba(0,0,0,${opacity})`);

  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
}

function drawBandTexture(ctx, width, height, palette, seed, options = {}) {
  const random = createRandom(seed);

  for (let y = 0; y < height; y += 1) {
    const t = y / height;
    const wave = Math.sin(t * Math.PI * (options.frequency ?? 12) + random() * 0.18) * 0.08;
    const paletteIndex = Math.min(palette.length - 2, Math.floor((t + wave + 1) * palette.length) % palette.length);
    const local = (t * palette.length) % 1;
    const color = lerpColor(hexToRgb(palette[paletteIndex]), hexToRgb(palette[Math.min(paletteIndex + 1, palette.length - 1)]), local);

    ctx.fillStyle = colorString(color);
    ctx.fillRect(0, y, width, 1);
  }

  for (let i = 0; i < 34; i += 1) {
    const y = random() * height;
    const bandHeight = 2 + random() * (options.bandHeight ?? 14);
    ctx.fillStyle = `rgba(255,255,255,${0.025 + random() * 0.08})`;
    ctx.fillRect(0, y, width, bandHeight);
  }
}

function drawRockTexture(ctx, width, height, base, seed, craterColor = "#1f1d1b") {
  const random = createRandom(seed);
  const baseRgb = hexToRgb(base);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 680; i += 1) {
    const shade = Math.floor((random() - 0.5) * 42);
    ctx.fillStyle = `rgba(${MathUtils.clamp(baseRgb.r + shade, 0, 255)}, ${MathUtils.clamp(baseRgb.g + shade, 0, 255)}, ${MathUtils.clamp(baseRgb.b + shade, 0, 255)}, ${0.09 + random() * 0.2})`;
    ctx.fillRect(random() * width, random() * height, 1 + random() * 3, 1 + random() * 3);
  }

  for (let i = 0; i < 90; i += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = 4 + random() * 28;
    const gradient = ctx.createRadialGradient(x, y, radius * 0.12, x, y, radius);

    gradient.addColorStop(0, `rgba(255,255,255,${0.06 + random() * 0.12})`);
    gradient.addColorStop(0.45, `rgba(0,0,0,${0.04 + random() * 0.12})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  addTextureNoise(ctx, width, height, `${seed}-fine-grain`, 0.9);
  addPolarShade(ctx, width, height, 0.1);
}

function drawEarthTexture(ctx, width, height) {
  const ocean = ctx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, "#092a62");
  ocean.addColorStop(0.45, "#0b5fa3");
  ocean.addColorStop(1, "#061b44");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  const continents = [
    [0.2, 0.42, 0.16, 0.18],
    [0.34, 0.58, 0.12, 0.2],
    [0.52, 0.38, 0.2, 0.16],
    [0.66, 0.56, 0.16, 0.22],
    [0.82, 0.34, 0.14, 0.14]
  ];

  continents.forEach(([cx, cy, sx, sy], continentIndex) => {
    ctx.fillStyle = continentIndex % 2 === 0 ? "#4b8d54" : "#8a7b45";
    ctx.beginPath();
    for (let i = 0; i <= 18; i += 1) {
      const angle = (i / 18) * Math.PI * 2;
      const wobble = 0.72 + Math.sin(i * 1.7 + continentIndex) * 0.18 + Math.cos(i * 2.3) * 0.12;
      const x = (cx + Math.cos(angle) * sx * wobble) * width;
      const y = (cy + Math.sin(angle) * sy * wobble) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(216, 191, 129, 0.34)";
    ctx.fillRect((cx - sx * 0.35) * width, (cy + sy * 0.16) * height, sx * width * 0.36, sy * height * 0.12);
  });

  const islandRandom = createRandom("earth-islands");
  for (let i = 0; i < 80; i += 1) {
    const x = islandRandom() * width;
    const y = (0.18 + islandRandom() * 0.64) * height;
    const radius = 1.5 + islandRandom() * 6;
    ctx.fillStyle = islandRandom() > 0.5 ? "rgba(72, 129, 78, 0.64)" : "rgba(139, 124, 72, 0.55)";
    ctx.beginPath();
    ctx.ellipse(x, y, radius * (1.2 + islandRandom()), radius * 0.6, islandRandom() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.fillRect(0, 0, width, height * 0.085);
  ctx.fillRect(0, height * 0.915, width, height * 0.085);

  addTextureNoise(ctx, width, height, "earth-water-detail", 0.58);
  addPolarShade(ctx, width, height, 0.08);
}

function drawCloudTexture(ctx, width, height, seed = "clouds", opacity = 0.34) {
  const random = createRandom(seed);
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < 70; i += 1) {
    const x = random() * width;
    const y = random() * height;
    const radiusX = 28 + random() * 110;
    const radiusY = 4 + random() * 18;
    ctx.fillStyle = `rgba(255,255,255,${opacity * (0.18 + random() * 0.5)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, random() * 0.6 - 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlanetTexture(ctx, width, height, stop) {
  switch (stop.id) {
    case "sun": {
      drawBandTexture(ctx, width, height, ["#8b2c16", "#ff7b26", "#ffd27a", "#fff0a8"], "sun", { frequency: 16, bandHeight: 18 });
      const gradient = ctx.createRadialGradient(width * 0.42, height * 0.42, 10, width * 0.5, height * 0.5, width * 0.5);
      gradient.addColorStop(0, "rgba(255,255,220,0.75)");
      gradient.addColorStop(0.48, "rgba(255,170,58,0.22)");
      gradient.addColorStop(1, "rgba(120,34,12,0.18)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case "mercury":
      drawRockTexture(ctx, width, height, "#8f8780", "mercury", "#1b1917");
      break;
    case "venus":
      drawBandTexture(ctx, width, height, ["#6d4c2d", "#b9854c", "#e8bd7b", "#f2d6a2"], "venus", { frequency: 9, bandHeight: 22 });
      drawCloudTexture(ctx, width, height, "venus-cloud", 0.42);
      break;
    case "earth":
      drawEarthTexture(ctx, width, height);
      break;
    case "mars":
      drawRockTexture(ctx, width, height, "#a4472f", "mars", "#42170f");
      ctx.fillStyle = "rgba(70, 24, 18, 0.32)";
      ctx.fillRect(width * 0.12, height * 0.48, width * 0.5, height * 0.06);
      ctx.fillRect(width * 0.54, height * 0.34, width * 0.32, height * 0.045);
      ctx.fillStyle = "rgba(245, 229, 206, 0.72)";
      ctx.fillRect(0, 0, width, height * 0.045);
      ctx.fillRect(0, height * 0.955, width, height * 0.045);
      break;
    case "jupiter":
      drawBandTexture(ctx, width, height, ["#5a3829", "#b77a4c", "#e1bd8a", "#f4dfba", "#8f5236"], "jupiter", { frequency: 18, bandHeight: 24 });
      for (let i = 0; i < 11; i += 1) {
        const y = height * (0.18 + i * 0.065);
        ctx.strokeStyle = `rgba(255, 238, 201, ${0.12 + (i % 2) * 0.08})`;
        ctx.lineWidth = 2 + (i % 3);
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= width; x += 20) {
          ctx.lineTo(x, y + Math.sin(x * 0.018 + i) * 7);
        }
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(177, 67, 40, 0.82)";
      ctx.beginPath();
      ctx.ellipse(width * 0.72, height * 0.56, width * 0.09, height * 0.055, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,220,180,0.5)";
      ctx.lineWidth = 4;
      ctx.stroke();
      addTextureNoise(ctx, width, height, "jupiter-granular-clouds", 0.48);
      break;
    case "saturn":
      drawBandTexture(ctx, width, height, ["#82663e", "#d0b377", "#f2d79b", "#b9965f"], "saturn", { frequency: 10, bandHeight: 16 });
      addTextureNoise(ctx, width, height, "saturn-soft-detail", 0.34);
      break;
    case "uranus":
      drawBandTexture(ctx, width, height, ["#4aa4aa", "#83d8df", "#c3fbff", "#6ccbd3"], "uranus", { frequency: 6, bandHeight: 10 });
      addTextureNoise(ctx, width, height, "uranus-ice-haze", 0.22);
      break;
    case "neptune":
      drawBandTexture(ctx, width, height, ["#071d64", "#1646b7", "#3d7dff", "#092e88"], "neptune", { frequency: 9, bandHeight: 12 });
      ctx.fillStyle = "rgba(180, 220, 255, 0.42)";
      ctx.beginPath();
      ctx.ellipse(width * 0.66, height * 0.42, width * 0.08, height * 0.025, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(12, 24, 82, 0.45)";
      ctx.beginPath();
      ctx.ellipse(width * 0.44, height * 0.62, width * 0.06, height * 0.025, 0.18, 0, Math.PI * 2);
      ctx.fill();
      addTextureNoise(ctx, width, height, "neptune-deep-atmosphere", 0.3);
      break;
    case "pluto":
      drawRockTexture(ctx, width, height, "#a9998e", "pluto", "#3e332e");
      ctx.fillStyle = "rgba(220, 185, 154, 0.42)";
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.46, width * 0.16, height * 0.09, 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(120, 86, 70, 0.22)";
      ctx.beginPath();
      ctx.ellipse(width * 0.58, height * 0.56, width * 0.06, height * 0.04, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      drawRockTexture(ctx, width, height, stop.color, stop.id, "#1b1b1b");
  }
}

function createPlanetTexture(stop) {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext("2d");

  drawPlanetTexture(ctx, canvas.width, canvas.height, stop);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createCloudTexture(stop) {
  if (typeof document === "undefined" || stop.id !== "earth") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext("2d");

  drawCloudTexture(ctx, canvas.width, canvas.height, "earth-clouds", 0.42);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createRingTexture(stop) {
  if (typeof document === "undefined" || !stop.ring) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const random = createRandom(`${stop.id}-rings`);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < canvas.width; x += 1) {
    const t = x / canvas.width;
    const gap = stop.id === "saturn" && t > 0.56 && t < 0.61;
    const alpha = gap ? 0.04 : 0.28 + Math.sin(t * Math.PI * 18) * 0.08 + random() * 0.06;
    const color = stop.id === "saturn" ? `rgba(245, 214, 156, ${alpha})` : `rgba(160, 242, 255, ${alpha * 0.65})`;
    ctx.fillStyle = color;
    ctx.fillRect(x, 0, 1, canvas.height);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export const PLANET_STOPS = [
  {
    id: "sun",
    label: "SUN",
    position: [4.05, -0.55, -7],
    radius: 1.42,
    camera: [0, 1.26, 9.2],
    lookAt: [1.18, -0.02, -7],
    roll: 0,
    color: "#ffb45f",
    accent: "#ff7a2f",
    emissive: 2.6
  },
  {
    id: "mercury",
    label: "MERCURY",
    position: [1.45, 0.08, -25],
    radius: 0.28,
    camera: [0.08, 1.32, -13.4],
    lookAt: [1.35, 0.1, -25],
    roll: -0.01,
    color: "#9c9188",
    accent: "#c8beb6",
    emissive: 0.14
  },
  {
    id: "venus",
    label: "VENUS",
    position: [-1.45, 0.18, -44],
    radius: 0.46,
    camera: [-0.18, 1.54, -32.2],
    lookAt: [-1.36, 0.18, -44],
    roll: 0.014,
    color: "#d9aa69",
    accent: "#ffcd8b",
    emissive: 0.18
  },
  {
    id: "earth",
    label: "EARTH",
    position: [1.36, 0.3, -64],
    radius: 0.52,
    camera: [0.16, 1.78, -52],
    lookAt: [1.28, 0.3, -64],
    roll: -0.015,
    color: "#347dcc",
    accent: "#62e3ff",
    emissive: 0.24,
    moon: true
  },
  {
    id: "mars",
    label: "MARS",
    position: [-1.35, 0.44, -84],
    radius: 0.39,
    camera: [-0.1, 2.0, -72.1],
    lookAt: [-1.28, 0.44, -84],
    roll: 0.012,
    color: "#bf5139",
    accent: "#ff815f",
    emissive: 0.16
  },
  {
    id: "jupiter",
    label: "JUPITER",
    position: [1.75, 0.64, -110],
    radius: 1.02,
    camera: [0.18, 2.28, -96.8],
    lookAt: [1.54, 0.64, -110],
    roll: -0.018,
    color: "#c9966d",
    accent: "#ffd19b",
    emissive: 0.12
  },
  {
    id: "saturn",
    label: "SATURN",
    position: [-1.82, 0.88, -138],
    radius: 0.82,
    camera: [-0.18, 2.66, -124.6],
    lookAt: [-1.58, 0.88, -138],
    roll: 0.018,
    color: "#d8bd82",
    accent: "#ffe2a7",
    emissive: 0.14,
    ring: true
  },
  {
    id: "uranus",
    label: "URANUS",
    position: [1.32, 1.1, -166],
    radius: 0.58,
    camera: [0.06, 3.08, -153.4],
    lookAt: [1.2, 1.1, -166],
    roll: -0.012,
    color: "#85d7df",
    accent: "#9af5ff",
    emissive: 0.2,
    ring: true,
    ringTilt: 1.75
  },
  {
    id: "neptune",
    label: "NEPTUNE",
    position: [-1.28, 1.32, -192],
    radius: 0.62,
    camera: [-0.08, 3.46, -179.6],
    lookAt: [-1.18, 1.32, -192],
    roll: 0.01,
    color: "#285cce",
    accent: "#77a5ff",
    emissive: 0.28
  },
  {
    id: "pluto",
    label: "PLUTO",
    position: [0.85, 1.52, -218],
    radius: 0.2,
    camera: [0.18, 3.9, -207],
    lookAt: [0.82, 1.52, -218],
    roll: -0.006,
    color: "#b7a79a",
    accent: "#e8d5c6",
    emissive: 0.16,
    plutoLine: "Pluto: not a planet, still the main character."
  }
];

function PlanetLabel({ stop, activeRef, isPluto }) {
  const textRef = useRef(null);

  useFrame(() => {
    if (!textRef.current) {
      return;
    }

    textRef.current.material.opacity = isPluto ? Math.max(0, activeRef.current - 0.15) : 0.12 + activeRef.current * 0.45;
  });

  return (
    <Text
      ref={textRef}
      position={isPluto ? [0.52, 0.34, 0.04] : [0, stop.radius + 0.54, 0.04]}
      fontSize={isPluto ? 0.13 : 0.16}
      letterSpacing={isPluto ? 0.01 : 0.06}
      anchorX={isPluto ? "left" : "center"}
      anchorY="middle"
      maxWidth={isPluto ? 5 : 1.8}
    >
      {isPluto ? stop.plutoLine : stop.label}
      <meshBasicMaterial color={isPluto ? "#ffe2c2" : stop.accent} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
    </Text>
  );
}

function Planet({ stop, index, sceneStateRef, isMobile }) {
  const groupRef = useRef(null);
  const planetRef = useRef(null);
  const cloudRef = useRef(null);
  const activeRef = useRef(index === 0 ? 1 : 0);
  const materialRef = useRef(null);
  const glowMaterialRef = useRef(null);
  const lightRef = useRef(null);
  const isPluto = stop.id === "pluto";
  const planetTexture = useMemo(() => createPlanetTexture(stop), [stop]);
  const cloudTexture = useMemo(() => createCloudTexture(stop), [stop]);
  const ringTexture = useMemo(() => createRingTexture(stop), [stop]);
  const moonTexture = useMemo(() => (stop.moon ? createPlanetTexture({ id: "moon", color: "#b9c0c9" }) : null), [stop]);
  const bumpScale = stop.id === "sun" ? 0 : stop.id === "jupiter" || stop.id === "saturn" ? 0.006 : 0.02;
  const glowScale = stop.id === "sun" ? 1.34 : 1.15;
  const axialTilt = {
    venus: 0.08,
    earth: -0.41,
    mars: -0.44,
    jupiter: -0.05,
    saturn: -0.47,
    uranus: 1.32,
    neptune: -0.49,
    pluto: -1.05
  }[stop.id] ?? 0;
  const atmosphereColor = {
    venus: "#ffdca8",
    earth: "#78dfff",
    uranus: "#b8fbff",
    neptune: "#7fa8ff"
  }[stop.id];

  useFrame((state, delta) => {
    const activeIndex = sceneStateRef.current.activePlanet ?? 0;
    const finalProgress = sceneStateRef.current.progress ?? 0;
    const target = isPluto ? (finalProgress > 0.955 ? 1 : 0) : activeIndex === index ? 1 : 0;
    activeRef.current = MathUtils.lerp(activeRef.current, target, 1 - Math.pow(0.006, delta));
    const active = activeRef.current;

    if (groupRef.current) {
      groupRef.current.position.y = stop.position[1] + Math.sin(state.clock.elapsedTime * 0.35 + index) * 0.025;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * (stop.id === "sun" ? 0.08 : 0.22 + index * 0.015);
      planetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12 + index) * 0.025;
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.28;
      cloudRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.018;
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = stop.emissive + active * (stop.id === "sun" ? 1.2 : 0.08);
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = (stop.id === "sun" ? 0.18 : 0.025) + active * (stop.id === "sun" ? 0.18 : 0.1);
    }

    if (lightRef.current) {
      lightRef.current.intensity = (stop.id === "sun" ? 2.4 : 0.18) + active * (stop.id === "sun" ? 2.2 : 1.35);
    }
  });

  const mobileScale = isMobile ? 0.78 : 1;

  return (
    <group ref={groupRef} position={stop.position} scale={mobileScale}>
      <pointLight ref={lightRef} position={[0, 0.4, 0.6]} color={stop.accent} intensity={index === 0 ? 4 : 0.2} distance={stop.id === "sun" ? 26 : 9} decay={2} />

      <mesh ref={planetRef} rotation={[0, 0, axialTilt]}>
        <sphereGeometry args={[stop.radius, 72, 48]} />
        <meshStandardMaterial
          ref={materialRef}
          map={planetTexture ?? undefined}
          color="#ffffff"
          emissive={stop.accent}
          emissiveIntensity={stop.emissive}
          metalness={stop.id === "sun" ? 0 : 0.025}
          roughness={stop.id === "earth" ? 0.5 : stop.id === "sun" ? 0.38 : 0.78}
          bumpMap={stop.id === "sun" ? undefined : planetTexture ?? undefined}
          bumpScale={bumpScale}
        />
      </mesh>

      {cloudTexture && (
        <mesh ref={cloudRef} scale={[1.018, 1.018, 1.018]} rotation={[0, 0, axialTilt]}>
          <sphereGeometry args={[stop.radius, 72, 48]} />
          <meshBasicMaterial map={cloudTexture} transparent opacity={0.32} depthWrite={false} />
        </mesh>
      )}

      {atmosphereColor && (
        <mesh scale={[1.055, 1.055, 1.055]}>
          <sphereGeometry args={[stop.radius, 64, 40]} />
          <meshBasicMaterial color={atmosphereColor} transparent opacity={0.045} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
      )}

      <mesh scale={[glowScale, glowScale, glowScale]}>
        <sphereGeometry args={[stop.radius, 64, 40]} />
        <meshBasicMaterial ref={glowMaterialRef} color={stop.accent} transparent opacity={stop.id === "sun" ? 0.24 : 0.06} depthWrite={false} blending={AdditiveBlending} />
      </mesh>

      {stop.ring && (
        <mesh rotation={[stop.ringTilt ?? 1.18, 0.2, 0.12]}>
          <ringGeometry args={[stop.radius * 1.25, stop.radius * 2.12, 160]} />
          <meshBasicMaterial
            map={ringTexture ?? undefined}
            color="#ffffff"
            transparent
            opacity={stop.id === "saturn" ? 0.78 : 0.42}
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      )}

      {stop.moon && (
        <mesh position={[0.92, 0.18, 0.08]}>
          <sphereGeometry args={[0.11, 32, 20]} />
          <meshStandardMaterial map={moonTexture ?? undefined} color="#ffffff" emissive="#dfeaff" emissiveIntensity={0.1} roughness={0.82} bumpMap={moonTexture ?? undefined} bumpScale={0.012} />
        </mesh>
      )}

      {stop.id !== "sun" && <PlanetLabel stop={stop} activeRef={activeRef} isPluto={isPluto} />}
    </group>
  );
}

export default function StageMonoliths({ sceneStateRef, isMobile = false }) {
  return (
    <group>
      {PLANET_STOPS.map((stop, index) => (
        <Planet key={stop.id} stop={stop} index={index} sceneStateRef={sceneStateRef} isMobile={isMobile} />
      ))}
    </group>
  );
}
