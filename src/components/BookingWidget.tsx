"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Heart,
  Activity,
  Shield,
  Loader2,
  User,
  Mail,
  Phone,
  StickyNote,
  ArrowRight,
  PartyPopper,
  Check,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  service: Service | null;
  date: Date | null;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
}

const services: Service[] = [
  {
    id: "clinica",
    name: "Clinica General",
    duration: 30,
    price: 8500,
    icon: <Stethoscope className="w-6 h-6" />,
    iconBg: "bg-primary-50",
    iconColor: "text-primary",
  },
  {
    id: "cardiologia",
    name: "Cardiologia",
    duration: 45,
    price: 12000,
    icon: <Heart className="w-6 h-6" />,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    id: "pediatria",
    name: "Pediatria",
    duration: 30,
    price: 9500,
    icon: <Activity className="w-6 h-6" />,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    id: "traumatologia",
    name: "Traumatologia",
    duration: 40,
    price: 11000,
    icon: <Shield className="w-6 h-6" />,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

const generateTimeSlots = (duration: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour + duration / 60 <= endHour) {
        slots.push({
          time: `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`,
          available: Math.random() > 0.3,
        });
      }
    }
  }
  return slots;
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

const steps = [
  { id: 1, label: "Servicio", icon: Stethoscope },
  { id: 2, label: "Fecha y Hora", icon: Calendar },
  { id: 3, label: "Datos", icon: User },
  { id: 4, label: "Confirmacion", icon: Check },
];

interface BookingWidgetProps {
  currentUser?: { nombre: string; email: string } | null;
}

