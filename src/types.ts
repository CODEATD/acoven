/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lugar {
  id: string;
  nombre: string;
  estado: string; // Estado de Venezuela (e.g. Miranda, Distrito Capital)
  descripcion: string;
  lat: number;
  lng: number;
  direccion: string;
  contacto?: string;
  tipoAcopio: string; // 'Víveres' | 'Medicamentos' | 'Ropa' | 'Herramientas' | 'Múltiple'
  estadoOperativo: 'activo' | 'saturado' | 'inactivo'; // 'activo' (Recibiendo), 'saturado' (Lleno), 'inactivo' (Cerrado)
  createdAt: string;
  password?: string; // Contraseña opcional para puntos heredados, pero requerida para nuevos
}

export const ESTADOS_VENEZUELA = [
  "Amazonas",
  "Anzoátegui",
  "Apure",
  "Aragua",
  "Barinas",
  "Bolívar",
  "Carabobo",
  "Cojedes",
  "Delta Amacuro",
  "Distrito Capital",
  "Falcón",
  "Guárico",
  "Lara",
  "Mérida",
  "Miranda",
  "Monagas",
  "Nueva Esparta",
  "Portuguesa",
  "Sucre",
  "Táchira",
  "Trujillo",
  "Vargas (La Guaira)",
  "Yaracuy",
  "Zulia",
  "Dependencias Federales",
  "Otro"
];

export const TIPOS_ACOPIO = [
  "Múltiple (De todo)",
  "Víveres (Comida / Agua)",
  "Medicamentos & Curación",
  "Ropa & Cobijas",
  "Herramientas & Construcción",
  "Higiene Personal",
  "Artículos para Mascotas"
];
