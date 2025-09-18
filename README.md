# 🛒 API AV2 - Guilherme Ruiz

Bem-vindo à API AV2 desenvolvida por Guilherme Ruiz! Este projeto é uma API RESTful para gerenciamento de usuários, produtos e lojas, construída com Node.js, Express e Prisma ORM.

## 🚀 Tecnologias Utilizadas
- Node.js
- Express.js
- Prisma ORM
- MySQL
- ZOD

## 🛠️ Instalação

1. **Clone o repositório:**
   ```bash
   git clone <URL-DO-REPOSITORIO>
   cd api-av2-guilherme-ruiz
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o banco de dados:**
   - Certifique-se de ter uma instância MySQL rodando e crie um banco de dados para o projeto.
   - Edite o arquivo `.env` na raiz do projeto para definir a variável `DATABASE_URL` com os dados do seu MySQL:
     ```env
     DATABASE_URL="mysql://<usuario>:<senha>@<host>@mysql-<usuario>.alwaysdata.net/<nome-do-banco>"
     ```
     Exemplo:
     ```env
     DATABASE_URL="mysql://gui01:123456@<host>@mysql-gui01.alwaysdata.net/api-database"
     ```
   - Rode a atualização da estrutura do banco de dados:
     ```bash
     npm run update:db
     ```
4. **Inicie o servidor:**
   ```bash
   npm run start
   ```
    Ou para ambiente de desenvolvimento
    ```bash
   npm run dev
   ```

   O servidor estará disponível em `http://localhost:3000`.

## 📚 Endpoints Disponíveis

### 🔎 Healthcheck
- **GET** `/healthcheck`
  - **Descrição:** Verifica se a API está online.
  - **Exemplo:**
    ```bash
    curl http://localhost:3000/healthcheck
    ```
  - **Resposta:**
    ```json
    { "status": "ok" }
    ```

### 👤 Usuários
- **POST** `/user`
  - **Descrição:** Cria um novo usuário.
  - **Body:**
    ```json
    { "name": "João", "email": "joao@email.com", "password": "123456" }
    ```
  - **Resposta (201):**
    ```json
    {
      "id": 1,
      "name": "João",
      "email": "joao@email.com",
      "password": "123456"
    }
    ```
  - **Resposta de erro (409):**
    ```json
    { "error": "E-mail já cadastrado" }
    ```

- **GET** `/user`
  - **Descrição:** Lista todos os usuários.
  - **Exemplo:**
    ```bash
    curl http://localhost:3000/user
    ```
  - **Resposta (200):**
    ```json
    [
      {
        "id": 1,
        "name": "João",
        "email": "joao@email.com",
        "password": "123456"
      }
    ]
    ```

- **PUT** `/user/:id`
  - **Descrição:** Atualiza um usuário existente.
  - **Exemplo:**
    ```bash
    curl -X PUT http://localhost:3000/user/1 \
      -H "Content-Type: application/json" \
      -d '{"name": "João Silva", "email": "joaosilva@email.com", "password": "12345678"}'
    ```
  - **Resposta (200):**
    ```json
    {
      "id": 1,
      "name": "João Silva",
      "email": "joaosilva@email.com",
      "password": "12345678"
    }
    ```
  - **Resposta de erro (404):**
    ```json
    { "error": "Usuário não encontrado" }
    ```

- **DELETE** `/user/:id`
  - **Descrição:** Remove um usuário pelo ID.
  - **Exemplo:**
    ```bash
    curl -X DELETE http://localhost:3000/user/1
    ```
  - **Resposta (204):** Nenhum conteúdo (No Content)
  - **Resposta de erro (404):**
    ```json
    { "error": "Usuário não encontrado" }
    ```

### 🏬 Lojas
- **POST** `/store`
  - **Descrição:** Cria uma nova loja.
  - **Body:**
    ```json
    { "name": "Loja 1", "userId": 1 }
    ```
  - **Resposta (201):**
    ```json
    {
      "id": 1,
      "name": "Loja 1",
      "userId": 1,
      "products": []
    }
    ```
  - **Resposta de erro (409):**
    ```json
    { "error": "Usuário já possui uma loja" }
    ```

