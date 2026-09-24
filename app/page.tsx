"use client";

import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { isWebGLAvailable } from "@/lib/utils";
import LandingHero from "@/components/galaxy-ui/LandingHero";
import LoadingScreen from "@/components/galaxy-ui/LoadingScreen";
import WebGLFallback from "@/components/galaxy-ui/WebGLFallback";

const GalaxyExplorer = dynamic(() => import("@/components/GalaxyExplorer"), {
  ssr: false,
  loading: () => null,
});

type AppPhase = "landing" | "loading" | "exploring";

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [webglAvailable] = useState(() =>
    typeof window === "undefined" ? true : isWebGLAvailable()
  );

  const handleEnter = useCallback(() => {
    setPhase("loading");

    // Real-feeling calibration progress steps
    const steps = [
      { progress: 18, delay: 250 },
      { progress: 42, delay: 450 },
      { progress: 68, delay: 400 },
      { progress: 85, delay: 350 },
      { progress: 100, delay: 300 },
    ];

    let totalDelay = 0;
    steps.forEach(({ progress, delay }) => {
      totalDelay += delay;
      setTimeout(() => setLoadingProgress(progress), totalDelay);
    });

    setTimeout(() => setPhase("exploring"), totalDelay + 400);
  }, []);

  if (!webglAvailable) {
    return <WebGLFallback />;
  }

  return (
    <main className="h-full w-full relative overflow-hidden bg-[#000005]">
      {/* 3D Canvas always renders behind everything for depth and smooth transition */}
      <Suspense fallback={null}>
        <GalaxyExplorer isActive={phase === "exploring"} />
      </Suspense>

      {/* Landing overlay */}
      {phase === "landing" && <LandingHero onEnter={handleEnter} />}

      {/* Loading calibration overlay */}
      {phase === "loading" && (
        <LoadingScreen progress={loadingProgress} />
      )}
    </main>
  );
}
