import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from './features/loadingSlice';

const store = configureStore({
  reducer: {
    loading: loadingSlice,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
