# Claude Development Guidelines - Pixel Portfolio Project

This file contains development best practices, guidelines, and instructions for building the Pixel-Perfect Portfolio project.

---

## 🎯 PROJECT CONTEXT

**Project:** Retro pixel art themed portfolio website
**Theme:** 8-bit/16-bit RPG aesthetic
**Deadline:** Sunday, February 9, 2026
**Tech Stack:** React + Tailwind + Shadcn/ui (Frontend) | Flask (Backend) | GitHub Pages + Render (Hosting)

**Key Personality Traits to Reflect:**
- Gaming since Windows XP, coding since Pascal
- Bug hunter addict (obsessed with clean code)
- Tests on potato laptops for maximum compatibility
- Peak productivity at 2am with espresso
- Commits more often than blinking

---

## 🗂️ REPOSITORY HYGIENE & FILE MANAGEMENT

### 🚫 Files That Should NEVER Be Committed

**Generated Files:**
- `coverage/` - Test coverage reports (regenerated on every test run)
- `node_modules/` - Dependencies (installed via package.json)
- `dist/`, `build/` - Production builds
- `.cache/`, `.parcel-cache/` - Build caches

**Local Configuration:**
- `.claude/` - Claude AI local session data
- `.env`, `.env.local` - Environment variables with secrets
- `.vscode/settings.json` (unless team-shared)
- `.DS_Store`, `Thumbs.db` - OS-specific files

**Planning/Development Notes:**
- `portfolio.md` - Detailed project planning (53KB - keep local)
- `task.md` - Task tracking (keep local)
- `TODO.md`, `NOTES.md` - Personal notes
- `*.draft.md` - Work-in-progress documents

**Temporary Files:**
- `*.log` - Log files
- `*.tmp`, `*.temp` - Temporary files
- `*.swp`, `*~` - Editor swap files

### ✅ Files That MUST Be Committed

**Configuration Files:**
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - Linting rules
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.prettierrc`, `.prettierignore` - Code formatting
- `package.json`, `package-lock.json` - Dependency management

**Documentation:**
- `README.md` - Project documentation
- `CLAUDE.md` - Development guidelines (this file)
- `LICENSE` - Project license

**Source Code:**
- All files in `src/` directory
- All files in `public/` directory
- Test files (`*.test.js`, `*.test.jsx`)

**CI/CD:**
- `.github/workflows/` - GitHub Actions workflows

### 🔍 .gitignore Best Practices

**DO:**
- ✅ Use specific paths instead of wildcards when possible
- ✅ Comment sections for clarity
- ✅ Organize by category (Dependencies, Build, Testing, etc.)
- ✅ Include both frontend and backend ignores

**DON'T:**
- ❌ Use broad wildcards like `vite.*` (ignores vite.config.js!)
- ❌ Use broad wildcards like `eslint.*` (ignores eslint.config.js!)
- ❌ Forget to ignore OS-specific files (.DS_Store, Thumbs.db)
- ❌ Commit sensitive data (.env files, API keys)

### 🧹 Cleaning Up Already-Tracked Files

If files are already tracked by Git but should be ignored:

```bash
# Remove from Git but keep locally
git rm --cached coverage/ -r
git rm --cached portfolio.md
git rm --cached task.md

# Commit the removal
git commit -m "chore: remove generated and local files from repo"