export default function BookingWidget({
  currentUser,
}: BookingWidgetProps) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    date: null,
    time: "",
    clientName: currentUser?.nombre || "",
    clientEmail: currentUser?.email || "",
    clientPhone: "",
    notes: "",
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = bookingData.service
    ? generateTimeSlots(bookingData.service.duration)
    : [];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleServiceSelect = (service: Service) => {
    setBookingData((prev) => ({ ...prev, service }));
    setStep(2);
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (selectedDate >= today) {
      setBookingData((prev) => ({ ...prev, date: selectedDate, time: "" }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData((prev) => ({ ...prev, time }));
    setStep(3);
  };

  const goToConfirmation = () => {
    setStep(4);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicio: bookingData.service?.name,
          fecha: bookingData.date?.toISOString().split("T")[0],
          hora: bookingData.time,
          clienteNombre: bookingData.clientName,
          clienteEmail: bookingData.clientEmail,
          clienteTelefono: bookingData.clientPhone,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la reserva");
      }

      setShowConfirmation(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar la reserva"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingData({
      service: null,
      date: null,
      time: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    });
    setStep(1);
    setShowConfirmation(false);
    setError(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sortedSlots = [...timeSlots].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <div className="relative min-h-screen bg-surface-secondary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary text-sm font-semibold mb-4">
            <Calendar className="w-4 h-4" />
            Reserva online
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-ink mb-2">
            Reserva tu Turno
          </h1>
          <p className="text-ink-muted max-w-md mx-auto text-sm">
            Elige tu especialidad, fecha y horario para agendar tu cita medica
            en segundos.
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const active = step === s.id;
              const completed = step > s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        completed
                          ? "bg-emerald-500 text-white shadow-sm"
                          : active
                            ? "bg-primary text-white shadow-sm"
                            : "bg-slate-100 text-ink-faint"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        active || completed
                          ? "text-primary"
                          : "text-ink-faint"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex items-center mx-2 md:mx-3 mt-5">
                      <div
                        className={`w-8 md:w-14 h-0.5 rounded ${
                          completed ? "bg-emerald-400" : "bg-slate-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div
          key={step}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-slate-200 animate-slide-up"
        >
          {/* STEP 1: Services */}
          {step === 1 && (
            <div>
              <div className="mb-7">
                <h2 className="text-xl md:text-2xl font-bold text-ink mb-1">
                  Elige una Especialidad
                </h2>
                <p className="text-ink-muted text-sm">
                  Selecciona la especialidad medica que deseas consultar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const selected = bookingData.service?.id === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className={`group relative rounded-xl p-5 text-left transition-all duration-200 border ${
                        selected
                          ? "border-primary bg-primary-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-card"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
                        >
                          <div className={service.iconColor}>{service.icon}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-ink text-base">
                              {service.name}
                            </h3>
                            {selected && (
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-ink-muted mt-0.5 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {service.duration} minutos
                          </p>
                          <div className="flex items-center justify-between mt-2.5">
                            <span className="text-lg font-bold text-ink">
                              ${service.price.toLocaleString()}
                            </span>
                            <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              Reservar <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time */}
          {step === 2 && (
            <div>
              <div className="mb-7">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-primary hover:text-primary-600 transition-colors mb-3 text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Volver a especialidades
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-ink mb-1">
                  Fecha y Hora
                </h2>
                <p className="text-ink-muted text-sm">
                  Selecciona el dia y el horario disponible.
                </p>
              </div>

              <div className="max-w-md mx-auto mb-7">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-ink-muted hover:text-ink"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-base font-semibold text-ink">
                    {monthNames[currentMonth]}{" "}
                    <span className="text-primary">{currentYear}</span>
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-ink-muted hover:text-ink"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-ink-faint py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(currentYear, currentMonth, day);
                    const isPast = date < today;
                    const isToday =
                      date.toDateString() === today.toDateString();
                    const isSelected =
                      bookingData.date?.toDateString() === date.toDateString();

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isPast}
                        className={`aspect-square rounded-lg flex items-center justify-center font-medium text-sm transition-all duration-150 ${
                          isPast
                            ? "text-slate-300 cursor-not-allowed"
                            : isSelected
                              ? "bg-primary text-white shadow-sm"
                              : isToday
                                ? "border border-primary text-primary font-semibold hover:bg-primary-50"
                                : "text-ink-secondary hover:bg-slate-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {bookingData.date && (
                <div className="max-w-md mx-auto border-t border-slate-200 pt-6 animate-fade-in">
                  <p className="text-center text-ink-secondary mb-4 flex items-center justify-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="capitalize font-medium">
                      {formatDate(bookingData.date)}
                    </span>
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                    {sortedSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          slot.available && handleTimeSelect(slot.time)
                        }
                        disabled={!slot.available}
                        className={`py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 ${
                          !slot.available
                            ? "bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                            : bookingData.time === slot.time
                              ? "bg-primary text-white shadow-sm"
                              : "bg-slate-50 text-ink-secondary border border-slate-200 hover:border-primary hover:bg-primary-50 hover:text-primary"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>

                  {bookingData.time && (
                    <button
                      onClick={goToConfirmation}
                      className="mt-5 w-full bg-primary hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      Continuar con Datos <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Personal data */}
          {step === 3 && (
            <div>
              <div className="mb-7">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-primary hover:text-primary-600 transition-colors mb-3 text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Volver
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-ink mb-1">
                  Tus Datos Personales
                </h2>
                <p className="text-ink-muted text-sm">
                  Completa la informacion para confirmar tu reserva.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-secondary rounded-xl p-4 border border-slate-100">
                  <span className="text-ink-faint text-xs font-medium uppercase tracking-wide">
                    Especialidad
                  </span>
                  <p className="text-ink font-semibold mt-1">
                    {bookingData.service?.name}
                  </p>
                </div>
                <div className="bg-surface-secondary rounded-xl p-4 border border-slate-100">
                  <span className="text-ink-faint text-xs font-medium uppercase tracking-wide">
                    Fecha y Hora
                  </span>
                  <p className="text-ink font-semibold capitalize mt-1">
                    {bookingData.date ? formatDate(bookingData.date) : ""} ·{" "}
                    {bookingData.time}
                  </p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input
                      type="text"
                      required
                      value={bookingData.clientName}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          clientName: e.target.value,
                        }))
                      }
                      className="w-full pl-11 pr-4 py-3 bg-surface-secondary border border-slate-200 rounded-lg text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="Juan Perez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input
                      type="email"
                      required
                      value={bookingData.clientEmail}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          clientEmail: e.target.value,
                        }))
                      }
                      className="w-full pl-11 pr-4 py-3 bg-surface-secondary border border-slate-200 rounded-lg text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                    Telefono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input
                      type="tel"
                      required
                      value={bookingData.clientPhone}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          clientPhone: e.target.value,
                        }))
                      }
                      className="w-full pl-11 pr-4 py-3 bg-surface-secondary border border-slate-200 rounded-lg text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                    Notas (opcional)
                  </label>
                  <div className="relative">
                    <StickyNote className="absolute left-3.5 top-3.5 w-4 h-4 text-ink-faint" />
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 bg-surface-secondary border border-slate-200 rounded-lg text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                      placeholder="Sintomas, observaciones..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirmar Reserva
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Confirmation (in-flow) */}
          {step === 4 && !showConfirmation && (
            <div className="text-center py-6">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors mb-6 text-sm font-medium mx-auto"
              >
                <ChevronLeft className="w-4 h-4" /> Volver a editar datos
              </button>

              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in mb-5 shadow-md">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Reserva Confirmada!
              </h2>
              <p className="text-slate-500 mb-7 text-sm">
                Te enviamos un email con los detalles de tu cita.
              </p>

              <div className="bg-slate-50 rounded-xl p-5 text-left max-w-md mx-auto space-y-3 animate-fade-in border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Especialidad</span>
                  <span className="font-medium text-slate-900 text-sm">
                    {bookingData.service?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Fecha</span>
                  <span className="font-medium text-slate-900 capitalize text-sm">
                    {bookingData.date ? formatDate(bookingData.date) : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Hora</span>
                  <span className="font-medium text-slate-900 text-sm">
                    {bookingData.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Paciente</span>
                  <span className="font-medium text-slate-900 text-sm">
                    {bookingData.clientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Email</span>
                  <span className="font-medium text-slate-900 text-sm">
                    {bookingData.clientEmail}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Telefono</span>
                  <span className="font-medium text-slate-900 text-sm">
                    {bookingData.clientPhone}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Costo</span>
                    <span className="font-bold text-emerald-600 text-lg">
                      ${bookingData.service?.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={resetBooking}
                className="mt-7 bg-slate-900 hover:bg-slate-800 text-white py-3 px-8 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto active:scale-[0.98]"
              >
                <PartyPopper className="w-4 h-4" />
                Volver al Inicio
              </button>
            </div>
          )}
        </div>

        {/* Floating Confirmation Modal (after POST) */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-elevated animate-scale-in overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-5 shadow-md animate-scale-in">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Reserva Confirmada!
                </h2>
                <p className="text-slate-500 mb-6 text-sm">
                  Tu cita fue agendada exitosamente
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Especialidad:</span>
                    <span className="font-medium text-slate-900 text-sm">
                      {bookingData.service?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Fecha:</span>
                    <span className="font-medium text-slate-900 capitalize text-sm">
                      {bookingData.date ? formatDate(bookingData.date) : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Hora:</span>
                    <span className="font-medium text-slate-900 text-sm">
                      {bookingData.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Paciente:</span>
                    <span className="font-medium text-slate-900 text-sm">
                      {bookingData.clientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Email:</span>
                    <span className="font-medium text-slate-900 text-sm">
                      {bookingData.clientEmail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Telefono:</span>
                    <span className="font-medium text-slate-900 text-sm">
                      {bookingData.clientPhone}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Costo:</span>
                      <span className="font-bold text-emerald-600 text-lg">
                        ${bookingData.service?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 px-8 py-5 bg-slate-50">
                <button
                  onClick={resetBooking}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
