import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Palette,
  Sparkles,
  Upload,
  Search,
  Check,
  RotateCcw,
  Sliders,
  Maximize,
  FlipHorizontal,
  FlipVertical,
  Link,
  Layers,
  Grid,
  Sun,
  Eye,
} from 'lucide-react';
import {
  BackgroundSettings,
  BackgroundCategory,
  PresetBackground,
} from '../../types';
import {
  PRESET_BACKGROUNDS,
  PRESET_STUDIO_COLORS,
  PRESET_GRADIENTS,
  PRESET_PATTERNS,
} from '../../data/presets';

interface BackgroundTabProps {
  bg: BackgroundSettings;
  onUpdateBg: (updates: Partial<BackgroundSettings>) => void;
  onUploadBackground: (file: File) => void;
  onSelectPresetBackground: (url: string) => void;
}

type BgSubTab = 'photos' | 'colors' | 'gradients' | 'patterns' | 'upload';

export const BackgroundTab: React.FC<BackgroundTabProps> = ({
  bg,
  onUpdateBg,
  onUploadBackground,
  onSelectPresetBackground,
}) => {
  const [subTab, setSubTab] = useState<BgSubTab>('photos');
  const [selectedCategory, setSelectedCategory] = useState<BackgroundCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [customHex, setCustomHex] = useState(bg.color || '#FFFFFF');
  const [customGradientColors, setCustomGradientColors] = useState<[string, string]>(
    bg.gradient?.colors && bg.gradient.colors.length >= 2
      ? [bg.gradient.colors[0], bg.gradient.colors[1]]
      : ['#3B82F6', '#8B5CF6']
  );
  const [customGradientAngle, setCustomGradientAngle] = useState(bg.gradient?.angle ?? 135);
  const [customGradientType, setCustomGradientType] = useState<'linear' | 'radial'>(
    bg.gradient?.type ?? 'linear'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter preset backdrops
  const filteredPresets = PRESET_BACKGROUNDS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories: { id: BackgroundCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'studio', label: 'Studio' },
    { id: 'nature', label: 'Nature' },
    { id: 'urban', label: 'City' },
    { id: 'interior', label: 'Interior' },
    { id: 'texture', label: 'Textures' },
    { id: 'gradients', label: 'Gradients' },
    { id: 'abstract', label: 'Abstract' },
  ];

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSelectPresetBackground(urlInput.trim());
    setUrlInput('');
  };

  const handleCustomColorApply = (hex: string) => {
    setCustomHex(hex);
    onUpdateBg({
      type: 'color',
      color: hex,
    });
  };

  const handleCustomGradientApply = (
    colors: [string, string],
    angle: number,
    type: 'linear' | 'radial'
  ) => {
    setCustomGradientColors(colors);
    setCustomGradientAngle(angle);
    setCustomGradientType(type);
    onUpdateBg({
      type: 'gradient',
      gradient: {
        type,
        colors: [colors[0], colors[1]],
        angle,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Background Category Sub-navigation */}
      <div className="flex rounded-lg bg-zinc-100 p-1 gap-1">
        <button
          onClick={() => setSubTab('photos')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            subTab === 'photos'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Photos</span>
        </button>
        <button
          onClick={() => setSubTab('colors')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            subTab === 'colors'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors</span>
        </button>
        <button
          onClick={() => setSubTab('gradients')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            subTab === 'gradients'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gradients</span>
        </button>
        <button
          onClick={() => setSubTab('patterns')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            subTab === 'patterns'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Patterns</span>
        </button>
        <button
          onClick={() => setSubTab('upload')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            subTab === 'upload'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* SUB-TAB 1: CURATED PHOTO BACKDROPS */}
      {subTab === 'photos' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search backdrops (beach, studio, cafe...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1 px-2.5 rounded-full text-[11px] font-medium whitespace-nowrap transition border ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Preset Photo Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredPresets.map((item) => {
              const isSelected = bg.type === 'image' && bg.src === item.url;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPresetBackground(item.url)}
                  className={`group relative rounded-lg overflow-hidden border aspect-[4/3] bg-zinc-100 transition focus:outline-none text-left ${
                    isSelected
                      ? 'border-zinc-900 ring-2 ring-zinc-900/20 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <img
                    src={item.thumb}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5">
                    <span className="text-[10px] text-white font-medium block truncate">
                      {item.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredPresets.length === 0 && (
            <div className="p-6 text-center text-zinc-400 bg-zinc-50 rounded-lg border border-zinc-200">
              <p className="text-xs">No backdrops matched &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-zinc-900 underline mt-1 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SOLID STUDIO COLORS */}
      {subTab === 'colors' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Studio Color Palettes
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_STUDIO_COLORS.map((col) => {
                const isSelected = bg.type === 'color' && bg.color?.toUpperCase() === col.hex.toUpperCase();
                return (
                  <button
                    key={col.hex}
                    onClick={() => handleCustomColorApply(col.hex)}
                    title={col.name}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center p-1 relative transition group ${
                      isSelected
                        ? 'border-zinc-900 ring-2 ring-zinc-900/20 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && (
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shadow ${
                          col.dark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-zinc-100" />

          {/* Custom Color Picker & Hex */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Custom Hex Color
            </h4>
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-9 rounded-md border border-zinc-200 overflow-hidden shrink-0 cursor-pointer shadow-inner">
                <input
                  type="color"
                  value={bg.color || customHex}
                  onChange={(e) => handleCustomColorApply(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: bg.color || customHex }}
                />
              </div>
              <input
                type="text"
                value={bg.type === 'color' ? bg.color || customHex : customHex}
                onChange={(e) => handleCustomColorApply(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Transparent Background Option */}
          <div className="pt-1">
            <button
              onClick={() => onUpdateBg({ type: 'transparent' })}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition ${
                bg.type === 'transparent'
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded border border-zinc-300 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:6px_6px] bg-[position:0_0,0_3px,3px_-3px,-3px_0]" />
              Transparent Canvas (PNG Cutout Mode)
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GRADIENTS & MESHES */}
      {subTab === 'gradients' && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Preset Atmosphere Gradients
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_GRADIENTS.map((g) => {
              const isSelected =
                bg.type === 'gradient' &&
                bg.gradient?.colors[0] === g.colors[0] &&
                bg.gradient?.colors[1] === g.colors[1];

              const gradStyle =
                g.type === 'linear'
                  ? `linear-gradient(${g.angle}deg, ${g.colors.join(', ')})`
                  : `radial-gradient(circle, ${g.colors.join(', ')})`;

              return (
                <button
                  key={g.name}
                  onClick={() =>
                    onUpdateBg({
                      type: 'gradient',
                      gradient: {
                        type: g.type,
                        colors: g.colors,
                        angle: g.angle,
                      },
                    })
                  }
                  className={`h-16 rounded-lg border p-2 relative flex flex-col justify-end text-left transition ${
                    isSelected
                      ? 'border-zinc-900 ring-2 ring-zinc-900/20 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                  style={{ background: gradStyle }}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                  <span className="text-[10px] font-semibold text-white drop-shadow-md truncate">
                    {g.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-zinc-100" />

          {/* Custom 2-Color Gradient Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Custom Gradient Generator
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">Color A</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customGradientColors[0]}
                    onChange={(e) =>
                      handleCustomGradientApply(
                        [e.target.value, customGradientColors[1]],
                        customGradientAngle,
                        customGradientType
                      )
                    }
                    className="w-8 h-8 rounded border border-zinc-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customGradientColors[0]}
                    onChange={(e) =>
                      handleCustomGradientApply(
                        [e.target.value, customGradientColors[1]],
                        customGradientAngle,
                        customGradientType
                      )
                    }
                    className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">Color B</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customGradientColors[1]}
                    onChange={(e) =>
                      handleCustomGradientApply(
                        [customGradientColors[0], e.target.value],
                        customGradientAngle,
                        customGradientType
                      )
                    }
                    className="w-8 h-8 rounded border border-zinc-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customGradientColors[1]}
                    onChange={(e) =>
                      handleCustomGradientApply(
                        [customGradientColors[0], e.target.value],
                        customGradientAngle,
                        customGradientType
                      )
                    }
                    className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Angle Slider */}
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Gradient Direction Angle</span>
                <span className="font-mono text-zinc-900 font-medium">{customGradientAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={customGradientAngle}
                onChange={(e) =>
                  handleCustomGradientApply(
                    customGradientColors,
                    Number(e.target.value),
                    customGradientType
                  )
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PROCEDURAL PATTERNS & STAGES */}
      {subTab === 'patterns' && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Procedural Patterns & Backdrops
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_PATTERNS.map((p) => {
              const isSelected = bg.type === 'pattern' && bg.pattern?.type === p.type;
              return (
                <button
                  key={p.id}
                  onClick={() =>
                    onUpdateBg({
                      type: 'pattern',
                      pattern: {
                        type: p.type,
                        color: p.color,
                        bgColor: p.bgColor,
                        size: p.size,
                      },
                    })
                  }
                  className={`p-3 rounded-lg border text-left transition flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-zinc-100 border-zinc-900 ring-2 ring-zinc-900/20 shadow-sm'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-900">{p.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900" />}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {p.type} mode
                  </span>
                </button>
              );
            })}
          </div>

          {bg.type === 'pattern' && bg.pattern && (
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Pattern Density / Scale</span>
                <span className="font-mono text-zinc-900">{bg.pattern.size} px</span>
              </div>
              <input
                type="range"
                min="12"
                max="80"
                value={bg.pattern.size}
                onChange={(e) =>
                  onUpdateBg({
                    type: 'pattern',
                    pattern: { ...bg.pattern!, size: Number(e.target.value) },
                  })
                }
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: UPLOAD CUSTOM & IMPORT FROM URL */}
      {subTab === 'upload' && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
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
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100/40 transition group cursor-pointer text-center"
          >
            <Upload className="w-7 h-7 text-zinc-400 group-hover:text-zinc-600 mb-2 transition" />
            <span className="text-xs text-zinc-700 font-medium group-hover:text-zinc-900">
              Click to browse custom backdrop
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">
              JPG, PNG, WebP up to 25MB
            </span>
          </div>

          <div className="h-px bg-zinc-100" />

          {/* Import from Image URL */}
          <form onSubmit={handleApplyUrl} className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-zinc-400" />
              Import from Web URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
              />
              <button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-md transition"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="h-px bg-zinc-200" />

      {/* 2. BACKGROUND ADJUSTMENT, POSITION & DSLR BOKEH CONTROLS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            Backdrop Depth & Optics
          </h4>
          <button
            onClick={() =>
              onUpdateBg({
                blur: 0,
                brightness: 100,
                contrast: 100,
                saturation: 100,
                vignette: 15,
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                flipX: false,
                flipY: false,
              })
            }
            className="text-[10px] text-zinc-400 hover:text-zinc-800 flex items-center gap-1 font-medium transition"
            title="Reset backdrop properties"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* DSLR Bokeh Depth Blur Slider */}
        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span className="font-medium text-zinc-700">DSLR Bokeh Blur (Depth of Field)</span>
            <span className="font-mono text-zinc-900 font-medium">{bg.blur} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="35"
            value={bg.blur}
            onChange={(e) => onUpdateBg({ blur: Number(e.target.value) })}
            className="w-full accent-zinc-900 cursor-pointer"
          />
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Blurs backdrop to make your foreground subject pop with optical depth.
          </p>
        </div>

        {/* Zoom Scale & Flip */}
        <div className="space-y-3 pt-1">
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Zoom Scale</span>
              <span className="font-mono text-zinc-900 font-medium">
                {Math.round((bg.scale || 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="2.5"
              step="0.05"
              value={bg.scale || 1}
              onChange={(e) => onUpdateBg({ scale: Number(e.target.value) })}
              className="w-full accent-zinc-900 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateBg({ flipX: !bg.flipX })}
              className={`py-1.5 px-2 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition ${
                bg.flipX
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              Flip Horizontal
            </button>
            <button
              onClick={() => onUpdateBg({ flipY: !bg.flipY })}
              className={`py-1.5 px-2 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition ${
                bg.flipY
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              <FlipVertical className="w-3.5 h-3.5" />
              Flip Vertical
            </button>
          </div>
        </div>

        {/* Backdrop Lighting Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-1">
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
            <span>Vignette Edge Shadow</span>
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
    </div>
  );
};
