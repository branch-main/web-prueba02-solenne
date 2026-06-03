# Solenne

A full stack boutique commerce project built as a Bun monorepo. It includes an Express REST API, PostgreSQL with Prisma, JWT admin authentication, external image API fallback, and a polished Next.js storefront with an admin product manager.

The assignment mentions MySQL. This implementation uses PostgreSQL because Render provides managed PostgreSQL and is the planned deployment target.

## Tech stack

- Bun workspaces
- Express 5 and TypeScript
- PostgreSQL and Prisma
- Zod validation
- JWT and bcryptjs
- Next.js App Router
- Render for database and API
- Vercel for frontend

## Project structure

```txt
apps/api   Express API, Prisma schema, seed script
apps/web   Next.js storefront and admin dashboard
docs       Design documentation
```

## Local setup

1. Install dependencies.

```bash
bun install
```

2. Start a local PostgreSQL database with Docker.

```bash
docker start solenne-postgres 2>/dev/null || docker run --name solenne-postgres \
  -e POSTGRES_USER=solenne \
  -e POSTGRES_PASSWORD=solenne \
  -e POSTGRES_DB=solenne_store \
  -p 5432:5432 \
  -v solenne-postgres-data:/var/lib/postgresql/data \
  -d postgres:16-alpine
```

3. Environment files are included for local development:

```txt
apps/api/.env
apps/api/.env.example
apps/web/.env.local
apps/web/.env.example
```

4. Run Prisma and seed data.

```bash
bun run prisma:migrate
bun run prisma:seed
```

5. Start both apps in separate terminals.

```bash
bun run dev:api
bun run dev:web
```

Frontend: http://localhost:3000
API: http://localhost:4000

Seeded admin: `admin@solenne.local` / `admin123`

## API endpoints

```txt
POST /api/auth/login
GET  /api/auth/me

GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Protected routes require an admin JWT:

```txt
Authorization: Bearer <token>
```

## API examples

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@solenne.local","password":"admin123"}'
```

List products:

```bash
curl http://localhost:4000/api/products
```

Get one product:

```bash
curl http://localhost:4000/api/products/1
```

Create product:

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Desk Lamp","description":"Warm brass lamp","price":79.99,"stock":10}'
```

Update product:

```bash
curl -X PUT http://localhost:4000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Desk Lamp Pro","description":"Warm brass lamp","price":89.99,"stock":8,"imageUrl":"https://example.com/lamp.jpg"}'
```

Delete product:

```bash
curl -X DELETE http://localhost:4000/api/products/1 \
  -H "Authorization: Bearer <token>"
```

## Deployment

### Render PostgreSQL

1. Create a managed PostgreSQL database in Render.
2. Copy the internal database URL.

### Render API

Create a Render Web Service using this repository.

- Root directory: `apps/api`
- Build command: `bun install && bun run prisma:generate && bun run prisma:deploy`
- Start command: `bun run start`
- Environment variables: use the API variables shown above with production values.
- Set `CORS_ORIGIN` to your Vercel URL.

Run the seed command once from a Render shell:

```bash
bun run prisma:seed
```

### Vercel frontend

Create a Vercel project with root directory `apps/web`.

Set:

```txt
NEXT_PUBLIC_API_URL="https://your-render-api.onrender.com"
```

## Screenshots

Add storefront, product detail, login, and admin dashboard screenshots here before submission.

## Verification checklist

- Backend starts locally with Bun.
- Prisma migration runs successfully.
- Seed script creates an admin user.
- Admin can log in.
- Public product list loads.
- Public product detail loads.
- Admin can create a product.
- Product creation without an image uses the image provider fallback.
- Admin can update a product.
- Admin can delete a product.
- Deployed frontend can call the deployed API.
- API CORS configuration allows the Vercel frontend origin.
