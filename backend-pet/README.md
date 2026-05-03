# Backend PetShop - Sistema de Agendamento

API REST para sistema de agendamento de pet shop desenvolvida com Node.js, Express, MySQL e Sequelize.

## 🚀 Tecnologias

- Node.js
- Express 5.x
- MySQL 8
- Sequelize ORM
- JWT (JSON Web Tokens)
- Bcrypt
- Docker & Docker Compose
- Nodemon

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=123456
DB_NAME=petshop
JWT_SECRET=segredo_super
```

### 2. Instalação das Dependências

```bash
npm install
```

### 3. Iniciar o MySQL com Docker

```bash
docker compose up -d
```

### 4. Iniciar o Servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 📁 Estrutura do Projeto

```
backend-pet/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do Sequelize
│   ├── controllers/
│   │   └── authControllers.js   # Controllers de autenticação
│   ├── models/
│   │   └── User.js              # Model do usuário
│   ├── routes/
│   │   └── authRoutes.js        # Rotas de autenticação
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Inicialização do servidor
├── docker-compose.yml           # Configuração do MySQL
├── Dockerfile
├── package.json
├── .env
└── README.md
```

## 🔌 Endpoints da API

### Autenticação

#### Cadastro de Usuário

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "client" // opcional: "admin" ou "client"
}
```

**Resposta de Sucesso (201):**

```json
{
  "message": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "client"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "client"
  }
}
```

## 🐛 Problemas Encontrados e Soluções

### 1. Erro: MODULE_NOT_FOUND

**Erro:**

```
Error: Cannot find module './app.js'
code: 'MODULE_NOT_FOUND'
```

**Causa:**

- Estrutura de pastas inconsistente (pasta `SRC` em maiúscula vs `src` em minúscula)
- Arquivos `Server.js` e `App.js` estavam na raiz ao invés da pasta `src/`
- Imports com caminhos incorretos

**Solução:**

1. Reorganização da estrutura de pastas:
   - Criada pasta `src/` (minúscula)
   - Movidos todos os arquivos para dentro de `src/`
   - Renomeados arquivos para lowercase: `server.js`, `app.js`

2. Atualização do `package.json`:

```json
{
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

### 2. Erro: MySQL Container Reiniciando Constantemente

**Erro:**

```
[ERROR] [Entrypoint]: MYSQL_USER="root", MYSQL_USER and MYSQL_PASSWORD are for
configuring a regular user and cannot be used for the root user
```

**Causa:**
Configuração incorreta no `docker-compose.yml` - tentativa de usar `MYSQL_USER: root`

**Solução:**
Corrigido `docker-compose.yml`:

```yaml
services:
  mysql:
    image: mysql:8
    container_name: petshop_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456 # Apenas esta variável para root
      MYSQL_DATABASE: petshop
    ports:
      - "3307:3306" # Porta alterada para evitar conflito
    volumes:
      - mysql_data:/var/lib/mysql
```

**Nota:** Removido `MYSQL_USER` e `MYSQL_PASSWORD` pois são para criar usuários adicionais, não para configurar o root.

### 3. Erro: Porta 3306 Já em Uso

**Erro:**

```
Error response from daemon: ports are not available: exposing port TCP 0.0.0.0:3306
bind: Normalmente é permitida apenas uma utilização de cada endereço de soquete
```

**Causa:**
MySQL local já estava rodando na porta 3306

**Solução:**

1. Alterada a porta externa do Docker para 3307
2. Atualizado `.env`:

```env
DB_PORT=3307
```

3. Atualizado `src/config/database.js`:

```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // Adicionado suporte à porta
    dialect: "mysql",
  },
);
```

### 4. Erro: Access Denied MySQL

**Erro:**

```
AccessDeniedError [SequelizeAccessDeniedError]: Access denied for user 'root'@'localhost'
(using password: YES)
```

**Causa:**

- Container MySQL não havia inicializado completamente
- Configuração incorreta das variáveis de ambiente

**Solução:**

1. Parado e removido containers e volumes:

```bash
docker compose down -v
```

2. Recriado container com configuração correta
3. Aguardado inicialização completa (~10 segundos)

### 5. Erro: req.body undefined no Login

**Erro:**

```json
{
  "message": "Erro ao fazer login",
  "error": "Cannot destructure property 'email' of 'req.body' as it is undefined."
}
```

**Causa:**
Middlewares de parsing do Express não estavam configurados corretamente

**Solução:**
Adicionado middleware `express.urlencoded` no `app.js`:

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

### 6. Erro: Campos Obrigatórios no Cadastro

**Erro:**

```json
{
  "message": "Campos obrigatórios: name, email, password"
}
```

**Causa:**
Dados não estavam sendo enviados corretamente no corpo da requisição

**Solução:**

1. Verificação do `Content-Type: application/json` no header
2. Validação adicionada no controller
3. Confirmação de que o body estava sendo enviado corretamente

## 🔐 Segurança

- Senhas são criptografadas com bcrypt (salt rounds: 10)
- Autenticação via JWT com expiração de 24h
- Validação de campos obrigatórios
- Proteção contra duplicação de emails

## 📊 Banco de Dados

### Tabela: Users

| Campo     | Tipo                    | Restrições         |
| --------- | ----------------------- | ------------------ |
| id        | INTEGER                 | PK, AUTO_INCREMENT |
| name      | VARCHAR(255)            | NOT NULL           |
| email     | VARCHAR(255)            | NOT NULL, UNIQUE   |
| password  | VARCHAR(255)            | NOT NULL (hash)    |
| role      | ENUM('admin', 'client') | DEFAULT 'client'   |
| createdAt | DATETIME                | NOT NULL           |
| updatedAt | DATETIME                | NOT NULL           |

## 🔧 Comandos Úteis

### Docker

```bash
# Iniciar containers
docker compose up -d

# Ver logs do MySQL
docker logs petshop_mysql

# Ver containers rodando
docker ps

# Parar containers
docker compose down

# Parar e remover volumes (apaga dados)
docker compose down -v
```

### Desenvolvimento

```bash
# Reiniciar servidor (quando nodemon está rodando)
rs

# Verificar porta em uso (Windows)
netstat -ano | findstr :3307

# Instalar nova dependência
npm install nome-pacote
```

## 📝 Notas Importantes

1. **ES Modules**: O projeto usa ES Modules (`import/export`), por isso o `package.json` tem `"type": "module"`

2. **Docker Port Mapping**: O MySQL roda internamente na porta 3306, mas é exposto na porta 3307 do host para evitar conflitos

3. **Senha do MySQL**: Em produção, use senhas fortes e nunca commite o arquivo `.env`

4. **JWT Secret**: Gere um secret seguro para produção (`openssl rand -base64 32`)

## 🐳 Docker Compose

O arquivo `docker-compose.yml` configura o MySQL 8 com persistência de dados:

```yaml
services:
  mysql:
    image: mysql:8
    container_name: petshop_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: petshop
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso interno.

## 👨‍💻 Autor

Desenvolvido para o sistema de agendamento PetShop

---

**Status do Projeto:** ✅ Backend de autenticação funcionando
**Última Atualização:** 27/04/2026
