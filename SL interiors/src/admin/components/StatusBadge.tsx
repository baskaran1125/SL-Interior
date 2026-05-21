import type { EnquiryStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: EnquiryStatus | 'approved' | 'pending' | 'featured';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  new: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', label: 'New' },
  contacted: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Contacted' },
  converted: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Converted' },
  approved: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Approved' },
  pending: { bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-400', label: 'Pending' },
  featured: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Featured' },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
