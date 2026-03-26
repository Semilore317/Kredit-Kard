import apiClient from './apiClient';
import type { Debt } from './debtsService';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  created_at: string;
}

export const customersService = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>('/customers');
    return response.data;
  },

  getCustomerDebts: async (id: number): Promise<Debt[]> => {
    const response = await apiClient.get<Debt[]>(`/customers/${id}/debts`);
    return response.data;
  }
};
