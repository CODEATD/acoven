import React from 'react';
import { Heart, Database, Download, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface AppHeaderProps {
  activos: number;
  showInstallBtn: boolean;
  onInstallClick: () => void;
  onExport: () => void;
}

export default function AppHeader({ activos, showInstallBtn, onInstallClick, onExport }: AppHeaderProps) {
  const { theme, toggleTheme } = useAppContext();

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 gap-4 shrink-0 shadow-sm transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-700/10">
          <Heart className="h-5 w-5 text-white fill-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Busca <span className="text-blue-700 dark:text-blue-400">Acopio</span>
            <span className="text-[9px] bg-yellow-400 dark:bg-yellow-500 text-blue-900 dark:text-slate-950 font-extrabold px-2 py-0.5 rounded-full ml-2 align-middle border border-yellow-500/20 shadow-sm">
              VENEZUELA
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Plataforma Colaborativa de Registro
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
        <span className="hidden sm:inline">Venezuela • Colaborativo</span>
        <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:inline" />
        <span className="text-blue-700 dark:text-blue-400 font-bold">{activos} Centros Activos</span>
        <span className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Supabase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          </div>

          <button
            onClick={onExport}
            title="Respaldar todo en JSON"
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 hover:text-slate-950 dark:hover:text-white transition-all rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer border border-slate-200/50 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden md:inline">Exportar</span>
          </button>

          <button
            onClick={toggleTheme}
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all rounded-lg p-1.5 text-xs font-semibold cursor-pointer border border-slate-200/50 dark:border-slate-700"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {showInstallBtn && (
            <button
              onClick={onInstallClick}
              title="Instalar esta web como aplicación"
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg px-2.5 py-1.5 text-xs shadow-md cursor-pointer border border-blue-600 animate-pulse transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Instalar App</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
