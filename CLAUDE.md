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

## Architecture

**ResumeJet** is a Next.js 14 (Pages Router) AI resume builder sold for the Indian market (INR pricing via Razorpay).

### User Flow
1. `pages/select-type.js` → user picks resume type (fresher / experienced)
2. `pages/select-design.js` → user picks one of 4 design templates × 4 color variants
3. `pages/builder.js` → form input OR file upload → calls `/api/generate-resume` or `/api/upload-resume` → stores result in `sessionStorage`
4. `pages/preview.js` → displays rendered resume → triggers Razorpay payment → calls `/api/verify-payment` → gets `downloadToken` → calls `/api/download-pdf`

### Payment & Download Authorization
Payment creates a **HMAC-signed download token** (`lib/razorpay.js` + `verify-payment.js`) encoding `{ paymentId, plan, downloadsAllowed }`. The token is stored in `localStorage` via `lib/credits.js`. On each download, `download-pdf.js` verifies the HMAC with `RAZORPAY_KEY_SECRET` and checks the server-side download counter in the file store. **The real download gate is server-side** — `localStorage` only drives the UI counter.

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
Uses Puppeteer to render HTML templates to PDF. Four layout styles (`classic-pro`, `modern-split`, `creative-edge`, `minimal-clean`), each with 4 color variants (16 total). Design IDs are allowlisted in `download-pdf.js`. Profile photo is validated as a base64 data URI before being embedded.

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

### Components
- `components/Navbar.js` — site navigation
- `components/Toast.js` — toast notification system used via `useToast()` hook

### Adding a New Resume Type
1. Add entry to `config/resumeTypes.js` (slug + fields)
2. Add system prompt to `TYPE_PROMPTS` in `lib/claude.js`
3. Add slug to `VALID_RESUME_TYPES` in both `api/generate-resume.js` and `api/upload-resume.js`