# Now .gitignore will work for these files
```

**CRITICAL:** Never run `git rm` without `--cached` flag unless you want to delete the file completely!

### 📋 Current Repository Status (as of Feb 6, 2026)

**Issues to Fix:**
1. ❌ `coverage/` directory is tracked (836KB of generated files)
2. ❌ `portfolio.md` is tracked (should be local only)
3. ✅ `.gitignore` has been updated to fix wildcards
4. ⚠️ Linting errors exist that need fixing:
   - `RatingModal.jsx` - Variable accessed before declaration
   - `ProjectCard.test.jsx` - 'global' is not defined
   - `Card.test.jsx` - Unused variable

**Next Steps:**
1. Remove tracked files that should be ignored
2. Fix linting errors
3. Add `.env.example` files for both frontend and backend
4. Create backend directory structure
5. Add GitHub Actions workflow

---

## 💻 DEVELOPMENT PRINCIPLES

### Code Quality
- **Write clean, readable code** - Others should understand it at a glance
- **Comment complex logic** - Explain the "why", not the "what"
- **Use meaningful variable names** - `userSubmittedEmail` not `temp1`
- **Follow React best practices** - Hooks, functional components, proper state management
- **Create reusable components** - DRY (Don't Repeat Yourself)
- **Keep components focused** - Single responsibility principle
- **Avoid over-engineering** - Build what's needed, not what might be needed

### User Experience
- **Fast loading times** - Target <2.5 seconds
- **Clear navigation** - Users should never be lost
- **Obvious CTAs** - Make buttons and links stand out
- **Helpful error messages** - Tell users what went wrong and how to fix it
- **Accessible to all users** - Keyboard navigation, screen readers, color contrast
- **Mobile-first approach** - Design for mobile, enhance for desktop

### Performance
- **Optimize images** - Compress, use WebP format, appropriate dimensions
- **Lazy load non-critical content** - Load images as they come into view
- **Minimize JavaScript bundle** - Code splitting, tree shaking
- **Use CSS animations over JS** - Better performance, smoother animations
- **Monitor Core Web Vitals** - LCP, FID, CLS targets

### Security
- **Never expose sensitive data** - API keys, secrets in environment variables only
- **Validate all inputs** - Both frontend and backend validation
- **Sanitize user input** - Prevent XSS attacks
- **Rate limit API endpoints** - Prevent abuse (5 submissions per hour per IP)
- **Use HTTPS only** - No unencrypted connections
- **Implement CORS properly** - Only allow trusted origins

---

## 📁 PROJECT STRUCTURE

### Frontend Structure
```
src/
├── components/
│   ├── common/           # Reusable components (Button, Card, Input)
│   ├── sections/         # Page sections (Hero, About, Projects, etc.)
│   └── layout/           # Layout components (Navbar, Footer)
├── assets/
│   ├── images/           # Optimized images
│   ├── icons/            # Pixel art icons
│   └── fonts/            # Press Start 2P, Roboto Mono
├── styles/               # Global styles, CSS variables
├── utils/                # Helper functions
├── contexts/             # React contexts (Theme, etc.)
└── App.js
```

### Backend Structure
```
backend/
├── app.py                # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (gitignored)
├── utils/
│   ├── validation.py     # Input validation functions
│   ├── rate_limiter.py   # Rate limiting logic
│   └── n8n_webhook.py    # n8n integration
└── tests/
    └── test_contact.py   # API endpoint tests
```

---

## 🎨 DESIGN SYSTEM

### Color Variables
**Always use CSS variables, never hardcode colors:**

```css
/* Light Mode */
--bg-primary: #F0F0F0;      /* Off-white background */
--bg-secondary: #E0E0E0;    /* Card backgrounds */
--text-primary: #1A1A1A;    /* Almost black */
--text-secondary: #4A4A4A;  /* Medium gray */
--accent: #4A9EFF;          /* Retro blue */
--accent-hover: #2E7FDD;    /* Darker blue */
--success: #4CAF50;         /* Pixel green */
--border: #2C2C2C;          /* Dark pixel border */

