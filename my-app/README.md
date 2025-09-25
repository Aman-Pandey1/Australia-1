ProfileHub – subscriptions and profile showcase (Diamond / Premium / Free)

Setup
1. Install deps: `npm i`
2. Configure env in `.env` (already filled for local)
3. Migrate DB: `npx prisma migrate dev`
4. Seed admin: `npm run seed`
5. Run dev: `npm run dev` then open `http://localhost:3000`

Admin login
- Email: `admin@example.com`
- Password: `admin123`

Features
- Credentials auth (NextAuth)
- Admin dashboard: manage user roles, profile tiers, advertise flag
- User signup/login and Profile CRUD
- Home sections: Diamond, Premium, Free (advertised)
- Mock subscription purchase (30 days) with expiry display
- Responsive UI via Tailwind CSS

Scripts
- `npm run dev` – dev server
- `npm run build` – build
- `npm run start` – start
- `npm run seed` – seed admin
