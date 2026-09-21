import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
  showSecurityFooter?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  showSecurityFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-8 sm:py-12">
      {/* Top branding */}
      <div className="w-full max-w-md flex justify-center mb-6">
        <Logo size="md" />
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 transition-all">
        {children}
      </div>

      {/* Security footer */}
      {showSecurityFooter ? (
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 text-center max-w-md">
          <ShieldCheck className="w-4 h-4 text-[#006A38] flex-shrink-0" />
          <span>
            Ambiente seguro e autenticado. Sistema de Gestão de Eventos do Instituto Federal do Ceará.
          </span>
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );
};
