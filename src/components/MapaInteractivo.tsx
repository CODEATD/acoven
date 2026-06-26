/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Lugar } from '../types';

interface MapaInteractivoProps {
  lugares: Lugar[];
  selectedLugar: Lugar | null;
  onSelectCoords: (lat: number, lng: number) => void;
  tempCoords: { lat: number; lng: number } | null;
  onSelectLugarFromMap: (lugar: Lugar) => void;
}

export default function MapaInteractivo({
  lugares,
  selectedLugar,
  onSelectCoords,
  tempCoords,
  onSelectLugarFromMap,
}: MapaInteractivoProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tempMarkerRef = useRef<L.Marker | null>(null);

  // Custom SVG Markers
  const createMarkerIcon = (estadoOperativo: 'activo' | 'saturado' | 'inactivo', nombre: string) => {
    let color = '#10b981'; // Emerald Green
    let statusText = 'Activo / Abierto';
    if (estadoOperativo === 'saturado') {
      color = '#f59e0b'; // Amber Yellow
      statusText = 'Saturado';
    } else if (estadoOperativo === 'inactivo') {
      color = '#f43f5e'; // Rose Red
      statusText = 'Inactivo / Cerrado';
    }

    const svgHtml = `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <div class="absolute -inset-1 rounded-full bg-[${color}] opacity-30 animate-pulse"></div>
        <svg class="w-8 h-8 drop-shadow-md transition-transform duration-200 hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21C16 16.8 19 13 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 13 8 16.8 12 21Z" fill="${color}" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
        </svg>
      </div>
    `;

    return L.divIcon({
      html: svgHtml,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const createTempMarkerIcon = () => {
    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full bg-indigo-500 opacity-40 animate-ping" style="animation-duration: 2s;"></div>
          <svg class="w-9 h-9 drop-shadow-lg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16 16.8 19 13 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 13 8 16.8 12 21Z" fill="#6366f1" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
            <path d="M12 7V11M10 9H14" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      `,
      className: 'custom-leaflet-temp-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Venezuela Centered Default View
    const map = L.map(mapContainerRef.current, {
      center: [8.0, -66.0], // Coordenadas centrales de Venezuela
      zoom: 6,
      zoomControl: true,
    });

    // Add Tile Layer (CartoDB Positron is very clean and elegant, perfect for custom UI)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    // Create Layer Group for markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapRef.current = map;

    // Listen to Map Clicks to add temporary marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onSelectCoords(parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5)));
    });

    // Handle map container resizing
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Render Registered Places
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Clear previous markers
    markersLayerRef.current.clearLayers();

    lugares.forEach((lugar) => {
      const marker = L.marker([lugar.lat, lugar.lng], {
        icon: createMarkerIcon(lugar.estadoOperativo, lugar.nombre),
      });

      // Prepare custom popup HTML
      const popupContent = `
        <div class="p-1 font-sans text-gray-800" style="min-width: 200px;">
          <h4 class="font-bold text-sm text-gray-900 mb-0.5">${lugar.nombre}</h4>
          <span class="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded mb-2">
            ${lugar.estado}
          </span>
          <p class="text-xs text-gray-600 leading-relaxed mb-2">${lugar.descripcion}</p>
          <div class="text-[11px] text-gray-500 space-y-0.5 border-t border-gray-100 pt-1.5">
            <div><strong class="text-gray-700">Tipo:</strong> ${lugar.tipoAcopio}</div>
            ${lugar.contacto ? `<div><strong class="text-gray-700">Contacto:</strong> ${lugar.contacto}</div>` : ''}
            <div><strong class="text-gray-700">Dirección:</strong> ${lugar.direccion}</div>
          </div>
          <div class="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
            <span>Lat: ${lugar.lat}</span>
            <span>Lng: ${lugar.lng}</span>
          </div>
          <div class="mt-3">
            <a href="https://www.google.com/maps/search/?api=1&query=${lugar.lat},${lugar.lng}" target="_blank" rel="noopener noreferrer" class="block text-center text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all rounded-lg py-1.5 px-3 no-underline shadow-sm">
              Ver en Google Maps
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'custom-leaflet-popup',
      });

      // Trigger callback on selection from map
      marker.on('click', () => {
        onSelectLugarFromMap(lugar);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [lugares]);

  // 3. Render Temporary Selected Coords
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing temporary marker
    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }

    if (tempCoords) {
      const tempMarker = L.marker([tempCoords.lat, tempCoords.lng], {
        icon: createTempMarkerIcon(),
      }).addTo(mapRef.current);

      tempMarker.bindPopup(`
        <div class="p-1 text-center font-sans">
          <p class="font-bold text-xs text-indigo-700 mb-1">¡Coordenadas seleccionadas!</p>
          <p class="text-[10px] text-gray-500 leading-tight">Usa el formulario para guardar este punto.</p>
          <div class="mt-1.5 text-[9px] text-gray-400">
            Lat: ${tempCoords.lat}<br/>Lng: ${tempCoords.lng}
          </div>
        </div>
      `).openPopup();

      tempMarkerRef.current = tempMarker;

      // Pan slightly to the clicked location
      mapRef.current.panTo([tempCoords.lat, tempCoords.lng]);
    }
  }, [tempCoords]);

  // 4. Focus on selected place
  useEffect(() => {
    if (!mapRef.current || !selectedLugar) return;

    mapRef.current.setView([selectedLugar.lat, selectedLugar.lng], 15, {
      animate: true,
      duration: 1.5,
    });

    // Find marker associated and open its popup
    if (markersLayerRef.current) {
      markersLayerRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          const latLng = layer.getLatLng();
          if (
            Math.abs(latLng.lat - selectedLugar.lat) < 0.0001 &&
            Math.abs(latLng.lng - selectedLugar.lng) < 0.0001
          ) {
            layer.openPopup();
          }
        }
      });
    }
  }, [selectedLugar]);

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-gray-50">
      <div ref={mapContainerRef} className="w-full h-full z-10" id="map-leaflet" />
      
      {/* Dynamic Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-gray-100/50 max-w-xs text-xs pointer-events-auto">
        <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Estado de Puntos
        </h5>
        <div className="space-y-1.5 text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block shadow-sm"></span>
            <span>Abierto / Recibiendo donaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block shadow-sm"></span>
            <span>Saturado / Capacidad máxima</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f43f5e] inline-block shadow-sm"></span>
            <span>Inactivo / Temporalmente cerrado</span>
          </div>
          <div className="pt-1.5 border-t border-gray-100 text-[10px] text-gray-400">
            💡 Haz clic en cualquier parte del mapa para marcar un nuevo punto.
          </div>
        </div>
      </div>
    </div>
  );
}
