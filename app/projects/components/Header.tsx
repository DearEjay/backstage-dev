import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 capitalize">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          <form action="/auth/signout" method="post">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings size={20} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}