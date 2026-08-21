import React from 'react';
import {
  PhotoLayer,
  CanvasDimensions,
} from '../../types';
import {
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Maximize,
  Minimize,
  Layers,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
} from 'lucide-react';

interface TransformTabProps {
  layer: PhotoLayer | null;
  onUpdateLayer: (id: string, updates: Partial<PhotoLayer>) => void;
  dimensions: CanvasDimensions;
}

export const TransformTab: React.FC<TransformTabProps> = ({
  layer,
  onUpdateLayer,
  dimensions,
}) => {
  if (!layer) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-zinc-50 rounded-xl border border-zinc-200">
        <p className="text-xs font-semibold text-zinc-600">No subject photo selected</p>
        <p className="text-[11px] text-zinc-400 mt-1">
          Click on a photo in the canvas or add one from the Upload tab.
        </p>
      </div>
    );
  }

  const handleCenter = () => {
    onUpdateLayer(layer.id, {
      x: Math.round(dimensions.width / 2),
      y: Math.round(dimensions.height / 2),
    });
  };

  const handleFit = () => {
    const aspect = layer.originalWidth / layer.originalHeight;
    let targetW = dimensions.width * 0.8;
    let targetH = targetW / aspect;

    if (targetH > dimensions.height * 0.8) {
      targetH = dimensions.height * 0.8;
      targetW = targetH * aspect;
    }

    onUpdateLayer(layer.id, {
      width: Math.round(targetW),
      height: Math.round(targetH),
      x: Math.round(dimensions.width / 2),
      y: Math.round(dimensions.height / 2),
      rotation: 0,
    });
  };

  const handleFill = () => {
    const aspect = layer.originalWidth / layer.originalHeight;
    let targetW = dimensions.width;
    let targetH = targetW / aspect;

    if (targetH < dimensions.height) {
      targetH = dimensions.height;
      targetW = targetH * aspect;
    }

    onUpdateLayer(layer.id, {
      width: Math.round(targetW),
      height: Math.round(targetH),
      x: Math.round(dimensions.width / 2),
      y: Math.round(dimensions.height / 2),
      rotation: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Alignment & Placement */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Quick Align & Fit
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleCenter}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200 transition"
          >
            <AlignCenter className="w-3.5 h-3.5" />
            Center
          </button>
          <button
            onClick={handleFit}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200 transition"
          >
            <Minimize className="w-3.5 h-3.5" />
            Fit
          </button>
          <button
            onClick={handleFill}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200 transition"
          >
            <Maximize className="w-3.5 h-3.5" />
            Fill
          </button>
        </div>
      </div>

      <div className="h-px bg-zinc-100" />

      {/* Size & Scale */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Dimensions & Scale
        </h4>

        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Width</span>
            <span className="font-mono text-zinc-900 font-medium">{Math.round(layer.width)} px</span>
          </div>
          <input
            type="range"
            min="40"
            max={dimensions.width * 2}
            value={layer.width}
            onChange={(e) => {
              const newW = Number(e.target.value);
              const aspect = layer.originalWidth / layer.originalHeight;
              onUpdateLayer(layer.id, {
                width: newW,
                height: Math.round(newW / aspect),
              });
            }}
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </div>

        {/* Position X / Y */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
              <span>Position X</span>
              <span className="font-mono text-zinc-800">{Math.round(layer.x)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={dimensions.width}
              value={layer.x}
              onChange={(e) => onUpdateLayer(layer.id, { x: Number(e.target.value) })}
              className="w-full accent-zinc-900 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
              <span>Position Y</span>
              <span className="font-mono text-zinc-800">{Math.round(layer.y)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={dimensions.height}
              value={layer.y}
              onChange={(e) => onUpdateLayer(layer.id, { y: Number(e.target.value) })}
              className="w-full accent-zinc-900 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-100" />

      {/* Rotation & Flip */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Rotate & Flip
        </h4>

        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Rotation Angle</span>
            <span className="font-mono text-zinc-900 font-medium">{layer.rotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={layer.rotation}
            onChange={(e) => onUpdateLayer(layer.id, { rotation: Number(e.target.value) })}
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={() =>
              onUpdateLayer(layer.id, {
                rotation: (layer.rotation - 90 + 360) % 360,
              })
            }
            className="flex flex-col items-center justify-center p-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md text-[10px] font-medium border border-zinc-200 transition"
            title="Rotate -90°"
          >
            <RotateCcw className="w-3.5 h-3.5 mb-1" />
            -90°
          </button>
          <button
            onClick={() =>
              onUpdateLayer(layer.id, {
                rotation: (layer.rotation + 90) % 360,
              })
            }
            className="flex flex-col items-center justify-center p-2 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md text-[10px] font-medium border border-zinc-200 transition"
            title="Rotate +90°"
          >
            <RotateCw className="w-3.5 h-3.5 mb-1" />
            +90°
          </button>
          <button
            onClick={() =>
              onUpdateLayer(layer.id, {
                scaleX: layer.scaleX * -1,
              })
            }
            className={`flex flex-col items-center justify-center p-2 rounded-md text-[10px] font-medium border transition ${
              layer.scaleX < 0
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
            }`}
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-3.5 h-3.5 mb-1" />
            Flip H
          </button>
          <button
            onClick={() =>
              onUpdateLayer(layer.id, {
                scaleY: layer.scaleY * -1,
              })
            }
            className={`flex flex-col items-center justify-center p-2 rounded-md text-[10px] font-medium border transition ${
              layer.scaleY < 0
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
            }`}
            title="Flip Vertical"
          >
            <FlipVertical className="w-3.5 h-3.5 mb-1" />
            Flip V
          </button>
        </div>
      </div>
    </div>
  );
};
