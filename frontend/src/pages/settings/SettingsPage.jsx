import { 
  Settings, 
  Bell, 
  User, 
  Shield, 
  Lock, 
  Eye, 
  MessageSquare,
  Globe,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useLogoutMutation } from '../../features/auth/authApi';
import { logout } from '../../features/auth/authSlice';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
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

  const sections = [
    {
      title: 'Personal',
      items: [
        { id: 'profile', icon: <User className="text-blue-400" />, title: 'Edit Profile', desc: 'Your name, bio, avatar, and social links', path: '/profile/edit' },
        { id: 'privacy', icon: <Eye className="text-purple-400" />, title: 'Privacy & Visibility', desc: 'Control who can see your profile and activity', path: '/settings/privacy' },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { id: 'push', icon: <Bell className="text-orange-400" />, title: 'Notification Preferences', desc: 'Push notifications and email alerts', path: '/settings/notifications' },
        { id: 'messages', icon: <MessageSquare className="text-emerald-400" />, title: 'Chat & Messaging', desc: 'DMs, group chats, and read receipts', path: '/settings/chat' },
      ]
    },
    {
      title: 'Account & Security',
      items: [
        { id: 'password', icon: <Lock className="text-red-400" />, title: 'Password', desc: 'Change your password and 2FA', path: '/settings/security' },
        { id: 'sessions', icon: <Shield className="text-indigo-400" />, title: 'Active Sessions', desc: 'Manage your logged-in devices', path: '/settings/sessions' },
        { id: 'language', icon: <Globe className="text-blue-500" />, title: 'Language', desc: 'English (US)', path: '/settings/language' },
      ]
    }
  ];

  return (
    <PageContainer>
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight flex items-center gap-4">
          <Settings className="text-gray-500" size={40} />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 rounded-3xl transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-blue-400">Admin Panel</h3>
                  <p className="text-sm text-blue-400/70">Manage users, clubs, and system settings</p>
                </div>
              </div>
              <ChevronRight className="text-blue-500 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4">{section.title}</h2>
              <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden">
                {section.items.map((item, i) => (
                  <Link 
                    key={item.id} 
                    to={item.path}
                    className={`flex items-center justify-between p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all group ${
                      i !== section.items.length - 1 ? 'border-b border-black/5 dark:border-white/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-gray-900 dark:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-6 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-3xl transition-all group mt-12"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <LogOut className="text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-red-500">Log Out</h3>
                <p className="text-sm text-red-500/60">Sign out of your account on this device</p>
              </div>
            </div>
            <ChevronRight className="text-red-500" />
          </button>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.5rem] p-8 text-gray-900 dark:text-white shadow-2xl shadow-blue-500/20">
              <h3 className="text-xl font-black mb-4">The Quad Pro</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Get early access to events, premium club badges, and unlimited team matchmaking requests.
              </p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors">
                 Upgrade Now
              </button>
           </div>

           <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
              <nav className="space-y-3">
                 <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Help Center</a>
                 <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Privacy Policy</a>
                 <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Terms of Service</a>
                 <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Contact Us</a>
              </nav>
              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                 Version 1.4.2-stable
              </div>
           </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
