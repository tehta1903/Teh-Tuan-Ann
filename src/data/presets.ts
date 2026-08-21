import { PresetBackground, PresetForeground } from '../types';

export const PRESET_BACKGROUNDS: PresetBackground[] = [
  // STUDIO & MINIMALIST
  {
    id: 'bg-studio-warm',
    name: 'Warm Studio Curve',
    category: 'studio',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=85',
    tags: ['studio', 'warm', 'minimal', 'podium'],
  },
  {
    id: 'bg-minimal-arch',
    name: 'Minimal White Arch',
    category: 'studio',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85',
    tags: ['white', 'architecture', 'podium', 'clean'],
  },
  {
    id: 'bg-dark-slate',
    name: 'Dark Slate Studio Wall',
    category: 'studio',
    thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&q=85',
    tags: ['dark', 'charcoal', 'portrait', 'texture'],
  },
  {
    id: 'bg-studio-concrete',
    name: 'Grey Concrete Wall',
    category: 'studio',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=85',
    tags: ['concrete', 'neutral', 'urban', 'modern'],
  },
  {
    id: 'bg-pastel-podium',
    name: 'Pastel Pedestal Stage',
    category: 'studio',
    thumb: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&q=85',
    tags: ['product', 'pastel', 'stage', 'minimal'],
  },

  // NATURE & OUTDOORS
  {
    id: 'bg-sunset-beach',
    name: 'Golden Sunset Beach',
    category: 'nature',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85',
    tags: ['ocean', 'summer', 'sunset', 'beach'],
  },
  {
    id: 'bg-misty-mountains',
    name: 'Misty Alpine Vista',
    category: 'nature',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85',
    tags: ['mountains', 'fog', 'epic', 'landscape'],
  },
  {
    id: 'bg-lush-forest',
    name: 'Sunlit Forest Grove',
    category: 'nature',
    thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85',
    tags: ['trees', 'green', 'sunlight', 'woods'],
  },
  {
    id: 'bg-cherry-blossom',
    name: 'Cherry Blossom Park',
    category: 'nature',
    thumb: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1600&q=85',
    tags: ['spring', 'flowers', 'pink', 'japan'],
  },
  {
    id: 'bg-tropical-palms',
    name: 'Tropical Palm Shadows',
    category: 'nature',
    thumb: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=1600&q=85',
    tags: ['palms', 'summer', 'resort', 'vacation'],
  },

  // URBAN & CITYSCAPES
  {
    id: 'bg-tokyo-neon',
    name: 'Cyberpunk Neon City',
    category: 'urban',
    thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=85',
    tags: ['neon', 'tokyo', 'cyberpunk', 'night'],
  },
  {
    id: 'bg-city-skyline',
    name: 'Modern Rooftop Skyline',
    category: 'urban',
    thumb: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1600&q=85',
    tags: ['downtown', 'skyscrapers', 'sunset', 'city'],
  },
  {
    id: 'bg-brooklyn-bridge',
    name: 'Metropolitan Street',
    category: 'urban',
    thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85',
    tags: ['glass', 'buildings', 'business', 'modern'],
  },

  // COZY INTERIORS & LIVING
  {
    id: 'bg-cozy-cafe',
    name: 'Aesthetic Coffee Shop',
    category: 'interior',
    thumb: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=85',
    tags: ['cafe', 'coffee', 'warm', 'bokeh'],
  },
  {
    id: 'bg-luxury-loft',
    name: 'Luxury Penthouse Lounge',
    category: 'interior',
    thumb: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=85',
    tags: ['interior', 'living room', 'modern', 'home'],
  },
  {
    id: 'bg-sunlit-library',
    name: 'Sunlit Vintage Study',
    category: 'interior',
    thumb: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=85',
    tags: ['books', 'library', 'wood', 'warm'],
  },
  {
    id: 'bg-art-gallery',
    name: 'Minimalist Art Gallery',
    category: 'interior',
    thumb: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1600&q=85',
    tags: ['gallery', 'white', 'modern', 'museum'],
  },

  // TEXTURES & MATERIALS
  {
    id: 'bg-carrara-marble',
    name: 'White Carrara Marble',
    category: 'texture',
    thumb: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=85',
    tags: ['marble', 'luxury', 'stone', 'clean'],
  },
  {
    id: 'bg-silk-fabric',
    name: 'Soft Draped Silk',
    category: 'texture',
    thumb: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=1600&q=85',
    tags: ['fabric', 'silk', 'folds', 'smooth'],
  },
  {
    id: 'bg-warm-wood',
    name: 'Artisan Wood Surface',
    category: 'texture',
    thumb: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=1600&q=85',
    tags: ['wood', 'rustic', 'tabletop', 'warm'],
  },

  // ABSTRACT & 3D
  {
    id: 'bg-abstract-waves',
    name: 'Fluid Chrome Waves',
    category: 'abstract',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=85',
    tags: ['abstract', '3d', 'fluid', 'futuristic'],
  },
  {
    id: 'bg-abstract-geometry',
    name: 'Geometric Spheres & Arches',
    category: 'abstract',
    thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=85',
    tags: ['geometry', 'shapes', 'pastel', 'modern'],
  },

  // GRADIENTS & ATMOSPHERE
  {
    id: 'bg-gradient-aurora',
    name: 'Aurora Glow',
    category: 'gradients',
    thumb: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=85',
    tags: ['gradient', 'aurora', 'vibrant', 'color'],
  },
  {
    id: 'bg-gradient-sunset',
    name: 'Warm Sunset Mist',
    category: 'gradients',
    thumb: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=85',
    tags: ['sunset', 'orange', 'purple', 'glow'],
  },
  {
    id: 'bg-gradient-cyber',
    name: 'Neon Violet Gradient',
    category: 'gradients',
    thumb: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1600&q=85',
    tags: ['neon', 'purple', 'blue', 'cyber'],
  },
];

