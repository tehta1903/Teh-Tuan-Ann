import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PhotoLayer,
  BackgroundSettings,
  CanvasDimensions,
} from '../types';
import { renderFullScene } from '../utils/canvasRenderer';
import { PRESET_BACKGROUNDS } from '../data/presets';
import {
  Move,
  RotateCw,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Pipette,
  Maximize2,
  Image as ImageIcon,
  Upload,
  Plus,
  Sparkles,
  Palette,
} from 'lucide-react';

interface CanvasAreaProps {
  bg: BackgroundSettings;
  layers: PhotoLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<PhotoLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onUploadPhoto: (files: FileList | File[]) => void;
  onUploadBackground: (file: File) => void;
  onSelectPresetBackground?: (url: string) => void;
  onOpenBackgroundTab?: () => void;
  dimensions: CanvasDimensions;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isEyedropperActive: boolean;
  onEyedropperPick: (colorHex: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  bg,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onUploadPhoto,
  onUploadBackground,
  onSelectPresetBackground,
  onOpenBackgroundTab,
  dimensions,
  zoom,
  onZoomChange,
  isEyedropperActive,
  onEyedropperPick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dropTarget, setDropTarget] = useState<'photo' | 'bg'>('photo');

  // Interaction states for moving / transforming selected layer
  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize' | 'rotate' | 'pan' | null;
    handle?: string;
    startX: number;
    startY: number;
    initialLayerX: number;
    initialLayerY: number;
    initialWidth: number;
    initialHeight: number;
    initialRotation: number;
  } | null>(null);

  // Snap guides
  const [snapGuides, setSnapGuides] = useState<{ x?: boolean; y?: boolean }>({});

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  // Render canvas whenever background, layers, or dimensions change
  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderFullScene(canvas, bg, layers, dimensions.width, dimensions.height, 1).catch((err) => {
      if (!isCancelled) console.error('Canvas render failed:', err);
    });

    return () => {
      isCancelled = true;
    };
  }, [bg, layers, dimensions]);

  // Handle Drag and drop files from Desktop / Explorer
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (e.shiftKey || dropTarget === 'bg') {
        onUploadBackground(files[0]);
      } else {
        onUploadPhoto(files);
      }
    }
  };

  // Convert mouse screen coordinates to canvas space coordinates
  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * dimensions.width;
      const y = ((clientY - rect.top) / rect.height) * dimensions.height;
      return { x, y };
    },
    [dimensions]
  );

  // Eyedropper pixel sampler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropperActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
      onEyedropperPick(hex);
    } catch (err) {
      console.warn('Eyedropper pixel read error:', err);
    }
  };

  // Start Move Layer
  const handleLayerPointerDown = (e: React.PointerEvent, layer: PhotoLayer) => {
    if (isEyedropperActive || layer.locked) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    onSelectLayer(layer.id);
    setDragState({
      type: 'move',
      startX: e.clientX,
      startY: e.clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialWidth: layer.width,
      initialHeight: layer.height,
      initialRotation: layer.rotation,
    });
  };

  // Start Resize Handle
  const handleResizePointerDown = (e: React.PointerEvent, handle: string) => {
    if (!selectedLayer || selectedLayer.locked) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDragState({
      type: 'resize',
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialLayerX: selectedLayer.x,
      initialLayerY: selectedLayer.y,
      initialWidth: selectedLayer.width,
      initialHeight: selectedLayer.height,
      initialRotation: selectedLayer.rotation,
    });
  };

  // Start Rotate Handle
  const handleRotatePointerDown = (e: React.PointerEvent) => {
    if (!selectedLayer || selectedLayer.locked) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDragState({
      type: 'rotate',
      startX: e.clientX,
      startY: e.clientY,
      initialLayerX: selectedLayer.x,
      initialLayerY: selectedLayer.y,
      initialWidth: selectedLayer.width,
      initialHeight: selectedLayer.height,
      initialRotation: selectedLayer.rotation,
    });
  };

  // Global Pointer Move during active transform
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState || !selectedLayer) return;

    const deltaX = (e.clientX - dragState.startX) / zoom;
    const deltaY = (e.clientY - dragState.startY) / zoom;

    if (dragState.type === 'move') {
      let newX = dragState.initialLayerX + deltaX;
      let newY = dragState.initialLayerY + deltaY;

      // Smart snapping to center (within 10px)
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      let snapX = false;
      let snapY = false;

      if (Math.abs(newX - centerX) < 12) {
        newX = centerX;
        snapX = true;
      }
      if (Math.abs(newY - centerY) < 12) {
        newY = centerY;
        snapY = true;
      }

      setSnapGuides({ x: snapX, y: snapY });
      onUpdateLayer(selectedLayer.id, { x: Math.round(newX), y: Math.round(newY) });
    } else if (dragState.type === 'resize' && dragState.handle) {
      const handle = dragState.handle;
      const aspect = dragState.initialWidth / dragState.initialHeight;
      let newWidth = dragState.initialWidth;
      let newHeight = dragState.initialHeight;

      if (handle === 'se') {
        newWidth = Math.max(30, dragState.initialWidth + deltaX * 2);
        newHeight = newWidth / aspect;
      } else if (handle === 'sw') {
        newWidth = Math.max(30, dragState.initialWidth - deltaX * 2);
        newHeight = newWidth / aspect;
      } else if (handle === 'ne') {
        newWidth = Math.max(30, dragState.initialWidth + deltaX * 2);
        newHeight = newWidth / aspect;
      } else if (handle === 'nw') {
        newWidth = Math.max(30, dragState.initialWidth - deltaX * 2);
        newHeight = newWidth / aspect;
      } else if (handle === 'e') {
        newWidth = Math.max(30, dragState.initialWidth + deltaX * 2);
      } else if (handle === 'w') {
        newWidth = Math.max(30, dragState.initialWidth - deltaX * 2);
      } else if (handle === 's') {
        newHeight = Math.max(30, dragState.initialHeight + deltaY * 2);
      } else if (handle === 'n') {
        newHeight = Math.max(30, dragState.initialHeight - deltaY * 2);
      }

      onUpdateLayer(selectedLayer.id, {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    } else if (dragState.type === 'rotate') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const layerScreenX = rect.left + (selectedLayer.x / dimensions.width) * rect.width;
      const layerScreenY = rect.top + (selectedLayer.y / dimensions.height) * rect.height;

      const angleRad = Math.atan2(e.clientY - layerScreenY, e.clientX - layerScreenX);
      let angleDeg = Math.round((angleRad * 180) / Math.PI) + 90;
      if (angleDeg < 0) angleDeg += 360;

      // Snap to 0, 45, 90, 180, 270 deg
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (const snap of snapAngles) {
        if (Math.abs(angleDeg - snap) < 5) {
          angleDeg = snap % 360;
          break;
        }
      }

      onUpdateLayer(selectedLayer.id, { rotation: angleDeg });
    }
  };

  const handlePointerUp = () => {
    setDragState(null);
    setSnapGuides({});
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        // Deselect if clicking on empty workspace
        if (e.target === containerRef.current) {
          onSelectLayer(null);
        }
      }}
      className={`relative flex-1 bg-[#E4E4E7] overflow-auto flex items-center justify-center p-6 md:p-12 select-none ${
        isEyedropperActive ? 'cursor-crosshair' : ''
      }`}
    >
      {/* Drag & Drop Overlay Indicator with Choice Zones */}
      {isDraggingOver && (
        <div className="absolute inset-4 z-50 rounded-2xl bg-zinc-900/80 backdrop-blur-md flex items-center justify-center p-6 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDropTarget('photo');
              }}
              className={`p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition cursor-pointer ${
                dropTarget === 'photo'
                  ? 'border-white bg-white/20 scale-[1.02] shadow-xl'
                  : 'border-zinc-500 bg-zinc-800/40 text-zinc-400'
              }`}
            >
              <Upload className="w-8 h-8 text-white mb-2" />
              <h4 className="text-sm font-semibold text-white">Embed as Subject Photo</h4>
              <p className="text-[11px] text-zinc-300 mt-1">
                Adds new photo layer to move, resize and cutout
              </p>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDropTarget('bg');
              }}
              className={`p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition cursor-pointer ${
                dropTarget === 'bg'
                  ? 'border-white bg-white/20 scale-[1.02] shadow-xl'
                  : 'border-zinc-500 bg-zinc-800/40 text-zinc-400'
              }`}
            >
              <ImageIcon className="w-8 h-8 text-white mb-2" />
              <h4 className="text-sm font-semibold text-white">Set as Background</h4>
              <p className="text-[11px] text-zinc-300 mt-1">
                Replaces canvas backdrop behind your subjects
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Eyedropper Tool active banner */}
      {isEyedropperActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/90 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg backdrop-blur-md">
          <Pipette className="w-3.5 h-3.5 animate-bounce" />
          Click any color on your photo to erase background automatically
        </div>
      )}

      {/* Canvas Viewport Frame */}
      <div
        className="relative transition-transform duration-75 origin-center rounded-sm overflow-hidden bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-zinc-300/60"
        style={{
          width: dimensions.width * zoom,
          height: dimensions.height * zoom,
        }}
      >
        {/* Transparent Checkerboard Base */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #F4F4F5 25%, transparent 25%), 
              linear-gradient(-45deg, #F4F4F5 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #F4F4F5 75%), 
              linear-gradient(-45deg, transparent 75%, #F4F4F5 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            backgroundColor: '#FFFFFF',
          }}
        />

        {/* The Master HTML5 Rendering Canvas */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative z-10 w-full h-full block rounded-sm pointer-events-auto"
        />

        {/* Snapping Guidelines */}
        {snapGuides.x && (
          <div
            className="absolute top-0 bottom-0 z-30 pointer-events-none border-l-2 border-dashed border-zinc-900"
            style={{ left: `${(dimensions.width / 2) * zoom}px` }}
          />
        )}
        {snapGuides.y && (
          <div
            className="absolute left-0 right-0 z-30 pointer-events-none border-t-2 border-dashed border-zinc-900"
            style={{ top: `${(dimensions.height / 2) * zoom}px` }}
          />
        )}

        {/* Interactive Layer Transformation Overlay */}
        {!isEyedropperActive &&
          layers.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            const left = (layer.x - layer.width / 2) * zoom;
            const top = (layer.y - layer.height / 2) * zoom;
            const width = layer.width * zoom;
            const height = layer.height * zoom;

            return (
              <div
                key={layer.id}
                onPointerDown={(e) => handleLayerPointerDown(e, layer)}
                className={`absolute z-20 cursor-move transition-opacity ${
                  isSelected ? 'pointer-events-auto' : 'pointer-events-auto'
                }`}
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  transform: `rotate(${layer.rotation}deg) scale(${layer.scaleX}, ${layer.scaleY})`,
                  transformOrigin: 'center center',
                }}
              >
                {/* Selection Bounding Box & Handles */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-zinc-900 shadow-sm pointer-events-none">
                    {/* Top Action Badge */}
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900 text-white rounded-md p-1 shadow-lg text-[10px] pointer-events-auto"
                      style={{ transform: `scale(${layer.scaleX < 0 ? -1 : 1}, ${layer.scaleY < 0 ? -1 : 1})` }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateLayer(layer.id);
                        }}
                        title="Duplicate Layer"
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLayer(layer.id);
                        }}
                        title="Delete Layer"
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-3 bg-zinc-700 mx-0.5" />
                      <span className="px-1 font-mono text-[9px] text-zinc-400">
                        {Math.round(layer.width)}×{Math.round(layer.height)}
                      </span>
                    </div>

                    {/* Rotation Handle */}
                    <div
                      onPointerDown={handleRotatePointerDown}
                      title="Drag to Rotate"
                      className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-white text-zinc-900 rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing pointer-events-auto border border-zinc-300"
                    >
                      <RotateCw className="w-3 h-3" />
                    </div>

                    {/* Corner Resize Handles */}
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'nw')}
                      className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-zinc-900 rounded-full cursor-nwse-resize pointer-events-auto shadow-sm"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'ne')}
                      className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-zinc-900 rounded-full cursor-nesw-resize pointer-events-auto shadow-sm"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'sw')}
                      className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-zinc-900 rounded-full cursor-nesw-resize pointer-events-auto shadow-sm"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'se')}
                      className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-zinc-900 rounded-full cursor-nwse-resize pointer-events-auto shadow-sm"
                    />

                    {/* Edge Resize Handles */}
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'n')}
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-zinc-900 rounded cursor-ns-resize pointer-events-auto"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 's')}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-zinc-900 rounded cursor-ns-resize pointer-events-auto"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'w')}
                      className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-4 w-2 bg-white border border-zinc-900 rounded cursor-ew-resize pointer-events-auto"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, 'e')}
                      className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-4 w-2 bg-white border border-zinc-900 rounded cursor-ew-resize pointer-events-auto"
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Floating Bottom Quick Backdrop Bar & Zoom Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-zinc-200 px-3 py-1.5 rounded-full shadow-xl text-zinc-700 z-30 max-w-[95vw] overflow-x-auto no-scrollbar">
        {/* Quick Backdrops Thumbnails */}
        {onSelectPresetBackground && (
          <div className="flex items-center gap-1.5 pr-2 border-r border-zinc-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pl-1 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-zinc-400" />
              Backdrop:
            </span>
            <div className="flex items-center gap-1">
              {PRESET_BACKGROUNDS.slice(0, 5).map((preset) => {
                const isActive = bg.type === 'image' && bg.src === preset.url;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPresetBackground(preset.url)}
                    title={preset.name}
                    className={`w-6 h-6 rounded-full overflow-hidden border transition ${
                      isActive
                        ? 'ring-2 ring-zinc-900 border-white scale-110'
                        : 'border-zinc-300 hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.thumb} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>

            {onOpenBackgroundTab && (
              <button
                onClick={onOpenBackgroundTab}
                className="text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 px-2 py-0.5 hover:bg-zinc-100 rounded-md transition"
              >
                More...
              </button>
            )}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 pl-1">
          <button
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.1))}
            className="p-1 hover:bg-zinc-100 rounded text-zinc-600 hover:text-zinc-900 transition"
            title="Zoom Out"
          >
            <span className="font-mono text-xs font-bold leading-none">-</span>
          </button>
          <span className="text-xs font-mono font-semibold text-zinc-900 min-w-[36px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
            className="p-1 hover:bg-zinc-100 rounded text-zinc-600 hover:text-zinc-900 transition"
            title="Zoom In"
          >
            <span className="font-mono text-xs font-bold leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};
