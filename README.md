# leads-test-js

Express.js version of the Go Fiber leads API: same endpoints and behavior (health check, CSV lead import with SQLite/PostgreSQL).

## Setup

```bash
cp .env.example .env
npm install
```

## Run

```bash
npm start
# or with auto-reload
npm run dev
```

Server runs at `http://localhost:3000` (or `PORT` from `.env`).

## API

| Method | Path            | Description                    |
|--------|-----------------|--------------------------------|
| GET    | `/health`       | Health check `{ "message": "OK" }` |
| POST   | `/leads/import` | Import CSV; form field `file` (CSV). Returns `{ "message": "import completed", "imported": N }` |

### CSV format

- Optional header row (first cell `name`, `nome`, or `email` is treated as header and skipped).
- Columns: name, email, phone (optional). All leads get `source: "csv_import"`.

Example:

```bash
curl -X POST http://localhost:3000/leads/import -F "file=@leads.csv"
```

## Database

- **DB_DRIVER=sqlite** (default): uses `DB_PATH` (default `./data.db`).
- **DB_DRIVER=postgres**: use `DATABASE_URL` or `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE`.

Same env semantics as the Go app in the parent repo.
