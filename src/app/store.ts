import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { gameApi } from '@/services/gameApi';

export const store = configureStore({
  reducer: {
    [gameApi.reducerPath]: gameApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameApi.middleware),
});

// 啟用 refetchOnFocus / refetchOnReconnect 等行為
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
