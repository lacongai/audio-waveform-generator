export type WaveformStyleType = 'line' | 'bars' | 'mirror' | 'circle';

export interface WaveformStyle {
  type: WaveformStyleType;
  color: string;
  backgroundColor: string;
  thickness: number;
  sensitivity: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}