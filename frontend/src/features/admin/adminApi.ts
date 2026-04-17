import { api } from '../../services/api';

// Admin DTOs / Interfaces
export interface AdminStats {
  activeStudents: { total: number; changePercentage: number };
  upcomingEvents: { total: number; changePercentage: number };
  newClubRequests: { total: number; hasHighPriority: boolean };
  systemHealth: { status: 'Operational' | 'Warning' | 'Critical' };
  engagementTrends: { date: string; volume: number }[];
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinedDate: string;
}

export interface PendingClubDTO {
  id: string;
  name: string;
  category: string;
  description: string;
  proposedLeaders: { name: string; email: string }[];
  expectedMembership: number;
  applicationDate: string;
}

export interface SystemHealthDTO {
  server: 'online' | 'offline';
  database: 'connected' | 'disconnected';
  redis: { status: string; hitRate: string };
  apiResponseTime: string;
  recentErrors: { id: string; time: string; message: string }[];
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, { range: string }>({
      query: (params) => ({
        url: '/admin/stats',
        params,
      }),
      providesTags: ['User', 'Event', 'Club'],
      
      // Mocking data so we can develop UI immediately
      async onQueryStarted(_arg, { dispatch: _d, queryFulfilled: _q }) {
        // Here we could set up mock responses if the real API isn't ready
      }
    }),
    
    getUsers: builder.query<{ users: UserDTO[]; total: number }, { page: number; search?: string; role?: string; status?: string }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),
    
    updateUserRole: builder.mutation<UserDTO, { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),

    getPendingClubs: builder.query<PendingClubDTO[], void>({
      query: () => '/admin/clubs/pending',
      providesTags: ['Club'],
    }),

    resolveClubApplication: builder.mutation<{ success: boolean; message: string }, { clubId: string; status: 'approved' | 'rejected'; reason?: string }>({
      query: ({ clubId, ...body }) => ({
        url: `/admin/clubs/pending/${clubId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Club'],
    }),

    getSystemHealth: builder.query<SystemHealthDTO, void>({
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
