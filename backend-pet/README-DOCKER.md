# 🐾 Backend PetShop - Executando com Docker

## ⚙️ Duas Formas de Rodar

### 🐳 **OPÇÃO 1: Docker Completo (Recomendado)**

Backend e MySQL rodam em containers. Melhor para produção e consistência.

```bash
docker compose up -d
```

### 💻 **OPÇÃO 2: Desenvolvimento Local**

Apenas MySQL no Docker, backend roda localmente (útil para debug).

```bash
# 1. Garantir que MySQL está rodando
docker compose up mysql -d

# 2. Rodar backend localmente
npm run dev
```

---

## 🚀 Como Usar

### Iniciar os serviços

```bash
docker compose up -d
```

Isso iniciará:

- **MySQL** na porta `3307` (container: `petshop_mysql`)
- **Backend Node.js** na porta `3001` (container: `petshop_backend`)

### Ver logs do backend

```bash
docker logs petshop_backend
```

Para acompanhar em tempo real:

```bash
docker logs -f petshop_backend
```

### Parar os serviços

```bash
docker compose down
```

### Reconstruir após mudanças no código

```bash
docker compose up --build -d
```

### Criar usuários de teste

```bash
docker exec petshop_backend node src/createTestUsers.js
```

**Usuários criados:**

- **Admin**: admin@petshop.com / 123456
- **Cliente**: cliente@petshop.com / 123456

## 📦 Estrutura Docker

### Serviços

**MySQL**

- Container: `petshop_mysql`
- Porta: `3307:3306`
- Banco: `petshop`
- Usuário: `root`
- Senha: `123456`
- Volume persistente: `mysql_data`

**Backend**

- Container: `petshop_backend`
- Porta: `3001:3001`
- Hot reload: ✅ (via volume mount)
- Aguarda MySQL ficar saudável antes de iniciar

## 🔧 Configuração

### Arquivos de Ambiente

O projeto usa o arquivo `.env` que está configurado por padrão para **rodar localmente**:

**`.env` (padrão - desenvolvimento local)**

```env
PORT=3001
DB_HOST=localhost      # Para conectar ao MySQL Docker da máquina local
DB_PORT=3307          # Porta exposta do container MySQL
DB_USER=root
DB_PASSWORD=123456
DB_NAME=petshop
JWT_SECRET=segredo_super
```

**Para Docker**, as variáveis são definidas diretamente no `docker-compose.yml`:

- O backend dentro do container usa `DB_HOST=mysql` (nome do serviço)
- A porta interna é `DB_PORT=3306`
- As variáveis são injetadas automaticamente

### ⚠️ Importante

- **Rodando localmente** (`npm run dev`): Usa `.env` com `DB_HOST=localhost` e `DB_PORT=3307`
- **Rodando no Docker** (`docker compose up`): Ignora `.env`, usa variáveis do `docker-compose.yml`

## 📊 Verificar Status

```bash
# Ver containers rodando
docker ps

# Ver todos os containers (incluindo parados)
docker ps -a

# Acessar o shell do backend
docker exec -it petshop_backend sh

# Acessar o MySQL
docker exec -it petshop_mysql mysql -u root -p123456 petshop
```

## 🗄️ Banco de Dados

Os dados são persistidos no volume Docker `mysql_data`.

Para resetar completamente o banco:

```bash
docker compose down -v  # Remove volumes
docker compose up -d     # Recria tudo
```

### 🔍 Como Acessar o Banco de Dados

#### 1️⃣ Via Terminal (MySQL CLI)

Acesse o MySQL diretamente:

```bash
docker exec -it petshop_mysql mysql -u root -p123456 petshop
```

Depois você pode executar queries SQL:

