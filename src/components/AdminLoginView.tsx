import React, { useState } from 'react';
import { Logo } from './Logo';
import { ScreenView } from '../types';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../api';

interface AdminLoginViewProps {
  onLoginSuccess: (user: any) => void;
  onNavigateBack: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onNavigateBack,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await api.login(username, password);
      if (result.success && result.user) {
        if (rememberMe) {
          localStorage.setItem('romero_admin_session', JSON.stringify(result.user));
        } else {
          sessionStorage.setItem('romero_admin_session', JSON.stringify(result.user));
        }
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.error || 'Credenciales incorrectas. Verifica tus datos.');
      }
    } catch (err) {
      setErrorMessage('Ocurrió un error al intentar autenticar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setUsername('admin@romeroestudio.com');
    setPassword('romeroestudio');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col justify-center items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Return to public site */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5e5e5e] hover:text-[#111111] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Volver al Sitio Web</span>
        </button>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#888888]">
          Seguridad Romero
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e5e5] p-8 sm:p-10 shadow-xl shadow-black/5">
        {/* Logo and Brand Title */}
        <div className="text-center flex flex-col items-center">
          <Logo variant="dark" size="lg" />
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-[#e5e5e5] mt-6">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-600">
              Acceso Restringido
            </span>
          </div>

          <h1 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight text-[#111111]">
            Panel de Gestión
          </h1>
          <p className="mt-1.5 text-xs text-[#5e5e5e] font-normal max-w-xs">
            Inicia sesión para administrar obras, contenidos institucionales y consultas.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Usuario o Correo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@romeroestudio.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#888888] hover:text-[#111111] transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#cccccc] text-[#111111] focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-[#111111]"
              />
              <span className="text-xs text-[#5e5e5e]">Recordar sesión</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verificando...</span>
              </>
            ) : (
              <span>Ingresar al Panel</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="mt-8 pt-6 border-t border-[#f0f0f0]">
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-[11px] text-[#5e5e5e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-neutral-700" />
                Credenciales de Prueba:
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-[10px] font-extrabold uppercase tracking-widest text-[#111111] hover:underline cursor-pointer bg-white px-2 py-0.5 rounded-md border border-neutral-200"
              >
                Autorrellenar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-neutral-600">
              <div>
                <span className="block text-[9px] font-sans font-semibold text-neutral-400 uppercase">Usuario:</span>
                admin@romeroestudio.com
              </div>
              <div>
                <span className="block text-[9px] font-sans font-semibold text-neutral-400 uppercase">Clave:</span>
                romeroestudio
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-[11px] text-neutral-400">
        © {new Date().getFullYear()} Romero Estudio • Arquitectura Integral
      </div>
    </div>
  );
};
