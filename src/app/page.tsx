"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Stethoscope,
  Calendar,
  Shield,
  ChevronRight,
  ChevronLeft,
  Heart,
  Activity,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  LogOut,
  CheckCircle,
  Download,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";
import QuickAccess, { type PanelId } from "@/components/QuickAccess";
import BookingWidget from "@/components/BookingWidget";

const carouselSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
    title: "Centro Medico Digital",
    subtitle: "Tu salud, a un clic de distancia",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=1920&q=80",
    title: "Especialistas de Primer Nivel",
    subtitle: "Atencion medica profesional y cercana",
  },
  {
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80",
    title: "Tecnologia al Servicio de tu Salud",
    subtitle: "Diagnostico preciso y tratamientos modernos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80",
    title: "Reserva tu Turno Online",
    subtitle: "Agenda tu cita de forma rapida y segura",
  },
];

const specialties = [
  {
    icon: Stethoscope,
    name: "Clinica General",
    description: "Consultas medicas generales, chequeos preventivos y control de salud.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "hover:border-blue-300",
  },
  {
    icon: Heart,
    name: "Cardiologia",
    description: "Estudios cardiacos, electrocardiogramas y seguimiento cardiovascular.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    borderColor: "hover:border-rose-300",
  },
  {
    icon: Activity,
    name: "Pediatria",
    description: "Control de ninos y adolescentes, vacunacion y desarrollo saludable.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "hover:border-emerald-300",
  },
  {
    icon: Shield,
    name: "Traumatologia",
    description: "Lesiones osteoarticulares, rehabilitacion y cirugia ortopedica.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "hover:border-amber-300",
  },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    nombre: string;
    email: string;
  } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quickPanel, setQuickPanel] = useState<PanelId | null>(null);
  const [cartillaEspecialidad, setCartillaEspecialidad] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const session = localStorage.getItem("cmd_session");
    if (session) {
      const data = JSON.parse(session);
      setCurrentUser({ nombre: data.name, email: data.email });
      setIsLoggedIn(true);
    }
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleLogin = (user: { email: string; name: string }) => {
    setIsLoggedIn(true);
    setCurrentUser({ nombre: user.name, email: user.email });
    setShowLogin(false);
    setShowBooking(true);
  };

  const handleReservarTurno = () => {
    if (isLoggedIn) {
      setShowBooking(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cmd_session");
    sessionStorage.clear();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowBooking(false);
    showToast("Cerraste sesión correctamente");
  };

  const handleDescargarExcel = async () => {
    try {
      const response = await fetch("/api/exportar-turnos");
      if (!response.ok) throw new Error("No se pudo generar el Excel");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "turnos.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Turnos exportados correctamente");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al exportar los turnos"
      );
    }
  };

  const handleVerMasEspecialidad = (especialidad: string) => {
    setCartillaEspecialidad(especialidad);
    setQuickPanel("cartilla");
    setTimeout(() => {
      document
        .getElementById("quick-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  if (showBooking && isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg">
                Centro Medico
              </span>
            </div>
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-slate-900 max-w-[140px] truncate">
                    {currentUser.nombre}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesion
              </button>
              <button
                onClick={handleDescargarExcel}
                className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Descargar Excel
              </button>
              <button
                onClick={() => setShowBooking(false)}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center gap-1"
              >
                Volver al inicio
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
        <BookingWidget currentUser={currentUser} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                Centro Medico
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2 font-medium">
                Digital
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#especialidades"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Especialidades
            </a>
            <a
              href="#servicios"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Servicios
            </a>
            <a
              href="#contacto"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Contacto
            </a>
          </nav>

          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                  {currentUser.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight text-left">
                  <p className="text-sm font-semibold text-slate-900 max-w-[150px] truncate">
                    {currentUser.nombre}
                  </p>
                  <p className="text-xs text-slate-400">Cuenta verificada</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-smooth hover:shadow-md group"
              >
                <LogOut className="w-4 h-4 transition-transform duration-300 ease-smooth group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Cerrar Sesion</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Iniciar Sesion
            </button>
          )}
        </div>
      </header>

      {/* Carousel Hero */}
      <section className="relative h-[520px] md:h-[580px] overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-5 border border-white/20">
                <Activity className="w-4 h-4" />
                Tu portal de salud digital
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                {carouselSlides[currentSlide].title}
              </h1>

              <p className="text-white/80 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
                {carouselSlides[currentSlide].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={handleReservarTurno}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center gap-2 active:scale-[0.98]"
                >
                  <Calendar className="w-5 h-5" />
                  Reservar Turno
                </button>
                <a
                  href="#especialidades"
                  className="bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-white/25 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all flex items-center gap-2"
                >
                  Conocer Servicios
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
              Nuestras Especialidades
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Profesionales que{" "}
              <span className="text-blue-600">cuidan de vos</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              Contamos con un equipo medico altamente capacitado en las principales
              especialidades para brindarte la mejor atencion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specialties.map((spec) => (
              <div
                key={spec.name}
                onClick={() => handleVerMasEspecialidad(spec.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleVerMasEspecialidad(spec.name);
                  }
                }}
                className={`bg-white rounded-xl p-6 border border-slate-200 ${spec.borderColor} shadow-card hover:shadow-md transition-all duration-300 cursor-pointer group text-center active:scale-[0.98]`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${spec.iconBg} flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <spec.icon className={`w-7 h-7 ${spec.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {spec.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {spec.description}
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 transition-all duration-300 group-hover:opacity-100 opacity-0">
                  Ver mas <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section id="servicios" className="bg-slate-50 py-20 md:py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-4">
              Accesos Rapidos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
              Todo lo que necesitas,{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-medical-teal bg-clip-text text-transparent">
                en un solo lugar
              </span>
            </h2>
            <p className="text-ink-muted max-w-xl mx-auto text-base">
              Accede rapidamente a las funcionalidades mas utilizadas de nuestro
              portal.
            </p>
          </div>

          <QuickAccess
            openPanel={quickPanel}
            onPanelChange={setQuickPanel}
            especialidad={cartillaEspecialidad}
            onEspecialidadChange={setCartillaEspecialidad}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-slate-900 rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Reserva tu turno ahora
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-8 text-base">
                No esperes mas. Agenda tu cita con un simple clic y recibe la
                atencion que mereces.
              </p>
              <button
                onClick={handleReservarTurno}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3.5 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 active:scale-[0.98]"
              >
                <Calendar className="w-5 h-5" />
                Reservar Turno
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contacto"
        className="bg-slate-50 border-t border-slate-200"
      >
        <div className="container mx-auto px-4 py-14 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900 text-base">
                  Centro Medico Digital
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Tu portal de salud integral. Accede a servicios medicos,
                reserva turnos y gestiona todo online.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4 text-sm">
                Contacto
              </h3>
              <div className="space-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>+54 11 1234-5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>info@centromedicodigital.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Av. Corrientes 1234, CABA</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4 text-sm">
                Horarios
              </h3>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Lunes a Viernes: 8:00 - 20:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Sabados: 8:00 - 14:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <span>
              &copy; {new Date().getFullYear()} Centro Medico Digital. Todos
              los derechos reservados.
            </span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-900 transition-colors">
                Politica de Privacidad
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Terminos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 bg-slate-900 text-white pl-4 pr-5 py-3 rounded-xl shadow-elevated">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
