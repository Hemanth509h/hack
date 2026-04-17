import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegisterMutation } from '../../features/auth/authApi';
import AuthLayout from '../../components/layout/AuthLayout';
import { Loader2, Mail, Lock, User, BookOpen, Calendar } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  major: z.string().optional(),
  graduationYear: z.number().or(z.string().transform(Number)).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const PREDEFINED_SKILLS = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'UI/UX Design', 'Machine Learning'];
const PREDEFINED_INTERESTS = ['Hackathons', 'Open Source', 'Web Dev', 'Data Science', 'Startups', 'Gaming'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      skills: [],
      interests: [],
    },
  });

  const selectedSkills = watch('skills') || [];
  const selectedInterests = watch('interests') || [];

  const toggleSelection = (field: 'skills' | 'interests', item: string) => {
    const current = watch(field) || [];
    if (current.includes(item)) {
      setValue(field, current.filter(i => i !== item));
    } else {
      setValue(field, [...current, item]);
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['name', 'email', 'password', 'termsAccepted']);
    } else if (step === 2) {
      isValid = await trigger(['major', 'graduationYear']);
    }
    
    if (isValid) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        major: data.major,
        graduationYear: data.graduationYear ? Number(data.graduationYear) : undefined,
        interests: data.interests || [],
        // Backend currently only expects partial fields but we send them all.
      }).unwrap();
      
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a verification link">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <p className="text-gray-300">
            Please click the link in the email we sent to <strong>{watch('email')}</strong> to verify your account and complete registration.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle={`Step ${step} of 3: ${step === 1 ? 'Account Info' : step === 2 ? 'Profile' : 'Interests'}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {'data' in error 
              ? (error.data as any)?.error || 'Registration failed'
              : 'An unexpected error occurred'}
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex space-x-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 shadow-none">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    {...register('name')}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    placeholder="you@university.edu"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    {...register('password')}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>
              
              <div className="pt-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('termsAccepted')}
                    className="mt-1 rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-400 text-sm">
                    I agree to the <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.termsAccepted && <p className="mt-1 text-sm text-red-500">{errors.termsAccepted.message}</p>}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Major</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <BookOpen size={18} />
                  </div>
                  <input
                    type="text"
                    {...register('major')}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Graduation Year</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="number"
                    {...register('graduationYear')}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    placeholder="2027"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">What are your skills?</label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_SKILLS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSelection('skills', skill)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">What are you interested in?</label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleSelection('interests', interest)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                        selectedInterests.includes(interest)
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex space-x-3 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Complete Registration</span>}
            </button>
          )}
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
