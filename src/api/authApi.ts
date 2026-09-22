import { apiRequest } from './client';
import { UserRole } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Aluno' | 'Professor';
  matricula?: string;
  siape?: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: UserProfile;
}

export interface RegisterStudentRequest {
  name: string;
  email: string;
  matricula: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterTeacherRequest {
  name: string;
  email: string;
  siape: string;
  password: string;
  confirmPassword: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  registerStudent: async (data: RegisterStudentRequest): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  registerTeacher: async (data: RegisterTeacherRequest): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/auth/register/teacher', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/auth/profile');
  },

  forgotPassword: async (email: string): Promise<void> => {
    return apiRequest<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
