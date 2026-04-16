import { api } from './api';
import { IEvent, EventFilter, PaginatedEventResponse, RSVPResponse } from '../types/event';

export const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<PaginatedEventResponse, EventFilter | void>({
      query: (filters) => {
        let qs = '';
        if (filters) {
          const params = new URLSearchParams();
          (Object.entries(filters) as [string, string | number | undefined][]).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
              params.append(key, value.toString());
            }
          });
          qs = `?${params.toString()}`;
        }
        return `/events${qs}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.events.map(({ _id }) => ({ type: 'Event' as const, id: _id })),
              { type: 'Event' as const, id: 'LIST' },
            ]
          : [{ type: 'Event' as const, id: 'LIST' }],
    }),

    getEventById: builder.query<IEvent, string>({
      query: (id) => `/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event' as const, id }],
    }),

    createEvent: builder.mutation<IEvent, Partial<IEvent>>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Event' as const, id: 'LIST' }],
    }),

    updateEvent: builder.mutation<IEvent, { id: string; data: Partial<IEvent> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Event' as const, id }],
    }),

    rsvpToEvent: builder.mutation<RSVPResponse, string>({
      query: (id) => ({
        url: `/events/${id}/rsvp`,
        method: 'POST',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            eventApi.util.invalidateTags([
              { type: 'Event' as const, id },
              { type: 'Event' as const, id: 'LIST' },
            ])
          );
        } catch {
          // swallow optimistic error
        }
      },
    }),

    cancelRsvp: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/events/${id}/rsvp`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            eventApi.util.invalidateTags([
              { type: 'Event' as const, id },
              { type: 'Event' as const, id: 'LIST' },
            ])
          );
        } catch {
          // swallow
        }
      },
    }),

    getEventAttendees: builder.query<{ attendees: { _id: string; name: string; avatar?: string }[] }, string>({
      query: (id) => `/events/${id}/attendees`,
      providesTags: (_result, _error, id) => [{ type: 'User' as const, id: `EVENT_ATTENDEES_${id}` }],
    }),

    getMyRsvps: builder.query<{ events: RSVPResponse[] }, string>({
      query: (userId) => `/users/${userId}/events`,
      providesTags: [{ type: 'Event' as const, id: 'MY_RSVPS' }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useRsvpToEventMutation,
  useCancelRsvpMutation,
  useGetEventAttendeesQuery,
  useGetMyRsvpsQuery,
} = eventApi;
