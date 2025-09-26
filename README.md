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
