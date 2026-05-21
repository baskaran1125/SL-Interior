import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/lib/types';

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getGalleryByCategory(category: string): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('category', category)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createGalleryImage(
  image: Omit<GalleryImage, 'id' | 'created_at'>
): Promise<GalleryImage> {
  const { data, error } = await supabase
    .from('gallery')
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryImage(
  id: string,
  updates: Partial<Omit<GalleryImage, 'id' | 'created_at'>>
): Promise<GalleryImage> {
  const { data, error } = await supabase
    .from('gallery')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw error;
}

export async function getGalleryCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('category')
    .order('category');

  if (error) throw error;
  return [...new Set((data || []).map((d) => d.category).filter(Boolean))];
}
