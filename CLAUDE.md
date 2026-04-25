# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js on default port 3000)
npm run build    # Production build
npm start        # Start production server on port 3000
```

No test suite or linter is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in:
- `ANTHROPIC_API_KEY` — Claude API key
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — payment gateway
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — same as KEY_ID (used client-side)
- `EMAIL_USER` / `EMAIL_PASS` — Gmail SMTP with App Password for receipts
- `NEXT_PUBLIC_PRICE` / `PRICE_AMOUNT` — price in paise (₹49 = 4900)
- `NEXT_PUBLIC_SITE_URL` — public URL (e.g. `https://resumejet.in`), used for canonical links

## Deployment

Two deployment paths are available:

**PM2 on bare VPS** (`scripts/deploy.sh`): installs Node 20, Nginx, Certbot, system Chromium, then starts the app with PM2. Set `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` and `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` in the environment (Puppeteer must not download its own Chromium on the VPS).

**Docker** (`docker-compose.yml` + `Dockerfile`): two-stage build (builder → runner on `node:20-alpine`). Chromium is installed via `apk` in the runner stage with the same env vars. An `nginx` service and a `certbot` service for SSL auto-renewal are included.

## Architecture

**ResumeJet** is a Next.js 14 (Pages Router) AI resume builder sold for the Indian market (INR pricing via Razorpay).

### User Flow
1. `pages/select-type.js` → user picks resume type (fresher / experienced)
2. `pages/select-design.js` → user picks one of 4 design templates × 4 color variants
3. `pages/builder.js` → form input OR file upload → calls `/api/generate-resume` or `/api/upload-resume` → stores result in `sessionStorage`
4. `pages/preview.js` → displays rendered resume → triggers Razorpay payment → calls `/api/verify-payment` → gets `downloadToken` → calls `/api/download-pdf`

### Payment & Download Authorization
Payment flow: `preview.js` calls `/api/create-order` → Razorpay checkout → `/api/verify-payment` which fetches the real payment from Razorpay to guard against tampered amounts → returns a **HMAC-signed download token** (`lib/razorpay.js`) encoding `{ paymentId, plan, downloadsAllowed }`. The token is stored in `localStorage` via `lib/credits.js`. On each download, `download-pdf.js` verifies the HMAC with `RAZORPAY_KEY_SECRET` and checks the server-side download counter in the file store. **The real download gate is server-side** — `localStorage` only drives the UI counter. `lib/email.js` (nodemailer/Gmail) sends a payment receipt after successful verification; it silently skips if `EMAIL_USER`/`EMAIL_PASS` are unset.

### Plans (`config/pricing.js`)
- **Basic** ₹49 → 2 downloads (`razorpayAmount: 4900` paise)
- **Pro** ₹79 → 4 downloads (`razorpayAmount: 7900` paise)

`verify-payment.js` fetches the actual payment from Razorpay API to guard against tampered amounts.

### AI Layer (`lib/claude.js`)
Uses `claude-sonnet-4-6`. Five resume types each have a dedicated system prompt: `fresher`, `experienced`, `it-developer`, `mba`, `ats-optimized`. All return a fixed JSON schema (name, contact, summary, experience, education, skills, projects, etc.). Two generation paths:
- `generateResume(data)` — from structured form data or extracted text
- `generateResumeFromImage(buffer, mimeType)` — vision input for image uploads

`analyzeResume` / `analyzeResumeFromImage` provide ATS scoring (0–100) without generation.

### Upload Pipeline (`api/upload-resume.js`)
Accepts PDF (text-extracted via `pdf-parse`), DOCX (text via `mammoth`), or image (JPG/PNG sent as base64 to Claude vision). Uses a hand-rolled multipart parser because Next.js `bodyParser: false` is set.

### PDF Generation (`lib/pdf-generator.js`)
Uses Puppeteer to render HTML templates to PDF. Five layout styles (`classic-pro`, `modern-split`, `creative-edge`, `minimal-clean`, `executive-pro`), each with 4 color variants (20 total). Design IDs are allowlisted in `download-pdf.js` by mapping `RESUME_DESIGNS` from config. Profile photo is validated as a base64 data URI before being embedded.

Templates live in `templates/` as JS modules exporting `generateHTML(resume, profilePhoto, theme)`. Shared HTML-generation helpers (section renderers, `escHtml`, etc.) live in `lib/resume-helpers.js` and are imported by each template.

`/api/template-preview` renders any template with sample data for the design-picker UI (`components/DesignMiniPreview.js`).

### Persistence (`lib/store.js`)
File-backed JSON store (`.resumejet-store.json` in project root) — no database. Tracks:
- `payments[paymentId]` — idempotency cache for verified payments
- `downloads[paymentId]` — server-side download counter

### Rate Limiting (`lib/rate-limit.js`)
In-memory per-IP rate limiter. `/api/generate-resume`: 10 req/min. `/api/upload-resume`: 5 req/min.

### Config Files
- `config/resumeTypes.js` — defines slugs and which form fields are shown per type
- `config/resumeDesigns.js` — all 16 design variants grouped by layout style
- `config/pricing.js` — single source of truth for plan IDs, prices, and download counts

### API Routes
| Route | Purpose |
|---|---|
| `/api/generate-resume` | AI resume generation from form data |
| `/api/upload-resume` | Parse uploaded file → AI generation |
| `/api/analyze-resume` | ATS score without generation |
| `/api/create-order` | Create Razorpay order |
| `/api/verify-payment` | Verify payment + issue download token |
| `/api/download-pdf` | Render PDF (requires valid token) |
| `/api/template-preview` | Render template HTML for design picker |
| `/api/health` | Liveness check (`{ status: 'ok' }`) |

### Components
- `components/Navbar.js` — site navigation
- `components/Toast.js` — toast notification system used via `useToast()` hook
- `components/ErrorBoundary.js` — React error boundary wrapping the app in `pages/_app.js`
- `components/DesignMiniPreview.js` — thumbnail rendered via `/api/template-preview`, used in `select-design.js`

### Marketing Pages
`pages/ai-demo.js`, `pages/what-ai-writes.js`, `pages/why-resumejet.js` — content/landing pages. No backend logic.

### Static / Legal Pages
`pages/cancellation.js`, `pages/privacy.js`, `pages/terms.js`, `pages/shipping.js`, `pages/contact.js` — static informational pages required by Razorpay for Indian merchants. No logic; edit HTML content only.

### Adding a New Resume Type
1. Add entry to `config/resumeTypes.js` (slug + fields)
2. Add system prompt to `TYPE_PROMPTS` in `lib/claude.js`
3. Add slug to `VALID_RESUME_TYPES` in both `api/generate-resume.js` and `api/upload-resume.js`

### Adding a New Template
1. Create `templates/<name>.js` exporting `generateHTML(resume, profilePhoto, theme)` and a `THEMES` map — import helpers from `lib/resume-helpers.js`
2. Add the template and its 4 color-variant IDs to `config/resumeDesigns.js`
3. Add `'<name>': require('../../templates/<name>')` to `TEMPLATE_MAP` in `api/template-preview.js`
4. `download-pdf.js` derives its allowlist from `RESUME_DESIGNS` automatically — no change needed there
