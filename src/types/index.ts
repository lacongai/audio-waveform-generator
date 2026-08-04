export interface AudioFile {
  id: string;
  name: string;
  size: number;
  duration: number;
  url: string;
  file: File;
  waveformData?: Float32Array;
}

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

export type WaveformStyleType = 
  | 'circle' 
  | 'line' 
  | 'bars' 
  | 'horizontal' 
  | 'mirror' 
  | '3d' 
  | 'heart' 
  | 'logo';

export interface Project {
  id: string;
  name: string;
  audioFile: AudioFile;
  waveformStyle: WaveformStyle;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportSettings {
  format: 'png' | 'gif' | 'mp4';
  resolution: '720p' | '1080p' | '2k' | '4k';
  quality: number;
  includeAudio: boolean;
}