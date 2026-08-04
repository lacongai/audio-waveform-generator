import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Sliders, Sparkles, Image, Video, 
  Sun, Moon, Zap, Eye, Droplet 
} from 'lucide-react';
import { WaveformStyleType } from '../types';

interface CustomizationPanelProps {
  style: WaveformStyleType;
  setStyle: (style: WaveformStyleType) => void;
  color: string;
  setColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  thickness: number;
  setThickness: (value: number) => void;
  sensitivity: number;
  setSensitivity: (value: number) => void;
  glow: boolean;
  setGlow: (value: boolean) => void;
  glowIntensity: number;
  setGlowIntensity: (value: number) => void;
  particles: boolean;
  setParticles: (value: boolean) => void;
  opacity: number;
  setOpacity: (value: number) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  style,
  setStyle,
  color,
  setColor,
  backgroundColor,
  setBackgroundColor,
  thickness,
  setThickness,
  sensitivity,
  setSensitivity,
  glow,
  setGlow,
  glowIntensity,
  setGlowIntensity,
  particles,
  setParticles,
  opacity,
  setOpacity
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'color' | 'effect'>('style');

  const styles: { value: WaveformStyleType; label: string; icon: string; description: string }[] = [
    { value: 'circle', label: 'Tròn', icon: '⭕', description: 'Sóng tròn xoay' },
    { value: 'line', label: 'Đường', icon: '〰️', description: 'Đường cong mượt' },
    { value: 'bars', label: 'Cột dọc', icon: '📊', description: 'Thanh đứng' },
    { value: 'horizontal', label: 'Cột ngang', icon: '📈', description: 'Thanh ngang' },
    { value: 'mirror', label: 'Gương', icon: '🪞', description: 'Đối xứng' },
    { value: '3d', label: '3D', icon: '🎲', description: 'Hiệu ứng 3D' },
    { value: 'heart', label: 'Trái tim', icon: '❤️', description: 'Hình trái tim' },
    { value: 'logo', label: 'Logo', icon: '🏷️', description: 'Logo âm nhạc' },
    { value: 'spiral', label: 'Xoắn ốc', icon: '🌀', description: 'Xoáy tròn' },
    { value: 'radial', label: 'Tỏa tròn', icon: '☀️', description: 'Tỏa từ tâm' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 rounded-xl glass"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent-orange" />
          Tùy chỉnh
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/5">
        {[
          { id: 'style', label: 'Kiểu', icon: Sliders },
          { id: 'color', label: 'Màu', icon: Palette },
          { id: 'effect', label: 'Hiệu ứng', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 p-2 rounded-md text-sm transition-all
              ${activeTab === tab.id 
                ? 'bg-accent-orange/20 text-accent-orange' 
                : 'text-white/40 hover:text-white/60'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Style tab */}
        {activeTab === 'style' && (
          <motion.div
            key="style"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-5 gap-1.5"
          >
            {styles.map((s) => (
              <button
                key={s.value}
                onClick={() => setStyle(s.value)}
                className={`
                  p-2 rounded-lg text-center transition-all group
                  ${style === s.value 
                    ? 'bg-accent-orange/20 border border-accent-orange' 
                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }
                `}
                title={s.description}
              >
                <div className="text-xl">{s.icon}</div>
                <div className="text-[10px] mt-0.5 text-white/50 truncate">
                  {s.label}
                </div>
                {style === s.value && (
                  <div className="w-1 h-1 mx-auto mt-1 rounded-full bg-accent-orange" />
                )}
              </button>
            ))}
          </motion.div>
        )}

        {/* Color tab */}
        {activeTab === 'color' && (
          <motion.div
            key="color"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 block mb-1">Màu sóng</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Màu nền</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 flex justify-between">
                <span>Độ trong suốt</span>
                <span>{Math.round(opacity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </motion.div>
        )}

        {/* Effect tab */}
        {activeTab === 'effect' && (
          <motion.div
            key="effect"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div>
              <label className="text-xs text-white/40 flex justify-between">
                <span>Độ dày</span>
                <span>{thickness.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={thickness}
                onChange={(e) => setThickness(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 flex justify-between">
                <span>Độ nhạy</span>
                <span>{sensitivity.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={glow}
                  onChange={(e) => setGlow(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-orange focus:ring-accent-orange"
                />
                <Sparkles className="w-3.5 h-3.5" />
                Glow
              </label>

              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={particles}
                  onChange={(e) => setParticles(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-orange focus:ring-accent-orange"
                />
                <Droplet className="w-3.5 h-3.5" />
                Hạt
              </label>
            </div>

            {glow && (
              <div>
                <label className="text-xs text-white/40 flex justify-between">
                  <span>Cường độ glow</span>
                  <span>{glowIntensity.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};