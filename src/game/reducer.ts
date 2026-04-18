import { GameState, GameAction, Task, TaskType } from "./types";
import {
  INITIAL_HP,
  INITIAL_TEAM,
  TASK_TITLES,
  SCORE_VALUES,
  getConfig,
  BASE_RESOLVE_TIME,
} from "./constants";
import { getHighScore, setHighScore } from "./storage";

let taskIdCounter = 0;

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Skews difficulty distribution toward harder tasks at higher levels.
 * Level 1: mostly easy. Level 4+: mostly hard.
 */
const randomDifficulty = (level: number): 1 | 2 | 3 => {
  const roll = Math.random();
  if (level <= 1) return roll < 0.6 ? 1 : roll < 0.9 ? 2 : 3;
  if (level <= 3) return roll < 0.3 ? 1 : roll < 0.7 ? 2 : 3;
  return roll < 0.1 ? 1 : roll < 0.5 ? 2 : 3;
};

/** investor_ping tasks only appear from level 2 onward to ease new players in. */
const randomType = (level: number): TaskType => {
  const types: TaskType[] = ["bug", "feature", "angry_customer"];
  if (level >= 2) types.push("investor_ping");
  return randomItem(types);
};

const createTask = (level: number): Task => {
  const type = randomType(level);
  const difficulty = randomDifficulty(level);
  const config = getConfig(level);
  const baseExpiry =
    config.minExpiry + (3 - difficulty) * 4 + Math.random() * 5;
  return {
    id: `task-${++taskIdCounter}`,
    type,
    title: randomItem(TASK_TITLES[type]),
    difficulty,
    timeToExpire: Math.round(baseExpiry),
    maxTime: Math.round(baseExpiry),
    assignedTo: null,
    resolveProgress: 0,
    resolveTime: BASE_RESOLVE_TIME[difficulty],
  };
};