/* Dark Mode */
--bg-primary: #1A1A1A;      /* Dark background */
--bg-secondary: #2C2C2C;    /* Card backgrounds */
--text-primary: #E0E0E0;    /* Light gray text */
--text-secondary: #A0A0A0;  /* Medium gray */
--accent: #00D9FF;          /* Neon cyan */
--accent-hover: #00B8D4;    /* Darker cyan */
--success: #00FF88;         /* Matrix green */
--border: #4A4A4A;          /* Light border */
```

### Typography Rules
- **Headers & Pixel Elements:** `'Press Start 2P', cursive` - Use sparingly (performance)
- **Body Text:** `'Roboto Mono', monospace` - More readable for paragraphs
- **Code Blocks:** `'Fira Code', monospace` - Optional, for code snippets

### Spacing System
**Use consistent spacing variables:**
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Component Patterns

#### Pixel Button
```css
.pixel-button {
  border: 3px solid var(--border);
  padding: 12px 24px;
  font-family: 'Press Start 2P';
  font-size: 12px;
  background: var(--accent);
  color: white;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.pixel-button:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px 0 var(--border);
}
```

#### Pixel Card
```css
.pixel-card {
  border: 3px solid var(--border);
  background: var(--bg-secondary);
  padding: var(--space-lg);
  position: relative;
}

/* Add pixel corners */
.pixel-card::before,
.pixel-card::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--border);
}
```

---

## 🔧 GIT WORKFLOW

### Branch Structure
```
main (production - protected)
  ↑
  └── feature/landing-page
  └── feature/projects-section
  └── feature/about-section
  └── feature/skills-tree
  └── feature/contact-form
  └── feature/dark-mode
  └── feature/konami-easter-egg
  └── fix/mobile-navbar-overflow
  └── update/project-descriptions
```

### Commit Convention
Follow conventional commits format:

```bash
# Feature
feat: add skill tree visualization component
feat: implement dark mode toggle with localStorage

# Bug Fix
fix: resolve mobile navbar overflow issue
fix: correct contact form validation regex

# Update/Improve
update: improve project card descriptions
update: enhance button hover animations

# Style (formatting, no code change)
style: refine button hover animations
style: adjust spacing in hero section

# Documentation
docs: add setup instructions to README
docs: document API endpoints

# Tests
test: add unit tests for contact form validation
test: add integration tests for API endpoints

# Refactor
refactor: extract validation logic to utils
refactor: simplify state management in navbar
```

### Commit Message Format
```
<type>: <short description>

[optional body - explain WHY, not WHAT]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### 🚨 CRITICAL GIT RULES (Claude Must Follow)

#### Before Every Push
**ALWAYS do these steps before pushing to remote:**

1. **ASK USER FOR PERMISSION**
   ```
   "Ready to push to remote. Should I proceed?"
   ```
   - NEVER push without explicit user confirmation
   - Explain what will be pushed (branch name, commits)

2. **REBASE ALL COMMITS INTO ONE**
   ```bash
   # Count commits on current branch
   git log --oneline main..HEAD

   # Interactive rebase to squash all commits
   git rebase -i main

   # Or use reset + commit approach:
   git reset --soft main
   git commit -m "feat: descriptive message of all changes"
   ```
   - Keep commit history clean
   - One logical feature = one commit
   - Makes it easy to revert if needed

3. **VERIFY BEFORE PUSHING**
   ```bash
   # Check what will be pushed
   git log origin/main..HEAD

   # Verify branch is clean
   git status
   ```

4. **PUSH WITH CONFIRMATION**
   ```bash
   git push origin <branch-name>
   ```

#### Example Workflow
```bash
# User: "Let's push this to GitHub"
# Claude: "Ready to push feature/navbar branch with 5 commits.
#          Should I rebase them into one commit first?"
# User: "Yes"
# Claude: Rebases commits
# Claude: "Rebased into 1 commit: 'feat: add navbar component'.
#          Ready to push. Should I proceed?"
# User: "Yes"
# Claude: Pushes to remote
```

### Pull Request Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. **Rebase all commits into one before pushing**
4. **Ask user permission before pushing**
5. Push feature branch to GitHub
6. Create PR with description including:
   - What changed
   - Why it changed
   - Screenshots (if UI changes)
   - Testing performed
7. Self-review code
8. Merge to `main` (squash and merge)
9. Delete feature branch
10. Automated deployment triggers

---

## 🚀 GITHUB ACTIONS - CI/CD

