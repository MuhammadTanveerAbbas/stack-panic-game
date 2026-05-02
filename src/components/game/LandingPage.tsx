import { useState, useEffect, useRef } from "react";
import {
  Rocket,
  Play,
  Save,
  Trash2,
  Trophy,
  Bug,
  Sparkles,
  PhoneCall,
  TrendingUp,
  Zap,
  Users,
  Shield,
  ChevronDown,
  Github,
  Star,
  BarChart3,
  Cpu,
  Layers,
  MousePointer,
  Clock,
  Target,
  Medal,
  Crown,
  Flame,
  RefreshCw,
  Home,
  Linkedin,
  Info,
  List,
  Code,
  Award,
} from "lucide-react";
import { RANDOM_NAMES } from "@/game/constants";
import {
  getPlayerName,
  setPlayerName as savePlayerName,
  getSaveInfo,
  loadSave,
  getLeaderboard,
  getHighScore,
} from "@/game/storage";
import { GameState } from "@/game/types";
import { cn } from "@/lib/utils";
import { z } from "zod";

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(20, "Name must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9\s-_]+$/,
    "Name can only contain letters, numbers, spaces, hyphens, and underscores",
  )
  .or(z.literal("")); // Allow empty for random name

interface LandingPageProps {
  highScore: number;
  onStart: (name: string) => void;
  onLoadSave: (state: GameState) => void;
}

const FEATURES = [
  {
    icon: Zap,
    title: "Real-Time Chaos",
    desc: "Tasks spawn faster each level. Drag your team before the stack crashes.",
    color: "text-feature-accent",
  },
  {
    icon: Users,
    title: "Team Specialists",
    desc: "Match Dev, Designer, or AI Agent to their specialty for 2× speed + bonus points.",
    color: "text-team-dev",
  },
  {
    icon: TrendingUp,
    title: "5 Escalating Levels",
    desc: "From calm sprint to full meltdown. Survive all 5 levels to win.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Streak Bonuses",
    desc: "Chain 5 resolves without a crash to unlock a 500-point streak bonus.",
    color: "text-angry-accent",
  },
];

const HOW_TO_PLAY = [
  {
    icon: MousePointer,
    step: "01",
    title: "Drag a team member",
    desc: "Pick Dev 👨‍💻, Designer 🎨, or AI Agent 🤖 from the sidebar.",
  },
  {
    icon: Target,
    step: "02",
    title: "Drop onto a task card",
    desc: "Match specialists to their task type for a speed & score bonus.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Beat the timer",
    desc: "Each task has a countdown. Let it expire and you lose HP.",
  },
  {
    icon: Flame,
    step: "04",
    title: "Survive all 5 levels",
    desc: "Reach Level 5 without losing all HP to win the run.",
  },
];

const GAME_ELEMENTS = [
  {
    label: "BUG",
    emoji: "🐛",
    title: "Production is down in EU region",
    color: "bg-bug border-l-bug-accent text-bug-accent",
    bar: "bg-bug-accent",
    w: "75%",
  },
  {
    label: "FEATURE",
    emoji: "✨",
    title: "Customer wants Slack integration",
    color: "bg-feature border-l-feature-accent text-feature-accent",
    bar: "bg-feature-accent",
    w: "50%",
  },
  {
    label: "ANGRY CUSTOMER",
    emoji: "😤",
    title: "I'm posting on Twitter if not fixed",
    color: "bg-angry border-l-angry-accent text-angry-accent",
    bar: "bg-angry-accent",
    w: "30%",
  },
  {
    label: "INVESTOR PING",
    emoji: "💼",
    title: "Quick call tomorrow? Need MRR update",
    color: "bg-investor border-l-investor-accent text-investor-accent",
    bar: "bg-investor-accent",
    w: "60%",
  },
];

const ACHIEVEMENTS = [
  {
    icon: Star,
    title: "First Blood",
    desc: "Resolve your first task",
    unlocked: true,
  },
  {
    icon: Flame,
    title: "On Fire",
    desc: "5-task resolve streak",
    unlocked: true,
  },
  {
    icon: Crown,
    title: "Series A",
    desc: "Score over 5,000 points",
    unlocked: false,
  },
  {
    icon: Medal,
    title: "Survivor",
    desc: "Complete all 5 levels",
    unlocked: false,
  },
];

const TECH_STACK = [
  {
    icon: Layers,
    name: "React 18 + TypeScript",
    desc: "Component-driven UI with full type safety",
  },
  { icon: Zap, name: "Vite", desc: "Lightning-fast dev server & build tool" },
  {
    icon: Cpu,
    name: "Groq API (llama-3.3-70b)",
    desc: "AI-powered task generation",
  },
  {
    icon: MousePointer,
    name: "@dnd-kit",
    desc: "Accessible drag-and-drop interactions",
  },
  {
    icon: BarChart3,
    name: "Tailwind CSS",
    desc: "NeoBrutalism utility-first styling",
  },
  {
    icon: Save,
    name: "js-cookie + localStorage",
    desc: "Persistent scores & game state",
  },
];

