import { TeamMember } from "@/game/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Code2, Palette, Bot, AlertTriangle } from "lucide-react";

const MEMBER_ICONS: Record<string, typeof Code2> = {
  dev: Code2,
  designer: Palette,
  ai: Bot,
};

const pillColorMap: Record<string, string> = {
  "team-dev": "bg-team-dev",
  "team-designer": "bg-team-designer",
  "team-ai": "bg-team-ai",
};

/** Maps each member's speciality to a short display label shown on the token. */
const SPECIALITY_LABELS: Record<string, string> = {
  bug: "BUGS",
  feature: "FEATURES",
  angry_customer: "CUSTOMERS",
  investor_ping: "ALL",
};

export function TeamMemberToken({ member }: { member: TeamMember }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: member.id,
      disabled: !member.available,
    });

  const Icon = MEMBER_ICONS[member.id] || Bot;

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "border-2 border-foreground rounded-xl p-3 transition-all select-none",
        "group/token",
        member.available
          ? "cursor-grab active:cursor-grabbing bg-card hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_hsl(0_0%_10%)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_hsl(0_0%_10%)]"
          : "opacity-50 cursor-not-allowed bg-muted",
        isDragging && "opacity-80 rotate-2 scale-105",
      )}
      style={{
        ...style,
        boxShadow: isDragging
          ? "6px 6px 0px hsl(0 0% 10%)"
          : member.available
            ? "3px 3px 0px hsl(0 0% 10%)"
            : "2px 2px 0px hsl(0 0% 10% / 0.3)",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center border-2 border-foreground transition-transform duration-200 group-hover/token:scale-110",
            pillColorMap[member.color],
          )}
        >
          <Icon
            className="w-4 h-4 text-primary-foreground transition-transform duration-200 group-hover/token:rotate-[-8deg]"
            strokeWidth={2.5}
          />
        </div>
        <span className="font-heading font-bold text-sm text-foreground transition-colors duration-200 group-hover/token:text-primary">
          {member.name}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary border border-foreground/20 rounded px-1.5 py-0.5">
          {SPECIALITY_LABELS[member.speciality]}
        </span>
        <span
          className={cn(
            "text-[10px] font-mono font-bold flex items-center gap-1 px-1.5 py-0.5 rounded",
            member.available
              ? "text-primary bg-primary/10"
              : "text-muted-foreground bg-muted",
          )}
        >
          {member.available ? "● READY" : "◌ BUSY"}
        </span>
      </div>

      {/** AI hallucination warning  shown only when the AI agent is available */}
      {member.id === "ai" && member.available && (
        <div className="flex items-center gap-1 mt-2 text-[9px] font-mono font-bold text-angry-accent bg-angry border border-angry-accent/30 rounded-lg px-2 py-1">
          <AlertTriangle className="w-3 h-3" /> 30% HALLUCINATION RISK
        </div>
      )}
    </div>
  );
}
