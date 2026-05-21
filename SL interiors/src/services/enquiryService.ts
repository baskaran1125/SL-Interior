import { supabase } from '@/lib/supabase';
import type { Enquiry, EnquiryStatus } from '@/lib/types';

export async function getEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getEnquiriesByStatus(status: EnquiryStatus): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createEnquiry(
  enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>
): Promise<Enquiry> {
  const { data, error } = await supabase
    .from('enquiries')
    .insert(enquiry)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<void> {
  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteEnquiry(id: string): Promise<void> {
  const { error } = await supabase.from('enquiries').delete().eq('id', id);
  if (error) throw error;
}

export async function getNewEnquiryCount(): Promise<number> {
  const { count, error } = await supabase
    .from('enquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  if (error) throw error;
  return count || 0;
}
