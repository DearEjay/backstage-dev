'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ListTodo, Users, FileText, BarChart3, Calendar } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { ProjectHeader } from '../../components/projects/ProjectHeader';
import TaskList from '../../components/tasks/TaskList';
import CalendarModule from 'app/(dashboard)/calendar/page';
import TeamModule from 'app/(dashboard)/team/page';
import ContractsModule from 'app/(dashboard)/contracts/page';
import InsightsModule from 'app/(dashboard)/insights/page';

export default function ProjectDetail() {
  const [currentTab, setCurrentTab] = useState('tasks');
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const projectId = params.id as string;
  const s = supabaseBrowser();

  async function loadProject() {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await s.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get project with user permissions
      const { data: project, error } = await s
        .from('projects')
        .select(`
          *,
          project_members!inner(user_id, role)
        `)
        .eq('id', projectId)
        .eq('project_members.user_id', user.id)
        .single();

      if (error) throw error;
      setProject(project);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'insights', label: 'Insights', icon: BarChart3 }
  ];

  return (
    <div className="p-6">
      <ProjectHeader project={project} isLoading={isLoading} />
      
      <div className="mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  currentTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-[500px]">
        {currentTab === 'tasks' && (
          <TaskList projectId={projectId} isLoading={isLoading} />
        )}
        {currentTab === 'calendar' && (
          <CalendarModule projectId={projectId} />
        )}
        {currentTab === 'team' && (
          <TeamModule projectId={projectId} />
        )}
        {currentTab === 'contracts' && (
          <ContractsModule projectId={projectId} />
        )}
        {currentTab === 'insights' && (
          <InsightsModule projectId={projectId} />
        )}
      </div>
    </div>
  );
}