# SGE-IFCE — Frontend (React + Vite + Tailwind CSS)

Interface web oficial do **Sistema de Gestão de Eventos (SGE)** do **IFCE Campus Cedro**.

---

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite** (Build tool e dev server)
- **Tailwind CSS v4**
- **React Router Dom v7**
- **Lucide Icons**
- **Canvas Confetti & QR Code**

---

## ⚙️ Variáveis de Ambiente

Em desenvolvimento, a variável é opcional: o Vite encaminha `/api` ao backend local
em `http://localhost:5000`. Para usar outro endereço de API, configure:

```env
# URL base da API, incluindo /api
VITE_API_BASE_URL=https://servidor-da-api.example/api
```

---

## ⚡ Como Executar Localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

O aplicativo estará rodando em: `http://localhost:3000`. As chamadas à API usam o proxy
local do Vite para `http://localhost:5000`; em produção, configure `VITE_API_BASE_URL`
ou disponibilize `/api` no mesmo host do frontend.

O aluno precisa estar autenticado e inscrito no evento para confirmar presença.

### 3. Build de Produção
```bash
npm run build
```
Os arquivos otimizados serão gerados no diretório `dist/`.
