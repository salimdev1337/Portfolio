# Claude Development Guidelines - Pixel Portfolio Project

---

## 🎯 PROJECT CONTEXT

**Project:** Retro pixel art themed portfolio website
**Theme:** 8-bit/16-bit RPG aesthetic
**Tech Stack:** React + Tailwind + Shadcn/ui (Frontend) | FastAPI (Backend) | GitHub Pages + Render (Hosting)

**Key Personality Traits to Reflect:**
- Gaming since Windows XP, coding since Pascal
- Bug hunter addict (obsessed with clean code)
- Tests on potato laptops for maximum compatibility
- Peak productivity at 2am with espresso
- Commits more often than blinking

---

## 🗂️ REPOSITORY HYGIENE

### Never Commit
- `coverage/`, `node_modules/`, `dist/`, `build/`, `.cache/`
- `.claude/`, `.env`, `.env.local`, `.DS_Store`, `Thumbs.db`
- `portfolio.md`, `task.md`, `TODO.md`, `*.draft.md`, `*.log`, `*.tmp`

### Always Commit
- `vite.config.js`, `eslint.config.js`, `tailwind.config.js`, `postcss.config.js`
- `.prettierrc`, `package.json`, `package-lock.json`
- `README.md`, `CLAUDE.md`, `LICENSE`
- All files in `src/`, `public/`, `.github/workflows/`

### .gitignore Rules
- ✅ Use specific paths, not broad wildcards (`vite.*` would ignore `vite.config.js`!)
- ✅ Organize by category with comments
- ❌ Never commit `.env` files or API keys

### Removing Already-Tracked Files
```bash
git rm --cached coverage/ -r
git rm --cached portfolio.md
git commit -m "chore: remove generated and local files from repo"
```
**CRITICAL:** Always use `--cached` to keep files locally.

---

## 💻 DEVELOPMENT PRINCIPLES

### Code Quality
- Write clean, readable code — others should understand it at a glance
- Comment complex logic: explain the "why", not the "what"
- Use meaningful variable names (`userSubmittedEmail` not `temp1`)
- Follow React best practices: hooks, functional components, proper state management
- DRY components with single responsibility
- Avoid over-engineering — build what's needed now

### Security
- API keys and secrets in environment variables only — never hardcoded
- Validate all inputs on both frontend and backend
- Rate limit contact form (5 submissions/hour per IP)
- Implement CORS properly — only allow trusted origins
- HTTPS only

### Performance Targets (Lighthouse)
- Performance, Accessibility, Best Practices, SEO: all **>90**
- LCP <2.5s | FCP <1.8s | CLS <0.1 | TTI <3.8s
- JS bundle <250kb gzipped | CSS <50kb gzipped

---

## 📁 PROJECT STRUCTURE

### Frontend
```
src/
├── components/
│   ├── common/       # Reusable (Button, Card, Input)
│   ├── sections/     # Page sections (Hero, About, Projects, etc.)
│   └── layout/       # Navbar, Footer
├── assets/
│   ├── images/       # Optimized images
│   ├── icons/        # Pixel art icons
│   └── fonts/        # Press Start 2P, Roboto Mono
├── styles/           # Global styles, CSS variables
├── utils/            # Helper functions
├── contexts/         # React contexts (Theme, etc.)
└── App.jsx
```

### Backend
```
backend/
├── main.py               # Main FastAPI application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (gitignored)
├── routers/
│   └── contact.py        # Contact form endpoints
├── utils/
│   ├── validation.py     # Input validation
│   ├── rate_limiter.py   # Rate limiting logic
│   └── n8n_webhook.py    # n8n integration
└── tests/
    └── test_contact.py   # API endpoint tests
```

---

## 🎨 DESIGN SYSTEM

