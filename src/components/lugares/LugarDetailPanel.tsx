import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Map, Share2, Edit2, Trash2, Navigation2, Calendar, Clock, Instagram } from 'lucide-react';
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
      className="bg-white text-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-start justify-between gap-4 mt-2"
    >
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md border border-slate-200">
            {selectedLugar.estado}
          </span>
          <span
            className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
              selectedLugar.estadoOperativo === 'activo'
                ? 'bg-cranberry-500 text-white shadow-sm'
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
        <h4 className="text-base font-bold tracking-tight text-slate-900">{selectedLugar.nombre}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{selectedLugar.descripcion}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
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
          {selectedLugar.fechaInicio && (
            <p className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{selectedLugar.fechaInicio}{selectedLugar.fechaFin ? ` a ${selectedLugar.fechaFin}` : ''}</span>
            </p>
          )}
          {selectedLugar.horaInicio && (
            <p className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{selectedLugar.horaInicio}{selectedLugar.horaFin ? ` - ${selectedLugar.horaFin}` : ''}</span>
            </p>
          )}
          {selectedLugar.instagram && (
            <p className="flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-cranberry-500 shrink-0" />
              <a href={`https://instagram.com/${selectedLugar.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-cranberry-600 font-semibold hover:underline">
                {selectedLugar.instagram}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-stretch gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0">
        {userGpsLocation && (
          <div className="text-center text-[11px] text-cranberry-600 font-semibold bg-cranberry-50 rounded-xl py-1.5 px-3 flex items-center justify-center gap-1.5 border border-cranberry-100">
            <Navigation2 className="w-3 h-3 text-cranberry-500" />
            {haversineKm(userGpsLocation.lat, userGpsLocation.lng, selectedLugar.lat, selectedLugar.lng).toFixed(1)} km
          </div>
        )}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${selectedLugar.lat},${selectedLugar.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#D41367] hover:bg-[#C1115E] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer no-underline text-center"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Ver en Google Maps</span>
        </a>
        <button
          onClick={() => onShare(selectedLugar)}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#fbe7f0] text-[#D41367] border border-[#D41367] font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartir</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(selectedLugar)}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm cursor-pointer border border-slate-200"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button
            onClick={() => onDelete(selectedLugar.id, selectedLugar.nombre)}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
