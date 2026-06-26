import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { Lugar } from '../../types';

interface PasswordModalProps {
  open: boolean;
  action: { type: 'edit' | 'delete'; lugar: Lugar } | null;
  passwordInput: string;
  onPasswordChange: (value: string) => void;
  onVerify: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function PasswordModal({
  open,
  action,
  passwordInput,
  onPasswordChange,
  onVerify,
  onClose,
}: PasswordModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 transition-all p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
                  Confirmación Requerida
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Introduce la contraseña para continuar
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Para poder {action?.type === 'edit' ? 'modificar' : 'eliminar'} el punto de acopio{' '}
              <strong>{action?.lugar.nombre}</strong>, debes validar su contraseña de seguridad.
            </p>

            <form onSubmit={onVerify} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">
                  Contraseña del Punto
                </label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={passwordInput}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800 dark:text-slate-100"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all cursor-pointer text-center py-3"
                >
                  Verificar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
