import apiClient from './apiClient';

export interface HealthResponse {
  status: string;
  payment_mode: string;
}

export const appService = {
  getHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },
};
