import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Calendar, Clock, MapPin, CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { eventsApi } from '../../api/eventsApi';

function formatDayMonth(dateStr: string): string {
  if (!dateStr) return '20 Out';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${day} ${months[monthIdx] || 'Out'}`;
    }
  } catch {}
  return '20 Out';
}

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Palestra');
  const [modality, setModality] = useState<'Presencial' | 'Online' | 'Híbrido'>('Presencial');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [workload, setWorkload] = useState('4 horas');
  const [location, setLocation] = useState('Auditório Principal - Campus Cedro');
  const [totalSlots, setTotalSlots] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || savedToast) return;

    const parsedTotalSlots = Number(totalSlots);
    if (!title.trim() || !description.trim() || !startDate || !workload.trim() || !location.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (endDate && endDate < startDate) {
      setErrorMessage('A data de término não pode ser anterior à data de início.');
      return;
    }

    if (!Number.isInteger(parsedTotalSlots) || parsedTotalSlots < 1) {
      setErrorMessage('Informe ao menos uma vaga para o evento.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const computedDayMonth = formatDayMonth(startDate);

      await eventsApi.createEvent({
        title: title.trim(),
        category,
        modality,
        description: description.trim(),
        startDate,
        endDate: endDate || undefined,
        dayMonth: computedDayMonth,
        workload,
        location,
        totalSlots: parsedTotalSlots,
      });

      setSavedToast(true);
      setTimeout(() => {
        navigate('/professor/inicio');
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao cadastrar evento:', err);
      setErrorMessage(err.message || 'Falha ao cadastrar evento no banco de dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Criar novo evento"
      subtitle="Cadastre as informações, horários e detalhes para publicação no portal"
    >
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#006A38] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-sm font-semibold">
          <CheckCircle className="w-5 h-5 text-[#C9EEB4]" />
          <span>Evento cadastrado e sincronizado no banco de dados!</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-700 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-200" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/professor/inicio')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao painel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
            Informações do evento
          </h3>

          <Input
            label="Título do evento"
            type="text"
            required
            placeholder="Ex: Semana da Computação e Novas Tecnologias"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">
                Categoria <span className="text-[#A62B26]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#DCDCDC] bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#006A38]"
              >
                <option value="Palestra">Palestra</option>
                <option value="Minicurso">Minicurso</option>
                <option value="Congresso">Congresso</option>
                <option value="Workshop">Workshop</option>
                <option value="Mesa Redonda">Mesa Redonda</option>
                <option value="Oficina">Oficina</option>
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">
                Modalidade <span className="text-[#A62B26]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                {(['Presencial', 'Online', 'Híbrido'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setModality(mode)}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      modality === mode ? 'bg-white text-[#006A38] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Descrição do evento <span className="text-[#A62B26]">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Descreva a ementa, objetivos, pré-requisitos e público-alvo do evento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#DCDCDC] bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#006A38]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Data de início"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Data de término"
              type="date"
              min={startDate || undefined}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Carga horária certificada"
              type="text"
              required
              placeholder="Ex: 8 horas"
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
            />
            <Input
              label="Vagas disponíveis"
              type="number"
              required
              placeholder="Ex: 60"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
            />
          </div>

          <Input
            label="Local / Endereço"
            type="text"
            required
            placeholder="Ex: Auditório Principal - Campus Cedro"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Right Side: Image Upload + Resumo + Action Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Image upload box */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3 text-left">
            <h4 className="text-sm font-bold text-gray-900">
              Imagem de divulgação
            </h4>
            <p className="text-xs text-gray-500">
              Faça upload do banner visual em formato PNG ou JPG.
            </p>

            <a href="" className="border-2 border-dashed border-gray-300 hover:border-[#006A38] rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors group block">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#006A38] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800">
                Arraste ou clique para selecionar arquivo
              </span>
              <span className="text-[11px] text-gray-400 mt-1">
                PNG, JPG até 5MB
              </span>
            </a>
          </div>

          {/* Real-time Summary Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 text-left">
            <h4 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
              Resumo do evento
            </h4>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9EEB4] text-[#004D26] uppercase">
                  {category}
                </span>
                <span className="text-[10px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  {modality}
                </span>
              </div>

              <h5 className="text-sm font-bold text-gray-900 leading-snug">
                {title || 'Título do seu evento aparecerá aqui'}
              </h5>

              <p className="text-xs text-gray-500 line-clamp-2">
                {description || 'Adicione uma breve descrição para os estudantes...'}
              </p>

              <div className="pt-2 border-t border-gray-200/60 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#006A38]" />
                  <span>{startDate || 'Data a definir'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#006A38]" />
                  <span>{workload}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#006A38]" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                disabled={isSubmitting || savedToast}
                onClick={() => navigate('/professor/inicio')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting || savedToast}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </span>
                ) : (
                  'Salvar evento'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};
