import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  ClipboardList,
  Award,
  User,
  HelpCircle,
  FolderKanban,
  CheckSquare,
  LogOut,
  X,
} from "lucide-react";
import { Logo } from "./Logo";
import { IfceBadge } from "./IfceBadge";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onClose) onClose();
  };

  const studentNavItems = [
    { label: "Início", path: "/aluno/inicio", icon: Home },
    { label: "Eventos", path: "/aluno/eventos", icon: Calendar },
    { label: "Inscrições", path: "/aluno/inscricoes", icon: ClipboardList },
    { label: "Certificados", path: "/aluno/certificados", icon: Award },
    { label: "Perfil", path: "/aluno/perfil", icon: User },
    { label: "Ajuda", path: "/aluno/ajuda", icon: HelpCircle },
  ];

  const teacherNavItems = [
    { label: "Início", path: "/professor/inicio", icon: Home },

    { label: "Gerenciar", path: "/professor/gerenciar", icon: FolderKanban },
    { label: "Presenças", path: "/professor/presencas", icon: CheckSquare },
    { label: "Certificados", path: "/professor/certificados", icon: Award },
    { label: "Perfil", path: "/professor/perfil", icon: User },
    { label: "Ajuda", path: "/professor/ajuda", icon: HelpCircle },
  ];

  const navItems = role === "professor" ? teacherNavItems : studentNavItems;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5">
      {/* Top Header & Logo */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <Logo size="sm" showSubtitle={true} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#C9EEB4] text-[#004D26] font-semibold shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Institutional Info & Exit */}
      <div className="pt-6 border-t border-gray-100 space-y-3">
        <IfceBadge campusName="Campus Cedro" />
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A62B26] hover:bg-red-50 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 stroke-[2.2]" />
          <span>Sair da conta</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white min-h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sliding Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
