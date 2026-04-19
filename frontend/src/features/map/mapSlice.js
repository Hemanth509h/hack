import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  viewport: {
    longitude: -71.1097, // Placeholder generic longitude (Harvard for example, or could use any central US coordinate)
    latitude: 42.3736,
    zoom: 14,
  },
  toggles: {
    events: true,
    buildings: true,
    dining: false,
  },
  selectedLocationId: null,
  searchQuery: '',
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setViewport: (state, action) => {
      state.viewport = { ...state.viewport, ...action.payload };
    },
    toggleLayer: (state, action) => {
      state.toggles[action.payload] = !state.toggles[action.payload];
    },
    setSelectedLocationId: (state, action) => {
      state.selectedLocationId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setViewport, toggleLayer, setSelectedLocationId, setSearchQuery } = mapSlice.actions;
export default mapSlice.reducer;
