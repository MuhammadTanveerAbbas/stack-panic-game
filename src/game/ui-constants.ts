import { TaskType } from "@/game/types";

export const TASK_LABELS: Record<TaskType, string> = {
  bug: "BUG",
  feature: "FEATURE",
  angry_customer: "ANGRY CUSTOMER",
  investor_ping: "INVESTOR PING",
};

/** Score-based verdict lines shown on the game over screen. */
export const ROAST_LINES = [
  { max: 500, line: "A founder with no runway. Embarrassing." },
  { max: 2000, line: "Decent. Your users deserve better." },
  { max: 5000, line: "Not bad. Victor Chen is mildly impressed." },
  { max: Infinity, line: "Series A unlocked. Go build something real." },
];
