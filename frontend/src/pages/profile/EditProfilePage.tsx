import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetProfileQuery, useUpdateProfileMutation, useUpdateInterestsMutation } from '../../services/profileApi';
import { Save, User, BookOpen, Link as LinkIcon, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { data: profile, isLoading } = useGetProfileQuery(currentUser?.id as string, { skip: !currentUser });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateInterests] = useUpdateInterestsMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

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

  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    try {
      await updateProfile({
        userId: currentUser.id,
        body: {
          major: data.major,
          graduationYear: data.graduationYear ? parseInt(data.graduationYear) : undefined,
          bio: data.bio,
          portfolioLinks: {
            github: data.github,
            linkedin: data.linkedin,
            website: data.website,
          }
        }
      }).unwrap();

      if (data.interests) {
         const interestsArray = data.interests.split(',').map((i: string) => i.trim()).filter(Boolean);
         await updateInterests({ userId: currentUser.id, interests: interestsArray }).unwrap();
      }

      navigate(`/profile/${currentUser.id}`);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading editor...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
      <p className="text-gray-400 mb-8">Update your personal information and how you appear to others on The Quad.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><User className="text-primary-500 w-5 h-5"/> Basic Information</h2>
          
          <div className="flex gap-6 mb-6 items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-800 rounded-full border border-gray-700 overflow-hidden">
                 <img src={profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button type="button" className="absolute bottom-0 right-0 bg-primary-600 p-1.5 rounded-full text-white hover:bg-primary-500 transition-colors">
                 <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-white font-medium">{profile?.name}</p>
               <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Major</label>
              <input {...register('major')} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Graduation Year</label>
              <input {...register('graduationYear')} type="number" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" placeholder="2025" />
            </div>
          </div>
          
          <div className="mt-4">
             <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
             <textarea {...register('bio')} rows={4} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" placeholder="Tell us about yourself..." />
          </div>
        </div>

        {/* Interests & Skills */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
           <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><BookOpen className="text-primary-500 w-5 h-5"/> Discovery</h2>
           <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Interests (Comma separated)</label>
              <input {...register('interests')} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" placeholder="e.g. AI, Web Development, Design" />
           </div>
        </div>

        {/* Social Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
           <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><LinkIcon className="text-primary-500 w-5 h-5"/> Portfolio Links</h2>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL</label>
                <input {...register('github')} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" placeholder="https://github.com/username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn URL</label>
                <input {...register('linkedin')} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" placeholder="https://linkedin.com/in/username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Personal Website</label>
                <input {...register('website')} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" placeholder="https://myportfolio.com" />
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isUpdating} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">
             <Save className="w-4 h-4" /> {isUpdating ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
