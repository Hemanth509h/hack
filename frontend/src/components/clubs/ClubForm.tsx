import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Info, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useCreateClubMutation } from '../../services/clubApi';
import { useNavigate } from 'react-router-dom';

const clubSchema = z.object({
  name: z.string().min(3, 'Club name must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  meetingSchedule: z.string().min(5, 'Meeting schedule is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  instagram: z.string().optional(),
  discord: z.string().optional(),
  tags: z.string().optional(),
});

type ClubFormValues = z.infer<typeof clubSchema>;

export const ClubForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [createClub, { isLoading }] = useCreateClubMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ClubFormValues>({
    resolver: zodResolver(clubSchema),
  });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ['name', 'category', 'description'] as const
      : step === 2 
      ? ['logo', 'coverImage', 'meetingSchedule'] as const
      : ['website', 'instagram', 'discord'] as const;
      
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: ClubFormValues) => {
    try {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        socialLinks: {
          website: data.website,
          instagram: data.instagram,
          discord: data.discord
        }
      };
      
      const result = await createClub(formattedData).unwrap();
      navigate(`/clubs/${result._id}`);
    } catch (error) {
      console.error('Submission error', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-800" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step >= num ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-4 uppercase tracking-widest px-1">
          <span>Identity</span>
          <span>Visuals & Logistics</span>
          <span>Connectivity</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-400" /> Club Identity
                  </h2>
                  <p className="text-gray-400 text-sm">Every great tribe starts with a clear mission.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Club Name</label>
                  <input
                    {...register('name')}
                    placeholder="E.g., The Tech Enclave"
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <select
                    {...register('category')}
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Tech">Tech</option>
                    <option value="Arts">Arts</option>
                    <option value="Debate">Debate</option>
                    <option value="Volley">Volley</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                  </select>
                  {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    {...register('description')}
                    rows={5}
                    placeholder="Tell the campus what your club is about and why they should join..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  />
                  {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-indigo-400" /> Visuals & Logistics
                  </h2>
                  <p className="text-gray-400 text-sm">Make your club stand out with beautiful imagery.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Logo URL</label>
                    <input
                      {...register('logo')}
                      placeholder="https://..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Image URL</label>
                    <input
                      {...register('coverImage')}
                      placeholder="https://..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meeting Schedule</label>
                  <input
                    {...register('meetingSchedule')}
                    placeholder="E.g., Every Tuesday at 5 PM in Room 402"
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  {errors.meetingSchedule && <p className="text-red-400 text-xs mt-1">{errors.meetingSchedule.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags (Comma separated)</label>
                  <input
                    {...register('tags')}
                    placeholder="coding, hackathons, open-source"
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-indigo-400" /> Connectivity
                  </h2>
                  <p className="text-gray-400 text-sm">Where can members find you online?</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Website</label>
                    <input
                      {...register('website')}
                      placeholder="https://example.com"
                      className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Instagram Username</label>
                    <input
                      {...register('instagram')}
                      placeholder="@thequadclub"
                      className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discord Link</label>
                    <input
                      {...register('discord')}
                      placeholder="https://discord.gg/..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <p className="text-amber-500/80 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Note: All new clubs are submitted for administrative review. You will be notified once your club is approved and live.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-8 border-t border-gray-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Go Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit for Approval'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
