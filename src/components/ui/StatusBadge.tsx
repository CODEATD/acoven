import React from 'react';

interface StatusBadgeProps {
  status: 'activo' | 'saturado' | 'inactivo';
  variant?: 'dot' | 'pill';
}

const labels: Record<string, string> = {
  activo: 'Recibiendo',
  saturado: 'Saturado',
  inactivo: 'Inactivo',
};

export default function StatusBadge({ status, variant = 'pill' }: StatusBadgeProps) {
  if (variant === 'dot') {
    const dotClass =
      status === 'activo'
        ? 'bg-cranberry-600 shadow-sm shadow-cranberry-500/50'
        : status === 'saturado'
          ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
          : 'bg-rose-500 shadow-sm';
    return <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${dotClass}`} title={status} />;
  }

  const pillClass =
    status === 'activo'
      ? 'bg-cranberry-600 text-white shadow-sm'
      : status === 'saturado'
        ? 'bg-amber-500 text-slate-900 shadow-sm'
        : 'bg-rose-500 text-white';

  return (
    <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${pillClass}`}>
      {labels[status]}
    </span>
  );
}
