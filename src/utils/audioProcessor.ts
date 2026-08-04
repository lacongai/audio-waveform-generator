import { AudioProcessorResult } from '../types';

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async processFile(file: File): Promise<AudioProcessorResult> {
    const arrayBuffer = await file.arrayBuffer();
    this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
    
    const waveform = this.extractWaveform(this.audioBuffer);
    
    return {
      buffer: this.audioBuffer,
      waveform,
      duration: this.audioBuffer.duration,
      sampleRate: this.audioBuffer.sampleRate,
      channels: this.audioBuffer.numberOfChannels
    };
  }

  private extractWaveform(audioBuffer: AudioBuffer): Float32Array {
    const channelData = audioBuffer.getChannelData(0);
    const samples = channelData.length;
    const resolution = 2000;
    const step = Math.floor(samples / resolution);
    const waveform = new Float32Array(resolution);
    
    for (let i = 0; i < resolution; i++) {
      let sum = 0;
      const start = i * step;
      const end = Math.min(start + step, samples);
      for (let j = start; j < end; j++) {
        sum += Math.abs(channelData[j]);
      }
      waveform[i] = Math.min(1, sum / (end - start) * 2);
    }
    
    return waveform;
  }

  getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  getBuffer(): AudioBuffer | null {
    return this.audioBuffer;
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}