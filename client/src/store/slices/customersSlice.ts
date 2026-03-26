import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { customersService } from '../../services/customersService';
import type { Customer } from '../../services/customersService';
import type { Debt } from '../../services/debtsService';

interface CustomersState {
  items: Customer[];
  selectedCustomerDebts: Debt[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  selectedCustomerDebts: [],
  status: 'idle',
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customersService.getCustomers();
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCustomerDebts = createAsyncThunk(
  'customers/fetchCustomerDebts',
  async (customerId: number, { rejectWithValue }) => {
    try {
      const response = await customersService.getCustomerDebts(customerId);
      return response;
    } catch (err: any) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearSelectedCustomerDebts(state) {
      state.selectedCustomerDebts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as any)?.detail || 'Failed to fetch customers';
      })
      // Fetch Customer Debts
      .addCase(fetchCustomerDebts.fulfilled, (state, action: PayloadAction<Debt[]>) => {
        state.selectedCustomerDebts = action.payload;
      });
  },
});

export const { clearSelectedCustomerDebts } = customersSlice.actions;
export default customersSlice.reducer;
