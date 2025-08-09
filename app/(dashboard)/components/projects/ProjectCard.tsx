import React from 'react';
import Link from 'next/link';
import { Album, Music, Mic } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  cover_art_url?: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
            {project.cover_art_url ? (
              <img 
                src={project.cover_art_url} 
                alt={project.title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <TypeIcon size={24} className="text-white" />
            )}
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
            <span className="font-medium">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Created {new Date(project.created_at).toLocaleDateString()}
          </div>
          <div className="text-purple-600 hover:text-purple-700 font-medium text-sm">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;