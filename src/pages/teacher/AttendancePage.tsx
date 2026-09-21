import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Check,
  CheckCircle2,
  Users,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { eventsApi } from '../../api/eventsApi';
import { attendanceApi } from '../../api/attendanceApi';
import { EventItem, ParticipantAttendance } from '../../types';
import { Button } from '../../components/common/Button';

export const AttendancePage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [participants, setParticipants] = useState<ParticipantAttendance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load list of events for the teacher
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
        setErrorMessage(err.message || 'Falha ao buscar eventos');
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, []);

  // Load participants for the selected event
  const loadParticipants = useCallback(async (eventId: string) => {
    if (!eventId) return;
    try {
      setLoadingParticipants(true);
      const data = await attendanceApi.getEventAttendance(eventId);
      setParticipants(data);
    } catch (err: any) {
      console.error('Erro ao carregar lista de presença:', err);
      setErrorMessage(err.message || 'Falha ao carregar inscritos do evento');
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

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.matricula && p.matricula.includes(searchTerm))
  );

  const presentCount = participants.filter((p) => p.status === 'presente').length;
  const absentCount = participants.filter((p) => p.status === 'ausente' || !p.status).length;
  const totalCount = participants.length;

  const toggleStatus = (id: string, newStatus: 'presente' | 'ausente') => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleSaveAttendance = async () => {
    if (!selectedEventId || isSaving) return;

    try {
      setIsSaving(true);
      await attendanceApi.bulkUpdateAttendance(
        selectedEventId,
        participants.map((p) => ({
          id: p.id,
          status: p.status || 'ausente',
        }))
      );

      setToastMessage(`Presenças sincronizadas no banco para "${selectedEvent?.title || 'o evento'}"!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar presenças.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Confirmar presença"
      subtitle="Controle a frequência dos discentes inscritos para emissão dos certificados"
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

      <div className="space-y-6 text-left">
        {/* Event selector bar & stats */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase font-bold text-gray-400 block mb-1">
              Evento Selecionado
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedEvent?.title || 'Selecione um evento'}
              </h3>
              {events.length > 0 && (
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="text-xs font-semibold text-[#006A38] bg-emerald-50 border border-[#C9EEB4] rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {selectedEvent && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedEvent.dayMonth} • {selectedEvent.location}
              </p>
            )}
          </div>

          {/* Quick Counter Badges matching Figma */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Inscritos
              </span>
              <span className="text-sm font-bold text-gray-800">
                {totalCount}
              </span>
            </div>
            <div className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-emerald-50 border border-[#C9EEB4] text-center">
              <span className="text-[10px] uppercase font-bold text-[#006A38] block">
                Presentes
              </span>
              <span className="text-sm font-bold text-[#006A38]">
                {presentCount}
              </span>
            </div>
            <div className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-red-50 border border-[#EFC8C3] text-center">
              <span className="text-[10px] uppercase font-bold text-[#A62B26] block">
                Ausentes
              </span>
              <span className="text-sm font-bold text-[#A62B26]">
                {absentCount}
              </span>
            </div>
          </div>
        </div>

        {/* Participants Table / List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar participante por nome ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#006A38] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="primary"
                size="sm"
                disabled={isSaving || participants.length === 0}
                onClick={handleSaveAttendance}
                leftIcon={isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              >
                {isSaving ? 'Salvando no banco...' : 'Salvar presenças'}
              </Button>
            </div>
          </div>

          {/* List items */}
          {loadingParticipants ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-[#006A38] animate-spin" />
              <span className="text-xs font-medium">Buscando inscritos no banco de dados...</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredParticipants.map((p) => {
                const isPresent = p.status === 'presente';

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:px-6 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-emerald-100/70 text-[#006A38] font-bold text-xs flex items-center justify-center flex-shrink-0"
                        title="Foto do aluno"
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          Matrícula:{' '}
                          <span className="font-mono font-medium">
                            {p.matricula || '---'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Status toggle buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => toggleStatus(p.id, 'presente')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPresent
                            ? 'bg-[#006A38] text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Presente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStatus(p.id, 'ausente')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                          !isPresent
                            ? 'bg-[#A62B26] text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Ausente</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredParticipants.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-xs sm:text-sm">
                  Nenhum participante encontrado para este evento.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
