# Frontend Developer Intern — Assignment

## Overview
This project demonstrates a scalable web app with authentication (JWT), a dashboard with CRUD for Notes, and a lightweight Express backend connected to MongoDB.

## Tech
- Frontend: React + TailwindCSS + react-hook-form + axios
- Backend: Node.js + Express + MongoDB (mongoose)
- Auth: JWT + bcrypt

## Quickstart (local)
### Backend
1. `cd backend`
2. `cp .env.example .env` and set `MONGO_URI` and `JWT_SECRET`
3. `npm install`
4. `npm run dev` (uses nodemon) — server runs at `http://localhost:4000`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start` — app runs at `http://localhost:3000`

## API docs
See `postman_collection.json` (import into Postman).

## Notes on production & scaling
- Use HttpOnly secure cookies for refresh tokens and short-lived access tokens.
- Run backend behind a load balancer; stateless JWTs make horizontal scaling easy.
- Use connection pooling, cluster mode (PM2), centralized logging, and rate limiting.
- For the frontend, split into smaller components, lazy-load routes, and use CDN for static assets.

## Contact
Submit your solution (GitHub link + logs) to the emails provided in the assignment.
