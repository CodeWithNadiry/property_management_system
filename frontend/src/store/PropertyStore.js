import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePropertyStore = create(
  persist(
    (set) => ({
      activeProperty: null,

      setActiveProperty: (property) => {
        set({ activeProperty: property });
      },

      clearProperty: () => {
        set({ activeProperty: null });
      },
    }),
    { name: "property-storage" },
  ),
);

export default usePropertyStore;
