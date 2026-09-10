"use client";

import { useState } from "react";
import {
  Users,
  FileText,
  ClipboardList,
  Zap,
  X,
  Check,
  Phone,
  MapPin,
  Search,
  Send,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

export type PanelId = "asociarme" | "planes" | "cartilla" | "urgencias";

interface PanelDef {
  id: PanelId;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  cardGradient: string;
  chipBg: string;
  activeRing: string;
}

interface QuickAccessProps {
  openPanel?: PanelId | null;
  onPanelChange?: (id: PanelId | null) => void;
  especialidad?: string;
  onEspecialidadChange?: (value: string) => void;
}

const panels: PanelDef[] = [
  {
    id: "asociarme",
    title: "Quiero asociarme",
    description: "Conoce nuestros planes de afiliacion para vos y tu familia.",
    icon: <Users className="w-6 h-6" />,
    iconColor: "text-primary",
    cardGradient: "from-primary-50 to-primary-100/50",
    chipBg: "bg-primary-50",
    activeRing: "ring-primary/25",
  },
  {
    id: "planes",
    title: "Planes",
    description: "Informacion de cobertura, prestaciones y beneficios.",
    icon: <FileText className="w-6 h-6" />,
    iconColor: "text-medical-dark",
    cardGradient: "from-slate-100 to-surface-secondary",
    chipBg: "bg-slate-100",
    activeRing: "ring-slate-900/10",
  },
  {
    id: "cartilla",
    title: "Cartilla Medica",
    description: "Encontra el profesional que necesitas por especialidad.",
    icon: <ClipboardList className="w-6 h-6" />,
    iconColor: "text-medical-teal",
    cardGradient: "from-emerald-50 to-medical-light/20",
    chipBg: "bg-emerald-50",
    activeRing: "ring-emerald-500/25",
  },
  {
    id: "urgencias",
    title: "Urgencias",
    description: "Informacion de guardia y centros de atencion de emergencia.",
    icon: <Zap className="w-6 h-6" />,
    iconColor: "text-rose-600",
    cardGradient: "from-rose-50 to-rose-100/50",
    chipBg: "bg-rose-50",
    activeRing: "ring-rose-500/25",
  },
];

const planes = [
  {
    id: "basico",
    name: "Plan Basico",
    price: 4800,
    features: [
      "Consultas clinicas ilimitadas",
      "Acceso a 4 especialidades",
      "Descuentos en medicamentos",
      "Telemedicina 24/7",
    ],
    highlight: false,
  },
  {
    id: "plata",
    name: "Plan Plata",
    price: 7800,
    features: [
      "Todo lo del Plan Basico",
      "Acceso a todas las especialidades",
      "2 estudios anuales sin costo",
      "Descuentos en laboratorio",
      "Atencion prioritaria",
    ],
    highlight: true,
  },
  {
    id: "oro",
    name: "Plan Oro",
    price: 11900,
    features: [
      "Todo lo del Plan Plata",
      "Estudios ilimitados",
      "Internacion sin coseguro",
      "Cobertura familiar (4 integrantes)",
      "Asistencia al viajero",
    ],
    highlight: false,
  },
];

const profesionales = [
  {
    nombre: "Dra. Laura Rodriguez",
    especialidad: "Cardiologia",
    sede: "Centro",
  },
  { nombre: "Dr. Martin Gomez", especialidad: "Pediatria", sede: "Palermo" },
  {
    nombre: "Dr. Pablo Sanchez",
    especialidad: "Traumatologia",
    sede: "Centro",
  },
  {
    nombre: "Dra. Ana Fernandez",
    especialidad: "Cardiologia",
    sede: "Belgrano",
  },
  {
    nombre: "Dr. Diego Alvarez",
    especialidad: "Clinica General",
    sede: "Palermo",
  },
  { nombre: "Dra. Sofia Diaz", especialidad: "Pediatria", sede: "Centro" },
  {
    nombre: "Dr. Jorge Molina",
    especialidad: "Traumatologia",
    sede: "Belgrano",
  },
  {
    nombre: "Dra. Carla Nuñez",
    especialidad: "Clinica General",
    sede: "Palermo",
  },
];

const especialidades = [
  "Cardiologia",
  "Pediatria",
  "Traumatologia",
  "Clinica General",
];

const sedes = ["Centro", "Palermo", "Belgrano"];

const centrosUrgencia = [
  {
    nombre: "Guardia Central",
    direccion: "Av. Corrientes 1234, CABA",
    telefono: "107",
    espera: "20 min",
    estadoAvanzado: false,
  },
  {
    nombre: "Sede Palermo",
    direccion: "Av. Santa Fe 3456, CABA",
    telefono: "0800-222-3763",
    espera: "45 min",
    estadoAvanzado: true,
  },
  {
    nombre: "Sede Belgrano",
    direccion: "Av. Cabildo 2345, CABA",
    telefono: "011-4785-6622",
    espera: "10 min",
    estadoAvanzado: false,
  },
];

const numerosEmergencia = [
  { label: "Emergencias generales", numero: "107" },
  { label: "Bomberos", numero: "100" },
  { label: "Policia", numero: "101" },
];

const inputClasses =
  "w-full px-4 py-3 bg-surface-secondary border border-slate-900/5 rounded-xl text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 ease-smooth text-sm";

const labelClasses =
  "block text-sm font-medium text-ink-secondary mb-1.5";

export default function QuickAccess({
  openPanel,
  onPanelChange,
  especialidad: especialidadProp,
  onEspecialidadChange,
}: QuickAccessProps) {
  const [internalOpen, setInternalOpen] = useState<PanelId | null>(null);
  const [plan, setPlan] = useState("plata");

  const [afiliacionNombre, setAfiliacionNombre] = useState("");
  const [afiliacionTelefono, setAfiliacionTelefono] = useState("");
  const [afiliacionPlan, setAfiliacionPlan] = useState("Plata");
  const [afiliacionEnviando, setAfiliacionEnviando] = useState(false);
  const [afiliacionError, setAfiliacionError] = useState<string | null>(null);
  const [afiliacionOk, setAfiliacionOk] = useState(false);

  const [internalEspecialidad, setInternalEspecialidad] = useState("");
  const [sede, setSede] = useState("");

  const open = openPanel !== undefined ? openPanel : internalOpen;
  const setOpenValue = (id: PanelId | null) => {
    if (onPanelChange) {
      onPanelChange(id);
    } else {
      setInternalOpen(id);
    }
  };

  const especialidad =
    especialidadProp !== undefined ? especialidadProp : internalEspecialidad;
  const setEspecialidadValue = (value: string) => {
    if (onEspecialidadChange) {
      onEspecialidadChange(value);
    } else {
      setInternalEspecialidad(value);
    }
  };

  const toggle = (id: PanelId) => {
    setOpenValue(open === id ? null : id);
  };

  const panel = panels.find((p) => p.id === open);

  const handleAfiliacion = (e: React.FormEvent) => {
    e.preventDefault();
    setAfiliacionError(null);
    setAfiliacionEnviando(true);
    setTimeout(() => {
      setAfiliacionEnviando(false);
      if (afiliacionNombre && afiliacionTelefono) {
        setAfiliacionOk(true);
      } else {
        setAfiliacionError("Completa todos los campos");
      }
    }, 700);
  };

  const filteredProfesionales = profesionales.filter(
    (p) =>
      (especialidad === "" || p.especialidad === especialidad) &&
      (sede === "" || p.sede === sede)
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {panels.map((item) => {
          const isOpen = open === item.id;
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggle(item.id);
              }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.cardGradient} p-6 cursor-pointer border border-slate-900/5 transition-all duration-300 ease-smooth hover:shadow-card-hover hover:-translate-y-1 ${
                isOpen
                  ? `ring-2 ${item.activeRing} shadow-elevated -translate-y-0.5`
                  : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center mb-4 shadow-sm transition-transform duration-300 ease-smooth group-hover:scale-105 group-hover:rotate-2`}
              >
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-ink mb-1.5">
                {item.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {item.description}
              </p>
              <div
                className={`mt-3 text-sm font-semibold flex items-center gap-1.5 transition-opacity duration-300 ease-smooth ${item.iconColor} ${
                  isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isOpen ? "Cerrar" : "Ver mas"}
                <span
                  className={`inline-flex transition-transform duration-300 ease-smooth ${
                    isOpen ? "-rotate-180" : ""
                  }`}
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {panel && (
        <div
          id="quick-panel"
          className="mt-6 bg-white rounded-2xl shadow-elevated ring-1 ring-slate-900/5 overflow-hidden animate-slide-up"
        >
          <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-slate-900/5">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl ${panel.chipBg} flex items-center justify-center`}
              >
                <span className={panel.iconColor}>{panel.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink leading-tight">
                  {panel.title}
                </h3>
                <p className="text-xs text-ink-faint hidden sm:block">
                  {panel.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpenValue(null)}
              className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors duration-300 ease-smooth text-ink-faint hover:text-ink"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {open === "asociarme" && (
              <div className="max-w-lg mx-auto animate-fade-in">
                {afiliacionOk ? (
                  <div className="text-center py-8 animate-scale-in">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-medical-teal to-emerald-500 flex items-center justify-center mb-4 shadow-md">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-ink mb-1">
                      Solicitud Enviada!
                    </h4>
                    <p className="text-ink-muted text-sm">
                      Un asesor se comunicara con vos a la brevedad para
                      completar la afiliacion.
                    </p>
                    <button
                      onClick={() => {
                        setAfiliacionOk(false);
                        setAfiliacionNombre("");
                        setAfiliacionTelefono("");
                        setAfiliacionPlan("Plata");
                      }}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-600 transition-colors duration-300 ease-smooth"
                    >
                      <Send className="w-4 h-4" />
                      Enviar otra solicitud
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAfiliacion} className="space-y-4">
                    <div>
                      <label className={labelClasses}>
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={afiliacionNombre}
                        onChange={(e) => setAfiliacionNombre(e.target.value)}
                        className={inputClasses}
                        placeholder="Juan Perez"
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Telefono *</label>
                      <input
                        type="tel"
                        required
                        value={afiliacionTelefono}
                        onChange={(e) => setAfiliacionTelefono(e.target.value)}
                        className={inputClasses}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Plan de interes</label>
                      <div className="relative">
                        <select
                          value={afiliacionPlan}
                          onChange={(e) => setAfiliacionPlan(e.target.value)}
                          className={`${inputClasses} appearance-none pr-10`}
                        >
                          <option>Basico</option>
                          <option>Plata</option>
                          <option>Oro</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
                      </div>
                    </div>

                    {afiliacionError && (
                      <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {afiliacionError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={afiliacionEnviando}
                      className="w-full bg-gradient-to-r from-primary to-medical hover:from-primary-600 hover:to-medical-dark text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ease-smooth shadow-card hover:shadow-elevated disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      {afiliacionEnviando ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar Solicitud
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {open === "planes" && (
              <div className="animate-fade-in">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                  {planes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlan(p.id)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-smooth ${
                        plan === p.id
                          ? "bg-primary text-white shadow-card"
                          : "bg-surface-secondary text-ink-muted hover:bg-surface-tertiary hover:text-ink"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {planes.map((p) => {
                    const selected = plan === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setPlan(p.id);
                        }}
                        className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 ease-smooth ${
                          selected
                            ? "bg-gradient-to-br from-primary-50 to-white ring-2 ring-primary/25 shadow-card-hover -translate-y-0.5"
                            : "bg-surface-secondary hover:bg-surface-tertiary hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-ink">
                            {p.name}
                          </h4>
                          {p.highlight && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-medical text-white text-xs font-semibold">
                              Recomendado
                            </span>
                          )}
                        </div>
                        <div className="mb-4">
                          <span className="text-3xl font-extrabold text-ink">
                            ${p.price.toLocaleString()}
                          </span>
                          <span className="text-ink-faint text-sm"> /mes</span>
                        </div>
                        <ul className="space-y-2">
                          {p.features.map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-2 text-sm text-ink-secondary"
                            >
                              <Check className="w-4 h-4 text-medical-teal mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {open === "cartilla" && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
                  <div>
                    <label className={labelClasses}>Especialidad</label>
                    <div className="relative">
                      <select
                        value={especialidad}
                        onChange={(e) => setEspecialidadValue(e.target.value)}
                        className={`${inputClasses} appearance-none pr-10`}
                      >
                        <option value="">Todas las especialidades</option>
                        {especialidades.map((e) => (
                          <option key={e}>{e}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Sede / Zona</label>
                    <div className="relative">
                      <select
                        value={sede}
                        onChange={(e) => setSede(e.target.value)}
                        className={`${inputClasses} appearance-none pr-10`}
                      >
                        <option value="">Todas las sedes</option>
                        {sedes.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto">
                  {filteredProfesionales.length === 0 ? (
                    <div className="text-center py-10 text-ink-faint">
                      <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        No se encontraron profesionales con esos filtros.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredProfesionales.map((p) => (
                        <div
                          key={p.nombre}
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 bg-surface-secondary hover:bg-emerald-50 cursor-pointer transition-all duration-300 ease-smooth"
                        >
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-medical to-emerald-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                            {p.nombre.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-ink text-sm truncate">
                              {p.nombre}
                            </p>
                            <p className="text-ink-muted text-xs">
                              {p.especialidad}
                            </p>
                            <p className="text-ink-faint text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Sede {p.sede}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {open === "urgencias" && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-ink mb-3 text-xs uppercase tracking-wide">
                      Centros de Guardia
                    </h4>
                    <div className="space-y-3">
                      {centrosUrgencia.map((c) => (
                        <div
                          key={c.nombre}
                          className="rounded-2xl p-5 bg-surface-secondary hover:bg-rose-50 transition-all duration-300 ease-smooth"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-ink text-sm">
                                {c.nombre}
                              </p>
                              <p className="text-ink-muted text-xs flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {c.direccion}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                                c.estadoAvanzado
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              Espera: {c.espera}
                            </span>
                          </div>
                          <a
                            href={`tel:${c.telefono.replace(/[^0-9+]/g, "")}`}
                            className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ease-smooth shadow-sm hover:shadow-md"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Llamar: {c.telefono}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-ink mb-3 text-xs uppercase tracking-wide">
                      Numeros de Emergencia
                    </h4>
                    <div className="space-y-3">
                      {numerosEmergencia.map((n) => (
                        <a
                          key={n.numero}
                          href={`tel:${n.numero}`}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 p-5 text-white cursor-pointer shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-300 ease-smooth"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                              <Phone className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-white/90">
                                {n.label}
                              </p>
                              <p className="text-xl font-extrabold leading-tight">
                                {n.numero}
                              </p>
                            </div>
                          </div>
                          <ChevronUp className="w-5 h-5 text-white/70 rotate-90 flex-shrink-0" />
                        </a>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl bg-primary-50 p-4 flex items-center gap-3 animate-fade-in">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-ink-secondary">
                        Guardia central con atención las{" "}
                        <strong className="text-ink">24 horas</strong>, todos
                        los días del año.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}