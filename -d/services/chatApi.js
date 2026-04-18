import { api } from "./api";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessageHistory: builder.query({
      query: ({ roomType, roomId }) => `/chat/${roomType}/${roomId}`,
    }),
    getConversations: builder.query({
      query: () => "/chat/conversations",
    }),
    getOrCreateConversation: builder.mutation({
      query: (participantId) => ({
        url: "/chat/conversations",
        method: "POST",
        body: { participantId },
      }),
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/chat/messages/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMessageHistoryQuery,
  useGetConversationsQuery,
  useGetOrCreateConversationMutation,
  useDeleteMessageMutation,
} = chatApi;
