import type { Trip } from '../types';
import { apiClient } from './client';

export const tripsApi = {
  getAll: () => apiClient<Trip[]>('/trips'),
  
  getById: (id: string) => apiClient<Trip>(`/trips/${id}`),
  
  create: (data: Partial<Trip>) => 
    apiClient<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Partial<Trip>) =>
    apiClient<Trip>(`/trips/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiClient<void>(`/trips/${id}`, {
      method: 'DELETE',
    }),
};