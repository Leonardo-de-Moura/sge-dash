import React from 'react';
import { HelpCircle, Mail, Phone, FileText, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const HelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'Como comprovar minha presença em um evento?',
      a: 'A presença é confirmada pelo professor ou comissão organizadora na entrada do local através do credenciamento digital.'
    },
    {
      q: 'Quando meu certificado estará disponível?',
      a: 'Assim que o evento for concluído e a lista de presença for homologada pelo docente responsável, em até 5 dias úteis.'
    },
    {
      q: 'Como utilizar o certificado para Atividades Complementares?',
      a: 'Baixe o PDF no menu "Certificados" e submeta o código de verificação no sistema acadêmico Q-Acadêmico / SIGAA.'
    },
    {
      q: 'Posso cancelar minha inscrição em um evento?',
      a: 'Sim, você pode cancelar sua inscrição com até 2 horas de antecedência na aba "Minhas Inscrições" para liberar a vaga.'
    }
  ];

  return (
    <DashboardLayout
      title="Central de Ajuda & Suporte"
      subtitle="Tire dúvidas sobre inscrições, certificações e normas de eventos do IFCE"
    >
      <div className="max-w-3xl space-y-6 text-left">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#006A38]" /> Perguntas Frequentes
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800">{faq.q}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-gray-900">Coordenação de Extensão e Eventos</h4>
          <p className="text-xs text-gray-500">
            Dúvidas administrativas ou problemas com emissão de certificados? Entre em contato com a equipe local.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-[#006A38]" /> eventos.cedro@ifce.edu.br
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-[#006A38]" /> (88) 3582-1200
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
