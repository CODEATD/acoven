/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { MapPin, CheckCircle, AlertTriangle, XCircle, Map, List } from 'lucide-react';

import { useLugares } from './hooks/useLugares';
import { useTheme } from './hooks/useTheme';
import { usePWA } from './hooks/usePWA';
import { useGps } from './hooks/useGps';
import { useFilters } from './hooks/useFilters';
import { useForm } from './hooks/useForm';
import { useGeocoding } from './hooks/useGeocoding';

import { AppProvider, useAppContext } from './context/AppContext';
import { exportLugaresToJson } from './utils/exportData';
import { buildShareUrl, parseIdFromUrl } from './utils/deepLink';
import { hashPassword, isSHA256 } from './lib/crypto';
import { Lugar } from './types';

// Components
import AppHeader from './components/layout/AppHeader';
import WelcomeBanner from './components/layout/WelcomeBanner';
import LoadingOverlay from './components/layout/LoadingOverlay';
import AppFooter from './components/layout/AppFooter';
import StatCard from './components/ui/StatCard';
import Toast from './components/ui/Toast';
import PasswordModal from './components/modals/PasswordModal';
import LugarForm from './components/form/LugarForm';
import UserGuide from './components/form/UserGuide';
import FilterCard from './components/filters/FilterCard';
import MapViewSection from './components/lugares/MapViewSection';
import LugaresList from './components/lugares/LugaresList';

