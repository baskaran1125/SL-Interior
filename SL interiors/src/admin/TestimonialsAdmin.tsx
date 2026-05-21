import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Save, Star, CheckCircle } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, approveTestimonial } from '@/services/testimonialService';
import type { Testimonial } from '@/lib/types';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import StatusBadge from './components/StatusBadge';
import { toast } from 'sonner';

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5, is_approved: true, display_order: 0, photo_url: null as string | null });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try { setTestimonials(await getTestimonials()); } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const resetForm = () => { setForm({ name: '', role: '', text: '', rating: 5, is_approved: true, display_order: 0, photo_url: null }); setEditing(null); setShowForm(false); };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, is_approved: t.is_approved, display_order: t.display_order, photo_url: t.photo_url });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) { toast.error('Name and review required'); return; }
    setSaving(true);
    try {
      if (editing) { await updateTestimonial(editing.id, form); toast.success('Updated'); }
      else { await createTestimonial(form); toast.success('Created'); }
      resetForm(); fetchData();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleApprove = async (id: string) => {
    try { await approveTestimonial(id); toast.success('Approved'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteTestimonial(deleteTarget.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); }
    catch { toast.error('Failed'); }
    finally { setDeleting(false); }
  };

  const filtered = testimonials.filter((t) => {
    if (filter === 'approved') return t.is_approved;
    if (filter === 'pending') return !t.is_approved;
    return true;
  });

  const ic = 'w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all';

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Testimonials</h1><p className="text-zinc-500 text-sm mt-1">Manage client reviews</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg"><Plus className="w-4 h-4" /> Add Testimonial</button>
      </div>

      <div className="flex gap-2">{(['all', 'approved', 'pending'] as const).map((f) => (<button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all ${filter === f ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{f}</button>))}</div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'New'} Testimonial</h2><button onClick={resetForm} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 justify-center py-2">{[1,2,3,4,5].map((s) => (<button key={s} type="button" onClick={() => setForm({...form, rating: s})}><Star className={`w-7 h-7 ${form.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} /></button>))}</div>
              <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Name *</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={ic} required /></div><div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Role</label><input value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className={ic} /></div></div>
              <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Review *</label><textarea value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} rows={4} className={`${ic} resize-none`} required /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_approved} onChange={(e) => setForm({...form, is_approved: e.target.checked})} className="accent-amber-500" /><span className="text-sm text-zinc-300">Approved</span></label>
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={resetForm} className="px-4 py-2.5 text-sm text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-amber-600 rounded-lg disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={Star} title="No testimonials" description="Add client reviews" actionLabel="Add" onAction={() => { resetForm(); setShowForm(true); }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-0.5">{[...Array(t.rating)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
                <StatusBadge status={t.is_approved ? 'approved' : 'pending'} />
              </div>
              <p className="text-sm text-zinc-300 italic line-clamp-3">"{t.text}"</p>
              <div className="mt-3 pt-3 border-t border-zinc-800"><p className="text-sm text-white font-medium">{t.name}</p><p className="text-xs text-zinc-500">{t.role}</p></div>
              <div className="flex gap-1.5 mt-3">
                {!t.is_approved && <button onClick={() => handleApprove(t.id)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"><CheckCircle className="w-3.5 h-3.5" /></button>}
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteTarget(t)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} title="Delete Testimonial" message={`Delete review from "${deleteTarget?.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
};

export default TestimonialsAdmin;
