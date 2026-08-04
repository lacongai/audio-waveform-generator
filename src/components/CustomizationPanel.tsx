import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sliders, Sparkles } from 'lucide-react';
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
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ style, setStyle, color, setColor, backgroundColor, setBackgroundColor, thickness, setThickness, sensitivity, setSensitivity }) => {
  const [activeTab, setActiveTab] = useState<'style' | 'color'>('style');

  const styles: { value: WaveformStyleType; label: string; icon: string }[] = [
    { value: 'circle', label: 'Tròn', icon: '⭕' },
    { value: 'line', label: 'Đường', icon: '〰️' },
    { value: 'bars', label: 'Cột dọc', icon: '📊' },
    { value: 'horizontal', label: 'Cột ngang', icon: '📈' },
    { value: 'mirror', label: 'Gương', icon: '🪞' },
    { value: '3d', label: '3D', icon: '🎲' },
    { value: 'heart', label: 'Trái tim', icon: '❤️' },
    { value: 'logo', label: 'Logo', icon: '🏷️' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Palette className="w-5 h-5 text-accent-orange" />Tùy chỉnh</h3>
      <div className="flex gap-1 p-1 rounded-lg bg-white/5">
        {[{ id: 'style', label: 'Kiểu', icon: Sliders }, { id: 'color', label: 'Màu', icon: Palette }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-md text-sm transition-all ${activeTab === tab.id ? 'bg-accent-orange/20 text-accent-orange' : 'text-white/40 hover:text-white/60'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeTab === 'style' && (
          <motion.div key="style" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-4 gap-1.5">
            {styles.map((s) => (
              <button key={s.value} onClick={() => setStyle(s.value)} className={`p-2 rounded-lg text-center transition-all ${style === s.value ? 'bg-accent-orange/20 border border-accent-orange' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <div className="text-xl">{s.icon}</div>
                <div className="text-[10px] mt-0.5 text-white/50">{s.label}</div>
              </button>
            ))}
          </motion.div>
        )}
        {activeTab === 'color' && (
          <motion.div key="color" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-white/40 block mb-1">Màu sóng</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full" /></div>
              <div><label className="text-xs text-white/40 block mb-1">Màu nền</label><input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-full" /></div>
            </div>
            <div><label className="text-xs text-white/40 flex justify-between"><span>Độ dày</span><span>{thickness.toFixed(1)}</span></label><input type="range" min="0.5" max="5" step="0.1" value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value))} className="w-full" /></div>
            <div><label className="text-xs text-white/40 flex justify-between"><span>Độ nhạy</span><span>{sensitivity.toFixed(1)}</span></label><input type="range" min="0.5" max="2.5" step="0.1" value={sensitivity} onChange={(e) => setSensitivity(parseFloat(e.target.value))} className="w-full" /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};