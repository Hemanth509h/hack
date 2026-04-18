import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateInterestsMutation,
} from "../../services/profileApi";
import {
  Save,
  User,
  BookOpen,
  Link as LinkIcon,
  Camera,
  ArrowLeft,
  Target,
  Globe,
  Github,
  Linkedin,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";

const EditProfilePage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const { data: profile, isLoading } = useGetProfileQuery(currentUser?.id, {
    skip: !currentUser,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateInterests] = useUpdateInterestsMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (profile) {
      reset({
        major: profile.major || "",
        graduationYear: profile.graduationYear || "",
        bio: profile.bio || "",
        interests: profile.interests?.join(", ") || "",
        github: profile.portfolioLinks?.github || "",
        linkedin: profile.portfolioLinks?.linkedin || "",
        website: profile.portfolioLinks?.website || "",
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
          graduationYear: data.graduationYear
            ? parseInt(data.graduationYear)
            : undefined,
          bio: data.bio,
          portfolioLinks: {
            github: data.github,
            linkedin: data.linkedin,
            website: data.website,
          },
        },
      }).unwrap();

      if (data.interests) {
        const interestsArray = data.interests
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
        await updateInterests({
          userId: currentUser.id,
          interests: interestsArray,
        }).unwrap();
      }

      navigate(`/profile/${currentUser.id}`);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-400">
        Loading editor...
      </div>
    );

  return (
    <PageContainer>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white transition-colors mb-8 font-bold"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Update your personal information and how you appear to others on The
            Quad.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                  <User size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Identity
                </h2>
              </div>

              <div className="flex gap-6 items-center p-4 bg-gray-100 dark:bg-gray-950/50 rounded-3xl border border-gray-200 dark:border-gray-800/50">
                <div className="relative group">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full border-2 border-gray-700 overflow-hidden group-hover:border-blue-500 transition-colors">
                    <img
                      src={
                        profile?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "User")}`
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 bg-blue-600 p-2 rounded-full text-gray-900 dark:text-white hover:bg-blue-500 transition-all shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-bold text-lg">
                    {profile?.name}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    {profile?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                    Major / Field of Study
                  </label>
                  <input
                    {...register("major")}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                    Graduation Year
                  </label>
                  <input
                    {...register("graduationYear")}
                    type="number"
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="2025"
                  />
                </div>
              </div>
            </div>

            {/* About & Interests */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Story
                </h2>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Short Bio
                </label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                  placeholder="Tell the campus your story..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Interests (Comma separated)
                </label>
                <div className="relative">
                  <Target
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                    size={18}
                  />
                  <input
                    {...register("interests")}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    placeholder="AI, WebDev, Chess..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                <LinkIcon size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Digital Presence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 flex items-center gap-2">
                  <Github
                    size={14}
                    className="text-gray-600 dark:text-gray-400"
                  />{" "}
                  GitHub
                </label>
                <input
                  {...register("github")}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="github.com/username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 flex items-center gap-2">
                  <Linkedin size={14} className="text-blue-400" /> LinkedIn
                </label>
                <input
                  {...register("linkedin")}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 flex items-center gap-2">
                  <Globe size={14} className="text-blue-500" /> Website
                </label>
                <input
                  {...register("website")}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="yourportfolio.com"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 max-w-md font-medium">
              Your profile is the key to connecting with the campus. Keep it
              authentic and updated.
            </p>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 glass bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all flex-1 md:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 flex-1 md:flex-none"
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Save size={18} />
                )}
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default EditProfilePage;
