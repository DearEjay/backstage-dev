import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface CreateTaskFormProps {
  projectId: string;
  onTaskCreated: (task: any) => void;
  onCancel: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ projectId, onTaskCreated, onCancel }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const s = supabaseBrowser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;

    setIsCreating(true);
    try {
      const { data: { user } } = await s.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await s
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description || null,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.due_date || null,
          project_id: projectId,
          assignee_id: user.id,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      onTaskCreated(data);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Optional task description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={taskData.status}
              onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={taskData.priority}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={taskData.due_date}
              onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!taskData.title.trim() || isCreating}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              'Creating...'
            ) : (
              <>
                <Plus size={16} />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;