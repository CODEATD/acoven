import React from 'react';

type BarColor = 'blue' | 'amber' | 'indigo' | 'emerald';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  barColor?: BarColor;
  action?: React.ReactNode;
}

const barColors: Record<BarColor, string> = {
  blue: 'bg-cranberry-700',
  amber: 'bg-amber-500',
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
};

export default function SectionHeader({ title, subtitle, barColor = 'blue', action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-6 ${barColors[barColor]} rounded-full`} />
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">{title}</h2>
          {subtitle && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
