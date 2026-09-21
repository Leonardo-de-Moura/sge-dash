import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowLeft } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { RoleSelectionCard } from '../../components/cards/RoleSelectionCard';
import { useAuth } from '../../context/AuthContext';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole } = useAuth();
  const action = searchParams.get('action') || 'login';

  const handleSelectRole = (selectedRole: 'aluno' | 'professor') => {
    setRole(selectedRole);
    if (action === 'cadastro') {
      navigate(selectedRole === 'aluno' ? '/cadastro/aluno' : '/cadastro/professor');
    } else {
      navigate(selectedRole === 'aluno' ? '/login/aluno' : '/login/professor');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <Logo size="sm" />
        <div className="w-16" /> {/* spacer */}
      </div>

      {/* Main content container */}
      <div className="w-full max-w-2xl my-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Selecione uma opção
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Como você deseja acessar o Sistema de Gestão de Eventos?
          </p>
        </div>

        {/* 2-Column Responsive Grid (Mobile-First: stack on mobile, 2 columns on sm+) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <RoleSelectionCard
            role="aluno"
            title="Aluno"
            description="Participe de eventos, faça inscrições e acesse seus certificados."
            buttonLabel="Acessar como aluno"
            icon={<GraduationCap className="w-10 h-10 text-[#006A38]" />}
            onClick={() => handleSelectRole('aluno')}
          />

          <RoleSelectionCard
            role="professor"
            title="Professor"
            description="Crie e gerencie eventos, confirme presenças e emita certificados."
            buttonLabel="Acessar como professor"
            icon={<BookOpen className="w-10 h-10 text-[#006A38]" />}
            onClick={() => handleSelectRole('professor')}
          />
        </div>
      </div>

      {/* Security footer */}
      <div className="text-center text-xs text-gray-500 max-w-md">
        Ambiente seguro e autenticado pelo Instituto Federal do Ceará.
      </div>
    </div>
  );
};
