'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useGalaxyStore } from '@/stores/galaxy-store';
import { useUIStore } from '@/stores/ui-store';
import { useCameraStore } from '@/stores/camera-store';
import { Locate } from 'lucide-react';

export default function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { celestialObjects, selectedObjectId, selectObject, focusObject } = useGalaxyStore();
  const { isUIVisible, isMobile } = useUIStore();
  const targetPosition = useCameraStore(s => s.targetPosition);

  // Draw tactical galactic minimap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Radius in 3D units mapped to minimap radius
    // Galaxy radius is ~220
    const maxWorldRadius = 260;
    const mapRadius = width * 0.42;
    const scale = mapRadius / maxWorldRadius;

    ctx.clearRect(0, 0, width, height);

    // Deep space backdrop
    const bgGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, mapRadius);
    bgGrad.addColorStop(0, 'rgba(10, 20, 45, 0.6)');
    bgGrad.addColorStop(0.7, 'rgba(2, 6, 23, 0.8)');
    bgGrad.addColorStop(1, 'rgba(0, 0, 5, 0.9)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
    ctx.fill();

    // Radar coordinate grid rings
    [0.25, 0.5, 0.75, 1.0].forEach((fraction) => {
      ctx.strokeStyle = `rgba(34, 211, 238, ${fraction === 1.0 ? 0.25 : 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, mapRadius * fraction, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(centerX - mapRadius, centerY);
    ctx.lineTo(centerX + mapRadius, centerY);
    ctx.moveTo(centerX, centerY - mapRadius);
    ctx.lineTo(centerX, centerY + mapRadius);
    ctx.stroke();

    // Spiral arm guides
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 2;
    for (let arm = 0; arm < 4; arm++) {
      ctx.beginPath();
      const armOffset = (arm * Math.PI) / 2;
      for (let r = 10; r < maxWorldRadius; r += 5) {
        const angle = r * 0.015 + armOffset;
        const x = centerX + Math.cos(angle) * r * scale;
        const y = centerY + Math.sin(angle) * r * scale;
        if (r === 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Galactic Core
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    coreGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.6)');
    coreGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Celestial Objects
    celestialObjects.forEach((obj) => {
      if (!obj.position) return;
      const x = centerX + obj.position[0] * scale;
      const y = centerY + obj.position[2] * scale;

      const isSelected = obj.id === selectedObjectId;

      if (isSelected) {
        // Ping ring
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = obj.id === 'sol' ? '#fbbf24' : obj.type === 'black-hole' ? '#ec4899' : 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, obj.id === 'sol' ? 2.5 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Camera target / orientation
    if (targetPosition) {
      const camX = centerX + targetPosition[0] * scale;
      const camY = centerY + targetPosition[2] * scale;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.strokeRect(camX - 3, camY - 3, 6, 6);
    }
  }, [celestialObjects, selectedObjectId, targetPosition]);

  // Click on minimap to select closest object
  const handleMapClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxWorldRadius = 260;
    const mapRadius = canvas.width * 0.42;
    const scale = mapRadius / maxWorldRadius;

    // Find nearest object within threshold
    let nearestId: string | null = null;
    let minDist = 18; // pixel threshold

    celestialObjects.forEach(obj => {
      const x = centerX + obj.position[0] * scale;
      const y = centerY + obj.position[2] * scale;
      const dist = Math.hypot(clickX - x, clickY - y);
      if (dist < minDist) {
        minDist = dist;
        nearestId = obj.id;
      }
    });

    if (nearestId) {
      selectObject(nearestId);
      focusObject(nearestId);
    }
  }, [celestialObjects, selectObject, focusObject]);

  if (!isUIVisible || isMobile) return null;

  return (
    <div className="fixed bottom-12 left-6 z-30 p-2.5 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-2 tracking-wider">
        <span className="flex items-center gap-1.5">
          <Locate className="w-3 h-3 text-cyan-400 animate-pulse" />
          GALACTIC RADAR
        </span>
        <span className="text-white/40">TOP-DOWN</span>
      </div>
      <canvas
        ref={canvasRef}
        width={180}
        height={180}
        onClick={handleMapClick}
        className="w-[180px] h-[180px] rounded-lg cursor-crosshair border border-cyan-500/20"
        title="Click on celestial bodies to target"
      />
    </div>
  );
}
