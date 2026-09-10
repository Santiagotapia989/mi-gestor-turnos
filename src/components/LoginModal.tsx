"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  Stethoscope,
  Loader2,
  ArrowRight,
  User,
} from "lucide-react";

interface UserSession {
  email: string;
  name: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserSession) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? "registro" : "login";
      const payload = isRegister
        ? { nombre: name, email, password }
        : { email, password };

      const response = await fetch(
        `http://localhost:5678/webhook/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          (data && data.error) ||
            (isRegister
              ? "Error al crear la cuenta"
              : "Email o contraseña incorrectos")
        );
        return;
      }

      const data = await response.json().catch(() => null);
      const user = {
        email,
        name:
          isRegister
            ? name
            : data?.nombre ||
              data?.name ||
              data?.user?.nombre ||
              data?.user?.name ||
              email.split("@")[0],
      };

      localStorage.setItem("cmd_session", JSON.stringify(user));
      onLogin(user);
    } catch {
      setError(
        "No se pudo conectar con el servidor de autenticación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-elevated animate-scale-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors text-ink-muted hover:text-ink"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-primary-50 flex items-center justify-center mb-4">
            <Stethoscope className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-1">
            {isRegister ? "Crear Cuenta" : "Iniciar Sesion"}
          </h2>
          <p className="text-ink-muted text-sm">
            {isRegister
              ? "Registrate para acceder al portal"
              : "Accede a tu panel de salud"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-faint" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-secondary border border-slate-200 rounded-lg text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                  placeholder="Juan Perez"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-faint" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-secondary border border-slate-200 rounded-lg text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1.5">
              Contrasena
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-faint" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-surface-secondary border border-slate-200 rounded-lg text-ink placeholder-ink-faint focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
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
            className="w-full bg-primary hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isRegister ? "Creando cuenta..." : "Ingresando..."}
              </>
            ) : (
              <>
                {isRegister ? "Crear Cuenta" : "Iniciar Sesion"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-sm text-ink-muted hover:text-primary transition-colors"
          >
            {isRegister
              ? "Ya tenes cuenta? Inicia sesion"
              : "No tenes cuenta? Registrate"}
          </button>
        </div>
      </div>
    </div>
  );
}
