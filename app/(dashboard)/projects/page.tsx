'use client';
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';
import NewProjectModal from '../components/projects/NewProjectModal';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const s = supabaseBrowser();

  async function loadProjects() {
    setIsLoading(true);
    try {
      const { data: { user } } = await s.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get projects where user is owner or member
      const { data: projects, error } = await s
        .from('projects')
        .select(`
          *,
          project_members!inner(user_id, role)
        `)
        .eq('project_members.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your music projects from concept to release</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))
        ) : (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>

      {!isLoading && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Create your first project
          </button>
        </div>
      )}

      {showCreateModal && (
        <NewProjectModal 
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}