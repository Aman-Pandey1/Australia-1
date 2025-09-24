## Escortify-like Directory (Full‑stack)

This workspace contains a full-stack app with:

- `backend` — Express API (listings, auth, reviews, comments, favorites, ads)
- `frontend-vite` — React + Vite SPA

### Quick start

1) Backend env (uses in-memory MongoDB by default)

```bash
cd backend
cp .env.example .env || true
npm i
npm run dev
```

2) Frontend

```bash
cd frontend-vite
npm i
npm run dev
```

Default URLs:
- API: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

Seed demo data:

```bash
cd backend && npm run seed:listings
```

Demo admin: `admin@example.com` / `Admin@123456`
