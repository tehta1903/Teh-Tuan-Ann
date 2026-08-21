export type MaskShape = 'none' | 'circle' | 'rounded-rect' | 'heart' | 'star' | 'hexagon' | 'ellipse' | 'polygon';

export interface PhotoFilter {
  brightness: number; // 0 to 200, default 100
  contrast: number;   // 0 to 200, default 100
  saturation: number; // 0 to 200, default 100
  warmth: number;     // -100 to 100, default 0
  tint: number;       // -100 to 100, default 0
  exposure: number;   // -100 to 100, default 0
  sepia: number;      // 0 to 100, default 0
  hueRotate: number;  // 0 to 360, default 0
  blur: number;       // 0 to 20, default 0
  opacity: number;    // 0 to 100, default 100
}

export interface ShadowSettings {
  enabled: boolean;
  color: string;
  blur: number;       // 0 to 50
  offsetX: number;    // -50 to 50
  offsetY: number;    // -50 to 50
  opacity: number;    // 0 to 100
}

export interface BorderSettings {
  enabled: boolean;
  color: string;
  width: number;      // 1 to 30
  radius: number;     // 0 to 100
  style: 'solid' | 'dashed' | 'dotted';
}

export interface CutoutSettings {
  maskShape: MaskShape;
  feather: number;         // 0 to 50 px edge smoothing
  colorKeyActive: boolean;
  keyColor: string;        // hex color to remove
  tolerance: number;       // 0 to 100
  smoothness: number;      // 0 to 50
  polygonPoints?: { x: number; y: number }[]; // normalized 0-1 points for polygon cutout
}

export interface PhotoLayer {
  id: string;
  name: string;
  src: string;
  originalWidth: number;
  originalHeight: number;
  x: number;               // center X relative to canvas
  y: number;               // center Y relative to canvas
  width: number;
  height: number;
  rotation: number;        // degrees
  scaleX: number;          // 1 or -1 for flip
  scaleY: number;          // 1 or -1 for flip
  zIndex: number;
  visible: boolean;
  locked: boolean;
  blendMode: GlobalCompositeOperation;
  filters: PhotoFilter;
  shadow: ShadowSettings;
  border: BorderSettings;
  cutout: CutoutSettings;
}

export interface BackgroundPattern {
  type: 'dots' | 'grid' | 'stripes' | 'spotlight' | 'squares';
  color: string;
  bgColor: string;
  size: number;
}

export interface BackgroundSettings {
  type: 'image' | 'color' | 'gradient' | 'pattern' | 'transparent';
  src?: string;
  originalWidth?: number;
  originalHeight?: number;
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle: number;
  };
  pattern?: BackgroundPattern;
  blur: number;            // 0 to 40 px (for DSLR bokeh effect)
  brightness: number;      // 0 to 200, default 100
  contrast: number;        // 0 to 200, default 100
  saturation: number;      // 0 to 200, default 100
  vignette: number;        // 0 to 100
  scale: number;           // zoom background
  offsetX: number;
  offsetY: number;
  flipX?: boolean;
  flipY?: boolean;
}

export interface CanvasDimensions {
  width: number;
  height: number;
  aspectRatio: string; // 'custom' | '1:1' | '4:5' | '16:9' | '9:16' | '4:3' | 'original'
}

export type ActiveTab = 'photos' | 'background' | 'cutout' | 'transform' | 'adjust' | 'effects' | 'layers';

export type BackgroundCategory = 'all' | 'studio' | 'nature' | 'urban' | 'interior' | 'texture' | 'abstract' | 'gradients';

export interface PresetBackground {
  id: string;
  name: string;
  category: 'nature' | 'studio' | 'urban' | 'abstract' | 'interior' | 'texture' | 'gradients';
  thumb: string;
  url: string;
  tags?: string[];
}

export interface PresetForeground {
  id: string;
  name: string;
  thumb: string;
  url: string;
  hasCutout?: boolean;
}
