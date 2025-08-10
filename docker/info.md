# Conectando PgAdmin ao PostgreSQL via Docker

## Passos para conectar

`` docker-compose down``

``docker-compose up -d``

1. Acesse o PgAdmin no navegador em:  
   [http://localhost:5050](http://localhost:5050)

2. Adiciona um novo servidor no PgAdmin com as seguintes configurações:

- **Hostname:** postgres  
- **Porta:** 5432  
- **Database:** usuariosdb  
- **Usuário:** admin  
- **Senha:** admin123  

3. Após salvar, o PgAdmin estará conectado ao seu banco PostgreSQL rodando no Docker.

---

**Obs:** Certifique-se que os containers do PostgreSQL e PgAdmin estejam rodando na mesma rede Docker para que o hostname `postgres` seja resolvido corretamente.

admin@admin.com
admin123