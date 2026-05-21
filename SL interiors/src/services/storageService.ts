import { supabase } from '@/lib/supabase';

type StorageBucket = 'project-images' | 'gallery-images' | 'testimonial-images' | 'homepage-images' | 'service-images';

/**
 * Upload a file to Supabase Storage and return its public URL.
 */
export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export async function deleteImage(bucket: StorageBucket, publicUrl: string): Promise<void> {
  // Extract the file path from the public URL
  const urlParts = publicUrl.split(`/storage/v1/object/public/${bucket}/`);
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw error;
}

/**
 * Upload multiple files and return their public URLs.
 */
export async function uploadMultipleImages(
  bucket: StorageBucket,
  files: File[],
  folder?: string
): Promise<string[]> {
  const uploads = files.map((file) => uploadImage(bucket, file, folder));
  return Promise.all(uploads);
}
