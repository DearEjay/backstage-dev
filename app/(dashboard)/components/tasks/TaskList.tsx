import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';
import TaskItem from './TaskItem';
import CreateTaskForm from './CreateTaskForm';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string;
  assignee_id?: string;
  created_at: string;
}

interface TaskListProps {
  projectId: string;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ projectId, isLoading }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const s = supabaseBrowser();

  async function loadTasks() {
    if (!projectId) return;
    
    setLoadingTasks(true);
    try {
      const { data, error } = await s
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setShowCreateForm(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getStatusStats = () => {
    const stats = {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (isLoading || loadingTasks) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-4 border">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-4 border">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-600">To Do</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todo}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-600">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.in_progress}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
        </div>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateTaskForm
            projectId={projectId}
            onTaskCreated={handleTaskCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No tasks yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create your first task
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;