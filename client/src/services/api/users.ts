import { apiClient } from './apiClient';
import { User } from '../../types';

export const usersService = {
  getAll: async () => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },
  create: async (userData: any) => {
    const { data } = await apiClient.post<User>('/users', userData);
    return data;
  },
  delete: async (id: number | string) => {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  },
};
