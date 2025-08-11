# Conectando PgAdmin ao PostgreSQL via Docker

## Passos para conectar

``docker-compose down``

``docker-compose up -d``

1. Acesse o PgAdmin no navegador em:  
   [http://localhost:5050](http://localhost:5050)

      ``admin@admin.com``
      
      `` admin123``

2. Adiciona um novo servidor no PgAdmin com as seguintes configurações:

- **Hostname:** postgres  
- **Porta:** 5432  
- **Database:** usuariosdb  
- **Usuário:** admin  
- **Senha:** admin123  


