import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Map, Share2, Edit2, Trash2, Navigation2 } from 'lucide-react';
import { Lugar } from '../../types';
import { haversineKm } from '../../utils/haversine';

interface LugarDetailPanelProps {
  selectedLugar: Lugar;
  userGpsLocation: { lat: number; lng: number } | null;
  onShare: (lugar: Lugar) => void;
  onEdit: (lugar: Lugar) => void;
  onDelete: (id: string, name: string) => void;
}

export default function LugarDetailPanel({
  selectedLugar,
  userGpsLocation,
  onShare,
  onEdit,
  onDelete,
}: LugarDetailPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4 mt-2"
    >
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] bg-slate-800 text-yellow-400 font-bold px-2 py-0.5 rounded-md">
            {selectedLugar.estado}
          </span>
          <span
            className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
              selectedLugar.estadoOperativo === 'activo'
                ? 'bg-blue-600 text-white shadow-sm'
                : selectedLugar.estadoOperativo === 'saturado'
                  ? 'bg-amber-500 text-slate-900 shadow-sm'
                  : 'bg-rose-500 text-white'
            }`}
          >
            {selectedLugar.estadoOperativo === 'activo'
              ? 'Recibiendo'
              : selectedLugar.estadoOperativo === 'saturado'
                ? 'Saturado'
                : 'Inactivo'}
          </span>
        </div>
        <h4 className="text-base font-bold tracking-tight text-white">{selectedLugar.nombre}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{selectedLugar.descripcion}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <p className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{selectedLugar.direccion}</span>
          </p>
          {selectedLugar.contacto && (
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{selectedLugar.contacto}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-stretch gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0">
        {userGpsLocation && (
          <div className="text-center text-[11px] text-slate-400 font-semibold bg-slate-800 rounded-xl py-1.5 px-3 flex items-center justify-center gap-1.5">
            <Navigation2 className="w-3 h-3 text-blue-400" />
            {haversineKm(userGpsLocation.lat, userGpsLocation.lng, selectedLugar.lat, selectedLugar.lng).toFixed(1)} km
          </div>
        )}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${selectedLugar.lat},${selectedLugar.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer no-underline text-center"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Ver en Google Maps</span>
        </a>
        <button
          onClick={() => onShare(selectedLugar)}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartir</span>
        </button>
        <button
          onClick={() => onEdit(selectedLugar)}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Editar</span>
        </button>
        <button
          onClick={() => onDelete(selectedLugar.id, selectedLugar.nombre)}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer border border-rose-800/40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Eliminar</span>
        </button>
      </div>
    </motion.div>
  );
}
