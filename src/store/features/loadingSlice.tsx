import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface loadingSlice {
  loading: boolean;
}

const initialState: loadingSlice = {
  loading: false,
};

/**
 * Loaidng
 */
export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
