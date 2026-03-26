import apiClient from './apiClient';

export interface RegisterPayload {
  name: string;
  phone: string;
  business_name: string;
  pin: string;
}

export interface LoginPayload {
  phone: string;
  pin: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface TraderResponse {
  id: number;
  name: string;
  phone: string;
  business_name: string;
}

export const authService = {
  register: async (data: RegisterPayload): Promise<TraderResponse> => {
    const response = await apiClient.post<TraderResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    // You can set localStorage here or leave it to the Redux slice
    if (response.data.access_token) {
      localStorage.setItem('kreditkard_token', response.data.access_token);
    }
    return response.data;
  },

  getCurrentUser: async (): Promise<TraderResponse> => {
    const response = await apiClient.get<TraderResponse>('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('kreditkard_token');
  }
};
