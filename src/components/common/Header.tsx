
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Menu,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  title,
  subtitle,
}) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Referências para detectar cliques fora dos componentes
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fecha notificações e perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotificationToast(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayName = user?.name || 'Luzia';
  const roleLabel = role === 'professor' ? 'Docente' : 'Discente';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            {title || `Olá, ${displayName}!`}
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            {subtitle ||
              (role === 'professor'
                ? 'Gerencie seus eventos, frequências e certificados'
                : 'Consulte eventos e sua agenda acadêmica')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotificationToast(!showNotificationToast);
              setShowDropdown(false);
            }}
            className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
          </button>

          {showNotificationToast && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in zoom-in-95">
              <div className="inline-flex items-center rounded-full bg-[#C9EEB4] px-3 py-1.5 text-xs font-semibold text-[#004D26]">
                Seja bem-vindo ao sistema
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotificationToast(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#006A38] text-white flex items-center justify-center font-bold text-xs">
              LN
            </div>

            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-gray-800">
                {displayName}
              </span>

              <span className="text-[10px] text-gray-500 font-medium">
                {roleLabel}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95">

              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-800">
                  {displayName}
                </p>

                <p className="text-[11px] text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate(role === 'professor' ? '/professor/perfil' : '/aluno/perfil');
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-gray-400" />
                  Meu Perfil
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate(role === 'professor' ? '/login/professor' : '/login/aluno');
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#A62B26] hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-[#A62B26]" />
                  Sair da Conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
