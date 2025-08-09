'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Calendar, Users, FileText, BarChart3, User } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { id: 'projects', label: 'Projects', icon: Music, href: '/projects' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
    { id: 'team', label: 'Team', icon: Users, href: '/team' },
    { id: 'contracts', label: 'Contracts', icon: FileText, href: '/contracts' },
    { id: 'insights', label: 'Insights', icon: BarChart3, href: '/insights' }
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          CADENCE
        </h1>
        <p className="text-sm text-gray-500 mt-1">Music Project OS</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <User size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">User Profile</p>
            <p className="text-xs text-gray-500">Artist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;