import { supabase } from '@/lib/supabase';
import type { HomepageContent } from '@/lib/types';

export async function getHomepageSection(sectionKey: string): Promise<Record<string, any> | null> {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('content')
    .eq('section_key', sectionKey)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data?.content || null;
}

export async function getAllHomepageContent(): Promise<HomepageContent[]> {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .order('section_key');

  if (error) throw error;
  return data || [];
}

export async function updateHomepageSection(
  sectionKey: string,
  content: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('homepage_content')
    .upsert(
      { section_key: sectionKey, content },
      { onConflict: 'section_key' }
    );

  if (error) throw error;
}
