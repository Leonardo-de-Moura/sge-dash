import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, QrCode } from 'lucide-react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { attendanceApi } from '../../api/attendanceApi';
import { useAuth } from '../../context/AuthContext';

export const StudentCheckInPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, role, logout } = useAuth();
  const token = searchParams.get('token')?.trim() ?? '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const returnTo = `${location.pathname}${location.search}`;

  const handleCheckIn = async () => {
    if (!token || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await attendanceApi.checkInWithQrCode(token);
      setEventTitle(result.eventTitle);
      setMessage(
        result.alreadyRegistered
          ? 'Sua presença neste evento já estava confirmada.'
          : 'Sua presença foi confirmada com sucesso.'
      );
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Não foi possível confirmar a presença. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9EEB4]/50 text-[#006A38]">
          {message ? <CheckCircle2 className="h-8 w-8" /> : <QrCode className="h-8 w-8" />}
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Confirmação de presença</h1>
        <p className="mt-2 text-sm text-gray-600">
          {eventTitle
            ? `Evento: ${eventTitle}`
            : 'Confirme sua presença no evento associado a este QR Code.'}
        </p>

        {!token && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-left text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            Este QR Code não contém um código de confirmação válido.
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-left text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {errorMessage}
          </div>
        )}

        {message && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-left text-sm text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {message}
          </div>
        )}

        {!message && isLoading && (
          <div className="mt-7 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin text-[#006A38]" />
            Verificando sua sessão...
          </div>
        )}

        {!message && !isLoading && !isAuthenticated && token && (
          <Link
            to="/login/aluno"
            state={{ returnTo }}
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#006A38] px-5 py-3 font-semibold text-white transition hover:bg-[#005030]"
          >
            Entrar como aluno para continuar
          </Link>
        )}

        {!message && !isLoading && isAuthenticated && role !== 'aluno' && (
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login/aluno', { state: { returnTo } });
            }}
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#006A38] px-5 py-3 font-semibold text-white transition hover:bg-[#005030]"
          >
            Trocar para uma conta de aluno
          </button>
        )}

        {!message && !isLoading && isAuthenticated && role === 'aluno' && token && (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={isSubmitting}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#006A38] px-5 py-3 font-semibold text-white transition hover:bg-[#005030] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {isSubmitting ? 'Confirmando...' : 'Confirmar minha presença'}
          </button>
        )}
      </section>
    </main>
  );
};
