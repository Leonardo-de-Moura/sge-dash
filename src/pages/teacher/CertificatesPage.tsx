import React, { useState, useEffect, useCallback } from 'react';
import { Search, Award, CheckCircle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { eventsApi } from '../../api/eventsApi';
import { attendanceApi } from '../../api/attendanceApi';
import { certificatesApi } from '../../api/certificatesApi';
import { EventItem, ParticipantAttendance } from '../../types';
import { Button } from '../../components/common/Button';

export const CertificatesPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [participants, setParticipants] = useState<ParticipantAttendance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'presenca' | 'ausentes'>('todos');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAll, setProcessingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoadingEvents(true);
        const data = await eventsApi.getEvents();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      } catch (err: any) {
        console.error('Erro ao carregar eventos:', err);
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, []);

  // Load participants for selected event
  const loadParticipants = useCallback(async (eventId: string) => {
    if (!eventId) return;
    try {
      setLoadingParticipants(true);
      const data = await attendanceApi.getEventAttendance(eventId);
      setParticipants(data);
    } catch (err: any) {
      console.error('Erro ao carregar participantes:', err);
      setErrorMessage(err.message || 'Falha ao buscar participantes do evento');
    } finally {
      setLoadingParticipants(false);
    }
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadParticipants(selectedEventId);
    }
  }, [selectedEventId, loadParticipants]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const filteredParticipants = participants
    .filter((p) => {
      if (filterType === 'presenca') return p.status === 'presente';
      if (filterType === 'ausentes') return p.status === 'ausente';
      return true;
    })
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.matricula && p.matricula.includes(searchTerm))
    );

  const issuedCount = participants.filter((p) => p.certificateIssued).length;
  const pendingCount = participants.filter(
    (p) => p.status === 'presente' && !p.certificateIssued
  ).length;

  const handleEmitSingle = async (p: ParticipantAttendance) => {
    try {
      setProcessingId(p.id);
      const result = await certificatesApi.issueCertificates(selectedEventId, [p.id]);

      if (result.totalIssued === 0) {
        await loadParticipants(selectedEventId);
        setErrorMessage('Nenhum certificado foi emitido. Atualize a lista e confira a presença do participante.');
        setTimeout(() => setErrorMessage(null), 4000);
        return;
      }

      setParticipants((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, certificateIssued: true } : item))
      );
      setToastMessage(`Certificado emitido com sucesso para ${p.name}!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao emitir certificado.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleEmitAll = async () => {
    if (!selectedEventId || processingAll) return;

    try {
      setProcessingAll(true);
      const res = await certificatesApi.issueCertificates(selectedEventId);

      // Refresh list
      await loadParticipants(selectedEventId);
      setToastMessage(`${res.totalIssued} certificados emitidos com sucesso!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao emitir lote de certificados.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setProcessingAll(false);
    }
  };

  return (
    <DashboardLayout
      title="Emitir certificados"
      subtitle="Validação e emissão dos certificados digitais de conclusão com autenticação IFCE"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start text-left">
        {/* Main List Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Event selector bar */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Evento em processamento
              </span>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {selectedEvent?.title || 'Selecione um evento'}
              </h3>
              {selectedEvent && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Carga horária: {selectedEvent.workload} • {selectedEvent.modality}
                </p>
              )}
            </div>
            {events.length > 0 && (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="text-xs font-semibold text-[#006A38] bg-emerald-50 border border-[#C9EEB4] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar discente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#006A38] focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterType('todos')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    filterType === 'todos' ? 'bg-[#006A38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos ({participants.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('presenca')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    filterType === 'presenca' ? 'bg-[#006A38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Presentes ({participants.filter((p) => p.status === 'presente').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('ausentes')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    filterType === 'ausentes' ? 'bg-[#006A38] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Ausentes ({participants.filter((p) => p.status === 'ausente').length})
                </button>
              </div>
            </div>

            {/* Participants list */}
            {loadingParticipants ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-[#006A38] animate-spin" />
                <span className="text-xs font-medium">Buscando inscritos do evento...</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredParticipants.map((p) => {
                  const isProcessing = processingId === p.id;

                  return (
                    <div
                      key={p.id}
                      className="p-4 sm:px-6 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full bg-emerald-100 text-[#006A38] font-bold text-xs flex items-center justify-center flex-shrink-0"
                          title="Foto do aluno"
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <span>{p.matricula || '---'}</span>
                            <span>•</span>
                            <span
                              className={
                                p.status === 'presente'
                                  ? 'text-[#006A38] font-semibold'
                                  : 'text-[#A62B26] font-semibold'
                              }
                            >
                              {p.status === 'presente' ? 'Frequência confirmada' : 'Ausente no evento'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="self-end sm:self-auto">
                        {p.certificateIssued ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C9EEB4] text-[#004D26] text-xs font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Certificado emitido
                          </span>
                        ) : p.status !== 'presente' ? (
                          <span className="text-xs text-gray-400 font-medium italic">
                            Ineligível (ausente)
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={isProcessing || processingAll}
                            onClick={() => handleEmitSingle(p)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#006A38] hover:bg-[#004D26] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isProcessing ? 'Emitindo...' : 'Emitir certificado'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredParticipants.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-xs sm:text-sm">
                    Nenhum participante encontrado com os filtros atuais.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6 text-left">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Award className="w-5 h-5 text-[#006A38]" />
            <h4 className="text-base font-bold text-gray-900">Resumo de Emissão</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-[#C9EEB4]">
              <span className="font-semibold text-gray-700">Certificados Emitidos</span>
              <span className="text-base font-bold text-[#006A38]">{issuedCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="font-semibold text-gray-700">Pendentes de Emissão</span>
              <span className="text-base font-bold text-amber-700">{pendingCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="font-semibold text-gray-700">Ausentes / Inelegíveis</span>
              <span className="text-base font-bold text-gray-500">
                {participants.filter((p) => p.status !== 'presente').length}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={pendingCount === 0 || processingAll}
              onClick={handleEmitAll}
              leftIcon={
                processingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Award className="w-4 h-4" />
                )
              }
            >
              {processingAll ? 'Gerando certificados...' : 'Emitir todos os certificados'}
            </Button>
            <p className="text-[11px] text-gray-400 text-center leading-tight">
              Os certificados serão gerados com assinatura digital do campus e disponibilizados imediatamente aos alunos.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
