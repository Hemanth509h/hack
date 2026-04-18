import { api } from "./api";

export const socialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSocialFeed: builder.query({
      query: () => "/social",
      providesTags: ["Post"],
    }),
    createPost: builder.mutation({
      query: (body) => ({
        url: "/social",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
    likePost: builder.mutation({
      query: (id) => ({
        url: `/social/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),
    addComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/social/${id}/comment`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetSocialFeedQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
} = socialApi;
