import React from 'react';
import { Info } from 'lucide-react';

interface WelcomeBannerProps {
  totalLugares: number;
}

export default function WelcomeBanner({ totalLugares }: WelcomeBannerProps) {
  return (
    <div className="bg-cranberry-50 dark:bg-cranberry-950/25 border-b border-cranberry-100/80 dark:border-cranberry-900/30 px-6 py-3 text-xs text-cranberry-900 dark:text-cranberry-200 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cranberry-700 dark:text-cranberry-400 shrink-0" />
          <span>
            <strong>¿Quieres registrar un centro?</strong> Llena el formulario a la izquierda, o{' '}
            <strong>haz clic en cualquier lugar del mapa</strong> para capturar coordenadas geográficas al instante.
          </span>
        </div>
        <div className="bg-cranberry-700/15 dark:bg-cranberry-500/20 text-cranberry-800 dark:text-cranberry-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] shrink-0 uppercase tracking-wider">
          {totalLugares} Puntos Registrados
        </div>
      </div>
    </div>
  );
}
