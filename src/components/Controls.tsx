import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, onPlay, onPause, onStop, currentTime, duration, onSeek, volume, onVolumeChange 
}) => {
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col gap-3 p-4 rounded-xl glass"
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/40 font-mono min-w-[40px]">
          {formatTime(currentTime)}
        </span>
        <input 
          type="range" 
          min="0" max="1" step="0.001" 
          value={duration > 0 ? currentTime / duration : 0}
          onChange={(e) => onSeek(parseFloat(e.target.value) * duration)}
          className="flex-1 h-1 rounded-full bg-white/20 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-orange [&::-webkit-slider-thumb]:cursor-pointer" 
        />
        <span className="text-xs text-white/40 font-mono min-w-[40px] text-right">
          {formatTime(duration)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={onStop} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Square className="w-4 h-4 text-white/60" />
          </button>
          <button onClick={() => onSeek(Math.max(0, currentTime - 5))} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <SkipBack className="w-4 h-4 text-white/60" />
          </button>
          <button 
            onClick={isPlaying ? onPause : onPlay} 
            className="p-3 rounded-full bg-gradient-to-r from-accent-orange to-accent-yellow text-dark-900 shadow-lg shadow-accent-orange/30"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={() => onSeek(Math.min(duration, currentTime + 5))} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <SkipForward className="w-4 h-4 text-white/60" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            {volume === 0 ? <VolumeX className="w-4 h-4 text-white/40" /> : <Volume2 className="w-4 h-4 text-white/60" />}
          </button>
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))} 
            className="w-16" 
          />
        </div>
      </div>
    </motion.div>
  );
};