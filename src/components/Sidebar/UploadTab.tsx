import React, { useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Palette,
  ArrowRight,
  Check,
} from 'lucide-react';
import { PRESET_BACKGROUNDS, PRESET_FOREGROUNDS } from '../../data/presets';
import { BackgroundSettings } from '../../types';

interface UploadTabProps {
  onUploadPhoto: (files: FileList | File[]) => void;
  onUploadBackground: (file: File) => void;
  onSelectPresetBackground: (url: string) => void;
  onSelectPresetForeground: (url: string) => void;
  bg: BackgroundSettings;
  onUpdateBg: (updates: Partial<BackgroundSettings>) => void;
  onNavigateToBackgrounds?: () => void;
}

export const UploadTab: React.FC<UploadTabProps> = ({
  onUploadPhoto,
  onUploadBackground,
  onSelectPresetBackground,
  onSelectPresetForeground,
  bg,
  onUpdateBg,
  onNavigateToBackgrounds,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* 1. Foreground Photo Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            1. Subject Photo
          </h3>
          <span className="text-[11px] text-zinc-400 font-mono">PNG, JPG, WebP</span>
        </div>

        {/* Drag and drop upload zone */}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUploadPhoto(e.target.files);
              e.target.value = '';
            }
          }}
        />

        <div
          onClick={() => photoInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100/40 transition group cursor-pointer text-center"
        >
          <Upload className="w-7 h-7 text-zinc-400 group-hover:text-zinc-600 mb-2 transition" />
          <span className="text-xs text-zinc-700 font-semibold group-hover:text-zinc-900">
            Drop subject photo here or browse
          </span>
          <span className="text-[10px] text-zinc-400 mt-0.5">
            Portraits, pets, products, or models
          </span>
        </div>

        {/* Sample Foregrounds */}
        <div className="pt-1">
          <p className="text-[11px] font-medium text-zinc-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            Or try with sample subjects:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_FOREGROUNDS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectPresetForeground(item.url)}
                className="group relative rounded-lg overflow-hidden border border-zinc-200 hover:border-zinc-900 aspect-square bg-zinc-100 transition focus:outline-none"
              >
                <img
                  src={item.thumb}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium truncate">
                    + {item.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-200" />

      {/* 2. Background Upload & Quick Selector Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            2. Choose Background
          </h3>
          {onNavigateToBackgrounds && (
            <button
              onClick={onNavigateToBackgrounds}
              className="text-[11px] font-semibold text-zinc-900 hover:underline flex items-center gap-1"
            >
              All Backdrops <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Upload Custom Background */}
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUploadBackground(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />

        <div
          onClick={() => bgInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100/40 transition group cursor-pointer text-center"
        >
          <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 mb-1 transition" />
          <span className="text-xs text-zinc-600 font-medium group-hover:text-zinc-900">
            Drop custom background image
          </span>
        </div>

        {/* Preset Quick Swatches */}
        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {PRESET_BACKGROUNDS.slice(0, 6).map((item) => {
            const isCurrent = bg.type === 'image' && bg.src === item.url;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPresetBackground(item.url)}
                className={`group relative rounded-lg overflow-hidden border aspect-[4/3] bg-zinc-100 transition focus:outline-none text-left ${
                  isCurrent ? 'border-zinc-900 ring-2 ring-zinc-900/20 shadow-sm' : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <img
                  src={item.thumb}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
                {isCurrent && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-1.5">
                  <span className="text-[10px] text-white font-medium block truncate">
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {onNavigateToBackgrounds && (
          <button
            onClick={onNavigateToBackgrounds}
            className="w-full py-2 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            Explore Studio Colors, Gradients & Patterns
          </button>
        )}
      </div>
    </div>
  );
};
