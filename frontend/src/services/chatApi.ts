import { api } from './api';
import { IMessage } from '../types/chat';

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessageHistory: builder.query<{ messages: IMessage[] }, { roomType: string; roomId: string }>({
      query: ({ roomType, roomId }) => `/chat/${roomType}/${roomId}`,
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
  useDeleteMessageMutation,
} = chatApi;
