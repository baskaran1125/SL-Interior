import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Save } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '@/services/serviceService';
import { uploadImage } from '@/services/storageService';
import type { Service } from '@/lib/types';
import ImageUploader from './components/ImageUploader';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import { toast } from 'sonner';

const iconOptions = ['Home', 'Building2', 'Palette', 'Ruler', 'ChefHat', 'Sofa', 'Paintbrush', 'Lamp', 'Bath', 'Bed'];

const ServicesAdmin = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon_name: 'Home', image_url: '', benefits: [''], display_order: 0 });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try { setServices(await getServices()); } catch { toast.error('Failed to load services'); }
    finally { setLoading(false); }
  };

  const resetForm = () => { setForm({ title: '', description: '', icon_name: 'Home', image_url: '', benefits: [''], display_order: 0 }); setEditing(null); setPendingFile(null); setShowForm(false); };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, icon_name: s.icon_name, image_url: s.image_url, benefits: s.benefits.length ? s.benefits : [''], display_order: s.display_order });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (pendingFile) { imageUrl = await uploadImage('service-images', pendingFile); }
      const payload = { ...form, image_url: imageUrl, benefits: form.benefits.filter(Boolean) };
      if (editing) { await updateService(editing.id, payload); toast.success('Updated'); }
      else { await createService(payload); toast.success('Created'); }
      resetForm();
      fetchServices();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteService(deleteTarget.id); toast.success('Deleted'); setDeleteTarget(null); fetchServices(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const addBenefit = () => setForm({ ...form, benefits: [...form.benefits, ''] });
  const removeBenefit = (i: number) => setForm({ ...form, benefits: form.benefits.filter((_, idx) => idx !== i) });
  const updateBenefit = (i: number, v: string) => { const b = [...form.benefits]; b[i] = v; setForm({ ...form, benefits: b }); };

  const ic = 'w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all';

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Services</h1><p className="text-zinc-500 text-sm mt-1">Manage your service offerings</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"><Plus className="w-4 h-4" /> Add Service</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] overflow-y-auto">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl mb-10">
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-white">{editing ? 'Edit Service' : 'New Service'}</h2><button onClick={resetForm} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={ic} required /></div>
                <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Icon</label>
                  <select value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className={ic}>{iconOptions.map((i) => <option key={i} value={i}>{i}</option>)}</select>
                </div>
              </div>
              <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${ic} resize-none`} /></div>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Benefits</label>
                {form.benefits.map((b, i) => (
                  <div key={i} className="flex gap-2 mb-2"><input value={b} onChange={(e) => updateBenefit(i, e.target.value)} className={ic} placeholder="Benefit" /><button type="button" onClick={() => removeBenefit(i)} className="text-zinc-500 hover:text-red-400"><X className="w-4 h-4" /></button></div>
                ))}
                <button type="button" onClick={addBenefit} className="text-xs text-amber-400 hover:text-amber-300">+ Add benefit</button>
              </div>
              <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Service Image</label><ImageUploader onUpload={(f) => setPendingFile(f[0])} previewUrls={form.image_url ? [form.image_url] : []} /></div>
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={resetForm} className="px-4 py-2.5 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <EmptyState title="No services" description="Add your first service" actionLabel="Add Service" onAction={() => { resetForm(); setShowForm(true); }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.id} className="group bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1"><h3 className="text-sm font-semibold text-white">{s.title}</h3><p className="text-xs text-zinc-500 mt-1 line-clamp-2">{s.description}</p>
                  {s.benefits.length > 0 && <div className="flex flex-wrap gap-1 mt-3">{s.benefits.slice(0, 3).map((b, i) => <span key={i} className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">{b}</span>)}{s.benefits.length > 3 && <span className="text-[10px] text-zinc-500">+{s.benefits.length - 3} more</span>}</div>}
                </div>
                <div className="flex gap-1.5 ml-4">
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget(s)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} title="Delete Service" message={`Delete "${deleteTarget?.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
};

export default ServicesAdmin;
