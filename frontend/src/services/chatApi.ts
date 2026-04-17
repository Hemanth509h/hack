import { api } from './api';
import { IMessage, IConversation } from '../types/chat';

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessageHistory: builder.query<{ messages: IMessage[] }, { roomType: string; roomId: string }>({
      query: ({ roomType, roomId }) => `/chat/${roomType}/${roomId}`,
    }),
    getConversations: builder.query<{ conversations: IConversation[] }, void>({
      query: () => '/chat/conversations',
    }),
    getOrCreateConversation: builder.mutation<{ conversation: IConversation }, string>({
      query: (participantId) => ({
        url: '/chat/conversations',
        method: 'POST',
        body: { participantId },
      }),
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chat/messages/${id}`,
        method: 'DELETE',
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
