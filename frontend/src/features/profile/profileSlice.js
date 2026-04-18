import { createSlice, PayloadAction } from '@reduxjs/toolkit';





const initialState = {
  layoutPreferences: {
    showBadges: true,
    showSkills: true,
    showClubs: true,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateLayoutPreferences: (state, action: PayloadAction<Partial<ProfileLayoutPreferences>>) => {
      state.layoutPreferences = { ...state.layoutPreferences, ...action.payload };
    },
  },
});

export const { updateLayoutPreferences } = profileSlice.actions;

export default profileSlice.reducer;
