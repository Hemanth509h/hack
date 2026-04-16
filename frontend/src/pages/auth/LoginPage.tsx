import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import { Loader2, Mail, Lock, Github, Chrome } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const from = location.state?.from?.pathname || '/discover';

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login({ email: data.email, password: data.password }).unwrap();
      dispatch(
        setCredentials({
          user: response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login failed:', err);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'microsoft') => {
    // Redirect to backend OAuth endpoint
    window.location.href = `http://localhost:5000/api/v1/auth/${provider}`;
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {'data' in error 
              ? (error.data as any)?.error || 'Invalid credentials'
              : 'An unexpected error occurred'}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Mail size={18} />
            </div>
            <input
              type="email"
              {...register('email')}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 transition-colors"
              placeholder="you@university.edu"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type="password"
              {...register('password')}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <span className="text-gray-400">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Sign In</span>}
        </button>
      </form>

      {/* OAuth Separator */}
      <div className="mt-6 flex items-center">
        <div className="flex-1 border-t border-white/10"></div>
        <span className="px-3 text-gray-500 text-sm">Or continue with</span>
        <div className="flex-1 border-t border-white/10"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white text-sm font-medium"
        >
          <Chrome size={18} />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('microsoft')}
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white text-sm font-medium"
        >
          <Github size={18} /> {/* Note: A Microsoft logo isn't standard in lucide, using generic or Github placeholder for now */}
          <span>Microsoft</span>
        </button>
      </div>

      {/* Bottom Text */}
      <p className="mt-8 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
          Create one now
        </Link>
      </p>
    </AuthLayout>
  );
}
