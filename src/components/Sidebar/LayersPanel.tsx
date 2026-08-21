import React from 'react';
import { PhotoLayer } from '../../types';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
} from 'lucide-react';

interface LayersPanelProps {
  layers: PhotoLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<PhotoLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onMoveLayerOrder: (id: string, direction: 'up' | 'down') => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayerOrder,
}) => {
  // Display sorted top to bottom (highest zIndex first)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Photo Layers ({layers.length})
        </h4>
      </div>

      {sortedLayers.length === 0 ? (
        <div className="p-8 text-center text-zinc-400 bg-zinc-50 rounded-xl border border-zinc-200">
          <p className="text-xs font-medium text-zinc-600">No subject layers added yet.</p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Upload a photo or select a sample from the Photos tab.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {sortedLayers.map((layer, idx) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100/80 border-zinc-900 shadow-sm'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {/* Left Thumbnail & Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    <img
                      src={layer.src}
                      alt={layer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <input
                      type="text"
                      value={layer.name}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateLayer(layer.id, { name: e.target.value })}
                      className="bg-transparent text-xs font-medium text-zinc-900 focus:outline-none focus:bg-white rounded px-1 -ml-1 truncate w-24"
                    />
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {Math.round(layer.width)}×{Math.round(layer.height)} • {layer.rotation}°
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Order Up / Down */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => onMoveLayerOrder(layer.id, 'up')}
                      disabled={idx === 0}
                      title="Bring Forward"
                      className="p-0.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-20 transition"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onMoveLayerOrder(layer.id, 'down')}
                      disabled={idx === sortedLayers.length - 1}
                      title="Send Backward"
                      className="p-0.5 text-zinc-400 hover:text-zinc-900 disabled:opacity-20 transition"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Visibility */}
                  <button
                    onClick={() => onUpdateLayer(layer.id, { visible: !layer.visible })}
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                    className={`p-1.5 rounded hover:bg-zinc-100 transition ${
                      layer.visible ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-300'
                    }`}
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Lock */}
                  <button
                    onClick={() => onUpdateLayer(layer.id, { locked: !layer.locked })}
                    title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                    className={`p-1.5 rounded hover:bg-zinc-100 transition ${
                      layer.locked ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => onDuplicateLayer(layer.id)}
                    title="Duplicate"
                    className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteLayer(layer.id)}
                    title="Delete"
                    className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
