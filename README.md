# Sistema de Gestão de Estoque - Fazendinha Estação Natureza

Bem-vindo ao repositório oficial do sistema de gestão de estoque e armazenagem desenvolvido para a **Fazendinha Estação Natureza**.

Esta aplicação foi projetada para oferecer um controle rigoroso de insumos, ferramentas, rações e medicamentos. O sistema substitui pranchetas e planilhas por uma solução digital ágil, rastreável e focada na experiência do usuário em campo.

---

## Principais Funcionalidades

- **Leitura Ágil via Câmera (QR Code/EAN):**  
  Integração nativa com a câmera do smartphone para leitura rápida de produtos direto no navegador, sem necessidade de hardware externo.

- **Gestão de Fornecedores Automatizada:**  
  Cadastro inteligente integrado à API do **ViaCEP**, preenchendo endereços automaticamente e poupando tempo de digitação.

- **Rastreabilidade e Localização Físico-Lógica:**  
  Vínculo direto entre Produto → Fornecedor → Estante → Prateleira.  
  O sistema sabe exatamente de quem veio e onde está guardado.

- **Controles e Travas de Segurança:**  
  - Bloqueio de entrada de produtos com validade vencida  
  - Alertas visuais de produtos em "Estoque Crítico"

- **Histórico de Movimentações:**  
  Log completo e imutável de todas as entradas e saídas realizadas no sistema.

---

## Tecnologias Utilizadas

### Front-end
- React (com Vite)
- TypeScript
- HTML5-QRCode (Leitor de câmera)
- Arquitetura baseada em Service Pattern

### Back-end
- Node.js com Express
- TypeScript (tsx)
- Integração nativa e tipada para rotas e controllers

### Banco de Dados & Ferramentas
- PostgreSQL (Hospedado em nuvem via AlwaysData)
- Consultas parametrizadas (proteção contra SQL Injection)
- **ngrok:**  
  Utilizado para criar um túnel HTTPS seguro durante o desenvolvimento, permitindo o teste das funcionalidades de hardware (câmera) via dispositivos móveis.

---

## Arquitetura e Organização do Projeto

O projeto é um monorepo dividido em três camadas principais:

```text
/
├── backend/       # API Rest em Node.js (Rotas, Controllers, Conexão com DB)
├── database/      # Scripts SQL para criação das tabelas
└── frontend/      # Aplicação React
Detalhamento do Front-end (frontend/src/)

O projeto Front-end foi estruturado seguindo o padrão de separação de responsabilidades (Service Pattern), facilitando escalabilidade e trabalho em equipe:

src/
│
├── types/                 
│   └── index.ts           
│
├── services/              
│   ├── api.ts             
│   ├── authService.ts     
│   ├── produtoService.ts  
│   └── localService.ts    
│
├── pages/                 
│   ├── Dashboard.tsx
│   ├── Entrada.tsx
│   ├── Saida.tsx
│   ├── Fornecedores.tsx   
│   └── ...
│
└── App.tsx                
Como executar o projeto localmente
Pré-requisitos
Node.js instalado

Não é necessário instalar PostgreSQL localmente, pois o banco está hospedado em nuvem (AlwaysData).

Passo 1: Back-end
cd backend
npm install

Crie um arquivo .env:

DB_USER=seu_usuario_alwaysdata
DB_PASS=sua_senha_alwaysdata
DB_HOST=postgresql-suaconta.alwaysdata.net
DB_PORT=5432
DB_NAME=nome_do_banco_alwaysdata
JWT_SECRET=sua_chave_secreta_aqui

Execute o servidor:

npm run dev

Servidor disponível em:

http://localhost:3000
Passo 2: Front-end
cd frontend
npm install
npm run dev

Acesse:

http://localhost:5173
Passo 3: Testando no celular (ngrok)

Para usar a câmera do celular (QR Code), é necessário HTTPS.

Execute:

npx ngrok http 5173

Exemplo de link gerado:

https://xxxx.ngrok-free.app

Abra no celular para testar a câmera.

Autoria e Créditos: Projeto desenvolvido como requisito do Projeto Integrador (PI3).

Curso: Bacharelado em Tecnologia da Informação com ênfase em Desenvolvimento de Software
Instituição: UNIVESP (Universidade Virtual do Estado de São Paulo)