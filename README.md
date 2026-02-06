# 🎮 Pixel-Perfect Portfolio

> A retro pixel art themed portfolio website with authentic 8-bit/16-bit RPG aesthetics

**Live Demo:** [Coming Soon - Sunday, Feb 9, 2026]

![Portfolio Preview](./public/preview.png)

---

## 🌟 Overview

A unique, interactive portfolio website that feels like playing a retro video game. Built with modern web technologies while maintaining an authentic pixel art aesthetic, this portfolio showcases my full-stack development skills through an immersive, gamified experience.

**Key Highlights:**
- 🎨 Authentic 8-bit/16-bit pixel art design
- 🌓 Dark/Light mode with smooth transitions
- 🎮 Interactive easter eggs (Konami Code!)
- 📱 Fully responsive (mobile-first design)
- ⚡ Lightning fast (<2.5s load time)
- ♿ Accessible (WCAG AA compliant)
- 🚀 Automated CI/CD deployment

---

## ✨ Features

### 🎯 Interactive Sections

#### 🏠 Landing/Hero Section
- **Loading Screen** - Retro progress bar with rotating tips (shows once per visitor)
- **Hero Banner** - Animated title with pixel art styling
- **Call-to-Action** - Smooth scroll to projects section

#### 👨‍💻 About Section
- **Pixel Art Portrait** - Professional photo converted to pixel art with idle animation
- **Core Stats** - Animated skill bars (Frontend, Backend, Mobile, DevOps)
- **Special Traits** - Bug Hunter 🐛, 2am Coder ☕, Potato Tester 🥔
- **Education & Availability** - Currently seeking 6-month internship (Feb-Jul 2026)

#### 🎲 Projects Section - "Quest Log"
- **5 Featured Projects** - From gaming to enterprise to AI/ML
- **Interactive Filters** - Gaming, Enterprise, AI/ML, Mobile, Web
- **Tiered System** - Main Quests (⭐⭐⭐⭐⭐) and Side Quests (⭐⭐⭐)
- **Project Cards** - Screenshots, tech stack badges, live demos, GitHub links

**Featured Projects:**
1. **MultiGame** (⭐⭐⭐⭐⭐) - Flutter gaming platform with 5 games
2. **HelpDesk Pro** (⭐⭐⭐⭐) - Enterprise ticketing with Keycloak SSO
3. **MediGuide** (⭐⭐⭐⭐) - AI medical chatbot with Grok API
4. **iTeamHub** (⭐⭐⭐) - Student social app with real-time features
5. **Co-op** (⭐⭐) - Brand collaboration platform

#### 🌳 Skills Section - "Skill Tree"
- **Desktop** - SVG skill tree with animated connections
- **Mobile** - Categorized accordion with progress bars
- **Interactive** - Hover tooltips, click to highlight related projects
- **Technologies** - React, Flutter, Node.js, Flask, Docker, MongoDB, MySQL, and more

#### 📧 Contact Section - "Contact Quest"
- **Contact Form** - Validated inputs with Flask backend
- **n8n Integration** - Automated email/Slack notifications
- **Direct Links** - Email, LinkedIn, GitHub, Phone, Instagram
- **Success Animation** - Pixel art "Quest Complete" message

### 🎮 Easter Eggs & Special Features

#### 🕹️ Konami Code
Type the classic code: **↑ ↑ ↓ ↓ ← → ← → B A**
- Unlocks "Developer Mode" with fun stats
- Shows commit count, espresso shots, 2am sessions, etc.

#### 🌓 Dark Mode
- Toggle between light and dark themes
- Smooth CSS variable transitions
- Persists with localStorage
- Optimized color palettes for each mode

#### ✨ Animations
- **Scroll Animations** - Fade-in effects with Intersection Observer
- **Smooth Scroll** - Navigate sections smoothly
- **Hover Effects** - Pixel-style button lifts, card shadows
- **Loading Tips** - Random tips rotation on first visit

---

## 🛠️ Tech Stack

