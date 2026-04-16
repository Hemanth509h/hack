import { api } from './api';
import { IProfile, ISkill } from '../types/profile';

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<IProfile, string>({
      query: (userId) => `/users/${userId}/profile`,
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }],
    }),
    updateProfile: builder.mutation<IProfile, { userId: string; body: Partial<IProfile> }>({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/profile`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
    }),
    updateInterests: builder.mutation<IProfile, { userId: string; interests: string[] }>({
      query: ({ userId, interests }) => ({
        url: `/users/${userId}/interests`,
        method: 'PUT',
        body: { interests },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
    }),
    uploadAvatar: builder.mutation<{ avatarUrl: string }, { userId: string; formData: FormData }>({
      query: ({ userId, formData }) => ({
        url: `/users/${userId}/avatar`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
    }),
    addSkill: builder.mutation<IProfile, { userId: string; skillId: string; proficiency?: string }>({
      query: ({ userId, skillId, proficiency }) => ({
        url: `/users/${userId}/skills`,
        method: 'POST',
        body: { skillId, proficiency },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
    }),
    removeSkill: builder.mutation<IProfile, { userId: string; skillId: string }>({
      query: ({ userId, skillId }) => ({
        url: `/users/${userId}/skills/${skillId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateInterestsMutation,
  useUploadAvatarMutation,
  useAddSkillMutation,
  useRemoveSkillMutation,
} = profileApi;
