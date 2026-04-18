import { api } from './api';

export 

export const feedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query<{ items; page; hasMore: boolean }, { page?; limit?: number }>({
      query: (params) => ({
        url: '/feed',
        params,
      }),
      providesTags: ['Feed' as any],
    }),
  }),
});

export const { useGetFeedQuery } = feedApi;