export const PRESET_STUDIO_COLORS = [
  { name: 'Pure White', hex: '#FFFFFF', dark: false },
  { name: 'Studio Off-White', hex: '#F4F4F5', dark: false },
  { name: 'Warm Cream', hex: '#FAF5EF', dark: false },
  { name: 'Light Sand', hex: '#EAE6DF', dark: false },
  { name: 'Soft Peach', hex: '#FDE2D6', dark: false },
  { name: 'Pastel Sage', hex: '#E2E8E0', dark: false },
  { name: 'Sky Blue', hex: '#E0F2FE', dark: false },
  { name: 'Lavender Mist', hex: '#EDE9FE', dark: false },
  { name: 'Neutral Slate', hex: '#64748B', dark: true },
  { name: 'Dark Charcoal', hex: '#27272A', dark: true },
  { name: 'Jet Black', hex: '#09090B', dark: true },
  { name: 'Deep Navy', hex: '#0F172A', dark: true },
  { name: 'Emerald Studio', hex: '#064E3B', dark: true },
  { name: 'Royal Crimson', hex: '#4C0519', dark: true },
  { name: 'Warm Terracotta', hex: '#9A3412', dark: true },
  { name: 'Sunset Amber', hex: '#D97706', dark: true },
];

export const PRESET_GRADIENTS = [
  {
    name: 'Sunset Flare',
    type: 'linear' as const,
    colors: ['#F97316', '#EC4899', '#8B5CF6'],
    angle: 135,
  },
  {
    name: 'Ocean Depth',
    type: 'linear' as const,
    colors: ['#0284C7', '#0F172A'],
    angle: 180,
  },
  {
    name: 'Emerald Mist',
    type: 'linear' as const,
    colors: ['#10B981', '#064E3B'],
    angle: 135,
  },
  {
    name: 'Soft Rose Quartz',
    type: 'linear' as const,
    colors: ['#FBCFE8', '#DDD6FE'],
    angle: 45,
  },
  {
    name: 'Cyberpunk Neon',
    type: 'linear' as const,
    colors: ['#3B82F6', '#EC4899'],
    angle: 120,
  },
  {
    name: 'Studio Spotlight',
    type: 'radial' as const,
    colors: ['#FFFFFF', '#E4E4E7', '#A1A1AA'],
    angle: 0,
  },
  {
    name: 'Golden Hour Glow',
    type: 'radial' as const,
    colors: ['#FEF08A', '#F97316', '#7C2D12'],
    angle: 0,
  },
  {
    name: 'Dark Vignette Glow',
    type: 'radial' as const,
    colors: ['#3F3F46', '#18181B', '#09090B'],
    angle: 0,
  },
];

export const PRESET_PATTERNS = [
  {
    id: 'pattern-dots',
    name: 'Minimal Dot Matrix',
    type: 'dots' as const,
    color: '#D4D4D8',
    bgColor: '#FFFFFF',
    size: 24,
  },
  {
    id: 'pattern-grid',
    name: 'Studio Blueprint Grid',
    type: 'grid' as const,
    color: '#E4E4E7',
    bgColor: '#FAFAFA',
    size: 32,
  },
  {
    id: 'pattern-spotlight',
    name: 'Stage Spotlight Focus',
    type: 'spotlight' as const,
    color: '#FFFFFF',
    bgColor: '#18181B',
    size: 50,
  },
  {
    id: 'pattern-stripes',
    name: 'Architectural Stripes',
    type: 'stripes' as const,
    color: '#F4F4F5',
    bgColor: '#FFFFFF',
    size: 40,
  },
];

export const PRESET_FOREGROUNDS: PresetForeground[] = [
  {
    id: 'fg-portrait-woman',
    name: 'Portrait Model',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=85',
  },
  {
    id: 'fg-casual-man',
    name: 'Casual Smile',
    thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85',
  },
  {
    id: 'fg-cute-dog',
    name: 'Golden Retriever',
    thumb: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=85',
  },
  {
    id: 'fg-cool-cat',
    name: 'Curious Cat',
    thumb: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&q=85',
  },
  {
    id: 'fg-sports-car',
    name: 'Red Sports Car',
    thumb: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85',
  },
  {
    id: 'fg-coffee-cup',
    name: 'Artisan Latte',
    thumb: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&q=80',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1200&q=85',
  },
];

export const ASPECT_RATIOS = [
  { label: 'Original', value: 'original', ratio: null },
  { label: '1:1 Square', value: '1:1', ratio: 1 / 1, desc: 'Instagram Post' },
  { label: '4:5 Portrait', value: '4:5', ratio: 4 / 5, desc: 'Social Feed' },
  { label: '16:9 Landscape', value: '16:9', ratio: 16 / 9, desc: 'YouTube / Banner' },
  { label: '9:16 Story', value: '9:16', ratio: 9 / 16, desc: 'TikTok / Stories' },
  { label: '4:3 Standard', value: '4:3', ratio: 4 / 3, desc: 'Classic Photo' },
];

export const BLEND_MODES: { label: string; value: GlobalCompositeOperation }[] = [
  { label: 'Normal', value: 'source-over' },
  { label: 'Multiply', value: 'multiply' },
  { label: 'Screen', value: 'screen' },
  { label: 'Overlay', value: 'overlay' },
  { label: 'Soft Light', value: 'soft-light' },
  { label: 'Hard Light', value: 'hard-light' },
  { label: 'Color Dodge', value: 'color-dodge' },
  { label: 'Luminosity', value: 'luminosity' },
];
