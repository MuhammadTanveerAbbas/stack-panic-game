import { useCallback, useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useGameLoop } from "@/game/useGameLoop";
import { sounds } from "@/game/sounds";
import { TaskCard } from "@/components/game/TaskCard";
import { TeamMemberToken } from "@/components/game/TeamMemberToken";
import { GameHeader } from "@/components/game/GameHeader";
import { GameFooter } from "@/components/game/GameFooter";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { StartScreen } from "@/components/game/StartScreen";
import { PauseOverlay } from "@/components/game/PauseOverlay";
import { HistoryModal } from "@/components/game/HistoryModal";
import { LeaderboardModal } from "@/components/game/LeaderboardModal";
import { HelpModal } from "@/components/game/HelpModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  addHistory,
  addToLeaderboard,
  getMuted,
  setMuted as saveMuted,
  getPlayerName,
} from "@/game/storage";
import { LEVEL_UP_MESSAGES } from "@/game/constants";
import { LayoutGrid, Users, ChevronLeft, ChevronRight } from "lucide-react";

export default function GameBoard() {
  const { state, startGame, loadGame, assignMember, togglePause } =
    useGameLoop();
  const [muted, setMuted] = useState(getMuted);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  /** On mobile the team sidebar is hidden by default and toggled via a button. */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const prevLevelRef = useRef(state.level);
  const prevTaskCountRef = useRef(0);
  const prevResolvedRef = useRef(0);
  const prevCrashedRef = useRef(0);
  const gameOverHandled = useRef(false);

  /** Require 5px movement before a drag starts to avoid accidental drags on touch. */
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space" || e.code === "KeyP") {
        e.preventDefault();
        if (state.gameStatus === "playing" || state.gameStatus === "paused")
          togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.gameStatus, togglePause]);

  useEffect(() => {
    if (muted || state.gameStatus !== "playing") return;
    if (state.level > prevLevelRef.current) {
      sounds.levelUp();
      const msg =
        LEVEL_UP_MESSAGES[
          Math.min(state.level - 2, LEVEL_UP_MESSAGES.length - 1)
        ];
      toast(`LEVEL ${state.level} UNLOCKED`, { description: msg });
    }
    prevLevelRef.current = state.level;
  }, [state.level, muted, state.gameStatus]);

  useEffect(() => {
    if (muted || state.gameStatus !== "playing") return;
    if (state.tasks.length > prevTaskCountRef.current) sounds.spawn();
    prevTaskCountRef.current = state.tasks.length;
  }, [state.tasks.length, muted, state.gameStatus]);

  useEffect(() => {
    if (muted || state.gameStatus !== "playing") return;
    if (state.tasksResolved > prevResolvedRef.current) sounds.resolve();
    prevResolvedRef.current = state.tasksResolved;
  }, [state.tasksResolved, muted, state.gameStatus]);

  useEffect(() => {
    if (muted || state.gameStatus !== "playing") return;
    if (state.tasksCrashed > prevCrashedRef.current) sounds.crash();
    prevCrashedRef.current = state.tasksCrashed;
  }, [state.tasksCrashed, muted, state.gameStatus]);

  useEffect(() => {
    if (state.gameStatus === "gameover" && !muted) sounds.gameOver();
  }, [state.gameStatus, muted]);

  useEffect(() => {
    if (state.gameStatus === "gameover" && !gameOverHandled.current) {
      gameOverHandled.current = true;
      addHistory({
        playerName: state.playerName || "Anonymous",
        score: state.score,
        level: state.level,
        resolved: state.tasksResolved,
        crashed: state.tasksCrashed,
        date: new Date().toISOString(),
        outcome: state.level >= 5 ? "survived" : "crashed",
      });
      addToLeaderboard({
        name: state.playerName || "Anonymous",
        score: state.score,
        level: state.level,
        date: new Date().toISOString(),
      });
    }
    if (state.gameStatus !== "gameover") gameOverHandled.current = false;
  }, [
    state.gameStatus,
    state.score,
    state.level,
    state.tasksResolved,
    state.tasksCrashed,
    state.playerName,
  ]);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      saveMuted(!prev);
      return !prev;
    });
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active) assignMember(over.id as string, active.id as string);
      setSidebarOpen(false);
    },
    [assignMember],
  );

  const handleRestart = useCallback(() => {
    const name = getPlayerName() || state.playerName;
    startGame(name);
  }, [startGame, state.playerName]);

  const handleQuit = useCallback(() => {
    window.location.reload();
  }, []);

  const handleHome = useCallback(() => {
    window.location.reload();
  }, []);

  if (state.gameStatus === "idle") {
    return (
      <StartScreen
        highScore={state.highScore}
        onStart={startGame}
        onLoadSave={loadGame}
      />
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        className={cn(
          "min-h-screen flex flex-col",
          state.flashRed && "animate-flash-red",
        )}
      >
        <GameHeader
          state={state}
          muted={muted}
          onToggleMute={handleToggleMute}
          onTogglePause={togglePause}
          onShowHistory={() => setShowHistory(true)}
          onShowHelp={() => setShowHelp(true)}
          onHome={handleHome}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/** Mobile sidebar overlay backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-background/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/**
           * Team sidebar  fixed width on md+, slides in as a drawer on mobile.
           * z-40 ensures it sits above the task board but below modals (z-50).
           */}
          <aside
            className={cn(
              "border-r-2 border-foreground bg-card flex flex-col gap-3 transition-transform duration-200",
              "fixed md:relative inset-y-0 left-0 z-40 md:z-auto",
              "w-64 md:w-52 lg:w-56",
              "p-4 pt-16 md:pt-4",
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0",
            )}
          >
            <h2 className="font-heading font-bold text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Your Team
            </h2>
            {state.team.map((member) => (
              <TeamMemberToken key={member.id} member={member} />
            ))}
            <div className="mt-auto pt-4 border-t-2 border-foreground/20">
              <p className="text-[11px] text-muted-foreground leading-relaxed font-body">
                Match specialists to task types for{" "}
                <span className="font-bold text-primary">2x speed</span> + bonus
                pts
              </p>
            </div>
          </aside>

          {/** Mobile toggle button  opens/closes the team sidebar drawer */}
          <button
            className="md:hidden fixed bottom-16 left-3 z-50 neo-button bg-primary text-primary-foreground p-2.5 flex items-center gap-1.5 text-xs"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle team sidebar"
          >
            <Users className="w-4 h-4" />
            {sidebarOpen ? (
              <ChevronLeft className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>

          {/** Task board  scrollable area for all active task cards */}
          <main className="flex-1 p-3 sm:p-4 md:p-5 overflow-y-auto">
            {state.tasks.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                <div className="neo-card px-4 sm:px-6 py-4 flex items-center gap-3 font-body text-center">
                  <LayoutGrid className="w-5 h-5 text-primary shrink-0" />
                  No active incidents enjoy the calm!
                </div>
              </div>
            ) : (
              <div
                className="grid gap-3 sm:gap-4"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
                  gridAutoRows: "min-content",
                }}
              >
                {state.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </main>

          {state.gameStatus === "paused" && (
            <PauseOverlay onResume={togglePause} onQuit={handleQuit} onHome={handleHome} />
          )}
        </div>

        <GameFooter state={state} />

        {state.gameStatus === "gameover" && (
          <GameOverScreen
            state={state}
            onRestart={handleRestart}
            onShowLeaderboard={() => setShowLeaderboard(true)}
          />
        )}

        {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
        {showLeaderboard && (
          <LeaderboardModal
            onClose={() => setShowLeaderboard(false)}
            currentPlayerName={state.playerName}
          />
        )}
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </div>
    </DndContext>
  );
}
