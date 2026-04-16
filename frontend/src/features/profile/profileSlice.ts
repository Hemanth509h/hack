import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileLayoutPreferences {
  showBadges: boolean;
  showSkills: boolean;
  showClubs: boolean;
}

interface ProfileState {
  layoutPreferences: ProfileLayoutPreferences;
}

const initialState: ProfileState = {
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
