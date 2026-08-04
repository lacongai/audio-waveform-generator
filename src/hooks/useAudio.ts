import { useState, useRef, useEffect, useCallback } from 'react';
import { AudioProcessor } from '../utils/audioProcessor';

export function useAudio() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [waveformData, setWaveformData] = useState<Float32Array>(new Float32Array());
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const processorRef = useRef<AudioProcessor | null>(null);

  useEffect(() => {
    processorRef.current = new AudioProcessor();
    return () => {
      processorRef.current?.destroy();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const loadFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const processor = processorRef.current;
      if (!processor) throw new Error('Audio processor not initialized');

      const result = await processor.processFile(file);
      const url = URL.createObjectURL(file);

      setAudioFile(file);
      setAudioUrl(url);
      setWaveformData(result.waveform);
      setDuration(result.buffer.duration);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process audio');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(time, duration);
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [duration]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const changeVolume = useCallback((vol: number) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  return {
    audioFile,
    audioUrl,
    waveformData,
    duration,
    currentTime,
    isPlaying,
    isProcessing,
    volume,
    error,
    audioRef,
    loadFile,
    play,
    pause,
    stop,
    seek,
    handleTimeUpdate,
    handleEnded,
    changeVolume,
    setCurrentTime,
  };
}