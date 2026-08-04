import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Square, SkipBack, SkipForward, 
  Volume2, VolumeX, Maximize2 
} from 'lucide-react';

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
  onFullscreen?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  onFullscreen
}) => {
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onSeek(value * duration);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 0.8);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 p-4 rounded-xl glass"
    >
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/40 font-mono min-w-[40px]">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={duration > 0 ? currentTime / duration : 0}
          onChange={handleSeek}
          className="flex-1"
        />
        <span className="text-xs text-white/40 font-mono min-w-[40px] text-right">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Square className="w-4 h-4 text-white/60" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSeek(Math.max(0, currentTime - 5))}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <SkipBack className="w-4 h-4 text-white/60" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isPlaying ? onPause : onPlay}
            className="p-3 rounded-full bg-gradient-to-r from-accent-orange to-accent-yellow text-dark-900 shadow-lg shadow-accent-orange/30"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSeek(Math.min(duration, currentTime + 5))}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <SkipForward className="w-4 h-4 text-white/60" />
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-white/40" />
              ) : (
                <Volume2 className="w-4 h-4 text-white/60" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-16"
            />
          </div>

          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-white/40" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};