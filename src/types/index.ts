export type WaveformStyleType = 'circle' | 'line' | 'bars' | 'horizontal' | 'mirror' | '3d' | 'heart' | 'logo';

export interface WaveformStyle {
  type: WaveformStyleType;
  color: string;
  backgroundColor: string;
  thickness: number;
  sensitivity: number;
  glow: boolean;
  glowIntensity: number;
  particles: boolean;
  particleCount: number;
  opacity: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}