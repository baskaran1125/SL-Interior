import { supabase } from '@/lib/supabase';
import type { Project, ProjectImage } from '@/lib/types';

// ─── Fetch all projects ──────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ─── Fetch featured projects ────────────────────────────────────
export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_featured', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ─── Fetch single project ──────────────────────────────────────
export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ─── Create project ────────────────────────────────────────────
export async function createProject(
  project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'project_images'>
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Update project ────────────────────────────────────────────
export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at' | 'project_images'>>
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Delete project ────────────────────────────────────────────
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ─── Add project image ─────────────────────────────────────────
export async function addProjectImage(
  image: Omit<ProjectImage, 'id' | 'created_at'>
): Promise<ProjectImage> {
  const { data, error } = await supabase
    .from('project_images')
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Delete project image ──────────────────────────────────────
export async function deleteProjectImage(id: string): Promise<void> {
  const { error } = await supabase.from('project_images').delete().eq('id', id);
  if (error) throw error;
}

// ─── Get unique categories ─────────────────────────────────────
export async function getProjectCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .order('category');

  if (error) throw error;
  const cats = [...new Set((data || []).map((d) => d.category).filter(Boolean))];
  return cats;
}
