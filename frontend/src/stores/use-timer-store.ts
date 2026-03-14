import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Phase {
  label: string;
  durationMin: number;
}

type TimerStatus = "idle" | "running" | "paused" | "done";

interface TimerState {
  phases: Phase[];
  currentPhaseIndex: number;
  secondsLeft: number;
  status: TimerStatus;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  resetAll: () => void;
  setDuration: (index: number, minutes: number) => void;
  tick: () => void;
  nextPhase: () => void;
}

const DEFAULT_PHASES: Phase[] = [
  { label: "기획", durationMin: 30 },
  { label: "개발", durationMin: 60 },
  { label: "발표준비", durationMin: 30 },
];

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      phases: DEFAULT_PHASES,
      currentPhaseIndex: 0,
      secondsLeft: DEFAULT_PHASES[0].durationMin * 60,
      status: "idle",

      startTimer: () => {
        const { status, secondsLeft, phases, currentPhaseIndex } = get();
        if (status === "done") return;
        if (secondsLeft === 0) {
          // Edge case: if already at 0, don't start
          return;
        }
        if (status === "idle") {
          set({ secondsLeft: phases[currentPhaseIndex].durationMin * 60, status: "running" });
        } else {
          set({ status: "running" });
        }
      },

      pauseTimer: () => {
        set({ status: "paused" });
      },

      resetTimer: () => {
        const { phases, currentPhaseIndex } = get();
        set({
          secondsLeft: phases[currentPhaseIndex].durationMin * 60,
          status: "idle",
        });
      },

      resetAll: () => {
        const { phases } = get();
        set({
          currentPhaseIndex: 0,
          secondsLeft: phases[0].durationMin * 60,
          status: "idle",
        });
      },

      setDuration: (index, minutes) => {
        const { phases, currentPhaseIndex, status } = get();
        const updated = phases.map((p, i) =>
          i === index ? { ...p, durationMin: minutes } : p
        );
        const updates: Partial<TimerState> = { phases: updated };
        // If editing the active phase and timer is idle/paused on that phase, update secondsLeft
        if (index === currentPhaseIndex && status === "idle") {
          updates.secondsLeft = minutes * 60;
        }
        set(updates);
      },

      tick: () => {
        const { secondsLeft, currentPhaseIndex, phases, status } = get();
        if (status !== "running") return;
        if (secondsLeft > 0) {
          set({ secondsLeft: secondsLeft - 1 });
        } else {
          // Move to next phase
          const nextIndex = currentPhaseIndex + 1;
          if (nextIndex < phases.length) {
            set({
              currentPhaseIndex: nextIndex,
              secondsLeft: phases[nextIndex].durationMin * 60,
              status: "running",
            });
          } else {
            set({ status: "done" });
          }
        }
      },

      nextPhase: () => {
        const { currentPhaseIndex, phases } = get();
        const nextIndex = currentPhaseIndex + 1;
        if (nextIndex < phases.length) {
          set({
            currentPhaseIndex: nextIndex,
            secondsLeft: phases[nextIndex].durationMin * 60,
            status: "idle",
          });
        } else {
          set({ status: "done" });
        }
      },
    }),
    {
      name: "zerothon-timer-store",
      partialize: (state) => ({
        phases: state.phases,
      }),
    }
  )
);
