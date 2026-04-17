import React from 'react';
import { Home, Calendar, Users, Map as MapIcon, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] z-50 glass rounded-[2rem] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
      <div className="flex items-center justify-around h-12">
        <NavItem to="/discover" icon={<Home size={22} />} active={location.pathname === '/discover'} />
        <NavItem to="/events" icon={<Calendar size={22} />} active={location.pathname.startsWith('/events')} />
        <NavItem to="/clubs" icon={<Users size={22} />} active={location.pathname === '/clubs'} />
        <NavItem to="/map" icon={<MapIcon size={22} />} active={location.pathname === '/map'} />
        <NavItem to="/profile" icon={<User size={22} />} active={location.pathname === '/profile'} />
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; active?: boolean }> = ({ to, icon, active }) => (
  <Link to={to} className={cn(
    "relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
    active ? "bg-indigo-500/10 text-indigo-400" : "text-gray-500 hover:text-white"
  )}>
    <div className={cn(
      "transition-transform duration-300",
      active ? "scale-110" : "group-hover:scale-110"
    )}>
      {icon}
    </div>
    {active && (
      <motion.div 
        layoutId="bottom-nav-active"
        className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
      />
    )}
  </Link>
);

export default BottomNav;
