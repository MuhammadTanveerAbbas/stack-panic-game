<div align="center">

  <img src="public/favicon.svg" alt="Stack Panic Logo" width="80" height="80" />

# Stack Panic

**A real-time SaaS ops game drag your team onto incoming tasks before they crash your startup**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://stack-panic.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge)](https://console.groq.com)

</div>

---

<div align="center">
  <img src="public/Stack Panic.png" alt="Stack Panic Screenshot" width="100%" />
</div>

---

Stack Panic puts you in the hot seat of a chaotic SaaS startup. Bugs are crashing production, customers are furious, and your investors want a call all at once. It's a real-time task management game where you drag your team members onto incoming tasks before the timer runs out and your HP hits zero. Unlike idle clickers or turn-based games, Stack Panic is pure real-time pressure the kind every SaaS founder actually feels.

---

## ✨ Features

- 🚀 **Real-Time Chaos** Tasks spawn at increasing rates each level; drag your team before the stack crashes
- 🧠 **AI-Generated Tasks** Groq (llama-3.3-70b-versatile) generates fresh, witty task titles every run
- 🎨 **Team Specialists** Match Dev 👨💻, Designer 🎨, or AI Agent 🤖 to their specialty for 2× resolve speed and bonus points
- 📊 **5 Escalating Levels** Spawn rates and task counts ramp up from calm sprint to full meltdown
- 🔥 **Streak Bonuses** Chain 5 resolves without a crash to earn a 500-point streak bonus
- 💾 **Auto-Save & Resume** Game state persists to localStorage so you can pick up exactly where you left off
- 🏆 **Local Leaderboard** Top-10 scores stored on-device; compete against your own best runs
- 📜 **Match History** Last 10 game records tracked with score, level, tasks resolved, and outcome
- 🔇 **Mute Toggle** Sound preference and player name persist via cookies across sessions
- 🎭 **NeoBrutalism UI** Bold, high-contrast design with satisfying drag-and-drop interactions

---

## 🛠 Tech Stack

| Category      | Technology                         |
| ------------- | ---------------------------------- |
| Frontend      | React 18 + TypeScript              |
| Build Tool    | Vite 5                             |
| Styling       | Tailwind CSS v3 (NeoBrutalism)     |
| UI Components | Radix UI + shadcn/ui               |
| Drag & Drop   | @dnd-kit/core + @dnd-kit/sortable  |
| AI            | Groq API (llama-3.3-70b-versatile) |
| Persistence   | js-cookie + localStorage           |
| Routing       | React Router v6                    |
| Testing       | Vitest + Testing Library           |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- Groq API key (optional game works without it, falls back to curated task titles)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/MuhammadTanveerAbbas/stack-panic.git
cd stack-panic

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your VITE_GROQ_API_KEY (optional)

# 4. Run the development server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Groq AI  enables dynamic AI-generated task titles
# Get your key at https://console.groq.com
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> The game is fully playable without a Groq key it falls back to a curated set of task titles automatically.

---

## 📁 Project Structure

```
stack-panic/
├── public/              # Static assets (favicon, manifest, robots, sitemap)
├── src/
│   ├── components/
│   │   ├── game/        # Game UI: Board, Header, Footer, Modals, Landing
│   │   └── ui/          # shadcn/ui primitives
│   ├── game/            # Core game logic
│   │   ├── constants.ts # Level config, task titles, score values
│   │   ├── reducer.ts   # Game state reducer
│   │   ├── sounds.ts    # Sound effects
│   │   ├── storage.ts   # localStorage + cookie persistence
│   │   ├── types.ts     # TypeScript types
│   │   ├── ui-constants.ts
│   │   └── useGameLoop.ts
│   ├── hooks/           # Custom React hooks
│   ├── lib/
│   │   ├── cookies.ts   # Cookie helpers
│   │   ├── groq.ts      # Groq AI integration
│   │   └── utils.ts
│   ├── pages/           # Index + NotFound routes
│   └── main.tsx         # App entry point
├── .env.example
├── package.json
└── README.md
```

---

## 📦 Available Scripts

| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start development server  |
| `npm run build`      | Build for production      |
| `npm run build:dev`  | Build in development mode |
| `npm run preview`    | Preview production build  |
| `npm run lint`       | Run ESLint                |
| `npm run test`       | Run tests once            |
| `npm run test:watch` | Run tests in watch mode   |

---

## 🌐 Deployment

This project is deployed on **Vercel**.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MuhammadTanveerAbbas/stack-panic)

1. Click the button above
2. Connect your GitHub account
3. Add `VITE_GROQ_API_KEY` in Vercel dashboard (optional)
4. Deploy

---

## 🗺 Roadmap

- [x] Core drag-and-drop gameplay
- [x] 5 escalating difficulty levels
- [x] AI-generated task titles via Groq
- [x] Local leaderboard + match history
- [x] Auto-save & resume
- [x] Streak bonus system
- [x] NeoBrutalism landing page
- [ ] Online global leaderboard
- [ ] More team member types
- [ ] Mobile touch support improvements
- [ ] Daily challenge mode

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Built by The MVP Guy

<div align="center">

**Muhammad Tanveer Abbas**
SaaS Developer | Building production-ready MVPs in 14–21 days

[![Portfolio](https://img.shields.io/badge/Portfolio-themvpguy.vercel.app-black?style=for-the-badge)](https://themvpguy.vercel.app)
[![Twitter](https://img.shields.io/badge/Twitter-@themvpguy-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/themvpguy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/muhammadtanveerabbas)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/MuhammadTanveerAbbas)

_If this project helped you, please consider giving it a ⭐_

</div>
