import React from 'react';
import { Search, Bell, Home, Calendar, Users, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  onSearchClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { unreadCount, isConnected } = useSocket();
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl h-16 px-6 flex items-center justify-between shadow-2xl">
        {/* Logo */}
        <Link to="/discover" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            Q
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">The Quad</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-1">
          <NavLink to="/discover" icon={<Home size={20} />} label="Home" active={location.pathname === '/discover'} />
          <NavLink to="/events" icon={<Calendar size={20} />} label="Events" active={location.pathname.startsWith('/events')} />
          <NavLink to="/clubs" icon={<Users size={20} />} label="Clubs" active={location.pathname === '/clubs'} />
          <NavLink to="/teams" icon={<Briefcase size={20} />} label="Teams" active={location.pathname === '/teams'} />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSearchClick}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center space-x-2 px-4 group"
          >
            <Search size={18} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors hidden md:block">Search...</span>
            <kbd className="hidden lg:flex items-center px-1.5 h-5 font-mono text-[10px] font-medium bg-white/5 border border-white/10 rounded text-gray-500">
              ⌘K
            </kbd>
          </button>

          <div className="relative">
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <Bell size={18} className="text-gray-400 hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-gray-900 shadow-sm animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"
          )} title={isConnected ? 'Connected' : 'Disconnected'} />
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ to, icon, label, active }) => (
  <Link to={to} className={cn(
    "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group",
    active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
  )}>
    {icon}
    <span className="text-sm font-medium hidden lg:block">{label}</span>
  </Link>
);

export default Navbar;
