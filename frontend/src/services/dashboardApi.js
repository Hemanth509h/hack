import { api } from './api';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTrendingEvents: builder.query({
      query: () => '/discovery/trending/events',
      providesTags: ['Event'],
    }),
    getTrendingClubs: builder.query({
      query: () => '/discovery/trending/clubs',
      providesTags: ['Club'],
    }),
    getEventRecommendations: builder.query({
      query: () => '/discovery/recommendations/events',
      providesTags: ['Event'],
    }),
    getClubRecommendations: builder.query({
      query: () => '/discovery/recommendations/clubs',
      providesTags: ['Club'],
    }),
    // User metrics proxy endpoints
    getUpcomingRsvpsCount: builder.query({
      query: (userId) => `/users/${userId}/events`,
      transformResponse: (response) => {
        const now = new Date();
        const upcoming = (response.events || []).filter(e => new Date(e.event.date) >= now);
        return { count: upcoming.length };
      },
      providesTags: ['Event'],
    }),
    getIncomingTeamRequestsCount: builder.query({
      query: () => '/teams/requests',
      transformResponse: (response) => ({ count: (response.requests || []).length }),
      providesTags: ['Team'],
    }),
  }),
});

export const {
  useGetTrendingEventsQuery,
  useGetTrendingClubsQuery,
  useGetEventRecommendationsQuery,
  useGetClubRecommendationsQuery,
  useGetUpcomingRsvpsCountQuery,
  useGetIncomingTeamRequestsCountQuery,
} = dashboardApi;
