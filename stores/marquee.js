// store/useMarqueeStateStore.js
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useMarqueeStateStore = create(
  devtools(
    (set) => ({
      hasMarquee: false,
      setHasMarquee: (value) => set({ hasMarquee: value }),
    }),
    { name: "MarqueeStore" }
  )
);

export default useMarqueeStateStore;
