import React from 'react';

type ColorScheme = 'slate' | 'emerald' | 'amber' | 'rose';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorScheme?: ColorScheme;
}

const schemes: Record<ColorScheme, string> = {
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
};

export default function StatCard({ icon, label, value, colorScheme = 'slate' }: StatCardProps) {
  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`p-3 rounded-2xl ${schemes[colorScheme]}`}>{icon}</div>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${
          colorScheme === 'slate'
            ? 'text-slate-400 dark:text-slate-500'
            : colorScheme === 'emerald'
              ? 'text-emerald-600/80 dark:text-emerald-400/80'
              : colorScheme === 'amber'
                ? 'text-amber-600/80 dark:text-amber-400/80'
                : 'text-rose-600/80 dark:text-rose-400/80'
        }`}>
          {label}
        </p>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-150">{value}</h3>
      </div>
    </div>
  );
}
