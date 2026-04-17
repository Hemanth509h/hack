import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  ServerCrash,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../features/admin/adminSlice';
import { RootState } from '../../store';
import { useLogoutMutation } from '../../features/auth/authApi';
import { logout } from '../../features/auth/authSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSidebarOpen = useSelector((state: RootState) => state.admin.isSidebarOpen);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      dispatch(logout());
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Club Approvals', path: '/admin/clubs/pending', icon: <ShieldCheck size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'System', path: '/admin/system', icon: <ServerCrash size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="fixed top-0 left-0 h-screen z-50 bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 h-16">
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Nexus<span className="text-white">Admin</span>
            </motion.div>
          )}
          <button 
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center px-3 py-3 rounded-xl transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
              `}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-3 font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
           <button 
             onClick={handleLogout}
             className="flex items-center w-full px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-all"
             title={!isSidebarOpen ? "Exit Admin" : undefined}
           >
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-3 font-medium">Exit Admin</span>}
           </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main 
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? 260 : 80 }}
        className="flex-1 flex flex-col min-h-screen pt-4 pb-8 px-6 lg:px-10 overflow-x-hidden"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default AdminLayout;
