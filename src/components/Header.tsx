import React from 'react';
import {
  Download,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Ratio,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ASPECT_RATIOS } from '../data/presets';

interface HeaderProps {
  aspectRatio: string;
  onAspectRatioChange: (val: string) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onResetAll: () => void;
  onOpenExport: () => void;
  layerCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  aspectRatio,
  onAspectRatioChange,
  zoom,
  onZoomChange,
  onResetZoom,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onResetAll,
  onOpenExport,
  layerCount,
}) => {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-4 md:px-8 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 rounded-sm flex items-center justify-center shrink-0">
          <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-semibold tracking-tight text-lg text-zinc-900">
            Overlay Studio
          </h1>
          <span className="text-xs text-zinc-400 hidden sm:inline font-mono">
            Composition_01.png
          </span>
        </div>
      </div>

      {/* Center Controls: Aspect Ratio & Zoom & History */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* History */}
        <div className="hidden lg:flex items-center bg-zinc-50 rounded-md p-1 border border-zinc-200">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center bg-zinc-50 rounded-md px-2.5 py-1.5 border border-zinc-200 text-xs">
          <Ratio className="w-3.5 h-3.5 text-zinc-400 mr-2" />
          <select
            value={aspectRatio}
            onChange={(e) => onAspectRatioChange(e.target.value)}
            className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer pr-1"
          >
            {ASPECT_RATIOS.map((item) => (
              <option key={item.value} value={item.value} className="bg-white text-zinc-800">
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center bg-zinc-50 rounded-md p-0.5 border border-zinc-200 text-xs text-zinc-600">
          <button
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.1))}
            className="p-1.5 rounded hover:text-zinc-900 hover:bg-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            className="px-2 py-1 hover:text-zinc-900 font-mono text-[11px]"
            title="Reset Zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
            className="p-1.5 rounded hover:text-zinc-900 hover:bg-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            className="p-1.5 rounded hover:text-zinc-900 hover:bg-white transition border-l border-zinc-200 ml-0.5"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Controls: Layer count & Export Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetAll}
          title="Reset All Settings"
          className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-md transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>

        <button
          id="export-download-button"
          onClick={onOpenExport}
          className="bg-zinc-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
        >
          <Download className="w-4 h-4" />
          <span>Download Image</span>
        </button>
      </div>
    </header>
  );
};
