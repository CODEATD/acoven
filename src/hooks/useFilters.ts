import { useState } from 'react';
import { Lugar, ESTADOS_VENEZUELA } from '../types';
import { haversineKm } from '../utils/haversine';
import { GpsLocation } from './useGps';

export function useFilters(lugares: Lugar[], userGpsLocation: GpsLocation | null, sortByDistance: boolean) {
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const resetFilters = () => {
    setSearchQuery('');
    setEstadoFilter('');
    setTipoFilter('');
    setStatusFilter('');
  };

  const hasActiveFilters = !!(searchQuery || estadoFilter || tipoFilter || statusFilter);

  const filteredBase = lugares.filter((lugar) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lugar.nombre.toLowerCase().includes(q) ||
      lugar.descripcion.toLowerCase().includes(q) ||
      lugar.direccion.toLowerCase().includes(q);
    const matchesEstado = estadoFilter ? lugar.estado === estadoFilter : true;
    const matchesTipo = tipoFilter ? lugar.tipoAcopio === tipoFilter : true;
    const matchesStatus = statusFilter ? lugar.estadoOperativo === statusFilter : true;
    return matchesSearch && matchesEstado && matchesTipo && matchesStatus;
  });

  const filteredLugares =
    sortByDistance && userGpsLocation
      ? [...filteredBase].sort((a, b) => {
          const dA = haversineKm(userGpsLocation.lat, userGpsLocation.lng, a.lat, a.lng);
          const dB = haversineKm(userGpsLocation.lat, userGpsLocation.lng, b.lat, b.lng);
          return dA - dB;
        })
      : filteredBase;

  const statsByEstado = ESTADOS_VENEZUELA.map((est) => ({
    estado: est,
    count: lugares.filter((l) => l.estado === est).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    searchQuery, setSearchQuery,
    estadoFilter, setEstadoFilter,
    tipoFilter, setTipoFilter,
    statusFilter, setStatusFilter,
    resetFilters,
    hasActiveFilters,
    filteredLugares,
    statsByEstado,
  };
}
