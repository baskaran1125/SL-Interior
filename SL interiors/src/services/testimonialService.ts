import { supabase } from '@/lib/supabase';
import type { Testimonial } from '@/lib/types';

export async function getTestimonials(approvedOnly = false): Promise<Testimonial[]> {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  if (approvedOnly) {
    query = query.eq('is_approved', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createTestimonial(
  testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
): Promise<Testimonial> {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>
): Promise<Testimonial> {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

export async function approveTestimonial(id: string): Promise<void> {
  const { error } = await supabase
    .from('testimonials')
    .update({ is_approved: true })
    .eq('id', id);
  if (error) throw error;
}
