import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadZone, WaveformDisplay, Controls, 
  CustomizationPanel, ExportPanel, ProjectManager 
} from './components';
import { useAudio } from './hooks/useAudio';
import { useWaveform } from './hooks/useWaveform';
import { Project } from './types';
import { Music } from 'lucide-react';

function App() {
  const {
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
  } = useAudio();

  const {
    style,
    updateStyle,
    draw,
    setIsPlaying
  } = useWaveform();

  const [projects, setProjects] = React.useState<Project[]>(() => {
    const saved = localStorage.getItem('waveform_projects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setIsPlaying(isPlaying);
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    if (waveformData && waveformData.length > 0) {
      draw(waveformData);
    }
  }, [waveformData, style, draw]);

  useEffect(() => {
    localStorage.setItem('waveform_projects', JSON.stringify(projects));
  }, [projects]);

  const handleSaveProject = (name: string) => {
    if (!audioFile) return;
    
    const project: Project = {
      id: Date.now().toString(),
      name,
      audioFile: {
        id: Date.now().toString(),
        name: audioFile.name,
        size: audioFile.size,
        duration,
        url: audioUrl,
        file: audioFile,
        waveformData
      },
      waveformStyle: style,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProjects(prev => [...prev, project]);
  };

  const handleLoadProject = (project: Project) => {
    console.log('Loading project:', project);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleRenameProject = (id: string, newName: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, name: newName, updatedAt: new Date() } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-accent-orange to-accent-yellow">
              <Music className="w-6 h-6 text-dark-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-orange via-accent-yellow to-accent-blue bg-clip-text text-transparent">
                Waveform Studio
              </h1>
              <p className="text-xs text-white/30">Tạo sóng nhạc đẹp mắt</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ProjectManager
              projects={projects}
              onLoadProject={handleLoadProject}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onRenameProject={handleRenameProject}
              currentProjectName={audioFile?.name}
            />
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 space-y-4">
            <UploadZone 
              onFileUpload={loadFile} 
              isProcessing={isProcessing}
              error={error}
            />

            <AnimatePresence>
              {audioFile && waveformData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-3"
                >
                  <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    className="hidden"
                  />

                  <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="h-72 relative">
                      <WaveformDisplay
                        data={waveformData}
                        style={style.type}
                        color={style.color}
                        backgroundColor={style.backgroundColor}
                        thickness={style.thickness}
                        sensitivity={style.sensitivity}
                        glow={style.glow}
                        glowIntensity={style.glowIntensity}
                        opacity={style.opacity}
                        particles={style.particles}
                        particleCount={style.particleCount}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        duration={duration}
                        fileName={audioFile.name}
                      />
                    </div>
                  </div>

                  <Controls
                    isPlaying={isPlaying}
                    onPlay={play}
                    onPause={pause}
                    onStop={stop}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={seek}
                    volume={volume}
                    onVolumeChange={changeVolume}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {audioFile && waveformData.length > 0 && (
                <>
                  <CustomizationPanel
                    style={style.type}
                    setStyle={(s: any) => updateStyle({ type: s })}
                    color={style.color}
                    setColor={(c) => updateStyle({ color: c })}
                    backgroundColor={style.backgroundColor}
                    setBackgroundColor={(c) => updateStyle({ backgroundColor: c })}
                    thickness={style.thickness}
                    setThickness={(t) => updateStyle({ thickness: t })}
                    sensitivity={style.sensitivity}
                    setSensitivity={(s) => updateStyle({ sensitivity: s })}
                    glow={style.glow}
                    setGlow={(g) => updateStyle({ glow: g })}
                    glowIntensity={style.glowIntensity}
                    setGlowIntensity={(g) => updateStyle({ glowIntensity: g })}
                    particles={style.particles}
                    setParticles={(p) => updateStyle({ particles: p })}
                    opacity={style.opacity}
                    setOpacity={(o) => updateStyle({ opacity: o })}
                  />

                  <ExportPanel
                    audioFile={audioFile}
                    style={style.type}
                    color={style.color}
                    duration={duration}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-xs text-white/20"
        >
          <p>Made with ❤️ using React, TypeScript, Tailwind CSS & Framer Motion</p>
          <p className="mt-1">🎵 Hỗ trợ MP3, WAV, M4A, OGG, FLAC, MP4, MOV, MKV, AVI</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;