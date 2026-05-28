import { useState, useEffect } from 'react';
import { Search, Loader2, Mail, Phone, Calendar, Filter } from 'lucide-react';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '@/services/enquiryService';
import type { Enquiry, EnquiryStatus } from '@/lib/types';
import StatusBadge from './components/StatusBadge';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import { toast } from 'sonner';

const EnquiriesAdmin = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EnquiryStatus>('all');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try { setEnquiries(await getEnquiries()); } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    try { await updateEnquiryStatus(id, status); toast.success('Status updated'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteEnquiry(deleteTarget.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); }
    catch { toast.error('Failed'); }
    finally { setDeleting(false); }
  };

  const filtered = enquiries.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.message.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (statusFilter === 'all' || e.status === statusFilter);
  });

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const ic = 'w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all';

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Enquiries</h1><p className="text-zinc-500 text-sm mt-1">Manage client enquiries and contact submissions</p></div>

      <div className="flex flex-col gap-3">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enquiries..." className={`${ic} pl-10`} /></div>
        <div className="flex flex-wrap gap-2">{(['all', 'new', 'contacted', 'converted'] as const).map((s) => (<button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all ${statusFilter === s ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{s}{s !== 'all' && ` (${enquiries.filter(e => e.status === s).length})`}</button>))}</div>
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className={`flex-1 min-w-0 ${selected ? 'hidden lg:block' : ''}`}>
          {filtered.length === 0 ? (
            <EmptyState icon={Mail} title="No enquiries" description={search ? 'Try a different search' : 'No enquiries yet'} />
          ) : (
            <div className="space-y-2">
              {filtered.map((e) => (
                <button key={e.id} onClick={() => setSelected(e)} className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === e.id ? 'bg-zinc-800/80 border-amber-500/30' : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 text-xs font-semibold shrink-0">{e.name.charAt(0).toUpperCase()}</div>
                      <div className="min-w-0"><p className="text-sm text-white font-medium truncate">{e.name}</p><p className="text-xs text-zinc-500 truncate">{e.email}</p></div>
                    </div>
                    <div className="shrink-0 text-right"><StatusBadge status={e.status} /><p className="text-[10px] text-zinc-600 mt-1">{formatDate(e.created_at)}</p></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail — full screen on mobile, side panel on desktop */}
        {selected && (
          <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto lg:static lg:inset-auto lg:z-auto lg:bg-transparent lg:w-[400px] lg:shrink-0">
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 sm:p-6 lg:sticky lg:top-6 min-h-screen lg:min-h-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-white flex items-center gap-1 text-sm border border-zinc-700 rounded-lg px-3 py-1.5 lg:border-0 lg:p-0 lg:text-xs"><span>← Back</span></button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-zinc-500" /><span className="text-zinc-300">{selected.email}</span></div>
                {selected.phone && <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-zinc-500" /><span className="text-zinc-300">{selected.phone}</span></div>}
                <div className="flex items-center gap-3 text-sm"><Calendar className="w-4 h-4 text-zinc-500" /><span className="text-zinc-300">{formatDate(selected.created_at)}</span></div>
                {selected.project_type && <div className="text-sm"><span className="text-zinc-500">Type: </span><span className="text-zinc-300">{selected.project_type}</span></div>}
                {selected.budget && <div className="text-sm"><span className="text-zinc-500">Budget: </span><span className="text-zinc-300">{selected.budget}</span></div>}
                <div className="text-sm"><span className="text-zinc-500">Source: </span><span className="text-zinc-300 capitalize">{selected.source}</span></div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800"><p className="text-xs text-zinc-500 mb-2">Message</p><p className="text-sm text-zinc-300 leading-relaxed">{selected.message}</p></div>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 mb-3">Update Status</p>
                <div className="flex gap-2">{(['new', 'contacted', 'converted'] as EnquiryStatus[]).map((s) => (<button key={s} onClick={() => handleStatusChange(selected.id, s)} className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all ${selected.status === s ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{s}</button>))}</div>
              </div>
              <button onClick={() => setDeleteTarget(selected)} className="mt-4 w-full py-2 text-xs text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all">Delete Enquiry</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!deleteTarget} title="Delete Enquiry" message="Delete this enquiry permanently?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
};

export default EnquiriesAdmin;
