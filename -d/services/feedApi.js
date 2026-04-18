import { api } from "./api";

export const feedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query({
      query: (params) => ({
        url: "/feed",
        params,
      }),
      providesTags: ["Feed"],
    }),
  }),
});

export const { useGetFeedQuery } = feedApi;
