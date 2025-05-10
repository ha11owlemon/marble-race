import { create } from "zustand";

const useGame = create((set, get) => {
  return {
    blocksCount: 10,
    blocksSeed: 0,

    phase: "ready",

    startTime: 0,
    endTime: 0,

    start: () => {
      const phase = get().phase;
      if (phase === "ready") set({ phase: "playing", startTime: Date.now() });
    },
    restart: () => {
      const phase = get().phase;
      if (phase === "ended" || phase === "playing")
        set({
          phase: "ready",
          startTime: 0,
          endTime: 0,
          blocksSeed: Math.random(),
        });
    },
    end: () => {
      const phase = get().phase;
      if (phase === "playing") set({ phase: "ended", endTime: Date.now() });
    },
  };
});
export default useGame;
