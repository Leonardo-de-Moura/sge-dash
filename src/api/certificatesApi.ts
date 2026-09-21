import { apiRequest } from './client';
import { CertificateItem } from '../types';

export interface ValidatedCertificate {
  valid: boolean;
  code: string;
  participantName: string;
  eventTitle: string;
  workload: string;
  issueDate: string;
  institution: string;
}

export interface IssueResult {
  totalIssued: number;
  issuedCodes: string[];
}

export const certificatesApi = {
  getMyCertificates: async (): Promise<CertificateItem[]> => {
    return apiRequest<CertificateItem[]>('/certificates/my');
  },

  validateCertificate: async (code: string): Promise<ValidatedCertificate> => {
    return apiRequest<ValidatedCertificate>(`/certificates/validate/${encodeURIComponent(code)}`);
  },

  issueCertificates: async (
    eventId: string,
    attendanceIds?: string[]
  ): Promise<IssueResult> => {
    return apiRequest<IssueResult>('/certificates/issue', {
      method: 'POST',
      body: JSON.stringify({ eventId, attendanceIds }),
    });
  },

  downloadCertificatePdf: async (certificateId: string, filename?: string): Promise<void> => {
    const token = localStorage.getItem('sge_token');
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/certificates/${certificateId}/download`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao baixar o certificado em PDF.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `certificado-${certificateId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
