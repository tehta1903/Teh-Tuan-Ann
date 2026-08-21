import { BackgroundSettings, PhotoLayer, MaskShape } from '../types';
import { processColorKey } from './colorKey';

// In-memory image element cache
const imageCache = new Map<string, HTMLImageElement>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth !== 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      // Retry without crossorigin if failed
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imageCache.set(src, fallbackImg);
        resolve(fallbackImg);
      };
      fallbackImg.onerror = (err) => reject(err);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

function drawMaskPath(ctx: CanvasRenderingContext2D, shape: MaskShape, w: number, h: number, radius = 20) {
  ctx.beginPath();
  const halfW = w / 2;
  const halfH = h / 2;

  switch (shape) {
    case 'circle': {
      const r = Math.min(halfW, halfH);
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      break;
    }
    case 'ellipse': {
      ctx.ellipse(0, 0, halfW, halfH, 0, 0, Math.PI * 2);
      break;
    }
    case 'rounded-rect': {
      const r = Math.min(radius, halfW, halfH);
      ctx.roundRect(-halfW, -halfH, w, h, r);
      break;
    }
    case 'heart': {
      const scale = Math.min(w, h) / 100;
      ctx.save();
      ctx.scale(scale, scale);
      ctx.translate(0, -10);
      ctx.moveTo(0, 20);
      ctx.bezierCurveTo(-25, -15, -50, 5, 0, 48);
      ctx.bezierCurveTo(50, 5, 25, -15, 0, 20);
      ctx.restore();
      break;
    }
    case 'star': {
      const spikes = 5;
      const outerR = Math.min(halfW, halfH);
      const innerR = outerR * 0.45;
      let rot = (Math.PI / 2) * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerR);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerR;
        y = Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerR;
        y = Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerR);
      ctx.closePath();
      break;
    }
    case 'hexagon': {
      const r = Math.min(halfW, halfH);
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }
    default: {
      ctx.rect(-halfW, -halfH, w, h);
      break;
    }
  }
}

