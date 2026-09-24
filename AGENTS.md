<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Galaxy Explorer Agent Architecture & Guidelines

This document provides architectural guidance for AI agents and developers working on the **Galaxy Explorer** 3D web application.

## High-Level Architecture

The project cleanly separates rendering, state, data, and UI logic:

```
src/
├── components/
│   ├── galaxy/                 # 3D Graphics layer (Three.js / React Three Fiber)
│   │   ├── GalaxyCanvas.tsx    # WebGL canvas container & ErrorBoundary
│   │   ├── GalaxyScene.tsx     # Scene composition & lighting
│   │   ├── StarField.tsx       # GPU points with custom GLSL twinkling shaders
│   │   ├── Nebula.tsx          # Volumetric multi-spectral gas particle clouds
│   │   ├── InteractiveStar.tsx # High-detail emissive stellar bodies with glow
│   │   ├── PlanetSystem.tsx    # Planetary orbits, asteroid belt & moons
│   │   ├── CameraController.tsx# GSAP cinematic & focus animations + WASD controls
│   │   ├── BackgroundStars.tsx # Deep space distant starfield
│   │   ├── DistanceGrid.tsx    # Light-year concentric distance rings
│   │   └── PostProcessing.tsx  # Bloom and vignette optical passes
│   │
│   ├── galaxy-ui/              # Futuristic Glassmorphism HUD overlays
│   │   ├── LandingHero.tsx     # Cinematic entrance screen
│   │   ├── LoadingScreen.tsx   # Spatial calibration progress screen
│   │   ├── NavigationBar.tsx   # Top telemetry bar & system toggles
│   │   ├── BottomHUD.tsx       # Scientific coordinate readout (RA / DEC)
│   │   ├── MiniMap.tsx         # Tactical 2D top-down galactic radar
│   │   ├── GalaxySearch.tsx    # Fast search with keyboard navigation (Ctrl+K)
│   │   ├── CommandPalette.tsx  # Quick actions & shortcut launcher (Ctrl+P)
│   │   ├── ControlPanel.tsx    # Visualization, optical, and performance controls
│   │   ├── ObjectInfoPanel.tsx # Astrophysical specifications drawer / sheet
│   │   ├── CinematicMode.tsx   # Automated tour controller & HUD
│   │   ├── NavigationStatus.tsx# Target locked & hyperdrive status indicators
│   │   └── WebGLFallback.tsx   # Graceful fallback for non-WebGL devices
│   │
│   └── ui/                     # Primitives (button, input, slider, switch, badge)
│
├── stores/                     # Zustand persistent state
│   ├── galaxy-store.ts         # Active/focused targets, view levels, tour state
│   ├── settings-store.ts       # Visual layers, camera, speed, theme (persisted)
│   ├── camera-store.ts         # High-level camera animation modes
│   └── ui-store.ts             # Modal states, mobile detection, telemetry
│
├── lib/                        # Math, Sound, & Astronomy datasets
│   ├── galaxy/
│   │   ├── generator.ts        # Seeded procedural 4-arm spiral generator
│   │   ├── celestial-data.ts   # Real-world astronomical benchmarks
│   │   └── systems.ts          # Keplerian orbital systems & satellites
│   ├── sound.ts                # Web Audio cosmic ambient drone synthesizer
│   └── utils.ts                # Astrometry formatters (RA, DEC, LY, AU, K)
│
└── types/
    └── astronomy.ts            # Strict astrophysical TypeScript definitions
```

## Key Rules for Editing

1. **State Management**:
   - Never put per-frame animations into React state or Zustand.
   - Use `useFrame((state, delta) => ...)` inside React Three Fiber components.
   - Use Zustand for user preferences, selection targets, and view modes.

2. **React 19 & React Compiler Purity**:
   - Do not call impure functions like `Math.random()` inside component render bodies or `useMemo`.
   - Use deterministic seeded generators (e.g. `seededRandom` in `generator.ts`) or calculate static data outside component scope.

3. **Performance & Hardware Scaling**:
   - The application supports `AUTO`, `HIGH`, `BALANCED`, and `LOW` performance profiles.
   - `LOW` mode scales down particle count from 80k to 12k and disables post-processing passes.

4. **Coordinate Space**:
   - The Milky Way model has a visual radius of ~200-240 units with the core (Sagittarius A*) at origin `[0, 0, 0]`.
   - Distances, temperatures, and celestial designations follow real IAU standards where applicable.
