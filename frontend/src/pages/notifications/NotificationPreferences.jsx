import React, { useEffect, useState } from 'react';
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from '../../services/notificationApi';
import { Save, Bell, Mail, Smartphone } from 'lucide-react';
import cn from 'clsx';

const NotificationPreferences: React.FC = () => {
  const { data, isLoading } = useGetPreferencesQuery();
  const [updatePrefs, { isLoading: isUpdating }] = useUpdatePreferencesMutation();

  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    inApp: true
  });

  useEffect(() => {
    if (data) {
      setPrefs({ email: data.email, push: data.push, inApp: data.inApp });
    }
  }, [data]);

  const handleSave = async () => {
    await updatePrefs(prefs).unwrap();
  };

  const Toggle = ({ label, icon, value, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg mb-3 hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
          {icon}
        </div>
        <div>
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          <p className="text-sm text-gray-500">Receive notifications via {label.toLowerCase()}.</p>
        </div>
      </div>
      <button 
        onClick={() => onChange(!value)}
        className={cn(
          "w-12 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer",
          value ? "bg-primary-500" : "bg-gray-700"
        )}
      >
        <div className={cn(
          "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
          value ? "translate-x-7" : "translate-x-1"
        )} />
      </button>
    </div>
  );

  if (isLoading) return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading preferences...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notification Preferences</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Manage how and where you receive notifications.</p>

      <div className="space-y-4">
        <Toggle 
          label="In-App Notifications" 
          icon={<Bell className="w-5 h-5" />} 
          value={prefs.inApp} 
          onChange={(v) => setPrefs(p => ({ ...p, inApp: v }))} 
        />
        <Toggle 
          label="Email Reports" 
          icon={<Mail className="w-5 h-5" />} 
          value={prefs.email} 
          onChange={(v) => setPrefs(p => ({ ...p, email: v }))} 
        />
        <Toggle 
          label="Push Notifications" 
          icon={<Smartphone className="w-5 h-5" />} 
          value={prefs.push} 
          onChange={(v) => setPrefs(p => ({ ...p, push: v }))} 
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-gray-900 dark:text-white px-6 py-2.5 rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isUpdating ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
