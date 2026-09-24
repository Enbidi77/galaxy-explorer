export type PlanetType = 'terrestrial' | 'gas-giant' | 'ice-giant' | 'moon';

export interface PlanetDefinition {
  id: string;
  name: string;
  type: PlanetType;
  radius: number; // Visual radius for balanced astronomical exploration
  physicalRadiusKm: number; // Real physical radius
  orbitalRadius: number; // Visual AU scaled units
  orbitalPeriod: number; // Earth years
  rotationSpeed: number; // Radians per sec multiplier
  axialTilt: number; // Degrees
  parentId?: string;
  description: string;
  textures: {
    map: string;
    normalMap?: string;
    roughnessMap?: string;
    specularMap?: string;
    displacementMap?: string;
    cloudsMap?: string;
    nightMap?: string;
    atmosphereMap?: string;
  };
  atmosphere?: {
    enabled: boolean;
    color: string;
    density: number;
    scatteringStrength: number;
  };
  clouds?: {
    enabled: boolean;
    rotationSpeed: number;
    opacity: number;
  };
  nightLights?: {
    enabled: boolean;
  };
  rings?: {
    enabled: boolean;
    texture?: string;
    innerRadius: number;
    outerRadius: number;
  };
  material?: {
    roughness: number;
    metalness: number;
  };
  scientific: {
    massKg: string;
    surfaceTempK: number;
    atmosphereComposition: string;
    moonsCount: number;
    surfaceType: string;
  };
}

