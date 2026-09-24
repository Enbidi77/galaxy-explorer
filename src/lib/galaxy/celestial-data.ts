import { CelestialObject } from '../../types/astronomy';

export const celestialObjects: CelestialObject[] = [
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A*',
    type: 'black-hole',
    position: [0, 0, 0], // Center of the galaxy in our coordinate system
    size: 25.0,
    color: '#000000',
    description: 'The supermassive black hole at the Galactic Center of the Milky Way. It has a mass of about 4 million times that of our Sun.',
    distance: 26673, // LY from Earth (demo position adjustment notwithstanding)
    mass: 4000000,
    metadata: {
      isDemoPosition: true,
      demoNote: 'Located at coordinate origin for visualization purposes.'
    }
  },
  {
    id: 'sol',
    name: 'Sol (The Sun)',
    type: 'star',
    position: [120, 5, -80], // Demo position in a spiral arm
    size: 5.0,
    color: '#ffcc00',
    description: 'The star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
    distance: 0,
    temperature: 5778,
    mass: 1,
    spectralClass: 'G2V',
    magnitude: -26.74,
    metadata: {
      isDemoPosition: true
    }
  },
  {
    id: 'sirius',
    name: 'Sirius',
    type: 'star',
    position: [122, 6, -78], // Relative to Sol
    size: 8.5,
    color: '#b0d0ff',
    description: 'The brightest star in the night sky. Sirius is a binary star system, though usually referred to as a single star.',
    distance: 8.6,
    temperature: 9940,
    mass: 2.02,
    spectralClass: 'A1V',
    magnitude: -1.46,
    metadata: {
      isDemoPosition: true
    }
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    type: 'star',
    position: [140, 15, -120], // Relative to Sol
    size: 45.0, // Red supergiant
    color: '#ff5500',
    description: 'A red supergiant of spectral type M1-2 and one of the largest stars visible to the naked eye.',
    distance: 724,
    temperature: 3500,
    mass: 16.5,
    spectralClass: 'M1-2',
    magnitude: 0.42,
    metadata: {
      isDemoPosition: true
    }
  },
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    type: 'star',
    position: [120.5, 4.8, -80.2], // Very close to Sol
    size: 1.5,
    color: '#ff2200', // Red dwarf
    description: 'A small, low-mass star located 4.2465 light-years away from the Sun in the southern constellation of Centaurus.',
    distance: 4.24,
    temperature: 3042,
    mass: 0.122,
    spectralClass: 'M5.5Ve',
    magnitude: 11.13,
    metadata: {
      isDemoPosition: true
    }
  },
  {
    id: 'andromeda-galaxy',
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    position: [5000, 2000, 4000], // Far outside the Milky Way visualization
    size: 500,
    color: '#ffffff',
    description: 'A barred spiral galaxy approximately 2.5 million light-years from Earth, and the nearest major galaxy to the Milky Way.',
    distance: 2537000,
    metadata: {
      isDemoPosition: true
    }
  }
];
