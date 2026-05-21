import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon = Inbox, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-2xl bg-zinc-800/50 mb-4">
        <Icon className="w-10 h-10 text-zinc-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-zinc-300">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1 text-center max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
