import { api } from "./api";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (userId) => `/users/${userId}/profile`,
      providesTags: (_result, _error, arg) => [{ type: "User", id: arg }],
    }),
    updateProfile: builder.mutation({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/profile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "User", id: arg.userId }],
    }),
    updateInterests: builder.mutation({
      query: ({ userId, interests }) => ({
        url: `/users/${userId}/interests`,
        method: "PUT",
        body: { interests },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "User", id: arg.userId }],
    }),
    uploadAvatar: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/users/${userId}/avatar`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "User", id: arg.userId }],
    }),
    addSkill: builder.mutation({
      query: ({ userId, skillId, proficiency }) => ({
        url: `/users/${userId}/skills`,
        method: "POST",
        body: { skillId, proficiency },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "User", id: arg.userId }],
    }),
    removeSkill: builder.mutation({
      query: ({ userId, skillId }) => ({
        url: `/users/${userId}/skills/${skillId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "User", id: arg.userId }],
    }),
    updateLocation: builder.mutation({
      query: ({ userId, latitude, longitude }) => ({
        url: `/users/${userId}/location`,
        method: "POST",
        body: { latitude, longitude },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "User", id: arg.userId }],
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
  useUpdateLocationMutation,
} = profileApi;
