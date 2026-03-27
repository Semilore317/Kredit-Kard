import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appService } from '../../services/appService';

interface AppState {
  isMockMode: boolean;
  healthStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AppState = {
  isMockMode: false,
  healthStatus: 'idle',
};

export const fetchHealth = createAsyncThunk(
  'app/fetchHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appService.getHealth();
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealth.pending, (state) => {
        state.healthStatus = 'loading';
      })
      .addCase(fetchHealth.fulfilled, (state, action) => {
        state.healthStatus = 'succeeded';
        state.isMockMode = action.payload.payment_mode === 'mock';
      })
      .addCase(fetchHealth.rejected, (state) => {
        state.healthStatus = 'failed';
        // Default to false (hide simulate button) if health check fails
        state.isMockMode = false;
      });
  },
});

export default appSlice.reducer;
