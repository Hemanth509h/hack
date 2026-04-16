import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClubFilter } from '../../types/club';

interface ClubState {
  filters: ClubFilter;
  selectedClubId: string | null;
  isCreationModalOpen: boolean;
}

const initialState: ClubState = {
  filters: {
    search: '',
    category: '',
    sortBy: 'active',
    page: 1,
    limit: 12,
  },
  selectedClubId: null,
  isCreationModalOpen: false,
};

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ClubFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedClubId: (state, action: PayloadAction<string | null>) => {
      state.selectedClubId = action.payload;
    },
    setCreationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreationModalOpen = action.payload;
    },
  },
});

export const { setFilters, resetFilters, setSelectedClubId, setCreationModalOpen } = clubSlice.actions;
export default clubSlice.reducer;