### Color Variables (always use CSS vars, never hardcode)
```css
/* Light Mode */
--bg-primary: #F0F0F0;   --bg-secondary: #E0E0E0;
--text-primary: #1A1A1A; --text-secondary: #4A4A4A;
--accent: #4A9EFF;       --accent-hover: #2E7FDD;
--success: #4CAF50;      --border: #2C2C2C;

/* Dark Mode */
--bg-primary: #1A1A1A;   --bg-secondary: #2C2C2C;
--text-primary: #E0E0E0; --text-secondary: #A0A0A0;
--accent: #00D9FF;       --accent-hover: #00B8D4;
--success: #00FF88;      --border: #4A4A4A;
```

### Typography
- **Headers/Pixel Elements:** `'Press Start 2P', cursive` — use sparingly
- **Body Text:** `'Roboto Mono', monospace`
- **Code:** `'Fira Code', monospace`

### Spacing
```css
--space-xs: 4px;  --space-sm: 8px;   --space-md: 16px;
--space-lg: 24px; --space-xl: 32px;  --space-2xl: 48px; --space-3xl: 64px;
```

### Responsive Breakpoints
- **Mobile:** `< 768px` — single column, hamburger menu
- **Tablet:** `768px–1023px` — 2-column cards
- **Desktop:** `≥ 1024px` — full layouts, hover effects
- All touch targets minimum **44x44px**

---

## 🔧 GIT WORKFLOW

### Commit Convention
```
feat: add skill tree visualization component
fix: resolve mobile navbar overflow issue
update: improve project card descriptions
style: refine button hover animations
docs: add setup instructions to README
test: add unit tests for contact form
refactor: extract validation logic to utils
chore: remove generated files from repo
```

### 🚨 CRITICAL: Before Every Push (Claude Must Follow)

**Run the full CI pipeline locally before pushing. This prevents CI failures.**

#### Backend CI (run from `backend/` directory)
```bash
python -m flake8 app/ --max-line-length=100 --exclude=__pycache__
python -m mypy app/ --ignore-missing-imports
python -m bandit -r app/ -ll
python -m pytest tests/ -v
```

#### Frontend CI (run from repo root)
```bash
npm run lint
npm run build
npx vitest run
```

All commands must exit 0 with no errors before pushing.

#### Known dependency constraints (do not break these)
- `google-genai` requires `httpx>=0.28.1` — keep `httpx>=0.28.0` in requirements.txt
- `fastapi>=0.115` required for `httpx>=0.28` compat (starlette 0.36 breaks with httpx 0.28+)
- Rate-limited endpoints **must** include `response: Response` parameter so slowapi 0.1.9 can inject headers (incompatible with fastapi 0.115+ otherwise)
- `slowapi` decorators require `@limiter.limit(...)` placed directly above the `async def` (not post-definition)

1. **ASK USER FOR PERMISSION** — NEVER push without explicit confirmation
2. **REBASE ALL COMMITS INTO ONE:**
   ```bash
   git reset --soft main
   git commit -m "feat: descriptive message of all changes"
   ```
3. **VERIFY:** `git log origin/main..HEAD` and `git status`
4. **PUSH** only after user says yes

### Pull Request Checklist
- [ ] Feature branch from `main`
- [ ] All commits squashed into one
- [ ] User approved push
- [ ] PR description: what changed, why, screenshots, testing

---

## 🔐 ENVIRONMENT VARIABLES

