import { api } from '../../services/api';

// Admin DTOs / Interfaces
export ;
  upcomingEvents: { total; changePercentage: number };
  newClubRequests: { total; hasHighPriority: boolean };
  systemHealth: { status: 'Operational' | 'Warning' | 'Critical' };
  engagementTrends: { date; volume: number }[];
}

export 

export [];
  expectedMembership;
  applicationDate;
}

export ;
  apiResponseTime;
  recentErrors: { id; time; message: string }[];
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: (params) => ({
        url: '/admin/dashboard',
        params,
      }),
      providesTags: ['User', 'Event', 'Club'],
      
      // Mocking data so we can develop UI immediately
      async onQueryStarted(_arg, { dispatch: _d, queryFulfilled: _q }) {
        // Here we could set up mock responses if the real API isn't ready
      }
    }),
    
    getUsers: builder.query<{ users; total: number }, { page; limit?; search?; role?; status?: string }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),
    
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),

    getPendingClubs: builder.query({
      query: () => '/admin/clubs/pending',
      providesTags: ['Club'],
    }),

    resolveClubApplication: builder.mutation<{ success; message: string }, { clubId; status: 'approve' | 'reject'; reason?: string }>({
      query: ({ clubId, status, ...body }) => ({
        url: `/admin/clubs/${clubId}/${status}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Club'],
    }),

    getSystemHealth: builder.query({
      query: () => '/admin/system/health',
    }),
    
    clearCache: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/admin/system/clear-cache',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useGetPendingClubsQuery,
  useResolveClubApplicationMutation,
  useGetSystemHealthQuery,
  useClearCacheMutation,
} = adminApi;
