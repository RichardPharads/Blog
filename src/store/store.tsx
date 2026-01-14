// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pageReducer from './pageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    page: pageReducer
  },
});

// Infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;