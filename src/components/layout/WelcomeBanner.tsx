import React from 'react';
import { Info } from 'lucide-react';

interface WelcomeBannerProps {
  totalLugares: number;
}

export default function WelcomeBanner({ totalLugares }: WelcomeBannerProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-950/25 border-b border-blue-100/80 dark:border-blue-900/30 px-6 py-3 text-xs text-blue-900 dark:text-blue-200 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>
            <strong>¿Quieres registrar un centro?</strong> Llena el formulario a la izquierda, o{' '}
            <strong>haz clic en cualquier lugar del mapa</strong> para capturar coordenadas geográficas al instante.
          </span>
        </div>
        <div className="bg-blue-700/15 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] shrink-0 uppercase tracking-wider">
          {totalLugares} Puntos Registrados
        </div>
      </div>
    </div>
  );
}
