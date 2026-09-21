
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


// Páginas de Autenticação
import { LandingPage } from './pages/auth/LandingPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { LoginStudentPage } from './pages/auth/LoginStudentPage';
import { LoginTeacherPage } from './pages/auth/LoginTeacherPage';
import { RegisterStudentPage } from './pages/auth/RegisterStudentPage';
import { RegisterTeacherPage } from './pages/auth/RegisterTeacherPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { EmailSentPage } from './pages/auth/EmailSentPage';

// Páginas do Aluno

import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentEventsPage } from './pages/student/StudentEventsPage';
import { StudentRegistrationsPage } from './pages/student/StudentRegistrationsPage';
import { StudentCertificatesPage } from './pages/student/StudentCertificatesPage';

// Páginas do Professor
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { CreateEventPage } from './pages/teacher/CreateEventPage';
import { AttendancePage } from './pages/teacher/AttendancePage';
import { CertificatesPage } from './pages/teacher/CertificatesPage';
import { TeacherManagePage } from './pages/teacher/TeacherManagePage';

// Páginas Gerais & Design System
import { ProfilePage } from './pages/common/ProfilePage';
import { HelpPage } from './pages/common/HelpPage';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter >
        <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased">
          <Routes>
            {/* Fluxo de Entrada e Autenticação */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/definir-funcao" element={<RoleSelectionPage />} />
            <Route path="/login/aluno" element={<LoginStudentPage />} />
            <Route path="/login/professor" element={<LoginTeacherPage />} />
            <Route path="/cadastro/aluno" element={<RegisterStudentPage />} />
            <Route path="/cadastro/professor" element={<RegisterTeacherPage />} />
            <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
            <Route path="/email-enviado" element={<EmailSentPage />} />

            {/* Módulo Aluno */}
          
          
            <Route path="/aluno/inicio" element={<StudentDashboardPage />} />
            <Route path="/aluno/eventos" element={<StudentEventsPage />} />
            <Route path="/aluno/inscricoes" element={<StudentRegistrationsPage />} />
            <Route path="/aluno/certificados" element={<StudentCertificatesPage />} />
            <Route path="/aluno/perfil" element={<ProfilePage />} />
            <Route path="/aluno/ajuda" element={<HelpPage />} />

            {/* Módulo Professor */}
            <Route path="/professor/inicio" element={<TeacherDashboardPage />} />
            <Route path="/professor/criar-evento" element={<CreateEventPage />} />
            <Route path="/professor/presencas" element={<AttendancePage />} />
            <Route path="/professor/certificados" element={<CertificatesPage />} />
            <Route path="/professor/eventos" element={<TeacherManagePage />} />
            <Route path="/professor/gerenciar" element={<TeacherManagePage />} />
            <Route path="/professor/perfil" element={<ProfilePage />} />
            <Route path="/professor/ajuda" element={<HelpPage />} />

            {/* Guia de Estilos */}

            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        
          
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}