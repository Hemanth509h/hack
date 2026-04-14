import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Automatically inject JWT token into all requests
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1', // Proxied via Vite config to avoid CORS
  prepareHeaders: (headers, { getState }) => {
    // In a real app, grab token from state: const token = (getState() as RootState).auth.token;
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Event', 'Club', 'Team', 'Notification'],
  endpoints: (builder) => ({
    // Global endpoints go here.
    // Feature-specific endpoints will be injected in their respective slices.
    getHealth: builder.query<{ status: string, message: string }, void>({
      query: () => '/health',
    }),
  }),
});

export const { useGetHealthQuery } = api;
