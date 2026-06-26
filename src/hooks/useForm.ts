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
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  instagram: string;
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
  fechaInicio: '',
  fechaFin: '',
  horaInicio: '',
  horaFin: '',
  instagram: '',
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
      fechaInicio: lugar.fechaInicio || '',
      fechaFin: lugar.fechaFin || '',
      horaInicio: lugar.horaInicio || '',
      horaFin: lugar.horaFin || '',
      instagram: lugar.instagram || '',
    });
  };

  return { form, setField, editingId, resetForm, populateForEdit };
}
