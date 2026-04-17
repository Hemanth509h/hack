import React from 'react';
import { Home, Calendar, Users, Briefcase, Map as MapIcon, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-gray-900/90 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <NavItem to="/discover" icon={<Home size={22} />} active={location.pathname === '/discover'} />
        <NavItem to="/events" icon={<Calendar size={22} />} active={location.pathname.startsWith('/events')} />
        <NavItem to="/clubs" icon={<Users size={22} />} active={location.pathname === '/clubs'} />
        <NavItem to="/map" icon={<MapIcon size={22} />} active={location.pathname === '/map'} />
        {/* Assume profile is at /profile */}
        <NavItem to="/profile" icon={<User size={22} />} active={location.pathname === '/profile'} />
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; active?: boolean }> = ({ to, icon, active }) => (
  <Link to={to} className={cn(
    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
    active ? "text-blue-500" : "text-gray-500 hover:text-gray-300"
  )}>
    {icon}
    {active && <span className="w-1 h-1 rounded-full bg-blue-500 rounded-full" />}
  </Link>
);

export default BottomNav;
