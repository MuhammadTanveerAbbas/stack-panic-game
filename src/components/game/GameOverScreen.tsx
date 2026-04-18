import { ROAST_LINES } from "@/game/ui-constants";
import { GameState } from "@/game/types";
import { isLeaderboardWorthy } from "@/game/storage";
import {
  RotateCcw,
  Copy,
  Trophy,
  BarChart3,
  Skull,
  PartyPopper,
} from "lucide-react";

interface GameOverScreenProps {
  state: GameState;
  onRestart: () => void;
  onShowLeaderboard: () => void;
}

export function GameOverScreen({
  state,
  onRestart,
  onShowLeaderboard,
}: GameOverScreenProps) {
  const survived = state.level >= 5;
  const roast =
    ROAST_LINES.find((r) => state.score < r.max)?.line ||
    ROAST_LINES[ROAST_LINES.length - 1].line;
  const madeBoard = isLeaderboardWorthy(state.score);

  const shareText = `I scored ${state.score.toLocaleString()} in Stack Panic 🎮\nLevel ${state.level} · ${state.tasksResolved} tasks resolved · ${state.tasksCrashed} crashed`;

  const handleShare = () => navigator.clipboard.writeText(shareText);

  const stats = [
    { label: "Player", value: state.playerName || "Anonymous" },
    { label: "Final Score", value: state.score.toLocaleString() },
    { label: "Level Reached", value: state.level },
    { label: "Tasks Resolved", value: state.tasksResolved },
    { label: "Tasks Crashed", value: state.tasksCrashed },
    { label: "Best Streak", value: state.bestStreak },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 overflow-y-auto py-4">
      <div className="neo-card p-6 sm:p-8 max-w-md w-full animate-bounce-in my-auto">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          {survived ? (
            <PartyPopper className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          ) : (
            <Skull className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />
          )}
          <h2
            className={`font-heading font-bold text-xl sm:text-2xl ${
              survived ? "text-primary" : "text-destructive"
            }`}
          >
            {survived ? "YOU SURVIVED!" : "PRODUCT CRASHED"}
          </h2>
        </div>

        <div
          className="border-2 border-foreground rounded-xl p-4 mb-4 bg-secondary/50"
          style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
        >
          <h3 className="text-xs font-heading font-bold text-muted-foreground mb-3 uppercase tracking-wide">
            Post-Mortem Report
          </h3>
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex justify-between text-sm py-1.5 font-body"
            >
              <span className="text-muted-foreground">{s.label}</span>
              <span className="text-foreground font-bold">{s.value}</span>
            </div>
          ))}
        </div>

        <div
          className="bg-angry/50 border-2 border-foreground rounded-xl p-3 mb-4"
          style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
        >
          <p className="text-xs font-heading font-bold text-muted-foreground mb-1 uppercase">
            Verdict
          </p>
          <p className="text-sm text-foreground font-body italic">"{roast}"</p>
        </div>

        {madeBoard && state.score > 0 && (
          <div
            className="bg-primary/10 border-2 border-primary rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2 text-sm font-heading font-bold text-primary"
            style={{ boxShadow: "2px 2px 0px hsl(160 60% 45% / 0.5)" }}
          >
            <Trophy className="w-5 h-5" /> NEW HIGH SCORE!
          </div>
        )}

        <div className="flex gap-3 mb-2">
          <button
            onClick={onRestart}
            className="flex-1 neo-button bg-primary text-primary-foreground flex items-center justify-center gap-2 text-sm py-3 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" /> PLAY AGAIN
          </button>
          <button
            onClick={onShowLeaderboard}
            className="flex-1 neo-button bg-card text-foreground flex items-center justify-center gap-2 text-sm py-3 min-h-[44px]"
          >
            <BarChart3 className="w-4 h-4" /> LEADERBOARD
          </button>
        </div>
        <button
          onClick={handleShare}
          className="w-full neo-button bg-secondary text-foreground flex items-center justify-center gap-2 text-sm py-2.5 min-h-[44px]"
        >
          <Copy className="w-3.5 h-3.5" /> SHARE SCORE
        </button>
      </div>
    </div>
  );
}
