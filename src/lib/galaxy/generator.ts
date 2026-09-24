import { GalaxyConfig, CelestialObject } from '../../types/astronomy';
import { mapRange } from '../utils';

export interface GeneratedGalaxyData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  specialObjects: CelestialObject[];
}

export function generateGalaxy(config: GalaxyConfig): GeneratedGalaxyData {
  const { starCount, spiralArms, spiralTightness, galaxyRadius, coreRadius, thickness, armWidth } = config;

  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const specialObjects: CelestialObject[] = [];

  for (let i = 0; i < starCount; i++) {
    // Distance from center
    // Most stars in core, tapering off towards edges
    const r = Math.pow(Math.random(), 2) * galaxyRadius;
    const isCore = r < coreRadius;

    let angle;
    if (isCore) {
      // Random angle in core
      angle = Math.random() * Math.PI * 2;
    } else {
      // Spiral arms
      const armOffset = (Math.random() * Math.PI * 2) / spiralArms;
      const baseAngle = r * spiralTightness;
      // Add randomness/spread to arms
      const armSpread = (Math.random() - 0.5) * armWidth * (1 / (r + 0.1));
      
      const armIndex = Math.floor(Math.random() * spiralArms);
      angle = baseAngle + (armIndex * ((Math.PI * 2) / spiralArms)) + armSpread;
    }

    // Height distribution (thickness)
    // Core is thicker, arms are thinner
    const currentThickness = isCore ? thickness * 2 : thickness * (1 - r / galaxyRadius);
    
    // Gaussian-like distribution for y axis
    const u1 = Math.random();
    const u2 = Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const y = randStdNormal * currentThickness * 0.5;

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Color distribution based on distance from center
    // Core: Yellow/Reddish, Arms: Blue/White
    let rColor, gColor, bColor;

    if (r < coreRadius) {
      // Warmer colors for older stars in core
      rColor = 1.0;
      gColor = mapRange(r, 0, coreRadius, 0.8, 0.9);
      bColor = mapRange(r, 0, coreRadius, 0.5, 0.7);
    } else {
      // Bluer colors for young stars in spiral arms
      rColor = mapRange(r, coreRadius, galaxyRadius, 0.8, 0.5);
      gColor = mapRange(r, coreRadius, galaxyRadius, 0.8, 0.7);
      bColor = mapRange(r, coreRadius, galaxyRadius, 0.9, 1.0);
    }

    // Add some random variation
    rColor = Math.min(1.0, Math.max(0, rColor + (Math.random() * 0.2 - 0.1)));
    gColor = Math.min(1.0, Math.max(0, gColor + (Math.random() * 0.2 - 0.1)));
    bColor = Math.min(1.0, Math.max(0, bColor + (Math.random() * 0.2 - 0.1)));

    colors[i * 3] = rColor;
    colors[i * 3 + 1] = gColor;
    colors[i * 3 + 2] = bColor;

    // Size variation
    let size = Math.random();
    // Rare big stars
    if (Math.random() > 0.99) {
      size *= 3.0;
    }
    sizes[i] = size * (isCore ? 1.5 : 1.0);
  }

  return { positions, colors, sizes, specialObjects };
}