### Frontend Deployment Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy Portfolio to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build React app
        run: npm run build
        env:
          CI: false
          REACT_APP_API_URL: ${{ secrets.BACKEND_API_URL }}

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './build'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### GitHub Secrets Required
- `BACKEND_API_URL` - Backend API endpoint
- `GA_TRACKING_ID` - Google Analytics tracking ID (optional)

---

## 🔐 ENVIRONMENT VARIABLES

### Frontend (.env)
```bash
REACT_APP_API_URL=https://portfolio-backend.onrender.com
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Backend (.env)
```bash
SECRET_KEY=your-secret-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contact
ALLOWED_ORIGINS=https://[your-username].github.io,http://localhost:3000
FLASK_ENV=production
```

### Security Rules
- **NEVER commit .env files** - Always in .gitignore
- **Use strong secret keys** - Generate with `python -c "import secrets; print(secrets.token_hex(32))"`
- **Rotate secrets regularly** - Especially after team changes
- **Use environment-specific values** - Different secrets for dev/prod

---

## ✅ CODE QUALITY CHECKLIST

Before committing code, verify:

### General
- [ ] No console.log() statements left in production code
- [ ] No commented-out code blocks
- [ ] No TODO comments without GitHub issues
- [ ] All imports used (no unused imports)
- [ ] No hardcoded values (use constants/config)

### React Components
- [ ] Proper prop types or TypeScript types
- [ ] Meaningful component names (PascalCase)
- [ ] Hooks follow rules (no conditional hooks)
- [ ] useEffect has proper dependencies
- [ ] No unnecessary re-renders
- [ ] Event handlers properly named (handleClick, onSubmit)

### CSS/Styling
- [ ] Use CSS variables, not hardcoded colors
- [ ] Mobile responsive (test on 375px, 768px, 1024px)
- [ ] No !important unless absolutely necessary
- [ ] Consistent spacing using spacing variables
- [ ] Hover states on interactive elements
- [ ] Focus states visible for accessibility

### Performance
- [ ] Images optimized (<200kb each)
- [ ] Lazy loading for below-fold images
- [ ] No unnecessary API calls
- [ ] Debounce user input handlers if needed
- [ ] Code splitting for large components

### Accessibility
- [ ] Alt text on all images
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible

---

## 🧪 TESTING GUIDELINES

### Manual Testing Checklist

**Before each commit:**
- [ ] No console errors
- [ ] No visual bugs
- [ ] Feature works as expected
- [ ] Works on Chrome
- [ ] Works on mobile viewport (375px)

**Before merging to main:**
- [ ] All features work
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile responsive on all breakpoints
- [ ] Dark mode toggle works
- [ ] All links work
- [ ] Forms validate correctly
- [ ] No performance regressions

### Automated Testing (Post-MVP)
```javascript
// Example test structure
describe('ContactForm', () => {
  it('validates email format', () => {
    // Test implementation
  });

  it('shows error for empty required fields', () => {
    // Test implementation
  });

  it('submits successfully with valid data', () => {
    // Test implementation
  });
});
```

---

## 📱 RESPONSIVE DESIGN BREAKPOINTS

```css
/* Mobile First Approach */

