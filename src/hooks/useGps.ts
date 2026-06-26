import { useState } from 'react';
import { haversineKm } from '../utils/haversine';

export interface GpsLocation {
  lat: number;
  lng: number;
}

export function useGps(onResolved?: (lat: number, lng: number) => void) {
  const [userGpsLocation, setUserGpsLocation] = useState<GpsLocation | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  const handleUserLocationResolved = (lat: number, lng: number) => {
    setUserGpsLocation({ lat, lng });
    setSortByDistance(true);
    onResolved?.(lat, lng);
  };

  const distanceTo = (lat: number, lng: number): number | null => {
    if (!userGpsLocation) return null;
    return haversineKm(userGpsLocation.lat, userGpsLocation.lng, lat, lng);
  };

  return {
    userGpsLocation,
    sortByDistance,
    setSortByDistance,
    handleUserLocationResolved,
    distanceTo,
    haversineKm,
  };
}
