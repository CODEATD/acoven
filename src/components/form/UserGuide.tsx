import React from 'react';
import { MapPin, Lock, Database, Info } from 'lucide-react';

export default function UserGuide() {
  const steps = [
    {
      icon: <MapPin className="w-3.5 h-3.5 text-cranberry-700 dark:text-cranberry-400" />,
      iconBg: 'bg-cranberry-50 dark:bg-cranberry-950/30 border-cranberry-100 dark:border-cranberry-900/20',
      title: '1. Registro de Ubicación',
      desc: (
        <>
          Puedes escribir las coordenadas manualmente o simplemente{' '}
          <strong>hacer clic en cualquier parte del mapa</strong> para capturarlas automáticamente.
        </>
      ),
    },
    {
      icon: <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />,
      iconBg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/20',
      title: '2. Seguridad por Contraseña',
      desc: (
        <>
          Cada punto se registra con una contraseña secreta. Deberás ingresarla obligatoriamente si deseas{' '}
          <strong>editar</strong> o <strong>eliminar</strong> el punto en el futuro.
        </>
      ),
    },
    {
      icon: <Database className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/20',
      title: '3. Sincronización en Tiempo Real',
      desc: (
        <>
          Los datos se guardan en la nube (Supabase). Cualquier cambio que hagas se reflejará{' '}
          <strong>inmediatamente</strong> a todos los usuarios del mapa.
        </>
      ),
    },
    {
      icon: <Info className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/20',
      title: '4. Navegación Externa',
      desc: (
        <>
          Utiliza el botón <strong>&quot;Ver en Google Maps&quot;</strong> para abrir las coordenadas en tu GPS y
          planificar rutas de despacho o entrega al instante.
        </>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="w-2 h-6 bg-cranberry-700 rounded-full" />
        <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
          Guía de Uso para el Usuario
        </h2>
      </div>

      <div className="space-y-4 text-xs leading-relaxed">
        {steps.map((step) => (
          <div key={step.title} className="flex gap-3 items-start">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${step.iconBg}`}>
              {step.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-0.5">{step.title}</h4>
              <p className="text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
