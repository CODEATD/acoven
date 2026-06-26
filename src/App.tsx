/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Sparkles,
  Loader2,
  Database,
  Lock,
} from 'lucide-react';

import { Lugar, ESTADOS_VENEZUELA, TIPOS_ACOPIO } from './types';
import MapaInteractivo from './components/MapaInteractivo';
import { useLugares } from './hooks/useLugares';
import { hashPassword, isSHA256 } from './lib/crypto';

export default function App() {
  // --- SUPABASE DATA HOOK ---
  const { lugares, loading, error, addLugar, updateLugar, deleteLugar } = useLugares();

  // --- STATE ---
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null);
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [submitting, setSubmitting] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form States
  const [formNombre, setFormNombre] = useState('');
  const [formEstado, setFormEstado] = useState('Distrito Capital');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formDireccion, setFormDireccion] = useState('');
  const [formContacto, setFormContacto] = useState('');
  const [formTipoAcopio, setFormTipoAcopio] = useState('Múltiple (De todo)');
  const [formEstadoOperativo, setFormEstadoOperativo] = useState<'activo' | 'saturado' | 'inactivo'>('activo');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Password Verification Modal States
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<{ type: 'edit' | 'delete'; lugar: Lugar } | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // UI notifications
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

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

  // --- PASSWORD VERIFICATION ACTIONS ---
  const requestPasswordVerification = (lugar: Lugar, type: 'edit' | 'delete') => {
    if (!lugar.password) {
      // Si el punto no tiene contraseña (heredado), proceder directamente
      if (type === 'edit') {
        handleStartEdit(lugar);
      } else {
        proceedDelete(lugar.id, lugar.nombre);
      }
      return;
    }

    setPasswordAction({ type, lugar });
    setPasswordInput('');
    setPasswordModalOpen(true);
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordAction) return;

    const storedPassword = passwordAction.lugar.password;
    let isMatch = false;

    if (storedPassword) {
      if (isSHA256(storedPassword)) {
        const inputHash = await hashPassword(passwordInput.trim());
        isMatch = inputHash === storedPassword;
      } else {
        // Retrocompatibilidad con contraseñas antiguas guardadas en texto plano
        isMatch = passwordInput.trim() === storedPassword;
      }
    }

    if (isMatch) {
      const { type, lugar } = passwordAction;
      setPasswordModalOpen(false);
      setPasswordAction(null);
      if (type === 'edit') {
        handleStartEdit(lugar);
        showNotification('Contraseña correcta. Ya puedes editar el punto.', 'success');
      } else {
        proceedDelete(lugar.id, lugar.nombre);
      }
    } else {
      showNotification('Contraseña incorrecta. Inténtalo de nuevo.', 'error');
    }
  };

  const proceedDelete = async (id: string, name: string) => {
    try {
      await deleteLugar(id);
      if (selectedLugar?.id === id) {
        setSelectedLugar(null);
      }
      showNotification(`Punto de acopio "${name}" eliminado correctamente.`, 'info');
    } catch (err) {
      showNotification('Error al eliminar el punto. Inténtalo de nuevo.', 'error');
    }
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
    setFormPassword(''); // Se limpia para que el usuario pueda dejarlo vacío (no cambiar) o escribir uno nuevo

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
    setFormEstado('Distrito Capital');
    setFormDescripcion('');
    setFormDireccion('');
    setFormContacto('');
    setFormTipoAcopio('Múltiple (De todo)');
    setFormEstadoOperativo('activo');
    setFormLat('');
    setFormLng('');
    setTempCoords(null);
    setFormPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setSubmitting(true);
    try {
      if (editingId) {
        const lugarActual = lugares.find(l => l.id === editingId);
        let finalPassword = lugarActual?.password;
        if (formPassword.trim()) {
          finalPassword = await hashPassword(formPassword.trim());
        }

        await updateLugar(editingId, {
          nombre: formNombre.trim(),
          estado: formEstado,
          descripcion: formDescripcion.trim(),
          direccion: formDireccion.trim(),
          contacto: formContacto.trim() || undefined,
          tipoAcopio: formTipoAcopio,
          estadoOperativo: formEstadoOperativo,
          lat: latitude,
          lng: longitude,
          password: finalPassword,
        });
        setEditingId(null);
        showNotification('¡Punto de acopio actualizado correctamente!', 'success');
      } else {
        if (!formPassword.trim()) {
          showNotification('Es obligatorio ingresar una contraseña para proteger el punto.', 'error');
          setSubmitting(false);
          return;
        }
        const hashedPassword = await hashPassword(formPassword.trim());
        const nuevo = await addLugar({
          nombre: formNombre.trim(),
          estado: formEstado,
          descripcion: formDescripcion.trim(),
          direccion: formDireccion.trim(),
          contacto: formContacto.trim() || undefined,
          tipoAcopio: formTipoAcopio,
          estadoOperativo: formEstadoOperativo,
          lat: latitude,
          lng: longitude,
          password: hashedPassword,
        });
        if (nuevo) setSelectedLugar(nuevo);
        showNotification('¡Nuevo punto de acopio registrado con éxito!', 'success');
      }
      resetForm();
    } catch (err) {
      showNotification('Error al guardar el punto. Inténtalo de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const lugar = lugares.find((l) => l.id === id);
    if (!lugar) return;

    if (confirm(`¿Estás seguro de que deseas eliminar el punto de acopio "${name}"?`)) {
      requestPasswordVerification(lugar, 'delete');
    }
  };

  // --- EXPORT DATA (solo lectura desde Supabase) ---
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

      {/* Loading overlay durante carga inicial */}
      {loading && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-700/20">
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-slate-900 font-bold text-base">Conectando con Supabase...</p>
              <p className="text-slate-400 text-xs mt-1">Cargando puntos de acopio</p>
            </div>
          </div>
        </div>
      )}

      {/* Banner de error de conexion */}
      {error && !loading && (
        <div className="bg-rose-50 border-b-2 border-rose-200 px-4 py-2.5 text-xs text-rose-800 flex items-center justify-center gap-2">
          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span><strong>Error de conexión:</strong> {error}. Verifica tu VITE_SUPABASE_URL en el archivo .env</span>
        </div>
      )}

      {/* Elegante barra tricolor de Venezuela en el tope */}
      <div className="h-1.5 w-full bg-linear-to-r from-yellow-400 via-blue-600 to-red-600 shrink-0"></div>

      {/* 1. Header Navigation - Bento Theme */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-200 gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-700/10">
            <Heart className="h-5 w-5 text-white fill-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Busca <span className="text-blue-700">Acopio</span>
              <span className="text-[9px] bg-yellow-400 text-blue-900 font-extrabold px-2 py-0.5 rounded-full ml-2 align-middle border border-yellow-500/20 shadow-sm">VENEZUELA</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Plataforma Colaborativa de Registro
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center text-xs md:text-sm font-medium text-slate-500">
          <span className="hidden sm:inline">Venezuela • Colaborativo</span>
          <span className="h-4 w-px bg-slate-200 hidden sm:inline"></span>
          <span className="text-blue-700 font-bold">{activos} Centros Activos</span>
          <span className="h-4 w-px bg-slate-200"></span>

          {/* Supabase indicator + Export */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Supabase</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            </div>
            <button
              onClick={handleExportData}
              title="Respaldar todo en JSON"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer border border-slate-200/50"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Exportar</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Welcome Banner Info Row */}
      <div className="bg-blue-50 border-b border-blue-100/80 px-6 py-3 text-xs text-blue-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>¿Quieres registrar un centro?</strong> Llena el formulario a la izquierda, o <strong>haz clic en cualquier lugar del mapa</strong> para capturar coordenadas geográficas al instante.
            </span>
          </div>
          <div className="bg-blue-700/15 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] shrink-0 uppercase tracking-wider">
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
                  ? '#1d4ed8'
                  : notification.type === 'error'
                    ? '#f43f5e'
                    : '#3b82f6',
            }}
          >
            <div
              className={`p-1.5 rounded-xl text-white ${notification.type === 'success'
                ? 'bg-blue-600'
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

      {/* Password Verification Modal */}
      <AnimatePresence>
        {passwordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 w-full max-w-md p-6 rounded-3xl shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setPasswordModalOpen(false);
                  setPasswordAction(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg">
                    Confirmación Requerida
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Introduce la contraseña para continuar
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Para poder {passwordAction?.type === 'edit' ? 'modificar' : 'eliminar'} el punto de acopio <strong>{passwordAction?.lugar.nombre}</strong>, debes validar su contraseña de seguridad.
              </p>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Contraseña del Punto
                  </label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordModalOpen(false);
                      setPasswordAction(null);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center animate-none"
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
              <div className="w-2 h-6 bg-blue-700 rounded-full"></div>
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
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-700"
                    required
                  >
                    {ESTADOS_VENEZUELA.map((est) => (
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-700"
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
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800 resize-none leading-relaxed"
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
                  placeholder="Ej. Calle Principal, frente a la Plaza Bolívar"
                  value={formDireccion}
                  onChange={(e) => setFormDireccion(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800"
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
                    placeholder="Ej. 0212 1234567"
                    value={formContacto}
                    onChange={(e) => setFormContacto(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-700"
                    required
                  >
                    <option value="activo">🟢 Abierto</option>
                    <option value="saturado">🟡 Saturado</option>
                    <option value="inactivo">🔴 Cerrado</option>
                  </select>
                </div>
              </div>

              {/* Password de seguridad */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Contraseña del Punto *
                </label>
                <input
                  type="password"
                  placeholder={editingId ? "Dejar vacío para no cambiar" : "Contraseña de edición/borrado"}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-800"
                  required={!editingId}
                />
              </div>

              {/* Coordinates block */}
              <div className="bg-slate-50/60 p-3.5 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Coordenadas *</span>
                  <span className="text-blue-700">Tip: Haz clic en el mapa</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitud (Ej. 10.5)"
                      value={formLat}
                      onChange={(e) => {
                        setFormLat(e.target.value);
                        if (e.target.value && formLng) {
                          setTempCoords({ lat: parseFloat(e.target.value), lng: parseFloat(formLng) });
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-700 font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitud (Ej. -66.9)"
                      value={formLng}
                      onChange={(e) => {
                        setFormLng(e.target.value);
                        if (formLat && e.target.value) {
                          setTempCoords({ lat: parseFloat(formLat), lng: parseFloat(e.target.value) });
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-700 font-semibold"
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

          {/* Quick instructions panel - User Guide */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-2 h-6 bg-blue-700 rounded-full"></div>
              <h2 className="font-extrabold text-slate-800 text-sm tracking-tight">Guía de Uso para el Usuario</h2>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              {/* Paso 1 */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5">1. Registro de Ubicación</h4>
                  <p className="text-slate-500">
                    Puedes escribir las coordenadas manualmente o simplemente <strong>hacer clic en cualquier parte del mapa</strong> para capturarlas automáticamente.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5">2. Seguridad por Contraseña</h4>
                  <p className="text-slate-500">
                    Cada punto se registra con una contraseña secreta. Deberás ingresarla obligatoriamente si deseas <strong>editar</strong> o <strong>eliminar</strong> el punto en el futuro.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Database className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5">3. Sincronización en Tiempo Real</h4>
                  <p className="text-slate-500">
                    Los datos se guardan en la nube (Supabase). Cualquier cambio que hagas se reflejará <strong>inmediatamente</strong> a todos los usuarios del mapa.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                  <Info className="w-3.5 h-3.5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5">4. Navegación Externa</h4>
                  <p className="text-slate-500">
                    Utiliza el botón <strong>"Ver en Google Maps"</strong> para abrir las coordenadas en tu GPS y planificar rutas de despacho o entrega al instante.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: Interactive Map & Filters & List Grid (col-span-8) */}
        <section className="lg:col-span-8 flex flex-col gap-6">

          {/* Mobile responsive tab toggle for List vs Map view */}
          <div className="flex lg:hidden bg-slate-200/60 p-1.5 rounded-2xl w-full border border-slate-200">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'map'
                ? 'bg-white text-blue-800 shadow-md scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Map className="w-4 h-4" />
              <span>Ver Mapa Interactivo</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'list'
                ? 'bg-white text-blue-800 shadow-md scale-[1.02]'
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
                    <span className="text-[10px] bg-slate-800 text-yellow-400 font-bold px-2 py-0.5 rounded-md">
                      {selectedLugar.estado}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${selectedLugar.estadoOperativo === 'activo'
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
                    onClick={() => requestPasswordVerification(selectedLugar, 'edit')}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedLugar.id, selectedLugar.nombre)}
                    className="flex-1 flex items-center justify-center gap-2 bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer border border-rose-800/40"
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
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold"
                />
              </div>

              {/* State filter */}
              <div>
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-600"
                >
                  <option value="">Todos los Estados</option>
                  {ESTADOS_VENEZUELA.map((est) => (
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-600"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all font-semibold text-slate-600"
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
                <div className="w-2 h-6 bg-blue-700 rounded-full"></div>
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
                    bgClass = "bg-blue-50 border-blue-300 ring-1 ring-blue-300";
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
                            className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${lugar.estadoOperativo === 'activo'
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
                            className="font-bold text-slate-800 text-sm leading-tight hover:text-blue-700 cursor-pointer"
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
                          className="flex-1 text-[11px] font-bold bg-white hover:bg-blue-700 hover:text-white text-slate-700 transition-all rounded-lg py-1.5 px-2 border border-slate-200 cursor-pointer text-center shadow-sm"
                        >
                          Mapa
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${lugar.lat},${lugar.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-[11px] font-bold bg-white hover:bg-blue-50 text-blue-700 transition-all rounded-lg py-1.5 px-2 border border-blue-200 cursor-pointer text-center shadow-sm no-underline flex items-center justify-center gap-1"
                        >
                          <Map className="w-3.5 h-3.5" />
                          <span>Google Maps</span>
                        </a>
                        <button
                          onClick={() => requestPasswordVerification(lugar, 'edit')}
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
        <span>Busca Acopio v1.0.4 - VE</span>
        <span>Offline Ready • Local Storage Active</span>
        <span className="text-blue-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
          System Operational
        </span>
      </footer>

    </div>
  );
}
