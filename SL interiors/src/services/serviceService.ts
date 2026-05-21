import { supabase } from '@/lib/supabase';
import type { Service } from '@/lib/types';

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createService(
  service: Omit<Service, 'id' | 'created_at' | 'updated_at'>
): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateService(
  id: string,
  updates: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>
): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}
