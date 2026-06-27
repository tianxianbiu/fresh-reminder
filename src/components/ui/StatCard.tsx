import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'green' | 'orange' | 'red' | 'blue' | 'purple';
  subtitle?: string;
  delay?: number;
}

const colorMap = {
  green: {
    bg: 'from-green-400 to-emerald-500',
    light: 'bg-green-50',
    text: 'text-green-600',
    iconBg: 'bg-white/20',
  },
  orange: {
    bg: 'from-orange-400 to-amber-500',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    iconBg: 'bg-white/20',
  },
  red: {
    bg: 'from-red-400 to-rose-500',
    light: 'bg-red-50',
    text: 'text-red-600',
    iconBg: 'bg-white/20',
  },
  blue: {
    bg: 'from-blue-400 to-cyan-500',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-white/20',
  },
  purple: {
    bg: 'from-purple-400 to-violet-500',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    iconBg: 'bg-white/20',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  delay = 0,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className="card overflow-hidden animate-slide-up"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div className={`bg-gradient-to-br ${colors.bg} p-5 text-white relative overflow-hidden`}>
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10"></div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5"></div>

        <div className="relative z-10">
          <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center mb-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-white/70 text-xs mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
