import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Lugar } from '../types';

type LugarDB = {
  id: string;
  nombre: string;
  estado: string;
  descripcion: string;
  lat: number;
  lng: number;
  direccion: string;
  contacto: string | null;
  tipo_acopio: string;
  estado_operativo: 'activo' | 'saturado' | 'inactivo';
  password: string | null;
  created_at: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  instagram: string | null;
};

function toApp(row: LugarDB): Lugar {
  return {
    id: row.id,
    nombre: row.nombre,
    estado: row.estado,
    descripcion: row.descripcion,
    lat: row.lat,
    lng: row.lng,
    direccion: row.direccion,
    contacto: row.contacto ?? undefined,
    tipoAcopio: row.tipo_acopio,
    estadoOperativo: row.estado_operativo,
    password: row.password ?? undefined,
    createdAt: row.created_at,
    fechaInicio: row.fecha_inicio ?? undefined,
    fechaFin: row.fecha_fin ?? undefined,
    horaInicio: row.hora_inicio ?? undefined,
    horaFin: row.hora_fin ?? undefined,
    instagram: row.instagram ?? undefined,
  };
}

function toDB(lugar: Omit<Lugar, 'id' | 'createdAt'>): Omit<LugarDB, 'id' | 'created_at'> {
  return {
    nombre: lugar.nombre,
    estado: lugar.estado,
    descripcion: lugar.descripcion,
    lat: lugar.lat,
    lng: lugar.lng,
    direccion: lugar.direccion,
    contacto: lugar.contacto ?? null,
    tipo_acopio: lugar.tipoAcopio,
    estado_operativo: lugar.estadoOperativo,
    password: lugar.password ?? null,
    fecha_inicio: lugar.fechaInicio ?? null,
    fecha_fin: lugar.fechaFin ?? null,
    hora_inicio: lugar.horaInicio ?? null,
    hora_fin: lugar.horaFin ?? null,
    instagram: lugar.instagram ?? null,
  };
}

export function useLugares() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLugares = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('puntos_acopio')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setLugares((data as LugarDB[]).map(toApp));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLugares();

    const channel = supabase
      .channel('puntos_acopio_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'puntos_acopio' },
        () => {
          fetchLugares();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLugares]);

  const addLugar = async (lugar: Omit<Lugar, 'id' | 'createdAt'>): Promise<Lugar | null> => {
    const payload = toDB(lugar);
    console.log('Insertando a Supabase:', payload);
    const { data, error: err } = await supabase
      .from('puntos_acopio')
      .insert(payload)
      .select()
      .single();

    if (err) {
      console.error('Error detallado de Supabase al insertar:', err);
      throw new Error(err.message);
    }
    return toApp(data as LugarDB);
  };

  const updateLugar = async (id: string, updates: Partial<Omit<Lugar, 'id' | 'createdAt'>>): Promise<void> => {
    const dbUpdates: Partial<Omit<LugarDB, 'id' | 'created_at'>> = {};
    if (updates.nombre !== undefined) dbUpdates.nombre = updates.nombre;
    if (updates.estado !== undefined) dbUpdates.estado = updates.estado;
    if (updates.descripcion !== undefined) dbUpdates.descripcion = updates.descripcion;
    if (updates.lat !== undefined) dbUpdates.lat = updates.lat;
    if (updates.lng !== undefined) dbUpdates.lng = updates.lng;
    if (updates.direccion !== undefined) dbUpdates.direccion = updates.direccion;
    if (updates.contacto !== undefined) dbUpdates.contacto = updates.contacto ?? null;
    if (updates.tipoAcopio !== undefined) dbUpdates.tipo_acopio = updates.tipoAcopio;
    if (updates.estadoOperativo !== undefined) dbUpdates.estado_operativo = updates.estadoOperativo;
    if (updates.password !== undefined) dbUpdates.password = updates.password ?? null;
    if (updates.fechaInicio !== undefined) dbUpdates.fecha_inicio = updates.fechaInicio ?? null;
    if (updates.fechaFin !== undefined) dbUpdates.fecha_fin = updates.fechaFin ?? null;
    if (updates.horaInicio !== undefined) dbUpdates.hora_inicio = updates.horaInicio ?? null;
    if (updates.horaFin !== undefined) dbUpdates.hora_fin = updates.horaFin ?? null;
    if (updates.instagram !== undefined) dbUpdates.instagram = updates.instagram ?? null;

    const { error: err } = await supabase
      .from('puntos_acopio')
      .update(dbUpdates)
      .eq('id', id);

    if (err) {
      throw new Error(err.message);
    }
  };

  const deleteLugar = async (id: string): Promise<void> => {
    const { error: err } = await supabase
      .from('puntos_acopio')
      .delete()
      .eq('id', id);

    if (err) {
      throw new Error(err.message);
    }
  };

  return {
    lugares,
    loading,
    error,
    fetchLugares,
    addLugar,
    updateLugar,
    deleteLugar,
  };
}
