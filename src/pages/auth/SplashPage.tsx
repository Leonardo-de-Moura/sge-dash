import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

export const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate('/bem-vindo', { replace: true });
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return (
    <main className="splash-screen" aria-label="Sistema de Gestão de Eventos do IFCE">
      <div className="splash-shape splash-shape-top" aria-hidden="true" />
      <div className="splash-shape splash-shape-bottom" aria-hidden="true" />

      <section className="splash-content">
        <div className="splash-mark" aria-hidden="true">
          <CalendarDays className="splash-calendar" strokeWidth={1.7} />
        </div>
        <h1 className="splash-title">
          SGE<span>-</span><strong>IFCE</strong>
        </h1>
        <p className="splash-description">
          Sistema de Gestão de Eventos do IFCE
        </p>

        <div className="splash-progress" role="status" aria-live="polite">
          <div className="splash-dots" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span>Preparando seu acesso...</span>
        </div>
      </section>
    </main>
  );
};