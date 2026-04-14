## Database Setup Procedure in your local machine

- Execute <psql postgres> in your terminal
- Excute <CREATE DATABASE quiz_app;> in your terminal to create local DB
- In you PJ terminal, execute <npx prisma init --output ./generated/prisma>
- Create User and Password, then give the user permission
- Write URL as bellow in .env file
  [ DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DBname>" ]
