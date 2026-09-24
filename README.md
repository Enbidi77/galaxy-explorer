# Galaxy Explorer — Interactive 3D Planetarium & Space Visualization

An immersive, scientifically inspired 3D galaxy exploration web application combining NASA-style astronomical data, Apple-level UI polish, and smooth WebGL rendering.

Built with **Next.js 16 (App Router)**, **React 19**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **@react-three/drei**, **@react-three/postprocessing**, **Zustand**, **Tailwind CSS**, and **Framer Motion**.

---

## Highlights & Features

### 🌌 1. Procedural 3D Galaxy Rendering
- **GPU-Accelerated Star Field**: 80,000+ stars generated algorithmically using a 4-arm logarithmic spiral model with central core concentration and vertical Gaussian disc thickness.
- **Custom GLSL Shader Pipeline**: Point size attenuation, realistic atmospheric twinkling with per-star offsets, and natural stellar temperature color gradients (cool red dwarfs, white main-sequence, hot blue-white giants).
- **Volumetric Nebulae**: Multi-spectral gas cloud particles with additive blending (purple, cyan, electric blue, and magenta emission clouds).
- **Light-Year Distance Grid**: Concentric distance reference rings (10 LY, 100 LY, 1,000 LY) with astrometric crosshairs.

### 🪐 2. Planetary Systems & Orbital Dynamics
- **Nested Exploration Hierarchy**: Smooth transitions from **GALAXY** &rarr; **SOLAR SYSTEM** &rarr; **PLANET**.
- **Sol & The Solar System**: Accurately scaled planetary orbits for Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.
- **Saturn Rings & Moons**: Translucent Keplerian ring systems and natural satellites (including Earth's Moon).
- **Procedural Asteroid Belt**: 400+ instanced asteroids orbiting between Mars and Jupiter with individual rotational vectors.
- **Configurable Orbital Speed**: Real-time time warp controls (`0.5x`, `1x`, `2x`, `4x`).

### 🔭 3. Camera Dynamics & Navigation
- **Free Exploration**: Intuitive orbit, pan, and zoom controls with momentum damping.
- **Focus Mode**: Cinematic camera interpolation with GSAP smoothly travelling to target celestial objects.
- **Cinematic Tour Mode**: Automated camera flythrough visiting key astronomical landmarks:
  - Galactic Core (*Sagittarius A\**)
  - Spiral Arm Star Clusters
  - Solar System & Earth
  - Sirius Binary System
  - Betelgeuse Red Supergiant
  - Milky Way Vista
- **First-Person Thruster Controls**: `W`, `A`, `S`, `D` forward/lateral movement, `Q`/`E` vertical translation, `R` camera reset, and `F` focus locked target.

### 📡 4. Search, Radar & HUD Telemetry
- **Futuristic Search (`Ctrl + K`)**: Instant partial search with arrow key navigation across stars, planets, nebulae, black holes, and galaxies.
- **Tactical 2D Galactic Radar**: Top-down minimap with real-time camera position indicator, spiral arm guides, and click-to-navigate targeting.
- **Scientific Instrument HUD**: Real-time display of total objects, active filter counts, light-year distances, and equatorial coordinates (**Right Ascension (RA)** & **Declination (DEC)**).
- **Command Palette (`Ctrl + P`)**: Quick action runner for toggling orbits, labels, nebulae, cinematic tour, and visual settings.

### 🎨 5. Glassmorphism Sci-Fi UI
- Near-black palette with electric blue, cyan, and subtle gold accents.
- Responsive design with desktop drawer panels and dedicated mobile bottom-sheets.
- Non-intrusive target lock and hyperdrive status banners (`TARGET LOCKED`, `NAVIGATING →`, `ENTERING SYSTEM`, `RETURNING TO GALAXY`).
- **Web Audio Ambient Space Synth**: Built-in cosmic ambient drone and pink noise generator (default: OFF).
- **Theme Profiles**: *Deep Space* & *Scientific*.
- **Performance Modes**: *Auto*, *High*, *Balanced*, and *Low* with dynamic particle scaling.

---

## Verified Astronomical Benchmark Objects

| Object | Type | Spectral Class | Real Distance | Temperature | Mass |
|---|---|---|---|---|---|
| **Sagittarius A\*** | Supermassive Black Hole | &mdash; | 26,673 LY | &mdash; | 4.15M M☉ |
| **Sol (The Sun)** | Yellow Dwarf | G2V | 0 LY | 5,778 K | 1.0 M☉ |
| **Earth** | Terrestrial Planet | &mdash; | 1.0 AU | 288 K | 1.0 M⊕ |
| **Mars** | Terrestrial Planet | &mdash; | 1.52 AU | 210 K | 0.107 M⊕ |
| **Jupiter** | Gas Giant | &mdash; | 5.20 AU | 165 K | 317.8 M⊕ |
| **Saturn** | Gas Giant (Rings) | &mdash; | 9.58 AU | 134 K | 95.2 M⊕ |
| **Sirius** | Binary Star | A1V | 8.60 LY | 9,940 K | 2.02 M☉ |
| **Proxima Centauri** | Red Dwarf | M5.5Ve | 4.24 LY | 3,042 K | 0.12 M☉ |
| **Betelgeuse** | Red Supergiant | M1-2Ia | 642.5 LY | 3,500 K | 16.5 M☉ |
| **Vega** | Main Sequence | A0Va | 25.04 LY | 9,602 K | 2.13 M☉ |
| **Polaris** | Multiple Star | F7Ib | 433 LY | 6,015 K | 5.4 M☉ |
| **Andromeda Galaxy (M31)**| Barred Spiral | &mdash; | 2.537M LY | &mdash; | ~1.5T M☉ |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `W` / `A` / `S` / `D` | Pan camera forward, left, backward, right |
| `Q` / `E` | Elevate camera up / down |
| `R` | Reset camera to grand galaxy overview |
| `F` | Focus camera on currently selected object |
| `L` | Toggle celestial text labels |
| `O` | Toggle planetary orbital paths |
| `C` | Toggle automated cinematic tour |
| `Ctrl + K` | Open cosmic search palette |
| `Ctrl + P` | Open action command palette |
| `Esc` | Close open overlays, search, or information panels |

---

## Installation & Setup

Ensure Node.js 18+ and `pnpm` are installed:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build production bundle
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) in any modern WebGL2-compatible browser (Chrome, Firefox, Safari, Edge).

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) with Turbopack
- **Language**: TypeScript 5.9 (Strict Mode)
- **3D Engine**: [Three.js](https://threejs.org/) + [React Three Fiber v9](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Post-Processing**: [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- **Animation**: [GSAP 3](https://greensock.com/gsap/) & [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with LocalStorage persistence
- **Sound**: Native Web Audio API
- **Icons**: [Lucide React](https://lucide.dev)
