import { create } from 'zustand';

type NavigationStatus = 'idle' | 'navigating' | 'entering-system' | 'returning' | 'arrived';

interface UIState {
  isSearchOpen: boolean;
  isSettingsOpen: boolean;
  isCommandPaletteOpen: boolean;
  isInfoPanelOpen: boolean;
  isFullscreen: boolean;
  isUIVisible: boolean;
  navigationStatus: NavigationStatus;
  navigationTarget: string | null;
  isMobile: boolean;
  
  setIsSearchOpen: (isOpen: boolean) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setIsCommandPaletteOpen: (isOpen: boolean) => void;
  setIsInfoPanelOpen: (isOpen: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setIsUIVisible: (isVisible: boolean) => void;
  setNavigationStatus: (status: NavigationStatus) => void;
  setNavigationTarget: (target: string | null) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isSettingsOpen: false,
  isCommandPaletteOpen: false,
  isInfoPanelOpen: false,
  isFullscreen: false,
  isUIVisible: true,
  navigationStatus: 'idle',
  navigationTarget: null,
  isMobile: false,

  setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setIsCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setIsInfoPanelOpen: (isOpen) => set({ isInfoPanelOpen: isOpen }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setIsUIVisible: (isVisible) => set({ isUIVisible: isVisible }),
  setNavigationStatus: (status) => set({ navigationStatus: status }),
  setNavigationTarget: (target) => set({ navigationTarget: target }),
  setIsMobile: (isMobile) => set({ isMobile }),
  toggleUI: () => set((state) => ({ isUIVisible: !state.isUIVisible })),
}));
