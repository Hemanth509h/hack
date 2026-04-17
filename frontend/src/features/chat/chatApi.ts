import { api } from '../../services/api';

export interface BotResponseDTO {
  id: string;
  text: string;
  richCards?: any[];
}

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<BotResponseDTO, { message: string }>({
      query: (body) => ({
        url: '/chat/message',
        method: 'POST',
        body,
      }),
    }),
    submitFeedback: builder.mutation<{ success: boolean }, { messageId: string; helpful: boolean }>({
      query: (body) => ({
        url: '/chat/feedback',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendMessageMutation, useSubmitFeedbackMutation } = chatApi;
