import { api } from './api';

export interface FeedItem {
  id: string;
  type: 'event' | 'club' | 'project';
  title: string;
  description: string;
  timestamp: string;
  image?: string;
  metadata?: any;
}

export const feedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query<{ items: FeedItem[]; page: number; hasMore: boolean }, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/feed',
        params,
      }),
      providesTags: ['Feed' as any],
    }),
  }),
});

export const { useGetFeedQuery } = feedApi;
