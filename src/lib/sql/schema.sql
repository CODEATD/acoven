-- =================================================================
-- SCHEMA: Puntos de Acopio Venezuela
-- Ejecutar este script en: Supabase Dashboard → SQL Editor → New Query
-- =================================================================

create table if not exists public.puntos_acopio (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  estado text not null,
  descripcion text not null,
  lat double precision not null,
  lng double precision not null,
  direccion text not null,
  contacto text,
  tipo_acopio text not null,
  estado_operativo text not null check (estado_operativo in ('activo', 'saturado', 'inactivo')),
  password text,
  created_at timestamptz default now() not null
);

-- Habilitar Row Level Security
alter table public.puntos_acopio enable row level security;

-- Politica: cualquier usuario (anonimo o autenticado) puede leer todos los puntos
create policy "Lectura publica de puntos"
  on public.puntos_acopio
  for select
  using (true);

-- Politica: cualquier usuario puede insertar nuevos puntos
create policy "Insercion publica de puntos"
  on public.puntos_acopio
  for insert
  with check (true);

-- Politica: cualquier usuario puede actualizar puntos (la validacion de password es en el cliente)
create policy "Actualizacion publica de puntos"
  on public.puntos_acopio
  for update
  using (true);

-- Politica: cualquier usuario puede eliminar puntos (la validacion de password es en el cliente)
create policy "Eliminacion publica de puntos"
  on public.puntos_acopio
  for delete
  using (true);

-- Indice para mejorar busquedas por estado
create index if not exists idx_puntos_acopio_estado on public.puntos_acopio (estado);
create index if not exists idx_puntos_acopio_estado_operativo on public.puntos_acopio (estado_operativo);
create index if not exists idx_puntos_acopio_created_at on public.puntos_acopio (created_at desc);

-- Habilitar replicacion en tiempo real para esta tabla
alter publication supabase_realtime add table public.puntos_acopio;