### Frontend
```json
{
  "framework": "React 18",
  "styling": "Tailwind CSS",
  "ui_components": "Shadcn/ui",
  "fonts": ["Press Start 2P", "Roboto Mono"],
  "animations": "CSS Transitions + Intersection Observer",
  "state_management": "React Hooks (useState, useEffect, useContext)"
}
```

### Backend
```json
{
  "framework": "Flask (Python)",
  "server": "Gunicorn",
  "security": ["Flask-Limiter", "Flask-CORS", "Input Validation"],
  "integrations": "n8n Webhook"
}
```

### DevOps & Tools
```json
{
  "hosting": {
    "frontend": "GitHub Pages",
    "backend": "Render/Railway"
  },
  "ci_cd": "GitHub Actions",
  "version_control": "Git",
  "code_quality": ["ESLint", "Prettier"],
  "analytics": "Google Analytics / Plausible"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/[your-username]/portfolio.git
cd portfolio
```

#### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your environment variables
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

#### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your environment variables
# SECRET_KEY=your-secret-key
# N8N_WEBHOOK_URL=https://your-n8n.com/webhook/contact
# ALLOWED_ORIGINS=http://localhost:3000

# Run Flask development server
python app.py
```

The API will run at [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components (Button, Card, Input)
│   │   ├── sections/        # Page sections (Hero, About, Projects, Skills, Contact)
│   │   └── layout/          # Layout components (Navbar, Footer)
│   ├── assets/
│   │   ├── images/          # Optimized images
│   │   ├── icons/           # Pixel art icons
│   │   └── fonts/           # Custom fonts
│   ├── styles/              # Global styles, CSS variables
│   ├── contexts/            # React contexts (ThemeContext)
│   ├── utils/               # Helper functions
│   └── App.js               # Main app component
├── backend/
│   ├── app.py               # Flask application
│   ├── config.py            # Configuration
│   ├── requirements.txt     # Python dependencies
│   ├── utils/
│   │   ├── validation.py    # Input validation
│   │   ├── rate_limiter.py  # Rate limiting
│   │   └── n8n_webhook.py   # n8n integration
│   └── tests/               # API tests
├── public/                  # Static files
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD workflow
├── CLAUDE.md                # Development guidelines
├── task.md                  # Task breakdown
├── portfolio.md             # Complete project plan
└── README.md                # This file
```

---

## 🎨 Design System

### Color Palette

#### Light Mode - Retro CRT Feel
```css
--bg-primary: #F0F0F0;      /* Off-white background */
--bg-secondary: #E0E0E0;    /* Card backgrounds */
--text-primary: #1A1A1A;    /* Almost black text */
--text-secondary: #4A4A4A;  /* Medium gray */
--accent: #4A9EFF;          /* Retro blue */
--success: #4CAF50;         /* Pixel green */
--border: #2C2C2C;          /* Dark pixel border */
```

#### Dark Mode - Terminal Aesthetic
```css
--bg-primary: #1A1A1A;      /* Dark background */
--bg-secondary: #2C2C2C;    /* Card backgrounds */
--text-primary: #E0E0E0;    /* Light gray text */
--text-secondary: #A0A0A0;  /* Medium gray */
--accent: #00D9FF;          /* Neon cyan */
--success: #00FF88;         /* Matrix green */
--border: #4A4A4A;          /* Light border */
```

### Typography
- **Headers/Pixel Elements:** Press Start 2P (retro pixel font)
- **Body Text:** Roboto Mono (readable monospace)
- **Responsive sizes:** 48px → 32px (mobile) for headers

---

