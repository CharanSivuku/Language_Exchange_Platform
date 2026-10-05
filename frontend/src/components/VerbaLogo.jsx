const VerbaLogo = ({ size = 38, showText = true, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Aesthetic SVG Emblem with Theme Accents */}
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 rounded-xl bg-primary/15 p-2 border border-primary/30 shadow-md flex items-center justify-center transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="vGradModern" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" className="text-primary" />
              <stop offset="1" stopColor="currentColor" className="text-secondary" />
            </linearGradient>
          </defs>
          <path
            d="M9 12C9 9.79 10.79 8 13 8H19C21.21 8 23 9.79 23 12V16C23 18.21 21.21 20 19 20H13L9 23.5V12Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            className="text-primary"
          />
          <path
            d="M17 17C17 14.79 18.79 13 21 13H27C29.21 13 31 14.79 31 17V21C31 23.21 29.21 25 27 25H24L18 29.5V25C17.45 25 17 24.55 17 24V17Z"
            fill="currentColor"
            fillOpacity="0.35"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            className="text-primary"
          />
          <circle cx="29" cy="10" r="2.5" fill="#22C55E" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-mono text-lg sm:text-xl font-black tracking-widest text-base-content uppercase">
            Verba
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-primary uppercase mt-0.5">
            Real Fluency
          </span>
        </div>
      )}
    </div>
  );
};

export default VerbaLogo;
