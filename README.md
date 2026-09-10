# Centro Medico Digital

Plataforma web integral para la gestion de turnos medicos en centros de salud. Permite a los pacientes reservar citas online, consultar cartillas medicas, acceder a planes de afiliacion y obtener informacion de urgencias.

## Stack Tecnologico

| Tecnologia | Version | Uso |
|---|---|---|
| Next.js | 14.2 | Framework full-stack (App Router, API Routes) |
| React | 18 | Interfaz de usuario |
| TypeScript | 5 | Tipado estatico |
| Tailwind CSS | 3.4 | Estilos utility-first |
| Lucide React | 1.40 | Iconografia |
| n8n | - | Automatizacion de workflows (autenticacion, reservas) |

## Caracteristicas

- **Reserva de turnos en 4 pasos**: seleccion de especialidad, calendario interactivo, formulario de datos y confirmacion.
- **Sistema de autenticacion**: login y registro integrado con webhooks de n8n.
- **Cartilla medica**: busqueda de profesionales por especialidad y sede.
- **Planes de afiliacion**: comparativa de planes Basico, Plata y Oro con precios y beneficios.
- **Centros de urgencia**: informacion de guardias, tiempos de espera y numeros de emergencia.
- **Carousel hero**: presentacion dinámica con transiciones automaticas.
- **Diseno responsivo**: adaptado a dispositivos moviles, tablets y escritorio.
- **Animaciones**: transiciones suaves con CSS keyframes (fade-in, slide-up, scale-in).
- **Notificaciones toast**: feedback visual para acciones del usuario.

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   └── reservar/
│   │       └── route.ts          # API endpoint para procesar reservas
│   ├── fonts/                    # Fuentes Geist (VF)
│   ├── globals.css               # Estilos globales y animaciones
│   ├── layout.tsx                # Layout principal y metadata
│   └── page.tsx                  # Pagina principal (landing + dashboard)
├── components/
│   ├── BookingWidget.tsx         # Widget de reserva multi-paso
│   ├── LoginModal.tsx            # Modal de autenticacion
│   └── QuickAccess.tsx           # Panel de accesos rapidos
tailwind.config.ts                # Configuracion de Tailwind CSS
next.config.mjs                   # Configuracion de Next.js
```

## Instalacion y Ejecucion

### Prerequisitos

- Node.js >= 18
- npm o yarn
- Instancia de n8n ejecutandose (opcional, para funcionalidad de autenticacion y reservas)

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/usuario/mi-gestor-turnos.git
cd mi-gestor-turnos

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`.

### Comandos Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de produccion |
| `npm start` | Ejecuta la version de produccion |
| `npm run lint` | Ejecuta el linter (ESLint) |

## Webhooks de n8n

El proyecto se comunica con los siguientes endpoints de n8n para funcionalidades backend:

| Endpoint | Metodo | Descripcion |
|---|---|---|
| `/webhook/login` | POST | Autenticacion de usuarios |
| `/webhook/registro` | POST | Creacion de cuentas |
| `/webhook/nuevo-turno` | POST | Registro de reservas |

## Metadata

- **Idioma**: ES (es-ES)
- **Familia tipografica**: Inter (Google Fonts)
- **Color primario**: `#0052CC`
- **Paleta medica**: `#0284C7` (sky), `#14B8A6` (teal)
