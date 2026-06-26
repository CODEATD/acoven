import React from 'react';
import { Loader2, Navigation2 } from 'lucide-react';

interface DireccionFieldProps {
  value: string;
  onChange: (value: string) => void;
  onGeocode: () => void;
  loading: boolean;
}

export default function DireccionField({ value, onChange, onGeocode, loading }: DireccionFieldProps) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">
        Dirección o Referencia Física *
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ej. Calle Principal, frente a la Plaza Bolívar"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800 dark:text-slate-100"
          required
        />
        <button
          type="button"
          onClick={onGeocode}
          disabled={loading}
          title="Buscar coordenadas por dirección"
          className="shrink-0 flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Navigation2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buscar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
