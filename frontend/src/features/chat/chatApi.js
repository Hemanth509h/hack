import { api } from '../../services/api';

export 

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (body) => ({
        url: '/chat/message',
        method: 'POST',
        body,
      }),
    }),
    submitFeedback: builder.mutation<{ success: boolean }, { messageId; helpful: boolean }>({
      query: (body) => ({
        url: '/chat/feedback',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendMessageMutation, useSubmitFeedbackMutation } = chatApi;
