export type TaskType = 'bug' | 'feature' | 'angry_customer' | 'investor_ping';

export type Task = {
  id: string;
  type: TaskType;
  title: string;
  difficulty: 1 | 2 | 3;
  timeToExpire: number;
  maxTime: number;
  assignedTo: string | null;
  resolveProgress: number;
  resolveTime: number;
};

export type TeamMember = {
  id: string;
  name: 'Dev' | 'Designer' | 'AI Agent';
  emoji: string;
  available: boolean;
  speciality: TaskType;
  color: string;
};

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export type GameState = {
  level: number;
  score: number;
  hp: number;
  tasks: Task[];
  team: TeamMember[];
  gameStatus: GameStatus;
  taskSpawnRate: number;
  highScore: number;
  streak: number;
  bestStreak: number;
  tasksResolved: number;
  tasksCrashed: number;
  lastSpawnTime: number;
  levelStartTime: number;
  flashRed: boolean;
  playerName: string;
};

export type GameRecord = {
  playerName: string;
  score: number;
  level: number;
  resolved: number;
  crashed: number;
  date: string;
  outcome: 'survived' | 'crashed';
};

export type LeaderboardEntry = {
  name: string;
  score: number;
  level: number;
  date: string;
};

export type GameAction =
  | { type: 'START_GAME'; playerName?: string }
  | { type: 'TICK'; delta: number }
  | { type: 'SPAWN_TASK'; title?: string }
  | { type: 'ASSIGN_MEMBER'; taskId: string; memberId: string }
  | { type: 'GAME_OVER' }
  | { type: 'CLEAR_FLASH' }
  | { type: 'LEVEL_UP' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'LOAD_SAVE'; state: GameState };
