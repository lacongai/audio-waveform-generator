import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Save, Trash2, X, Clock, Music, Search } from 'lucide-react';
import { Project } from '../types';

interface ProjectManagerProps {
  projects: Project[];
  onSaveProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, onSaveProject, onDeleteProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
        <FolderOpen className="w-5 h-5 text-white/60" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <motion.div className="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-dark-900 border border-white/10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2"><FolderOpen className="w-5 h-5 text-accent-orange" />Quản lý dự án</h2>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-white/40" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Tên dự án mới..." className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-orange" onKeyDown={(e) => e.key === 'Enter' && newProjectName.trim() && onSaveProject(newProjectName.trim())} />
                  <button onClick={() => newProjectName.trim() && onSaveProject(newProjectName.trim())} className="p-2 px-4 rounded-lg bg-gradient-to-r from-accent-orange to-accent-yellow text-dark-900 font-semibold flex items-center gap-2"><Save className="w-4 h-4" />Lưu</button>
                </div>
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm dự án..." className="w-full p-2 pl-9 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-orange" /></div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-8 text-white/30"><Music className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Chưa có dự án nào</p></div>
                  ) : (
                    filteredProjects.map((project) => (
                      <div key={project.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                        <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><Music className="w-4 h-4 text-accent-orange" /><span className="text-white font-medium truncate">{project.name}</span></div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-white/30"><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(project.createdAt).toLocaleDateString('vi-VN')}</span></div></div>
                        <button onClick={() => onDeleteProject(project.id)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};