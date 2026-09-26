import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Download, ExternalLink, XCircle, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { TicketModal } from '../../components/cards/TicketModal.tsx';
import { registrationsApi } from '../../api/registrationsApi';
import { eventsApi } from '../../api/eventsApi';
import { Registration, EventItem } from '../../types';
import { TicketData } from '../../components/cards/TicketCard';

export const StudentRegistrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, EventItem>>({});
  const [loading, setLoading] = useState(true);
  const [openTicket, setOpenTicket] = useState<TicketData | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const [regs, evts] = await Promise.all([
        registrationsApi.getMyRegistrations(),
        eventsApi.getEvents().catch(() => []),
      ]);
      setRegistrations(regs.filter((registration) => registration.status !== 'cancelado'));

      const map: Record<string, EventItem> = {};
      evts.forEach((e) => {
        map[e.id] = e;
      });
      setEventsMap(map);
    } catch (err: any) {
      console.error('Erro ao carregar inscrições:', err);
      setErrorMessage(err.message || 'Falha ao carregar suas inscrições.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const handleConfirmCancel = async (id: string) => {
    try {
      setProcessingCancel(true);
      await registrationsApi.cancelRegistration(id);
      setRegistrations((prev) => prev.filter((registration) => registration.id !== id));
      setToastMessage('Inscrição cancelada com sucesso.');
      setTimeout(() => setToastMessage(null), 3500);
      setCancelingId(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao cancelar inscrição.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setProcessingCancel(false);
    }
  };

  const handleOpenTicket = async (reg: Registration) => {
    try {
      const ticketInfo = await registrationsApi.getTicket(reg.id);
      setOpenTicket({
        id: reg.id,
        eventTitle: ticketInfo.eventTitle,
        date: ticketInfo.date,
        statusLabel: ticketInfo.statusLabel,
        ticketNumber: ticketInfo.ticketNumber,
        time: ticketInfo.time,
        location: ticketInfo.location,
        eventDescription: ticketInfo.eventDescription,
        participantName: ticketInfo.participantName,
        participantMatricula: ticketInfo.participantMatricula,
      });
    } catch {
      // Fallback from local state
      const ev = eventsMap[reg.eventId];
      setOpenTicket({
        id: reg.id,
        eventTitle: reg.eventTitle,
        date: reg.date,
        statusLabel: reg.status,
        ticketNumber: reg.ticketCode,
        location: ev?.location || 'IFCE Campus Cedro',
        eventDescription: ev?.description,
      });
    }
  };

  return (
    <DashboardLayout
      title="Minhas Inscrições"
      subtitle="Acompanhe seus eventos confirmados e acesse seus comprovantes de inscrição"
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#006A38] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#C9EEB4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-700 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs sm:text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-200" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4 max-w-6xl text-left">
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#006A38] animate-spin" />
            <span className="text-sm font-medium">Buscando suas inscrições...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {registrations.map((reg) => {
              const event = eventsMap[reg.eventId];
              const isCancelled = reg.status === 'cancelado';
              const isConfirming = cancelingId === reg.id;

              return (
                <div
                  key={reg.id}
                  className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          isCancelled
                            ? 'bg-red-100 text-red-700'
                            : 'bg-[#C9EEB4] text-[#004D26]'
                        }`}
                      >
                        Inscrição {reg.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {reg.eventTitle}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#006A38]" />
                        {reg.date}
                      </span>
                      {event && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#006A38]" />
                          {event.location.split('-')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {isConfirming ? (
                      <>
                        <span className="text-xs font-semibold text-gray-600 mr-1">
                          Confirmar cancelamento?
                        </span>
                        <button
                          type="button"
                          disabled={processingCancel}
                          onClick={() => setCancelingId(null)}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          disabled={processingCancel}
                          onClick={() => handleConfirmCancel(reg.id)}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {processingCancel ? 'Cancelando...' : 'Sim, cancelar'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={isCancelled}
                          onClick={() => setCancelingId(reg.id)}
                          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelar Inscrição</span>
                        </button>

                        <button
                          type="button"
                          disabled={isCancelled}
                          onClick={() => handleOpenTicket(reg)}
                          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Ticket do Evento</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenTicket(reg)}
                          className="px-4 py-2 rounded-xl bg-[#006A38] hover:bg-[#004D26] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Ver Detalhes</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {registrations.length === 0 && !loading && (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
                <p className="text-sm font-semibold text-gray-700">Nenhuma inscrição encontrada</p>
                <p className="text-xs text-gray-500 mt-1">Navegue pelos eventos disponíveis e inscreva-se para começar.</p>
                <button
                  type="button"
                  onClick={() => navigate('/aluno/eventos')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#006A38] text-white text-xs font-bold hover:bg-[#004D26] transition-colors cursor-pointer"
                >
                  Explorar eventos
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <TicketModal
        isOpen={!!openTicket}
        onClose={() => setOpenTicket(null)}
        ticket={openTicket}
      />
    </DashboardLayout>
  );
};