export const initialState = (): GameState => ({
  level: 1,
  score: 0,
  hp: INITIAL_HP,
  tasks: [],
  team: INITIAL_TEAM.map((t) => ({ ...t, available: true })),
  gameStatus: "idle",
  taskSpawnRate: getConfig(1).spawnRate,
  highScore: getHighScore(),
  streak: 0,
  bestStreak: 0,
  tasksResolved: 0,
  tasksCrashed: 0,
  lastSpawnTime: 0,
  levelStartTime: 0,
  flashRed: false,
  playerName: "",
});

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      taskIdCounter = 0;
      const now = Date.now();
      return {
        ...initialState(),
        gameStatus: "playing",
        highScore: state.highScore,
        lastSpawnTime: now,
        levelStartTime: now,
        playerName: action.playerName || state.playerName,
      };
    }

    case "PAUSE":
      if (state.gameStatus !== "playing") return state;
      return { ...state, gameStatus: "paused" };

    case "RESUME":
      if (state.gameStatus !== "paused") return state;
      return {
        ...state,
        gameStatus: "playing",
        lastSpawnTime: Date.now(),
        levelStartTime: Date.now() - (Date.now() - state.levelStartTime),
      };

    case "LOAD_SAVE":
      return {
        ...action.state,
        gameStatus: "playing",
        lastSpawnTime: Date.now(),
        levelStartTime: Date.now(),
      };

    case "TICK": {
      if (state.gameStatus !== "playing") return state;
      const dt = action.delta / 1000;
      let {
        hp,
        score,
        streak,
        bestStreak,
        tasksResolved,
        tasksCrashed,
        flashRed,
      } = state;
      let tasks = [...state.tasks];
      let team = [...state.team];

      const resolvedIds: string[] = [];
      const crashedIds: string[] = [];
      const hallucinatedIds: string[] = [];

      tasks = tasks.map((task) => {
        const updated = { ...task };
        updated.timeToExpire = Math.max(0, updated.timeToExpire - dt);

        if (updated.assignedTo) {
          const member = team.find((m) => m.id === updated.assignedTo);
          let speed = 1;
          if (member) {
            if (member.id === "ai") {
              speed = 1.5;
            } else if (member.speciality === updated.type) {
              speed = 2;
            }
          }
          updated.resolveProgress = Math.min(
            100,
            updated.resolveProgress + (dt / updated.resolveTime) * 100 * speed,
          );

          if (updated.resolveProgress >= 100) {
            if (member?.id === "ai" && Math.random() < 0.3) {
              hallucinatedIds.push(updated.id);
            } else {
              resolvedIds.push(updated.id);
            }
          }
        }

        if (
          updated.timeToExpire <= 0 &&
          !resolvedIds.includes(updated.id) &&
          !hallucinatedIds.includes(updated.id)
        ) {
          crashedIds.push(updated.id);
        }

        return updated;
      });

      for (const id of resolvedIds) {
        const task = tasks.find((t) => t.id === id)!;
        const member = team.find((m) => m.id === task.assignedTo);
        let points =
          task.difficulty === 1
            ? SCORE_VALUES.easy
            : task.difficulty === 2
              ? SCORE_VALUES.medium
              : SCORE_VALUES.hard;
        if (member && member.speciality === task.type)
          points += SCORE_VALUES.specialistBonus;
        streak++;
        if (streak > bestStreak) bestStreak = streak;
        if (streak % SCORE_VALUES.streakThreshold === 0)
          points += SCORE_VALUES.streakBonus;
        score += points;
        tasksResolved++;
        if (member) {
          team = team.map((m) =>
            m.id === member.id ? { ...m, available: true } : m,
          );
        }
      }

      /** AI hallucination: task respawns with +5s added to its timer. */
      for (const id of hallucinatedIds) {
        const task = tasks.find((t) => t.id === id)!;
        const member = team.find((m) => m.id === task.assignedTo);
        if (member) {
          team = team.map((m) =>
            m.id === member.id ? { ...m, available: true } : m,
          );
        }
        tasks = tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                assignedTo: null,
                resolveProgress: 0,
                timeToExpire: Math.min(t.timeToExpire + 5, t.maxTime),
              }
            : t,
        );
      }

      for (const id of crashedIds) {
        const task = tasks.find((t) => t.id === id)!;
        hp--;
        streak = 0;
        tasksCrashed++;
        if (task.assignedTo) {
          team = team.map((m) =>
            m.id === task.assignedTo ? { ...m, available: true } : m,
          );
        }
        flashRed = true;
      }

      tasks = tasks.filter(
        (t) => !resolvedIds.includes(t.id) && !crashedIds.includes(t.id),
      );

      if (hp <= 0) {
        const highScore = Math.max(score, state.highScore);
        setHighScore(highScore);
        return {
          ...state,
          hp: 0,
          score,
          tasks,
          team,
          streak,
          bestStreak,
          tasksResolved,
          tasksCrashed,
          gameStatus: "gameover",
          highScore,
          flashRed,
        };
      }

      return {
        ...state,
        hp,
        score,
        tasks,
        team,
        streak,
        bestStreak,
        tasksResolved,
        tasksCrashed,
        flashRed,
      };
    }

    case "SPAWN_TASK": {
      if (state.gameStatus !== "playing") return state;
      const config = getConfig(state.level);
      const tasksToSpawn = state.level >= 4 ? 2 : 1;
      let { tasks, hp, flashRed, tasksCrashed, streak } = state;

      for (let i = 0; i < tasksToSpawn; i++) {
        if (tasks.length >= config.maxTasks) {
          hp--;
          tasksCrashed++;
          streak = 0;
          flashRed = true;
          if (hp <= 0) {
            const highScore = Math.max(state.score, state.highScore);
            setHighScore(highScore);
            return {
              ...state,
              hp: 0,
              tasks,
              gameStatus: "gameover",
              highScore,
              flashRed,
              tasksCrashed,
              streak,
            };
          }
        } else {
          // Use provided title (from AI) or generate a random one from static list
          const task = createTask(state.level);
          if (action.title && i === 0) { // Only apply to the first spawned task in a batch
            task.title = action.title;
          }
          tasks = [...tasks, task];
        }
      }

      return {
        ...state,
        tasks,
        hp,
        flashRed,
        tasksCrashed,
        streak,
        lastSpawnTime: Date.now(),
      };
    }

    case "ASSIGN_MEMBER": {
      const { taskId, memberId } = action;
      const task = state.tasks.find((t) => t.id === taskId);
      const member = state.team.find((m) => m.id === memberId);
      if (!task || !member || !member.available || task.assignedTo)
        return state;

      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, assignedTo: memberId } : t,
        ),
        team: state.team.map((m) =>
          m.id === memberId ? { ...m, available: false } : m,
        ),
      };
    }

    case "LEVEL_UP": {
      const newLevel = state.level + 1;
      const config = getConfig(newLevel);
      return {
        ...state,
        level: newLevel,
        taskSpawnRate: config.spawnRate,
        levelStartTime: Date.now(),
      };
    }

    case "CLEAR_FLASH":
      return { ...state, flashRed: false };

    case "GAME_OVER": {
      const highScore = Math.max(state.score, state.highScore);
      setHighScore(highScore);
      return { ...state, gameStatus: "gameover", highScore };
    }

    default:
      return state;
  }
}
