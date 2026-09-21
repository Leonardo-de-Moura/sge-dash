import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { TicketCard, TicketData } from './TicketCard';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticket }) => {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Ticket do evento"
    >
      <div className="relative w-full max-w-3xl animate-in zoom-in-95 fade-in duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:scale-105 transition-transform cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Painel branco por trás do ticket: garante que os "furos" de perfuração
           combinem com o fundo, independente do que estiver atrás do modal. */}
        <div className="bg-white rounded-[32px] p-3 sm:p-4 shadow-xl">
          <TicketCard ticket={ticket} notchColor="#ffffff" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TicketModal;