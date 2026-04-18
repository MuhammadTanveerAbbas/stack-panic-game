import { GameState } from "@/game/types";
import { LEVEL_DURATION, getConfig } from "@/game/constants";
import { Timer, CheckCircle2, XCircle, LayoutGrid, Flame } from "lucide-react";

interface GameFooterProps {
  state: GameState;
}

export function GameFooter({ state }: GameFooterProps) {
  const elapsed = (Date.now() - state.levelStartTime) / 1000;
  const remaining = Math.max(0, LEVEL_DURATION - elapsed);
  const progress = ((LEVEL_DURATION - remaining) / LEVEL_DURATION) * 100;
  const config = getConfig(state.level);

  return (
    <footer className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 border-t-2 border-foreground bg-card text-xs font-body flex-wrap gap-y-1">
      <div className="flex items-center gap-2 sm:gap-4 text-muted-foreground">
        <span className="flex items-center gap-1 sm:gap-1.5 font-mono font-bold whitespace-nowrap">
          <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">LEVEL UP IN: </span>
          {Math.ceil(remaining)}s
        </span>
        <div
          className="w-20 sm:w-28 h-2 sm:h-2.5 bg-secondary rounded-full overflow-hidden border-2 border-foreground"
          style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 font-mono font-bold">
        <span className="flex items-center gap-1 text-muted-foreground">
          <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{" "}
          {state.tasks.length}/{config.maxTasks}
        </span>
        <span className="flex items-center gap-1 text-primary">
          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{" "}
          {state.tasksResolved}
        </span>
        <span className="flex items-center gap-1 text-destructive">
          <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {state.tasksCrashed}
        </span>
        {state.streak >= 3 && (
          <span className="flex items-center gap-1 text-angry-accent">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {state.streak}
          </span>
        )}
      </div>
    </footer>
  );
}
