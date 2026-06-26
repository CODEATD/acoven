import React from 'react';
import { MapPin } from 'lucide-react';
import { Lugar } from '../../types';
import LugarCard from './LugarCard';

interface LugaresListProps {
  filteredLugares: Lugar[];
  selectedLugar: Lugar | null;
  onSelectLugar: (lugar: Lugar) => void;
  onShareLugar: (lugar: Lugar) => void;
  onEditLugar: (lugar: Lugar) => void;
  onDeleteLugar: (id: string, name: string) => void;
  userGpsLocation: { lat: number; lng: number } | null;
  totalLugaresCount: number;
}

export default function LugaresList({
  filteredLugares,
  selectedLugar,
  onSelectLugar,
  onShareLugar,
  onEditLugar,
  onDeleteLugar,
  userGpsLocation,
  totalLugaresCount,
}: LugaresListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-6 bg-cranberry-700 rounded-full"></div>
          <div>
            <h2 className="font-bold text-slate-700 dark:text-slate-150 text-base">Lugares Registrados</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Mostrando {filteredLugares.length} de {totalLugaresCount} acopios
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[9px] font-bold rounded text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Respaldo Local Activo
        </span>
      </div>

      {filteredLugares.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-650 mx-auto mb-2" />
          <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">No se encontraron acopios</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Intenta modificando los filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
          {filteredLugares.map((lugar) => (
            <LugarCard
              key={lugar.id}
              lugar={lugar}
              isSelected={selectedLugar?.id === lugar.id}
              onSelect={() => onSelectLugar(lugar)}
              onShare={() => onShareLugar(lugar)}
              onEdit={() => onEditLugar(lugar)}
              onDelete={() => onDeleteLugar(lugar.id, lugar.nombre)}
              userGpsLocation={userGpsLocation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
