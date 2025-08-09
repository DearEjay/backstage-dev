import React from 'react';
import { Album, Music, Mic } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  description?: string;
  cover_art_url?: string;
}

interface ProjectHeaderProps {
  project: Project | null;
  isLoading: boolean;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="w-40 h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="pt-2 space-y-3">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          <Music size={48} className="text-gray-400" />
        </div>
        <div className="pt-2">
          <p className="text-gray-500">Project not found</p>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'album': return Album;
      case 'single': return Music;
      case 'ep': return Mic;
      default: return Music;
    }
  };

  const TypeIcon = getTypeIcon(project.type);

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
      <div className="w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-md">
        {project.cover_art_url ? (
          <img 
            src={project.cover_art_url} 
            alt={project.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <TypeIcon size={48} className="text-white" />
        )}
      </div>
      <div className="pt-2">
        <p className="text-purple-600 font-semibold capitalize">{project.type}</p>
        <h1 className="text-4xl font-bold text-gray-900 mt-1">{project.title}</h1>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
          project.status === 'released' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {project.status === 'released' ? 'Released' : 'In Progress'}
        </span>
        {project.description && (
          <p className="text-gray-600 mt-3 max-w-2xl">{project.description}</p>
        )}
      </div>
    </div>
  );