- **GET** `/store`
  - **Descrição:** Lista todas as lojas.
  - **Exemplo:**
    ```bash
    curl http://localhost:3000/store
    ```
  - **Resposta (200):**
    ```json
    [
      {
        "id": 1,
        "name": "Loja 1",
        "user": { "id": 1, "name": "João", "email": "joao@email.com" },
        "products": [ { "id": 1, "name": "Produto X", "price": 10.5 } ]
      }
    ]
    ```

- **PUT** `/store/:id`
  - **Descrição:** Atualiza uma loja existente.
  - **Exemplo:**
    ```bash
    curl -X PUT http://localhost:3000/store/1 \
      -H "Content-Type: application/json" \
      -d '{"name": "Loja Atualizada"}'
    ```
  - **Resposta (200):**
    ```json
    {
      "id": 1,
      "name": "Loja Atualizada",
      "products": [ { "id": 1, "name": "Produto X", "price": 10.5 } ]
    }
    ```
  - **Resposta de erro (404):**
    ```json
    { "error": "Loja não encontrada" }
    ```

- **DELETE** `/store/:id`
  - **Descrição:** Remove uma loja pelo ID.
  - **Exemplo:**
    ```bash
    curl -X DELETE http://localhost:3000/store/1
    ```
  - **Resposta (204):** Nenhum conteúdo (No Content)
  - **Resposta de erro (404):**
    ```json
    { "error": "Loja não encontrada" }
    ```

### 📦 Produtos
- **POST** `/product`
  - **Descrição:** Cria um novo produto.
  - **Body:**
    ```json
    { "name": "Produto X", "price": 10.5, "storeId": 1 }
    ```
  - **Resposta (201):**
    ```json
    {
      "id": 1,
      "name": "Produto X",
      "price": 10.5,
      "storeId": 1
    }
    ```

- **GET** `/product`
  - **Descrição:** Lista todos os produtos.
  - **Exemplo:**
    ```bash
    curl http://localhost:3000/product
    ```
  - **Resposta (200):**
    ```json
    [
      {
        "id": 1,
        "name": "Produto X",
        "price": 10.5,
        "store": {
          "id": 1,
          "name": "Loja 1",
          "user": { "id": 1, "name": "João", "email": "joao@email.com" }
        }
      }
    ]
    ```

- **PUT** `/product/:id`
  - **Descrição:** Atualiza um produto existente.
  - **Exemplo:**
    ```bash
    curl -X PUT http://localhost:3000/product/1 \
      -H "Content-Type: application/json" \
      -d '{"name": "Produto Y", "price": 20.0, "storeId": 1}'
    ```
  - **Resposta (200):**
    ```json
    {
      "id": 1,
      "name": "Produto Y",
      "price": 20.0,
      "storeId": 1
    }
    ```
  - **Resposta de erro (404):**
    ```json
    { "error": "Loja informada não existe" }
    ```

- **DELETE** `/product/:id`
  - **Descrição:** Remove um produto pelo ID.
  - **Exemplo:**
    ```bash
    curl -X DELETE http://localhost:3000/product/1
    ```
  - **Resposta (204):** Nenhum conteúdo (No Content)

## 🧪 Testes
 Utilize o arquivo Insomnia (`insominia/Insomnia.json`) para importar as requisições e testar a API facilmente.
 Baixe o Insomnia gratuitamente em: [https://insomnia.rest/download](https://insomnia.rest/download)

## 🎬 Demonstração em Vídeo

Assista ao vídeo demonstrativo do uso da API no Insomnia:

▶️ [Ver vídeo Insomnia](docs/insominia.mp4)

- O projeto segue uma estrutura modular por recurso (user, store, product).

## 👨‍💻 Autor
- Guilherme Ruiz

---

Sinta-se à vontade para contribuir ou sugerir melhorias!