## 🧪 Available Scripts

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm test           # Run tests (coming soon)
```

### Backend
```bash
python app.py      # Start Flask development server
python -m pytest   # Run tests (coming soon)
```

---

## 🚀 Deployment

### Automatic Deployment
The portfolio uses GitHub Actions for automatic deployment:
- **Push to `main`** → Triggers deployment workflow
- **Frontend** → Deployed to GitHub Pages
- **Backend** → Deployed to Render/Railway

### Manual Deployment

#### Frontend (GitHub Pages)
```bash
npm run build
# Commit and push to main branch
# GitHub Actions will handle deployment
```

#### Backend (Render)
1. Create account on [Render](https://render.com)
2. Connect GitHub repository
3. Configure environment variables
4. Deploy automatically on push to main

---

## ✅ Performance Metrics

### Target Lighthouse Scores
- **Performance:** >90
- **Accessibility:** >90
- **Best Practices:** >90
- **SEO:** >90

### Load Time Goals
- **First Contentful Paint:** <1.8s
- **Largest Contentful Paint:** <2.5s
- **Time to Interactive:** <3.8s
- **Total Load Time:** <2.5s

---

## 🎯 Development Roadmap

### ✅ Phase 1: MVP (Deadline: Sunday, Feb 9, 2026)
- [x] Project setup and foundation
- [x] All main sections (Hero, About, Projects, Skills, Contact)
- [x] Dark mode toggle
- [x] Interactive features and animations
- [x] Flask backend with n8n integration
- [x] Responsive design
- [x] Deployment to GitHub Pages

### 🔮 Phase 2: Enhancements (Post-Launch)
- [ ] Bug Hunter NPC chatbot (FAQ-based)
- [ ] Achievement system with unlockable badges
- [ ] Expandable project cards with more details
- [ ] View source easter egg (ASCII art)
- [ ] Progress tracker / Quest HUD

### 🌟 Phase 3: Advanced Features (Future)
- [ ] AI-powered chatbot (Anthropic/OpenAI)
- [ ] Testing suite (Jest + React Testing Library)
- [ ] Blog section (technical writing)
- [ ] Pixel art cursor trail
- [ ] Sound effects toggle (8-bit audio)
- [ ] Mini-game showcasing skills

---

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 About Me

**Salim Mtiri** - Full-Stack Developer | Pixel-Perfect Problem-Solver

- 🎓 Software Engineering Student at ITEAM University, Tunis
- 💼 Seeking 6-month internship (Feb-Jul 2026)
- 🎮 Gaming since Windows XP, coding since Pascal
- 🐛 Bug hunting addict (obsessed with clean code)
- 🥔 Tests on potato laptops for maximum compatibility
- ☕ Peak productivity at 2am with espresso

**Tech Stack:**
- **Frontend:** React, Flutter, Tailwind CSS
- **Backend:** Node.js, Express, Python, Flask
- **Database:** MongoDB, MySQL
- **DevOps:** Docker, CI/CD, Git
- **Security:** Keycloak, JWT, RBAC

---

## 📫 Contact

- 📧 Email: [salimmtiri17@gmail.com](mailto:salimmtiri17@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/salim-mtiri](https://linkedin.com/in/salim-mtiri)
- 💻 GitHub: [github.com/salim-mtiri](https://github.com/salim-mtiri)
- 📱 Phone: +216 28 194 566
- 📸 Instagram: [@salim.mtiri](https://instagram.com/salim.mtiri)

---

## 🙏 Acknowledgments

- **Design Inspiration:** Classic 8-bit/16-bit RPG games
- **Fonts:** Press Start 2P by CodeMan38
- **Icons:** Custom pixel art icons
- **Built with:** React, Tailwind CSS, Flask, and lots of ☕

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/[your-username]/portfolio)
![GitHub last commit](https://img.shields.io/github/last-commit/[your-username]/portfolio)
![GitHub stars](https://img.shields.io/github/stars/[your-username]/portfolio?style=social)

---

<div align="center">

**Made with ❤️ and 🎮 by Salim Mtiri**

*"Gaming since Windows XP, coding since Pascal - solving problems one pixel at a time."*

⭐ Star this repo if you like it!

</div>

---

## 🎮 Easter Egg

Want to unlock Developer Mode? Try the Konami Code on the live site:

**↑ ↑ ↓ ↓ ← → ← → B A**

---

*Last Updated: February 6, 2026*
*Status: 🟢 Active Development*
*Deadline: Sunday, February 9, 2026*
