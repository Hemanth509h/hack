import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';

const securitySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

const SecuritySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema)
  });

  const onSubmit = async (data: SecurityFormValues) => {
    // Implement password change logic here
    console.log('Changing password', data);
    alert('In a real app, this would call your backend /auth/change-password endpoint!');
  };

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
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Security</h1>
            <p className="text-gray-500">Manage your password and account protection.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password" 
                  {...register('currentPassword')}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                />
              </div>
              {errors.currentPassword && <p className="text-red-400 text-xs">{errors.currentPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password" 
                  {...register('newPassword')}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                />
              </div>
              {errors.newPassword && <p className="text-red-400 text-xs">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password" 
                  {...register('confirmPassword')}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-500 text-gray-900 dark:text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
          >
            Update Password
          </button>
        </form>
      </div>
    </PageContainer>
  );
};

export default SecuritySettingsPage;
