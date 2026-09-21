import React from 'react';
import { CalendarDays, Clock, MapPin, CheckCircle2, Barcode } from 'lucide-react';

export interface TicketData {
  id: string;
  organizer?: string;
  year?: string;
  eventTitle: string;
  eventDescription?: string;
  date: string;
  time?: string;
  location?: string;
  statusLabel?: string;
  ticketNumber?: string;
  participantName?: string;
  participantMatricula?: string;
}

interface ConcentricCirclesProps {
  flip?: boolean;
}


interface TicketCardProps {
  ticket: TicketData;
  /** Cor de fundo do painel que envolve o ticket (usada nos "furos" de perfuração). */
  notchColor?: string;
  className?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  notchColor = '#ffffff',
  className = '',
}) => {
  const {
    organizer = 'SGE-IFCE',
    year = new Date().getFullYear().toString(),
    eventTitle,
    eventDescription,
    date,
    time,
    location,
    statusLabel = 'Inscrição confirmada',
    ticketNumber = '0000',
  } = ticket;

  return (
    <div
      className={`relative flex w-full rounded-[28px] overflow-hidden shadow-2xl ${className}`}
    >
      {/* Canhoto esquerdo */}
      <div className="relative flex-1 min-w-0 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="w-5.5 h-5.5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-extrabold text-gray-900 tracking-tight">
            {organizer}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 uppercase tracking-tight">
            Ticket de evento
          </h2>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#C9EEB4] text-[#004D26]">
            {year}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug mb-2 pr-2">
          {eventTitle}
        </h1>

        {eventDescription && (
          <p className="text-xs sm:text-sm text-gray-600 mb-5 max-w-sm leading-relaxed">
            {eventDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-gray-800">Data:</p>
              <p className="text-gray-600">{date}</p>
            </div>
          </div>
          {time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-gray-800">Horário:</p>
                <p className="text-gray-600">{time}</p>
              </div>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-gray-800">Local:</p>
                <p className="text-gray-600">{location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Decoração (círculos concêntricos), escondida em telas muito pequenas */}
       
      </div>

      {/* Perfuração entre os dois canhotos */}
      <div className="relative w-0 flex-shrink-0">
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full z-10"
          style={{ backgroundColor: notchColor }}
        />
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full z-10"
          style={{ backgroundColor: notchColor }}
        />
        <div className="h-full border-l-2 border-dashed border-white/40" />
      </div>

      {/* Canhoto direito */}
      <div className="relative bg-[#006A38] text-white px-5 sm:px-7 py-6 sm:py-8 flex items-center justify-between gap-3 w-[210px] sm:w-[250px] flex-shrink-0">
        <div className="space-y-4 sm:space-y-5 min-w-0">
          <p className="text-[11px] font-bold text-emerald-100/80 uppercase tracking-wide truncate">
            {organizer} | {year}
          </p>

          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#C9EEB4] flex-shrink-0" />
            <p className="text-xs sm:text-sm font-bold leading-snug">
              {statusLabel.toUpperCase()}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-emerald-100/80 uppercase">Data:</p>
            <p className="text-xs sm:text-sm font-bold leading-snug">
              {date}
              {time ? ` · ${time}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 h-full flex-shrink-0">
          <Barcode className="w-5 sm:w-6 h-16 sm:h-20 text-white" strokeWidth={1.25} />
          <span
            className="text-[8px] sm:text-[9px] font-bold tracking-widest text-emerald-50/90 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl' }}
          >
            INGRESSO Nº {ticketNumber}
          </span>
        </div>
      </div>
    </div>
  );
};