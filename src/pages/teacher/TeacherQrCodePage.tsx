import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CalendarDays, Download, Loader2, Printer, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ApiError } from '../../api/client';
import { eventsApi } from '../../api/eventsApi';
import { qrcodeApi } from '../../api/qrcodeApi';
import { EventItem } from '../../types';

export const TeacherQrCodePage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [qrImage, setQrImage] = useState<string>('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingQr, setLoadingQr] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;

  const renderQrCode = useCallback(async (token: string) => {
    const checkInUrl = new URL('/aluno/check-in', window.location.origin);
    checkInUrl.searchParams.set('token', token);
    const dataUrl = await QRCode.toDataURL(checkInUrl, {
      type: 'image/png',
      margin: 1,
      width: 320,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });

    setQrImage(dataUrl);
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const data = await eventsApi.getEvents();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (err: any) {
      console.error('Erro ao carregar eventos:', err);
      setErrorMessage(err.message || 'Falha ao carregar os eventos disponíveis.');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const loadActiveQrCode = useCallback(async (eventId: string) => {
    if (!eventId) {
      setQrImage('');
      return;
    }

    try {
      setLoadingQr(true);
      setErrorMessage(null);
      const qrCode = await qrcodeApi.getEventQrCode(eventId);

      if (qrCode.token) {
        await renderQrCode(qrCode.token);
        return;
      }

      setQrImage('');
    } catch (error: unknown) {
      setQrImage('');
      if (error instanceof ApiError && error.statusCode === 404) {
        return;
      }

      console.error('Erro ao buscar QR Code:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar o QR Code deste evento.'
      );
    } finally {
      setLoadingQr(false);
    }
  }, [renderQrCode]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (selectedEventId) {
      loadActiveQrCode(selectedEventId);
    }
  }, [selectedEventId, loadActiveQrCode]);

  const handleGenerateNewQrCode = async () => {
    if (!selectedEventId) {
      return;
    }

    try {
      setLoadingQr(true);
      setErrorMessage(null);
      const qrCode = await qrcodeApi.generateEventQrCode(selectedEventId, true);
      await renderQrCode(qrCode.token);
    } catch (err: any) {
      console.error('Erro ao gerar novo QR Code:', err);
      setErrorMessage(err.message || 'Não foi possível gerar um novo QR Code para este evento.');
    } finally {
      setLoadingQr(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrImage) {
      return;
    }

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `qrcode-${selectedEvent?.title || 'evento'}.png`;
    link.click();
  };

  const handlePrintQr = () => {
    window.print();
  };

  return (
    <DashboardLayout
      title="QR Code de presença"
      subtitle="Gere e reutilize o código do evento para confirmação de presença"
    >
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-700 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-200" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mx-auto w-full max-w-4xl rounded-[26px] border border-[#E6EBF0] bg-white p-5 shadow-[0_10px_28px_rgba(15,41,34,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 border-b border-[#E6EBF0] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9EEB4] text-[#006A38] shadow-inner">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5F6B67]">
                Evento selecionado
              </div>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-[#1C1C1C] sm:text-[2rem]">
                {selectedEvent?.title || 'Selecione um evento'}
              </h2>
              {selectedEvent && (
                <p className="mt-1 text-sm text-[#575F5A]">
                  {selectedEvent.dayMonth || selectedEvent.startDate} • {selectedEvent.location}
                </p>
              )}
            </div>
          </div>

          {events.length > 0 && (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full rounded-xl border border-[#D8E2DB] bg-[#F7FBF8] px-3 py-2 text-sm font-semibold text-[#0D3A26] focus:outline-none focus:ring-2 focus:ring-[#C9EEB4] sm:max-w-[220px]"
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center gap-6 px-2 py-4">
          {loadingEvents ? (
            <div className="flex flex-col items-center gap-3 text-sm text-[#4E5D56]">
              <Loader2 className="h-8 w-8 animate-spin text-[#006A38]" />
              Carregando eventos...
            </div>
          ) : !selectedEvent ? (
            <div className="text-center text-sm text-[#5F6B67]">
              Nenhum evento está disponível para geração de QR Code.
            </div>
          ) : (
            <>
              <div className="flex w-full justify-center rounded-2xl bg-[#F8FAF9] p-8 shadow-inner ring-1 ring-[#EAEFEA]">
                {loadingQr ? (
                  <div className="flex flex-col items-center gap-3 text-sm text-[#4E5D56]">
                    <Loader2 className="h-10 w-10 animate-spin text-[#006A38]" />
                    Gerando QR Code...
                  </div>
                ) : qrImage ? (
                  <img
                    src={qrImage}
                    alt={`QR Code do evento ${selectedEvent.title}`}
                    className="h-[280px] w-[280px] rounded-xl bg-white p-3 shadow-sm"
                  />
                ) : (
                  <div className="flex h-[280px] w-[280px] items-center justify-center rounded-xl border border-dashed border-[#D0D9D4] bg-white text-xs font-medium text-[#5F6B67]">
                    QR Code indisponível
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#1B1B1B] sm:text-[2.1rem]">
                  Escaneie o QR Code para confirmar sua presença
                </h3>
                <p className="mt-2 text-sm italic text-[#5F6B67]">
                  Código válido para este evento
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerateNewQrCode}
                  disabled={loadingQr}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006A38] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,106,56,0.22)] transition hover:bg-[#005030] disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingQr ? 'animate-spin' : ''}`} />
                  Gerar novo QR Code
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  disabled={!qrImage}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D3E8D7] bg-white px-4 py-3 text-sm font-semibold text-[#006A38] transition hover:bg-[#F1F9F3] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  Baixar PNG
                </button>

                <button
                  type="button"
                  onClick={handlePrintQr}
                  disabled={!qrImage}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D3E8D7] bg-white px-4 py-3 text-sm font-semibold text-[#006A38] transition hover:bg-[#F1F9F3] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
