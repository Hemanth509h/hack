import React from 'react';
import { Eye, ArrowLeft, Shield, Globe, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';

const PrivacySettingsPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <button 
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white transition-colors mb-8 font-bold"
      >
        <ArrowLeft size={18} /> Back to Settings
      </button>

      <div className="max-w-xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
            <Eye size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Privacy</h1>
            <p className="text-gray-500">Control your visibility and data sharing.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden">
            <PrivacyToggle 
              icon={<Globe size={20} className="text-blue-400" />}
              title="Public Profile"
              description="Allow non-students and search engines to see your profile."
              defaultChecked={false}
            />
            <PrivacyToggle 
              icon={<Users size={20} className="text-indigo-400" />}
              title="Show Club Memberships"
              description="Display the clubs you are a part of on your profile."
              defaultChecked={true}
            />
            <PrivacyToggle 
              icon={<Shield size={20} className="text-emerald-400" />}
              title="Activity Status"
              description="Show when you are online and browsing The Quad."
              defaultChecked={true}
            />
          </div>

          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
             <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                <Info size={16} /> Data Export
             </h4>
             <p className="text-sm text-gray-500 mb-4">You can request a copy of all your data associated with The Quad at any time.</p>
             <button className="text-xs font-bold text-gray-900 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-black/5 dark:border-white/5">
                Download My Data (.JSON)
             </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

const PrivacyToggle = ({ 
  icon, title, description, defaultChecked 
}) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  
  return (
    <div className="flex items-center justify-between p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all border-b border-black/5 dark:border-white/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-indigo-600' : 'bg-gray-50 dark:bg-gray-800'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
};

const Info = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default PrivacySettingsPage;
