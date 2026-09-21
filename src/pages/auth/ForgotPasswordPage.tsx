import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/email-enviado', { state: { email } });
    }, 400);
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <a href="" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C9EEB4]/40 text-[#006A38] mb-3">
          <KeyRound className="w-6 h-6" />
        </a>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Esqueceu sua <span className="text-[#006A38]">senha?</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
          Insira seu endereço de e-mail institucional para receber as instruções de redefinição.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail Institucional"
          type="email"
          required
          placeholder="Digite o seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          className="mt-2"
        >
          {loading ? 'Enviando instruções...' : 'Continuar'}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para o login</span>
        </Link>
      </div>
    </AuthLayout>
  );
};
