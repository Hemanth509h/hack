import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../features/auth/authApi';
import AuthLayout from '../../components/layout/AuthLayout';
import { Loader2, Lock, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      navigate('/login');
    }
  }, [token, email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    handleSubmit(async (data) => {
      try {
        const payload = {
          email: email,
          token: token,
          newPassword: data.password,
        };
        
        await resetPassword(payload).unwrap();
        setSuccess(true);
      } catch (err) {
        console.error(err);
      }
    })();
  };

  if (success) {
    return (
      <AuthLayout title="Password Reset Complete" subtitle="Your password has been changed">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            You can now sign in with your new password.
          </p>
          <Link
            to="/login"
            className="block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleManualSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {error.data?.error || 'Invalid or expired token'}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type="password"
              {...register('password')}
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type="password"
              {...register('confirmPassword')}
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Reset Password</span>}
        </button>
      </form>
    </AuthLayout>
  );
}
