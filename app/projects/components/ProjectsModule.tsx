'use client';
import { useState } from 'react';
import { Plus, Album, Music, Mic } from 'lucide-react';
import NewProjectModal from './NewProjectModal';

interface Project {
  id: string;
  title: string;
  type: 'single' | 'ep' | 'album';
  status: 'not_released' | 'released';
  progress: number;
  owner_id: string;
  created_at: string;
}

interface ProjectsModuleProps {
  initialProjects: Project[];
}

export default function ProjectsModule({ initialProjects }: ProjectsModuleProps) {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projects, setProjects] = useState(initialProjects);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your music projects from concept to release</p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                {project.type === 'album' && <Album size={24} className="text-white" />}
                {project.type === 'single' && <Music size={24} className="text-white" />}
                {project.type === 'ep' && <Mic size={24} className="text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm text-gray-500 capitalize">{project.type}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  project.status === 'released' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {project.status === 'released' ? 'Released' : 'In Progress'}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white">
                  You
                </div>
              </div>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onProjectCreated={(newProject) => {
            setProjects([newProject, ...projects]);
            setShowNewProjectModal(false);
          }}
        />
      )}
    </div>
  );
}