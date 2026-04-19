import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../services/profileApi';
import PageContainer from '../../components/layout/PageContainer';
import { User, Mail, GraduationCap, Github, Linkedin, Globe, Save, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfilePage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetProfileQuery(currentUser?.id, { skip: !currentUser });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (profile) {
      reset({
        major: profile.major || '',
        graduationYear: profile.graduationYear || '',
        bio: profile.bio || '',
        interests: profile.interests?.join(', ') || '',
        github: profile.portfolioLinks?.github || '',
        linkedin: profile.portfolioLinks?.linkedin || '',
        website: profile.portfolioLinks?.website || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    if (!currentUser) return;
    try {
      await updateProfile({
        userId: currentUser.id,
        body: {
          major: data.major,
          graduationYear: data.graduationYear ? parseInt(data.graduationYear) : undefined,
          bio: data.bio,
          interests: data.interests.split(',').map(i => i.trim()).filter(i => i),
          portfolioLinks: {
            github: data.github,
            linkedin: data.linkedin,
            website: data.website,
          }
        }
      }).unwrap();
      navigate('/profile');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <PageContainer className="py-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Edit Identity</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="glass rounded-[2.5rem] p-10 border-black/5 dark:border-white/5 space-y-8 shadow-2xl">
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
              <User size={20} />
              <h3 className="text-xs font-black uppercase tracking-widest">Core Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Academic Major</label>
                <input {...register('major')} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Graduation Year</label>
                <input type="number" {...register('graduationYear')} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Bio / Mission Statement</label>
              <textarea {...register('bio')} rows={4} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Interests (Comma Separated)</label>
              <input {...register('interests')} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all" />
            </div>
          </section>

          <section className="space-y-6 pt-8 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-3 text-purple-400 mb-2">
              <Globe size={20} />
              <h3 className="text-xs font-black uppercase tracking-widest">Connect Presence</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2"><Github size={12} /> GitHub</label>
                <input {...register('github')} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2"><Linkedin size={12} /> LinkedIn</label>
                <input {...register('linkedin')} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all" />
              </div>
            </div>
          </section>

          <div className="pt-8 flex justify-end">
            <button type="submit" disabled={isUpdating} className="btn-primary flex items-center gap-2 px-10 py-4 disabled:opacity-50">
              {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Update Identity
            </button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};

export default EditProfilePage;
