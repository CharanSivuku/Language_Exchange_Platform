import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  isCollapsed: localStorage.getItem("streamify_sidebar_collapsed") === "true",
  mobileOpen: false,

  toggleSidebar: () => {
    set((state) => {
      const next = !state.isCollapsed;
      localStorage.setItem("streamify_sidebar_collapsed", String(next));
      return { isCollapsed: next };
    });
  },

  setCollapsed: (collapsed) => {
    localStorage.setItem("streamify_sidebar_collapsed", String(collapsed));
    set({ isCollapsed: collapsed });
  },

  toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));
