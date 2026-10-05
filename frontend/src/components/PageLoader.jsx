import { useEffect, useState } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { SparklesIcon, RefreshCwIcon } from "lucide-react";

const LANGUAGE_TIPS = [
  "Did you know? Speaking with native partners for just 15 minutes builds fluency faster than 2 hours of solo study.",
  "Practice Tip: Don't worry about perfect grammar — communicative confidence is the key to mastering any language.",
  "Verba Tip: Use the in-call icebreaker button during video sessions whenever you want fresh conversation topics!",
  "Fun Fact: Over 7,000 languages are spoken worldwide, and more than half of the world's population is bilingual.",
  "Immersion Secret: Shadowing (repeating sentences immediately after native speakers) rapidly trains pronunciation.",
];

const PageLoader = () => {
  const { theme } = useThemeStore();
  const [seconds, setSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LANGUAGE_TIPS.length);
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, []);

  const getStatusMessage = () => {
    if (seconds < 3) return "Connecting to secure network...";
    if (seconds < 8) return "Waking up cloud server and database...";
    if (seconds < 16) return "Initializing WebSockets & active partner lounges...";
    return "Almost ready! Cloud instances take ~30–45s to wake from sleep...";
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100 text-base-content transition-colors duration-200"
      data-theme={theme}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6 animate-in fade-in duration-300">
        {/* Animated Brand Logo */}
        <div className="relative">
          <div className="size-20 rounded-3xl bg-primary/10 border border-primary/25 flex items-center justify-center shadow-lg shadow-primary/10 animate-pulse">
            <img
              src="/verba-logo.svg"
              alt="Verba"
              className="size-11 drop-shadow-sm hover:scale-105 transition-transform"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-[#22C55E] ring-3 ring-base-100 animate-ping" />
          <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-[#22C55E] ring-3 ring-base-100" />
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-base-content">
            Verba
          </h1>
          <p className="text-sm font-medium text-base-content/80 transition-all duration-300 min-h-[1.5rem]">
            {getStatusMessage()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-base-300 rounded-full overflow-hidden relative">
          <div className="h-full bg-primary rounded-full animate-indeterminate" />
        </div>

        {/* Elapsed Timer indicator if server is taking longer to wake */}
        {seconds >= 6 && (
          <div className="text-xs font-mono text-base-content/50 bg-base-200 px-3 py-1 rounded-full border border-base-300">
            Waking instance: {seconds}s
          </div>
        )}

        {/* Engaging Language Tip Carousel while waiting */}
        <div className="p-4 rounded-2xl bg-base-200/80 border border-base-300 max-w-sm w-full text-left space-y-1.5 shadow-xs transition-all duration-300">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
            <SparklesIcon className="size-3.5" />
            <span>Language Insight</span>
          </div>
          <p className="text-xs text-base-content/75 leading-relaxed italic">
            "{LANGUAGE_TIPS[tipIndex]}"
          </p>
        </div>

        {/* Manual Refresh Option if server sleep took over 35s */}
        {seconds >= 35 && (
          <div className="pt-2 animate-fadeIn">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-sm btn-ghost border border-base-300 text-xs gap-1.5 rounded-xl text-base-content/70 hover:text-base-content"
            >
              <RefreshCwIcon className="size-3" />
              <span>Taking too long? Tap to reload</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
