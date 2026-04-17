import { api } from './api';

export interface LocationData {
  _id: string;
  name: string;
  buildingCode?: string;
  description?: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchLocations: builder.query<LocationData[], string>({
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
