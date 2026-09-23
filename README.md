# KAIZEN

AI-powered resume and job application optimizer with a **React + Vite frontend** and **Node.js + Express backend**. It helps users upload resumes, analyze job descriptions, optimize ATS alignment, generate cover letters/outreach messages, and export tailored resume PDFs.

## Project Overview

KAIZEN is split into two apps:

- **`/Frontend`**: React client for authentication, resume management, AI workflows, and admin views.
- **`/Backend`**: Express API with MongoDB models, JWT auth, OTP email verification, resume parsing, AI generation, and admin endpoints.

## Key Features

- Email + OTP based user verification and JWT auth (access + refresh token flow)
- Resume upload (`.pdf`, `.doc`, `.docx`, max 5MB) with parsing and structured storage
- Optional Cloudinary upload for original file persistence
- Job description analysis (manual paste or URL scraping)
- AI resume optimization and ATS scoring
- Cover letter + cold outreach generation
- GitHub profile/repo import and AI-generated project bullets
- Resume PDF download (supports optimized output payload)
- Admin dashboard/user/resume/log management with role checks

## Technology Stack

### Frontend

- React 18
- Vite 5
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- React Hot Toast

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Redis client (optional at runtime)
- JWT + bcrypt
- Nodemailer (SMTP)
- Multer (memory uploads)
- Cloudinary
- Google Gemini (`@google/generative-ai`)

## Prerequisites

- Node.js **18+**
- npm
- MongoDB instance
- Redis instance (optional; server can run without it)
- SMTP credentials for email flows
- Google Gemini API key for AI features
- Cloudinary credentials if you want to store original uploaded files

## Installation

Clone the repo, then install dependencies in both projects:

```bash
cd /home/runner/work/KAIZEN/KAIZEN/Backend
npm install

cd /home/runner/work/KAIZEN/KAIZEN/Frontend
npm install
```

## Environment Configuration

### Backend (`/home/runner/work/KAIZEN/KAIZEN/Backend/.env`)

Start from `/home/runner/work/KAIZEN/KAIZEN/Backend/.env.example` and fill real values:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
REDIS_URL=redis://localhost:6379

JWT_SECRET=replace_with_strong_secret
JWT_REFRESH_SECRET=replace_with_strong_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
EMAIL_FROM="Kaizen <no-reply@example.com>"
FRONTEND_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
OTP_EXPIRY=300

# Optional for higher GitHub API limits in /api/ai/github-repos
GITHUB_TOKEN=your_github_token
```

> Do not commit real secrets. Keep `.env` local only.

### Frontend (`/home/runner/work/KAIZEN/KAIZEN/Frontend/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Local Development

Run backend and frontend in separate terminals.

### 1) Start API server

```bash
cd /home/runner/work/KAIZEN/KAIZEN/Backend
npm run dev
```

### 2) Start frontend

```bash
cd /home/runner/work/KAIZEN/KAIZEN/Frontend
npm run dev
```

- Frontend defaults to Vite dev server (usually `http://localhost:5173`)
- Backend health check: `GET /health`

## Usage Workflow

1. Register account, verify OTP, log in.
2. Upload resume (`Resumes` page) as PDF or Word.
3. Analyze a job description (paste text or scrape URL).
4. Optimize a selected resume for a target role.
5. Review ATS score, rewritten bullets, and summary suggestions.
6. Optionally generate:
   - cover letters
   - cold outreach messages
   - GitHub-based project bullets
7. Download optimized resume PDF.

## Available Scripts

### Backend (`/Backend/package.json`)

- `npm start` – start server with Node
- `npm run dev` – start with nodemon
- `npm run seed` – run admin seeder
- `npm test` – run Jest in-band

### Frontend (`/Frontend/package.json`)

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build

## API / Backend Notes

Base API path: `/api`

- Auth: `/api/auth/*`
- Resumes: `/api/resumes/*`
- Jobs: `/api/jobs/*`
- AI: `/api/ai/*`
- Admin: `/api/admin/*`

Important behavior:

- Most API routes are protected with authentication middleware.
- AI routes require `GEMINI_API_KEY`; otherwise AI calls fail with explicit errors.
- Redis connection failure logs a warning and does **not** stop server startup.
- Cloudinary upload failure during resume upload is tolerated; resume parsing/storage still proceeds.

## Project Structure

```text
KAIZEN/
├── Backend/
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   └── constants/
    └── package.json
```

## Troubleshooting

- **401/Unauthorized in frontend**: verify `VITE_API_BASE_URL`, login state, and JWT env secrets.
- **AI endpoints failing**: set valid `GEMINI_API_KEY` (and optional `GEMINI_MODEL`).
- **Email/OTP not sending**: verify SMTP host/port/user/pass and sender config.
- **Resume upload rejected**: use only PDF/DOC/DOCX up to 5MB.
- **Frontend cannot reach backend**: confirm backend port and CORS/network configuration.

## Contributing

1. Fork and create a feature branch.
2. Keep changes focused and minimal.
3. Verify frontend build and backend startup before opening a PR.
4. Include clear reproduction/validation notes in PR description.

## License / Status

- No license file is currently present in this repository.
- Project appears to be under active development.
