/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lugar {
  id: string;
  nombre: string;
  estado: string; // Estado de la República (e.g. Jalisco, CDMX)
  descripcion: string;
  lat: number;
  lng: number;
  direccion: string;
  contacto?: string;
  tipoAcopio: string; // 'Víveres' | 'Medicamentos' | 'Ropa' | 'Herramientas' | 'Múltiple'
  estadoOperativo: 'activo' | 'saturado' | 'inactivo'; // 'activo' (Recibiendo), 'saturado' (Lleno), 'inactivo' (Cerrado)
  createdAt: string;
}

export const ESTADOS_MEXICO = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
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
