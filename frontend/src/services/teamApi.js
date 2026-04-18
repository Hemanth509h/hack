import { api } from './api';

export 

export 

export [];
  pendingRequests: string[];
  associatedEvent?: {
    _id;
    title;
    date;
  };
  deadline?;
  status: 'open' | 'full' | 'completed';
  createdAt;
  updatedAt;
}

export 

export ;
  matchScore;
  breakdown;
}

export ;
}

export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMatches: builder.query<{ matches; fromCache: boolean }, void>({
      query: () => '/teams/matches',
      providesTags: ['Team'],
    }),
    getMyProjects: builder.query<{ projects: TeamProject[] }, void>({
      query: () => '/teams/my-projects',
      providesTags: ['Team'],
    }),
    browseProjects: builder.query<{ projects; pagination: any }, { page?; limit?; skill?; event?: string }>({
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
    createProject: builder.mutation<{ message; project: TeamProject }, Partial<TeamProject>>({
      query: (body) => ({
        url: '/teams/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    updateProject: builder.mutation<{ message; project: TeamProject }, { id; body: Partial<TeamProject> }>({
      query: ({ id, body }) => ({
        url: `/teams/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Team', { type: 'Team', id }],
    }),
    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/teams/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    requestToJoin: builder.mutation<{ message: string }, { projectId; message?: string }>({
      query: ({ projectId, message }) => ({
        url: `/teams/projects/${projectId}/request`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'Team', id: projectId }],
    }),
    getIncomingRequests: builder.query<{ requests: JoinRequest[] }, void>({
      query: () => '/teams/requests',
      providesTags: ['Team'],
    }),
    acceptRequest: builder.mutation<{ message: string }, { projectId; requesterId: string }>({
      query: ({ projectId, requesterId }) => ({
        url: `/teams/requests/${projectId}/accept`,
        method: 'PUT',
        body: { requesterId },
      }),
      invalidatesTags: ['Team'],
    }),
    declineRequest: builder.mutation<{ message: string }, { projectId; requesterId: string }>({
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
