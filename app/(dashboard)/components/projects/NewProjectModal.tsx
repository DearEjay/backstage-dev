import React, { useState } from 'react';
import { X, Upload, Link } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface NewProjectModalProps {
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onProjectCreated }) => {
  const [projectData, setProjectData] = useState({
    title: '',
    type: 'single',
    status: 'not_released',
    description: '',
    image: null,
    teamEmails: '',
    contracts: []
  });
  const [isCreating, setIsCreating] = useState(false);
  const s = supabaseBrowser();

  const contractTypes = [
    'Producer Split Sheet',
    'Songwriter Agreement', 
    'Feature Artist Agreement',
    'Beat License Agreement',
    'Publishing Deal',
    'Master Recording Agreement'
  ];

  const generateBaselineTasks = (type: string, status: string) => {
    const baseStructures = {
      single: {
        not_released: [
          'Complete songwriting',
          'Record vocals and instruments', 
          'Mix and master',
          'Create artwork',
          'Submit to distributors',
          'Plan marketing campaign',
          'Schedule release'
        ],
        released: [
          'Analyze performance metrics',
          'Continue marketing efforts',
          'Plan follow-up content',
          'Engage with fans',
          'Track streaming data'
        ]
      },
      ep: {
        not_released: [
          'Complete all tracks',
          'Sequence track order',
          'Mix and master all songs',
          'Create EP artwork',
          'Write press release',
          'Submit to distributors',
          'Plan marketing campaign',
          'Schedule listening party'
        ],
        released: [
          'Monitor performance across all tracks',
          'Create performance reports',
          'Plan tour or live performances',
          'Develop merchandise strategy'
        ]
      },
      album: {
        not_released: [
          'Complete all album tracks',
          'Finalize track sequence',
          'Mix and master album',
          'Design album package',
          'Plan album rollout strategy',
          'Submit to distributors',
          'Coordinate press campaign',
          'Plan album release event'
        ],
        released: [
          'Track album performance',
          'Execute touring strategy',
          'Manage ongoing promotion',
          'Plan music videos',
          'Coordinate interviews and press'
        ]
      }
    };
    
    return baseStructures[type]?.[status] || [];
  };

  const handleCreateProject = async () => {
    if (!projectData.title.trim()) return;

    setIsCreating(true);
    try {
      const { data: { user } } = await s.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create project
      const { data: project, error: projectError } = await s
        .from('projects')
        .insert({
          title: projectData.title,
          type: projectData.type,
          status: projectData.status,
          description: projectData.description,
          owner_id: user.id
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Add creator as owner to project_members
      const { error: memberError } = await s
        .from('project_members')
        .insert({
          project_id: project.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      // Generate baseline tasks
      const baselineTasks = generateBaselineTasks(projectData.type, projectData.status);
      if (baselineTasks.length > 0) {
        const tasksToInsert = baselineTasks.map((taskTitle, index) => ({
          title: taskTitle,
          project_id: project.id,
          assignee_id: user.id,
          due_date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'todo',
          priority: index < 3 ? 'high' : 'medium',
          created_by: user.id
        }));

        const { error: tasksError } = await s
          .from('tasks')
          .insert(tasksToInsert);

        if (tasksError) console.error('Error creating tasks:', tasksError);
      }

      // TODO: Generate contracts if needed
      // TODO: Invite team members if emails provided

      onProjectCreated(project);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={projectData.description}
              onChange={(e) => setProjectData({...projectData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Brief description of your project"
              rows={3}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Drop image here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invite Team Members</label>
            <input
              type="text"
              value={projectData.teamEmails}
              onChange={(e) => setProjectData({...projectData, teamEmails: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter email addresses separated by commas"
            />
            <div className="flex items-center gap-2 mt-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm opacity-50 cursor-not-allowed">
                <Link size={16} />
                Copy invite link (Coming soon)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Types Needed</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {contractTypes.map((contractType) => (
                <label key={contractType} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={projectData.contracts.includes(contractType)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProjectData({
                          ...projectData, 
                          contracts: [...projectData.contracts, contractType]
                        });
                      } else {
                        setProjectData({
                          ...projectData,
                          contracts: projectData.contracts.filter(c => c !== contractType)
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{contractType}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Contract generation coming soon</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              disabled={!projectData.title || isCreating}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;