import { api } from './api';

export interface Skill {
  _id: string;
  name: string;
  category?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  avatar?: string;
  major?: string;
  skills: Skill[];
}

export interface TeamProject {
  _id: string;
  title: string;
  description: string;
  leader: TeamMember;
  members: TeamMember[];
  requiredSkills: {
    skill: Skill;
    proficiencyDesired?: string;
  }[];
  pendingRequests: string[];
  associatedEvent?: {
    _id: string;
    title: string;
    date: string;
  };
  deadline?: string;
  status: 'open' | 'full' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface MatchBreakdown {
  skillOverlap: number;
  interestAlignment: number;
  collaborationHistory: number;
  isAvailable: boolean;
}

export interface TeamMatch {
  user: {
    _id: string;
    name: string;
    avatar?: string;
    major?: string;
    graduationYear?: number;
    bio?: string;
    skills: Skill[];
    interests: string[];
  };
  matchScore: number;
  breakdown: MatchBreakdown;
}

export interface JoinRequest {
  projectId: string;
  projectTitle: string;
  requester: {
    _id: string;
    name: string;
    avatar?: string;
    major?: string;
    graduationYear?: number;
    bio?: string;
    skills: Skill[];
  };
}

export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMatches: builder.query<{ matches: TeamMatch[]; fromCache: boolean }, void>({
      query: () => '/teams/matches',
      providesTags: ['Team'],
    }),
    getMyProjects: builder.query<{ projects: TeamProject[] }, void>({
      query: () => '/teams/my-projects',
      providesTags: ['Team'],
    }),
    browseProjects: builder.query<{ projects: TeamProject[]; pagination: any }, { page?: number; limit?: number; skill?: string; event?: string }>({
      query: (params) => ({
        url: '/teams/browse',
        params,
      }),
      providesTags: ['Team'],
    }),
    getProject: builder.query<TeamProject, string>({
      query: (id) => `/teams/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Team', id }],
    }),
    createProject: builder.mutation<{ message: string; project: TeamProject }, Partial<TeamProject>>({
      query: (body) => ({
        url: '/teams/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    updateProject: builder.mutation<{ message: string; project: TeamProject }, { id: string; body: Partial<TeamProject> }>({
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
    requestToJoin: builder.mutation<{ message: string }, { projectId: string; message?: string }>({
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
    acceptRequest: builder.mutation<{ message: string }, { projectId: string; requesterId: string }>({
      query: ({ projectId, requesterId }) => ({
        url: `/teams/requests/${projectId}/accept`,
        method: 'PUT',
        body: { requesterId },
      }),
      invalidatesTags: ['Team'],
    }),
    declineRequest: builder.mutation<{ message: string }, { projectId: string; requesterId: string }>({
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
