import React from 'react';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import Navigation from './components/Navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = supabaseServer();
  const { data: { user } } = await s.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>
            <div className="flex items-center gap-3">
              <form action="/auth/signout" method="post">
                <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="overflow-y-auto h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}