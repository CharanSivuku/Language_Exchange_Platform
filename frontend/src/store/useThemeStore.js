import { create } from "zustand";

const getSavedTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("streamify-theme") || "night";
  }
  return "night";
};

const initialTheme = getSavedTheme();
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-theme", initialTheme);
}

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
}));
