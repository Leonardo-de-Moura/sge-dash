import { apiRequest } from './client';
import { EventQrCodeData } from '../types';

export const qrcodeApi = {
  generateEventQrCode: async (eventId: string, forceGenerate = false): Promise<EventQrCodeData> => {
    return apiRequest<EventQrCodeData>(`/events/${encodeURIComponent(eventId)}/qrcode`, {
      method: 'POST',
      body: JSON.stringify({ forceGenerate }),
    });
  },

  getEventQrCode: async (eventId: string): Promise<EventQrCodeData> => {
    return apiRequest<EventQrCodeData>(`/events/${encodeURIComponent(eventId)}/qrcode`);
  },
};
