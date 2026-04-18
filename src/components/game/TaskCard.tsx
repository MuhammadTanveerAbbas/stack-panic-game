import { Task } from "@/game/types";
import { TASK_LABELS } from "@/game/ui-constants";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
  Bug,
  Sparkles,
  PhoneCall,
  TrendingUp,
  ArrowDown,
  Check,
  Loader2,
} from "lucide-react";

const TASK_ICONS = {
  bug: Bug,
  feature: Sparkles,
  angry_customer: PhoneCall,
  investor_ping: TrendingUp,
};

const cardBgMap = {
  bug: "bg-bug",
  feature: "bg-feature",
  angry_customer: "bg-angry",
  investor_ping: "bg-investor",
};

const accentBorderMap = {
  bug: "border-l-bug-accent",
  feature: "border-l-feature-accent",
  angry_customer: "border-l-angry-accent",
  investor_ping: "border-l-investor-accent",
};

const accentTextMap = {
  bug: "text-bug-accent",
  feature: "text-feature-accent",
  angry_customer: "text-angry-accent",
  investor_ping: "text-investor-accent",
};

const accentBgMap = {
  bug: "bg-bug-accent",
  feature: "bg-feature-accent",
  angry_customer: "bg-angry-accent",
  investor_ping: "bg-investor-accent",
};

const badgeBgMap = {
  bug: "bg-bug-accent/15",
  feature: "bg-feature-accent/15",
  angry_customer: "bg-angry-accent/15",
  investor_ping: "bg-investor-accent/15",
};

export function TaskCard({ task }: { task: Task }) {
  const { setNodeRef, isOver } = useDroppable({ id: task.id });
  const timePercent = (task.timeToExpire / task.maxTime) * 100;
  const isUrgent = task.timeToExpire < 5;
  const isCritical = task.timeToExpire < 3;
  const Icon = TASK_ICONS[task.type];

  /** Timer bar color shifts from green → orange → red as time runs out. */
  const timerColor =
    timePercent > 60
      ? "bg-primary"
      : timePercent > 30
        ? "bg-angry-accent"
        : "bg-destructive";

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-2 border-foreground border-l-4 rounded-xl p-3 sm:p-4 transition-all duration-200 animate-slide-in-right group/card",
        cardBgMap[task.type],
        accentBorderMap[task.type],
        !task.assignedTo &&
          "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_hsl(0_0%_10%)]",
        isOver && "ring-2 ring-primary translate-x-[-2px] translate-y-[-2px]",
        isUrgent && !isCritical && "animate-card-pulse-red",
        isCritical && "animate-card-shake",
      )}
      style={{
        boxShadow: isOver
          ? "6px 6px 0px hsl(0 0% 10%)"
          : "4px 4px 0px hsl(0 0% 10%)",
      }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded-md transition-transform duration-200 group-hover/card:scale-105",
            accentTextMap[task.type],
            badgeBgMap[task.type],
          )}
        >
          <Icon
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/card:rotate-12"
            strokeWidth={2.5}
          />
          {TASK_LABELS[task.type]}
        </span>
        <span
          className={cn(
            "text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md border",
            task.timeToExpire < 5
              ? "text-destructive bg-destructive/10 border-destructive"
              : "text-muted-foreground bg-secondary border-foreground/20",
          )}
        >
          {Math.ceil(task.timeToExpire)}s
        </span>
      </div>

      <p className="font-mono text-sm leading-snug mb-2 sm:mb-3 text-foreground font-medium transition-colors duration-200 group-hover/card:text-foreground/80">
        "{task.title}"
      </p>

      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="text-[11px] text-muted-foreground font-body font-medium uppercase tracking-wide">
          Difficulty
        </span>
        <div className="flex gap-1">
          {[1, 2, 3].map((d) => (
            <span
              key={d}
              className={cn(
                "w-2.5 h-2.5 rounded-full border border-foreground/30",
                d <= task.difficulty ? accentBgMap[task.type] : "bg-secondary",
              )}
            />
          ))}
        </div>
      </div>

      {task.assignedTo ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono font-bold">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            Resolving...
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-foreground/20">
            <div
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{ width: `${task.resolveProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl py-2 sm:py-2.5 text-center text-xs font-mono font-bold transition-all",
            isOver
              ? "border-primary text-primary bg-primary/10"
              : "border-foreground/25 text-muted-foreground",
          )}
        >
          {isOver ? (
            <span className="flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> DROP HERE
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <ArrowDown className="w-3.5 h-3.5" /> Drop team member
            </span>
          )}
        </div>
      )}

      <div className="w-full h-2 bg-secondary rounded-full mt-2 sm:mt-3 overflow-hidden border border-foreground/20">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-200",
            timerColor,
          )}
          style={{ width: `${timePercent}%` }}
        />
      </div>
    </div>
  );
}
