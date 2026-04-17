import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Map as MapIcon, 
  User, 
  Briefcase, 
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
  const location = useLocation();

  const navItems = [
    { to: '/discover', icon: <Home size={22} />, label: 'Home' },
    { to: '/events', icon: <Calendar size={22} />, label: 'Events' },
    { to: '/clubs', icon: <Users size={22} />, label: 'Clubs' },
    { to: '/teams', icon: <Briefcase size={22} />, label: 'Teams' },
    { to: '/map', icon: <MapIcon size={22} />, label: 'Campus Map' },
  ];

  const secondaryItems = [
    { to: '/notifications', icon: <Bell size={22} />, label: 'Notifications' },
    { to: '/profile', icon: <User size={22} />, label: 'Profile' },
    { to: '/settings', icon: <Settings size={22} />, label: 'Settings' },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gray-950 border-r border-white/5 flex-col z-40 transition-all duration-300">
      <div className="p-8 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg">
          Q
        </div>
        <span className="font-bold text-xl tracking-tight text-white">The Quad</span>
      </div>

      <div className="px-4 mb-6">
        <button
          onClick={onSearchClick}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
        >
          <Search size={20} className="text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">Search...</span>
          <kbd className="ml-auto hidden lg:flex items-center px-1.5 h-5 font-mono text-[10px] font-medium bg-white/5 border border-white/10 rounded text-gray-500">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-4">
          Navigation
        </div>
        {navItems.map((item) => (
          <SidebarLink 
            key={item.to} 
            {...item} 
            active={location.pathname === item.to || (item.to !== '/discover' && location.pathname.startsWith(item.to))} 
          />
        ))}

        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-4 mt-8">
          Personal
        </div>
        {secondaryItems.map((item) => (
          <SidebarLink 
            key={item.to} 
            {...item} 
            active={location.pathname === item.to} 
          />
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 group">
          <LogOut size={22} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
      active 
        ? "bg-blue-500/10 text-blue-400" 
        : "text-gray-500 hover:text-white hover:bg-white/5"
    )}
  >
    <div className={cn(
      "transition-transform duration-200 group-hover:scale-110",
      active ? "text-blue-400" : "text-gray-500 group-hover:text-white"
    )}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
    
    {active && (
      <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
    )}
  </Link>
);

export default Sidebar;
