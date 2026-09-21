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

Crie um arquivo `.env` baseado no `.env.example`:

```env
# URL da API do Backend em execução
VITE_API_BASE_URL=http://localhost:5000/api
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

O aplicativo estará rodando em: `http://localhost:5173`

### 3. Build de Produção
```bash
npm run build
```
Os arquivos otimizados serão gerados no diretório `dist/`.
