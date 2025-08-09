import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Edit3, Trash2, Calendar } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string;
  assignee_id?: string;
  created_at: string;
}

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isLoading, setIsLoading] = useState(false);
  const s = supabaseBrowser();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in_progress': return 'text-blue-500';
      default: return 'text-orange-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTask({ status: newStatus });
  };

  const updateTask = async (updates: Partial<Task>) => {
    setIsLoading(true);
    try {
      const { data, error } = await s
        .from('tasks')
        .update(updates)
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      onTaskUpdated(data);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTask.title.trim()) return;
    
    await updateTask({
      title: editedTask.title,
      status: editedTask.status,
      priority: editedTask.priority,
      due_date: editedTask.due_date
    });
    
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsLoading(true);
    try {
      const { error } = await s
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;
      onTaskDeleted(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = getStatusIcon(task.status);

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Task title"
          />
          
          <div className="grid grid-cols-3 gap-3">
            <select
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <input
              type="date"
              value={editedTask.due_date ? new Date(editedTask.due_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedTask({ ...task });
              }}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isLoading || !editedTask.title.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow ${
      task.status === 'completed' ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleStatusToggle}
          disabled={isLoading}
          className={`mt-1 ${getStatusColor(task.status)} hover:opacity-70 disabled:opacity-50`}
        >
          <StatusIcon size={20} />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h4 className={`font-medium text-gray-900 ${
              task.status === 'completed' ? 'line-through opacity-60' : ''
            }`}>
              {task.title}
            </h4>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {task.due_date && (
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar size={12} />
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
            
            <span className="text-gray-400 capitalize">
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;