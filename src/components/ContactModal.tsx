import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, Ruler, Mail, User, MessageSquare } from 'lucide-react';
import { ContactMessage } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmitMessage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Obra Nueva');
  const [area, setArea] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    onSubmitMessage({
      name,
      email,
      projectType,
      estimatedArea: area ? `${area} m²` : undefined,
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setArea('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="contact-form-modal-container"
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#e5e5e5] overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 flex items-start justify-between border-b border-[#f3f3f3]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block mb-1">
              Romero Estudio • Contacto
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-[#111111]">
              Contanos tu proyecto
            </h3>
            <p className="text-xs text-[#5e5e5e] mt-1">
              Completá el formulario para coordinar una primera evaluación técnica y diagnóstico de obra.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5e5e5e] hover:text-black hover:bg-[#f3f3f3] rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 pt-6">
          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#111111] mb-1">
                ¡Mensaje recibido con éxito!
              </h4>
              <p className="text-sm text-[#5e5e5e] max-w-sm">
                Un arquitecto de nuestro equipo analizará los requerimientos técnicos y te responderá a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Nombre completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Julieta Pérez"
                    className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-sm text-[#1a1c1c] focus:border-[#111111] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email de contacto *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-sm text-[#1a1c1c] focus:border-[#111111] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Tipo de Intervención</span>
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-sm text-[#1a1c1c] focus:border-[#111111] focus:bg-white focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Obra Nueva">Obra Nueva</option>
                    <option value="Reforma Integral">Reforma Integral</option>
                    <option value="Comercial / Oficinas">Comercial / Oficinas</option>
                    <option value="Dirección Técnica">Dirección Técnica</option>
                    <option value="Consultoría / Proyecto Ejecutivo">Consultoría Técnica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Superficie estimada (m²)</span>
                  </label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ej. 250"
                    className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-sm text-[#1a1c1c] focus:border-[#111111] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Detalle de la propuesta o requerimientos *</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describí tu idea, ubicación, plazos deseados o cualquier detalle relevante..."
                  className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-sm text-[#1a1c1c] focus:border-[#111111] focus:bg-white focus:outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-[#f3f3f3] flex items-center justify-between">
                <span className="text-[11px] text-[#5e5e5e]">
                  * Datos estrictamente confidenciales.
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>Enviar Consulta</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
