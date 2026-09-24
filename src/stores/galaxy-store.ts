import { create } from 'zustand';
import { CelestialObject, ViewLevel } from '../types/astronomy';
import { celestialObjects } from '../lib/galaxy/celestial-data';

interface GalaxyState {
  selectedObjectId: string | null;
  focusedObjectId: string | null;
  viewLevel: ViewLevel;
  searchQuery: string;
  celestialObjects: CelestialObject[];
  filteredObjects: CelestialObject[];
  isCinematicMode: boolean;
  isCinematicPaused: boolean;
  currentTourStop: string;
  
  selectObject: (id: string | null) => void;
  focusObject: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCinematicMode: (isCinematic: boolean) => void;
  setCinematicPaused: (paused: boolean) => void;
  setCurrentTourStop: (stop: string) => void;
  setViewLevel: (level: ViewLevel) => void;
  setCelestialObjects: (objects: CelestialObject[]) => void;
}

export const useGalaxyStore = create<GalaxyState>((set, get) => ({
  selectedObjectId: null,
  focusedObjectId: null,
  viewLevel: 'galaxy',
  searchQuery: '',
  celestialObjects: celestialObjects,
  filteredObjects: celestialObjects,
  isCinematicMode: false,
  isCinematicPaused: false,
  currentTourStop: 'Galaxy Core',

  selectObject: (id) => set({ selectedObjectId: id }),
  focusObject: (id) => set({ focusedObjectId: id }),
  setSearchQuery: (query) => {
    const { celestialObjects } = get();
    const lowerQuery = query.toLowerCase();
    const filtered = query 
      ? celestialObjects.filter(obj => 
          obj.name.toLowerCase().includes(lowerQuery) || 
          obj.type.toLowerCase().includes(lowerQuery) ||
          (obj.description && obj.description.toLowerCase().includes(lowerQuery))
        )
      : celestialObjects;
      
    set({ searchQuery: query, filteredObjects: filtered });
  },
  setCinematicMode: (isCinematicMode) => set({ isCinematicMode }),
  setCinematicPaused: (isCinematicPaused) => set({ isCinematicPaused }),
  setCurrentTourStop: (currentTourStop) => set({ currentTourStop }),
  setViewLevel: (viewLevel) => set({ viewLevel }),
  setCelestialObjects: (objects) => set({ celestialObjects: objects, filteredObjects: objects }),
}));
