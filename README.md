# Centro Medico Digital

Plataforma web integral para la gestion de turnos medicos en centros de salud. Permite a los pacientes reservar citas online, consultar cartillas medicas, acceder a planes de afiliacion y obtener informacion de urgencias.

**Demo en vivo:** [https://mi-gestor-turnos.vercel.app/](https://mi-gestor-turnos.vercel.app/)

Cuenta de prueba: `demo@test.com` / `123456`

## Stack Tecnologico

| Tecnologia | Uso |
|---|---|
| Next.js 14 | Framework full-stack (App Router, API Routes, serverless) |
| React 18 | Interfaz de usuario |
| TypeScript 5 | Tipado estatico |
| Tailwind CSS 3.4 | Estilos utility-first |
| Lucide React | Iconografia |
| Prisma | ORM y migraciones |
| Neon Postgres | Base de datos relacional en la nube |
| Resend | Envio de emails transaccionales |
| SheetJS (xlsx) | Generacion y exportacion de planillas Excel |
| Vercel | Hosting y despliegue continuo |

## Caracteristicas

- **Reserva de turnos en 4 pasos**: seleccion de especialidad, calendario interactivo, formulario de datos y confirmacion.
- **Sistema de autenticacion**: login y registro con persistencia en PostgreSQL (hash de contrasenas con bcrypt).
- **Envio de mails de confirmacion**: Resend envia un mail con los datos del turno al momento de reservar.
- **Exportacion a Excel**: boton "Descargar Excel" que genera un archivo `.xlsx` con todos los turnos registrados.
- **Cartilla medica**: busqueda de profesionales por especialidad y sede.
- **Planes de afiliacion**: comparativa de planes Basico, Plata y Oro con precios y beneficios.
- **Centros de urgencia**: informacion de guardias, tiempos de espera y numeros de emergencia.
- **Carousel hero**: presentacion dinamica con transiciones automaticas.
- **Diseno responsivo**: adaptado a dispositivos moviles, tablets y escritorio.
- **Animaciones**: transiciones suaves con CSS keyframes (fade-in, slide-up, scale-in).
- **Notificaciones toast**: feedback visual para acciones del usuario.

## API Endpoints

| Endpoint | Metodo | Descripcion |
|---|---|---|
| `/api/login` | POST | Autenticacion de usuarios |
| `/api/registro` | POST | Creacion de cuentas |
| `/api/reservar` | POST | Registro de reservas + envio de mail |
| `/api/exportar-turnos` | GET | Descarga de Excel con todos los turnos |

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── exportar-turnos/
│   │   │   └── route.ts          # Genera y devuelve el archivo Excel
│   │   ├── login/
│   │   │   └── route.ts          # Autenticacion de usuarios
│   │   ├── registro/
│   │   │   └── route.ts          # Creacion de cuentas
│   │   └── reservar/
│   │       └── route.ts          # Registro de reservas + mail
│   ├── globals.css               # Estilos globales y animaciones
│   ├── layout.tsx                # Layout principal y metadata
│   └── page.tsx                  # Pagina principal (landing + dashboard)
├── components/
│   ├── BookingWidget.tsx         # Widget de reserva multi-paso
│   ├── LoginModal.tsx            # Modal de autenticacion
│   └── QuickAccess.tsx           # Panel de accesos rapidos
├── lib/
│   └── prisma.ts                 # Cliente Prisma singleton
prisma/
│   └── schema.prisma             # Schema de la base de datos (User, Reserva)
tailwind.config.ts                # Configuracion de Tailwind CSS
next.config.mjs                   # Configuracion de Next.js
```

## Variables de Entorno

Las siguientes variables se configuran en Vercel (Settings → Environment Variables) y en un archivo `.env.local` para desarrollo local.

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL (Neon, Supabase, etc.) |
| `RESEND_API_KEY` | API key de Resend (https://resend.com/api-keys) |
| `EMAIL_FROM` | Remitente de los mails (verificado en Resend) |

## Instalacion y Ejecucion

### Pre-requisitos

- Node.js >= 18
- npm
- Base de datos PostgreSQL en la nune (Neon: https://console.neon.tech)
- Cuenta en Resend para envio de emails: https://resend.com

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/Santiagotapia989/mi-gestor-turnos.git
cd mi-gestor-turnos

# Instalar dependencias
npm install

# Copiar el archivo de ejemplo de variables de entorno y completar los valores
cp .env.example .env.local

# Sincronizar el schema de la base de datos
npx prisma db push

# Ejecutar en modo desarrollo
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`.

### Comandos Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de produccion (incluye prisma db push) |
| `npm start` | Ejecuta la version de produccion |
| `npm run lint` | Ejecuta el linter (ESLint) |

## Despliegue en Vercel

El proyecto esta conectado a Vercel con despliegue automatico desde la rama `main` de GitHub. El build ejecuta automaticamente `prisma generate` y `prisma db push` para mantener la base de datos sincronizada.

## Metadata

- **Idioma**: ES (es-ES)
- **Familia tipografica**: Inter (Google Fonts)
- **Color primario**: `#0052CC`
- **Paleta medica**: `#0284C7` (sky), `#14B8A6` (teal)
