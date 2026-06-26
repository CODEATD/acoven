import React from 'react';

export default function AppFooter() {
  return (
    <footer className="px-6 py-3 bg-slate-900 text-slate-400 text-[10px] uppercase tracking-[0.2em] flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-slate-800 shrink-0">
      <span>Busca Acopio v1.0.4 - VE</span>
      <span>Supabase Backend Active</span>
      <span className="text-cranberry-400 font-bold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-cranberry-400 animate-ping" />
        System Operational
      </span>
    </footer>
  );
}
