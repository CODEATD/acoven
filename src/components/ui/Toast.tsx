import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Toast() {
  const { notification } = useAppContext();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-3xl shadow-xl border text-sm max-w-md backdrop-blur-md bg-white/95"
          style={{
            borderColor:
              notification.type === 'success'
                ? '#1d4ed8'
                : notification.type === 'error'
                  ? '#f43f5e'
                  : '#3b82f6',
          }}
        >
          <div
            className={`p-1.5 rounded-xl text-white ${
              notification.type === 'success'
                ? 'bg-cranberry-600'
                : notification.type === 'error'
                  ? 'bg-rose-500'
                  : 'bg-cranberry-500'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : notification.type === 'error' ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </div>
          <p className="font-semibold text-slate-800">{notification.text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
