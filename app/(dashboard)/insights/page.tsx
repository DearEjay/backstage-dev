'use client'; // Add this line at the very top of the file

import React, { useState, useEffect } from 'react';
import { 
  Activity, CheckCircle, DollarSign, TrendingUp, 
  Plus, Award, Target, BarChart3, Eye, Users
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface InsightsModuleProps {
  projectId: string;
}

const InsightsModule: React.FC<InsightsModuleProps> = ({ projectId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [okrs, setOkrs] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const s = supabaseBrowser();

  useEffect(() => {
    loadInsightsData();
  }, [projectId]);

  const loadInsightsData = async () => {
    setIsLoading(true);
    try {
      // TODO: Load OKRs and milestones from database
      // TODO: Calculate KPIs based on project data
      
      // Mock empty state for now
      setOkrs([]);
      setMilestones([]);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mockKPIs = [
    { title: 'Active Tasks', value: '0', change: '+0%', icon: Activity, color: 'purple' },
    { title: 'Completed Tasks', value: '0', change: '+0%', icon: CheckCircle, color: 'green' },
    { title: 'Team Members', value: '1', change: '+0%', icon: Users, color: 'blue' },
    { title: 'Project Progress', value: '0%', change: '+0%', icon: TrendingUp, color: 'orange' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* KPI Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Content Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-2 w-full bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Project Insights</h2>
          <p className="text-gray-600">Track performance and project analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Connect Platforms
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mockKPIs.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                kpi.color === 'purple' ? 'bg-purple-100' : 
                kpi.color === 'green' ? 'bg-green-100' : 
                kpi.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <kpi.icon size={20} className={
                  kpi.color === 'purple' ? 'text-purple-600' : 
                  kpi.color === 'green' ? 'text-green-600' : 
                  kpi.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                } />
              </div>
              <span className="text-gray-500 text-sm font-medium">{kpi.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
            <p className="text-gray-600 text-sm">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* OKR and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* OKRs Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Objectives & Key Results</h3>
            <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm">
              <Plus size={16} />
              Add OKR
            </button>
          </div>
          
          {okrs.length === 0 ? (
            <div className="text-center py-8">
              <Target size={32} className="mx-auto text-gray-400 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">No OKRs Set</h4>
              <p className="text-gray-500 text-sm mb-4">
                Set objectives and key results to track your project goals
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                Create First OKR
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* TODO: Render OKRs */}
            </div>
          )}
        </div>

        {/* Milestones Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Project Milestones</h3>
            <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm">
              <Plus size={16} />
              Add Milestone
            </button>
          </div>
          
          {milestones.length === 0 ? (
            <div className="text-center py-8">
              <Award size={32} className="mx-auto text-gray-400 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">No Milestones</h4>
              <p className="text-gray-500 text-sm mb-4">
                Track important project milestones and achievements
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                Add Milestone
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* TODO: Render milestones */}
            </div>
          )}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
          <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm">
            <Eye size={16} />
            View Details
          </button>
        </div>
        
        <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center border border-purple-100">
          <div className="text-center">
            <BarChart3 size={48} className="text-purple-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Analytics Coming Soon</h4>
            <p className="text-gray-600 mb-4 max-w-md">
              Connect your streaming platforms and social media accounts to see detailed performance analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Connect Spotify
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Connect Apple Music
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Tips */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Pro Tips</h3>
        <p className="text-gray-600 mb-4">Get the most out of your project insights</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">Set Clear OKRs</h4>
            <p className="text-sm text-gray-600">Define specific, measurable objectives for your project</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">Track Progress Weekly</h4>
            <p className="text-sm text-gray-600">Regular check-ins help maintain momentum</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">Connect Platforms</h4>
            <p className="text-sm text-gray-600">Link streaming services for automated analytics</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">Review & Adjust</h4>
            <p className="text-sm text-gray-600">Use insights to improve your workflow</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsModule;