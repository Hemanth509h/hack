import { api } from './api';

export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMatches: builder.query({
      query: () => '/teams/matches',
      providesTags: ['Team'],
    }),
    getMyProjects: builder.query({
      query: () => '/teams/my-projects',
      providesTags: ['Team'],
    }),
    browseProjects: builder.query({
      query: (params) => ({
        url: '/teams/browse',
        params,
      }),
      providesTags: ['Team'],
    }),
    getProject: builder.query({
      query: (id) => `/teams/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Team', id }],
    }),
    createProject: builder.mutation({
      query: (body) => ({
        url: '/teams/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    updateProject: builder.mutation({
      query: ({ id, body }) => ({
        url: `/teams/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Team', { type: 'Team', id }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/teams/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    requestToJoin: builder.mutation({
      query: ({ projectId, message }) => ({
        url: `/teams/projects/${projectId}/request`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'Team', id: projectId }],
    }),
    getIncomingRequests: builder.query({
      query: () => '/teams/requests',
      providesTags: ['Team'],
    }),
    acceptRequest: builder.mutation({
      query: ({ projectId, requesterId }) => ({
        url: `/teams/requests/${projectId}/accept`,
        method: 'PUT',
        body: { requesterId },
      }),
      invalidatesTags: ['Team'],
    }),
    declineRequest: builder.mutation({
      query: ({ projectId, requesterId }) => ({
        url: `/teams/requests/${projectId}/decline`,
        method: 'PUT',
        body: { requesterId },
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export const {
  useGetMatchesQuery,
  useGetMyProjectsQuery,
  useBrowseProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useRequestToJoinMutation,
  useGetIncomingRequestsQuery,
  useAcceptRequestMutation,
  useDeclineRequestMutation,
} = teamApi;
