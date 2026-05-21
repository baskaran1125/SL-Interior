import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Loader2, X, Save, Image as ImageIcon } from 'lucide-react';
import { getGalleryImages, createGalleryImage, deleteGalleryImage, getGalleryCategories } from '@/services/galleryService';
import { uploadImage, deleteImage } from '@/services/storageService';
import type { GalleryImage } from '@/lib/types';
import ImageUploader from './components/ImageUploader';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import { toast } from 'sonner';

const GalleryAdmin = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadForm, setUploadForm] = useState({ category: '', alt_text: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [imgs, cats] = await Promise.all([getGalleryImages(), getGalleryCategories()]);
      setImages(imgs);
      setCategories(cats);
    } catch { toast.error('Failed to load gallery'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (files: File[]) => {
    if (!uploadForm.category.trim()) { toast.error('Please enter a category'); return; }
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImage('gallery-images', file);
        await createGalleryImage({ image_url: url, alt_text: uploadForm.alt_text || file.name, category: uploadForm.category, display_order: 0 });
      }
      toast.success(`${files.length} image(s) uploaded`);
      setShowUpload(false);
      fetchData();
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteImage('gallery-images', deleteTarget.image_url).catch(() => {});
      await deleteGalleryImage(deleteTarget.id);
      toast.success('Image deleted');
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const filtered = images.filter((img) => {
    const s = img.alt_text.toLowerCase().includes(search.toLowerCase()) || img.category.toLowerCase().includes(search.toLowerCase());
    return s && (categoryFilter === 'All' || img.category === categoryFilter);
  });

  const ic = 'w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all';

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Gallery</h1><p className="text-zinc-500 text-sm mt-1">Manage your image gallery</p></div>
        <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"><Plus className="w-4 h-4" /> Upload Images</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className={`${ic} pl-10`} /></div>
        <div className="flex gap-2 flex-wrap">{['All', ...categories].map((c) => (<button key={c} onClick={() => setCategoryFilter(c)} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${categoryFilter === c ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{c}</button>))}</div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-white">Upload Images</h2><button onClick={() => setShowUpload(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Category *</label><input value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className={ic} placeholder="e.g., Living Room" /></div>
              <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Alt Text</label><input value={uploadForm.alt_text} onChange={(e) => setUploadForm({ ...uploadForm, alt_text: e.target.value })} className={ic} placeholder="Describe the image" /></div>
              <ImageUploader multiple uploading={uploading} onUpload={handleUpload} />
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No images" description="Upload your first image" actionLabel="Upload" onAction={() => setShowUpload(true)} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-800 border border-zinc-800/50 hover:border-zinc-700 transition-all">
              <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase tracking-widest text-amber-400">{img.category}</p>
                <p className="text-xs text-white truncate mt-0.5">{img.alt_text}</p>
              </div>
              <button onClick={() => setDeleteTarget(img)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} title="Delete Image" message="Delete this image permanently?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
};

export default GalleryAdmin;