```sql
-- Ver todas as tabelas
SHOW TABLES;

-- Ver usuários
SELECT * FROM Users;

-- Ver pets
SELECT * FROM Pets;

-- Ver agendamentos
SELECT * FROM Appointments;

-- Ver estrutura de uma tabela
DESCRIBE Users;

-- Ver agendamentos com informações completas
SELECT
  a.id,
  a.data,
  a.hora,
  a.servico,
  a.status,
  u.name as cliente_nome,
  p.nome as pet_nome
FROM Appointments a
JOIN Users u ON a.UserId = u.id
JOIN Pets p ON a.PetId = p.id;

-- Sair do MySQL
EXIT;
```

#### 2️⃣ Via MySQL Workbench (Interface Gráfica)

1. Baixe o [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. Crie uma nova conexão:
   - **Connection Name:** `PetShop Docker`
   - **Hostname:** `localhost`
   - **Port:** `3307`
   - **Username:** `root`
   - **Password:** `123456`
   - **Default Schema:** `petshop`
3. Teste a conexão e salve

#### 3️⃣ Via DBeaver (Alternativa Gratuita)

1. Baixe o [DBeaver Community](https://dbeaver.io/download/)
2. Nova Conexão → MySQL
   - **Host:** `localhost`
   - **Port:** `3307`
   - **Database:** `petshop`
   - **Username:** `root`
   - **Password:** `123456`
3. Clique em "Test Connection" e depois "Finish"

#### 4️⃣ Via phpMyAdmin (Interface Web)

Adicione ao `docker-compose.yml`:

```yaml
services:
  mysql:
    # ... configuração existente

  backend:
    # ... configuração existente

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: petshop_phpmyadmin
    restart: always
    ports:
      - "8080:80"
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
    depends_on:
      - mysql
```

Depois execute:

```bash
docker compose up -d
```

Acesse: **http://localhost:8080**

- **Server:** `mysql`
- **Username:** `root`
- **Password:** `123456`

#### ⚡ Comandos Rápidos para Consultas

```bash
# Ver todos os usuários
docker exec petshop_mysql mysql -u root -p123456 -e "SELECT id, name, email, role FROM petshop.Users;"

# Ver todos os pets
docker exec petshop_mysql mysql -u root -p123456 -e "SELECT * FROM petshop.Pets;"

# Ver agendamentos
docker exec petshop_mysql mysql -u root -p123456 -e "SELECT * FROM petshop.Appointments;"

# Contar registros
docker exec petshop_mysql mysql -u root -p123456 -e "SELECT 'Users' as tabela, COUNT(*) as total FROM petshop.Users UNION SELECT 'Pets', COUNT(*) FROM petshop.Pets UNION SELECT 'Appointments', COUNT(*) FROM petshop.Appointments;"
```

#### 💾 Backup e Restore

**Fazer backup do banco:**

```bash
docker exec petshop_mysql mysqldump -u root -p123456 petshop > backup_petshop.sql
```

**Restaurar backup:**

```bash
docker exec -i petshop_mysql mysql -u root -p123456 petshop < backup_petshop.sql
```

**Backup com timestamp:**

```bash
# Windows PowerShell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
docker exec petshop_mysql mysqldump -u root -p123456 petshop > "backup_petshop_$timestamp.sql"
```

## 🌐 Endpoints da API

Base URL: `http://localhost:3001`

### Autenticação

- `POST /auth/register` - Cadastro
- `POST /auth/login` - Login

### Pets (requer autenticação)

- `GET /pets` - Listar pets do usuário
- `POST /pets` - Cadastrar pet
- `DELETE /pets/:id` - Remover pet

### Agendamentos (requer autenticação)

- `GET /agendamentos` - Listar agendamentos do usuário
- `POST /agendamentos` - Criar agendamento
- `GET /agendamentos/admin` - Listar todos (admin)
- `PUT /agendamentos/:id/status` - Atualizar status (admin)

## ✅ Tudo Salvo no Banco Docker!

Todos os dados (usuários, pets, agendamentos) são salvos no **MySQL rodando no container Docker**, não mais em localhost. Os dados persistem mesmo após reiniciar os containers!
