import React, { useState } from 'react';
import { MessageCircle, X, Send, Clock, PhoneCall } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userText, setUserText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = userText.trim() || 'Hola Romero Estudio, me gustaría solicitar asesoramiento para un proyecto de arquitectura.';
    const url = `https://wa.me/5491100000000?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setUserText('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Interactive Chat Popup */}
      {isOpen && (
        <div
          id="whatsapp-chat-modal"
          className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#e5e5e5] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Top Bar */}
          <div className="bg-[#111111] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                RE
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide">Romero Estudio</h4>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  En línea • Respuesta en &lt;15 min
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
              aria-label="Cerrar chat WhatsApp"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body with sample message */}
          <div className="p-4 bg-[#f8f9fa] flex flex-col gap-3 max-h-60 overflow-y-auto text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-black/5 text-[#1a1c1c] max-w-[85%]">
              <p className="font-semibold text-[13px] text-[#111111] mb-1">
                ¡Hola! Bienvenido a Romero Estudio.
              </p>
              <p className="text-[#5e5e5e] leading-relaxed">
                ¿Tenés una idea para una obra nueva o reforma integral? Escribinos y coordinemos un primer diagnóstico técnico.
              </p>
              <span className="block mt-1.5 text-[10px] text-gray-400 text-right">Ahora</span>
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#e5e5e5] flex gap-2">
            <input
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="flex-1 px-3 py-2 text-xs bg-[#f3f3f3] rounded-xl border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
              aria-label="Enviar por WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contactar por WhatsApp"
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl active:scale-95 cursor-pointer"
      >
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="font-bold text-xs tracking-wider uppercase hidden sm:inline-block">
          WhatsApp Directo
        </span>
      </button>
    </div>
  );
};
