import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../../features/auth/authApi';
import { logout } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { 
  Home, 
  Calendar, 
  Users, 
  Map, 
  User, 
  Briefcase, 
  Settings,
  LogOut,
  Bell,
  Search,
  ShieldCheck,
  MessageSquare,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ onSearchClick }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      dispatch(logout()); // Ensure local state is cleared even if server fails
      navigate('/login');
    }
  };

  const navItems = [
    { to: '/discover', icon: <Home size={22} />, label: 'Home' },
    { to: '/feed', icon: <Activity size={22} />, label: 'Pulse' },
    { to: '/events', icon: <Calendar size={22} />, label: 'Events' },
    { to: '/clubs', icon: <Users size={22} />, label: 'Clubs' },
    { to: '/teams', icon: <Briefcase size={22} />, label: 'Teams' },
    { to: '/map', icon: <Map size={22} />, label: 'Campus Map' },
    { to: '/chat', icon: <MessageSquare size={22} />, label: 'Messages' },
  ];

  const secondaryItems = [
    { to: '/notifications', icon: <Bell size={22} />, label: 'Notifications' },
    { to: '/profile', icon: <User size={22} />, label: 'Profile' },
    { to: '/settings', icon: <Settings size={22} />, label: 'Settings' },
  ];

  if (user?.role === 'admin') {
    secondaryItems.push({ to: '/admin', icon: <ShieldCheck size={22} />, label: 'Admin Panel' });
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gray-50 dark:bg-[#030303] border-r border-black/5 dark:border-white/5 flex-col z-40 transition-all duration-300">
      <div className="p-10 flex items-center space-x-3">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center font-bold text-xl text-gray-900 dark:text-white shadow-lg">
          Q
        </div>
        <span className="font-display font-bold text-2xl tracking-tighter text-gray-900 dark:text-white">The Quad</span>
      </div>

      <div className="px-6 mb-10">
        <button
          onClick={onSearchClick}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5 group"
        >
          <Search size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white transition-colors" />
          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white transition-colors font-medium">Search...</span>
          <kbd className="ml-auto hidden lg:flex items-center px-2 h-6 font-mono text-[10px] font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-gray-500">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 mb-4 opacity-50">
          Main Menu
        </div>
        {navItems.map((item) => (
          <SidebarLink 
            key={item.to} 
            {...item} 
            active={location.pathname === item.to || (item.to !== '/discover' && location.pathname.startsWith(item.to))} 
          />
        ))}

        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 mb-4 mt-12 opacity-50">
          Personal Workspace
        </div>
        {secondaryItems.map((item) => (
          <SidebarLink 
            key={item.to} 
            {...item} 
            active={location.pathname === item.to} 
          />
        ))}
      </nav>

      <div className="p-6 mt-auto flex gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-4 rounded-2xl text-gray-500 hover:text-gray-900 dark:hover:text-gray-900 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 group"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={22} className="group-hover:rotate-90 transition-all" /> : <Moon size={22} className="group-hover:-rotate-12 transition-all" />}
        </button>
        <button 
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center space-x-4 px-6 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
      active 
        ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]" 
        : "text-gray-500 hover:text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
    )}
  >
    <div className={cn(
      "transition-all duration-300",
      active ? "text-indigo-400 scale-110" : "text-gray-500 group-hover:text-gray-900 dark:text-white group-hover:scale-110"
    )}>
      {icon}
    </div>
    <span className="font-semibold tracking-tight">{label}</span>
    
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1.5 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
      />
    )}
  </Link>
);

export default Sidebar;
