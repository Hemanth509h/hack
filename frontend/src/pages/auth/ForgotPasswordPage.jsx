import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../features/auth/authApi';
import AuthLayout from '../../components/layout/AuthLayout';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});



export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setSuccess(true);
    } catch (err) {
      console.error('Failed to request reset:', err);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you instructions">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            If an account exists for <strong>{watch('email')}</strong>, you will receive a password reset link shortly.
          </p>
          <Link
            to="/login"
            className="block w-full py-2.5 px-4 bg-black/10 dark:bg-white/10 hover:bg-white/20 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {'data' in error 
              ? (error.data as any)?.error || 'Failed to process request'
              : 'An unexpected error occurred'}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Mail size={18} />
            </div>
            <input
              type="email"
              {...register('email')}
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-100 transition-colors"
              placeholder="you@university.edu"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Send Reset Link</span>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Remember your password?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
