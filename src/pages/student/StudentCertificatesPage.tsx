import React, { useState, useEffect, useCallback } from 'react';
import { Award, Download, CheckCircle2, ShieldCheck, Calendar, Clock, Loader2, Search, AlertCircle, FileCheck } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { certificatesApi, ValidatedCertificate } from '../../api/certificatesApi';
import { CertificateItem } from '../../types';

export const StudentCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidatedCertificate | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await certificatesApi.getMyCertificates();
      setCertificates(data);
    } catch (err: any) {
      console.error('Erro ao carregar certificados:', err);
      setErrorMessage(err.message || 'Falha ao buscar certificados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const handleDownload = async (cert: CertificateItem) => {
    try {
      setDownloadingId(cert.id);
      await certificatesApi.downloadCertificatePdf(cert.id, `Certificado-${cert.validationCode}.pdf`);
      setToastMessage(`Download iniciado para o certificado "${cert.validationCode}"!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Não foi possível baixar o certificado.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    try {
      setVerifying(true);
      setValidationError(null);
      setValidationResult(null);
      const result = await certificatesApi.validateCertificate(verifyCode.trim());
      setValidationResult(result);
    } catch (err: any) {
      setValidationError(err.message || 'Código de validação não localizado ou inválido.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <DashboardLayout
      title="Meus Certificados"
      subtitle="Baixe seus certificados de participação e valide a autenticidade digital"
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

      <div className="space-y-6 max-w-5xl text-left">
        {/* Verification callout & validator */}
        <div className="bg-emerald-50 border border-[#C9EEB4] p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-[#006A38] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 leading-relaxed">
              <strong className="text-[#006A38] block text-sm mb-0.5">Certificação Oficial IFCE:</strong>
              Todos os certificados emitidos pelo SGE possuem código verificador único e validade jurídica para aproveitamento de Atividades Complementares (AC) no campus.
            </div>
          </div>

          {/* Quick validation box */}
          <form onSubmit={handleVerify} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Validar código do certificado (ex: IFCE-CED-2026-CERT-...)"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#006A38]"
              />
            </div>
            <button
              type="submit"
              disabled={verifying || !verifyCode.trim()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#006A38] hover:bg-[#004D26] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {verifying ? 'Validando...' : 'Verificar Autenticidade'}
            </button>
          </form>

          {/* Validation modal / card result */}
          {validationResult && (
            <div className="p-4 rounded-2xl bg-white border border-[#C9EEB4] text-xs space-y-2 shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-[#006A38] font-bold text-sm">
                <FileCheck className="w-4 h-4" />
                <span>Certificado Autêntico e Válido</span>
              </div>
              <p><strong>Participante:</strong> {validationResult.participantName}</p>
              <p><strong>Evento:</strong> {validationResult.eventTitle}</p>
              <p><strong>Carga Horária:</strong> {validationResult.workload} • <strong>Emitido em:</strong> {validationResult.issueDate}</p>
              <p className="text-[11px] text-gray-500 italic">{validationResult.institution}</p>
            </div>
          )}

          {validationError && (
            <div className="p-3 rounded-2xl bg-red-100/70 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Certificates List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#006A38] animate-spin" />
            <span className="text-sm font-medium">Carregando seus certificados emitidos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9EEB4] text-[#004D26] uppercase">
                      Válido
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">
                      {cert.validationCode}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-snug">
                    {cert.eventTitle}
                  </h3>

                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#006A38]" />
                      Carga horária: <span className="font-semibold text-gray-700">{cert.workload}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#006A38]" />
                      Emitido em: <span className="font-semibold text-gray-700">{cert.issueDate}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">PDF Autenticado</span>
                  <button
                    type="button"
                    disabled={downloadingId === cert.id}
                    onClick={() => handleDownload(cert)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#006A38] hover:bg-[#004D26] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {downloadingId === cert.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Baixando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Certificado</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {certificates.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
                <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">Nenhum certificado emitido ainda</p>
                <p className="text-xs text-gray-400 mt-1">
                  Participe dos eventos e confirme presença com os docentes organizadores para ter seus certificados emitidos.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
