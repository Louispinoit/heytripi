import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '../api';

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getAll,
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tripsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}