/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lugar } from './types';

export const INSTRUCTIONS_TEXT = `
**¿Cómo usar el mapa interactivo?**
1. **Ver detalles:** Haz clic en cualquier marcador del mapa para ver el nombre, estado, descripción y contacto.
2. **Registrar un lugar:** Puedes llenar el formulario manualmente, o **hacer clic en cualquier parte del mapa** para capturar las coordenadas (Latitud y Longitud) de forma automática.
3. **Mover marcador:** Al hacer clic en el mapa, aparecerá un marcador temporal "Nuevo Punto".
`;

export const LUGARES_INICIALES: Lugar[] = [
  {
    id: "sample-1",
    nombre: "Centro de Acopio Cruz Roja CDMX",
    estado: "Ciudad de México",
    descripcion: "Recibiendo alimentos no perecederos, pañales, cobijas y agua embotellada para damnificados.",
    lat: 19.4271,
    lng: -99.1676,
    direccion: "Av. Ejército Nacional 1032, Polanco, Miguel Hidalgo",
    contacto: "55 5395 1111",
    tipoAcopio: "Múltiple (De todo)",
    estadoOperativo: "activo",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
  {
    id: "sample-2",
    nombre: "Catedral de Guadalajara (Diócesis)",
    estado: "Jalisco",
    descripcion: "Se recolectan medicamentos de patente (no caducados) y material de curación como gasas y alcohol.",
    lat: 20.6771,
    lng: -103.3469,
    direccion: "Av. Fray Antonio Alcalde 10, Zona Centro, Guadalajara",
    contacto: "33 3613 7168",
    tipoAcopio: "Medicamentos & Curación",
    estadoOperativo: "activo",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: "sample-3",
    nombre: "Parque Fundidora - Acceso 4",
    estado: "Nuevo León",
    descripcion: "Saturado temporalmente de prendas de vestir. Solo se recibe agua embotellada y alimentos para mascotas.",
    lat: 25.6785,
    lng: -100.2881,
    direccion: "Avenida Fundidora y Adolfo Prieto, Obrera, Monterrey",
    contacto: "81 8126 9000",
    tipoAcopio: "Víveres (Comida / Agua)",
    estadoOperativo: "saturado",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: "sample-4",
    nombre: "Bomberos de Veracruz - Central",
    estado: "Veracruz",
    descripcion: "Acopio inactivo por el momento. Esperando nuevas instrucciones de protección civil.",
    lat: 19.1911,
    lng: -96.1342,
    direccion: "Calle General Prim esq. Ignacio Zaragoza, Centro, Veracruz",
    contacto: "229 932 0066",
    tipoAcopio: "Herramientas & Construcción",
    estadoOperativo: "inactivo",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  }
];
