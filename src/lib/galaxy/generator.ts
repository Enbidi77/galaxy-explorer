import { GalaxyConfig, CelestialObject } from '../../types/astronomy';
import { mapRange } from '../utils';

export interface GeneratedGalaxyData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  offsets: Float32Array;
  specialObjects: CelestialObject[];
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateGalaxy(config: GalaxyConfig): GeneratedGalaxyData {
  const { starCount, spiralArms, spiralTightness, galaxyRadius, coreRadius, thickness, armWidth } = config;

  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const offsets = new Float32Array(starCount);
  const specialObjects: CelestialObject[] = [];

  const rand = seededRandom(1337);

  for (let i = 0; i < starCount; i++) {
    // Distance from center: dense core tapering toward outer edge
    const r = Math.pow(rand(), 2) * galaxyRadius;
    const isCore = r < coreRadius;

    let angle: number;
    if (isCore) {
      angle = rand() * Math.PI * 2;
    } else {
      const armSpread = (rand() - 0.5) * armWidth * (1 / (r + 0.1));
      const baseAngle = r * spiralTightness;
      const armIndex = Math.floor(rand() * spiralArms);
      angle = baseAngle + (armIndex * ((Math.PI * 2) / spiralArms)) + armSpread;
    }

    // Height distribution with vertical thickness variation
    const currentThickness = isCore ? thickness * 2 : thickness * (1 - r / galaxyRadius);
    const u1 = Math.max(rand(), 0.00001);
    const u2 = rand();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const y = randStdNormal * currentThickness * 0.5;

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Stellar color variation: warm yellow/red in core, young blue/cyan in spiral arms
    let rColor: number, gColor: number, bColor: number;

    if (r < coreRadius) {
      rColor = 1.0;
      gColor = mapRange(r, 0, coreRadius, 0.8, 0.9);
      bColor = mapRange(r, 0, coreRadius, 0.45, 0.7);
    } else {
      rColor = mapRange(r, coreRadius, galaxyRadius, 0.85, 0.5);
      gColor = mapRange(r, coreRadius, galaxyRadius, 0.85, 0.75);
      bColor = mapRange(r, coreRadius, galaxyRadius, 0.9, 1.0);
    }

    // Controlled color jitter
    rColor = Math.min(1.0, Math.max(0, rColor + (rand() * 0.15 - 0.075)));
    gColor = Math.min(1.0, Math.max(0, gColor + (rand() * 0.15 - 0.075)));
    bColor = Math.min(1.0, Math.max(0, bColor + (rand() * 0.15 - 0.075)));

    colors[i * 3] = rColor;
    colors[i * 3 + 1] = gColor;
    colors[i * 3 + 2] = bColor;

    // Star sizes
    let size = 0.5 + rand() * 1.5;
    if (rand() > 0.985) {
      size *= 2.8; // Bright supergiants
    }
    sizes[i] = size * (isCore ? 1.4 : 1.0);

    // Twinkling offset
    offsets[i] = rand();
  }

  return { positions, colors, sizes, offsets, specialObjects };
}
