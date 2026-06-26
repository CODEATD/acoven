import { useState } from 'react';
import { Lugar } from '../types';

export interface FormState {
  nombre: string;
  estado: string;
  descripcion: string;
  direccion: string;
  contacto: string;
  tipoAcopio: string;
  estadoOperativo: 'activo' | 'saturado' | 'inactivo';
  lat: string;
  lng: string;
  password: string;
}

const DEFAULT_STATE: FormState = {
  nombre: '',
  estado: 'Distrito Capital',
  descripcion: '',
  direccion: '',
  contacto: '',
  tipoAcopio: 'Múltiple (De todo)',
  estadoOperativo: 'activo',
  lat: '',
  lng: '',
  password: '',
};

export function useForm() {
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);
  const [editingId, setEditingId] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(DEFAULT_STATE);
    setEditingId(null);
  };

  const populateForEdit = (lugar: Lugar) => {
    setEditingId(lugar.id);
    setForm({
      nombre: lugar.nombre,
      estado: lugar.estado,
      descripcion: lugar.descripcion,
      direccion: lugar.direccion,
      contacto: lugar.contacto || '',
      tipoAcopio: lugar.tipoAcopio,
      estadoOperativo: lugar.estadoOperativo,
      lat: lugar.lat.toString(),
      lng: lugar.lng.toString(),
      password: '',
    });
  };

  return { form, setField, editingId, resetForm, populateForEdit };
}
