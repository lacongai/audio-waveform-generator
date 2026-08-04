import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Image, Film, Video, Zap, Loader2 } from 'lucide-react';
import { WaveformStyleType } from '../types';

interface ExportPanelProps {
  audioFile: File;
  style: WaveformStyleType;
  color: string;
  duration: number;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  audioFile,
  style,
  color,
  duration
}) => {
  const [exportFormat, setExportFormat] = useState<'png' | 'gif' | 'mp4'>('png');
  const [resolution] = useState<'1080p'>('1080p');
  const [includeAudio] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const formats = [
    { id: 'png', label: 'PNG', icon: Image },
    { id: 'gif', label: 'GIF', icon: Film },
    { id: 'mp4', label: 'MP4', icon: Video },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
      }
      console.log('Exporting...', { format: exportFormat, resolution, includeAudio, audioFile: audioFile.name, style, color });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Download className="w-5 h-5 text-accent-orange" />
        Xuất file
      </h3>

      <div className="grid grid-cols-3 gap-1.5">
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

      <div className="flex items-center gap-2 text-xs text-white/60">
        <Zap className="w-3.5 h-3.5" />
        <span>Bao gồm âm thanh: {includeAudio ? '✅' : '❌'}</span>
      </div>

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

      {isExporting && (
        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-accent-orange to-accent-yellow" initial={{ width: 0 }} animate={{ width: `${exportProgress}%` }} transition={{ duration: 0.3 }} />
        </div>
      )}

      <div className="text-xs text-white/20 text-center">
        {exportFormat === 'png' && '📸 Xuất ảnh tĩnh chất lượng cao'}
        {exportFormat === 'gif' && '🎞️ Xuất ảnh động với sóng chạy'}
        {exportFormat === 'mp4' && '🎬 Xuất video có âm thanh và sóng nhạc'}
      </div>
    </motion.div>
  );
};