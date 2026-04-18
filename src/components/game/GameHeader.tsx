import { GameState } from "@/game/types";
import { cn } from "@/lib/utils";
import {
  Volume2,
  VolumeX,
  Pause,
  History,
  HelpCircle,
  Heart,
  Flame,
  Zap,
  Home,
} from "lucide-react";

interface GameHeaderProps {
  state: GameState;
  muted: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onShowHistory: () => void;
  onShowHelp: () => void;
  onHome: () => void;
}

export function GameHeader({
  state,
  muted,
  onToggleMute,
  onTogglePause,
  onShowHistory,
  onShowHelp,
  onHome,
}: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b-2 border-foreground bg-card gap-2 flex-wrap sm:flex-nowrap">
      {/** Left: title, player name, level */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <h1 className="font-heading font-bold text-base sm:text-lg tracking-tight text-foreground whitespace-nowrap flex items-center gap-2">
          <img src="/favicon.svg" alt="" className="w-5 h-5 sm:w-6 sm:h-6" />
          STACK PANIC
        </h1>
        {state.playerName && (
          <span
            className="text-xs font-mono text-muted-foreground bg-secondary border-2 border-foreground rounded-lg px-2 py-0.5 hidden sm:inline"
            style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
          >
            {state.playerName}
          </span>
        )}
        <span
          className="text-xs font-heading font-bold text-primary-foreground bg-angry-accent border-2 border-foreground rounded-lg px-2 py-0.5"
          style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
        >
          LVL {state.level}
        </span>
      </div>

      {/** Right: HP, score, streak, action buttons */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
        {/** HP hearts  show fewer on mobile to save space */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "w-3.5 h-3.5 sm:w-4 sm:h-4",
                i < state.hp
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground",
              )}
            />
          ))}
        </div>

        {/** Score */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 bg-primary border-2 border-foreground rounded-lg px-2 sm:px-3 py-1"
          style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
        >
          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" />
          <span className="font-heading font-bold text-xs sm:text-sm text-primary-foreground tabular-nums">
            {state.score.toLocaleString()}
          </span>
        </div>

        {/** Streak badge  only shown when streak is active */}
        {state.streak >= 3 && (
          <span
            className="hidden sm:flex items-center gap-1 text-xs font-heading font-bold text-angry-accent bg-angry border-2 border-foreground rounded-lg px-2 py-0.5"
            style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
          >
            <Flame className="w-3.5 h-3.5" /> {state.streak}
          </span>
        )}

        {/** Action buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {[
            { onClick: onHome, icon: Home, title: "Home" },
            { onClick: onShowHistory, icon: History, title: "History" },
            { onClick: onShowHelp, icon: HelpCircle, title: "Help" },
            { onClick: onTogglePause, icon: Pause, title: "Pause (P)" },
          ].map(({ onClick, icon: Icon, title }) => (
            <button
              key={title}
              onClick={onClick}
              className="p-1.5 border-2 border-foreground rounded-lg bg-card hover:bg-secondary transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              title={title}
              style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
            </button>
          ))}
          <button
            onClick={onToggleMute}
            className="p-1.5 border-2 border-foreground rounded-lg bg-card hover:bg-secondary transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Toggle sound"
            style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
