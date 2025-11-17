# Aprova.ia

Plataforma completa de preparação para ENEM e vestibulares com inteligência artificial.

## Sobre o Projeto

Aprova.ia é uma plataforma educacional que oferece ferramentas modernas e inteligentes para potencializar os estudos de candidatos ao ENEM e vestibulares. Com correção automática de redações, banco de questões atualizado e assistente IA personalizado.

### Funcionalidades Principais

- **RedaCoach**: Correção automática de redações com feedback detalhado e notas por competência
- **Questões & Gabaritos**: Banco com milhares de questões de ENEM e vestibulares com gabaritos comentados
- **Assistente IA**: Inteligência artificial para tirar dúvidas e orientar estudos
- **Acompanhamento de Progresso**: Monitore seu desenvolvimento ao longo do tempo

## Tecnologias Utilizadas

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- ESLint

### Backend
- Python
- FastAPI
- Groq (IA)
- Uvicorn

## Estrutura do Projeto

```
aprovaia/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── public/
└── backend/           # API FastAPI
    └── main.py
```

## Instalação e Configuração

> [!IMPORTANT]
> Certifique-se de ter Node.js (v18+) e Python (v3.8+) instalados no sistema.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

O backend estará disponível em `http://localhost:8000`

## Variáveis de Ambiente

> [!WARNING]
> Não compartilhe suas chaves de API publicamente.

Crie um arquivo `.env` no diretório `backend/` com as seguintes variáveis:

```env
GROQ_API_KEY=sua_chave_api_groq
```

## Desenvolvimento

### Executar em Modo de Desenvolvimento

1. Inicie o backend:
```bash
cd backend
uvicorn main:app --reload
```

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

### Build para Produção

```bash
cd frontend
npm run build
```

## Autoria
[Frederico Maia Estrella](https://github.com/FredMaia)
[Otávio Sbampato Andrade](https://github.com/otaviosbampato)