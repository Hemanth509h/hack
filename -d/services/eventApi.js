import { api } from "./api";

export const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (filters) => {
        let qs = "";
        if (filters) {
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
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
              ...result.events.map(({ _id }) => ({ type: "Event", id: _id })),
              { type: "Event", id: "LIST" },
            ]
          : [{ type: "Event", id: "LIST" }],
    }),

    getEventById: builder.query({
      query: (id) => `/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Event", id }],
    }),

    createEvent: builder.mutation({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),

    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Event", id }],
    }),

    rsvpToEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}/rsvp`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            eventApi.util.invalidateTags([
              { type: "Event", id },
              { type: "Event", id: "LIST" },
            ]),
          );
        } catch {
          // swallow optimistic error
        }
      },
    }),

    cancelRsvp: builder.mutation({
      query: (id) => ({
        url: `/events/${id}/rsvp`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            eventApi.util.invalidateTags([
              { type: "Event", id },
              { type: "Event", id: "LIST" },
            ]),
          );
        } catch {
          // swallow
        }
      },
    }),

    getEventAttendees: builder.query({
      query: (id) => `/events/${id}/attendees`,
      providesTags: (_result, _error, id) => [
        { type: "User", id: `EVENT_ATTENDEES_${id}` },
      ],
    }),

    getMyRsvps: builder.query({
      query: (userId) => `/users/${userId}/events`,
      providesTags: [{ type: "Event", id: "MY_RSVPS" }],
    }),

    getQrCodeData: builder.query({
      query: (eventId) => `/events/${eventId}/checkin/qr`,
    }),

    submitCheckIn: builder.mutation({
      query: ({ eventId, ...body }) => ({
        url: `/events/${eventId}/checkin`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "User", id: `EVENT_ATTENDEES_${eventId}` },
      ],
    }),

    approveRSVP: builder.mutation({
      query: ({ eventId, userId }) => ({
        url: `/events/${eventId}/rsvp/${userId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "Event", id: eventId },
        { type: "User", id: `EVENT_ATTENDEES_${eventId}` },
      ],
    }),

    rejectRSVP: builder.mutation({
      query: ({ eventId, userId }) => ({
        url: `/events/${eventId}/rsvp/${userId}/reject`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "User", id: `EVENT_ATTENDEES_${eventId}` },
      ],
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
  useGetQrCodeDataQuery,
  useSubmitCheckInMutation,
  useApproveRSVPMutation,
  useRejectRSVPMutation,
} = eventApi;
