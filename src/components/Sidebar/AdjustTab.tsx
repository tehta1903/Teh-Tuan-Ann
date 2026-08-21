import React from 'react';
import { PhotoLayer, BackgroundSettings } from '../../types';
import { BLEND_MODES } from '../../data/presets';
import {
  Sun,
  Contrast,
  Sparkles,
  Aperture,
  Sliders,
  Eye,
  RotateCcw,
  Palette,
  CircleDot,
} from 'lucide-react';

interface AdjustTabProps {
  layer: PhotoLayer | null;
  onUpdateLayer: (id: string, updates: Partial<PhotoLayer>) => void;
  bg: BackgroundSettings;
  onUpdateBg: (updates: Partial<BackgroundSettings>) => void;
}

export const AdjustTab: React.FC<AdjustTabProps> = ({
  layer,
  onUpdateLayer,
  bg,
  onUpdateBg,
}) => {
  const handleAutoWarmthMatch = () => {
    if (!layer) return;
    // Ambient warmth match heuristic
    onUpdateLayer(layer.id, {
      filters: {
        ...layer.filters,
        brightness: 105,
        contrast: 105,
        saturation: 110,
        sepia: 10,
      },
    });
  };

  const handleResetFilters = () => {
    if (!layer) return;
    onUpdateLayer(layer.id, {
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        warmth: 0,
        tint: 0,
        exposure: 0,
        sepia: 0,
        hueRotate: 0,
        blur: 0,
        opacity: 100,
      },
      blendMode: 'source-over',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Background DSLR Bokeh Blur & Depth */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Background Bokeh Blur
          </h4>
          <span className="text-[11px] text-zinc-900 font-mono font-medium">
            {bg.blur} px
          </span>
        </div>

        <div>
          <input
            type="range"
            min="0"
            max="30"
            value={bg.blur}
            onChange={(e) => onUpdateBg({ blur: Number(e.target.value) })}
            className="w-full accent-zinc-900 cursor-pointer"
          />
          <p className="text-[10px] text-zinc-400 mt-1">
            Blurs background to create realistic DSLR shallow depth of field.
          </p>
        </div>

        {/* Background Adjustments */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
              <span>Brightness</span>
              <span className="font-mono text-zinc-800">{bg.brightness}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="170"
              value={bg.brightness}
              onChange={(e) => onUpdateBg({ brightness: Number(e.target.value) })}
              className="w-full accent-zinc-900 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
              <span>Contrast</span>
              <span className="font-mono text-zinc-800">{bg.contrast}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="170"
              value={bg.contrast}
              onChange={(e) => onUpdateBg({ contrast: Number(e.target.value) })}
              className="w-full accent-zinc-900 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
            <span>Vignette</span>
            <span className="font-mono text-zinc-800">{bg.vignette}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={bg.vignette}
            onChange={(e) => onUpdateBg({ vignette: Number(e.target.value) })}
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </div>
      </div>

      <div className="h-px bg-zinc-100" />

      {/* 2. Foreground Lighting & Filter Adjustments */}
      {layer ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Photo Lighting & Color
            </h4>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-zinc-400 hover:text-zinc-700 flex items-center gap-1 font-medium transition"
              title="Reset Adjustments"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Quick Ambient Match */}
          <button
            onClick={handleAutoWarmthMatch}
            className="w-full py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            Auto-Match Ambient Lighting
          </button>

          {/* Sliders */}
          <div className="space-y-3 pt-1">
            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Brightness</span>
                <span className="font-mono text-zinc-900 font-medium">{layer.filters.brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={layer.filters.brightness}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    filters: { ...layer.filters, brightness: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Contrast</span>
                <span className="font-mono text-zinc-900 font-medium">{layer.filters.contrast}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={layer.filters.contrast}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    filters: { ...layer.filters, contrast: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Saturation</span>
                <span className="font-mono text-zinc-900 font-medium">{layer.filters.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={layer.filters.saturation}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    filters: { ...layer.filters, saturation: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Opacity</span>
                <span className="font-mono text-zinc-900 font-medium">{layer.filters.opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={layer.filters.opacity}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    filters: { ...layer.filters, opacity: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            {/* Sepia / Warmth Tone */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Warmth / Sepia</span>
                <span className="font-mono text-zinc-900 font-medium">{layer.filters.sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={layer.filters.sepia}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    filters: { ...layer.filters, sepia: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            {/* Blend Mode */}
            <div className="pt-2">
              <label className="block text-xs text-zinc-600 mb-1.5 font-medium">
                Blend Mode
              </label>
              <select
                value={layer.blendMode || 'source-over'}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    blendMode: e.target.value as GlobalCompositeOperation,
                  })
                }
                className="w-full bg-white border border-zinc-200 text-zinc-800 text-xs rounded-md p-2 focus:outline-none focus:border-zinc-900 cursor-pointer"
              >
                {BLEND_MODES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-zinc-400 bg-zinc-50 rounded-xl border border-zinc-200">
          <p className="text-xs font-medium text-zinc-500">Select a subject photo to adjust its color & lighting.</p>
        </div>
      )}
    </div>
  );
};