### Frontend (`.env`)
```bash
VITE_API_URL=https://portfolio-backend.onrender.com
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Backend (`.env`)
```bash
SECRET_KEY=your-secret-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contact
ALLOWED_ORIGINS=https://[your-username].github.io,http://localhost:5173
APP_ENV=production
GEMINI_API_KEY=your-gemini-api-key-here
```

> ⚠️ **`GEMINI_API_KEY` must be set on Render.** Without it the RAG service skips
> initialization (server still boots — chatbot runs in no-context mode).

- Generate secret: `python -c "import secrets; print(secrets.token_hex(32))"`
- Never commit `.env` — always provide `.env.example`

---

## ✅ CODE QUALITY CHECKLIST

### Before Every Commit
- [ ] No `console.log()` in production code
- [ ] No commented-out code blocks
- [ ] All imports used
- [ ] No hardcoded colors or values
- [ ] Mobile responsive (375px, 768px, 1024px)
- [ ] No console errors or warnings
- [ ] Keyboard navigation works

### React Specifics
- [ ] Hooks follow rules (no conditional hooks)
- [ ] `useEffect` has correct dependency array
- [ ] Event handlers named `handleX` / `onX`
- [ ] Components are PascalCase, files match

### Accessibility
- [ ] Alt text on all images
- [ ] Semantic HTML (`header`, `nav`, `main`, `footer`)
- [ ] ARIA labels where needed
- [ ] Color contrast WCAG AA (4.5:1 minimum)
- [ ] Focus indicators visible

---

## 🧪 TESTING

### Pre-Commit
- [ ] No console errors
- [ ] Feature works as expected
- [ ] Works on Chrome + mobile viewport (375px)

### Pre-Merge to Main
- [ ] Tested on Chrome, Firefox, Safari
- [ ] All breakpoints verified
- [ ] Dark mode toggle works
- [ ] Forms validate correctly

---

## 🚀 DEPLOYMENT

### GitHub Actions — `.github/workflows/deploy.yml`
- Triggers on push to `main`
- Steps: checkout → setup Node 18 → `npm ci` → lint → build → deploy to Pages
- Required secrets: `BACKEND_API_URL`

### Deployment Checklist
- [ ] No console errors/warnings
- [ ] Images optimized (<200kb each)
- [ ] Favicon + Open Graph meta tags added
- [ ] Environment variables configured on Render
- [ ] Contact form → n8n webhook verified
- [ ] Lighthouse audit >90 on all metrics
- [ ] Tested on real mobile device

---

## 🎮 EASTER EGGS

- **Konami Code** (↑↑↓↓←→←→BA): triggers developer mode modal
- **Loading tips** rotate on first visit (potato laptop, 2am espresso, etc.)
- **View source comment** with friendly message + contact email

---

## 🤖 CLAUDE SELF-MANAGEMENT RULES

### Before Every Commit — Analyze & Test
1. **Understand the task fully** before writing any code — read relevant files, trace the logic
2. **Test locally** — verify the feature/fix works as expected, no console errors
3. **Run linter** — `npm run lint` must pass with 0 errors before committing
4. **Check for regressions** — confirm existing features still work after changes
5. **Review the diff** — `git diff` before staging; no debug logs, no commented-out code, no unintended changes

### After Every Commit — Update CLAUDE.md
After each meaningful commit, Claude **must** update this file to reflect the current state:

- **Completed features** — mark newly finished work
- **Known issues** — add any discovered bugs or limitations
- **Stack/structure changes** — update project structure if files/dirs were added or renamed
- **Environment variable changes** — keep the `.env` section accurate
- **Last Updated date** — always bump to today's date

> This keeps CLAUDE.md as a live source of truth, not a stale document.

---

**Last Updated:** 2026-02-12
**Stack:** React + Tailwind + FastAPI + GitHub Pages + Render

## Recent Changes (2026-02-11) — CI/CD Fix Pass

### Backend (mypy + test fixes)
- `requirements.txt`: Upgraded `fastapi` → `>=0.115.0,<0.116.0`, `uvicorn` → `>=0.30.0`, `gunicorn` → `>=22.0.0`, `httpx` → `>=0.28.0` (required by `google-genai 1.62+`; starlette 0.36 broke with httpx 0.28+, starlette 0.46 via fastapi 0.115 fixes this)
- `requirements-dev.txt`: Added `types-bleach>=6.1.0` for mypy stubs
- `services/validation.py`: Added explicit `List[str]` / `Dict[str, Any]` types; cast bleach return with `str()`; added `# type: ignore[import-untyped]` on bleach import
- `services/rag.py`: Annotated `chunks/chunk_ids/sources` as `List[str]`; wrapped ChromaDB return with `list()`
- `routes/chat.py`: Added `from typing import cast`; cast `request.app.state.chatbot_service`; added `response: Response` param (required by slowapi 0.1.9 with fastapi 0.115+)
- `routes/contact.py`: Added `response: Response` param (same slowapi fix)
- `main.py`: Imported `RequestResponseEndpoint` from starlette; typed `call_next` parameter
- `tests/test_n8n_integration.py`: Updated 3 tests to use flat webhook payload structure (tests were written expecting nested `form_data`/`metadata` keys but `webhook.py` was previously flattened — tests were never updated)

