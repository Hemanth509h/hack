import { api } from './api';
import { IClub, IClubMember, ClubFilter, PaginatedClubResponse, FeaturedClubsResponse, ClubDetailResponse, ClubMembersResponse, ClubAnalytics } from '../types/club';

export const clubApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchClubs: builder.query({
      query: (params) => ({
        url: '/clubs',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.clubs.map(({ _id }) => ({ type: 'Club' as const, id: _id })),
              { type: 'Club', id: 'LIST' },
            ]
          : [{ type: 'Club', id: 'LIST' }],
    }),
    fetchFeaturedClubs: builder.query({
      query: () => '/clubs/featured',
      providesTags: ['Club'],
    }),
    fetchClubById: builder.query({
      query: (id) => `/clubs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Club', id }],
    }),
    createClub: builder.mutation<{ message; club: IClub }, Partial<IClub>>({
      query: (newClub) => ({
        url: '/clubs',
        method: 'POST',
        body: newClub,
      }),
      invalidatesTags: [{ type: 'Club', id: 'LIST' }],
    }),
    updateClub: builder.mutation<IClub, { id; updates: Partial<IClub> }>({
      query: ({ id, updates }) => ({
        url: `/clubs/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Club', id },
        { type: 'Club', id: 'LIST' },
      ],
    }),
    joinClub: builder.mutation({
      query: (clubId) => ({
        url: `/clubs/${clubId}/join`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, clubId) => [
        { type: 'Club', id: clubId },
        { type: 'Club', id: 'LIST' },
      ],
    }),
    leaveClub: builder.mutation<void, string>({
      query: (clubId) => ({
        url: `/clubs/${clubId}/leave`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, clubId) => [
        { type: 'Club', id: clubId },
        { type: 'Club', id: 'LIST' },
      ],
    }),
    fetchClubMembers: builder.query({
      query: (clubId) => `/clubs/${clubId}/members`,
      providesTags: (_result, _error, clubId) => [{ type: 'Club', id: `${clubId}-members` }],
    }),
    updateMemberRole: builder.mutation({
      query: ({ clubId, userId, role }) => ({
        url: `/clubs/${clubId}/members/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (_result, _error, { clubId }) => [{ type: 'Club', id: `${clubId}-members` }],
    }),
    approveMember: builder.mutation({
      query: ({ clubId, userId }) => ({
        url: `/clubs/${clubId}/members/${userId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { clubId }) => [
        { type: 'Club', id: clubId },
        { type: 'Club', id: `${clubId}-members` },
      ],
    }),
    rejectMember: builder.mutation<void, { clubId; userId: string }>({
      query: ({ clubId, userId }) => ({
        url: `/clubs/${clubId}/members/${userId}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { clubId }) => [{ type: 'Club', id: `${clubId}-members` }],
    }),
    fetchClubAnalytics: builder.query({
      query: (clubId) => `/clubs/${clubId}/analytics`,
    }),
    fetchMyClubs: builder.query<{ leading; memberOf: IClub[] }, void>({
      query: () => '/clubs/my-clubs',
      providesTags: ['Club'],
    }),
  }),
});

export const {
  useFetchClubsQuery,
  useFetchFeaturedClubsQuery,
  useFetchClubByIdQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useJoinClubMutation,
  useLeaveClubMutation,
  useFetchClubMembersQuery,
  useUpdateMemberRoleMutation,
  useApproveMemberMutation,
  useRejectMemberMutation,
  useFetchClubAnalyticsQuery,
  useFetchMyClubsQuery,
} = clubApi;
