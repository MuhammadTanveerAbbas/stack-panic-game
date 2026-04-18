import { X, Keyboard } from "lucide-react";

export function HelpModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: "1", action: "Select Dev" },
    { key: "2", action: "Select Designer" },
    { key: "3", action: "Select AI Agent" },
    { key: "P / Space", action: "Pause / Resume" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4">
      <div className="neo-card p-5 sm:p-6 max-w-sm w-full animate-bounce-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-sm text-foreground flex items-center gap-2 uppercase tracking-wide">
            <Keyboard className="w-4 h-4" /> Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-foreground rounded-lg hover:bg-secondary min-w-[36px] min-h-[36px] flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between text-sm py-1.5 font-body"
            >
              <span
                className="bg-secondary text-foreground px-2.5 py-1 rounded-lg font-mono font-bold text-xs border-2 border-foreground"
                style={{ boxShadow: "2px 2px 0px hsl(0 0% 10%)" }}
              >
                {s.key}
              </span>
              <span className="text-muted-foreground">{s.action}</span>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-foreground/20 mt-4 pt-4 space-y-2 text-xs text-muted-foreground font-body">
          <p>• Match specialists to task types for 2x speed + bonus pts</p>
          <p>
            • AI Agent resolves 1.5x faster but has 30% hallucination chance
          </p>
          <p>• Every 5 tasks in a row = +500 streak bonus</p>
          <p>• Board overflow = instant -1 HP</p>
        </div>
      </div>
    </div>
  );
}
