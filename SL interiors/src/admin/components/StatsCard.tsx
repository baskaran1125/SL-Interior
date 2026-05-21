import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'amber' | 'blue' | 'green' | 'purple' | 'red';
}

const colorMap = {
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  red: 'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400',
};

const iconColorMap = {
  amber: 'bg-amber-500/15 text-amber-400',
  blue: 'bg-blue-500/15 text-blue-400',
  green: 'bg-emerald-500/15 text-emerald-400',
  purple: 'bg-purple-500/15 text-purple-400',
  red: 'bg-red-500/15 text-red-400',
};

const StatsCard = ({ title, value, icon: Icon, description, color = 'amber' }: StatsCardProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color]} p-6 transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {description && (
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconColorMap[color]}`}>
          <Icon className="w-5 h-5" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
