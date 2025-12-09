# Documento de Contexto do Projeto - Backend Pizzaria

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Organização de Pastas](#organização-de-pastas)
3. [Tecnologias e Versões](#tecnologias-e-versões)
4. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
5. [Endpoints](#endpoints)
6. [Validação de Schemas](#validação-de-schemas)
7. [Middlewares](#middlewares)
8. [Configurações](#configurações)

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas (Layered Architecture) com separação clara de responsabilidades:

### Fluxo de Requisição

```
Routes → Controller → Service → Database (Prisma)
         ↓            ↓
    Middlewares   Validações
```

### Descrição das Camadas

1. **Routes** (`src/routes.ts`)
   - Define os endpoints da API
   - Aplica middlewares (autenticação, validação, autorização)
   - Conecta as rotas aos controllers

2. **Controllers** (`src/controllers/`)
   - Recebem as requisições HTTP
   - Extraem dados da requisição (body, params, query)
   - Chamam os services apropriados
   - Retornam respostas HTTP formatadas

3. **Services** (`src/services/`)
   - Contêm a lógica de negócio
   - Fazem operações no banco de dados através do Prisma
   - Validam regras de negócio
   - Retornam dados processados para os controllers

4. **Database** (Prisma ORM)
   - Camada de abstração do banco de dados
   - Gerencia conexões e queries
   - Valida tipos e relacionamentos

### Exemplo de Fluxo

```
1. Cliente faz requisição POST /users
2. Route recebe e aplica validateSchema
3. Controller extrai { name, email, password } do body
4. Controller chama CreateUserService.execute()
5. Service valida se email já existe
6. Service criptografa senha com bcrypt
7. Service cria usuário no banco via Prisma
8. Service retorna dados do usuário (sem senha)
9. Controller retorna resposta JSON para o cliente
```

---

## 📁 Organização de Pastas

```
backend/
├── prisma/
│   ├── migrations/          # Migrações do banco de dados
│   └── schema.prisma        # Schema do Prisma (modelagem)
├── src/
│   ├── @types/              # Definições de tipos TypeScript
│   │   └── express/
│   │       └── index.d.ts   # Extensão do tipo Request do Express
│   ├── config/              # Arquivos de configuração
│   │   ├── multer.ts        # Configuração de upload de arquivos
│   │   └── cloudinary.ts    # Configuração do Cloudinary
│   ├── controllers/         # Controllers (camada de apresentação)
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoriesController.ts
│   │   ├── product/
│   │   │   └── CreateProductController.ts
│   │   └── user/
│   │       ├── AuthUserController.ts
│   │       ├── CreateUserController.ts
│   │       └── DetailUserController.ts
│   ├── generated/           # Arquivos gerados pelo Prisma
│   │   └── prisma/
│   ├── middlewares/         # Middlewares do Express
│   │   ├── isAdmin.ts
│   │   ├── isAuthenticated.ts
│   │   └── validateSchema.ts
│   ├── prisma/              # Configuração do Prisma Client
│   │   └── index.ts
│   ├── routes.ts            # Definição de todas as rotas
│   ├── schemas/             # Schemas de validação (Zod)
│   │   ├── categorySchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   ├── services/            # Services (lógica de negócio)
│   │   ├── category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   └── ListCategoriesService.ts
│   │   ├── product/
│   │   │   └── CreateProductService.ts
│   │   └── user/
│   │       ├── AuthUserService.ts
│   │       ├── CreateUserService.ts
│   │       └── DetailUserService.ts
│   └── server.ts            # Arquivo principal do servidor
├── package.json
├── tsconfig.json
└── CONTEXT.md               # Este documento
```

### Convenções de Nomenclatura

- **Controllers**: `[Ação][Entidade]Controller.ts` (ex: `CreateUserController.ts`)
- **Services**: `[Ação][Entidade]Service.ts` (ex: `CreateUserService.ts`)
- **Schemas**: `[entidade]Schema.ts` (ex: `userSchema.ts`)
- **Métodos**: 
  - Controllers: `handle(req, res)`
  - Services: `execute({ ...params })`

---

## 🛠️ Tecnologias e Versões

### Dependencies (Produção)

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| `@prisma/adapter-pg` | ^7.1.0 | Adaptador PostgreSQL para Prisma |
| `@prisma/client` | ^7.1.0 | Cliente Prisma ORM |
| `bcryptjs` | ^3.0.3 | Criptografia de senhas |
| `cloudinary` | ^2.8.0 | Armazenamento e gerenciamento de imagens |
| `cors` | ^2.8.5 | Configuração CORS |
| `dotenv` | ^17.2.3 | Gerenciamento de variáveis de ambiente |
| `express` | ^5.2.1 | Framework web Node.js |
| `jsonwebtoken` | ^9.0.3 | Geração e validação de JWT |
| `multer` | ^2.0.2 | Middleware para upload de arquivos |
| `pg` | ^8.16.3 | Driver PostgreSQL |
| `tsx` | ^4.21.0 | Executor TypeScript |
| `zod` | ^4.1.13 | Validação de schemas |

### DevDependencies (Desenvolvimento)

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| `@types/cors` | ^2.8.19 | Tipos TypeScript para CORS |
| `@types/express` | ^5.0.6 | Tipos TypeScript para Express |
| `@types/jsonwebtoken` | ^9.0.10 | Tipos TypeScript para JWT |
| `@types/multer` | ^2.0.0 | Tipos TypeScript para Multer |
| `@types/node` | ^24.10.1 | Tipos TypeScript para Node.js |
| `@types/pg` | ^8.15.6 | Tipos TypeScript para PostgreSQL |
| `prisma` | ^7.1.0 | CLI do Prisma |
| `typescript` | ^5.9.3 | Compilador TypeScript |

### Versões de Runtime

- **Node.js**: Compatível com versões que suportam ES2020
- **TypeScript**: 5.9.3
- **PostgreSQL**: Compatível com Prisma 7.1.0

---

## 🗄️ Modelagem do Banco de Dados

### Banco de Dados

- **SGBD**: PostgreSQL
- **ORM**: Prisma 7.1.0
- **Provider**: `@prisma/adapter-pg`

### Modelos

#### User (users)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  role      Role     @default(STAFF)

  @@map("users")
}
```

**Campos:**
- `id`: UUID (chave primária)
- `name`: Nome do usuário
- `email`: Email único
- `password`: Senha criptografada
- `role`: Enum (ADMIN ou STAFF) - padrão: STAFF
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

#### Category (categories)

```prisma
model Category {
  id        String    @id @default(uuid())
  name      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  products  Product[]  

  @@map("categories")
}
```

**Campos:**
- `id`: UUID (chave primária)
- `name`: Nome da categoria
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- `products`: Relacionamento 1:N com Product

#### Product (products)

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  price       Int
  description String
  image       String
  banner      String
  disabled    Boolean  @default(false)
  category_id String
  category    Category @relation(fields: [category_id], references: [id], onDelete: Cascade)
  Items       Item[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```

**Campos:**
- `id`: UUID (chave primária)
- `name`: Nome do produto
- `price`: Preço (em centavos ou unidade mínima)
- `description`: Descrição do produto
- `image`: URL da imagem
- `banner`: URL do banner
- `disabled`: Status de disponibilidade (padrão: false)
- `category_id`: FK para Category
- `category`: Relacionamento N:1 com Category
- `Items`: Relacionamento 1:N com Item
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

#### Order (orders)

```prisma
model Order {
  id        String   @id @default(uuid())
  table     Int
  status    Boolean  @default(false)
  draft     Boolean  @default(true)
  name      String?
  items     Item[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("orders")
}
```

**Campos:**
- `id`: UUID (chave primária)
- `table`: Número da mesa
- `status`: Status do pedido (padrão: false)
- `draft`: Se é rascunho (padrão: true)
- `name`: Nome do cliente (opcional)
- `items`: Relacionamento 1:N com Item
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

#### Item (items)

```prisma
model Item {
  id         String   @id @default(uuid())
  amount     Int
  order_id   String
  order      Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt DateTime  @updatedAt
  product_id String
  produto    Product  @relation(fields: [product_id], references: [id], onDelete: Cascade)

  @@map("items")
}
```

**Campos:**
- `id`: UUID (chave primária)
- `amount`: Quantidade do item
- `order_id`: FK para Order
- `order`: Relacionamento N:1 com Order
- `product_id`: FK para Product
- `produto`: Relacionamento N:1 com Product
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Enums

```prisma
enum Role {
  ADMIN
  STAFF
}
```

### Relacionamentos

1. **Category ↔ Product**: 1:N (uma categoria tem muitos produtos)
2. **Product ↔ Item**: 1:N (um produto pode estar em muitos itens)
3. **Order ↔ Item**: 1:N (um pedido tem muitos itens)

### Constraints

- **Cascade Delete**: Ao deletar uma Category, todos os Products relacionados são deletados
- **Cascade Delete**: Ao deletar um Product, todos os Items relacionados são deletados
- **Cascade Delete**: Ao deletar um Order, todos os Items relacionados são deletados
- **Unique**: Email do User é único

---

## 🔌 Endpoints

### Base URL

```
http://localhost:3333
```

### Endpoints Disponíveis

#### 1. Criar Usuário

```http
POST /users
```

**Autenticação**: Não requerida

**Validação**: `createUserSchema`

**Body:**
```json
{
  "name": "string (min: 3 caracteres)",
  "email": "string (email válido)",
  "password": "string (min: 6 caracteres)"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "STAFF",
  "createdAt": "datetime"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Erro validação",
  "details": [
    {
      "mensagem": "Nome deve ter no mínimo 3 caracteres"
    }
  ]
}
```

---

#### 2. Autenticar Usuário (Login)

```http
POST /session
```

**Autenticação**: Não requerida

**Validação**: `authUserSchema`

**Body:**
```json
{
  "email": "string (email válido)",
  "password": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "ADMIN | STAFF",
  "token": "jwt_token"
}
```

**Resposta de Erro:**
```json
{
  "error": "Usuário ou senha incorretas"
}
```

**Token JWT:**
- **Expiração**: 30 dias
- **Payload**: `{ name, email, sub: user_id }`
- **Header**: `Authorization: Bearer <token>`

---

#### 3. Detalhes do Usuário Logado

```http
GET /me
```

**Autenticação**: Requerida (`isAuthenticated`)

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "ADMIN | STAFF",
  "createdAt": "datetime"
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Token não fornecido"
}
```
ou
```json
{
  "error": "Token inválido"
}
```

---

#### 4. Criar Categoria

```http
POST /category
```

**Autenticação**: Requerida (`isAuthenticated` + `isAdmin`)

**Validação**: `createCategorySchema`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "string (min: 2 caracteres)"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid",
  "name": "string",
  "createdAt": "datetime"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Erro validação",
  "details": [
    {
      "mensagem": "Nome da categoria precisa ter 2 caracteres"
    }
  ]
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Usuário sem permissão"
}
```

---

#### 5. Listar Categorias

```http
GET /category
```

**Autenticação**: Requerida (`isAuthenticated`)

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "createdAt": "datetime"
  }
]
```

**Resposta de Erro (401):**
```json
{
  "error": "Token não fornecido"
}
```
ou
```json
{
  "error": "Token inválido"
}
```

---

#### 6. Criar Produto

```http
POST /product
```

**Autenticação**: Requerida (`isAuthenticated` + `isAdmin`)

**Validação**: `createProductSchema`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
name: string (obrigatório)
price: string (obrigatório)
description: string (obrigatório)
category_id: string (obrigatório, UUID válido)
file: File (imagem obrigatória)
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "price": number,
  "description": "string",
  "category_id": "uuid",
  "banner": "string (URL da imagem)",
  "createdAt": "datetime"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Erro validação",
  "details": [
    {
      "mensagem": "O nome do produto é obrigatório"
    }
  ]
}
```

**Resposta de Erro (400):**
```json
{
  "error": "A imagem do produto é obrigatória"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Categoria não encontrada"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Formato de arquvi inválido, use apenas jpeg, jpg e png"
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Usuário sem permissão"
}
```

**Notas:**
- O upload de imagem é obrigatório e deve ser enviado como `multipart/form-data`
- Formatos aceitos: JPEG, JPG, PNG
- Tamanho máximo: 4MB
- A imagem é enviada para o Cloudinary e a URL retornada é salva nos campos `image` e `banner` do produto

---

## ✅ Validação de Schemas

O projeto utiliza **Zod** (v4.1.13) para validação de schemas. Os schemas são aplicados através do middleware `validateSchema`.

### Estrutura dos Schemas

Todos os schemas seguem o padrão:

```typescript
z.object({
  body: z.object({
    // campos do body
  }),
  params: z.object({
    // campos dos params (quando necessário)
  }),
  query: z.object({
    // campos da query (quando necessário)
  })
})
```

### Schemas Disponíveis

#### createUserSchema

**Arquivo**: `src/schemas/userSchema.ts`

```typescript
z.object({
  body: z.object({
    name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string({ message: "Senha é obrigatória" })
      .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
  })
})
```

**Validações:**
- `name`: String com mínimo de 3 caracteres
- `email`: String com formato de email válido
- `password`: String obrigatória com mínimo de 6 caracteres

---

#### authUserSchema

**Arquivo**: `src/schemas/userSchema.ts`

```typescript
z.object({
  body: z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string({ message: "Senha é obrigatória" })
  })
})
```

**Validações:**
- `email`: String com formato de email válido
- `password`: String obrigatória

---

#### createCategorySchema

**Arquivo**: `src/schemas/categorySchema.ts`

```typescript
z.object({
  body: z.object({
    name: z.string("Categoria precisa ser um texto")
      .min(2, { message: "Nome da categoria precisa ter 2 caracteres" })
  })
})
```

**Validações:**
- `name`: String com mínimo de 2 caracteres

---

#### createProductSchema

**Arquivo**: `src/schemas/productSchema.ts`

```typescript
z.object({
  body: z.object({
    name: z.string().min(1, { message: "O nome do produto é obrigatório" }),
    price: z.string().min(1, { message: "O valor do produto é obrigatório" }),
    description: z.string().min(1, { message: "A descrição do produto é obrigatório" }),
    category_id: z.string().min(1, { message: "A categoria do produto é obrigatório" })
  })
})
```

**Validações:**
- `name`: String obrigatória (mínimo 1 caractere)
- `price`: String obrigatória (mínimo 1 caractere)
- `description`: String obrigatória (mínimo 1 caractere)
- `category_id`: String obrigatória (mínimo 1 caractere, deve ser UUID válido)

**Nota**: A validação do arquivo de imagem é feita no controller, não no schema.

---

### Middleware de Validação

**Arquivo**: `src/middlewares/validateSchema.ts`

O middleware `validateSchema` recebe um schema Zod e valida:
- `req.body`
- `req.params`
- `req.query`

**Resposta de Erro (400):**
```json
{
  "error": "Erro validação",
  "details": [
    {
      "mensagem": "Mensagem de erro específica"
    }
  ]
}
```

---

## 🛡️ Middlewares

### 1. isAuthenticated

**Arquivo**: `src/middlewares/isAuthenticated.ts`

**Função**: Verifica se o usuário está autenticado através de um token JWT.

**Fluxo:**
1. Extrai o token do header `Authorization` (formato: `Bearer <token>`)
2. Verifica se o token foi fornecido
3. Valida o token usando `JWT_SECRET`
4. Extrai o `user_id` do payload e adiciona em `req.user_id`
5. Chama `next()` se válido, retorna erro 401 se inválido

**Uso:**
```typescript
router.get("/me", isAuthenticated, new DetailUserController().handle)
```

**Respostas de Erro:**
- `401`: Token não fornecido
- `401`: Token inválido

**Extensão do Request:**
O middleware adiciona `user_id` ao objeto `req`:
```typescript
req.user_id: string
```

---

### 2. isAdmin

**Arquivo**: `src/middlewares/isAdmin.ts`

**Função**: Verifica se o usuário autenticado tem permissão de administrador.

**Pré-requisito**: Deve ser usado após `isAuthenticated` (requer `req.user_id`)

**Fluxo:**
1. Verifica se `req.user_id` existe
2. Busca o usuário no banco de dados
3. Verifica se o usuário existe
4. Verifica se `user.role === "ADMIN"`
5. Chama `next()` se for admin, retorna erro 401 se não for

**Uso:**
```typescript
router.post("/category", isAuthenticated, isAdmin, validateSchema(...), ...)
```

**Respostas de Erro:**
- `401`: Usuário sem permissão (se não for admin ou não existir)

---

### 3. validateSchema

**Arquivo**: `src/middlewares/validateSchema.ts`

**Função**: Valida os dados da requisição usando schemas Zod.

**Fluxo:**
1. Recebe um schema Zod como parâmetro
2. Valida `req.body`, `req.params` e `req.query`
3. Se válido, chama `next()`
4. Se inválido, retorna erro 400 com detalhes das validações

**Uso:**
```typescript
router.post('/users', validateSchema(createUserSchema), new CreateUserController().handle)
```

**Respostas de Erro:**
- `400`: Erro de validação com detalhes
- `500`: Erro interno do servidor (se não for ZodError)

---

## ⚙️ Configurações

### Variáveis de Ambiente

O projeto utiliza `dotenv` para gerenciar variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"

# JWT
JWT_SECRET="seu_secret_jwt_aqui"

# Cloudinary (Upload de Imagens)
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"

# Server
PORT=3333
```

### TypeScript

**Arquivo**: `tsconfig.json`

**Configurações Principais:**
- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Ativado
- **Source Maps**: Ativado
- **Root Dir**: `./src`
- **Out Dir**: `./dist`

### Prisma

**Arquivo**: `prisma/schema.prisma`

**Configurações:**
- **Provider**: PostgreSQL
- **Client Output**: `../src/generated/prisma`
- **Adapter**: `@prisma/adapter-pg`

### Upload de Arquivos

**Arquivo**: `src/config/multer.ts`

**Configurações:**
- **Storage**: `memoryStorage()` (armazena arquivos em memória)
- **Limite de Tamanho**: 4MB por arquivo
- **Formatos Permitidos**: JPEG, JPG, PNG
- **Validação**: Verifica o mimetype do arquivo antes do upload

**Arquivo**: `src/config/cloudinary.ts`

**Configurações:**
- **Provider**: Cloudinary v2
- **Pasta de Upload**: `products/`
- **Nome do Arquivo**: `${Date.now()}-${imageName}` (timestamp + nome original)
- **Tipo de Recurso**: `image`

**Fluxo de Upload:**
1. Arquivo é recebido via Multer (armazenado em memória)
2. Buffer é convertido em stream
3. Stream é enviado para Cloudinary
4. URL da imagem é retornada e salva no banco de dados

### Servidor Express

**Arquivo**: `src/server.ts`

**Configurações:**
- **JSON Parser**: Ativado
- **CORS**: Ativado (permitindo todas as origens)
- **Error Handler**: Middleware global para tratamento de erros
- **Porta**: 3333 (padrão) ou `process.env.PORT`

### Scripts Disponíveis

```json
{
  "dev": "tsx watch src/server.ts",  // Desenvolvimento com hot reload
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

---

## 📝 Notas Adicionais

### Segurança

- Senhas são criptografadas usando `bcryptjs` com salt rounds de 8
- Tokens JWT expiram em 30 dias
- Validação de schemas impede dados inválidos
- Middleware de autenticação protege rotas sensíveis
- Middleware de autorização garante que apenas admins acessem certas rotas

### Tratamento de Erros

- Erros de validação retornam status 400 com detalhes
- Erros de autenticação retornam status 401
- Erros internos retornam status 500
- Middleware global captura erros não tratados

### Extensões de Tipo

O projeto estende o tipo `Request` do Express para incluir `user_id`:

```typescript
declare namespace Express {
  export interface Request {
    user_id: string
  }
}
```

---

**Última atualização**: Dezembro 2024
**Versão do documento**: 1.0.0



