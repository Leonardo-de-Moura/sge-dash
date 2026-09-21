export type UserRole = 'aluno' | 'professor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  matricula?: string;
  siape?: string;
  avatarUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  speaker?: string;
  location?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  modality: 'Presencial' | 'Online' | 'Híbrido';
  startDate: string;
  endDate?: string;
  workload: string;
  location: string;
  totalSlots: number;
  enrolledSlots: number;
  status: 'Aberto' | 'Esgotado' | 'Encerrado';
  dayMonth: string;
  imageUrl?: string;
  activities?: Activity[];
}

export interface ParticipantAttendance {
  id: string;
  name: string;
  email: string;
  matricula: string;
  status: 'presente' | 'ausente' | 'pendente';
  avatarUrl?: string;
  certificateIssued?: boolean;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  ticketCode: string;
}

export interface CertificateItem {
  id: string;
  eventId: string;
  eventTitle: string;
  issueDate: string;
  workload: string;
  code: string;
  participantName: string;
}
