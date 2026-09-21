import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  Calendar,
  Award,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "../../components/common/Logo";
import { Button } from "../../components/common/Button";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="w-full max-w-md flex justify-center">
        <Logo size="md" />
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Bem-vindo!
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-8 leading-relaxed">
          Organize, participe e acompanhe os eventos do IFCE de forma simples e
          prática.
        </p>

        {/* Action buttons */}
        <div className="space-y-3 mb-8">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<LogIn className="w-4 h-4 text-[#006A38]" />}
            onClick={() => navigate("/definir-funcao?action=login")}
          >
            Entrar
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<UserPlus className="w-4 h-4 text-white" />}
            onClick={() => navigate("/definir-funcao?action=cadastro")}
          >
            Cadastrar
          </Button>
        </div>

        {/* Feature badges list with href="" as requested for media/images */}
        <div className="pt-6 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Gerencie seu eventos com facilidade
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/50 transition-colors flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-[#006A38] flex-shrink-0" />
              <span className="text-xs font-medium">Eventos organizados</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/50 transition-colors flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#006A38] flex-shrink-0" />
              <span className="text-xs font-medium">Inscrições simples</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/50 transition-colors flex items-center gap-2 text-gray-700">
              <Award className="w-4 h-4 text-[#006A38] flex-shrink-0" />
              <span className="text-xs font-medium">Certificados digitais</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/50 transition-colors flex items-center gap-2 text-gray-700">
              <ShieldCheck className="w-4 h-4 text-[#006A38] flex-shrink-0" />
              <span className="text-xs font-medium">Segurança IFCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional security text */}
      <div className="text-center text-xs text-gray-400">
        Instituto Federal do Ceará - Campus Cedro
      </div>
    </div>
  );
};
