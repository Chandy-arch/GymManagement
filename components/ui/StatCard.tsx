interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: 'red' | 'blue' | 'emerald' | 'purple' | 'orange';
}

export default function StatCard({ label, value, icon, trend, trendUp, color = 'red' }: StatCardProps) {
  const colorMap = {
    red: 'from-red-600/20 to-red-900/20 border-red-800/30',
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-800/30',
    emerald: 'from-emerald-600/20 to-emerald-900/20 border-emerald-800/30',
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-800/30',
    orange: 'from-orange-600/20 to-orange-900/20 border-orange-800/30',
  };

  const iconBgMap = {
    red: 'bg-red-600/20 text-red-400',
    blue: 'bg-blue-600/20 text-blue-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    purple: 'bg-purple-600/20 text-purple-400',
    orange: 'bg-orange-600/20 text-orange-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5 backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${iconBgMap[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-sm text-zinc-400 font-medium">{label}</p>
    </div>
  );
}
