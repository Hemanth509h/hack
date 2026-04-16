import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  viewport: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  toggles: {
    events: boolean;
    buildings: boolean;
    dining: boolean;
  };
  selectedLocationId: string | null;
  searchQuery: string;
}

const initialState: MapState = {
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
    setViewport: (state, action: PayloadAction<Partial<MapState['viewport']>>) => {
      state.viewport = { ...state.viewport, ...action.payload };
    },
    toggleLayer: (state, action: PayloadAction<keyof MapState['toggles']>) => {
      state.toggles[action.payload] = !state.toggles[action.payload];
    },
    setSelectedLocationId: (state, action: PayloadAction<string | null>) => {
      state.selectedLocationId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setViewport, toggleLayer, setSelectedLocationId, setSearchQuery } = mapSlice.actions;
export default mapSlice.reducer;
