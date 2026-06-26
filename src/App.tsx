/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Search,
  Plus,
  Edit2,
  Trash2,
  Heart,
  Info,
  Phone,
  Map,
  List,
  Download,
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

import { Lugar, ESTADOS_MEXICO, TIPOS_ACOPIO } from './types';
import { LUGARES_INICIALES, INSTRUCTIONS_TEXT } from './data';
import MapaInteractivo from './components/MapaInteractivo';

export default function App() {
  // --- STATE ---
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null);
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map'); // Primarily for mobile layout responsiveness

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form States
  const [formNombre, setFormNombre] = useState('');
  const [formEstado, setFormEstado] = useState('Ciudad de México');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formDireccion, setFormDireccion] = useState('');
  const [formContacto, setFormContacto] = useState('');
  const [formTipoAcopio, setFormTipoAcopio] = useState('Múltiple (De todo)');
  const [formEstadoOperativo, setFormEstadoOperativo] = useState<'activo' | 'saturado' | 'inactivo'>('activo');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // UI notifications
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // --- INITIAL LOAD & LOCAL STORAGE SYNC ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('busca_acopio_lugares');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLugares(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Error al cargar datos locales:", e);
    }
    // Fallback to beautiful initial samples
    setLugares(LUGARES_INICIALES);
    localStorage.setItem('busca_acopio_lugares', JSON.stringify(LUGARES_INICIALES));
    showNotification('Se cargaron centros de acopio de ejemplo para comenzar.', 'info');
  }, []);

  // Save to localStorage whenever places change
  const saveLugares = (nuevosLugares: Lugar[]) => {
    setLugares(nuevosLugares);
    localStorage.setItem('busca_acopio_lugares', JSON.stringify(nuevosLugares));
  };

  // Helper to show notifications
  const showNotification = (text: string, type: 'success' | 'error' | 'info') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // --- MAP CALLBACKS ---
  const handleSelectCoordsFromMap = (lat: number, lng: number) => {
    setTempCoords({ lat, lng });
    setFormLat(lat.toString());
    setFormLng(lng.toString());
    showNotification(`Coordenadas seleccionadas: ${lat}, ${lng}`, 'info');
  };

  const handleSelectLugarFromMap = (lugar: Lugar) => {
    setSelectedLugar(lugar);
  };

  // --- FORM CRUD ACTIONS ---

  // Fill form for editing
  const handleStartEdit = (lugar: Lugar) => {
    setEditingId(lugar.id);
    setFormNombre(lugar.nombre);
    setFormEstado(lugar.estado);
    setFormDescripcion(lugar.descripcion);
    setFormDireccion(lugar.direccion);
    setFormContacto(lugar.contacto || '');
    setFormTipoAcopio(lugar.tipoAcopio);
    setFormEstadoOperativo(lugar.estadoOperativo);
    setFormLat(lugar.lat.toString());
    setFormLng(lugar.lng.toString());
    setTempCoords({ lat: lugar.lat, lng: lugar.lng });
    setSelectedLugar(lugar);

    // Smooth scroll to form container on mobile
    const formElement = document.getElementById('registro-formulario-seccion');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormNombre('');
    setFormEstado('Ciudad de México');
    setFormDescripcion('');
    setFormDireccion('');
    setFormContacto('');
    setFormTipoAcopio('Múltiple (De todo)');
    setFormEstadoOperativo('activo');
    setFormLat('');
    setFormLng('');
    setTempCoords(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formNombre.trim()) {
      showNotification('El nombre del punto de acopio es obligatorio.', 'error');
      return;
    }
    if (!formEstado) {
      showNotification('Por favor, selecciona un estado.', 'error');
      return;
    }
    if (!formDescripcion.trim()) {
      showNotification('Por favor, añade una descripción detallada.', 'error');
      return;
    }
    if (!formDireccion.trim()) {
      showNotification('La dirección o referencia física es obligatoria.', 'error');
      return;
    }

    const latitude = parseFloat(formLat);
    const longitude = parseFloat(formLng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      showNotification('La latitud debe ser un número válido entre -90 y 90.', 'error');
      return;
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      showNotification('La longitud debe ser un número válido entre -180 y 180.', 'error');
      return;
    }

    if (editingId) {
      // Edit existing
      const actualizados = lugares.map((lug) => {
        if (lug.id === editingId) {
          return {
            ...lug,
            nombre: formNombre.trim(),
            estado: formEstado,
            descripcion: formDescripcion.trim(),
            direccion: formDireccion.trim(),
            contacto: formContacto.trim() || undefined,
            tipoAcopio: formTipoAcopio,
            estadoOperativo: formEstadoOperativo,
            lat: latitude,
            lng: longitude,
          };
        }
        return lug;
      });
      saveLugares(actualizados);
      setEditingId(null);
      showNotification('¡Punto de acopio actualizado correctamente!', 'success');
    } else {
      // Create new
      const nuevoLugar: Lugar = {
        id: `lugar-${Date.now()}`,
        nombre: formNombre.trim(),
        estado: formEstado,
        descripcion: formDescripcion.trim(),
        direccion: formDireccion.trim(),
        contacto: formContacto.trim() || undefined,
        tipoAcopio: formTipoAcopio,
        estadoOperativo: formEstadoOperativo,
        lat: latitude,
        lng: longitude,
        createdAt: new Date().toISOString(),
      };
      const actualizados = [nuevoLugar, ...lugares];
      saveLugares(actualizados);
      setSelectedLugar(nuevoLugar); // focus on map
      showNotification('¡Nuevo punto de acopio registrado con éxito!', 'success');
    }

    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el punto de acopio "${name}"?`)) {
      const filtrados = lugares.filter((lugar) => lugar.id !== id);
      saveLugares(filtrados);
      if (selectedLugar?.id === id) {
        setSelectedLugar(null);
      }
      showNotification('Punto de acopio eliminado correctamente.', 'info');
    }
  };

  // --- IMPORT / EXPORT DATA ---
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(lugares, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `busca_acopio_respaldo_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('Datos exportados exitosamente como JSON.', 'success');
    } catch (e) {
      showNotification('Error al exportar los datos.', 'error');
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Quick schema structural validation
          const isValid = parsed.every(
            (item) =>
              typeof item.nombre === 'string' &&
              typeof item.estado === 'string' &&
              typeof item.descripcion === 'string' &&
              typeof item.lat === 'number' &&
              typeof item.lng === 'number'
          );

          if (isValid) {
            // Merge or replace
            if (confirm('¿Deseas reemplazar tu lista actual de acopios con el archivo importado?')) {
              saveLugares(parsed);
              showNotification('Centros de acopio importados exitosamente.', 'success');
            }
          } else {
            showNotification('El formato del archivo no coincide con un respaldo válido.', 'error');
          }
        } else {
          showNotification('El archivo debe contener una lista de puntos de acopio.', 'error');
        }
      } catch (err) {
        showNotification('Error al leer el archivo JSON. Asegúrate de que es un archivo válido.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToFactory = () => {
    if (confirm('¿Deseas restablecer la base de datos a los puntos de acopio de ejemplo? Perderás los cambios no respaldados.')) {
      saveLugares(LUGARES_INICIALES);
      setSelectedLugar(null);
      resetForm();
      showNotification('Restablecido a puntos de acopio iniciales.', 'info');
    }
  };

  // --- FILTERING LOGIC ---
  const filteredLugares = lugares.filter((lugar) => {
    const matchesSearch =
      lugar.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lugar.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lugar.direccion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEstado = estadoFilter ? lugar.estado === estadoFilter : true;
    const matchesTipo = tipoFilter ? lugar.tipoAcopio === tipoFilter : true;
    const matchesStatus = statusFilter ? lugar.estadoOperativo === statusFilter : true;

    return matchesSearch && matchesEstado && matchesTipo && matchesStatus;
  });

  // --- STATS ---
  const totalAcopios = lugares.length;
  const activos = lugares.filter((l) => l.estadoOperativo === 'activo').length;
  const saturados = lugares.filter((l) => l.estadoOperativo === 'saturado').length;
  const inactivos = lugares.filter((l) => l.estadoOperativo === 'inactivo').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Header Navigation - Bento Theme */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-200 gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/10">
            <Heart className="h-5 w-5 text-white fill-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Busca <span className="text-emerald-600">Acopio</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Plataforma Colaborativa de Registro
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center text-xs md:text-sm font-medium text-slate-500">
          <span className="hidden sm:inline">América Latina • Colaborativo</span>
          <span className="h-4 w-px bg-slate-200 hidden sm:inline"></span>
          <span className="text-emerald-600 font-bold">{activos} Centros Activos</span>
          <span className="h-4 w-px bg-slate-200"></span>
          
          {/* Backup Action Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              title="Respaldar todo en JSON"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer border border-slate-200/50"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Exportar</span>
            </button>
            <label className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer border border-slate-200/50">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Importar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            <button
              onClick={handleResetToFactory}
              title="Restablecer"
              className="flex items-center justify-center bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all rounded-lg p-1.5 cursor-pointer border border-slate-200/50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Welcome Banner Info Row */}
      <div className="bg-emerald-50 border-b border-emerald-100/80 px-6 py-3 text-xs text-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>¿Quieres registrar un centro?</strong> Llena el formulario a la izquierda, o <strong>haz clic en cualquier lugar del mapa</strong> para capturar coordenadas geográficas al instante.
            </span>
          </div>
          <div className="bg-emerald-600/15 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] shrink-0 uppercase tracking-wider">
            {lugares.length} Puntos Registrados
          </div>
        </div>
      </div>

      {/* 3. Global Stats Bento Panel */}
      <section className="bg-slate-50/50 py-6 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registrados</p>
              <h3 className="text-xl font-extrabold text-slate-800">{totalAcopios}</h3>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/80">Abiertos / Activos</p>
              <h3 className="text-xl font-extrabold text-slate-800">{activos}</h3>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600/80">Saturados</p>
              <h3 className="text-xl font-extrabold text-slate-800">{saturados}</h3>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600/80">Cerrados / Inactivos</p>
              <h3 className="text-xl font-extrabold text-slate-800">{inactivos}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Toast */}
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
                  ? '#10b981'
                  : notification.type === 'error'
                  ? '#f43f5e'
                  : '#3b82f6',
            }}
          >
            <div
              className={`p-1.5 rounded-xl text-white ${
                notification.type === 'success'
                  ? 'bg-emerald-500'
                  : notification.type === 'error'
                  ? 'bg-rose-500'
                  : 'bg-blue-500'
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

      {/* 4. Main Bento Grid */}
      <main className="max-w-7xl mx-auto p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full overflow-hidden">
        
        {/* LEFT COLUMN: Form & Information Bento Stack (col-span-4) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Form Card */}
          <div id="registro-formulario-seccion" className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col relative transition-all hover:shadow-md">
            {editingId && (
              <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 font-bold text-[9px] uppercase py-1 px-2.5 rounded-full shadow-sm animate-pulse">
                Modo Edición
              </div>
            )}

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">
                  {editingId ? 'Editar Centro de Acopio' : 'Registrar Nuevo Punto'}
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">Llene la información para ubicar el centro</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Nombre del Centro *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Centro de Acopio Cruz Roja"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* State dropdown */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Estado *
                  </label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-700"
                    required
                  >
                    {ESTADOS_MEXICO.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type of Acopio */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Tipo de Acopio *
                  </label>
                  <select
                    value={formTipoAcopio}
                    onChange={(e) => setFormTipoAcopio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-700"
                    required
                  >
                    {TIPOS_ACOPIO.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Descripción / Artículos aceptados *
                </label>
                <textarea
                  placeholder="Ej. Víveres no perecederos, pañales y agua embotellada. Abierto de 9 AM a 6 PM."
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800 resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Physical Address */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Dirección o Referencia Física *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Calle Juárez 105, frente a Plaza Central"
                  value={formDireccion}
                  onChange={(e) => setFormDireccion(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Contact (Optional) */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 55 1234 5678"
                    value={formContacto}
                    onChange={(e) => setFormContacto(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                  />
                </div>

                {/* Operating Status */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Estado Operativo
                  </label>
                  <select
                    value={formEstadoOperativo}
                    onChange={(e) => setFormEstadoOperativo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-700"
                    required
                  >
                    <option value="activo">🟢 Abierto</option>
                    <option value="saturado">🟡 Saturado</option>
                    <option value="inactivo">🔴 Cerrado</option>
                  </select>
                </div>
              </div>

              {/* Coordinates block */}
              <div className="bg-slate-50/60 p-3.5 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Coordenadas *</span>
                  <span className="text-emerald-600">Tip: Haz clic en el mapa</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitud (Ej. 19.42)"
                      value={formLat}
                      onChange={(e) => {
                        setFormLat(e.target.value);
                        if (e.target.value && formLng) {
                          setTempCoords({ lat: parseFloat(e.target.value), lng: parseFloat(formLng) });
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500/30 outline-none text-slate-700 font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitud (Ej. -99.16)"
                      value={formLng}
                      onChange={(e) => {
                        setFormLng(e.target.value);
                        if (formLat && e.target.value) {
                          setTempCoords({ lat: parseFloat(formLat), lng: parseFloat(e.target.value) });
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500/30 outline-none text-slate-700 font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2.5 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300/40 transition-all cursor-pointer text-center py-3 flex items-center justify-center gap-1.5"
                >
                  {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{editingId ? 'Guardar Cambios' : 'Guardar Ubicación'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick instructions panel */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-teal-400 rounded-full"></div>
              <h2 className="font-bold text-emerald-400 text-sm">Guía de Uso Rápido</h2>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                <strong>1. Marca en el Mapa:</strong> Busca la zona en el mapa interactivo y haz un clic rápido sobre el punto geográfico para autocompletar la latitud y longitud.
              </p>
              <p>
                <strong>2. Estado Operativo:</strong> Si un centro se llena de suministros, cámbialo a "Saturado" para informar a otros ciudadanos y optimizar los recursos.
              </p>
              <p>
                <strong>3. Almacenamiento Local:</strong> La información se guarda de forma segura en su navegador (<code className="bg-slate-800 px-1 py-0.5 rounded text-teal-300">localStorage</code>). Puedes exportar copias de respaldo en JSON.
              </p>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: Interactive Map & Filters & List Grid (col-span-8) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Mobile responsive tab toggle for List vs Map view */}
          <div className="flex lg:hidden bg-slate-200/60 p-1.5 rounded-2xl w-full border border-slate-200">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-emerald-800 shadow-md scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Ver Mapa Interactivo</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-white text-emerald-800 shadow-md scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Ver Listado ({filteredLugares.length})</span>
            </button>
          </div>

          {/* Interactive Map Bento Card */}
          <div className={`${activeTab === 'map' ? 'flex' : 'hidden lg:flex'} bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md`}>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">Mapa de Distribución</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Visualización de puntos geográficos con Leaflet</p>
                </div>
              </div>
              {selectedLugar && (
                <button
                  onClick={() => setSelectedLugar(null)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  Restablecer Enfoque
                </button>
              )}
            </div>

            <div className="h-[400px] md:h-[460px] relative rounded-2xl overflow-hidden">
              <MapaInteractivo
                lugares={filteredLugares}
                selectedLugar={selectedLugar}
                tempCoords={tempCoords}
                onSelectCoords={handleSelectCoordsFromMap}
                onSelectLugarFromMap={handleSelectLugarFromMap}
              />
            </div>

            {/* Selected Point Details Panel Overlay */}
            {selectedLugar && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4 mt-2"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] bg-slate-800 text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                      {selectedLugar.estado}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        selectedLugar.estadoOperativo === 'activo'
                          ? 'bg-emerald-500 text-white shadow-sm'
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

                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0">
                  <button
                    onClick={() => handleStartEdit(selectedLugar)}
                    className="flex-1 sm:w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedLugar.id, selectedLugar.nombre)}
                    className="flex-1 sm:w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-rose-600/30 text-rose-300 hover:text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Search & Filters Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">Filtros de Búsqueda</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Filtre centros por palabra, estado y categoría</p>
                </div>
              </div>
              {(searchQuery || estadoFilter || tipoFilter || statusFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setEstadoFilter('');
                    setTipoFilter('');
                    setStatusFilter('');
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Term */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar ubicación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                />
              </div>

              {/* State filter */}
              <div>
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-600"
                >
                  <option value="">Todos los Estados</option>
                  {ESTADOS_MEXICO.map((est) => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-600"
                >
                  <option value="">Cualquier Categoría</option>
                  {TIPOS_ACOPIO.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-600"
                >
                  <option value="">Todos los Estados Operativos</option>
                  <option value="activo">Abierto</option>
                  <option value="saturado">Saturado</option>
                  <option value="inactivo">Cerrado / Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* List Card / Results Grid */}
          <div className={`${activeTab === 'list' ? 'flex' : 'hidden lg:flex'} bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex-col gap-4 transition-all hover:shadow-md`}>
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-6 bg-cyan-500 rounded-full"></div>
                <div>
                  <h2 className="font-bold text-slate-700 text-base">Lugares Registrados</h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Mostrando {filteredLugares.length} de {lugares.length} acopios
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-[9px] font-bold rounded text-slate-500 uppercase tracking-wider">
                Respaldo Local Activo
              </span>
            </div>

            {filteredLugares.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No se encontraron acopios</p>
                <p className="text-xs text-slate-400">Intenta modificando los filtros de búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {filteredLugares.map((lugar) => {
                  const isSelected = selectedLugar?.id === lugar.id;
                  let bgClass = "bg-slate-50 border-slate-200";
                  if (isSelected) {
                    bgClass = "bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300";
                  }

                  return (
                    <motion.div
                      key={lugar.id}
                      layoutId={`lugar-card-bento-${lugar.id}`}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${bgClass}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-white border border-slate-200 text-slate-600 rounded">
                            {lugar.estado}
                          </span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${
                              lugar.estadoOperativo === 'activo'
                                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                                : lugar.estadoOperativo === 'saturado'
                                ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                                : 'bg-rose-500 shadow-sm'
                            }`}
                            title={lugar.estadoOperativo}
                          ></span>
                        </div>

                        <div>
                          <h4
                            className="font-bold text-slate-800 text-sm leading-tight hover:text-emerald-600 cursor-pointer"
                            onClick={() => {
                              setSelectedLugar(lugar);
                              if (window.innerWidth < 1024) {
                                setActiveTab('map');
                              }
                            }}
                          >
                            {lugar.nombre}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                            {lugar.tipoAcopio}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {lugar.descripcion}
                        </p>

                        <div className="text-[11px] text-slate-400 space-y-1 pt-1.5 border-t border-slate-200/50">
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{lugar.direccion}</span>
                          </div>
                          {lugar.contacto && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{lugar.contacto}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-200/50">
                        <button
                          onClick={() => {
                            setSelectedLugar(lugar);
                            if (window.innerWidth < 1024) {
                              setActiveTab('map');
                            }
                          }}
                          className="flex-grow text-[11px] font-bold bg-white hover:bg-emerald-600 hover:text-white text-slate-700 transition-all rounded-lg py-1.5 px-2 border border-slate-200 cursor-pointer text-center shadow-sm"
                        >
                          Ver en mapa
                        </button>
                        <button
                          onClick={() => handleStartEdit(lugar)}
                          className="text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-500 rounded-lg p-1.5 border border-slate-200 cursor-pointer shadow-sm"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lugar.id, lugar.nombre)}
                          className="text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg p-1.5 border border-rose-100 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* 5. Status Footer - Bento Theme */}
      <footer className="px-6 py-3 bg-slate-900 text-slate-400 text-[10px] uppercase tracking-[0.2em] flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-slate-800 shrink-0">
        <span>Busca Acopio v1.0.4</span>
        <span>Offline Ready • Local Storage Active</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          System Operational
        </span>
      </footer>

    </div>
  );
}
