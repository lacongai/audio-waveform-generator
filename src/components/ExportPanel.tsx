import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Image, Film, Video, Zap, 
  Monitor, Tv, Check, Loader2 
} from 'lucide-react';
import { WaveformStyleType } from '../types';

interface ExportPanelProps {
  waveformData: Float32Array;
  audioFile: File;
  style: WaveformStyleType;
  color: string;
  backgroundColor: string;
  thickness: number;
  sensitivity: number;
  glow: boolean;
  glowIntensity: number;
  duration: number;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  waveformData,
  audioFile,
  style,
  color,
  backgroundColor,
  thickness,
  sensitivity,
  glow,
  glowIntensity,
  duration
}) => {
  const [exportFormat, setExportFormat] = useState<'png' | 'gif' | 'mp4' | 'webm'>('png');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '2k' | '4k'>('1080p');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [fps, setFps] = useState(30);
  const [quality, setQuality] = useState(90);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const resolutions = {
    '720p': { width: 1280, height: 720, label: '720p' },
    '1080p': { width: 1920, height: 1080, label: '1080p' },
    '2k': { width: 2560, height: 1440, label: '2K' },
    '4k': { width: 3840, height: 2160, label: '4K' }
  };

  const formats = [
    { id: 'png', label: 'PNG', icon: Image, description: 'Ảnh tĩnh' },
    { id: 'gif', label: 'GIF', icon: Film, description: 'Ảnh động' },
    { id: 'mp4', label: 'MP4', icon: Video, description: 'Video' },
    { id: 'webm', label: 'WEBM', icon: Video, description: 'Video' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
      }
      
      // In real implementation, this would use canvas rendering
      console.log('Exporting...', { 
        format: exportFormat, 
        resolution, 
        includeAudio,
        fps,
        quality,
        audioFile: audioFile.name,
        style,
        color
      });

      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 rounded-xl glass"
    >
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Download className="w-5 h-5 text-accent-orange" />
        Xuất file
      </h3>

      {/* Format selection */}
      <div className="grid grid-cols-4 gap-1.5">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => setExportFormat(f.id as any)}
            className={`
              p-2 rounded-lg text-center transition-all
              ${exportFormat === f.id 
                ? 'bg-accent-orange/20 border border-accent-orange' 
                : 'bg-white/5 border border-white/5 hover:bg-white/10'
              }
            `}
          >
            <f.icon className={`w-5 h-5 mx-auto ${exportFormat === f.id ? 'text-accent-orange' : 'text-white/40'}`} />
            <span className="text-xs block mt-1 text-white/60">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Resolution */}
      <div>
        <label className="text-xs text-white/40 block mb-1.5">Độ phân giải</label>
        <div className="grid grid-cols-4 gap-1.5">
          {Object.entries(resolutions).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setResolution(key as any)}
              className={`
                p-1.5 rounded-lg text-center text-xs transition-all
                ${resolution === key 
                  ? 'bg-accent-orange/20 border border-accent-orange text-white' 
                  : 'bg-white/5 border border-white/5 text-white/40 hover:text-white/60'
                }
              `}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={includeAudio}
            onChange={(e) => setIncludeAudio(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-orange focus:ring-accent-orange"
          />
          <Zap className="w-3.5 h-3.5" />
          Bao gồm âm thanh
        </label>

        {exportFormat !== 'png' && (
          <>
            <div>
              <label className="text-xs text-white/40 flex justify-between">
                <span>FPS</span>
                <span>{fps}</span>
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="1"
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 flex justify-between">
                <span>Chất lượng</span>
                <span>{quality}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>

      {/* Export button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        disabled={isExporting}
        className={`
          w-full p-3 rounded-xl font-semibold flex items-center justify-center gap-2
          ${isExporting 
            ? 'bg-white/10 text-white/40 cursor-not-allowed' 
            : 'bg-gradient-to-r from-accent-orange to-accent-yellow text-dark-900 hover:shadow-lg hover:shadow-accent-orange/30'
          }
          transition-all
        `}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang xuất... {exportProgress}%
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Xuất {exportFormat.toUpperCase()}
          </>
        )}
      </motion.button>

      {/* Progress bar */}
      {isExporting && (
        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-accent-orange to-accent-yellow"
            initial={{ width: 0 }}
            animate={{ width: `${exportProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-white/20 text-center">
        {exportFormat === 'png' && '📸 Xuất ảnh tĩnh chất lượng cao'}
        {exportFormat === 'gif' && '🎞️ Xuất ảnh động với sóng chạy'}
        {exportFormat === 'mp4' && '🎬 Xuất video có âm thanh và sóng nhạc'}
        {exportFormat === 'webm' && '🌐 Xuất video WebM tối ưu web'}
      </div>
    </motion.div>
  );
};