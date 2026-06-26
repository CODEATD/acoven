import React from 'react';

export default function AppFooter() {
  return (
    <footer className="px-6 py-3 bg-white text-rotaract-text text-[10px] uppercase tracking-[0.2em] flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-slate-200 shrink-0">
      <span>Busca Acopio v1.0.4 - VE</span>
      <span className="text-slate-500">Supabase Backend Active</span>
      <span className="text-cranberry-600 font-bold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-cranberry-500 animate-ping" />
        System Operational
      </span>
    </footer>
  );
}
