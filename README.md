## Definition of Done

A backlog item is Done when:

- [ ] Code is committed with a descriptive message
- [ ] It runs locally per the relevant lecture's Code Walkthrough
- [ ] It does not break previously-passing verification steps
- [ ] New setup steps are documented here

## Process

Inkwell follows an incremental process: one lecture, one increment.
See docs/BACKLOG.md for the current product backlog.

## Getting Started

### Prerequisites

- Node.js >= 22 (see server/package.json's engines field)
- Docker (for local PostgreSQL)

### Database

```bash
docker run --name inkwell-postgres \
  -e POSTGRES_USER=inkwell \
  -e POSTGRES_PASSWORD=inkwell \
  -e POSTGRES_DB=inkwell_dev \
  -p 5432:5432 \
  -d postgres:16
```

Already created this container once? Use `docker start inkwell-postgres` instead.

### Server

From the project root:

```bash
cd server
npm install
cp .env.example .env
```

Set this value in `server/.env`:

```dotenv
DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_dev"
```

Then run:

```bash
npx prisma migrate deploy
npm run dev
```

The API runs on port 4000.

### Client

In a separate terminal, from the project root:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

### Running the tests

The integration tests use a separate `inkwell_test` database. Create it once:

```bash
docker exec inkwell-postgres psql -U inkwell -d inkwell_dev -c "CREATE DATABASE inkwell_test;"
```

From the project root, apply its migrations:

```bash
cd server
DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_test" npx prisma migrate deploy
```

Run server tests from the project root:

```bash
cd server
npm test
```

Run client tests from the project root in a separate terminal:

```bash
cd client
npx vitest run
```

Run end-to-end tests from the project root with both development servers running:

```bash
npx playwright test
```