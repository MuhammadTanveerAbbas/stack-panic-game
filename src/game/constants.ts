import { TeamMember, TaskType } from "./types";

export const INITIAL_HP = 5;
export const TICK_INTERVAL = 100;
export const LEVEL_DURATION = 60;

export const LEVEL_CONFIG: Record<
  number,
  { spawnRate: number; maxTasks: number; minExpiry: number }
> = {
  1: { spawnRate: 8000, maxTasks: 4, minExpiry: 20 },
  2: { spawnRate: 6000, maxTasks: 5, minExpiry: 18 },
  3: { spawnRate: 4000, maxTasks: 6, minExpiry: 15 },
  4: { spawnRate: 3000, maxTasks: 7, minExpiry: 12 },
  5: { spawnRate: 2000, maxTasks: 8, minExpiry: 10 },
};

/** Clamps level to max config entry so levels beyond 5 use the hardest settings. */
export const getConfig = (level: number) =>
  LEVEL_CONFIG[Math.min(level, 5)] ?? LEVEL_CONFIG[5];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: "dev",
    name: "Dev",
    emoji: "👨‍💻",
    available: true,
    speciality: "bug",
    color: "team-dev",
  },
  {
    id: "designer",
    name: "Designer",
    emoji: "🎨",
    available: true,
    speciality: "feature",
    color: "team-designer",
  },
  {
    id: "ai",
    name: "AI Agent",
    emoji: "🤖",
    available: true,
    speciality: "investor_ping",
    color: "team-ai",
  },
];

export const TASK_TITLES: Record<TaskType, string[]> = {
  bug: [
    "TypeError: Cannot read properties of undefined",
    "Production is down in EU region",
    "Payment flow broken on mobile Safari",
    "Login loop after OAuth callback",
    "500 errors spiking in Datadog",
    "CSS grid broke in Firefox update",
    "Memory leak in websocket handler",
    "Race condition in checkout flow",
  ],
  feature: [
    "Customer wants Slack integration by Friday",
    "Can we add dark mode? 47 upvotes",
    "Enterprise client needs SSO or they churn",
    "Founder wants a mobile app in 2 weeks",
    "Add Zapier webhook support ASAP",
    "Analytics dashboard needs real-time charts",
    "Users want CSV export for reports",
    "Add multi-language support before launch",
  ],
  angry_customer: [
    "I'm posting on Twitter if this isn't fixed",
    "We're paying $500/mo for THIS?",
    "Your competitor doesn't have this problem",
    "I want a refund. Now.",
    "CC'ing my lawyer on next email",
    "3rd time reporting this same bug",
    "My boss is asking why we chose you",
    "Cancelling our annual plan tonight",
  ],
  investor_ping: [
    "Quick call tomorrow? Need MRR update",
    "Saw a competitor raise. Are you concerned?",
    "Board deck needs to be ready by Monday",
    "What's your churn rate this quarter?",
    "When are you hitting $10k MRR?",
    "Can you share updated cap table?",
    "Intro to a potential acquirer  interested?",
    "YC demo day prep  you ready?",
  ],
};

export const SCORE_VALUES = {
  easy: 100,
  medium: 200,
  hard: 400,
  specialistBonus: 50,
  streakBonus: 500,
  streakThreshold: 5,
};

export const BASE_RESOLVE_TIME: Record<number, number> = {
  1: 4,
  2: 6,
  3: 9,
};

export const ROAST_LINES = [
  { max: 500, line: "A founder with no runway. Embarrassing." },
  { max: 2000, line: "Decent. Your users deserve better." },
  { max: 5000, line: "Not bad. Victor Chen is mildly impressed." },
  { max: Infinity, line: "Series A unlocked. Go build something real." },
];

export const RANDOM_NAMES = [
  "Bootstrapped Barry",
  "Pivot Pete",
  "Runway Rachel",
  "Churn Charlie",
  "Series-A Sandra",
  "Burnrate Bob",
  "Agile Ahmed",
  "Scrum Sasha",
  "MVP Maria",
  "Hotfix Hassan",
];

export const LEVEL_UP_MESSAGES = [
  "Warming up...",
  "Things are heating up!",
  "It's getting spicy!",
  "Full chaos mode!",
  "You're on fire!",
  "Absolute madness!",
  "How are you alive?!",
  "Legend status!",
  "Beyond mortal limits!",
  "THE STACK IS PANICKING!",
];
