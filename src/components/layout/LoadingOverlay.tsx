import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-700/20">
          <Loader2 className="w-7 h-7 text-white animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 dark:text-white font-bold text-base">Conectando con Supabase...</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Cargando puntos de acopio</p>
        </div>
      </div>
    </div>
  );
}
