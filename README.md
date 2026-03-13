# Frontend (Next.js PWA)

## Prerequisites
- Node.js 20+
- npm

## Config
Copy env file and edit:
- `cp .env.example .env.local`

Environment variables:
- `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`)

## Run Local
From `frontend/`:
- Install deps: `npm install`
- Dev server: `npm run dev`

App URL:
- http://localhost:3000

## Test Local
No automated tests yet.

## Build
From `frontend/`:
- `npm run build`
- `npm start`

## Deploy (Docker)
From repo root:
- `docker compose up -d --build frontend`

## Reader Notes
The reader expects chapter content as one of:
- `content_url` points to a JSON file: `{ "pages": ["..."] }`
- `content_url` template with `{page}` and a `page_count`