export function buildCssFilterString(f: PhotoLayer['filters']): string {
  const parts: string[] = [];
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
  if (f.saturation !== 100) parts.push(`saturate(${f.saturation}%)`);
  if (f.hueRotate !== 0) parts.push(`hue-rotate(${f.hueRotate}deg)`);
  if (f.sepia > 0) parts.push(`sepia(${f.sepia}%)`);
  if (f.blur > 0) parts.push(`blur(${f.blur}px)`);
  if (f.opacity !== 100) parts.push(`opacity(${f.opacity}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export async function renderBackground(
  ctx: CanvasRenderingContext2D,
  bg: BackgroundSettings,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save();

  // Handle Transparent background (renders transparent or subtle checkerboard for editing if needed)
  if (bg.type === 'transparent') {
    // Clear rect so it exports with true transparency on PNG
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
    return;
  }

  // Handle Procedural Pattern
  if (bg.type === 'pattern' && bg.pattern) {
    const { type, color, bgColor, size = 30 } = bg.pattern;
    ctx.fillStyle = bgColor || '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = color || '#e4e4e7';
    ctx.strokeStyle = color || '#e4e4e7';
    ctx.lineWidth = 1;

    if (type === 'dots') {
      const radius = Math.max(1.5, size * 0.08);
      for (let x = size / 2; x < canvasWidth; x += size) {
        for (let y = size / 2; y < canvasHeight; y += size) {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (type === 'grid') {
      ctx.beginPath();
      for (let x = 0; x <= canvasWidth; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
      }
      for (let y = 0; y <= canvasHeight; y += size) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
      }
      ctx.stroke();
    } else if (type === 'stripes') {
      ctx.beginPath();
      for (let x = -canvasHeight; x < canvasWidth + canvasHeight; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + canvasHeight, canvasHeight);
      }
      ctx.stroke();
    } else if (type === 'spotlight') {
      const grad = ctx.createRadialGradient(
        canvasWidth / 2,
        canvasHeight / 2,
        10,
        canvasWidth / 2,
        canvasHeight / 2,
        Math.max(canvasWidth, canvasHeight) * 0.7
      );
      grad.addColorStop(0, color);
      grad.addColorStop(1, bgColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  } else if (bg.type === 'color' && bg.color) {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else if (bg.type === 'gradient' && bg.gradient) {
    const { type, colors, angle } = bg.gradient;
    if (type === 'linear') {
      const rad = ((angle || 0) * Math.PI) / 180;
      const cx = canvasWidth / 2;
      const cy = canvasHeight / 2;
      const length = Math.max(canvasWidth, canvasHeight);
      const x0 = cx - (Math.cos(rad) * length) / 2;
      const y0 = cy - (Math.sin(rad) * length) / 2;
      const x1 = cx + (Math.cos(rad) * length) / 2;
      const y1 = cy + (Math.sin(rad) * length) / 2;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      colors.forEach((c, idx) => grad.addColorStop(idx / Math.max(1, colors.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      const grad = ctx.createRadialGradient(
        canvasWidth / 2,
        canvasHeight / 2,
        10,
        canvasWidth / 2,
        canvasHeight / 2,
        Math.max(canvasWidth, canvasHeight) / 1.5
      );
      colors.forEach((c, idx) => grad.addColorStop(idx / Math.max(1, colors.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  } else if (bg.src) {
    try {
      const img = await loadImage(bg.src);
      // Compute cover dimensions
      const imgAspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
      const canvasAspect = canvasWidth / canvasHeight;

      let drawW = canvasWidth;
      let drawH = canvasHeight;

      if (canvasAspect > imgAspect) {
        drawW = canvasWidth;
        drawH = canvasWidth / imgAspect;
      } else {
        drawH = canvasHeight;
        drawW = canvasHeight * imgAspect;
      }

      // Apply background scale & offsets
      const scale = bg.scale || 1;
      drawW *= scale;
      drawH *= scale;

      const dx = (canvasWidth - drawW) / 2 + (bg.offsetX || 0);
      const dy = (canvasHeight - drawH) / 2 + (bg.offsetY || 0);

      // Filters for background (including bokeh blur and adjustments)
      const filterParts: string[] = [];
      if (bg.blur > 0) filterParts.push(`blur(${bg.blur}px)`);
      if (bg.brightness !== 100) filterParts.push(`brightness(${bg.brightness}%)`);
      if (bg.contrast !== 100) filterParts.push(`contrast(${bg.contrast}%)`);
      if (bg.saturation !== 100) filterParts.push(`saturate(${bg.saturation}%)`);

      if (filterParts.length > 0) {
        ctx.filter = filterParts.join(' ');
      }

      ctx.save();
      // Handle background flips
      if (bg.flipX || bg.flipY) {
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.scale(bg.flipX ? -1 : 1, bg.flipY ? -1 : 1);
        ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
      }

      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();
    } catch {
      // Fallback clean background
      ctx.fillStyle = '#f4f4f5';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  } else {
    // Default pleasant neutral canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Vignette effect overlay
  if (bg.vignette && bg.vignette > 0) {
    ctx.filter = 'none';
    const radius = Math.max(canvasWidth, canvasHeight) * 0.75;
    const vignetteGrad = ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight / 2,
      radius * 0.4,
      canvasWidth / 2,
      canvasHeight / 2,
      radius
    );
    vignetteGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vignetteGrad.addColorStop(1, `rgba(0,0,0,${(bg.vignette / 100) * 0.85})`);
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  ctx.restore();
}

export async function renderPhotoLayer(
  ctx: CanvasRenderingContext2D,
  layer: PhotoLayer,
  canvasScale = 1
) {
  if (!layer.visible || !layer.src) return;

  try {
    const img = await loadImage(layer.src);

    const layerW = layer.width * canvasScale;
    const layerH = layer.height * canvasScale;
    const layerX = layer.x * canvasScale;
    const layerY = layer.y * canvasScale;

    // Create an offscreen buffer canvas for this layer to apply masking, feathering, color key
    const offscreen = document.createElement('canvas');
    offscreen.width = Math.max(1, Math.round(layerW));
    offscreen.height = Math.max(1, Math.round(layerH));
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    // 1. Draw base image onto offscreen
    offCtx.save();
    offCtx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
    offCtx.restore();

    // 2. Color key transparency removal if active
    let processedCanvas = offscreen;
    if (layer.cutout.colorKeyActive && layer.cutout.keyColor) {
      processedCanvas = processColorKey(
        offscreen,
        layer.cutout.keyColor,
        layer.cutout.tolerance,
        layer.cutout.smoothness
      );
    }

    // 3. Shape Mask & Feathering
    const shape = layer.cutout.maskShape;
    let finalLayerCanvas = processedCanvas;

    if (shape !== 'none' || layer.cutout.feather > 0) {
      const maskedCanvas = document.createElement('canvas');
      maskedCanvas.width = offscreen.width;
      maskedCanvas.height = offscreen.height;
      const maskCtx = maskedCanvas.getContext('2d');

      if (maskCtx) {
        maskCtx.save();
        maskCtx.translate(maskedCanvas.width / 2, maskedCanvas.height / 2);

        if (layer.cutout.feather > 0) {
          maskCtx.filter = `blur(${layer.cutout.feather * canvasScale}px)`;
        }

        drawMaskPath(maskCtx, shape, maskedCanvas.width, maskedCanvas.height, 24 * canvasScale);
        maskCtx.fillStyle = '#000000';
        maskCtx.fill();
        maskCtx.restore();

        // Composite original into mask
        maskCtx.save();
        maskCtx.globalCompositeOperation = 'source-in';
        maskCtx.drawImage(processedCanvas, 0, 0);
        maskCtx.restore();

        finalLayerCanvas = maskedCanvas;
      }
    }

    // 4. Render to main canvas with transforms, shadow, border, filters
    ctx.save();
    ctx.translate(layerX, layerY);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale(layer.scaleX, layer.scaleY);

    // Apply blend mode
    if (layer.blendMode) {
      ctx.globalCompositeOperation = layer.blendMode;
    }

    // Apply CSS-based filters
    const filterString = buildCssFilterString(layer.filters);
    if (filterString !== 'none') {
      ctx.filter = filterString;
    }

    // Drop Shadow
    if (layer.shadow.enabled) {
      ctx.shadowColor = layer.shadow.color;
      ctx.shadowBlur = layer.shadow.blur * canvasScale;
      ctx.shadowOffsetX = layer.shadow.offsetX * canvasScale;
      ctx.shadowOffsetY = layer.shadow.offsetY * canvasScale;
    }

    // Draw the layer centered
    ctx.drawImage(
      finalLayerCanvas,
      -layerW / 2,
      -layerH / 2,
      layerW,
      layerH
    );

    // Reset shadow for border/effects
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Stroke Border if enabled
    if (layer.border.enabled && layer.border.width > 0) {
      ctx.save();
      ctx.filter = 'none';
      ctx.lineWidth = layer.border.width * canvasScale;
      ctx.strokeStyle = layer.border.color;

      if (layer.border.style === 'dashed') {
        ctx.setLineDash([8 * canvasScale, 6 * canvasScale]);
      } else if (layer.border.style === 'dotted') {
        ctx.setLineDash([3 * canvasScale, 4 * canvasScale]);
      }

      drawMaskPath(ctx, shape, layerW, layerH, (layer.border.radius || 20) * canvasScale);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  } catch (err) {
    console.error('Failed to render photo layer:', err);
  }
}

export async function renderFullScene(
  canvas: HTMLCanvasElement,
  bg: BackgroundSettings,
  layers: PhotoLayer[],
  width: number,
  height: number,
  supersample = 1
) {
  canvas.width = width * supersample;
  canvas.height = height * supersample;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render Background
  await renderBackground(ctx, bg, canvas.width, canvas.height);

  // Sort layers by zIndex ascending
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  // Render foreground photo layers
  for (const layer of sortedLayers) {
    await renderPhotoLayer(ctx, layer, supersample);
  }
}

export async function exportCompositeImage(
  bg: BackgroundSettings,
  layers: PhotoLayer[],
  width: number,
  height: number,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality = 0.92,
  resolutionMultiplier = 1
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  const exportCanvas = document.createElement('canvas');
  await renderFullScene(
    exportCanvas,
    bg,
    layers,
    width,
    height,
    resolutionMultiplier
  );

  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  const dataUrl = exportCanvas.toDataURL(mimeType, quality);

  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({
            blob,
            dataUrl,
            width: exportCanvas.width,
            height: exportCanvas.height,
          });
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      },
      mimeType,
      quality
    );
  });
}
