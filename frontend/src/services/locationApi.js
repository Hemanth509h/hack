import { api } from './api';

export ;
export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchLocations: builder.query({
      query: (q) => `/locations/search?q=${encodeURIComponent(q)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Location' as const, id: _id })),
              { type: 'Location' as const, id: 'LIST' },
            ]
          : [{ type: 'Location' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useSearchLocationsQuery,
  useLazySearchLocationsQuery,
} = locationApi;
