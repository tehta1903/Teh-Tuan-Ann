/**
 * Color Key / Chroma Key extraction helper for making background colors transparent
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function processColorKey(
  sourceCanvas: HTMLCanvasElement,
  targetColorHex: string,
  tolerance: number, // 0 to 100
  smoothness: number // 0 to 50
): HTMLCanvasElement {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const ctx = outputCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const target = hexToRgb(targetColorHex);
  const tolDist = (tolerance / 100) * 441.67; // max color distance is sqrt(255^2*3) = 441.67
  const smoothDist = (smoothness / 100) * 100;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    // Euclidean color distance in RGB space
    const dr = r - target.r;
    const dg = g - target.g;
    const db = b - target.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    if (dist < tolDist) {
      if (smoothDist > 0 && dist > tolDist - smoothDist) {
        // Linear fade transition
        const alphaFactor = (dist - (tolDist - smoothDist)) / smoothDist;
        data[i + 3] = Math.round(a * alphaFactor);
      } else {
        data[i + 3] = 0; // completely transparent
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return outputCanvas;
}
