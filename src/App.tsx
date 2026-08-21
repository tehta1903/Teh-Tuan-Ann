import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PhotoLayer,
  BackgroundSettings,
  CanvasDimensions,
  ActiveTab,
} from './types';
import { PRESET_BACKGROUNDS, PRESET_FOREGROUNDS } from './data/presets';
import { Header } from './components/Header';
import { CanvasArea } from './components/CanvasArea';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ExportModal } from './components/ExportModal';

interface HistorySnapshot {
  bg: BackgroundSettings;
  layers: PhotoLayer[];
  dimensions: CanvasDimensions;
}

const DEFAULT_BG: BackgroundSettings = {
  type: 'image',
  src: PRESET_BACKGROUNDS[0].url,
  originalWidth: 1600,
  originalHeight: 1067,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  vignette: 15,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

const DEFAULT_LAYER: PhotoLayer = {
  id: 'layer-initial',
  name: 'Subject Portrait',
  src: PRESET_FOREGROUNDS[0].url,
  originalWidth: 1200,
  originalHeight: 1600,
  x: 450,
  y: 350,
  width: 380,
  height: 506,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  zIndex: 1,
  visible: true,
  locked: false,
  blendMode: 'source-over',
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
  shadow: {
    enabled: true,
    color: 'rgba(0, 0, 0, 0.45)',
    blur: 24,
    offsetX: 0,
    offsetY: 16,
    opacity: 50,
  },
  border: {
    enabled: false,
    color: '#ffffff',
    width: 4,
    radius: 20,
    style: 'solid',
  },
  cutout: {
    maskShape: 'rounded-rect',
    feather: 0,
    colorKeyActive: false,
    keyColor: '#ffffff',
    tolerance: 30,
    smoothness: 10,
  },
};

export default function App() {
  const [bg, setBg] = useState<BackgroundSettings>(DEFAULT_BG);
  const [layers, setLayers] = useState<PhotoLayer[]>([DEFAULT_LAYER]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(DEFAULT_LAYER.id);
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 900,
    height: 600,
    aspectRatio: 'original',
  });
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<ActiveTab>('photos');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);

  // History Undo / Redo
  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<HistorySnapshot[]>([]);

  // Push snapshot to history
  const pushHistory = useCallback(() => {
    setUndoStack((prev) => [
      ...prev.slice(-25),
      {
        bg: JSON.parse(JSON.stringify(bg)),
        layers: JSON.parse(JSON.stringify(layers)),
        dimensions: { ...dimensions },
      },
    ]);
    setRedoStack([]);
  }, [bg, layers, dimensions]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);

    setRedoStack((prev) => [
      ...prev,
      {
        bg: JSON.parse(JSON.stringify(bg)),
        layers: JSON.parse(JSON.stringify(layers)),
        dimensions: { ...dimensions },
      },
    ]);

    setBg(previous.bg);
    setLayers(previous.layers);
    setDimensions(previous.dimensions);
    setUndoStack(newUndo);
  }, [undoStack, bg, layers, dimensions]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);

    setUndoStack((prev) => [
      ...prev,
      {
        bg: JSON.parse(JSON.stringify(bg)),
        layers: JSON.parse(JSON.stringify(layers)),
        dimensions: { ...dimensions },
      },
    ]);

    setBg(next.bg);
    setLayers(next.layers);
    setDimensions(next.dimensions);
    setRedoStack(newRedo);
  }, [redoStack, bg, layers, dimensions]);

  // Update Background
  const handleUpdateBg = (updates: Partial<BackgroundSettings>) => {
    pushHistory();
    setBg((prev) => ({ ...prev, ...updates }));
  };

  // Select Preset Background
  const handleSelectPresetBackground = (url: string) => {
    pushHistory();
    setBg((prev) => ({
      ...prev,
      type: 'image',
      src: url,
    }));
  };

  // Select Preset Foreground Photo
  const handleSelectPresetForeground = (url: string) => {
    pushHistory();
    const newLayerId = `layer-${Date.now()}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origW = img.naturalWidth || 800;
      const origH = img.naturalHeight || 800;
      const aspect = origW / origH;

      let drawW = dimensions.width * 0.45;
      let drawH = drawW / aspect;

      const newLayer: PhotoLayer = {
        id: newLayerId,
        name: `Photo ${layers.length + 1}`,
        src: url,
        originalWidth: origW,
        originalHeight: origH,
        x: Math.round(dimensions.width / 2),
        y: Math.round(dimensions.height / 2),
        width: Math.round(drawW),
        height: Math.round(drawH),
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layers.length + 1,
        visible: true,
        locked: false,
        blendMode: 'source-over',
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
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.4)',
          blur: 20,
          offsetX: 0,
          offsetY: 12,
          opacity: 50,
        },
        border: {
          enabled: false,
          color: '#ffffff',
          width: 4,
          radius: 16,
          style: 'solid',
        },
        cutout: {
          maskShape: 'none',
          feather: 0,
          colorKeyActive: false,
          keyColor: '#ffffff',
          tolerance: 30,
          smoothness: 10,
        },
      };

      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayerId);
      setActiveTab('cutout');
    };
    img.src = url;
  };

  // Upload user foreground photo (supports multiple or single)
  const handleUploadPhoto = (files: FileList | File[]) => {
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        const img = new Image();
        img.onload = () => {
          pushHistory();
          const newLayerId = `layer-${Date.now()}-${index}`;
          const origW = img.naturalWidth || 800;
          const origH = img.naturalHeight || 800;
          const aspect = origW / origH;

          let drawW = dimensions.width * 0.45;
          let drawH = drawW / aspect;

          const newLayer: PhotoLayer = {
            id: newLayerId,
            name: file.name.replace(/\.[^/.]+$/, '').slice(0, 20) || `Photo ${layers.length + 1}`,
            src: dataUrl,
            originalWidth: origW,
            originalHeight: origH,
            x: Math.round(dimensions.width / 2 + (index * 30)),
            y: Math.round(dimensions.height / 2 + (index * 30)),
            width: Math.round(drawW),
            height: Math.round(drawH),
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: layers.length + 1,
            visible: true,
            locked: false,
            blendMode: 'source-over',
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
            shadow: {
              enabled: true,
              color: 'rgba(0, 0, 0, 0.4)',
              blur: 20,
              offsetX: 0,
              offsetY: 12,
              opacity: 50,
            },
            border: {
              enabled: false,
              color: '#ffffff',
              width: 4,
              radius: 16,
              style: 'solid',
            },
            cutout: {
              maskShape: 'none',
              feather: 0,
              colorKeyActive: false,
              keyColor: '#ffffff',
              tolerance: 30,
              smoothness: 10,
            },
          };

          setLayers((prev) => [...prev, newLayer]);
          setSelectedLayerId(newLayerId);
          setActiveTab('cutout');
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload user background photo
  const handleUploadBackground = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        pushHistory();
        setBg((prev) => ({
          ...prev,
          type: 'image',
          src: dataUrl,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
        }));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Layer CRUD
  const handleUpdateLayer = (id: string, updates: Partial<PhotoLayer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const handleDeleteLayer = (id: string) => {
    pushHistory();
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleDuplicateLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    pushHistory();
    const newId = `layer-${Date.now()}`;
    const duplicated: PhotoLayer = {
      ...JSON.parse(JSON.stringify(layer)),
      id: newId,
      name: `${layer.name} (Copy)`,
      x: layer.x + 25,
      y: layer.y + 25,
      zIndex: layers.length + 1,
    };

    setLayers((prev) => [...prev, duplicated]);
    setSelectedLayerId(newId);
  };

  const handleMoveLayerOrder = (id: string, direction: 'up' | 'down') => {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1) return;

    pushHistory();
    const newLayers = [...layers];
    if (direction === 'up' && idx < newLayers.length - 1) {
      const temp = newLayers[idx].zIndex;
      newLayers[idx].zIndex = newLayers[idx + 1].zIndex;
      newLayers[idx + 1].zIndex = temp;
      const item = newLayers.splice(idx, 1)[0];
      newLayers.splice(idx + 1, 0, item);
    } else if (direction === 'down' && idx > 0) {
      const temp = newLayers[idx].zIndex;
      newLayers[idx].zIndex = newLayers[idx - 1].zIndex;
      newLayers[idx - 1].zIndex = temp;
      const item = newLayers.splice(idx, 1)[0];
      newLayers.splice(idx - 1, 0, item);
    }

    setLayers(newLayers);
  };

  // Aspect Ratio change
  const handleAspectRatioChange = (ratioVal: string) => {
    pushHistory();
    let newW = 900;
    let newH = 600;

    if (ratioVal === '1:1') {
      newW = 750;
      newH = 750;
    } else if (ratioVal === '4:5') {
      newW = 640;
      newH = 800;
    } else if (ratioVal === '16:9') {
      newW = 960;
      newH = 540;
    } else if (ratioVal === '9:16') {
      newW = 540;
      newH = 960;
    } else if (ratioVal === '4:3') {
      newW = 800;
      newH = 600;
    } else if (ratioVal === 'original') {
      newW = 900;
      newH = 600;
    }

    setDimensions({
      width: newW,
      height: newH,
      aspectRatio: ratioVal,
    });
  };

  // Reset all to clean defaults
  const handleResetAll = () => {
    pushHistory();
    setBg(DEFAULT_BG);
    setLayers([DEFAULT_LAYER]);
    setSelectedLayerId(DEFAULT_LAYER.id);
    setDimensions({ width: 900, height: 600, aspectRatio: 'original' });
    setZoom(1);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when typing in text inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId) {
          e.preventDefault();
          handleDeleteLayer(selectedLayerId);
        }
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedLayerId) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 2;
          const layer = layers.find((l) => l.id === selectedLayerId);
          if (!layer) return;

          let deltaX = 0;
          let deltaY = 0;
          if (e.key === 'ArrowLeft') deltaX = -step;
          if (e.key === 'ArrowRight') deltaX = step;
          if (e.key === 'ArrowUp') deltaY = -step;
          if (e.key === 'ArrowDown') deltaY = step;

          handleUpdateLayer(selectedLayerId, {
            x: layer.x + deltaX,
            y: layer.y + deltaY,
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedLayerId, layers]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F4F4F5] text-[#18181B] overflow-hidden select-none font-sans">
      {/* Top Application Header */}
      <Header
        aspectRatio={dimensions.aspectRatio}
        onAspectRatioChange={handleAspectRatioChange}
        zoom={zoom}
        onZoomChange={setZoom}
        onResetZoom={() => setZoom(1)}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onResetAll={handleResetAll}
        onOpenExport={() => setIsExportModalOpen(true)}
        layerCount={layers.length}
      />

      {/* Main Workspace Area: Canvas + Sidebar */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Interactive Canvas View */}
        <CanvasArea
          bg={bg}
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onUploadPhoto={handleUploadPhoto}
          onUploadBackground={handleUploadBackground}
          onSelectPresetBackground={handleSelectPresetBackground}
          onOpenBackgroundTab={() => setActiveTab('background')}
          dimensions={dimensions}
          zoom={zoom}
          onZoomChange={setZoom}
          isEyedropperActive={isEyedropperActive}
          onEyedropperPick={(colorHex) => {
            if (selectedLayerId) {
              const layer = layers.find((l) => l.id === selectedLayerId);
              if (layer) {
                handleUpdateLayer(selectedLayerId, {
                  cutout: {
                    ...layer.cutout,
                    colorKeyActive: true,
                    keyColor: colorHex,
                  },
                });
              }
            }
            setIsEyedropperActive(false);
          }}
        />

        {/* Right Editing Control Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bg={bg}
          onUpdateBg={handleUpdateBg}
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onMoveLayerOrder={handleMoveLayerOrder}
          onUploadPhoto={handleUploadPhoto}
          onUploadBackground={handleUploadBackground}
          onSelectPresetBackground={handleSelectPresetBackground}
          onSelectPresetForeground={handleSelectPresetForeground}
          dimensions={dimensions}
          isEyedropperActive={isEyedropperActive}
          onToggleEyedropper={() => setIsEyedropperActive((prev) => !prev)}
        />
      </main>

      {/* High-Resolution Export / Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        bg={bg}
        layers={layers}
        dimensions={dimensions}
      />
    </div>
  );
}
