import { apiRequest } from './client';
import { EventItem, Activity } from '../types';

export interface CreateEventRequest {
  title: string;
  description: string;
  category: string;
  modality: string;
  startDate: string;
  endDate?: string;
  workload: string;
  location: string;
  totalSlots: number;
  dayMonth?: string;
  activities?: Array<{
    title: string;
    time: string;
    speaker?: string;
    location?: string;
  }>;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  category?: string;
  modality?: string;
  startDate?: string;
  endDate?: string;
  workload?: string;
  location?: string;
  totalSlots?: number;
  status?: string;
}

export interface DashboardStats {
  eventsUnderManagement: number;
  activeEventsCount: number;
  totalEnrolledCount: number;
  todayNewEnrolledCount: number;
  confirmedAttendancePercentage: number;
  issuedCertificatesCount: number;
  pendingCertificatesCount: number;
}

export const eventsApi = {
  getEvents: async (params?: {
    search?: string;
    category?: string;
    modality?: string;
    status?: string;
  }): Promise<EventItem[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'Todos') query.append('category', params.category);
    if (params?.modality) query.append('modality', params.modality);
    if (params?.status) query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    const rawEvents = await apiRequest<any[]>(endpoint);

    // Format dates to match UI expectations if ISO string is returned
    return rawEvents.map((ev) => {
      const start = ev.startDate ? new Date(ev.startDate) : new Date();
      const end = ev.endDate ? new Date(ev.endDate) : undefined;
      const day = String(start.getDate()).padStart(2, '0');
      const month = start.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
      
      const formattedStartDate = `${day}/${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()}`;
      const formattedEndDate = end ? `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}` : undefined;

      return {
        id: ev.id.toString(),
        title: ev.title,
        description: ev.description,
        category: ev.category,
        modality: ev.modality,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        dayMonth: ev.dayMonth || `${day} ${month}`,
        workload: ev.workload,
        location: ev.location,
        totalSlots: ev.totalSlots,
        enrolledSlots: ev.enrolledSlots,
        status: ev.status,
        imageUrl: ev.imageUrl,
        activities: ev.activities || [],
      } as EventItem;
    });
  },

  getEventById: async (id: string): Promise<EventItem> => {
    const ev = await apiRequest<any>(`/events/${id}`);
    const start = ev.startDate ? new Date(ev.startDate) : new Date();
    const end = ev.endDate ? new Date(ev.endDate) : undefined;
    const day = String(start.getDate()).padStart(2, '0');
    const month = start.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');

    return {
      id: ev.id.toString(),
      title: ev.title,
      description: ev.description,
      category: ev.category,
      modality: ev.modality,
      startDate: `${day}/${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()}`,
      endDate: end ? `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}` : undefined,
      dayMonth: ev.dayMonth || `${day} ${month}`,
      workload: ev.workload,
      location: ev.location,
      totalSlots: ev.totalSlots,
      enrolledSlots: ev.enrolledSlots,
      status: ev.status,
      imageUrl: ev.imageUrl,
      activities: ev.activities || [],
    };
  },

  createEvent: async (data: CreateEventRequest): Promise<EventItem> => {
    return apiRequest<EventItem>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEvent: async (id: string, data: UpdateEventRequest): Promise<EventItem> => {
    return apiRequest<EventItem>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteEvent: async (id: string): Promise<void> => {
    return apiRequest<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>('/events/dashboard/stats');
  },
};
