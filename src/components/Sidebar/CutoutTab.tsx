import React from 'react';
import { PhotoLayer, MaskShape } from '../../types';
import {
  Scissors,
  Pipette,
  Sparkles,
  Circle,
  Square,
  Heart,
  Star,
  Hexagon,
  Layers,
  Sliders,
  SunMedium,
} from 'lucide-react';

interface CutoutTabProps {
  layer: PhotoLayer | null;
  onUpdateLayer: (id: string, updates: Partial<PhotoLayer>) => void;
  isEyedropperActive: boolean;
  onToggleEyedropper: () => void;
}

const MASK_SHAPES: { id: MaskShape; label: string; icon: React.ReactNode }[] = [
  { id: 'none', label: 'Original / Free', icon: <Square className="w-4 h-4" /> },
  { id: 'rounded-rect', label: 'Rounded Card', icon: <Square className="w-4 h-4 rounded" /> },
  { id: 'circle', label: 'Circle / Avatar', icon: <Circle className="w-4 h-4" /> },
  { id: 'ellipse', label: 'Ellipse', icon: <Circle className="w-4 h-3" /> },
  { id: 'heart', label: 'Heart', icon: <Heart className="w-4 h-4" /> },
  { id: 'star', label: 'Star', icon: <Star className="w-4 h-4" /> },
  { id: 'hexagon', label: 'Hexagon', icon: <Hexagon className="w-4 h-4" /> },
];

export const CutoutTab: React.FC<CutoutTabProps> = ({
  layer,
  onUpdateLayer,
  isEyedropperActive,
  onToggleEyedropper,
}) => {
  if (!layer) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-zinc-50 rounded-xl border border-zinc-200">
        <p className="text-xs font-semibold text-zinc-600">No subject photo selected</p>
        <p className="text-[11px] text-zinc-400 mt-1">
          Select a photo on the canvas to configure cutout and shape masks.
        </p>
      </div>
    );
  }

  const cutout = layer.cutout;
  const shadow = layer.shadow;
  const border = layer.border;

  return (
    <div className="space-y-6">
      {/* 1. Color Key / Auto Background Remover */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Chroma Key / Color Eraser
          </h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cutout.colorKeyActive}
              onChange={(e) =>
                onUpdateLayer(layer.id, {
                  cutout: { ...cutout, colorKeyActive: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900"></div>
          </label>
        </div>

        {cutout.colorKeyActive && (
          <div className="space-y-3 pt-1">
            {/* Color Picker & Eyedropper */}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleEyedropper}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition border ${
                  isEyedropperActive
                    ? 'bg-zinc-900 text-white border-zinc-900 animate-pulse'
                    : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                }`}
              >
                <Pipette className="w-3.5 h-3.5" />
                {isEyedropperActive ? 'Click color on canvas...' : 'Pick Color'}
              </button>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-zinc-200">
                <input
                  type="color"
                  value={cutout.keyColor || '#ffffff'}
                  onChange={(e) =>
                    onUpdateLayer(layer.id, {
                      cutout: { ...cutout, keyColor: e.target.value },
                    })
                  }
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-zinc-600">
                  {cutout.keyColor || '#ffffff'}
                </span>
              </div>
            </div>

            {/* Tolerance */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Color Tolerance</span>
                <span className="font-mono text-zinc-900 font-medium">{cutout.tolerance}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                value={cutout.tolerance}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    cutout: { ...cutout, tolerance: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            {/* Smoothness */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Edge Smoothness</span>
                <span className="font-mono text-zinc-900 font-medium">{cutout.smoothness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={cutout.smoothness}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    cutout: { ...cutout, smoothness: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-zinc-100" />

      {/* 2. Shape Cutouts & Masks */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Shape Mask & Frame
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {MASK_SHAPES.map((item) => {
            const isSelected = cutout.maskShape === item.id;
            return (
              <button
                key={item.id}
                onClick={() =>
                  onUpdateLayer(layer.id, {
                    cutout: { ...cutout, maskShape: item.id },
                  })
                }
                className={`flex flex-col items-center justify-center p-2.5 rounded-md text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                }`}
              >
                <div className={`mb-1.5 ${isSelected ? 'text-white' : 'text-zinc-500'}`}>{item.icon}</div>
                <span className="text-[10px] truncate w-full text-center font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Edge Feathering Slider */}
        <div className="pt-1">
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Edge Feathering</span>
            <span className="font-mono text-zinc-900 font-medium">{cutout.feather} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={cutout.feather}
            onChange={(e) =>
              onUpdateLayer(layer.id, {
                cutout: { ...cutout, feather: Number(e.target.value) },
              })
            }
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </div>
      </div>

      <div className="h-px bg-zinc-100" />

      {/* 3. Realistic Drop Shadow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Drop Shadow
          </h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shadow.enabled}
              onChange={(e) =>
                onUpdateLayer(layer.id, {
                  shadow: { ...shadow, enabled: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900"></div>
          </label>
        </div>

        {shadow.enabled && (
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Shadow Blur</span>
                <span className="font-mono text-zinc-900 font-medium">{shadow.blur} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={shadow.blur}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    shadow: { ...shadow, blur: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                  <span>Offset X</span>
                  <span className="font-mono text-zinc-800">{shadow.offsetX}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={shadow.offsetX}
                  onChange={(e) =>
                    onUpdateLayer(layer.id, {
                      shadow: { ...shadow, offsetX: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-zinc-900 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                  <span>Offset Y</span>
                  <span className="font-mono text-zinc-800">{shadow.offsetY}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={shadow.offsetY}
                  onChange={(e) =>
                    onUpdateLayer(layer.id, {
                      shadow: { ...shadow, offsetY: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-zinc-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-600">Shadow Tint</span>
              <input
                type="color"
                value={shadow.color.slice(0, 7) || '#000000'}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    shadow: { ...shadow, color: e.target.value },
                  })
                }
                className="w-7 h-7 rounded cursor-pointer bg-transparent border border-zinc-200"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-zinc-100" />

      {/* 4. Stroke Border / Outline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Border Outline
          </h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={border.enabled}
              onChange={(e) =>
                onUpdateLayer(layer.id, {
                  border: { ...border, enabled: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-900"></div>
          </label>
        </div>

        {border.enabled && (
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Border Width</span>
                <span className="font-mono text-zinc-900 font-medium">{border.width} px</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={border.width}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    border: { ...border, width: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">Border Color</span>
              <input
                type="color"
                value={border.color || '#ffffff'}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    border: { ...border, color: e.target.value },
                  })
                }
                className="w-7 h-7 rounded cursor-pointer bg-transparent border border-zinc-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
