'use client';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { createProject } from '../actions';

interface NewProjectModalProps {
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

export default function NewProjectModal({ onClose, onProjectCreated }: NewProjectModalProps) {
  const [projectData, setProjectData] = useState({
    title: "",
    type: "single",
    status: "not_released",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!projectData.title.trim()) return;
    
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.set('title', projectData.title);
      formData.set('type', projectData.type);
      formData.set('status', projectData.status);
      
      const result = await createProject(formData);
      
      // Create a temporary project object for immediate UI update
      const newProject = {
        id: result.projectId,
        title: projectData.title,
        type: projectData.type,
        status: projectData.status,
        progress: 0,
        owner_id: 'current-user',
        created_at: new Date().toISOString()
      };
      
      onProjectCreated(newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Project</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
            <input
              type="text"
              value={projectData.title}
              onChange={(e) => setProjectData({...projectData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter project title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <select
                value={projectData.type}
                onChange={(e) => setProjectData({...projectData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={projectData.status}
                onChange={(e) => setProjectData({...projectData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="not_released">Not Yet Released</option>
                <option value="released">Already Released</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              disabled={!projectData.title.trim() || isCreating}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}