export function LandingPage({
  highScore,
  onStart,
  onLoadSave,
}: LandingPageProps) {
  const [name, setName] = useState(getPlayerName() || "");
  const [error, setError] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveInfo = getSaveInfo();
  const leaderboard = getLeaderboard();
  const storedHigh = getHighScore();
  const displayHigh = Math.max(highScore, storedHigh);

  useEffect(() => {
    if (showNamePrompt && inputRef.current) inputRef.current.focus();
  }, [showNamePrompt]);

  useEffect(() => {
    if (displayHigh > 0) setIsNewHighScore(true);
    const t = setTimeout(() => setIsNewHighScore(false), 3000);
    return () => clearTimeout(t);
  }, [displayHigh]);

  const handleGo = () => {
    const trimmed = name.trim();
    const result = nameSchema.safeParse(trimmed);

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    const finalName =
      trimmed || RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    savePlayerName(finalName);
    setName(finalName);
    setError(null);
    onStart(finalName);
  };

  const handleContinue = () => {
    const saved = loadSave();
    if (saved) onLoadSave(saved);
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Name Prompt Modal ── */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4">
          <div className="neo-card p-6 sm:p-8 max-w-sm w-full animate-bounce-in">
            <h2 className="font-heading font-bold text-lg sm:text-xl mb-2">
              What's your name, founder?
            </h2>
            <p className="text-sm text-muted-foreground mb-5 font-body">
              Leave blank for a random founder name
            </p>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              onKeyDown={(e) => e.key === "Enter" && handleGo()}
              placeholder="Enter your callsign..."
              className={cn(
                "w-full bg-secondary border-2 border-foreground rounded-xl px-4 py-3 text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-1",
                error && "border-angry-accent focus:ring-angry-accent",
              )}
              style={{ boxShadow: "3px 3px 0px hsl(0 0% 10%)" }}
            />
            {error ? (
              <p className="text-[10px] text-angry-accent font-mono font-bold mb-4 uppercase animate-shake">
                {error}
              </p>
            ) : (
              <div className="h-4 mb-4" />
            )}
            <div className="flex gap-3">
              <button
                onClick={handleGo}
                className="flex-1 neo-button bg-primary text-primary-foreground py-3 text-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Rocket className="w-4 h-4" /> LET'S GO
              </button>
              <button
                onClick={() => setShowNamePrompt(false)}
                className="neo-button bg-secondary text-foreground py-3 px-4 text-sm min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 border-b-2 border-foreground bg-card/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            className="font-heading font-bold text-lg flex items-center gap-2"
          >
            <img src="/favicon.svg" alt="Stack Panic" className="w-7 h-7" />
            STACK PANIC
          </button>
          
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scrollTo("features")}
              className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[40px]"
            >
              <Zap className="w-3.5 h-3.5 text-primary" /> Features
            </button>
            <button
              onClick={() => scrollTo("how-to-play")}
              className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[40px]"
            >
              <List className="w-3.5 h-3.5 text-feature-accent" /> How to Play
            </button>
            <button
              onClick={() => scrollTo("leaderboard")}
              className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[40px]"
            >
              <Award className="w-3.5 h-3.5 text-angry-accent" /> Leaderboard
            </button>
            <button
              onClick={() => scrollTo("tech")}
              className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[40px]"
            >
              <Code className="w-3.5 h-3.5 text-team-dev" /> Tech
            </button>
          </div>
          
          <button
            onClick={() => setShowNamePrompt(true)}
            className="neo-button bg-primary text-primary-foreground text-sm px-5 py-2.5 flex items-center gap-2 min-h-[44px]"
            style={{ boxShadow: "3px 3px 0px hsl(0 0% 10%)" }}
          >
            <Rocket className="w-4 h-4" /> Play Now
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative overflow-hidden border-b-2 border-foreground"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-angry/20 pointer-events-none" />
        <div className="absolute top-10 left-6 w-20 h-20 rounded-2xl border-2 border-foreground/10 bg-primary/5 rotate-12 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-16 right-8 w-14 h-14 rounded-xl border-2 border-foreground/10 bg-angry/10 -rotate-6 pointer-events-none hidden sm:block" />
        <div className="absolute top-1/3 right-12 w-8 h-8 rounded-lg border-2 border-foreground/10 bg-feature/20 rotate-45 pointer-events-none hidden lg:block" />

        <div className="max-w-5xl mx-auto px-4 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 neo-card px-3 py-1.5 text-xs font-mono text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Real-time SaaS ops game
            <span className="w-2 h-2 rounded-full bg-angry-accent animate-pulse" />
          </div>

          {/* Logo + Title lockup */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <img
              src="/favicon.svg"
              alt="Stack Panic"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
            />
            <h1 className="font-heading font-bold text-6xl sm:text-8xl md:text-9xl tracking-tight leading-none">
              STACK<span className="text-primary">PANIC</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-muted-foreground text-base sm:text-xl font-body max-w-lg mx-auto mb-3 leading-relaxed">
            Your product is on fire.{" "}
            <span className="text-destructive font-bold">Again.</span>
          </p>
          <p className="text-foreground/70 text-sm sm:text-base font-body max-w-md mx-auto mb-8">
            Drag your team onto incoming tasks before they crash your startup.
          </p>

          {/* High Score badge */}
          {displayHigh > 0 && (
            <div
              className={`inline-flex items-center gap-2 neo-card px-4 py-2 mb-8 text-sm font-body ${isNewHighScore ? "animate-bounce" : ""}`}
            >
              <Trophy className="w-4 h-4 text-angry-accent" />
              <span className="text-muted-foreground">High Score:</span>
              <span className="font-heading font-bold text-lg">
                {displayHigh.toLocaleString()}
              </span>
              {isNewHighScore && (
                <span className="text-xs text-primary font-bold animate-pulse">
                  NEW!
                </span>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            {saveInfo ? (
              <>
                <button
                  onClick={handleContinue}
                  className="neo-button bg-primary text-primary-foreground font-heading font-bold text-base px-8 py-4 flex items-center gap-3 min-h-[52px]"
                >
                  <Play className="w-5 h-5" /> CONTINUE Lv.{saveInfo.level} ·{" "}
                  {saveInfo.score.toLocaleString()}pts
                </button>
                <button
                  onClick={() => setShowNamePrompt(true)}
                  className="neo-button bg-card text-foreground font-heading font-bold text-base px-8 py-4 flex items-center gap-3 min-h-[52px]"
                >
                  <Trash2 className="w-5 h-5" /> NEW GAME
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowNamePrompt(true)}
                className="neo-button bg-primary text-primary-foreground font-heading font-bold text-xl px-14 py-5 flex items-center gap-3 min-h-[60px]"
                style={{ boxShadow: "5px 5px 0px hsl(0 0% 10%)" }}
              >
                <Rocket className="w-6 h-6" /> START GAME
              </button>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-muted-foreground">
            {[
              { emoji: "🚀", label: "5 Levels" },
              { emoji: "🧠", label: "AI Tasks" },
              { emoji: "🔥", label: "Streak Bonuses" },
              { emoji: "🏆", label: "Leaderboard" },
            ].map(({ emoji, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span>{emoji}</span> {label}
              </span>
            ))}
          </div>

          {/* Scroll hint */}
          <button
            onClick={() => scrollTo("features")}
            className="mt-10 flex flex-col items-center gap-1 mx-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-xs font-mono">EXPLORE</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-2">
            Why You'll Panic
          </h2>
          <p className="text-muted-foreground text-center text-sm font-body mb-10">
            Four reasons this game will stress you out (in a good way)
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="neo-card p-5 flex flex-col gap-3">
                <Icon className={`w-7 h-7 ${color}`} />
                <h3 className="font-heading font-bold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO PLAY ── */}
      <section
        id="how-to-play"
        className="border-b-2 border-foreground bg-secondary/30"
      >
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-2">
            How to Play
          </h2>
          <p className="text-muted-foreground text-center text-sm font-body mb-10">
            Four steps between you and startup glory
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_TO_PLAY.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="neo-card p-5 relative overflow-hidden">
                <span className="absolute top-3 right-4 font-heading font-bold text-4xl text-foreground/5 select-none">
                  {step}
                </span>
                <div
                  className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-foreground flex items-center justify-center mb-4"
                  style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
                >
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAME ELEMENTS ── */}
      <section id="game-elements" className="border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-2">
            Task Types
          </h2>
          <p className="text-muted-foreground text-center text-sm font-body mb-10">
            Four flavors of startup chaos you'll need to handle
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {GAME_ELEMENTS.map(({ label, emoji, title, color, bar, w }) => (
              <div
                key={label}
                className={`${color} border-2 border-foreground border-l-4 rounded-xl p-4`}
                style={{ boxShadow: "3px 3px 0px hsl(0 0% 10%)" }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{emoji}</span>
                  <span className="text-xs font-mono font-bold">{label}</span>
                </div>
                <p className="font-mono text-sm text-foreground font-medium mb-3">
                  "{title}"
                </p>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-foreground/20">
                  <div
                    className={`h-full ${bar} rounded-full transition-all`}
                    style={{ width: w }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 font-body">
                  Timer: {w} remaining
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section
        id="achievements"
        className="border-b-2 border-foreground bg-secondary/30"
      >
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-2">
            Achievements
          </h2>
          <p className="text-muted-foreground text-center text-sm font-body mb-10">
            Milestones to chase across your runs
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {ACHIEVEMENTS.map(({ icon: Icon, title, desc, unlocked }) => (
              <div
                key={title}
                className={`neo-card p-5 flex flex-col gap-3 ${!unlocked ? "opacity-50" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border-2 border-foreground flex items-center justify-center ${unlocked ? "bg-primary/10" : "bg-secondary"}`}
                  style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
                >
                  <Icon
                    className={`w-5 h-5 ${unlocked ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    {desc}
                  </p>
                </div>
                <span
                  className={`text-xs font-mono font-bold ${unlocked ? "text-primary" : "text-muted-foreground"}`}
                >
                  {unlocked ? "✓ UNLOCKED" : "LOCKED"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERBOARD ── */}
      <section id="leaderboard" className="border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-2">
            Leaderboard
          </h2>
          <p className="text-muted-foreground text-center text-sm font-body mb-10">
            Top 10 scores on this device
          </p>
          <div className="neo-card max-w-lg mx-auto overflow-hidden">
            {leaderboard.length === 0 ? (
              <div className="p-10 text-center">
                <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">
                  No scores yet. Be the first!
                </p>
                <button
                  onClick={() => setShowNamePrompt(true)}
                  className="neo-button bg-primary text-primary-foreground text-xs px-6 py-2.5 mt-4 flex items-center gap-2 mx-auto min-h-[40px]"
                >
                  <Rocket className="w-3.5 h-3.5" /> Play Now
                </button>
              </div>
            ) : (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-muted-foreground border-b-2 border-foreground bg-secondary/50">
                    <th className="text-left py-3 px-4">#</th>
                    <th className="text-left py-3 px-2">NAME</th>
                    <th className="text-right py-3 px-2">SCORE</th>
                    <th className="text-right py-3 px-4">LEVEL</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr
                      key={i}
                      className={`border-b border-foreground/10 hover:bg-secondary/30 transition-colors ${i === 0 ? "text-angry-accent" : ""}`}
                    >
                      <td className="py-3 px-4 font-bold text-muted-foreground">
                        {i === 0
                          ? "🥇"
                          : i === 1
                            ? "🥈"
                            : i === 2
                              ? "🥉"
                              : i + 1}
                      </td>
                      <td className="py-3 px-2 font-bold text-foreground">
                        {entry.name}
                      </td>
                      <td className="py-3 px-2 text-right font-bold">
                        {entry.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {entry.level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section
        id="tech"
        className="border-b-2 border-foreground bg-secondary/30"
      >
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-2">
            Tech Stack
          </h2>
          <p className="text-muted-foreground text-center text-sm font-body mb-10">
            Built with modern tools for a snappy experience
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {TECH_STACK.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="neo-card p-4 flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg bg-primary/10 border-2 border-foreground flex items-center justify-center shrink-0"
                  style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
                >
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm">{name}</h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-5xl mb-4">
            Ready to Panic?
          </h2>
          <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
            Your product won't save itself. Get in there.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowNamePrompt(true)}
              className="neo-button bg-primary text-primary-foreground font-heading font-bold text-lg px-12 py-4 flex items-center gap-3 min-h-[56px]"
            >
              <Rocket className="w-5 h-5" /> START GAME
            </button>
            {saveInfo && (
              <button
                onClick={handleContinue}
                className="neo-button bg-card text-foreground font-heading font-bold text-base px-8 py-4 flex items-center gap-3 min-h-[52px]"
              >
                <RefreshCw className="w-4 h-4" /> RESUME Lv.{saveInfo.level}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-card border-t-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-heading font-bold">
                <img src="/favicon.svg" alt="Stack Panic" className="w-6 h-6" />
                STACK PANIC
              </div>
              <span className="text-xs text-muted-foreground font-body font-normal hidden sm:inline">
                v1.0 · A real-time SaaS ops game
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollTo("hero")}
                className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[36px]"
              >
                <Home className="w-3.5 h-3.5" /> Home
              </button>
              <a
                href="https://github.com/muhammadtanveerabbas"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[36px]"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
              <a
                href="https://x.com/m_tanveerabbas"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[36px]"
              >
                <img src="/x-icon.svg" alt="X" className="w-3.5 h-3.5" /> X
              </a>
              <a
                href="https://linkedin.com/in/MuhammadTanveerAbbas"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button bg-secondary text-foreground text-xs px-3 py-2 flex items-center gap-1.5 min-h-[36px]"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground font-body">
              Built with <span className="text-angry-accent">❤️</span> and too much caffeine
            </p>
            <a
              href="https://themvpguy.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-body text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Made by <span className="font-heading font-bold text-primary underline">The MVP Guy</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
