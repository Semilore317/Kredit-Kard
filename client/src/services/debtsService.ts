import apiClient from './apiClient';

export interface CreateDebtPayload {
  customer_name: string;
  customer_phone: string;
  amount: number;
  description: string;
}

export interface Debt {
  id: number;
  amount: number;
  total_paid: number;
  description: string;
  payment_ref: string;
  status: 'PENDING' | 'PAID' | 'PART PAID' | 'OVERDUE' | 'CANCELLED';
  created_at: string;
  due_date: string;
  paid_at?: string | null;
  customer: {
    id: number;
    name: string;
    phone: string;
  };
}

export const debtsService = {
  createDebt: async (data: CreateDebtPayload): Promise<Debt> => {
    const response = await apiClient.post<Debt>('/debts', data);
    return response.data;
  },

  getDebts: async (status?: string): Promise<Debt[]> => {
    const response = await apiClient.get<Debt[]>('/debts', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  getDebtDetails: async (id: number): Promise<Debt> => {
    const response = await apiClient.get<Debt>(`/debts/${id}`);
    return response.data;
  },

  cancelDebt: async (id: number): Promise<Debt> => {
    const response = await apiClient.patch<Debt>(`/debts/${id}/cancel`);
    return response.data;
  },

  simulatePayment: async (paymentRef: string, amountNaira: number): Promise<{ status: string; debt_id?: number }> => {
    const response = await apiClient.post('/demo/simulate-payment', {
      payment_ref: paymentRef,
      amount: amountNaira,
    });
    return response.data;
  },
};
