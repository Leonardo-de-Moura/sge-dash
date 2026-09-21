import React from 'react';
import { ChevronRight } from 'lucide-react';

interface RoleSelectionCardProps {
  role: 'aluno' | 'professor';
  title: string;
  description: string;
  buttonLabel: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  title,
  description,
  buttonLabel,
  icon,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 hover:border-[#006A38] hover:shadow-lg transition-all duration-200 group">
      {/* Icon circle / container with href="" placeholder */}
      <a href="" className="w-20 h-20 rounded-full bg-[#C9EEB4]/30 text-[#006A38] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
        {icon}
      </a>

      <h3 className="text-xl font-bold text-gray-900 mb-2.5">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed flex-1 min-h-[48px]">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#006A38] text-white text-xs sm:text-sm font-semibold hover:bg-[#004D26] active:bg-[#00381B] transition-colors shadow-xs cursor-pointer"
      >
        <span>{buttonLabel}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
