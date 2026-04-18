import React from 'react';
import { Search, Bell, Home, Calendar, Users, Briefcase, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import NotificationPopover from './NotificationPopover';



const Navbar: React.FC = ({ onSearchClick }) => {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const { isConnected } = useSocket();
  const { theme, toggleTheme } = useTheme();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-6">
      <div className="glass rounded-[1.5rem] h-20 px-8 flex items-center justify-between shadow-2xl border-black/10 dark:border-white/10">
        {/* Logo */}
        <Link to="/discover" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center font-bold text-gray-900 dark:text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            Q
          </div>
          <span className="font-display font-bold text-2xl tracking-tighter hidden sm:block">The Quad</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-2">
          <NavLink to="/discover" icon={<Home size={20} />} label="Home" active={location.pathname === '/discover'} />
          <NavLink to="/events" icon={<Calendar size={20} />} label="Events" active={location.pathname.startsWith('/events')} />
          <NavLink to="/clubs" icon={<Users size={20} />} label="Clubs" active={location.pathname === '/clubs'} />
          <NavLink to="/teams" icon={<Briefcase size={20} />} label="Teams" active={location.pathname === '/teams'} />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSearchClick}
            className="p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5 flex items-center space-x-3 px-5 group"
          >
            <Search size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white group-hover:scale-110 transition-all" />
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white transition-colors hidden lg:block font-medium">Search...</span>
            <kbd className="hidden lg:flex items-center px-2 h-6 font-mono text-[10px] font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-gray-500">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5 dark:border-white/5 group"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white group-hover:rotate-90 transition-all" />
            ) : (
              <Moon size={18} className="text-gray-600 group-hover:text-gray-900 group-hover:-rotate-12 transition-all" />
            )}
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5 group"
            >
              <Bell size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white group-hover:rotate-12 transition-all" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-500 text-gray-900 dark:text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#030303] shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationPopover isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          <div className={cn(
            "w-2.5 h-2.5 rounded-full",
            isConnected ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
          )} title={isConnected ? 'Connected' : 'Disconnected'} />
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC = ({ to, icon, label, active }) => (
  <Link to={to} className={cn(
    "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group",
    active ? "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
  )}>
    {icon}
    <span className="text-sm font-medium hidden lg:block">{label}</span>
  </Link>
);

export default Navbar;
