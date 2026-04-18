import { Play, X, Home } from "lucide-react";

interface PauseOverlayProps {
  onResume: () => void;
  onQuit: () => void;
  onHome: () => void;
}

export function PauseOverlay({ onResume, onQuit, onHome }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 px-4">
      <div className="text-center animate-bounce-in">
        <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-6">
          PAUSED
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
          <button
            onClick={onResume}
            className="neo-button bg-primary text-primary-foreground flex items-center gap-2 text-sm px-6 sm:px-8 py-3 min-h-[44px]"
          >
            <Play className="w-4 h-4" /> RESUME
          </button>
          <button
            onClick={onHome}
            className="neo-button bg-card text-foreground flex items-center gap-2 text-sm px-6 sm:px-8 py-3 min-h-[44px]"
          >
            <Home className="w-4 h-4" /> HOME
          </button>
          <button
            onClick={onQuit}
            className="neo-button bg-secondary text-foreground flex items-center gap-2 text-sm px-4 py-3 min-h-[44px]"
          >
            <X className="w-4 h-4" /> QUIT
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-4 font-body">
          Press P or Space to resume
        </p>
      </div>
    </div>
  );
}
