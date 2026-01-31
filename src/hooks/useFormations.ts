import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { staticFormations } from '@/lib/staticData';

export interface Formation {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  price: number;
  max_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useFormations() {
  return useQuery({
    queryKey: ['formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Using static formations data:', error.message);
        return staticFormations.map(f => ({
          ...f,
          max_students: 10,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      }

      return data as Formation[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAdminFormations() {
  return useQuery({
    queryKey: ['admin-formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Formation[];
    },
  });
}

export function useCreateFormation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formation: Omit<Formation, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('formations')
        .insert(formation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
    },
  });
}

export function useUpdateFormation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...formation }: Partial<Formation> & { id: string }) => {
      const { data, error } = await supabase
        .from('formations')
        .update(formation)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
    },
  });
}

export function useDeleteFormation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('formations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] });
    },
  });
}
