import { apiRequest } from './client';
import { Registration } from '../types';

export interface TicketDetails {
  id: string;
  organizer: string;
  year: string;
  eventTitle: string;
  eventDescription?: string;
  date: string;
  time: string;
  location: string;
  statusLabel: string;
  ticketNumber: string;
  participantName: string;
  participantMatricula: string;
}

export const registrationsApi = {
  register: async (eventId: string): Promise<Registration> => {
    return apiRequest<Registration>('/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    });
  },

  getMyRegistrations: async (): Promise<Registration[]> => {
    return apiRequest<Registration[]>('/registrations/my');
  },

  getTicket: async (registrationId: string): Promise<TicketDetails> => {
    return apiRequest<TicketDetails>(`/registrations/${registrationId}/ticket`);
  },

  cancelRegistration: async (registrationId: string): Promise<Registration> => {
    return apiRequest<Registration>(`/registrations/${registrationId}/cancel`, {
      method: 'PATCH',
    });
  },
};
