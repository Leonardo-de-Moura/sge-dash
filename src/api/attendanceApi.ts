import { apiRequest } from './client';
import { ParticipantAttendance } from '../types';

export interface CheckInResult {
  eventId: string;
  eventTitle: string;
  status: string;
  checkedInAt: string;
  alreadyRegistered: boolean;
}

export const attendanceApi = {
  getEventAttendance: async (eventId: string): Promise<ParticipantAttendance[]> => {
    return apiRequest<ParticipantAttendance[]>(`/attendance/event/${eventId}`);
  },

  updateAttendance: async (
    id: string,
    status: 'presente' | 'ausente' | 'pendente'
  ): Promise<ParticipantAttendance> => {
    return apiRequest<ParticipantAttendance>(`/attendance/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  bulkUpdateAttendance: async (
    eventId: string,
    attendances: Array<{ id: string; status: 'presente' | 'ausente' | 'pendente' }>
  ): Promise<void> => {
    return apiRequest<void>('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify({ eventId, attendances }),
    });
  },

  checkInWithQrCode: async (token: string): Promise<CheckInResult> => {
    return apiRequest<CheckInResult>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};
