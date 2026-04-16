import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventState {
  searchQuery: string;
  selectedCategory: string;
  viewMode: 'grid' | 'list';
}

const initialState: EventState = {
  searchQuery: '',
  selectedCategory: 'All Events',
  viewMode: 'grid',
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setSearchQuery, setSelectedCategory, setViewMode } = eventSlice.actions;
export default eventSlice.reducer;
