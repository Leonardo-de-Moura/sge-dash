import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Hash, Lock, Info, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export const RegisterStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage('É necessário concordar com os Termos de Uso.');
      return;
    }

    try {
      setSubmitted(true);
      await authApi.registerStudent({
        name: name.trim(),
        email: email.trim(),
        matricula: matricula.trim(),
        password,
        confirmPassword,
      });

      // Auto login with new credentials
      await loginWithCredentials(email.trim(), password);
      navigate('/aluno/inicio');
    } catch (err: any) {
      console.error('Erro ao cadastrar discente:', err);
      setErrorMessage(err.message || 'Falha ao realizar cadastro.');
      setSubmitted(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Crie sua <span className="text-[#006A38]">conta</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Preencha os dados abaixo para criar sua conta no SGE-IFCE (Aluno)
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Nome completo"
          type="text"
          required
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
        />

        <Input
          label="E-mail institucional"
          type="email"
          required
          placeholder="Digite seu e-mail institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Matrícula"
          type="text"
          required
          placeholder="Digite sua matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          leftIcon={<Hash className="w-4 h-4" />}
        />

        <Input
          label="Senha"
          type="password"
          required
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Input
          label="Confirmar senha"
          type="password"
          required
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <div className="pt-1">
          <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-[#006A38] focus:ring-[#006A38]"
            />
            <span>
              Li e concordo com os <a href="" className="text-[#006A38] underline font-medium">Termos de Uso</a> e <a href="" className="text-[#006A38] underline font-medium">Política de Privacidade</a>.
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={submitted}
          className="mt-2"
        >
          {submitted ? 'Criando conta no servidor...' : 'Cadastrar'}
        </Button>
      </form>

      <div className="mt-5 text-center text-xs text-gray-600">
        Já tem uma conta?{' '}
        <Link to="/login/aluno" className="text-[#006A38] font-bold hover:underline">
          Fazer login
        </Link>
      </div>

      {/* Confirmation hint card exactly as in Figma */}
      <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50/60 border border-[#C9EEB4] text-left flex gap-2.5">
        <Info className="w-4 h-4 text-[#006A38] flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-gray-700 leading-relaxed">
          <strong className="text-[#006A38] block mb-0.5">Confirmação de E-mail:</strong>
          Após o cadastro, sua conta é imediatamente sincronizada no banco institucional para inscrições e certificados.
        </div>
      </div>
    </AuthLayout>
  );
};
