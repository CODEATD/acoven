# Acoven - Busca Acopio Venezuela 🇻🇪

Acoven es una plataforma colaborativa e interactiva en tiempo real diseñada para registrar y ubicar centros de acopio en Venezuela. Permite a los ciudadanos mapear puntos de recolección de ayuda humanitaria de forma organizada, segura y ágil durante situaciones de contingencia.

## 🚀 Características Clave

- **Mapa Interactivo**: Visualización geográfica de los centros de acopio en Venezuela a través de un mapa de Leaflet interactivo.
- **Sincronización en Tiempo Real**: Desarrollado sobre **Supabase**, permitiendo que cualquier nuevo registro o actualización se refleje instantáneamente en el mapa de todos los usuarios sin necesidad de recargar la página.
- **Búsqueda y Filtros Avanzados**: Filtrado por estado de Venezuela (23 estados + Distrito Capital), tipo de insumos requeridos (medicinas, alimentos, ropa, etc.) y estado operativo (Activo/Recibiendo, Saturado, Inactivo).
- **Seguridad Integrada**: Cada punto de acopio se registra con una contraseña de seguridad para evitar que personas no autorizadas editen o eliminen la información del centro.
- **Navegación Externa**: Integración directa con Google Maps para trazar rutas y direcciones desde el GPS de tu dispositivo al hacer clic en los detalles del centro.
- **Diseño Premium**: Interfaz moderna estructurada en Bento Grid, adaptada al tricolor nacional, mobile-first y responsiva.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React (TypeScript) + Vite
- **Estilos**: Tailwind CSS v4 (Mobile-first, diseño responsivo)
- **Base de Datos**: Supabase (PostgreSQL) con PostgreSQL Realtime y Row Level Security (RLS)
- **Mapas**: Leaflet + React Leaflet
- **Iconografía**: Lucide React

---

## 📦 Instalación y Configuración Local

### Requisitos Previos

- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
- Cuenta en [Supabase](https://supabase.com/).

### Pasos para iniciar el proyecto

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/CODEATD/acoven.git
   cd acoven
   ```

2. **Instalar las dependencias de Node**:
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto (puedes tomar como guía `.env.example`) y configura tus claves de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   ```

4. **Crear la tabla en tu base de datos de Supabase**:
   Ve al **SQL Editor** de tu Dashboard de Supabase, crea una nueva consulta (New Query) y ejecuta el código que se encuentra en `src/lib/sql/schema.sql`. Esto creará la tabla `puntos_acopio`, habilitará Row Level Security y las políticas de lectura/escritura pública, e iniciará el tiempo real.

5. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:5173](http://localhost:5173) (o el puerto que te indique la consola).

---

## 📁 Estructura del Proyecto

```text
├── src/
│   ├── components/      # Componentes de la interfaz (MapaInteractivo, etc.)
│   ├── hooks/           # Hooks personalizados (useLugares para Supabase Realtime)
│   ├── lib/             # Cliente de Supabase y scripts SQL de configuración
│   │   ├── sql/         # Script de base de datos (schema.sql)
│   │   └── supabase.ts  # Inicialización del SDK de Supabase
│   ├── App.tsx          # Pantalla y lógica principal de la aplicación (Bento Grid)
│   ├── data.ts          # Textos explicativos e iniciales
│   ├── main.tsx         # Punto de entrada de la aplicación
│   ├── types.ts         # Tipos e interfaces de TypeScript (Lugar, Estados)
│   └── index.css        # Importación de Tailwind CSS v4 y overrides de Leaflet
├── tsconfig.json        # Configuración de TypeScript
├── vite.config.ts       # Configuración de Vite y plugins
└── package.json         # Dependencias y scripts del proyecto
```

---

## 🔒 Seguridad (Políticas RLS)

La base de datos utiliza políticas Row Level Security (RLS) en Supabase para permitir que cualquier persona lea e inserte puntos de acopio de manera pública, pero valida las modificaciones y eliminaciones mediante lógica protegida por contraseña en la UI, garantizando un entorno colaborativo seguro.

---

## 📄 Licencia

Este proyecto está bajo la licencia Apache-2.0. Consulta el archivo `LICENSE` para más detalles (si aplica).
