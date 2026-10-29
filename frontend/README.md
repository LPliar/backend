# Frontend Alvo Certo

Aplicação React + Vite integrada à API Express do projeto Alvo Certo.

## Requisitos
- Node.js 20.19+ ou 22.12+
- Backend em execução em http://localhost:3001

## Instalação
Na pasta do frontend, execute:

```bash
npm install
```

Crie um arquivo `.env` baseado em `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

## Executar
```bash
npm run dev
```

Acesse http://localhost:5173.

## Build de produção
```bash
npm run build
```

O formulário público cria solicitações pendentes, sem confirmar reserva. O catálogo é institucional e não possui carrinho ou compra.
