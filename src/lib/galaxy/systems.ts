import { PlanetarySystem, CelestialObject } from '../../types/astronomy';

// Planets of the Solar System
export const solarSystemPlanets: CelestialObject[] = [
  {
    id: 'mercury',
    parentId: 'sol',
    name: 'Mercury',
    type: 'planet',
    position: [0, 0, 0], // Recomputed during rendering based on orbit
    size: 0.38, // Relative to Earth
    color: '#a8a8a8',
    description: 'The smallest planet in the Solar System and the closest to the Sun.',
    orbitalRadius: 10, // Scaled for visualization, actual 0.39 AU
    orbitalPeriod: 0.24,
    rotationPeriod: 58.6,
    temperature: 440 // Average
  },
  {
    id: 'venus',
    parentId: 'sol',
    name: 'Venus',
    type: 'planet',
    position: [0, 0, 0],
    size: 0.95,
    color: '#e0c090',
    description: 'The second planet from the Sun. It has a dense atmosphere consisting mainly of carbon dioxide.',
    orbitalRadius: 15,
    orbitalPeriod: 0.615,
    rotationPeriod: 243, // Retrograde
    temperature: 737
  },
  {
    id: 'earth',
    parentId: 'sol',
    name: 'Earth',
    type: 'planet',
    position: [0, 0, 0],
    size: 1.0,
    color: '#2b82c9',
    description: 'The third planet from the Sun and the only astronomical object known to harbor life.',
    orbitalRadius: 20, // 1 AU equivalent in viz
    orbitalPeriod: 1.0,
    rotationPeriod: 1.0,
    temperature: 288,
    mass: 0.000003 // Solar masses
  },
  {
    id: 'moon',
    parentId: 'earth',
    name: 'Moon',
    type: 'moon',
    position: [0, 0, 0],
    size: 0.27,
    color: '#d0d0d0',
    description: 'Earth\'s only natural satellite.',
    orbitalRadius: 1.5, // Relative to Earth in viz
    orbitalPeriod: 0.074, // ~27 days
    rotationPeriod: 27.3
  },
  {
    id: 'mars',
    parentId: 'sol',
    name: 'Mars',
    type: 'planet',
    position: [0, 0, 0],
    size: 0.53,
    color: '#c1440e',
    description: 'The fourth planet from the Sun, often referred to as the "Red Planet".',
    orbitalRadius: 28,
    orbitalPeriod: 1.88,
    rotationPeriod: 1.03,
    temperature: 210
  },
  {
    id: 'jupiter',
    parentId: 'sol',
    name: 'Jupiter',
    type: 'planet',
    position: [0, 0, 0],
    size: 11.2,
    color: '#d39c7e',
    description: 'The largest planet in the Solar System. A gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined.',
    orbitalRadius: 55,
    orbitalPeriod: 11.86,
    rotationPeriod: 0.41,
    temperature: 165,
    mass: 0.00095 // 317.8 Earth masses
  },
  {
    id: 'saturn',
    parentId: 'sol',
    name: 'Saturn',
    type: 'planet',
    position: [0, 0, 0],
    size: 9.45,
    color: '#ead6b8',
    description: 'The sixth planet from the Sun, known for its prominent ring system.',
    orbitalRadius: 85,
    orbitalPeriod: 29.46,
    rotationPeriod: 0.45,
    temperature: 134,
    metadata: {
      hasRings: true,
      ringInnerRadius: 12,
      ringOuterRadius: 22,
      ringColor: '#d8cbb3'
    }
  },
  {
    id: 'uranus',
    parentId: 'sol',
    name: 'Uranus',
    type: 'planet',
    position: [0, 0, 0],
    size: 4.0,
    color: '#4b70dd',
    description: 'The seventh planet from the Sun. It has a planetary ring system and numerous moons.',
    orbitalRadius: 130,
    orbitalPeriod: 84.01,
    rotationPeriod: 0.72,
    temperature: 76
  },
  {
    id: 'neptune',
    parentId: 'sol',
    name: 'Neptune',
    type: 'planet',
    position: [0, 0, 0],
    size: 3.88,
    color: '#274687',
    description: 'The eighth and farthest-known Solar planet from the Sun.',
    orbitalRadius: 170,
    orbitalPeriod: 164.8,
    rotationPeriod: 0.67,
    temperature: 72
  }
];

export const solarSystem: PlanetarySystem = {
  starId: 'sol',
  planets: solarSystemPlanets
};

export const systemsRecord: Record<string, PlanetarySystem> = {
  'sol': solarSystem
};
