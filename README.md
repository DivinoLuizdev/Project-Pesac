Project-Pesac

Este repositório contém a solução para um desafio técnico focado em desenvolvimento backend e frontend para gerenciamento de usuários.

---

API de Gerenciamento de Usuários (RandomUserAPI)

API RESTful para gerenciamento de usuários, com geração automática de usuários a partir da API externa randomuser.me. Construída com .NET 8, Entity Framework Core e banco de dados PostgreSQL. Totalmente containerizada com Docker.

Funcionalidades da API

- GET /api/users: lista paginada de usuários
- GET /api/users/{id}: detalhes de usuário
- POST /api/users: cria usuário
- POST /api/users/generate: gera usuário aleatório
- PUT /api/users/{id}: atualiza usuário
- DELETE /api/users/{id}: exclui usuário
- GET /api/users/relatorio-pdf: relatório PDF
- GET /api/users/relatorio-csv: relatório CSV

---

Requisitos

- Docker instalado
- Opcionalmente, .NET SDK 8.0 para executar localmente sem container

---

Como executar a API backend com Docker Compose

1. Clone o repositório e acesse a pasta da API:

git clone https://github.com/DivinoLuizdev/Project-Pesac.git
cd RandomUserApi

2. Inicie a aplicação e banco de dados com Docker Compose:

docker-compose up --build

3. Acesse a API e ferramentas:

- Documentação Swagger: http://localhost:5000/swagger
- Base da API: http://localhost:5000/api
- PgAdmin para gerenciar banco: http://localhost:5050
  - Usuário: admin@admin.com
  - Senha: admin123

4. Configuração PgAdmin para conectar PostgreSQL:

- Hostname: postgres
- Porta: 5432
- Database: usuariosdb
- Usuário: admin
- Senha: admin123
---

Observações importantes

- Caso a API não inicie automaticamente, acesse o container e inicie-a manualmente. A inicialização pode travar enquanto as migrations são aplicadas, especialmente na primeira vez que o volume é criado. Para evitar esse problema, você pode configurar a inicialização para executar as migrations em loop até que sejam concluídas, ou realizá-las manualmente

---

 

Frontend - Gerenciador de Usuários com API REST

Frontend React para consumir a API local e gerenciar usuários.

Funcionalidades do Frontend

- Listagem paginada
- Visualização detalhada
- Criação, edição e exclusão
- Geração automática de usuários
- Exportação de relatórios CSV e PDF
- Obtenção automática de localização e fuso horário via navegador

---

Como executar o Frontend React com Docker

1. Acesse a pasta do frontend:

cd FrontSimple

2. Construa a imagem Docker do frontend:

docker build -t frontend-react .

3. Execute o container, expondo a porta 3000:

docker run -p 3000:3000 frontend-react

4. Acesse a aplicação no navegador:

http://localhost:3000

---

O que acontece ao executar o container frontend

- O Dockerfile instala as dependências (npm install)
- Roda o servidor de desenvolvimento React (npm run dev) configurado para aceitar conexões externas (--host 0.0.0.0)
- A porta 3000 do container é mapeada para a porta 3000 da máquina local

---

Comandos resumidos

cd FrontSimple
docker build -t frontend-react .
docker run -p 3000:3000 frontend-react

---

Observações importantes

- Certifique-se que o script dev no package.json roda o React/Vite com a flag --host para aceitar conexões externas
- O mapeamento da porta no comando docker run -p 3000:3000 é que torna o frontend acessível externamente, não apenas o EXPOSE do Dockerfile

---

Considerações finais

- O projeto tem foco em simplicidade, usabilidade e responsividade
- Inclui validação de dados e mensagens de feedback ao usuário
- Permite gerenciamento eficiente e completo dos usuários via API e frontend

---

Tecnologias utilizadas

- Backend: ASP.NET Core 8, Entity Framework Core, PostgreSQL, Serilog, QuestPDF, Swagger
- Frontend: React, Vite
- Infraestrutura: Docker, Docker Compose
