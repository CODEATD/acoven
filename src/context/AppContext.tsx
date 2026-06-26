import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lugar } from '../types';
import { GpsLocation } from '../hooks/useGps';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  text: string;
  type: NotificationType;
}

interface AppContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  selectedLugar: Lugar | null;
  setSelectedLugar: (lugar: Lugar | null) => void;

  activeTab: 'map' | 'list';
  setActiveTab: (tab: 'map' | 'list') => void;

  tempCoords: { lat: number; lng: number } | null;
  setTempCoords: (coords: { lat: number; lng: number } | null) => void;

  userGpsLocation: GpsLocation | null;
  setUserGpsLocation: (loc: GpsLocation | null) => void;

  notification: Notification | null;
  showNotification: (text: string, type: NotificationType) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

interface AppProviderProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function AppProvider({ children, theme, toggleTheme }: AppProviderProps) {
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userGpsLocation, setUserGpsLocation] = useState<GpsLocation | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((text: string, type: NotificationType) => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4500);
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme, toggleTheme,
        selectedLugar, setSelectedLugar,
        activeTab, setActiveTab,
        tempCoords, setTempCoords,
        userGpsLocation, setUserGpsLocation,
        notification, showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
