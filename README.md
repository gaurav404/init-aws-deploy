## init-aws-deploy

Full‑stack monorepo for a rental listings platform.

- **Client**: Next.js (App Router), React, Tailwind, Redux Toolkit Query, AWS Amplify Auth UI
- **Server**: Express, Prisma, PostgreSQL (PostGIS), JWT auth (Cognito idToken), Swagger docs
- **Infra/dev**: Docker Compose (Postgres), TypeScript

### Requirements

- Node.js 20+
- Docker Desktop (for local PostgreSQL via Docker Compose)
- npm (or pnpm/yarn)

## Quick start

### 1) Start the database

From `server/`:

```bash
cd server
docker compose up -d
```

This starts Postgres with PostGIS using the credentials configured in `server/docker-compose.yml`:

- user: `myuser`
- password: `mypassword`
- db: `mydatabase`
- port: `5432` (exposed to localhost)

### 2) Configure environment variables

Create `server/.env`:

```bash
PORT=3000
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase

# If using S3 uploads
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-s3-bucket-name
```

Create `client/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

If you are using AWS Cognito with Amplify on the client, ensure Amplify is configured and the id token contains `custom:role` set to either `tenant` or `manager`.

### 3) Install dependencies

From repo root:

```bash
cd server && npm install
cd ../client && npm install
```

### 4) Migrate and seed the database

From `server/`:

```bash
npm run migrate:seed
```

This runs `prisma migrate dev` and seeds initial data from `prisma/seed.ts` and `prisma/seedData/*`.

### 5) Start the API server

From `server/`:

```bash
npm run dev
```

The API will listen on `http://localhost:3000`.

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs-json`

Protected routes expect an `Authorization: Bearer <JWT>` header. The middleware reads `custom:role` from the token to authorize roles (`tenant` or `manager`).

### 6) Start the web client

From `client/`:

```bash
npm run dev
```

Visit `http://localhost:3000` for the API and your Next.js app at the port shown by Next (typically `http://localhost:3001` or similar if 3000 is in use by the API).

## Scripts

### Server (`server/package.json`)

- `npm run build`: TypeScript build to `dist/`
- `npm run start`: Build then start Node on `dist/index.js`
- `npm run dev`: Concurrent TypeScript watch + Nodemon on `src/index.ts`
- `npm run seed`: Seed database (`prisma/seed.ts`)
- `npm run migrate:seed`: Run Prisma migrate dev then seed
- `npm run prisma:generate`: `prisma generate` then copy Prisma types to the client

After generating Prisma client, type declarations are copied to `client/src/types/prismaTypes.d.ts` for shared typing.

### Client (`client/package.json`)

- `npm run dev`: Start Next.js dev server
- `npm run build`: Build Next.js
- `npm run start`: Start production server
- `npm run lint`: Lint

## Environment variables

### Server

- `PORT` (default 3000)
- `DATABASE_URL` (PostgreSQL connection string)
- `AWS_REGION` (required for S3 upload features)
- `AWS_BUCKET_NAME` (required for S3 upload features)

### Client

- `NEXT_PUBLIC_API_BASE_URL` (e.g., `http://localhost:3000`)

## API

- Base URL: `http://localhost:3000`
- Docs: `http://localhost:3000/docs`

Auth: Provide a valid JWT in the `Authorization` header. The middleware uses the token’s `sub` as the user id and `custom:role` for role‑based access.

## Project structure

```
init-aws-deploy/
  client/        # Next.js app (App Router)
  server/        # Express API + Prisma + Postgres
```

## Notes

- Docker Compose includes only Postgres by default. An Express service is sketched but commented out; local dev runs the API directly on your machine.
- S3 upload endpoints require `AWS_REGION` and `AWS_BUCKET_NAME`. Ensure the IAM role/credentials used by your environment allow PutObject to that bucket.

## Troubleshooting

- Prisma cannot connect: verify Docker is running and `DATABASE_URL` points to `localhost:5432` with the credentials in `docker-compose.yml`.
- 401/403 from API: ensure `Authorization: Bearer <JWT>` is present and the token contains `custom:role` matching the required role.

## License

ISC (see `server/package.json`).


