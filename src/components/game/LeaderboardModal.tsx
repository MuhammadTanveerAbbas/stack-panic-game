import { getLeaderboard } from "@/game/storage";
import { X, Trophy } from "lucide-react";

interface LeaderboardModalProps {
  onClose: () => void;
  currentPlayerName?: string;
}

export function LeaderboardModal({
  onClose,
  currentPlayerName,
}: LeaderboardModalProps) {
  const board = getLeaderboard();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4">
      <div className="neo-card p-5 sm:p-6 max-w-md w-full animate-bounce-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 uppercase tracking-wide">
            <Trophy className="w-5 h-5 text-angry-accent" /> Top Scores
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-foreground rounded-lg hover:bg-secondary min-w-[36px] min-h-[36px] flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {board.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 font-body">
            No scores yet. Be the first!
          </p>
        ) : (
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-muted-foreground border-b-2 border-foreground">
                  <th className="text-left py-2 pr-2">#</th>
                  <th className="text-left py-2 px-2">NAME</th>
                  <th className="text-right py-2 px-2">SCORE</th>
                  <th className="text-right py-2 pl-2">LEVEL</th>
                </tr>
              </thead>
              <tbody>
                {board.map((entry, i) => (
                  <tr
                    key={i}
                    className={`border-b border-foreground/20 ${
                      entry.name === currentPlayerName
                        ? "text-primary font-bold"
                        : ""
                    }`}
                  >
                    <td className="py-2.5 pr-2 text-muted-foreground font-bold">
                      {i + 1}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-foreground">
                      {entry.name}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="py-2.5 pl-2 text-right">{entry.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
