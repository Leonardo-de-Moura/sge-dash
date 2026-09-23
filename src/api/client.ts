export interface ApiResponse<T = any> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}

export class ApiError extends Error {
  errors: string[];
  statusCode: number;

  constructor(
    message: string,
    errors: string[] = [],
    statusCode: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

const API_BASE_URL = (
  import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('sge_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token might be invalid or expired
      localStorage.removeItem('sge_token');
      // If unauthorized on authenticated route, dispatch event so AuthContext handles it
      window.dispatchEvent(new CustomEvent('sge_unauthorized'));
    }

    // Check if response is json
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (!response.ok) {
        throw new ApiError(`Erro HTTP ${response.status}: ${response.statusText}`, [], response.status);
      }
      return (await response.text()) as unknown as T;
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      const errMsg = data.message || (data.errors && data.errors.length > 0 ? data.errors[0] : 'Erro na requisição');
      throw new ApiError(errMsg, data.errors || [], response.status);
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError((error as Error).message || 'Falha ao conectar com o servidor', [], 500);
  }
}
