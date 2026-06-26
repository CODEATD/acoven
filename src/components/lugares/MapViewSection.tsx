import React from 'react';
import MapaInteractivo from '../MapaInteractivo';
import LugarDetailPanel from './LugarDetailPanel';
import { Lugar } from '../../types';

interface MapViewSectionProps {
  activeTab: 'map' | 'list';
  filteredLugares: Lugar[];
  selectedLugar: Lugar | null;
  setSelectedLugar: (lugar: Lugar | null) => void;
  tempCoords: { lat: number; lng: number } | null;
  handleSelectCoordsFromMap: (lat: number, lng: number) => void;
  handleSelectLugarFromMap: (lugar: Lugar) => void;
  theme: 'light' | 'dark';
  handleUserLocationResolved: (lat: number, lng: number) => void;
  userGpsLocation: { lat: number; lng: number } | null;
  handleShareLugar: (lugar: Lugar) => void;
  onEditLugar: (lugar: Lugar) => void;
  onDeleteLugar: (id: string, name: string) => void;
}

export default function MapViewSection({
  activeTab,
  filteredLugares,
  selectedLugar,
  setSelectedLugar,
  tempCoords,
  handleSelectCoordsFromMap,
  handleSelectLugarFromMap,
  theme,
  handleUserLocationResolved,
  userGpsLocation,
  handleShareLugar,
  onEditLugar,
  onDeleteLugar,
}: MapViewSectionProps) {
  return (
    <div
      className={`${
        activeTab === 'map' ? 'flex' : 'hidden lg:flex'
      } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">
              Mapa de Distribución
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Visualización de puntos geográficos con Leaflet
            </p>
          </div>
        </div>
        {selectedLugar && (
          <button
            onClick={() => setSelectedLugar(null)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            Restablecer Enfoque
          </button>
        )}
      </div>

      <div className="h-[400px] md:h-[460px] relative rounded-2xl overflow-hidden">
        <MapaInteractivo
          lugares={filteredLugares}
          selectedLugar={selectedLugar}
          tempCoords={tempCoords}
          onSelectCoords={handleSelectCoordsFromMap}
          onSelectLugarFromMap={handleSelectLugarFromMap}
          theme={theme}
          onUserLocationResolved={handleUserLocationResolved}
        />
      </div>

      {/* Selected Point Details Panel Overlay */}
      {selectedLugar && (
        <LugarDetailPanel
          selectedLugar={selectedLugar}
          userGpsLocation={userGpsLocation}
          onShare={handleShareLugar}
          onEdit={onEditLugar}
          onDelete={onDeleteLugar}
        />
      )}
    </div>
  );
}
