import { useReducer, useEffect, useRef, useCallback } from "react";
import { gameReducer, initialState } from "./reducer";
import { getConfig, LEVEL_DURATION, TICK_INTERVAL } from "./constants";
import { saveGame, clearSave } from "./storage";
import { GameState, TaskType } from "./types";
import { generateTaskTitle } from "@/lib/groq";

export function useGameLoop() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialState);
  const lastTickRef = useRef(Date.now());
  const lastSpawnRef = useRef(Date.now());

  /** Core game loop  runs every TICK_INTERVAL ms while the game is active. */
  useEffect(() => {
    if (state.gameStatus !== "playing") return;

    const interval = setInterval(async () => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      dispatch({ type: "TICK", delta });

      const config = getConfig(state.level);
      if (now - lastSpawnRef.current >= config.spawnRate) {
        lastSpawnRef.current = now;
        
        // Attempt AI generation
        const types: TaskType[] = ["bug", "feature", "angry_customer"];
        if (state.level >= 2) types.push("investor_ping");
        const nextType = types[Math.floor(Math.random() * types.length)];
        
        const aiTitle = await generateTaskTitle(nextType);
        dispatch({ type: "SPAWN_TASK", title: aiTitle || undefined });
      }

      const elapsed = (now - state.levelStartTime) / 1000;
      if (elapsed >= LEVEL_DURATION && state.level < 10) {
        dispatch({ type: "LEVEL_UP" });
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [state.gameStatus, state.level, state.levelStartTime]);

  /** Auto-save every 10 seconds so players can resume after closing the tab. */
  useEffect(() => {
    if (state.gameStatus !== "playing") return;
    const interval = setInterval(() => {
      saveGame(state);
    }, 10000);
    return () => clearInterval(interval);
  }, [state.gameStatus, state]);

  useEffect(() => {
    if (state.gameStatus === "gameover") {
      clearSave();
    }
  }, [state.gameStatus]);

  /** Clears the red flash overlay after 300ms. */
  useEffect(() => {
    if (!state.flashRed) return;
    const timer = setTimeout(() => dispatch({ type: "CLEAR_FLASH" }), 300);
    return () => clearTimeout(timer);
  }, [state.flashRed]);

  const startGame = useCallback((playerName?: string) => {
    lastTickRef.current = Date.now();
    lastSpawnRef.current = Date.now();
    dispatch({ type: "START_GAME", playerName });
    setTimeout(async () => {
      const aiTitle = await generateTaskTitle("bug");
      dispatch({ type: "SPAWN_TASK", title: aiTitle || undefined });
    }, 500);
  }, []);

  const loadGame = useCallback((savedState: GameState) => {
    lastTickRef.current = Date.now();
    lastSpawnRef.current = Date.now();
    dispatch({ type: "LOAD_SAVE", state: savedState });
  }, []);

  const assignMember = useCallback((taskId: string, memberId: string) => {
    dispatch({ type: "ASSIGN_MEMBER", taskId, memberId });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: state.gameStatus === "paused" ? "RESUME" : "PAUSE" });
  }, [state.gameStatus]);

  return { state, startGame, loadGame, assignMember, togglePause };
}
