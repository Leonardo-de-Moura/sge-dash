import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/common/Button';

export const EmailSentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || 'seu e-mail institucional';

  return (
    <AuthLayout>
      <div className="text-center py-2">
        <a href="" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9EEB4]/50 text-[#006A38] mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </a>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          E-mail <span className="text-[#006A38]">enviado!</span>
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
          Caso o e-mail <strong>{email}</strong> esteja cadastrado corretamente, você receberá uma mensagem com as instruções para definir uma nova senha.
        </p>

        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Caso não tenha recebido a mensagem, verifique se digitou corretamente o endereço ou olhe na caixa de spam.
        </p>

        <div className="space-y-3">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<RefreshCw className="w-4 h-4 text-[#006A38]" />}
            onClick={() => alert('Instruções reenviadas para ' + email)}
          >
            Reenviar e-mail
          </Button>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Voltar para o login
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};
