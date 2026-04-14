## Database Setup Procedure in your local machine

- execute the commands as below in your terminal

```
CREATE USER <username> WITH PASSWORD '<password>';
CREATE DATABASE <DB name> OWNER <username>;
\c <DB name>
GRANT ALL ON SCHEMA public TO <username>;
ALTER USER <username> CREATEDB;
```

- Write URL as bellow in .env file
  [ DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DBname>" ]
