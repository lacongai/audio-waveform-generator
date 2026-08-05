import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Image, Film, Video, Loader2 } from 'lucide-react';

interface ExportPanelProps {
  audioFile: File;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ audioFile }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress(i);
    }
    setIsExporting(false);
    setExportProgress(0);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-4 rounded-xl glass">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Download className="w-5 h-5 text-accent-orange" />
        Xuất file
      </h3>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { id: 'png', label: 'PNG', icon: Image },
          { id: 'gif', label: 'GIF', icon: Film },
          { id: 'mp4', label: 'MP4', icon: Video },
        ].map((f) => (
          <button key={f.id} className="p-2 rounded-lg text-center bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
            <f.icon className="w-5 h-5 mx-auto text-white/40" />
            <span className="text-xs block mt-1 text-white/60">{f.label}</span>
          </button>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        disabled={isExporting}
        className={`w-full p-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
          isExporting 
            ? 'bg-white/10 text-white/40 cursor-not-allowed' 
            : 'bg-gradient-to-r from-accent-orange to-accent-yellow text-dark-900 hover:shadow-lg hover:shadow-accent-orange/30'
        } transition-all`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang xuất... {exportProgress}%
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Xuất file
          </>
        )}
      </motion.button>
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
    </motion.div>
  );
};