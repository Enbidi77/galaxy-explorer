"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useGalaxyStore } from "@/stores/galaxy-store";
import { useUIStore } from "@/stores/ui-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useCameraStore } from "@/stores/camera-store";
import NavigationBar from "@/components/galaxy-ui/NavigationBar";
import BottomHUD from "@/components/galaxy-ui/BottomHUD";
import ObjectInfoPanel from "@/components/galaxy-ui/ObjectInfoPanel";
import GalaxySearch from "@/components/galaxy-ui/GalaxySearch";
import CommandPalette from "@/components/galaxy-ui/CommandPalette";
import ControlPanel from "@/components/galaxy-ui/ControlPanel";
import NavigationStatus from "@/components/galaxy-ui/NavigationStatus";
import MiniMap from "@/components/galaxy-ui/MiniMap";
import CinematicMode from "@/components/galaxy-ui/CinematicMode";

const GalaxyCanvas = dynamic(
  () => import("@/components/galaxy/GalaxyCanvas"),
  { ssr: false }
);

interface GalaxyExplorerProps {
  isActive: boolean;
}

export default function GalaxyExplorer({ isActive }: GalaxyExplorerProps) {
  const isUIVisible = useUIStore((s) => s.isUIVisible);
  const selectedObjectId = useGalaxyStore((s) => s.selectedObjectId);
  const setIsInfoPanelOpen = useUIStore((s) => s.setIsInfoPanelOpen);
  const performanceMode = useSettingsStore((s) => s.performanceMode);
  const setIsMobile = useUIStore((s) => s.setIsMobile);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [setIsMobile]);

  // Open info panel when object is selected
  useEffect(() => {
    if (selectedObjectId) {
      setIsInfoPanelOpen(true);
    }
  }, [selectedObjectId, setIsInfoPanelOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.key) {
        case "Escape":
          useUIStore.getState().setIsSearchOpen(false);
          useUIStore.getState().setIsCommandPaletteOpen(false);
          useUIStore.getState().setIsSettingsOpen(false);
          useUIStore.getState().setIsInfoPanelOpen(false);
          break;
        case "l":
        case "L":
          if (!e.ctrlKey && !e.metaKey) {
            const vis = useSettingsStore.getState().visualizationSettings;
            useSettingsStore.getState().setVisualizationSettings({
              showLabels: !vis.showLabels,
            });
          }
          break;
        case "o":
        case "O":
          if (!e.ctrlKey && !e.metaKey) {
            const vis = useSettingsStore.getState().visualizationSettings;
            useSettingsStore.getState().setVisualizationSettings({
              showOrbits: !vis.showOrbits,
            });
          }
          break;
        case "c":
        case "C":
          if (!e.ctrlKey && !e.metaKey) {
            const store = useGalaxyStore.getState();
            store.setCinematicMode(!store.isCinematicMode);
          }
          break;
        case "r":
        case "R":
          if (!e.ctrlKey && !e.metaKey) {
            useCameraStore.getState().setCameraMode("free");
            useCameraStore.getState().setTargetPosition(null);
            useGalaxyStore.getState().focusObject(null);
          }
          break;
        case "f":
        case "F":
          if (!e.ctrlKey && !e.metaKey) {
            const selected = useGalaxyStore.getState().selectedObjectId;
            if (selected) {
              useGalaxyStore.getState().focusObject(selected);
            }
          }
          break;
        case "k":
        case "K":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const ui = useUIStore.getState();
            if (ui.isSearchOpen) {
              ui.setIsSearchOpen(false);
            } else {
              ui.setIsSearchOpen(true);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const perfMap = {
    auto: "medium" as const,
    high: "high" as const,
    balanced: "medium" as const,
    low: "low" as const,
  };

  return (
    <div className="relative h-full w-full">
      {/* 3D Canvas */}
      <GalaxyCanvas
        performanceMode={perfMap[performanceMode]}
      />

      {/* UI Layer */}
      {isActive && isUIVisible && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Top Navigation */}
          <div className="pointer-events-auto">
            <NavigationBar />
          </div>

          {/* Navigation Status */}
          <NavigationStatus />

          {/* Cinematic Mode Tour Overlay */}
          <div className="pointer-events-auto">
            <CinematicMode />
          </div>

          {/* Control Panel */}
          <div className="pointer-events-auto">
            <ControlPanel />
          </div>

          {/* Object Info Panel */}
          <div className="pointer-events-auto">
            <ObjectInfoPanel />
          </div>

          {/* Mini Map */}
          <div className="pointer-events-auto">
            <MiniMap />
          </div>

          {/* Bottom HUD */}
          <div className="pointer-events-auto">
            <BottomHUD />
          </div>

          {/* Search Overlay */}
          <div className="pointer-events-auto">
            <GalaxySearch />
          </div>

          {/* Command Palette */}
          <div className="pointer-events-auto">
            <CommandPalette />
          </div>
        </div>
      )}
    </div>
  );
}
