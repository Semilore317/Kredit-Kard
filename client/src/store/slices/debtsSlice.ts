import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { debtsService } from '../../services/debtsService';
import type { Debt, CreateDebtPayload } from '../../services/debtsService';

interface DebtsState {
  items: Debt[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DebtsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchDebts = createAsyncThunk(
  'debts/fetchDebts',
  async (status: string | undefined, { rejectWithValue }) => {
    try {
      const response = await debtsService.getDebts(status);
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const addDebt = createAsyncThunk(
  'debts/addDebt',
  async (payload: CreateDebtPayload, { rejectWithValue }) => {
    try {
      const response = await debtsService.createDebt(payload);
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const cancelDebt = createAsyncThunk(
  'debts/cancelDebt',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await debtsService.cancelDebt(id);
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

const debtsSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Debts
      .addCase(fetchDebts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDebts.fulfilled, (state, action: PayloadAction<Debt[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as any)?.detail || 'Failed to fetch debts';
      })
      // Add Debt
      .addCase(addDebt.fulfilled, (state, action: PayloadAction<Debt>) => {
        state.items.push(action.payload);
      })
      // Cancel Debt
      .addCase(cancelDebt.fulfilled, (state, action: PayloadAction<Debt>) => {
        const index = state.items.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default debtsSlice.reducer;
