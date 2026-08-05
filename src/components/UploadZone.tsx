import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Music, Film, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  error?: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileUpload, isProcessing, error }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) onFileUpload(acceptedFiles[0]);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac'], 
      'video/*': ['.mp4', '.mov', '.mkv', '.avi'] 
    },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div {...getRootProps()} className={`
        relative overflow-hidden rounded-2xl p-8 md:p-12 text-center cursor-pointer
        transition-all duration-300 border-2 border-dashed
        ${isDragActive 
          ? 'border-accent-orange bg-accent-orange/10 shadow-lg shadow-accent-orange/20' 
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-accent-orange/20 rounded-full blur-2xl" />
            <div className="relative z-10 p-4 rounded-full bg-gradient-to-br from-accent-orange to-accent-yellow">
              {isProcessing ? (
                <Loader2 className="w-8 h-8 text-dark-900 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-dark-900" />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {isDragActive ? '📥 Thả file vào đây' : 'Tải lên file âm thanh / video'}
            </h3>
            <p className="mt-1 text-white/40 text-sm">Kéo thả hoặc nhấn để chọn file</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/50 text-xs">
              <Music className="w-3 h-3" /> MP3, WAV, M4A, OGG, FLAC
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/50 text-xs">
              <Film className="w-3 h-3" /> MP4, MOV, MKV, AVI
            </div>
          </div>
          {isProcessing && (
            <div className="flex items-center gap-2 text-accent-orange">
              <div className="w-4 h-4 border-2 border-accent-orange border-t-transparent rounded-full animate-spin" />
              <span>Đang xử lý...</span>
            </div>
          )}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">❌ {error}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};