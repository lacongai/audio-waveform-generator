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
  backgroundImage?: string;
  backgroundVideo?: string;
  thickness: number;
  sensitivity: number;
  resolution: number;
  glow: boolean;
  glowIntensity: number;
  particles: boolean;
  particleCount: number;
  animationSpeed: number;
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
  | 'logo' 
  | 'spiral'
  | 'radial';

export interface Project {
  id: string;
  name: string;
  audioFile: AudioFile;
  waveformStyle: WaveformStyle;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportSettings {
  format: 'png' | 'gif' | 'mp4' | 'webm';
  resolution: '720p' | '1080p' | '2k' | '4k';
  quality: number;
  includeAudio: boolean;
  fps: number;
  duration: number;
}

export interface AudioProcessorResult {
  buffer: AudioBuffer;
  waveform: Float32Array;
  duration: number;
  sampleRate: number;
  channels: number;
}