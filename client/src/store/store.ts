import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import debtsReducer from './slices/debtsSlice';
import customersReducer from './slices/customersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    debts: debtsReducer,
    customers: customersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
