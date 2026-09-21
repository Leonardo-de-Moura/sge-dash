import React from 'react';
import { User, Mail, Hash, Shield, Building } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <DashboardLayout
      title="Meu Perfil Institucional"
      subtitle="Dados cadastrais vinculados ao sistema acadêmico do IFCE"
    >
      <div className="max-w-2xl bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs text-left space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <a href="" className="w-16 h-16 rounded-full bg-[#006A38] text-white font-bold text-xl flex items-center justify-center flex-shrink-0" title="Foto do perfil">
            {user?.name.charAt(0) || 'L'}
          </a>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user?.name || 'Luzia'}</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#C9EEB4] text-[#004D26] uppercase">
              {role === 'professor' ? 'Docente / Coordenador' : 'Discente'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#006A38]" /> E-mail Institucional
            </span>
            <span className="font-semibold text-gray-800">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#006A38]" /> {role === 'professor' ? 'SIAPE' : 'Matrícula'}
            </span>
            <span className="font-semibold font-mono text-gray-800">{user?.matricula || user?.siape || '2023108922'}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#006A38]" /> Unidade de Ensino
            </span>
            <span className="font-semibold text-gray-800">IFCE - Campus Cedro</span>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="md">
            Alterar Senha
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
