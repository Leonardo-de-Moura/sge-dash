import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Award, Ticket, CheckCircle, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EventCard } from '../../components/cards/EventCard';
import { eventsApi } from '../../api/eventsApi';
import { registrationsApi } from '../../api/registrationsApi';
import { certificatesApi } from '../../api/certificatesApi';
import { EventItem, Registration, CertificateItem } from '../../types';
import { CalendarDays } from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [myCertificates, setMyCertificates] = useState<CertificateItem[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = ['Todos', 'Palestra', 'Minicurso', 'Congresso', 'Oficina'];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsData, regsData, certsData] = await Promise.all([
        eventsApi.getEvents(),
        registrationsApi.getMyRegistrations().catch(() => [] as Registration[]),
        certificatesApi.getMyCertificates().catch(() => [] as CertificateItem[]),
      ]);

      setEvents(eventsData);
      setMyRegistrations(regsData);
      setMyCertificates(certsData);
      setRegisteredEventIds(
        regsData
          .filter((r) => r.status === 'confirmado')
          .map((r) => r.eventId)
      );
    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setErrorMessage(err.message || 'Falha ao carregar eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleRegister = async (event: EventItem) => {
    if (registeredEventIds.includes(event.id) || registeringId) return;

    try {
      setRegisteringId(event.id);
      await registrationsApi.register(event.id);
      setRegisteredEventIds((prev) => [...prev, event.id]);
      setToastMessage(`Inscrição confirmada em "${event.title}"!`);
      // Reload registrations in background to sync
      const regs = await registrationsApi.getMyRegistrations();
      setMyRegistrations(regs);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar inscrição.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setRegisteringId(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleDownloadCert = async (cert: CertificateItem) => {
    try {
      await certificatesApi.downloadCertificatePdf(cert.id, `Certificado-${cert.validationCode}.pdf`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao baixar certificado.');
      setTimeout(() => setErrorMessage(null), 3500);
    }
  };

  return (
    <DashboardLayout>
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#006A38] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs sm:text-sm font-semibold">
          <CheckCircle className="w-5 h-5 text-[#C9EEB4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs sm:text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-200" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left content (events) + Right widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left main area (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Welcome Banner matching Figma */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-[#C9EEB4]/30 border border-[#C9EEB4] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-[#006A38] text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#006A38]" /> SGE-IFCE Campus Cedro
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Bem-Vindo(a) ao <span className="text-[#006A38]">SGE-IFCE!</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 max-w-md leading-relaxed">
                Participe, aprenda e compartilhe conhecimento nos eventos acadêmicos promovidos pelo Instituto Federal.
              </p>
            </div>

            <div className="w-24 h-24 sm:w-36 sm:h-36 flex-shrink-0 flex items-center justify-center p-3 rounded-2xl bg-white/70 shadow-xs border border-white" title="Ilustração IFCE">
              <div className="flex flex-col items-center justify-center text-[#006A38]">
                <CalendarDays className="w-10 h-10 sm:w-16 sm:h-16" />
              </div>
            </div>
          </div>

          {/* Search bar and Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#006A38] focus:bg-white transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === 'Todos' ? 'Palestra' : 'Todos')}
                className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filtrar</span>
              </button>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#006A38] text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Próximos eventos
              </h3>
              <button
                type="button"
                onClick={() => navigate('/aluno/eventos')}
                className="text-xs font-bold text-[#006A38] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-[#006A38] animate-spin" />
                <span className="text-xs">Carregando eventos do SGE-IFCE...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={registeredEventIds.includes(event.id)}
                    onActionClick={handleRegister}
                    actionLabel={registeringId === event.id ? 'Inscrevendo...' : 'Inscrever-se'}
                  />
                ))}

                {filteredEvents.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
                    Nenhum evento encontrado para os termos pesquisados.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Widgets (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: Minhas inscrições */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#006A38]" />
                <h4 className="text-sm font-bold text-gray-900">Minhas inscrições</h4>
              </div>
              <span className="text-[11px] font-semibold text-gray-500">
                {myRegistrations.length} ativas
              </span>
            </div>

            <div className="space-y-3">
              {myRegistrations.slice(0, 3).map((reg) => (
                <div
                  key={reg.id}
                  className="p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50/40 border border-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#C9EEB4] text-[#004D26] uppercase">
                      {reg.status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {reg.ticketCode}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-gray-900 mt-2 line-clamp-2">
                    {reg.eventTitle}
                  </h5>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60 text-[11px] text-gray-500">
                    <span>{reg.date}</span>
                    <button
                      type="button"
                      onClick={() => navigate('/aluno/inscricoes')}
                      className="text-[#006A38] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver ticket</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {myRegistrations.length === 0 && !loading && (
                <p className="text-xs text-gray-400 text-center py-4">
                  Você ainda não possui inscrições ativas.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/aluno/inscricoes')}
              className="mt-4 w-full py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              Ver todas as inscrições
            </button>
          </div>

          {/* Widget 2: Certificados */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#006A38]" />
                <h4 className="text-sm font-bold text-gray-900">Certificados</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9EEB4] text-[#004D26]">
                {myCertificates.length} disponíveis
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Você tem <strong>{myCertificates.length} certificados</strong> prontos para download com autenticação digital.
            </p>

            <div className="space-y-2.5">
              {myCertificates.slice(0, 2).map((cert) => (
                <div key={cert.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-gray-800 truncate">{cert.eventTitle}</p>
                    <p className="text-[10px] text-gray-500">{cert.workload} • Emitido em {cert.issueDate}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadCert(cert)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-[#006A38] text-white text-[11px] font-semibold hover:bg-[#004D26] transition-colors cursor-pointer"
                  >
                    Baixar
                  </button>
                </div>
              ))}

              {myCertificates.length === 0 && !loading && (
                <p className="text-xs text-gray-400 text-center py-2">
                  Nenhum certificado emitido até o momento.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/aluno/certificados')}
              className="mt-4 w-full py-2 text-xs font-bold text-[#006A38] hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Acessar todos os certificados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
