import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { WaveformGenerator } from '../utils/waveformGenerator';
import { WaveformStyleType } from '../types';
import { Music } from 'lucide-react';

interface WaveformDisplayProps {
  data: Float32Array;
  style: WaveformStyleType;
  color: string;
  backgroundColor: string;
  thickness: number;
  sensitivity: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  fileName?: string;
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  data, style, color, backgroundColor, thickness, sensitivity, isPlaying, currentTime, duration, fileName
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const progress = isPlaying && duration > 0 ? Math.min(1, currentTime / duration) : 1;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    WaveformGenerator.draw(ctx, canvas.width, canvas.height, data, style, color, thickness, sensitivity, progress);
  }, [data, style, color, backgroundColor, thickness, sensitivity, isPlaying, currentTime, duration]);

  return (
    <motion.div className="relative w-full h-full rounded-xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {fileName && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Music className="w-3 h-3 text-accent-orange" />
          <span className="text-xs text-white/80 truncate max-w-[150px]">{fileName}</span>
        </div>
      )}
    </motion.div>
  );
};