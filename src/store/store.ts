import { configureStore } from '@reduxjs/toolkit';
import personsSlice from '../features/personsSlice';

export const store = configureStore({
  reducer: {
    persons: personsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;