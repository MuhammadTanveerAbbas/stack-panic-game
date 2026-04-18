import { getHistory } from "@/game/storage";
import { X, CheckCircle2, XCircle } from "lucide-react";

export function HistoryModal({ onClose }: { onClose: () => void }) {
  const history = getHistory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4">
      <div className="neo-card p-5 sm:p-6 max-w-lg w-full animate-bounce-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="font-heading font-bold text-sm text-foreground uppercase tracking-wide">
            Match History
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-foreground rounded-lg hover:bg-secondary min-w-[36px] min-h-[36px] flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 font-body">
            No matches yet. Go play!
          </p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-xs font-mono min-w-[360px]">
              <thead>
                <tr className="text-muted-foreground border-b-2 border-foreground">
                  <th className="text-left py-2 pr-3">DATE</th>
                  <th className="text-right py-2 px-3">SCORE</th>
                  <th className="text-right py-2 px-3">LVL</th>
                  <th className="text-right py-2 px-3">RESOLVED</th>
                  <th className="text-right py-2 pl-3">OUTCOME</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, i) => (
                  <tr key={i} className="border-b border-foreground/20">
                    <td className="py-2.5 pr-3 text-muted-foreground">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground">
                      {record.score.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-foreground">
                      {record.level}
                    </td>
                    <td className="py-2.5 px-3 text-right text-foreground">
                      {record.resolved}
                    </td>
                    <td
                      className={`py-2.5 pl-3 text-right font-bold flex items-center justify-end gap-1 ${
                        record.outcome === "survived"
                          ? "text-primary"
                          : "text-destructive"
                      }`}
                    >
                      {record.outcome === "survived" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> SURVIVED
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> CRASHED
                        </>
                      )}
                    </td>
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
