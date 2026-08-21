import React from 'react';
import {
  ActiveTab,
  BackgroundSettings,
  PhotoLayer,
  CanvasDimensions,
} from '../../types';
import { UploadTab } from './UploadTab';
import { BackgroundTab } from './BackgroundTab';
import { CutoutTab } from './CutoutTab';
import { TransformTab } from './TransformTab';
import { AdjustTab } from './AdjustTab';
import { LayersPanel } from './LayersPanel';
import {
  Upload,
  Image as ImageIcon,
  Scissors,
  Move,
  Sliders,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  bg: BackgroundSettings;
  onUpdateBg: (updates: Partial<BackgroundSettings>) => void;
  layers: PhotoLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<PhotoLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onMoveLayerOrder: (id: string, direction: 'up' | 'down') => void;
  onUploadPhoto: (files: FileList | File[]) => void;
  onUploadBackground: (file: File) => void;
  onSelectPresetBackground: (url: string) => void;
  onSelectPresetForeground: (url: string) => void;
  dimensions: CanvasDimensions;
  isEyedropperActive: boolean;
  onToggleEyedropper: () => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'photos', label: 'Photo', icon: <Upload className="w-3.5 h-3.5" /> },
  { id: 'background', label: 'Backdrop', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { id: 'cutout', label: 'Cutout', icon: <Scissors className="w-3.5 h-3.5" /> },
  { id: 'transform', label: 'Transform', icon: <Move className="w-3.5 h-3.5" /> },
  { id: 'adjust', label: 'Lighting', icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: 'layers', label: 'Layers', icon: <Layers className="w-3.5 h-3.5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  bg,
  onUpdateBg,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayerOrder,
  onUploadPhoto,
  onUploadBackground,
  onSelectPresetBackground,
  onSelectPresetForeground,
  dimensions,
  isEyedropperActive,
  onToggleEyedropper,
}) => {
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  return (
    <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-zinc-200 flex flex-col h-auto lg:h-[calc(100vh-4rem)] shrink-0 z-20 select-none">
      {/* Top Tab Bar */}
      <div className="flex items-center border-b border-zinc-200 bg-zinc-50/80 p-1.5 gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[50px] py-1.5 px-1.5 rounded-md text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition ${
                isActive
                  ? 'bg-white text-zinc-900 border border-zinc-200 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'layers' && layers.length > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-200 text-[9px] text-zinc-700 flex items-center justify-center font-mono">
                  {layers.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 md:p-5 overflow-y-auto flex-1 custom-scrollbar">
        {activeTab === 'photos' && (
          <UploadTab
            onUploadPhoto={onUploadPhoto}
            onUploadBackground={onUploadBackground}
            onSelectPresetBackground={onSelectPresetBackground}
            onSelectPresetForeground={onSelectPresetForeground}
            bg={bg}
            onUpdateBg={onUpdateBg}
            onNavigateToBackgrounds={() => onTabChange('background')}
          />
        )}

        {activeTab === 'background' && (
          <BackgroundTab
            bg={bg}
            onUpdateBg={onUpdateBg}
            onUploadBackground={onUploadBackground}
            onSelectPresetBackground={onSelectPresetBackground}
          />
        )}

        {activeTab === 'cutout' && (
          <CutoutTab
            layer={selectedLayer}
            onUpdateLayer={onUpdateLayer}
            isEyedropperActive={isEyedropperActive}
            onToggleEyedropper={onToggleEyedropper}
          />
        )}

        {activeTab === 'transform' && (
          <TransformTab
            layer={selectedLayer}
            onUpdateLayer={onUpdateLayer}
            dimensions={dimensions}
          />
        )}

        {activeTab === 'adjust' && (
          <AdjustTab
            layer={selectedLayer}
            onUpdateLayer={onUpdateLayer}
            bg={bg}
            onUpdateBg={onUpdateBg}
          />
        )}

        {activeTab === 'layers' && (
          <LayersPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={onSelectLayer}
            onUpdateLayer={onUpdateLayer}
            onDeleteLayer={onDeleteLayer}
            onDuplicateLayer={onDuplicateLayer}
            onMoveLayerOrder={onMoveLayerOrder}
          />
        )}
      </div>

      {/* Footer Status */}
      <div className="mt-auto p-3 border-t border-zinc-100 bg-white">
        <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest font-mono">
          Clean Studio Canvas Engine
        </p>
      </div>
    </aside>
  );
};
