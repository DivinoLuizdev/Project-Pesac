Gerenciador de Usuários com API REST

Este projeto frontend permite o gerenciamento completo de usuários consumindo uma API REST local.

---

Funcionalidades

- Listagem paginada de usuários
- Visualização detalhada dos dados de cada usuário
- Criação, edição e exclusão de usuários
- Geração automática de usuários
- Exportação de relatórios em CSV e PDF
- Obtenção automática da localização e fuso horário do usuário via navegador

---

API Utilizada

O frontend consome endpoints para operações CRUD (criar, ler, atualizar, excluir), geração de usuários e exportação de relatórios.

---

Como usar

1. Configure e execute a API backend localmente
2. Instale as dependências do frontend
3. Execute o frontend
4. Acesse o sistema via navegador

---

Rodando o Frontend React com Docker

Este guia mostra como construir e executar o container Docker para a aplicação React que está dentro da pasta FrontSimple.

---

Passos

1. Entre na pasta FrontSimple  
   Acesse a pasta onde está o código do frontend React:  
   cd FrontSimple

2. Construa a imagem Docker  
   Execute o comando para construir a imagem Docker com o nome frontend-react:  
   docker build -t frontend-react .

3. Execute o container Docker  
   Rode o container expondo a porta 3000 (porta padrão do React/Vite):  
   docker run -p 3000:3000 frontend-react

4. Acesse no navegador  
   Abra seu navegador e acesse:  
   http://localhost:3000

---

O que acontece

- O Dockerfile dentro de FrontSimple instala as dependências (npm install)  
- Roda o servidor de desenvolvimento React (npm run dev) com host configurado para aceitar conexões externas  
- A porta 3000 do container é mapeada para a porta 3000 da sua máquina local  

---

Comandos resumidos

cd FrontSimple  
docker build -t frontend-react .  
docker run -p 3000:3000 frontend-react

---

Observações

- Certifique-se que no seu package.json o script dev roda o React/Vite com host configurado (vite --host) para permitir acesso externo  
- O comando docker run -p 3000:3000 é que expõe a porta do container para sua máquina, não o Dockerfile sozinho  

---

Considerações

- O projeto inclui validação de dados e mensagens de feedback para o usuário  
- Busca garantir usabilidade e responsividade  
- Focado em simplicidade e eficiência no gerenciamento de usuários  
