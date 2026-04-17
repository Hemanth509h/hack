import { api } from './api';

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
    major?: string;
  };
  content: string;
  attachments?: string[];
  likes: string[];
  comments: {
    author: {
      _id: string;
      name: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }[];
  category: string;
  createdAt: string;
}

export const socialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSocialFeed: builder.query<Post[], void>({
      query: () => '/social',
      providesTags: ['Post'],
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/social',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'],
    }),
    likePost: builder.mutation<Post, string>({
      query: (id) => ({
        url: `/social/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),
    addComment: builder.mutation<Post, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/social/${id}/comment`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetSocialFeedQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
} = socialApi;
