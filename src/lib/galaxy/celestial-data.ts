import { CelestialObject } from '../../types/astronomy';
import { solarSystemPlanets } from './systems';

const SOL_POSITION: [number, number, number] = [120, 5, -80];

export const celestialObjects: CelestialObject[] = [
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A*',
    type: 'black-hole',
    position: [0, 0, 0], // Center of the galaxy in our coordinate system
    size: 25.0,
    color: '#000000',
    description: 'The supermassive black hole at the Galactic Center of the Milky Way. It has a mass of about 4.15 million times that of our Sun.',
    distance: 26673, // LY from Earth
    mass: 4154000,
    temperature: 0,
    metadata: {
      isDemoPosition: true,
      demoNote: 'Positioned at galactic origin [0,0,0] for scientific visualization.',
      realData: true
    }
  },
  {
    id: 'sol',
    name: 'Sol (The Sun)',
    type: 'star',
    position: SOL_POSITION, // Demo position in Orion arm
    size: 6.0,
    color: '#ffcc00',
    description: 'The star at the center of our Solar System. A nearly perfect sphere of hot plasma, sustaining all life on Earth through core hydrogen fusion.',
    distance: 0,
    temperature: 5778,
    mass: 1.0,
    spectralClass: 'G2V',
    magnitude: -26.74,
    metadata: {
      isDemoPosition: true,
      demoNote: 'Positioned in procedural Orion-Cygnus arm structure.',
      hasSystem: true,
      realData: true
    }
  },
  // Include planets with their Sol-relative positions for search and selection
  ...solarSystemPlanets.map(planet => ({
    ...planet,
    position: [
      SOL_POSITION[0] + (planet.orbitalRadius || 10) * 0.1,
      SOL_POSITION[1],
      SOL_POSITION[2]
    ] as [number, number, number],
    distance: 0, // In solar system
    metadata: {
      isDemoPosition: true,
      parentStar: 'sol',
      realData: true
    }
  })),
  {
    id: 'sirius',
    name: 'Sirius (Alpha Canis Majoris)',
    type: 'star',
    position: [126, 8, -74],
    size: 8.5,
    color: '#b0d0ff',
    description: 'The brightest star in Earth night sky. Sirius is a binary star system consisting of a main-sequence star (Sirius A) and a faint white dwarf companion (Sirius B).',
    distance: 8.6,
    temperature: 9940,
    mass: 2.02,
    spectralClass: 'A1V',
    magnitude: -1.46,
    metadata: {
      isDemoPosition: true,
      realData: true
    }
  },
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    type: 'star',
    position: [123, 4.2, -78],
    size: 2.0,
    color: '#ff4422',
    description: 'A small red dwarf star located 4.2465 light-years from the Sun in the constellation Centaurus. It is the closest known star to the Solar System.',
    distance: 4.2465,
    temperature: 3042,
    mass: 0.122,
    spectralClass: 'M5.5Ve',
    magnitude: 11.13,
    metadata: {
      isDemoPosition: true,
      realData: true
    }
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse (Alpha Orionis)',
    type: 'star',
    position: [150, 18, -130],
    size: 38.0,
    color: '#ff5500',
    description: 'A distinctively reddish semiregular pulsating variable star. It is one of the largest stars visible to the naked eye with a radius nearly 800 times that of the Sun.',
    distance: 642.5,
    temperature: 3500,
    mass: 16.5,
    spectralClass: 'M1-2Ia-ab',
    magnitude: 0.50,
    metadata: {
      isDemoPosition: true,
      realData: true
    }
  },
  {
    id: 'vega',
    name: 'Vega (Alpha Lyrae)',
    type: 'star',
    position: [135, -12, -60],
    size: 9.0,
    color: '#d0e0ff',
    description: 'The brightest star in the northern constellation of Lyra. Vega has been extensively studied and served as the baseline for the photometric brightness scale.',
    distance: 25.04,
    temperature: 9602,
    mass: 2.135,
    spectralClass: 'A0Va',
    magnitude: 0.03,
    metadata: {
      isDemoPosition: true,
      realData: true
    }
  },
  {
    id: 'polaris',
    name: 'Polaris (North Star)',
    type: 'star',
    position: [110, 45, -95],
    size: 14.0,
    color: '#fff5ea',
    description: 'The North Star or Pole Star, famous for holding nearly still in Earth northern sky while the entire northern sky moves around it. A multiple star system.',
    distance: 433,
    temperature: 6015,
    mass: 5.4,
    spectralClass: 'F7Ib',
    magnitude: 1.98,
    metadata: {
      isDemoPosition: true,
      realData: true
    }
  },
  {
    id: 'andromeda-galaxy',
    name: 'Andromeda Galaxy (M31)',
    type: 'galaxy',
    position: [1200, 450, 900],
    size: 180,
    color: '#eef4ff',
    description: 'A major barred spiral galaxy approximately 2.5 million light-years from Earth, and the nearest major spiral galaxy to the Milky Way.',
    distance: 2537000,
    temperature: 0,
    metadata: {
      isDemoPosition: true,
      demoNote: 'Position scaled down for in-engine navigation visibility.',
      realData: true
    }
  }
];