export const SOLAR_SYSTEM_PLANETS: PlanetDefinition[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'terrestrial',
    radius: 0.65,
    physicalRadiusKm: 2439.7,
    orbitalRadius: 14,
    orbitalPeriod: 0.241,
    rotationSpeed: 0.04,
    axialTilt: 0.034,
    parentId: 'sol',
    description: 'The smallest planet in the Solar System and closest to the Sun. Its heavily cratered, airless surface undergoes extreme temperature swings.',
    textures: {
      map: '/textures/planets/mercury.jpg',
      normalMap: '/textures/planets/moon-bump.jpg',
    },
    material: {
      roughness: 0.9,
      metalness: 0.05,
    },
    scientific: {
      massKg: '3.301 × 10²³',
      surfaceTempK: 440,
      atmosphereComposition: 'Trace (Oxygen, Sodium, Hydrogen)',
      moonsCount: 0,
      surfaceType: 'Silicate Crust & Impact Basins',
    },
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'terrestrial',
    radius: 1.1,
    physicalRadiusKm: 6051.8,
    orbitalRadius: 22,
    orbitalPeriod: 0.615,
    rotationSpeed: -0.015, // Retrograde rotation
    axialTilt: 177.3,
    parentId: 'sol',
    description: 'Second planet from the Sun, enveloped in an ultra-dense, toxic carbon dioxide atmosphere with sulfuric acid cloud banks causing a runaway greenhouse effect.',
    textures: {
      map: '/textures/planets/venus.jpg',
    },
    atmosphere: {
      enabled: true,
      color: '#e6c891',
      density: 1.25,
      scatteringStrength: 1.4,
    },
    material: {
      roughness: 0.6,
      metalness: 0.02,
    },
    scientific: {
      massKg: '4.867 × 10²⁴',
      surfaceTempK: 737,
      atmosphereComposition: '96.5% CO₂, 3.5% N₂',
      moonsCount: 0,
      surfaceType: 'Volcanic Plains & Highlands',
    },
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'terrestrial',
    radius: 1.2,
    physicalRadiusKm: 6371.0,
    orbitalRadius: 32,
    orbitalPeriod: 1.0,
    rotationSpeed: 0.5,
    axialTilt: 23.44,
    parentId: 'sol',
    description: 'The third planet from the Sun and the only astronomical body confirmed to harbor life, with liquid water oceans covering 71% of its surface.',
    textures: {
      map: '/textures/planets/earth-day.jpg',
      normalMap: '/textures/planets/earth-normal.jpg',
      specularMap: '/textures/planets/earth-specular.jpg',
      cloudsMap: '/textures/planets/earth-clouds.png',
      nightMap: '/textures/planets/earth-night.jpg',
    },
    atmosphere: {
      enabled: true,
      color: '#4fa8ff',
      density: 1.15,
      scatteringStrength: 1.6,
    },
    clouds: {
      enabled: true,
      rotationSpeed: 0.58, // Independent cloud drift
      opacity: 0.85,
    },
    nightLights: {
      enabled: true,
    },
    material: {
      roughness: 0.45,
      metalness: 0.05,
    },
    scientific: {
      massKg: '5.972 × 10²⁴',
      surfaceTempK: 288,
      atmosphereComposition: '78.08% N₂, 20.95% O₂, 0.93% Ar',
      moonsCount: 1,
      surfaceType: '71% Ocean, Continents & Ice Caps',
    },
  },
  {
    id: 'moon',
    name: 'Moon (Luna)',
    type: 'moon',
    radius: 0.45,
    physicalRadiusKm: 1737.4,
    orbitalRadius: 3.2, // Offset from Earth in local coordinates
    orbitalPeriod: 0.0748, // 27.3 days
    rotationSpeed: 0.05, // Tidally locked
    axialTilt: 1.54,
    parentId: 'earth',
    description: "Earth's only permanent natural satellite. Characterized by dark basaltic lunar maria, bright anorthosite highlands, and prominent impact craters.",
    textures: {
      map: '/textures/planets/moon.jpg',
      normalMap: '/textures/planets/moon-bump.jpg',
    },
    material: {
      roughness: 0.95,
      metalness: 0.0,
    },
    scientific: {
      massKg: '7.342 × 10²²',
      surfaceTempK: 220,
      atmosphereComposition: 'None (Hard Vacuum Exosphere)',
      moonsCount: 0,
      surfaceType: 'Cratered Anorthosite Regolith',
    },
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'terrestrial',
    radius: 0.8,
    physicalRadiusKm: 3389.5,
    orbitalRadius: 44,
    orbitalPeriod: 1.881,
    rotationSpeed: 0.48,
    axialTilt: 25.19,
    parentId: 'sol',
    description: 'The Red Planet, colored by iron oxide dust across its surface. Home to Olympus Mons (the largest volcano in the Solar System) and Valles Marineris canyon.',
    textures: {
      map: '/textures/planets/mars.jpg',
      normalMap: '/textures/planets/moon-bump.jpg',
    },
    atmosphere: {
      enabled: true,
      color: '#c29774',
      density: 0.45,
      scatteringStrength: 0.8,
    },
    material: {
      roughness: 0.85,
      metalness: 0.08,
    },
    scientific: {
      massKg: '6.417 × 10²³',
      surfaceTempK: 210,
      atmosphereComposition: '95.3% CO₂, 2.6% N₂, 1.9% Ar',
      moonsCount: 2,
      surfaceType: 'Iron Oxide Basalt & Polar Dry Ice',
    },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'gas-giant',
    radius: 2.8,
    physicalRadiusKm: 69911,
    orbitalRadius: 62,
    orbitalPeriod: 11.86,
    rotationSpeed: 1.15, // Fast 9.9 hour day
    axialTilt: 3.13,
    parentId: 'sol',
    description: 'The largest planet in the Solar System, more than twice as massive as all other planets combined. Famous for its ammonia cloud bands and Great Red Spot anticyclone.',
    textures: {
      map: '/textures/planets/jupiter.jpg',
    },
    atmosphere: {
      enabled: true,
      color: '#d4b791',
      density: 0.7,
      scatteringStrength: 1.1,
    },
    material: {
      roughness: 0.65,
      metalness: 0.0,
    },
    scientific: {
      massKg: '1.898 × 10²⁷',
      surfaceTempK: 165,
      atmosphereComposition: '89.8% H₂, 10.2% He',
      moonsCount: 95,
      surfaceType: 'Gas Fluid (No Solid Surface)',
    },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'gas-giant',
    radius: 2.3,
    physicalRadiusKm: 58232,
    orbitalRadius: 82,
    orbitalPeriod: 29.46,
    rotationSpeed: 1.05,
    axialTilt: 26.73,
    parentId: 'sol',
    description: 'A gas giant renowned for its spectacular, highly reflective ring system consisting of countlessly orbiting water ice boulders, dust, and rock fragments.',
    textures: {
      map: '/textures/planets/saturn.jpg',
    },
    atmosphere: {
      enabled: true,
      color: '#dfcaa0',
      density: 0.65,
      scatteringStrength: 0.95,
    },
    rings: {
      enabled: true,
      texture: '/textures/planets/saturn-rings.png',
      innerRadius: 3.2,
      outerRadius: 6.8,
    },
    material: {
      roughness: 0.7,
      metalness: 0.0,
    },
    scientific: {
      massKg: '5.683 × 10²⁶',
      surfaceTempK: 134,
      atmosphereComposition: '96.3% H₂, 3.25% He',
      moonsCount: 146,
      surfaceType: 'Hydrogen-Helium Atmosphere & Ring System',
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'ice-giant',
    radius: 1.7,
    physicalRadiusKm: 25362,
    orbitalRadius: 104,
    orbitalPeriod: 84.01,
    rotationSpeed: -0.65,
    axialTilt: 97.77, // Extreme sideways tilt
    parentId: 'sol',
    description: 'An ice giant planet with a cyan hue caused by methane absorption in its upper atmosphere. Rotates nearly on its side with extreme seasons.',
    textures: {
      map: '/textures/planets/uranus.jpg',
    },
    atmosphere: {
      enabled: true,
      color: '#8bd6df',
      density: 0.85,
      scatteringStrength: 1.3,
    },
    material: {
      roughness: 0.55,
      metalness: 0.02,
    },
    scientific: {
      massKg: '8.681 × 10²⁵',
      surfaceTempK: 76,
      atmosphereComposition: '83% H₂, 15% He, 2.3% CH₄',
      moonsCount: 28,
      surfaceType: 'Water, Ammonia & Methane Mantle',
    },
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'ice-giant',
    radius: 1.65,
    physicalRadiusKm: 24622,
    orbitalRadius: 126,
    orbitalPeriod: 164.8,
    rotationSpeed: 0.72,
    axialTilt: 28.32,
    parentId: 'sol',
    description: 'The outermost major planet in the Solar System. A vivid azure ice giant whipped by supersonic winds reaching 2,100 km/h and dark storm vortices.',
    textures: {
      map: '/textures/planets/neptune.jpg',
    },
    atmosphere: {
      enabled: true,
      color: '#3466d6',
      density: 0.95,
      scatteringStrength: 1.4,
    },
    material: {
      roughness: 0.5,
      metalness: 0.02,
    },
    scientific: {
      massKg: '1.024 × 10²⁶',
      surfaceTempK: 72,
      atmosphereComposition: '80% H₂, 19% He, 1.5% CH₄',
      moonsCount: 16,
      surfaceType: 'Dense Icy Mantle & Supersonic Atmosphere',
    },
  },
];

export const PLANETS_BY_ID: Record<string, PlanetDefinition> = SOLAR_SYSTEM_PLANETS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<string, PlanetDefinition>);
