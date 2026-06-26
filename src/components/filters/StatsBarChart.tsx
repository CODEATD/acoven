import React from 'react';
import { BarChart3 } from 'lucide-react';

interface EstadoStat {
  estado: string;
  count: number;
}

interface StatsBarChartProps {
  statsByEstado: EstadoStat[];
}

export default function StatsBarChart({ statsByEstado }: StatsBarChartProps) {
  if (statsByEstado.length === 0) return null;

  return (
    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Acopios por Estado
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {statsByEstado.map((s) => (
          <div key={s.estado} className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 w-24 shrink-0 truncate">
              {s.estado}
            </span>
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cranberry-600 dark:bg-cranberry-500 rounded-full transition-all duration-500"
                style={{ width: `${(s.count / statsByEstado[0].count) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 w-4 text-right shrink-0">
              {s.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
