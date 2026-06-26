import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { ESTADOS_VENEZUELA, TIPOS_ACOPIO } from '../../types';
import StatsBarChart from './StatsBarChart';

interface FilterCardProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  estadoFilter: string;
  setEstadoFilter: (estado: string) => void;
  tipoFilter: string;
  setTipoFilter: (tipo: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  userGpsLocation: { lat: number; lng: number } | null;
  sortByDistance: boolean;
  setSortByDistance: (sort: boolean | ((p: boolean) => boolean)) => void;
  statsByEstado: { estado: string; count: number }[];
}

export default function FilterCard({
  searchQuery,
  setSearchQuery,
  estadoFilter,
  setEstadoFilter,
  tipoFilter,
  setTipoFilter,
  statusFilter,
  setStatusFilter,
  resetFilters,
  hasActiveFilters,
  userGpsLocation,
  sortByDistance,
  setSortByDistance,
  statsByEstado,
}: FilterCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Filtros de Búsqueda</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Filtre centros por palabra, estado y categoría</p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Term */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* State filter */}
        <div>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-600 dark:text-slate-350"
          >
            <option value="" className="dark:bg-slate-800 dark:text-slate-100">Todos los Estados</option>
            {ESTADOS_VENEZUELA.map((est) => (
              <option key={est} value={est} className="dark:bg-slate-800 dark:text-slate-100">
                {est}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-600 dark:text-slate-350"
          >
            <option value="" className="dark:bg-slate-800 dark:text-slate-100">Cualquier Categoría</option>
            {TIPOS_ACOPIO.map((t) => (
              <option key={t} value={t} className="dark:bg-slate-800 dark:text-slate-100">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-600 dark:text-slate-350"
          >
            <option value="" className="dark:bg-slate-800 dark:text-slate-100">Todos los Estados Operativos</option>
            <option value="activo" className="dark:bg-slate-800 dark:text-slate-100">Abierto</option>
            <option value="saturado" className="dark:bg-slate-800 dark:text-slate-100">Saturado</option>
            <option value="inactivo" className="dark:bg-slate-800 dark:text-slate-100">Cerrado / Inactivo</option>
          </select>
        </div>
      </div>

      {/* Sort by distance toggle */}
      {userGpsLocation && (
        <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSortByDistance((p) => !p)}
            className={`flex items-center gap-2 text-xs font-bold py-1.5 px-3.5 rounded-full transition-all cursor-pointer ${
              sortByDistance
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortByDistance ? 'Ordenado por distancia' : 'Ordenar por distancia'}
          </button>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            GPS activo • {userGpsLocation.lat.toFixed(3)}, {userGpsLocation.lng.toFixed(3)}
          </span>
        </div>
      )}

      {/* Stats mini bar chart */}
      <StatsBarChart statsByEstado={statsByEstado} />
    </div>
  );
}
