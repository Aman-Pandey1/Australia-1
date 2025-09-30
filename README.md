## Directory Listing Platform

- Frontend: Next.js (App Router) + Tailwind CSS + TypeScript
- Backend: Express.js + MongoDB (Mongoose)
- Auth: JWT (Bearer)

### Local Development
- Backend
  - Copy `/workspace/backend/.env` and fill `MONGODB_URI`
  - Start:
    - `cd /workspace/backend && npm install && npm run dev`
  - Health: `GET http://localhost:4000/api/health`
- Frontend
  - `cd /workspace/frontend && npm install && npm run dev`
  - Visit `http://localhost:3000`

### Selected API
- POST `/api/auth/register` { email, password, name }
- POST `/api/auth/login` { email, password }
- GET `/api/home`
- CRUD `/api/listings`
- POST `/api/favorites/:listingId`
- POST `/api/reviews`
- POST `/api/comments`
- POST `/api/subscriptions` { plan } (1m|3m|6m|12m)

### Seed
- `cd /workspace/backend && MONGODB_URI="your-uri" node src/utils/seed.js`

### Notes
- Configure `CORS_ORIGIN` in backend `.env`
- Use MailHog for SMTP in dev
## Escortify-like Directory (Full‑stack)

This workspace contains a full-stack app with:

- `backend` — Express API (listings, auth, reviews, comments, favorites, ads)
- `frontend-vite` — React + Vite SPA

### Quick start

1) Backend env (uses in-memory MongoDB by default)

```bash
cd backend
npm i
echo "PORT=4000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/escortify
JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123456" > .env
npm run seed:admin
npm start
```

2) Frontend

```bash
cd frontend-vite
npm i
npm run dev
```

Default URLs:
- API: `http://localhost:4000/api`
- Frontend: `http://localhost:5173`

Registration now supports selecting "User" or "Agent". Admin role is automatically assigned if the registering email matches `ADMIN_EMAIL`.
