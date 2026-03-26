import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import type { LoginPayload, RegisterPayload, TraderResponse, AuthResponse } from '../../services/authService';

interface AuthState {
  token: string | null;
  trader: TraderResponse | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('kreditkard_token'),
  trader: null,
  isAuthenticated: !!localStorage.getItem('kreditkard_token'),
  status: 'idle',
  error: null,
};

export const loginTrader = createAsyncThunk(
  'auth/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerTrader = createAsyncThunk(
  'auth/register',
  async (details: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authService.register(details);
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      state.token = null;
      state.trader = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginTrader.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginTrader.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'succeeded';
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
      })
      .addCase(loginTrader.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as any)?.detail || 'Failed to login';
      })
      // Register
      .addCase(registerTrader.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerTrader.fulfilled, (state, action: PayloadAction<TraderResponse>) => {
        state.status = 'succeeded';
        state.trader = action.payload; // They still need to login subsequently
      })
      .addCase(registerTrader.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as any)?.detail || 'Failed to register';
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<TraderResponse>) => {
        state.trader = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.trader = null;
        localStorage.removeItem('kreditkard_token');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
