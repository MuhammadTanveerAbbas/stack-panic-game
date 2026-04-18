import { GameState, GameRecord, LeaderboardEntry } from "./types";
import { getCookie, setCookie } from "@/lib/cookies";

const SAVE_KEY = "sp_save";
const HISTORY_KEY = "sp_history";
const LEADERBOARD_KEY = "sp_leaderboard";
const STORAGE_VERSION = "1.0.0";

/** Cookie keys  stored with 365-day expiry so preferences survive browser restarts. */
const COOKIE_PLAYER_NAME = "sp_player_name";
const COOKIE_MUTED = "sp_muted";
const COOKIE_HIGH_SCORE = "sp_highscore";

let lastSaveTime = 0;

/** Persists game state to localStorage, debounced to at most once per second. */
export function saveGame(state: GameState): void {
  const now = Date.now();
  if (now - lastSaveTime < 1000) return;
  lastSaveTime = now;
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, savedAt: now, version: STORAGE_VERSION }));
}

export function hasSave(): boolean {
  return !!localStorage.getItem(SAVE_KEY);
}

export function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== STORAGE_VERSION) {
      console.warn("Storage version mismatch, clearing stale save.");
      localStorage.removeItem(SAVE_KEY);
      return null;
    }
    return data as GameState;
  } catch {
    return null;
  }
}

export function getSaveInfo(): { level: number; score: number } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return { level: data.level, score: data.score };
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

/** Returns the last 10 match records, most recent first. */
export function getHistory(): GameRecord[] {
  try {
    return JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]",
    ) as GameRecord[];
  } catch {
    return [];
  }
}

export function addHistory(record: GameRecord): void {
  const history = getHistory();
  history.unshift(record);
  if (history.length > 10) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    return JSON.parse(
      localStorage.getItem(LEADERBOARD_KEY) || "[]",
    ) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

/** Adds an entry to the top-10 leaderboard sorted by score descending. Returns true if the entry made the board. */
export function addToLeaderboard(entry: LeaderboardEntry): boolean {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const trimmed = board.slice(0, 10);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  return trimmed.some(
    (e) =>
      e.score === entry.score && e.name === entry.name && e.date === entry.date,
  );
}

export function isLeaderboardWorthy(score: number): boolean {
  const board = getLeaderboard();
  if (board.length < 10) return score > 0;
  return score > board[board.length - 1].score;
}

/** Player name is stored in a cookie so it persists across sessions without auth. */
export function getPlayerName(): string {
  return getCookie(COOKIE_PLAYER_NAME) || "";
}

export function setPlayerName(name: string): void {
  setCookie(COOKIE_PLAYER_NAME, name, 365);
}

/** Mute preference stored in a cookie  survives page refresh. */
export function getMuted(): boolean {
  return getCookie(COOKIE_MUTED) === "true";
}

export function setMuted(muted: boolean): void {
  setCookie(COOKIE_MUTED, muted ? "true" : "false", 365);
}

/** High score stored in a cookie so it persists even if localStorage is cleared. */
export function getHighScore(): number {
  return parseInt(getCookie(COOKIE_HIGH_SCORE) || "0", 10);
}

export function setHighScore(score: number): void {
  setCookie(COOKIE_HIGH_SCORE, score.toString(), 365);
}
