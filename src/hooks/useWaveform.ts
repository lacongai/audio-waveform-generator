import { useState, useCallback, useRef } from 'react';
import { WaveformStyleType, WaveformStyle } from '../types';
import { WaveformGenerator } from '../utils/waveformGenerator';

const defaultStyle: WaveformStyle = {
  type: 'line',
  color: '#ffd200',
  backgroundColor: '#0f0c29',
  thickness: 2,
  sensitivity: 1,
  glow: false,
  glowIntensity: 1,
  particles: false,
  particleCount: 100,
  opacity: 1,
};

export function useWaveform() {
  const [style, setStyle] = useState<WaveformStyle>(defaultStyle);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateStyle = useCallback((updates: Partial<WaveformStyle>) => {
    setStyle(prev => ({ ...prev, ...updates }));
  }, []);

  const draw = useCallback((data: Float32Array, progress: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    WaveformGenerator.draw(
      ctx,
      canvas.width,
      canvas.height,
      data,
      style.type,
      style.color,
      style.thickness,
      style.sensitivity,
      progress
    );
  }, [style]);

  return {
    style,
    updateStyle,
    draw,
    canvasRef,
  };
}