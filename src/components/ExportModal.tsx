import React, { useState, useEffect } from 'react';
import {
  BackgroundSettings,
  PhotoLayer,
  CanvasDimensions,
} from '../types';
import { exportCompositeImage } from '../utils/canvasRenderer';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  FileImage,
  Layers,
  Loader2,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bg: BackgroundSettings;
  layers: PhotoLayer[];
  dimensions: CanvasDimensions;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  bg,
  layers,
  dimensions,
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(0.95);
  const [multiplier, setMultiplier] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileSizeStr, setFileSizeStr] = useState<string>('');

  // Target output dimensions
  const exportWidth = Math.round(dimensions.width * multiplier);
  const exportHeight = Math.round(dimensions.height * multiplier);

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    setIsRendering(true);

    exportCompositeImage(bg, layers, dimensions.width, dimensions.height, format, quality, multiplier)
      .then((res) => {
        if (isCancelled) return;
        setPreviewUrl(res.dataUrl);
        // Estimate file size
        const sizeKb = (res.blob.size / 1024).toFixed(1);
        const sizeMb = (res.blob.size / (1024 * 1024)).toFixed(2);
        setFileSizeStr(res.blob.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`);
        setIsRendering(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Export render error:', err);
        setIsRendering(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, bg, layers, dimensions, format, quality, multiplier]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsRendering(true);
      const res = await exportCompositeImage(
        bg,
        layers,
        dimensions.width,
        dimensions.height,
        format,
        quality,
        multiplier
      );

      const link = document.createElement('a');
      link.href = res.dataUrl;
      const ext = format === 'jpeg' ? 'jpg' : format;
      link.download = `photo-embedded-${Date.now()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setIsRendering(false);
    } catch (err) {
      console.error('Download failed:', err);
      setIsRendering(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      // Clipboard API typically supports image/png best
      const res = await exportCompositeImage(
        bg,
        layers,
        dimensions.width,
        dimensions.height,
        'png',
        1,
        multiplier
      );

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': res.blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert('Clipboard copy is not supported in this browser version.');
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-900 text-white flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Export & Download Image</h3>
              <p className="text-xs text-zinc-500">
                High-resolution rendered composite photo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Image Preview Window */}
          <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center min-h-56 max-h-64">
            {isRendering ? (
              <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                <Loader2 className="w-7 h-7 animate-spin text-zinc-900" />
                <span className="text-xs font-medium">Rendering composite image...</span>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Export preview"
                className="max-h-64 w-auto object-contain rounded-md"
              />
            ) : null}

            {/* Resolution & Size Tag */}
            <div className="absolute bottom-2 right-2 bg-white/90 border border-zinc-200 rounded-md px-2.5 py-1 text-[11px] font-mono text-zinc-700 backdrop-blur-sm flex items-center gap-2 shadow-sm">
              <span>{exportWidth} × {exportHeight} px</span>
              {fileSizeStr && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-400" />
                  <span className="font-semibold text-zinc-900">{fileSizeStr}</span>
                </>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Format Selection */}
            <div className="bg-zinc-50 rounded-lg p-3.5 border border-zinc-200 space-y-2">
              <label className="text-xs font-semibold text-zinc-700">File Format</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-1.5 px-2.5 rounded-md text-xs font-semibold uppercase transition border ${
                      format === fmt
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500">
                {format === 'png'
                  ? 'Lossless clarity, preserves crisp edges.'
                  : format === 'jpeg'
                  ? 'Small file size for web & social sharing.'
                  : 'WebP with modern high compression.'}
              </p>
            </div>

            {/* Resolution Scale */}
            <div className="bg-zinc-50 rounded-lg p-3.5 border border-zinc-200 space-y-2">
              <label className="text-xs font-semibold text-zinc-700">
                Resolution Scale
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: '1x (HD)', mul: 1 },
                  { label: '2x (2K)', mul: 2 },
                  { label: '3x (4K)', mul: 3 },
                ].map((item) => (
                  <button
                    key={item.mul}
                    onClick={() => setMultiplier(item.mul)}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition border ${
                      multiplier === item.mul
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500">
                Supersampling enhances rendered detail and smoothing.
              </p>
            </div>
          </div>

          {/* Quality Slider (for JPG & WebP) */}
          {format !== 'png' && (
            <div className="bg-zinc-50 rounded-lg p-3.5 border border-zinc-200">
              <div className="flex justify-between text-xs text-zinc-700 mb-1.5">
                <span>Image Quality</span>
                <span className="font-mono text-zinc-900 font-medium">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.0"
                step="0.02"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-zinc-100 text-zinc-800 text-xs md:text-sm font-medium border border-zinc-200 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 text-xs md:text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              id="confirm-download-button"
              onClick={handleDownload}
              disabled={isRendering}
              className="bg-zinc-900 text-white px-5 py-2 rounded-md text-xs md:text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isRendering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Download Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
