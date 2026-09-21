import { TicketData } from '../components/cards/TicketCard';
import { Registration, EventItem } from '../types';

export function buildTicketData(registration: Registration, event?: EventItem): TicketData {
  // Deriva um "horário" a partir da primeira e última atividade do evento,
  // já que EventItem não tem um campo de horário único (só startDate/endDate + activities).
  const time =
    event?.activities && event.activities.length > 0
      ? `${event.activities[0].time.split('-')[0].trim()} às ${
          event.activities[event.activities.length - 1].time.split('-')[1]?.trim() ?? ''
        }`
      : undefined;

  return {
    id: registration.id,
    eventTitle: registration.eventTitle,
    date: registration.date,
    statusLabel: registration.status,
    ticketNumber: registration.ticketCode,
    time,
    location: event?.location,
    eventDescription: event?.description,
  };
}