import { api } from "./api";

export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchLocations: builder.query({
      query: (q) => `/locations/search?q=${encodeURIComponent(q)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Location", id: _id })),
              { type: "Location", id: "LIST" },
            ]
          : [{ type: "Location", id: "LIST" }],
    }),
  }),
});

export const { useSearchLocationsQuery, useLazySearchLocationsQuery } =
  locationApi;
