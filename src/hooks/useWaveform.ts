import { useState, useCallback, useEffect, useRef } from 'react';
import { WaveformStyleType, WaveformStyle } from '../types';
import { WaveformGenerator } from '../utils/waveformGenerator';

const defaultStyle: WaveformStyle = {
  type: 'circle',
  color: '#ffd200',
  backgroundColor: '#0f0c29',
  thickness: 2,
  sensitivity: 1,
  resolution: 2000,
  glow: true,
  glowIntensity: 1.5,
  particles: false,
  particleCount: 100,
  animationSpeed: 1,
  opacity: 1,
};

export function useWaveform() {
  const [style, setStyle] = useState<WaveformStyle>(defaultStyle);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateStyle = useCallback((updates: Partial<WaveformStyle>) => {
    setStyle(prev => ({ ...prev, ...updates }));
  }, []);

  const draw = useCallback((data: Float32Array, progress: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Background
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform
    WaveformGenerator.draw({
      ctx,
      width: canvas.width,
      height: canvas.height,
      data,
      style: style.type,
      color: style.color,
      thickness: style.thickness,
      sensitivity: style.sensitivity,
      glow: style.glow,
      glowIntensity: style.glowIntensity,
      opacity: style.opacity,
      progress,
      particles: style.particles,
      particleCount: style.particleCount,
    });

  }, [style]);

  return {
    style,
    updateStyle,
    draw,
    canvasRef,
    isPlaying,
    setIsPlaying,
  };
}