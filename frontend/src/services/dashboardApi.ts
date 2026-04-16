import { api } from './api';

export interface DashboardData {
  trending: {
    events: any[];
    clubs: any[];
  };
  recommendations: {
    events: any[];
    clubs: any[]; // Often falls back to trending club data
  };
  userSummary: {
    upcomingRsvps: number;
    teamRequests: number;
    clubUpdates: number;
  };
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTrendingEvents: builder.query<{ trending: any[] }, void>({
      query: () => '/discovery/trending/events',
      providesTags: ['Event'],
    }),
    getTrendingClubs: builder.query<{ trending: any[] }, void>({
      query: () => '/discovery/trending/clubs',
      providesTags: ['Club'],
    }),
    getEventRecommendations: builder.query<{ recommendations: any[] }, void>({
      query: () => '/discovery/recommendations/events',
      providesTags: ['Event'],
    }),
    getClubRecommendations: builder.query<{ recommendations: any[] }, void>({
      query: () => '/discovery/recommendations/clubs',
      providesTags: ['Club'],
    }),
    // User metrics proxy endpoints
    getUpcomingRsvpsCount: builder.query<{ count: number }, string>({
      query: (userId) => `/users/${userId}/events`,
      transformResponse: (response: { events: any[] }) => {
        const now = new Date();
        const upcoming = response.events.filter(e => new Date(e.event.date) >= now);
        return { count: upcoming.length };
      },
      providesTags: ['Event'],
    }),
    getIncomingTeamRequestsCount: builder.query<{ count: number }, void>({
      query: () => '/teams/requests',
      transformResponse: (response: { requests: any[] }) => ({ count: response.requests.length }),
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
