import { useState } from 'react';
import { fetchByAddress } from '../utils/geocoding';

interface GeocodeCallbacks {
  onSuccess: (lat: number, lng: number, label: string) => void;
  onError: (msg: string) => void;
}

export function useGeocoding() {
  const [loading, setLoading] = useState(false);

  const geocodeDireccion = async (address: string, callbacks: GeocodeCallbacks) => {
    if (!address.trim()) {
      callbacks.onError('Escribe una dirección para buscar.');
      return;
    }
    setLoading(true);
    try {
      const result = await fetchByAddress(address);
      if (result) {
        callbacks.onSuccess(result.lat, result.lng, result.label);
      } else {
        callbacks.onError('No se encontró la dirección. Intenta ser más específico.');
      }
    } catch {
      callbacks.onError('Error al buscar la dirección. Comprueba tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return { geocodingLoading: loading, geocodeDireccion };
}
