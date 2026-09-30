import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertTriangle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { authApi } from '../../api/authApi';

const PASSWORD_MIN_LENGTH = 8;

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
  }, []);

  const passwordError = useMemo(() => {
    if (!newPassword) {
      return null;
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return 'A senha deve ter pelo menos 8 caracteres.';
    }

    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return 'A senha deve conter letras e números.';
    }

    return null;
  }, [newPassword]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Token de redefinição ausente ou inválido.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Preencha a nova senha e a confirmação.');
      return;
    }

    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword(token, newPassword, confirmPassword);
      setSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9EEB4]/50 text-[#006A38] mb-4">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Senha <span className="text-[#006A38]">redefinida!</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            Sua senha foi atualizada com sucesso. Agora você pode voltar para o login e continuar usando o sistema.
          </p>

          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/login/aluno')}>
            Voltar para o login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C9EEB4]/40 text-[#006A38] mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Defina sua <span className="text-[#006A38]">nova senha</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
          Crie uma senha segura para continuar acessando sua conta.
        </p>
      </div>

      {!token && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>O link de recuperação está ausente ou inválido. Solicite um novo e-mail de recuperação.</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nova senha"
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="Digite sua nova senha"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          error={passwordError || undefined}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Input
          label="Confirmar nova senha"
          type={showConfirmPassword ? 'text' : 'password'}
          required
          placeholder="Confirme sua nova senha"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={confirmPassword && newPassword !== confirmPassword ? 'As senhas não coincidem.' : undefined}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading || !token}>
          {loading ? 'Redefinindo senha...' : 'Redefinir senha'}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 text-center">
        <button
          type="button"
          onClick={() => navigate('/login/aluno')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para o login</span>
        </button>
      </div>
    </AuthLayout>
  );
};
