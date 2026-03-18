# user-form — Project Context

## Overview
A full-stack web app for adding and viewing users. Built with React (Vite) on the frontend and Express on the backend, using Supabase (PostgreSQL) as the database.

## Stack
- **Client**: React + Vite, served via nginx in Docker (port 80)
- **Server**: Node.js + Express (port 3001)
- **Database**: Supabase hosted cloud — `https://ctcexwzcizbhqgklkdgo.supabase.co`

## Running locally (without Docker)
```bash
# Install all dependencies
npm run install:all

# Start server (port 3001, auto-restarts on file changes)
npm run dev:server

# Start client (port 5173)
npm run dev:client
```

## Running with Docker
```bash
docker compose up --build
```
- Client → http://localhost (port 80)
- Server → http://localhost:3001

## Environment variables
Create `server/.env` based on `server/.env.example`:
```
SUPABASE_URL=https://ctcexwzcizbhqgklkdgo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
PORT=3001
CORS_ORIGIN=http://localhost   # set to http://localhost:5173 for non-Docker dev
```

`VITE_API_URL` is a build-time arg for the client (defaults to `http://localhost:3001`).

## Database
Supabase hosted (cloud). Table: `public.users`

| Column | Type |
|---|---|
| id | uuid (PK) |
| first_name | text |
| last_name | text |
| email | text |
| created_at | timestamptz |

Create the table in the Supabase SQL editor:
```sql
create table public.users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  created_at timestamptz default now()
);
```

## Key implementation details
- CORS origin is configurable via `CORS_ORIGIN` env var (needed for Docker where client is on port 80 vs 5173)
- API URL is configurable via `VITE_API_URL` build arg (baked into the client bundle at build time)
- Users are fetched on app mount via `useEffect` in `App.jsx`
- Table columns are all sortable (client-side) in `UsersTable.jsx`
- Validation runs both client-side (UserForm) and server-side (routes/users.js)

## GitHub
https://github.com/sohail-hines-1/user-form

## npm cache issue
If `npm install` fails with permission errors on the npm cache, use:
```bash
npm install --cache /tmp/npm-cache
```