function AppContent() {
  const {
    theme,
    selectedLugar,
    setSelectedLugar,
    activeTab,
    setActiveTab,
    tempCoords,
    setTempCoords,
    userGpsLocation,
    setUserGpsLocation,
    showNotification,
  } = useAppContext();

  const { lugares, loading, error, addLugar, updateLugar, deleteLugar } = useLugares();
  const { showInstallBtn, handleInstallClick } = usePWA();
  const [submitting, setSubmitting] = useState(false);

  // Form State hook
  const { form, setField, editingId, resetForm, populateForEdit } = useForm();

  // Nominatim geocoding hook
  const { geocodingLoading, geocodeDireccion } = useGeocoding();

  // GPS hook
  const {
    sortByDistance,
    setSortByDistance,
    handleUserLocationResolved,
  } = useGps((lat, lng) => {
    setUserGpsLocation({ lat, lng });
    showNotification('📍 Ordenando por distancia a tu ubicación.', 'info');
  });

  // Filters hook
  const {
    searchQuery,
    setSearchQuery,
    estadoFilter,
    setEstadoFilter,
    tipoFilter,
    setTipoFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
    hasActiveFilters,
    filteredLugares,
    statsByEstado,
  } = useFilters(lugares, userGpsLocation, sortByDistance);

  // Password verification states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<{ type: 'edit' | 'delete'; lugar: Lugar } | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  // DEEP LINKING: Read ?id= on mount
  useEffect(() => {
    if (lugares.length === 0) return;
    const idParam = parseIdFromUrl();
    if (idParam) {
      const found = lugares.find((l) => l.id === idParam);
      if (found) {
        setSelectedLugar(found);
        showNotification(`📌 Punto cargado: ${found.nombre}`, 'info');
      }
    }
  }, [lugares, setSelectedLugar]);

  // Share link handler
  const handleShareLugar = (lugar: Lugar) => {
    const url = buildShareUrl(lugar.id);
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showNotification('🔗 Enlace copiado al portapapeles.', 'success');
      })
      .catch(() => {
        showNotification('No se pudo copiar el enlace.', 'error');
      });
  };

  // Physical address search trigger
  const handleGeocodeDireccionClick = () => {
    geocodeDireccion(form.direccion, {
      onSuccess: (lat, lng, label) => {
        setField('lat', lat.toString());
        setField('lng', lng.toString());
        setTempCoords({ lat, lng });
        showNotification(`📍 Coordenadas encontradas para: ${label.split(',')[0]}`, 'success');
      },
      onError: (msg) => {
        showNotification(msg, 'error');
      },
    });
  };

  // Map coordinate clicks callback
  const handleSelectCoordsFromMap = (lat: number, lng: number) => {
    setTempCoords({ lat, lng });
    setField('lat', lat.toString());
    setField('lng', lng.toString());
    showNotification(`Coordenadas seleccionadas: ${lat}, ${lng}`, 'info');
  };

  // Map marker click callback
  const handleSelectLugarFromMap = (lugar: Lugar) => {
    setSelectedLugar(lugar);
  };

  // Request password verification before edit/delete
  const requestPasswordVerification = (lugar: Lugar, type: 'edit' | 'delete') => {
    if (!lugar.password) {
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
      const masterPassword = import.meta.env.VITE_MASTER_PASSWORD;
      if (masterPassword && passwordInput.trim() === masterPassword) {
        isMatch = true;
      } else if (isSHA256(storedPassword)) {
        const inputHash = await hashPassword(passwordInput.trim());
        isMatch = inputHash === storedPassword;
      } else {
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

  const handleStartEdit = (lugar: Lugar) => {
    populateForEdit(lugar);
    setTempCoords({ lat: lugar.lat, lng: lugar.lng });
    // Smooth scroll to form container on mobile
    const formElement = document.getElementById('registro-formulario-seccion');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      showNotification('El nombre del punto de acopio es obligatorio.', 'error');
      return;
    }
    if (!form.estado) {
      showNotification('Por favor, selecciona un estado.', 'error');
      return;
    }
    if (!form.descripcion.trim()) {
      showNotification('Por favor, añade una descripción detallada.', 'error');
      return;
    }
    if (!form.direccion.trim()) {
      showNotification('La dirección o referencia física es obligatoria.', 'error');
      return;
    }

    const latitude = parseFloat(form.lat);
    const longitude = parseFloat(form.lng);

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
        const lugarActual = lugares.find((l) => l.id === editingId);
        let finalPassword = lugarActual?.password;
        if (form.password.trim()) {
          finalPassword = await hashPassword(form.password.trim());
        }

        await updateLugar(editingId, {
          nombre: form.nombre.trim(),
          estado: form.estado,
          descripcion: form.descripcion.trim(),
          direccion: form.direccion.trim(),
          contacto: form.contacto.trim() || undefined,
          tipoAcopio: form.tipoAcopio,
          estadoOperativo: form.estadoOperativo,
          lat: latitude,
          lng: longitude,
          password: finalPassword,
        });
        showNotification('¡Punto de acopio actualizado correctamente!', 'success');
      } else {
        if (!form.password.trim()) {
          showNotification('Es obligatorio ingresar una contraseña para proteger el punto.', 'error');
          setSubmitting(false);
          return;
        }
        const hashedPassword = await hashPassword(form.password.trim());
        const nuevo = await addLugar({
          nombre: form.nombre.trim(),
          estado: form.estado,
          descripcion: form.descripcion.trim(),
          direccion: form.direccion.trim(),
          contacto: form.contacto.trim() || undefined,
          tipoAcopio: form.tipoAcopio,
          estadoOperativo: form.estadoOperativo,
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

  const handleExportDataClick = () => {
    try {
      exportLugaresToJson(lugares);
      showNotification('Datos exportados exitosamente como JSON.', 'success');
    } catch {
      showNotification('Error al exportar los datos.', 'error');
    }
  };

  // Stats calculation
  const totalAcopios = lugares.length;
  const activos = lugares.filter((l) => l.estadoOperativo === 'activo').length;
  const saturados = lugares.filter((l) => l.estadoOperativo === 'saturado').length;
  const inactivos = lugares.filter((l) => l.estadoOperativo === 'inactivo').length;

  return (
    <div className="min-h-screen bg-white text-rotaract-text flex flex-col font-sans transition-colors duration-200">
      {/* Loading overlay during initial data fetch */}
      {loading && <LoadingOverlay />}

      {/* Connection error banner */}
      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border-b-2 border-rose-200 dark:border-rose-900/40 px-4 py-2.5 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-center gap-2">
          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            <strong>Error de conexión:</strong> {error}. Verifica tu VITE_SUPABASE_URL en el archivo .env
          </span>
        </div>
      )}

      {/* Venezuelan tricolor top bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-yellow-400 via-cranberry-600 to-red-600 shrink-0" />

      {/* Header */}
      <AppHeader
        activos={activos}
        showInstallBtn={showInstallBtn}
        onInstallClick={handleInstallClick}
        onExport={handleExportDataClick}
      />

      {/* Welcome Banner */}
      <WelcomeBanner totalLugares={totalAcopios} />

      {/* Global Stats Bento Panel */}
      <section className="bg-slate-50/50 dark:bg-slate-950/50 py-6 px-6 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<MapPin className="w-5 h-5" />} label="Registrados" value={totalAcopios} colorScheme="slate" />
          <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Abiertos / Activos" value={activos} colorScheme="emerald" />
          <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Saturados" value={saturados} colorScheme="amber" />
          <StatCard icon={<XCircle className="w-5 h-5" />} label="Cerrados / Inactivos" value={inactivos} colorScheme="rose" />
        </div>
      </section>

      {/* Notification Toast */}
      <Toast />

      {/* Password Verification Modal */}
      <PasswordModal
        open={passwordModalOpen}
        action={passwordAction}
        passwordInput={passwordInput}
        onPasswordChange={setPasswordInput}
        onVerify={handleVerifyPassword}
        onClose={() => {
          setPasswordModalOpen(false);
          setPasswordAction(null);
        }}
      />

      {/* Main Bento Grid */}
      <main className="max-w-7xl mx-auto p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full overflow-hidden">
        {/* LEFT COLUMN */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <LugarForm
            form={form}
            editingId={editingId}
            submitting={submitting}
            geocodingLoading={geocodingLoading}
            onFieldChange={setField}
            onCoordChange={(lat, lng) => {
              setField('lat', lat);
              setField('lng', lng);
              if (lat && lng) {
                setTempCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
              }
            }}
            onGeocode={handleGeocodeDireccionClick}
            onSubmit={handleSubmit}
            onCancelEdit={() => {
              resetForm();
              setTempCoords(null);
            }}
          />
          <UserGuide />
        </section>

        {/* RIGHT COLUMN */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Mobile responsive tabs */}
          <div className="flex lg:hidden bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl w-full border border-slate-200 dark:border-slate-750">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-slate-900 text-cranberry-800 dark:text-cranberry-400 shadow-md scale-[1.02]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Ver Mapa Interactivo</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white dark:bg-slate-900 text-cranberry-800 dark:text-cranberry-400 shadow-md scale-[1.02]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Ver Listado ({filteredLugares.length})</span>
            </button>
          </div>

          <MapViewSection
            activeTab={activeTab}
            filteredLugares={filteredLugares}
            selectedLugar={selectedLugar}
            setSelectedLugar={setSelectedLugar}
            tempCoords={tempCoords}
            handleSelectCoordsFromMap={handleSelectCoordsFromMap}
            handleSelectLugarFromMap={handleSelectLugarFromMap}
            theme={theme}
            handleUserLocationResolved={handleUserLocationResolved}
            userGpsLocation={userGpsLocation}
            handleShareLugar={handleShareLugar}
            onEditLugar={(lugar) => requestPasswordVerification(lugar, 'edit')}
            onDeleteLugar={(id, name) => {
              const lugar = lugares.find((l) => l.id === id);
              if (lugar) {
                if (confirm(`¿Estás seguro de que deseas eliminar el punto de acopio "${name}"?`)) {
                  requestPasswordVerification(lugar, 'delete');
                }
              }
            }}
          />

          <FilterCard
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            estadoFilter={estadoFilter}
            setEstadoFilter={setEstadoFilter}
            tipoFilter={tipoFilter}
            setTipoFilter={setTipoFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            resetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            userGpsLocation={userGpsLocation}
            sortByDistance={sortByDistance}
            setSortByDistance={setSortByDistance}
            statsByEstado={statsByEstado}
          />

          <LugaresList
            filteredLugares={filteredLugares}
            selectedLugar={selectedLugar}
            onSelectLugar={(lugar) => {
              setSelectedLugar(lugar);
              if (window.innerWidth < 1024) {
                setActiveTab('map');
              }
            }}
            onShareLugar={handleShareLugar}
            onEditLugar={(lugar) => requestPasswordVerification(lugar, 'edit')}
            onDeleteLugar={(id, name) => {
              const lugar = lugares.find((l) => l.id === id);
              if (lugar) {
                if (confirm(`¿Estás seguro de que deseas eliminar el punto de acopio "${name}"?`)) {
                  requestPasswordVerification(lugar, 'delete');
                }
              }
            }}
            userGpsLocation={userGpsLocation}
            totalLugaresCount={totalAcopios}
          />
        </section>
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppProvider theme={theme} toggleTheme={toggleTheme}>
      <AppContent />
    </AppProvider>
  );
}
