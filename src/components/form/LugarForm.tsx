import React from 'react';
import { Plus, Edit2, Loader2 } from 'lucide-react';
import { ESTADOS_VENEZUELA, TIPOS_ACOPIO } from '../../types';
import { FormState } from '../../hooks/useForm';
import DireccionField from './DireccionField';

interface LugarFormProps {
  form: FormState;
  editingId: string | null;
  submitting: boolean;
  geocodingLoading: boolean;
  onFieldChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onCoordChange: (lat: string, lng: string) => void;
  onGeocode: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export default function LugarForm({
  form,
  editingId,
  submitting,
  geocodingLoading,
  onFieldChange,
  onCoordChange,
  onGeocode,
  onSubmit,
  onCancelEdit,
}: LugarFormProps) {
  const inputClass =
    'w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800 dark:text-slate-100';
  const selectClass =
    'w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-700 dark:text-slate-350';
  const labelClass =
    'text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 block';

  return (
    <div
      id="registro-formulario-seccion"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col relative transition-all hover:shadow-md"
    >
      {editingId && (
        <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 font-bold text-[9px] uppercase py-1 px-2.5 rounded-full shadow-sm animate-pulse">
          Modo Edición
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-2 h-6 bg-blue-700 rounded-full" />
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            {editingId ? 'Editar Centro de Acopio' : 'Registrar Nuevo Punto'}
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Llene la información para ubicar el centro
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
        <div>
          <label className={labelClass}>Nombre del Centro *</label>
          <input
            type="text"
            placeholder="Ej. Centro de Acopio Cruz Roja"
            value={form.nombre}
            onChange={(e) => onFieldChange('nombre', e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Estado *</label>
            <select
              value={form.estado}
              onChange={(e) => onFieldChange('estado', e.target.value)}
              className={selectClass}
              required
            >
              {ESTADOS_VENEZUELA.map((est) => (
                <option key={est} value={est} className="dark:bg-slate-800 dark:text-slate-100">
                  {est}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Tipo de Acopio *</label>
            <select
              value={form.tipoAcopio}
              onChange={(e) => onFieldChange('tipoAcopio', e.target.value)}
              className={selectClass}
              required
            >
              {TIPOS_ACOPIO.map((t) => (
                <option key={t} value={t} className="dark:bg-slate-800 dark:text-slate-100">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Descripción / Artículos aceptados *</label>
          <textarea
            placeholder="Ej. Víveres no perecederos, pañales y agua embotellada. Abierto de 9 AM a 6 PM."
            value={form.descripcion}
            onChange={(e) => onFieldChange('descripcion', e.target.value)}
            rows={2}
            className={`${inputClass} resize-none leading-relaxed`}
            required
          />
        </div>

        <DireccionField
          value={form.direccion}
          onChange={(v) => onFieldChange('direccion', v)}
          onGeocode={onGeocode}
          loading={geocodingLoading}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Contacto</label>
            <input
              type="text"
              placeholder="Ej. 0212 1234567"
              value={form.contacto}
              onChange={(e) => onFieldChange('contacto', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Estado Operativo</label>
            <select
              value={form.estadoOperativo}
              onChange={(e) => onFieldChange('estadoOperativo', e.target.value as any)}
              className={selectClass}
              required
            >
              <option value="activo" className="dark:bg-slate-800 dark:text-slate-100">🟢 Abierto</option>
              <option value="saturado" className="dark:bg-slate-800 dark:text-slate-100">🟡 Saturado</option>
              <option value="inactivo" className="dark:bg-slate-800 dark:text-slate-100">🔴 Cerrado</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Contraseña del Punto *</label>
          <input
            type="password"
            placeholder={editingId ? 'Dejar vacío para no cambiar' : 'Contraseña de edición/borrado'}
            value={form.password}
            onChange={(e) => onFieldChange('password', e.target.value)}
            className={inputClass}
            required={!editingId}
          />
        </div>

        <div className="bg-slate-50/60 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Coordenadas *</span>
            <span className="text-blue-700 dark:text-blue-400">Tip: Haz clic en el mapa</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="any"
              placeholder="Latitud (Ej. 10.5)"
              value={form.lat}
              onChange={(e) => onCoordChange(e.target.value, form.lng)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-700 dark:text-slate-100 font-semibold"
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Longitud (Ej. -66.9)"
              value={form.lng}
              onChange={(e) => onCoordChange(form.lat, e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-700 dark:text-slate-100 font-semibold"
              required
            />
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300/40 transition-all cursor-pointer text-center py-3 flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingId ? (
              <Edit2 className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{submitting ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Guardar Ubicación'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