## Recent Changes (2026-02-11) — Production Readiness Pass

### Backend
- `render.yaml`: Removed erroneous `pip install torch` (~1.5GB build bloat)
- `config.py`: Fixed CORS default (removed `*.github.io` wildcard — not supported by FastAPI). Set `ALLOWED_ORIGINS` env var on Render. Added `REDIS_URL` env var support for persistent rate limiting
- `middleware/rate_limit.py`: Fixed IP spoofing (uses `request.client.host` not forged `X-Forwarded-For`). Exported a shared `limiter` singleton
- `routes/contact.py`: Unified rate limiter (shared singleton). Fixed webhook client leak (now uses `get_webhook_client()` singleton). Removed broken post-definition decoration pattern
- `routes/chat.py`: Same rate limiter fixes as contact.py
- `services/chatbot.py`: Switched `gemini-2.5-flash` (preview) → `gemini-2.0-flash` (stable)
- `main.py`: Now imports shared limiter. Added security headers middleware (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS in production)

### Frontend
- `index.html`: Added meta description, Open Graph tags, Twitter Card, apple-touch-icon, preconnect + `<link>` font loading (replaces render-blocking CSS `@import`)
- `src/index.css`: Removed render-blocking `@import url('https://fonts.googleapis.com/...')`
- `App.jsx`: Added `ErrorBoundary` wrapper. Lazy-loaded all sections + Chatbot with `React.lazy` + `Suspense`
- `contexts/ThemeContext.jsx`: Now respects `prefers-color-scheme` on first visit. Refactored to use lazy `useState` initializer (fixes eslint `set-state-in-effect` rule)
- `sections/Contact.jsx`: Removed `console.error`. Fixed `setTimeout` cleanup on unmount via `useRef`
- `sections/Projects.jsx`: Added `aria-pressed` to filter buttons. Wrapped emoji in `aria-hidden="true"`
- `sections/Skills.jsx`: Added `aria-expanded` + `aria-controls` to accordion buttons
- `sections/Hero.jsx`: Added `aria-hidden="true"` to decorative SVG
- `sections/LoadingScreen.jsx`: Wired up `keydown` listener so "press any key" actually works
- `components/chatbot/Chatbot.jsx`: Added `aria-expanded` to toggle button
- `src/components/common/ErrorBoundary.jsx`: New component

### CI/CD
- `.github/workflows/frontend-deploy.yml`: Upgraded Node 18 → 22 LTS. Removed `CI: false`
- `.github/workflows/backend-deploy.yml`: Added `GEMINI_API_KEY` to test env (add secret in repo settings)

### Environment Variables Added
- Backend: `REDIS_URL` — set to Redis connection string for persistent rate limiting (optional, defaults to memory)
- Frontend: No new vars

## Recent Changes (2026-02-12) — Render deploy fix + mobile navbar

### Backend
- `main.py`: Wrapped `await rag_service.initialize()` in `try/except` — a Gemini API
  failure (missing key, 404, network error) no longer crashes the server at startup.
  Chatbot degrades gracefully to no-context mode; `RAGService.query()` already returns
  `[]` when `not self._initialized`.
- `services/rag.py`: Cast `response.json()["embedding"]["values"]` to `list()` to fix
  mypy `no-any-return` error.

### Frontend
- `components/layout/Navbar.jsx`: Fixed transparent background when mobile menu opens at
  page top (nav now applies solid bg when `isMenuOpen || isScrolled`). Added
  close-on-outside-click (`mousedown` + `touchstart`), Escape key dismiss, and
  `aria-expanded` on hamburger button. Removed unused `Button` import.

### Known issue — GEMINI_API_KEY on Render
`GEMINI_API_KEY` **must** be set as an environment variable in the Render dashboard.
Without it the RAG/chatbot initialization is skipped (server boots fine, chatbot has no
knowledge-base context). See Environment Variables section above.