/* Base styles - Mobile (default) */
.element {
  font-size: 16px;
  padding: var(--space-sm);
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .element {
    font-size: 18px;
    padding: var(--space-md);
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .element {
    font-size: 20px;
    padding: var(--space-lg);
  }
}
```

### Key Breakpoints
- **Mobile:** `< 768px` - Single column, hamburger menu, larger touch targets
- **Tablet:** `768px - 1023px` - 2 columns for cards, simplified layouts
- **Desktop:** `≥ 1024px` - Full layouts, hover effects, desktop navigation

### Touch Targets
- **Minimum size:** 44x44px for all interactive elements
- **Generous padding:** Around clickable areas
- **Clear feedback:** Visual response on tap
- **No hover-only:** All interactions work without hover

---

## 🐛 DEBUGGING TIPS

### Common Issues & Solutions

**Issue:** Component not re-rendering
- Check if state is actually changing (object/array mutation)
- Verify useEffect dependencies array
- Use React DevTools to inspect state

**Issue:** Styles not applying
- Check CSS specificity
- Verify className is correct
- Check if CSS variables are defined
- Inspect element in DevTools

**Issue:** API calls failing
- Check CORS configuration
- Verify API endpoint URL
- Check request payload format
- Inspect Network tab in DevTools
- Verify environment variables loaded

**Issue:** Images not loading
- Check file path (case-sensitive on Linux)
- Verify image is in public folder or imported
- Check image file size (<200kb recommended)
- Verify image format supported (jpg, png, webp)

---

## 🎯 PERFORMANCE TARGETS

### Lighthouse Scores (Minimum)
- **Performance:** >90
- **Accessibility:** >90
- **Best Practices:** >90
- **SEO:** >90

### Load Time Metrics
- **First Contentful Paint (FCP):** <1.8s
- **Largest Contentful Paint (LCP):** <2.5s
- **Time to Interactive (TTI):** <3.8s
- **Cumulative Layout Shift (CLS):** <0.1
- **First Input Delay (FID):** <100ms

### Bundle Size Targets
- **Initial JS bundle:** <250kb (gzipped)
- **Initial CSS:** <50kb (gzipped)
- **Total page weight:** <1MB

---

## 📦 DEPLOYMENT CHECKLIST

### Pre-Deploy
- [ ] All features tested locally
- [ ] No console errors or warnings
- [ ] Mobile responsive verified
- [ ] All links work correctly
- [ ] Images optimized (<200kb each)
- [ ] Environment variables configured
- [ ] Analytics configured
- [ ] Favicon added
- [ ] Meta tags added (SEO + Open Graph)

### Deploy
- [ ] Push to `main` branch
- [ ] GitHub Actions workflow passes
- [ ] Site live on GitHub Pages
- [ ] Backend deployed on Render
- [ ] Contact form connects successfully
- [ ] n8n webhook working

### Post-Deploy
- [ ] Test all sections on live site
- [ ] Test contact form submission
- [ ] Verify n8n notifications received
- [ ] Check mobile experience on real device
- [ ] Run Lighthouse audit on production
- [ ] Verify analytics tracking
- [ ] Test all browsers (Chrome, Firefox, Safari, Edge)

---

## 🚨 IMPORTANT REMINDERS

### What Makes This Portfolio Stand Out
1. **Authentic retro gaming aesthetic** - Not just colors, actual pixel art styling
2. **Personality-driven content** - Shows who you are, not just what you know
3. **Interactive and gamified** - Konami code, loading tips, skill tree
4. **Technical excellence** - Clean code, fast performance, proper architecture
5. **Full-stack showcase** - Both beautiful frontend and solid backend

### Development Priorities
1. **Functionality first** - Make it work
2. **Then make it pretty** - Polish the design
3. **Then make it fast** - Optimize performance
4. **Then make it perfect** - Final touches

### Things to Avoid
- ❌ Overcomplicating simple features
- ❌ Perfectionism blocking progress
- ❌ Adding features not in scope
- ❌ Skipping mobile testing
- ❌ Hardcoding values instead of using variables
- ❌ Committing without testing
- ❌ Ignoring console warnings/errors

### Things to Embrace
- ✅ MVP mindset - Ship first, iterate later
- ✅ Clean, readable code over clever code
- ✅ Consistent styling and spacing
- ✅ Accessibility from the start
- ✅ Performance considerations early
- ✅ Testing on real devices
- ✅ Asking for help when stuck

---

## 🎮 EASTER EGGS & FUN FEATURES

### Konami Code
- Sequence: ↑↑↓↓←→←→BA
- Triggers: Developer mode modal with fun stats
- Track activation in analytics

### Loading Screen Tips
Array of rotating tips (shows once per visitor):
- "Tip: Salim tests on potato laptops for maximum compatibility! 🥔"
- "Tip: Peak productivity happens at 2am with espresso ☕"
- "Tip: Bug hunting addict since Pascal days 🐛"
- "Tip: Commits more often than blinking 💻"
- "Tip: Gaming since Windows XP era 🎮"

### View Source Message
Add in HTML comments:
```html
<!--
  ╔════════════════════════════════════════╗
  ║  Hey there, fellow developer! 👋      ║
  ║  Nice to see you checking the source   ║
  ║  Built with React, Tailwind & ☕      ║
  ║  Want to chat? salimmtiri17@gmail.com  ║
  ╚════════════════════════════════════════╝
-->
```

---

## 📚 RESOURCES

### Design
- [Pixlr](https://pixlr.com) - Pixel art creation
- [Coolors](https://coolors.co) - Color palette generator
- [Google Fonts](https://fonts.google.com) - Press Start 2P font

### Development
- [React Docs](https://react.dev) - Official React documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Tailwind reference
- [Shadcn/ui](https://ui.shadcn.com) - Component library

### Testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [BrowserStack](https://www.browserstack.com) - Cross-browser testing
- [WebPageTest](https://www.webpagetest.org) - Performance testing

### Deployment
- [GitHub Pages Docs](https://docs.github.com/en/pages) - Hosting documentation
- [Render Docs](https://render.com/docs) - Backend deployment
- [n8n Docs](https://docs.n8n.io) - Webhook automation

---

## 🎯 SUCCESS CRITERIA

### Must Achieve
- ✅ Site loads in <2.5 seconds
- ✅ Works flawlessly on all major browsers
- ✅ Mobile responsive on all screen sizes
- ✅ Lighthouse score >90 across all metrics
- ✅ Contact form delivers messages reliably
- ✅ No console errors or warnings
- ✅ Clean, well-documented code

### Nice to Have
- ⭐ Average time on site >2 minutes
- ⭐ Bounce rate <40%
- ⭐ Contact form submission rate >2%
- ⭐ 10+ LinkedIn reactions on launch post
- ⭐ Featured in portfolio showcases

---

## 📊 PROJECT STATUS & EVALUATION

### Current Status (Feb 6, 2026)
**Overall:** 🟡 Good Progress with Issues to Address
**Deadline:** Sunday, February 9, 2026 (3 days remaining)

### ✅ Completed Features
- [x] Project setup with Vite + React 19
- [x] Component architecture (common, sections, layout)
- [x] Theme system with dark/light mode toggle
- [x] Hero section with pixel art styling
- [x] About section
- [x] Projects section with filtering
- [x] Skills section
- [x] Contact section
- [x] Footer with social links
- [x] Navbar with responsive menu
- [x] Loading screen component
- [x] Testing infrastructure (Vitest + Testing Library)
- [x] Code quality tools (ESLint, Prettier)
- [x] Scroll animations
- [x] Rating modal with Konami code easter egg

### 🔧 Known Issues & Required Fixes

**CRITICAL (Must Fix Before Deploy):**
1. ❌ **Linting Errors (3 errors)**
   - `src/components/common/RatingModal.jsx:21` - `activateCheat` accessed before declaration
   - `src/components/common/ProjectCard.test.jsx:24` - 'global' is not defined
   - `src/components/common/Card.test.jsx:132` - Unused 'container' variable

2. ❌ **Repository Hygiene**
   - `coverage/` directory tracked (836KB - should be gitignored)
   - `portfolio.md` tracked (53KB planning doc - should be local only)

**HIGH PRIORITY:**
3. ⚠️ **Missing Files**
   - `.env.example` - No template for environment variables
   - `.github/workflows/deploy.yml` - No CI/CD workflow
   - Backend directory structure not created

4. ⚠️ **Documentation Gaps**
   - No setup instructions for environment variables
   - No contribution guidelines
   - Missing LICENSE file

**MEDIUM PRIORITY:**
5. 📝 **Content Needed**
   - Actual project screenshots
   - Pixel art assets
   - Favicon
   - Open Graph images for social sharing

6. 🎨 **Design Polish**
   - Final color palette refinement
   - Typography hierarchy finalization
   - Spacing consistency audit

### 📈 Code Quality Metrics

**Test Coverage:** ~80% (Target: 80%)
- Lines: 80%+
- Functions: 80%+
- Branches: 75%+
- Statements: 80%+

**Linting:** ❌ 3 errors, 1 warning
- **Target:** 0 errors, 0 warnings

**Bundle Size:** Not yet measured
- **Target:** <250kb JS (gzipped), <50kb CSS (gzipped)

**Performance:** Not yet tested
- **Target:** Lighthouse scores >90 across all metrics

### 🎯 Immediate Next Steps (Priority Order)

1. **Fix linting errors** (30 minutes)
   - Move `activateCheat` function before useEffect
   - Fix test globals configuration
   - Remove unused variables

2. **Clean repository** (15 minutes)
   - Remove `coverage/` from tracking
   - Remove `portfolio.md` from tracking
   - Commit updated .gitignore

3. **Create environment templates** (30 minutes)
   - Add `.env.example` for frontend
   - Add `backend/.env.example` for backend
   - Document all required variables

4. **Backend implementation** (4-6 hours)
   - Create backend directory structure
   - Implement Flask API
   - Add n8n webhook integration
   - Add rate limiting
   - Add validation

5. **GitHub Actions workflow** (1-2 hours)
   - Create deployment workflow
   - Configure secrets
   - Test deployment

6. **Content finalization** (2-3 hours)
   - Add project screenshots
   - Create pixel art assets
   - Add favicon
   - Final content review

7. **Testing & polish** (2-3 hours)
   - Cross-browser testing
   - Mobile device testing
   - Lighthouse audit
   - Final accessibility check

### 🚀 Deployment Readiness Checklist

**Code Quality:** 60% Complete
- [x] ESLint configured
- [x] Prettier configured
- [ ] All linting errors fixed
- [x] Test coverage >80%
- [ ] No console errors/warnings

**Features:** 80% Complete
- [x] All main sections implemented
- [x] Dark mode working
- [x] Responsive design
- [x] Animations
- [ ] Backend API
- [ ] Contact form integration

**DevOps:** 30% Complete
- [ ] GitHub Actions workflow
- [ ] Environment variables configured
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Domain configured

**Content:** 50% Complete
- [x] Copy written
- [ ] Images optimized
- [ ] Screenshots added
- [ ] Favicon added
- [ ] SEO meta tags

### 💡 Recommendations from Senior Engineer Review

**Architecture:**
- ✅ Good: Clean component separation
- ✅ Good: Proper use of React hooks and context
- ⚠️ Consider: Code splitting for better performance
- ⚠️ Consider: Lazy loading for images and heavy components

**Testing:**
- ✅ Good: Test infrastructure in place
- ✅ Good: Coverage thresholds set
- ❌ Fix: Test errors preventing clean builds
- 📝 Add: Integration tests for critical user flows

**Performance:**
- ⚠️ Not yet measured - Run Lighthouse audit
- 📝 Consider: Image optimization strategy
- 📝 Consider: Font loading strategy (Press Start 2P is heavy)

**Security:**
- ⚠️ Add input validation on all forms
- ⚠️ Add rate limiting to contact form
- ⚠️ Implement CORS properly on backend
- ⚠️ Never expose API keys (use environment variables)

**Accessibility:**
- ✅ Good: Semantic HTML structure
- 📝 Audit: Color contrast ratios
- 📝 Audit: Keyboard navigation
- 📝 Add: ARIA labels where needed

---

**Last Updated:** 2026-02-06 17:30
**Status:** 🟡 Active Development - Issues to Address
**Deadline:** Sunday, February 9, 2026 (3 days remaining)
**Estimated Time to MVP:** 12-15 hours remaining work
