# PolaFest — Sistema de Gestión para Boliches

Sistema web integral para la gestión de establecimientos nocturnos. Permite administrar usuarios, eventos, productos, tarjetas recargables y ventas, con integración a Mercado Pago para la recarga de saldo.

**Trabajo Final Integrador — Tecnicatura Universitaria en Programación**  
Universidad Tecnológica Nacional — Facultad Regional Rafaela  
Alumno: Manuel Jiménez | Profesor: Darío Haspert

---

## Tecnologías

| Área | Tecnología |
|---|---|
| Backend | Node.js, NestJS, TypeORM |
| Base de datos | MySQL |
| Frontend | React, Vite, CSS |
| Autenticación | JWT (JSON Web Tokens) |
| Pagos | Mercado Pago SDK — Checkout Pro |
| Subida de archivos | Multer |
| Exportación PDF | jsPDF + jspdf-autotable |

---

## Requisitos previos

- [Node.js](https://nodejs.org) v18 o superior
- [MySQL](https://dev.mysql.com/downloads/installer) 8.0
- [Git](https://git-scm.com)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/manuu872/Boliche-PolaFest.git
cd Boliche-PolaFest
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

---

## Configuración

### Base de datos

Importar el archivo `.sql` en MySQL con el nombre de schema `bd_boliche3`.

En MySQL Workbench: `Server` → `Data Import` → seleccionar el archivo `.sql` → `Default Target Schema: bd_boliche3` → `Start Import`.

### Variables de entorno — Backend

Crear el archivo `backend/.env` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=bd_boliche3
JWT_SECRET=tu_secreto_jwt
MP_ACCESS_TOKEN=tu_access_token_mercadopago
```

### Variables de entorno — Frontend

Crear el archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

> Si querés acceder desde un dispositivo móvil en la misma red WiFi, reemplazá `localhost` por la IP local de tu PC (ej: `http://192.168.0.11:3000`).

---

## Ejecución

### Backend

```bash
cd backend
npm run start:dev
```

El servidor corre en `http://localhost:3000`

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación abre en `http://localhost:5173`

---

## Módulos del sistema

### Roles de usuario
- **Admin:** acceso completo al sistema
- **Cajero:** registro de ventas y gestión de stock
- **Cliente:** panel personal con saldo, bebidas y consumos

### Funcionalidades principales
- **Usuarios:** ABM con filtros, paginación y asignación de roles
- **Eventos:** creación con imagen, fechas y capacidad máxima
- **Bebidas/Productos:** gestión de stock con filtros por nombre y tipo
- **Tarjetas:** tarjetas recargables por cliente con saldo y estado activo/inactivo
- **Ventas:** registro de consumos por evento con descuento automático de saldo
- **Pagos:** recarga de saldo vía Mercado Pago Checkout Pro
- **Estadísticas:** KPIs, tablas de ventas/productos/clientes y stock crítico con exportación a PDF

---

## Estructura del proyecto

```
Boliche-PolaFest/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── usuario/
│   │   │   ├── evento/
│   │   │   ├── producto/
│   │   │   ├── tarjeta/
│   │   │   ├── ventas/
│   │   │   ├── pagos/
│   │   │   ├── estadisticas/
│   │   │   └── movimientoSaldo/
│   │   └── main.ts
│   └── uploads/
│       └── eventos/
└── frontend/
    └── src/
        ├── pages/
        │   ├── login/
        │   ├── usuarios/
        │   ├── eventos/
        │   ├── bebidas/
        │   ├── tarjeta/
        │   ├── ventas/
        │   └── estadisticas/
        ├── components/
        └── css/
```

---

## Acceso desde dispositivo móvil (misma red WiFi)

1. Obtener la IP local de la PC: ejecutar `ipconfig` en CMD y copiar la IPv4
2. Cambiar `frontend/.env` → `VITE_API_URL=http://TU_IP:3000`
3. Reiniciar el frontend
4. Desde el celular entrar a `http://TU_IP:5173`
