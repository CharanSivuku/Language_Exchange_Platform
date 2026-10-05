import { CheckIcon, PaletteIcon, SparklesIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES, FEATURED_THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button
        tabIndex={0}
        className="p-2 text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-xl transition-all duration-200 border border-transparent hover:border-base-300 shadow-xs flex items-center gap-1.5"
        title="Change theme & vibes"
        aria-label="Theme settings"
      >
        <PaletteIcon className="size-4 text-primary" />
        <span className="hidden sm:inline text-xs font-semibold capitalize opacity-80">
          {theme}
        </span>
      </button>

      {/* DROPDOWN MENU */}
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-3 shadow-2xl bg-base-200 text-base-content rounded-3xl w-72 sm:w-80 border border-base-300 max-h-96 overflow-y-auto z-50 space-y-3"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between pb-2 border-b border-base-300">
          <div className="flex items-center gap-1.5">
            <PaletteIcon className="size-4 text-primary" />
            <p className="text-xs font-black uppercase tracking-wider text-base-content">
              Theme Palette
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/20">
            Active: {theme}
          </span>
        </div>

        {/* 1. FEATURED AESTHETIC VIBES SECTION */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1">
              <SparklesIcon className="size-3" />
              <span>Aesthetic Vibe Picks</span>
            </p>
            <span className="text-[10px] text-base-content/50 font-bold">Featured</span>
          </div>

          <div className="space-y-1">
            {FEATURED_THEMES.map((themeOption) => {
              const isActive = theme === themeOption.name;
              return (
                <button
                  key={themeOption.name}
                  className={`w-full px-2.5 py-2 rounded-2xl flex items-center justify-between text-xs font-semibold transition-all duration-150 border ${
                    isActive
                      ? "bg-primary text-primary-content border-primary font-bold shadow-md shadow-primary/25 scale-[1.01]"
                      : themeOption.special
                      ? "bg-base-100 text-base-content border-primary/30 hover:border-primary hover:bg-base-300"
                      : "bg-base-100/70 text-base-content/85 border-base-300 hover:text-base-content hover:bg-base-100"
                  }`}
                  onClick={() => setTheme(themeOption.name)}
                >
                  <div className="flex items-center gap-2 text-left truncate">
                    {isActive ? (
                      <CheckIcon className="size-3.5 shrink-0 stroke-[3]" />
                    ) : (
                      <span className="size-3.5 shrink-0 opacity-20">•</span>
                    )}
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{themeOption.label}</span>
                        {themeOption.special && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-warning/20 text-warning font-mono font-bold shrink-0">
                            FONT
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate ${isActive ? "text-primary-content/80" : "text-base-content/50"}`}>
                        {themeOption.vibe}
                      </p>
                    </div>
                  </div>

                  {/* COLOR SWATCHES */}
                  <div className="flex items-center gap-1 bg-black/15 p-1 rounded-full shrink-0 ml-2">
                    {themeOption.colors.map((color, i) => (
                      <span
                        key={i}
                        className="size-2 rounded-full border border-black/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. ALL THEMES ACCORDION / LIST */}
        <div className="space-y-1.5 pt-2 border-t border-base-300">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/60">
              All Themes ({THEMES.length})
            </p>
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
            {THEMES.map((themeOption) => {
              const isActive = theme === themeOption.name;
              return (
                <button
                  key={themeOption.name}
                  className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs font-medium transition-all duration-120 ${
                    isActive
                      ? "bg-primary text-primary-content font-bold shadow-xs"
                      : "text-base-content/75 hover:text-base-content hover:bg-base-300"
                  }`}
                  onClick={() => setTheme(themeOption.name)}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isActive ? (
                      <CheckIcon className="size-3 shrink-0 stroke-[3]" />
                    ) : (
                      <span className="size-3 shrink-0" />
                    )}
                    <span className="truncate">{themeOption.label}</span>
                  </div>

                  {/* COLOR SWATCHES */}
                  <div className="flex items-center gap-0.5 bg-black/10 p-0.5 rounded-full shrink-0">
                    {themeOption.colors.map((color, i) => (
                      <span
                        key={i}
                        className="size-2 rounded-full border border-black/15"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* HELPFUL FOOTER HINT */}
        <div className="p-2 rounded-xl bg-base-100 text-[10px] text-base-content/60 border border-base-300 flex items-center gap-1.5">
          <span className="text-primary font-bold">💡 Tip:</span>
          <span>Wireframe switches typography to sketch & monospace style across the app.</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
