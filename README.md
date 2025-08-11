# Project-Pesac
Este repositório contém a solução para um desafio técnico focado em desenvolvimento backend. A aplicação foi construída com C# e ASP.NET Core, utilizando Entity Framework Core para a integração com o banco de dados PostgreSQL.

# 💾 API de Gerenciamento de Usuários (RandomUserAPI)

Esta é uma API RESTful para gerenciamento de usuários, com a funcionalidade de gerar novos usuários a partir de uma API externa. A aplicação utiliza **.NET 8**, **Entity Framework Core** para persistência de dados em um banco de dados **PostgreSQL**, e é totalmente containerizada com **Docker**.

---

## 💻 Funcionalidades
A API oferece os seguintes endpoints para gerenciamento de usuários:

* **`GET /api/users`**: Retorna uma lista paginada de todos os usuários.
* **`GET /api/users/{id}`**: Obtém os detalhes de um usuário específico pelo seu ID.
* **`POST /api/users`**: Cria um novo usuário com dados fornecidos no corpo da requisição.
* **`POST /api/users/generate`**: Gera um novo usuário aleatório consumindo a API `randomuser.me` e o salva no banco de dados.
* **`PUT /api/users/{id}`**: Atualiza os dados de um usuário existente.
* **`DELETE /api/users/{id}`**: Exclui um usuário do banco de dados.
* **`GET /api/users/relatorio-pdf`**: Gera e retorna um relatório de todos os usuários em formato PDF.
* **`GET /api/users/relatorio-csv`**: Gera e retorna um relatório de todos os usuários em formato CSV.

---

## 🚀 Requisitos
* **Docker**: É necessário ter o Docker instalado para executar a aplicação e o banco de dados.
* **.NET SDK 8.0**: Opcional. Necessário apenas se você for compilar e executar a aplicação localmente, fora dos contêineres Docker.

---

## 🛠️ Como Executar
A maneira mais fácil de rodar a aplicação é utilizando o Docker Compose, que gerencia o serviço da API e o banco de dados PostgreSQL.

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/DivinoLuizdev/Project-Pesac.git
    cd RandomUserApi
    ```

2.  **Inicie a Aplicação com Docker Compose:**
    O arquivo `docker-compose.yml` já está configurado para levantar os serviços necessários.
    dentro da pasta RandomUserApi 
    
    ```bash
    docker-compose up --build
    ```
    Isso vai construir a imagem da aplicação, baixar a imagem do PostgreSQL e do PgAdmin, e iniciar todos os contêineres na mesma rede.

    Obs.: Se a API não iniciar automaticamente, acesse o container e inicie-o manualmente. A inicialização pode travar enquanto as migrations são aplicadas. Para evitar esse problema, você pode configurar a inicialização para rodar as migrations em um loop até que sejam concluídas, ou executá-las de forma manual.
 
3.  **Acessando a API:**
    * A documentação interativa da API estará disponível em: [http://localhost:5000/swagger](http://localhost:5000/swagger)
    * Os endpoints da API podem ser acessados na URL base: [http://localhost:5000/api](http://localhost:5000/api)

4.  **Acessando o PgAdmin:**
    Para gerenciar o banco de dados, você pode acessar o PgAdmin.
    * Abra a URL no seu navegador: [http://localhost:5050](http://localhost:5050)
    * **Login**: `admin@admin.com`
    * **Senha**: `admin123`
    * Dentro do PgAdmin, adicione um novo servidor com as seguintes configurações:
        * **Hostname/Endereço**: `usuarios-postgres` (ou `postgres`, dependendo da sua configuração de rede)
        * **Porta**: `5432`
        * **Banco de Dados**: `usuariosdb`
        * **Usuário**: `admin`
        * **Senha**: `admin123`

    A aplicação usará a connection string definida no arquivo `appsettings.json`, que já está configurado para o ambiente Docker.

---

## ⚙️ Tecnologias Utilizadas
* **ASP.NET Core 8**: Framework principal para a API.
* **Entity Framework Core**: ORM para acesso e gerenciamento do banco de dados.
* **Npgsql**: Provedor de banco de dados para PostgreSQL.
* **Serilog**: Biblioteca de logging para registro de eventos da aplicação.
* **Swagger/OpenAPI**: Geração automática de documentação e UI interativa para a API.
* **QuestPDF**: Biblioteca para geração de relatórios em PDF.
* **Docker & Docker Compose**: Gerenciamento do ambiente de desenvolvimento e produção.