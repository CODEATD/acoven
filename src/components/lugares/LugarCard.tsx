import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Map, Share2, Edit2, Trash2, Navigation2 } from 'lucide-react';
import { Lugar } from '../../types';
import { haversineKm } from '../../utils/haversine';

interface LugarCardProps {
  key?: React.Key;
  lugar: Lugar;
  isSelected: boolean;
  onSelect: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  userGpsLocation: { lat: number; lng: number } | null;
}

export default function LugarCard({
  lugar,
  isSelected,
  onSelect,
  onShare,
  onEdit,
  onDelete,
  userGpsLocation,
}: LugarCardProps) {
  let bgClass =
    "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/60";
  if (isSelected) {
    bgClass = "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 ring-1 ring-blue-300";
  }

  return (
    <motion.div
      layoutId={`lugar-card-bento-${lugar.id}`}
      className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${bgClass}`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-350 rounded">
            {lugar.estado}
          </span>
          <span
            className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${
              lugar.estadoOperativo === 'activo'
                ? 'bg-blue-600 shadow-sm shadow-blue-500/50'
                : lugar.estadoOperativo === 'saturado'
                  ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                  : 'bg-rose-500 shadow-sm'
            }`}
            title={lugar.estadoOperativo}
          ></span>
        </div>

        <div>
          <h4
            className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer"
            onClick={onSelect}
          >
            {lugar.nombre}
          </h4>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
            {lugar.tipoAcopio}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {lugar.descripcion}
        </p>

        <div className="text-[11px] text-slate-400 dark:text-slate-500 space-y-1 pt-1.5 border-t border-slate-200/50 dark:border-slate-800">
          <div className="flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{lugar.direccion}</span>
          </div>
          {lugar.contacto && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{lugar.contacto}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800">
        {userGpsLocation && (
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-2 shrink-0">
            <Navigation2 className="w-3 h-3" />
            {haversineKm(userGpsLocation.lat, userGpsLocation.lng, lugar.lat, lugar.lng).toFixed(1)}km
          </span>
        )}
        <button
          onClick={onSelect}
          className="flex-1 text-[11px] font-bold bg-white dark:bg-slate-900 hover:bg-blue-700 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-300 transition-all rounded-lg py-1.5 px-2 border border-slate-200 dark:border-slate-700 cursor-pointer text-center shadow-sm"
        >
          Mapa
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lugar.lat},${lugar.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-[11px] font-bold bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-700 dark:text-blue-400 transition-all rounded-lg py-1.5 px-2 border border-blue-200 dark:border-blue-800 cursor-pointer text-center shadow-sm no-underline flex items-center justify-center gap-1"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Google Maps</span>
        </a>
        <button
          onClick={onShare}
          className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg p-1.5 border border-emerald-100 dark:border-emerald-900/30 cursor-pointer shadow-sm"
          title="Compartir enlace"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onEdit}
          className="text-[11px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg p-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"
          title="Editar"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="text-[11px] font-bold bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/35 text-rose-600 dark:text-rose-400 rounded-lg p-1.5 border border-rose-100 dark:border-rose-900/30 cursor-pointer"
          title="Eliminar"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
